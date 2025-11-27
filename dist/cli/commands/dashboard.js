#!/usr/bin/env node
// @ts-nocheck
/**
 * Loaded Vibes Retro Dashboard
 *
 * Synthwave-themed CLI dashboard with DevCycle queue, live logs,
 * metrics, TODO/CHANGELOG feeds, notifications, and command palette.
 *
 * Uses React.createElement instead of JSX for compatibility without transpilation.
 *
 * @module dist/cli/commands/dashboard
 * @see docs/PRD.md §5.2 - Retro Console Experience
 * @see docs/TECH_REQUIREMENTS.md §5.2 - Console UX & Modules
 * @see spec/cli.spec.md §2 - Interaction & UX Model
 */

import React from 'react';
const { useState, useEffect, useCallback, useMemo, createElement: h } = React;
import { render, Box, Text, useInput, useApp, Newline } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import Fuse from 'fuse.js';
import figlet from 'figlet';
import gradient from 'gradient-string';
import fs, { readFileSync, existsSync, readdirSync, statSync, watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(CURRENT_DIR, '..');
const DIST_ROOT = path.resolve(CLI_ROOT, '..');
const GENAI_ROOT = path.join(DIST_ROOT, 'genaiscript');
const MANIFEST_PATH = path.join(GENAI_ROOT, 'devcycles.config.json');
const STATE_PATH = path.join(GENAI_ROOT, 'state', 'state.json');
const RUNNER_STATE_PATH = path.join(GENAI_ROOT, 'state', 'runner-state.json');
const PROJECT_ROOT = path.resolve(DIST_ROOT, '..');
const LOGS_DIR = path.join(PROJECT_ROOT, '.loaded-vibes', 'logs');
const TODO_PATH = path.join(PROJECT_ROOT, 'TODO.md');
const CHANGELOG_PATH = path.join(PROJECT_ROOT, 'CHANGELOG.md');

// Synthwave color palette
const COLORS = {
  primary: '#ff00ff',
  secondary: '#00ffff',
  accent: '#ff6ec7',
  warning: '#ffff00',
  error: '#ff3366',
  success: '#00ff00',
  muted: '#666699',
};

// Create synthwave gradient
const synthwaveGradient = gradient(['#ff00ff', '#00ffff', '#ff6ec7']);

/**
 * Throttle helper for <200ms update latency (PRD §6).
 * Returns undefined for throttled calls, or the result of fn() otherwise.
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function wrapper
 */
const createThrottle = (limit = 150) => {
  let lastCall = 0;
  return (fn) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn();
    }
    // Return undefined for throttled calls - callers should handle this gracefully
    return undefined;
  };
};

/**
 * Generates ASCII masthead with figlet + gradient-string.
 */
function generateMasthead() {
  try {
    const ascii = figlet.textSync('LOADED VIBES', {
      font: 'ANSI Shadow',
      horizontalLayout: 'fitted',
    });
    return synthwaveGradient.multiline(ascii);
  } catch {
    return synthwaveGradient('═══════ LOADED VIBES ═══════');
  }
}

/**
 * Loads DevCycle manifest.
 */
function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return { devCycles: {}, error: 'Manifest not found' };
  }
  try {
    const content = readFileSync(MANIFEST_PATH, 'utf8');
    return { devCycles: JSON.parse(content), error: null };
  } catch (err) {
    return { devCycles: {}, error: err.message };
  }
}

/**
 * Loads runner state.
 */
function loadRunnerState() {
  if (!existsSync(RUNNER_STATE_PATH)) {
    return { status: 'idle', currentDevCycle: null, currentPhase: null };
  }
  try {
    const content = readFileSync(RUNNER_STATE_PATH, 'utf8');
    return JSON.parse(content);
  } catch {
    return { status: 'idle', currentDevCycle: null, currentPhase: null };
  }
}

/**
 * Loads execution state snapshots.
 */
function loadStateSnapshots() {
  if (!existsSync(STATE_PATH)) {
    return [];
  }
  try {
    const content = readFileSync(STATE_PATH, 'utf8');
    const state = JSON.parse(content);
    return state.executionSnapshots || [];
  } catch {
    return [];
  }
}

/**
 * Gets recent log entries from NDJSON files.
 * Uses efficient tail reading to only read the last ~8KB of each file,
 * rather than loading entire files into memory.
 * @param {number} maxEntries - Maximum number of entries to return
 * @returns {Array} Recent log entries
 */
