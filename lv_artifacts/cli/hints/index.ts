/**
 * @framework Loaded Vibes CLI
 * @module hints
 * @description Contextual help system for the CLI
 */

/** Hint types (inline, since './types' is missing) */
export type HintConfig = {
  categories: Record<string, Record<string, {
    title: string;
    message: string;
    priority: number;
    when: string[];
  }>>
  styling: {
    error: { icon: string };
    info: { icon: string };
    warning: { icon: string };
    tip: { icon: string };
  };
};

export type HintContext = {
  state: any;
  git: any;
  error: any;
  session: any;
  exists?: (path: string) => boolean | Promise<boolean>;
};

export type HintResult = {
  id: string;
  category: string;
  title: string;
  message: string;
  priority: number;
};

/**
 * Evaluate a hint condition against the current context
 */
export function evaluateCondition(condition: string, context: HintContext): boolean {
  const { state, git, error, session } = context;

  try {
    // Simple expression evaluator for hint conditions
    // In production, use a proper expression parser
    const safeEval = new Function(
      'state',
      'git',
      'error',
      'session',
      'exists',
      'random',
      `return ${condition}`
    );

    return safeEval(
      state,
      git,
      error,
      session,
      (path: string) => context.exists?.(path) ?? false,
      (probability: number) => Math.random() < probability
    );
  } catch {
    return false;
  }
}

/**
 * Get relevant hints based on current context
 */
export function getHints(config: HintConfig, context: HintContext): HintResult[] {
  const results: HintResult[] = [];

  for (const [category, hints] of Object.entries(config.categories)) {
    for (const [id, hint] of Object.entries(hints as Record<string, { title: string; message: string; priority: number; when: string[] }>) ) {
      const matches = hint.when.every((condition) => evaluateCondition(condition, context));

      if (matches) {
        results.push({
          id: `${category}.${id}`,
          category,
          title: hint.title,
          message: hint.message,
          priority: hint.priority,
        });
      }
    }
  }

  // Sort by priority (higher first)
  return results.sort((a, b) => b.priority - a.priority);
}

/**
 * Format a hint for terminal output
 */
export function formatHint(hint: HintResult, styling: HintConfig['styling']): string {
  const style = getStyleForCategory(hint.category, styling);

  return `
${style.icon} ${hint.title}
  ${hint.message}
`.trim();
}

function getStyleForCategory(category: string, styling: HintConfig['styling']) {
  switch (category) {
    case 'error':
      return styling.error;
    case 'devcycle':
      return styling.info;
    case 'context':
      return styling.warning;
    case 'tips':
      return styling.tip;
    default:
      return styling.info;
  }
}

/**
 * Main hint command implementation
 */
export async function runHintCommand(options: {
  topic?: 'devcycle' | 'error' | 'next';
  detailed?: boolean;
}): Promise<void> {
  const config = await loadHintConfig();
  const context = await gatherContext();

  let hints = getHints(config, context);

  // Filter by topic if specified
  if (options.topic === 'error') {
    hints = hints.filter((h) => h.category === 'error');
  } else if (options.topic === 'devcycle') {
    hints = hints.filter((h) => h.category === 'devcycle');
  } else if (options.topic === 'next') {
    hints = hints.filter((h) => ['devcycle', 'context'].includes(h.category));
  }

  // Display hints
  if (hints.length === 0) {
    console.log('✨ No suggestions at this time. Keep vibing!');
    return;
  }

  // Show top 3 hints by default, all if detailed
  const displayHints = options.detailed ? hints : hints.slice(0, 3);

  console.log('\n🎯 Suggestions for you:\n');

  for (const hint of displayHints) {
    console.log(formatHint(hint, config.styling));
    console.log('');
  }

  if (!options.detailed && hints.length > 3) {
    console.log(`  ... and ${hints.length - 3} more. Use --detailed to see all.`);
  }
}

async function loadHintConfig(): Promise<HintConfig> {
  // Load from hints.config.json
  const fs = await import('fs/promises');
  const path = await import('path');

  const configPath = path.join(__dirname, 'hints.config.json');
  const content = await fs.readFile(configPath, 'utf-8');

  return JSON.parse(content);
}

async function gatherContext(): Promise<HintContext> {
  // Gather current state, git status, errors, etc.
  return {
    state: await loadState(),
    git: await getGitStatus(),
    error: await getLastError(),
    session: await getSessionInfo(),
    exists: async (path: string) => {
      const fs = await import('fs/promises');
      try {
        await fs.access(path);
        return true;
      } catch {
        return false;
      }
    },
  };
}

async function loadState() {
  // Load .loaded-vibes/state.json
  return {
    currentCycle: null,
    lastCompletedCycle: null,
    status: 'idle',
    recentCycles: [],
  };
}

async function getGitStatus() {
  return {
    hasChanges: false,
    newFiles: [],
    changedFiles: [],
    hasUncommittedChanges: false,
  };
}

async function getLastError() {
  return {
    type: null,
    message: null,
  };
}

async function getSessionInfo() {
  return {
    duration: '0h',
    startTime: new Date(),
  };
}
