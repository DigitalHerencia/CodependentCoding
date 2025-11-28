/**
 * @framework Loaded Vibes CLI
 * @module hints/types
 * @description Type definitions for the hint system
 */

export interface HintCondition {
  /** Condition expression to evaluate */
  expression: string;
}

export interface Hint {
  /** Display title with emoji */
  title: string;
  /** Help message */
  message: string;
  /** Array of condition expressions (all must be true) */
  when: string[];
  /** Priority (higher = shown first) */
  priority: number;
}

export interface HintConfig {
  $schema: string;
  version: string;
  categories: {
    devcycle: Record<string, Hint>;
    error: Record<string, Hint>;
    context: Record<string, Hint>;
    tips: Record<string, Hint>;
  };
  styling: {
    success: HintStyle;
    warning: HintStyle;
    error: HintStyle;
    info: HintStyle;
    tip: HintStyle;
  };
}

export interface HintStyle {
  icon: string;
  color: 'green' | 'yellow' | 'red' | 'cyan' | 'magenta' | 'white';
}

export interface HintContext {
  state: {
    currentCycle: string | null;
    lastCompletedCycle: string | null;
    status: 'idle' | 'running' | 'interrupted' | 'completed';
    recentCycles: string[];
  };
  git: {
    hasChanges: boolean;
    newFiles: string[];
    changedFiles: string[];
    hasUncommittedChanges: boolean;
  };
  error: {
    type: string | null;
    message: string | null;
  };
  session: {
    duration: string;
    startTime: Date;
  };
  exists?: (path: string) => Promise<boolean> | boolean;
}

export interface HintResult {
  id: string;
  category: string;
  title: string;
  message: string;
  priority: number;
}

export interface HintCommandOptions {
  topic?: 'devcycle' | 'error' | 'next';
  detailed?: boolean;
}