function getRecentLogs(maxEntries = 10) {
  if (!existsSync(LOGS_DIR)) {
    return [];
  }
  try {
    const files = readdirSync(LOGS_DIR)
      .filter((f) => f.endsWith('.ndjson'))
      .map((f) => ({
        name: f,
        path: path.join(LOGS_DIR, f),
        mtime: statSync(path.join(LOGS_DIR, f)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 5);

    const entries = [];
    for (const file of files) {
      // Read only the last ~8KB of each file for efficiency
      const tailBytes = readFileTail(file.path, 8192);
      const lines = tailBytes.trim().split('\n').filter(Boolean);
      // Take last 20 lines from the tail
      for (const line of lines.slice(-20)) {
        try {
          entries.push(JSON.parse(line));
        } catch {
          // Skip invalid or partial lines at the start of the buffer
        }
      }
    }
    return entries
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, maxEntries);
  } catch {
    return [];
  }
}

/**
 * Reads the last N bytes from a file efficiently.
 * Falls back to full file read if the file is smaller than the buffer.
 * @param {string} filePath - Path to the file
 * @param {number} bytes - Number of bytes to read from end
 * @returns {string} The last N bytes of the file as a string
 */
function readFileTail(filePath, bytes = 8192) {
  try {
    const stats = statSync(filePath);
    const fileSize = stats.size;

    // For small files, just read the whole thing
    if (fileSize <= bytes) {
      return readFileSync(filePath, 'utf8');
    }

    // For larger files, read only the tail
    const fd = fs.openSync(filePath, 'r');
    try {
      const buffer = Buffer.alloc(bytes);
      const startPosition = fileSize - bytes;
      fs.readSync(fd, buffer, 0, bytes, startPosition);
      return buffer.toString('utf8');
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return '';
  }
}

/**
 * Gets TODO entries.
 */
function getTodoEntries(maxEntries = 5) {
  if (!existsSync(TODO_PATH)) {
    return [];
  }
  try {
    const content = readFileSync(TODO_PATH, 'utf8');
    const lines = content.split('\n');
    const entries = [];
    for (const line of lines) {
      const match = line.match(/^\|\s*(☐|☑|\[x\]|\[ \])\s*\|\s*(.+?)\s*\|/);
      if (match) {
        entries.push({
          status: match[1] === '☑' || match[1] === '[x]' ? 'done' : 'pending',
          text: match[2].trim().substring(0, 60),
        });
      }
    }
    return entries.slice(0, maxEntries);
  } catch {
    return [];
  }
}

/**
 * Gets CHANGELOG entries.
 */
function getChangelogEntries(maxEntries = 5) {
  if (!existsSync(CHANGELOG_PATH)) {
    return [];
  }
  try {
    const content = readFileSync(CHANGELOG_PATH, 'utf8');
    const lines = content.split('\n');
    const entries = [];
    for (const line of lines) {
      const match = line.match(/^\[(\w+)\]\[([^\]]+)\]\s*Goal:\s*(.+)/);
      if (match) {
        entries.push({
          type: match[1],
          date: match[2],
          goal: match[3].substring(0, 50),
        });
      }
    }
    return entries.slice(0, maxEntries);
  } catch {
    return [];
  }
}

/**
 * Gets system metrics.
 */
function getSystemMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);
  const cpus = os.cpus();
  const loadAvg = os.loadavg()[0];
  const cpuPercent = Math.min(100, Math.round((loadAvg / cpus.length) * 100));

  return {
    memory: {
      used: Math.round((usedMem / 1024 / 1024 / 1024) * 10) / 10,
      total: Math.round((totalMem / 1024 / 1024 / 1024) * 10) / 10,
      percent: memPercent,
    },
    cpu: {
      cores: cpus.length,
      loadAvg: loadAvg.toFixed(2),
      percent: cpuPercent,
    },
    uptime: Math.round(os.uptime() / 60),
  };
}

// Command palette commands
const PALETTE_COMMANDS = [
  { id: 'devcycle:initialization', label: 'Run Initialization DevCycle', category: 'DevCycle' },
  { id: 'devcycle:scaffolding', label: 'Run Scaffolding DevCycle', category: 'DevCycle' },
  { id: 'devcycle:configuration', label: 'Run Configuration DevCycle', category: 'DevCycle' },
  { id: 'devcycle:verification', label: 'Run Verification DevCycle', category: 'DevCycle' },
  { id: 'devcycle:testing', label: 'Run Testing DevCycle', category: 'DevCycle' },
  { id: 'devcycle:features', label: 'Run Features DevCycle', category: 'DevCycle' },
  { id: 'devcycle:debug', label: 'Run Debug DevCycle', category: 'DevCycle' },
  { id: 'devcycle:security', label: 'Run Security DevCycle', category: 'DevCycle' },
  { id: 'devcycle:performance', label: 'Run Performance DevCycle', category: 'DevCycle' },
  { id: 'devcycle:deploy', label: 'Run Deploy DevCycle', category: 'DevCycle' },
  { id: 'logs:view', label: 'View Logs', category: 'Logs' },
  { id: 'logs:export', label: 'Export Logs to Markdown', category: 'Logs' },
  { id: 'doctor:run', label: 'Run Doctor Diagnostics', category: 'System' },
  { id: 'refresh', label: 'Refresh Dashboard', category: 'System' },
  { id: 'help', label: 'Show Help', category: 'Help' },
  { id: 'quit', label: 'Quit Dashboard', category: 'System' },
];

/**
 * Masthead Component
 */
function Masthead() {
  const [masthead] = useState(() => generateMasthead());
  return h(
    Box,
    { flexDirection: 'column', alignItems: 'center', marginBottom: 1 },
    h(Text, null, masthead),
    h(Text, { color: COLORS.muted }, '─────────────────────────────────────────────────────────────────────'),
    h(Text, { color: COLORS.secondary }, 'Retro Dashboard • PRD §5.2 • Press Ctrl+P for Command Palette')
  );
}

/**
 * DevCycle Queue Pane
 */
function DevCycleQueuePane({ manifest, runnerState, snapshots }) {
  const devCycles = Object.entries(manifest.devCycles || {}).slice(0, 8);

  const getStatus = (key) => {
    if (runnerState.currentDevCycle === key) {
      return { icon: '▶', color: COLORS.success, label: runnerState.status };
    }
    const snapshot = snapshots.find((s) => s.devCycleId === key);
    if (snapshot) {
      if (snapshot.status === 'success') return { icon: '✓', color: COLORS.success, label: 'done' };
      if (snapshot.status === 'failure') return { icon: '✗', color: COLORS.error, label: 'failed' };
    }
    return { icon: '○', color: COLORS.muted, label: 'pending' };
  };

  return h(
    Box,
    { flexDirection: 'column', borderStyle: 'round', borderColor: COLORS.primary, paddingX: 1, width: '50%' },
    h(Text, { bold: true, color: COLORS.primary }, '◆ DevCycle Queue'),
    h(Text, { color: COLORS.muted }, '──────────────────────────'),
    devCycles.length === 0
      ? h(Text, { color: COLORS.muted }, 'No DevCycles in manifest')
      : devCycles.map(([key, entry]) => {
          const status = getStatus(key);
          return h(
            Text,
            { key },
            h(Text, { color: status.color }, status.icon + ' '),
            h(Text, { color: COLORS.secondary }, entry.label || key),
            h(Text, { color: COLORS.muted }, ` [${status.label}]`)
          );
        })
  );
}

/**
 * Live Logs Pane
 */
function LiveLogsPane({ logs, isStreaming }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return COLORS.error;
      case 'warn':
        return COLORS.warning;
      case 'info':
        return COLORS.success;
      default:
        return COLORS.muted;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return '✗';
      case 'warn':
        return '!';
      case 'info':
        return '▸';
      default:
        return '·';
    }
  };

  return h(
    Box,
    { flexDirection: 'column', borderStyle: 'round', borderColor: COLORS.secondary, paddingX: 1, width: '50%' },
    h(
      Box,
      null,
      h(Text, { bold: true, color: COLORS.secondary }, '◆ Live Logs '),
      isStreaming && h(Text, { color: COLORS.success }, h(Spinner, { type: 'dots' }))
    ),
    h(Text, { color: COLORS.muted }, '──────────────────────────'),
    logs.length === 0
      ? h(Text, { color: COLORS.muted }, 'No recent log entries')
      : logs.slice(0, 8).map((entry, i) => {
          const time = entry.timestamp ? entry.timestamp.substring(11, 19) : '??:??:??';
          return h(
            Text,
            { key: i, wrap: 'truncate-end' },
            h(Text, { color: COLORS.muted }, time + ' '),
            h(Text, { color: getSeverityColor(entry.severity) }, getSeverityIcon(entry.severity) + ' '),
            h(Text, { color: COLORS.accent }, (entry.message || '').substring(0, 40))
          );
        })
  );
}

/**
 * Metrics Pane
 */
function MetricsPane({ metrics }) {
  const getBarColor = (percent) => {
    if (percent > 80) return COLORS.error;
    if (percent > 60) return COLORS.warning;
    return COLORS.success;
  };

  const renderBar = (percent, width = 15) => {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  return h(
    Box,
    { flexDirection: 'column', borderStyle: 'round', borderColor: COLORS.accent, paddingX: 1, width: '50%' },
    h(Text, { bold: true, color: COLORS.accent }, '◆ System Metrics'),
    h(Text, { color: COLORS.muted }, '──────────────────────────'),
    h(
      Text,
      null,
      h(Text, { color: COLORS.secondary }, 'CPU: '),
      h(Text, { color: getBarColor(metrics.cpu.percent) }, renderBar(metrics.cpu.percent)),
      h(Text, { color: COLORS.muted }, ` ${metrics.cpu.percent}%`)
    ),
    h(
      Text,
      null,
      h(Text, { color: COLORS.secondary }, 'MEM: '),
      h(Text, { color: getBarColor(metrics.memory.percent) }, renderBar(metrics.memory.percent)),
      h(Text, { color: COLORS.muted }, ` ${metrics.memory.used}/${metrics.memory.total}GB`)
    ),
    h(
      Text,
      { color: COLORS.muted },
      `Cores: ${metrics.cpu.cores} | Load: ${metrics.cpu.loadAvg} | Up: ${metrics.uptime}m`
    )
  );
}

/**
 * TODO/CHANGELOG Feed Pane
 */
function FeedPane({ todos, changelog }) {
  return h(
    Box,
    { flexDirection: 'column', borderStyle: 'round', borderColor: COLORS.warning, paddingX: 1, width: '50%' },
    h(Text, { bold: true, color: COLORS.warning }, '◆ TODO / CHANGELOG'),
    h(Text, { color: COLORS.muted }, '──────────────────────────'),
    h(Text, { color: COLORS.secondary }, 'Recent TODOs:'),
    todos.length === 0
      ? h(Text, { color: COLORS.muted }, '  No TODO entries')
      : todos.slice(0, 3).map((t, i) =>
          h(
            Text,
            { key: i, wrap: 'truncate-end' },
            h(Text, { color: t.status === 'done' ? COLORS.success : COLORS.muted }, t.status === 'done' ? '✓ ' : '○ '),
            h(Text, { color: COLORS.accent }, t.text.substring(0, 35))
          )
        ),
    h(Newline),
    h(Text, { color: COLORS.secondary }, 'Recent Changes:'),
    changelog.length === 0
      ? h(Text, { color: COLORS.muted }, '  No CHANGELOG entries')
      : changelog.slice(0, 2).map((c, i) =>
          h(
            Text,
            { key: i, wrap: 'truncate-end' },
            h(Text, { color: COLORS.primary }, `[${c.type}] `),
            h(Text, { color: COLORS.accent }, c.goal.substring(0, 30))
          )
        )
  );
}

/**
 * Notifications Bar
 */
function NotificationsBar({ notifications }) {
  if (notifications.length === 0) {
    return h(Box, { paddingX: 1 }, h(Text, { color: COLORS.muted }, 'No notifications'));
  }

  const latest = notifications[0];
  const typeColors = {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.secondary,
  };

  return h(
    Box,
    { paddingX: 1 },
    h(Text, { color: typeColors[latest.type] || COLORS.muted }, `● ${latest.message}`)
  );
}

/**
 * Command Palette Component
 */
function CommandPalette({ isOpen, onClose, onExecute }) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(
    () =>
      new Fuse(PALETTE_COMMANDS, {
        keys: ['label', 'category'],
        threshold: 0.4,
      }),
    []
  );

  const results = useMemo(() => {
    if (!query) return PALETTE_COMMANDS.slice(0, 10);
    return fuse.search(query).map((r) => r.item).slice(0, 10);
  }, [query, fuse]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput(
    (input, key) => {
      if (!isOpen) return;

      if (key.escape) {
        onClose();
        return;
      }

      if (key.upArrow) {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.downArrow) {
        setSelectedIndex((prev) => Math.min(results.length - 1, prev + 1));
        return;
      }

      if (key.return && results[selectedIndex]) {
        onExecute(results[selectedIndex]);
        onClose();
        return;
      }
    },
    { isActive: isOpen }
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return h(
    Box,
    { flexDirection: 'column', borderStyle: 'double', borderColor: COLORS.primary, paddingX: 2, paddingY: 1, marginY: 1 },
    h(Text, { bold: true, color: COLORS.primary }, '◆ Command Palette (Ctrl+P)'),
    h(
      Box,
      { marginY: 1 },
      h(Text, { color: COLORS.secondary }, '▸ '),
      h(TextInput, { value: query, onChange: setQuery, placeholder: 'Type to search commands...' })
    ),
    h(Text, { color: COLORS.muted }, '────────────────────────────────'),
    ...results.map((cmd, i) =>
      h(
        Text,
        { key: cmd.id },
        h(Text, { color: i === selectedIndex ? COLORS.success : COLORS.muted }, i === selectedIndex ? '▶ ' : '  '),
        h(Text, { color: i === selectedIndex ? COLORS.accent : COLORS.secondary }, cmd.label),
        h(Text, { color: COLORS.muted }, ` [${cmd.category}]`)
      )
    ),
    h(Text, { color: COLORS.muted }, '↑↓ Navigate • Enter Select • Esc Close')
  );
}

/**
 * Help Overlay
 */
function HelpOverlay({ isOpen, onClose }) {
  useInput((input, key) => {
    if (isOpen && (key.escape || input === 'h' || input === '?')) {
      onClose();
    }
  });

  if (!isOpen) return null;

  return h(
    Box,
    { flexDirection: 'column', borderStyle: 'double', borderColor: COLORS.secondary, paddingX: 2, paddingY: 1, marginY: 1 },
    h(Text, { bold: true, color: COLORS.secondary }, '◆ Keyboard Shortcuts'),
    h(Text, { color: COLORS.muted }, '────────────────────────────────'),
    h(Text, null, h(Text, { color: COLORS.accent }, 'Ctrl+P'), h(Text, { color: COLORS.muted }, ' - Open Command Palette')),
    h(Text, null, h(Text, { color: COLORS.accent }, 'r'), h(Text, { color: COLORS.muted }, ' - Refresh dashboard data')),
    h(Text, null, h(Text, { color: COLORS.accent }, 'l'), h(Text, { color: COLORS.muted }, ' - Toggle live log streaming')),
    h(Text, null, h(Text, { color: COLORS.accent }, 'h / ?'), h(Text, { color: COLORS.muted }, ' - Toggle this help')),
    h(Text, null, h(Text, { color: COLORS.accent }, 'q / Ctrl+C'), h(Text, { color: COLORS.muted }, ' - Quit dashboard')),
    h(Newline),
    h(Text, { color: COLORS.muted }, 'References: PRD §5.2, TECH §5.2, SPEC-CLI §2'),
    h(Text, { color: COLORS.muted }, 'Press Esc or h to close')
  );
}

/**
 * Main Dashboard App
 */
function Dashboard() {
  const { exit } = useApp();
  const throttle = useMemo(() => createThrottle(150), []);

  // State
  const [manifest, setManifest] = useState(() => loadManifest());
  const [runnerState, setRunnerState] = useState(() => loadRunnerState());
  const [snapshots, setSnapshots] = useState(() => loadStateSnapshots());
  const [logs, setLogs] = useState(() => getRecentLogs());
  const [todos, setTodos] = useState(() => getTodoEntries());
  const [changelog, setChangelog] = useState(() => getChangelogEntries());
  const [metrics, setMetrics] = useState(() => getSystemMetrics());
  const [notifications, setNotifications] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const addNotification = useCallback((type, message) => {
    setNotifications((prev) => [{ type, message, timestamp: Date.now() }, ...prev].slice(0, 5));
  }, []);

  const refreshData = useCallback(() => {
    throttle(() => {
      setManifest(loadManifest());
      setRunnerState(loadRunnerState());
      setSnapshots(loadStateSnapshots());
      setLogs(getRecentLogs());
      setTodos(getTodoEntries());
      setChangelog(getChangelogEntries());
      setMetrics(getSystemMetrics());
      setLastUpdate(Date.now());
    });
  }, [throttle]);

  // Periodic metric refresh (every 2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getSystemMetrics());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Watch for log file changes
  useEffect(() => {
    if (!isStreaming || !existsSync(LOGS_DIR)) return;

    const watcher = watch(LOGS_DIR, (eventType, filename) => {
      if (filename && filename.endsWith('.ndjson')) {
        throttle(() => {
          setLogs(getRecentLogs());
        });
      }
    });

    return () => watcher.close();
  }, [isStreaming, throttle]);

  const handleCommand = useCallback(
    (cmd) => {
      if (cmd.id === 'quit') {
        exit();
        return;
      }

      if (cmd.id === 'refresh') {
        refreshData();
        addNotification('info', 'Dashboard refreshed');
        return;
      }

      if (cmd.id === 'help') {
        setShowHelp(true);
        return;
      }

      if (cmd.id.startsWith('devcycle:')) {
        const devCycle = cmd.id.replace('devcycle:', '');
        addNotification('info', `Queued DevCycle: ${devCycle} (run separately)`);
        return;
      }

      if (cmd.id.startsWith('logs:')) {
        addNotification('info', `Logs command: ${cmd.label} (run separately)`);
        return;
      }

      if (cmd.id === 'doctor:run') {
        addNotification('info', 'Run doctor with: node dist/cli/index.js doctor');
        return;
      }

      addNotification('warning', `Unknown command: ${cmd.id}`);
    },
    [exit, refreshData, addNotification]
  );

  // Global input handler
  useInput((input, key) => {
    if (showPalette || showHelp) return;

    if (key.ctrl && input === 'p') {
      setShowPalette(true);
      return;
    }

    if (input === 'r') {
      refreshData();
      addNotification('success', 'Dashboard refreshed');
      return;
    }

    if (input === 'l') {
      setIsStreaming((prev) => !prev);
      addNotification('info', `Log streaming ${!isStreaming ? 'enabled' : 'paused'}`);
      return;
    }

    if (input === 'h' || input === '?') {
      setShowHelp(true);
      return;
    }

    if (input === 'q') {
      exit();
    }
  });

  return h(
    Box,
    { flexDirection: 'column', padding: 1 },
    h(Masthead),
    h(CommandPalette, { isOpen: showPalette, onClose: () => setShowPalette(false), onExecute: handleCommand }),
    h(HelpOverlay, { isOpen: showHelp, onClose: () => setShowHelp(false) }),
    !showPalette &&
      !showHelp &&
      h(
        React.Fragment,
        null,
        h(
          Box,
          { marginBottom: 1 },
          h(DevCycleQueuePane, { manifest, runnerState, snapshots }),
          h(LiveLogsPane, { logs, isStreaming })
        ),
        h(Box, { marginBottom: 1 }, h(MetricsPane, { metrics }), h(FeedPane, { todos, changelog })),
        h(Box, { borderStyle: 'single', borderColor: COLORS.muted, paddingX: 1 }, h(NotificationsBar, { notifications })),
        h(
          Box,
          { justifyContent: 'space-between', paddingX: 1, marginTop: 1 },
          h(Text, { color: COLORS.muted }, `Updated: ${new Date(lastUpdate).toLocaleTimeString()}`),
          h(Text, { color: COLORS.muted }, 'Ctrl+P Command Palette • r Refresh • h Help • q Quit')
        )
      )
  );
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    console.log(`
${synthwaveGradient('Loaded Vibes Dashboard')}

Usage: loaded-vibes dashboard [options]

Options:
  -h, --help    Show this help message

Keyboard Controls:
  Ctrl+P        Open command palette
  r             Refresh dashboard data
  l             Toggle live log streaming
  h / ?         Show keyboard shortcuts
  q / Ctrl+C    Quit dashboard

References:
  - PRD §5.2 - Retro Console Experience
  - TECH §5.2 - Console UX & Modules
  - SPEC-CLI §2 - Interaction & UX Model
`);
    return;
  }

  console.clear();
  render(h(Dashboard));
}

// Direct execution check
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Dashboard failed to start:', err);
    process.exit(1);
  });
}

export { Dashboard, main as runDashboard };
