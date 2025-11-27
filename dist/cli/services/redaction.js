// @ts-nocheck
/**
 * Secret Redaction Module
 *
 * Provides configurable secret/sensitive data redaction for NDJSON logs,
 * telemetry exports, and stack traces. Implements TECH §9 and SPEC-SECURITY §2
 * requirements for secure logging without exposing credentials.
 *
 * @module dist/cli/services/redaction
 * @see docs/TECH_REQUIREMENTS.md §9 - Security, Quality, Compliance
 * @see spec/security.spec.md §2 - Component Controls (Logging Stack)
 * @see spec/observability.spec.md §4 - Validation Checklist
 */

import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = path.resolve(CURRENT_DIR, 'redaction.config.json');

/** Placeholder for redacted content */
const REDACTED_PLACEHOLDER = '[REDACTED]';

/**
 * @typedef {Object} RedactionPattern
 * @property {string} name - Human-readable name for the pattern
 * @property {string} pattern - Regular expression pattern string
 * @property {string} [flags] - Regex flags (default: 'gi')
 * @property {string} [category] - Category (e.g., 'api_key', 'token', 'env_var')
 */

/**
 * @typedef {Object} RedactionConfig
 * @property {string[]} sensitiveKeys - Keys to redact in objects (case-insensitive)
 * @property {RedactionPattern[]} patterns - Regex patterns for value redaction
 * @property {RedactionPattern[]} stackTracePatterns - Additional patterns for stack traces
 * @property {string[]} envVarPrefixes - Environment variable prefixes to redact
 * @property {boolean} redactStackPaths - Whether to redact full file paths in stack traces
 */

/**
 * Default configuration for secret redaction.
 * Can be overridden via redaction.config.json file.
 *
 * @type {RedactionConfig}
 */
const DEFAULT_CONFIG = {
  sensitiveKeys: [
    'password',
    'passwd',
    'secret',
    'token',
    'api_key',
    'apikey',
    'api-key',
    'authorization',
    'auth',
    'credential',
    'credentials',
    'private_key',
    'privatekey',
    'private-key',
    'access_token',
    'accesstoken',
    'access-token',
    'refresh_token',
    'refreshtoken',
    'refresh-token',
    'bearer',
    'jwt',
    'session',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'client_secret',
    'clientsecret',
    'client-secret',
  ],
  patterns: [
    // API Keys - common formats
    {
      name: 'Generic API Key',
      pattern: '(?:api[_-]?key|apikey)\\s*[=:]\\s*["\']?([a-zA-Z0-9_\\-]{16,})["\']?',
      flags: 'gi',
      category: 'api_key',
    },
    // Bearer tokens
    {
      name: 'Bearer Token',
      pattern: 'Bearer\\s+[a-zA-Z0-9_\\-\\.]+',
      flags: 'gi',
      category: 'token',
    },
    // JWT tokens (header.payload.signature format)
    {
      name: 'JWT Token',
      pattern: 'eyJ[a-zA-Z0-9_-]*\\.eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*',
      flags: 'g',
      category: 'token',
    },
    // GitHub tokens
    {
      name: 'GitHub Token',
      pattern: 'gh[pousr]_[a-zA-Z0-9]{36,}',
      flags: 'g',
      category: 'token',
    },
    // npm tokens
    {
      name: 'npm Token',
      pattern: 'npm_[a-zA-Z0-9]{36,}',
      flags: 'g',
      category: 'token',
    },
    // AWS credentials
    {
      name: 'AWS Access Key',
      pattern: 'AKIA[0-9A-Z]{16}',
      flags: 'g',
      category: 'api_key',
    },
    {
      name: 'AWS Secret Key',
      pattern: '(?:aws[_-]?secret[_-]?(?:access[_-]?)?key)\\s*[=:]\\s*["\']?([a-zA-Z0-9/+=]{40})["\']?',
      flags: 'gi',
      category: 'api_key',
    },
    // Generic secrets with common prefixes
    {
      name: 'Generic Secret Assignment',
      pattern: '(?:secret|password|passwd|pwd|token)\\s*[=:]\\s*["\']?([^"\'\\s]{8,})["\']?',
      flags: 'gi',
      category: 'secret',
    },
    // Private keys (PEM format markers)
    {
      name: 'Private Key',
      pattern: '-----BEGIN\\s+(?:RSA\\s+)?PRIVATE\\s+KEY-----[\\s\\S]*?-----END\\s+(?:RSA\\s+)?PRIVATE\\s+KEY-----',
      flags: 'g',
      category: 'private_key',
    },
    // Connection strings with passwords
    {
      name: 'Connection String Password',
      pattern: '(?:mongodb|postgresql|mysql|redis|amqp)(?:\\+srv)?://[^:]+:([^@]+)@',
      flags: 'gi',
      category: 'connection_string',
    },
    // Basic auth in URLs
    {
      name: 'Basic Auth in URL',
      pattern: '://([^:]+):([^@]+)@',
      flags: 'g',
      category: 'auth',
    },
  ],
  stackTracePatterns: [
    // Home directory paths (common secret locations)
    {
      name: 'Home Directory',
      pattern: '/(?:home|Users)/[a-zA-Z0-9_-]+/',
      flags: 'g',
      category: 'path',
    },
    // Windows user paths
    {
      name: 'Windows User Path',
      pattern: 'C:\\\\Users\\\\[a-zA-Z0-9_-]+\\\\',
      flags: 'gi',
      category: 'path',
    },
  ],
  envVarPrefixes: [
    'API_KEY',
    'SECRET',
    'TOKEN',
    'PASSWORD',
    'PASSWD',
    'PWD',
    'AUTH',
    'CREDENTIAL',
    'PRIVATE',
    'AWS_',
    'GITHUB_',
    'NPM_',
    'DATABASE_',
    'DB_',
    'MONGODB_',
    'POSTGRES_',
    'MYSQL_',
    'REDIS_',
    'JWT_',
    'SESSION_',
    'COOKIE_',
    'SMTP_',
    'MAIL_',
    'OPENAI_',
    'ANTHROPIC_',
    'AZURE_',
    'GCP_',
    'GOOGLE_',
  ],
  redactStackPaths: true,
};

/**
 * Loads redaction configuration from file or returns defaults.
 *
 * @param {string} [configPath] - Path to config file (optional)
 * @returns {RedactionConfig} Merged configuration
 */
export function loadConfig(configPath = DEFAULT_CONFIG_PATH) {
  const config = { ...DEFAULT_CONFIG };

  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, 'utf8');
      const custom = JSON.parse(raw);

      // Merge arrays (append custom to defaults)
      if (Array.isArray(custom.sensitiveKeys)) {
        config.sensitiveKeys = [...new Set([...config.sensitiveKeys, ...custom.sensitiveKeys])];
      }
      if (Array.isArray(custom.patterns)) {
        config.patterns = [...config.patterns, ...custom.patterns];
      }
      if (Array.isArray(custom.stackTracePatterns)) {
        config.stackTracePatterns = [...config.stackTracePatterns, ...custom.stackTracePatterns];
      }
      if (Array.isArray(custom.envVarPrefixes)) {
        config.envVarPrefixes = [...new Set([...config.envVarPrefixes, ...custom.envVarPrefixes])];
      }
      if (typeof custom.redactStackPaths === 'boolean') {
        config.redactStackPaths = custom.redactStackPaths;
      }
    } catch {
      // Ignore config errors; use defaults
    }
  }

  return config;
}

/**
 * Compiles regex patterns from configuration.
 *
 * @param {RedactionPattern[]} patterns - Pattern definitions
 * @returns {Array<{regex: RegExp, name: string, category: string}>} Compiled patterns
 */
function compilePatterns(patterns) {
  const compiled = [];

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern.pattern, pattern.flags || 'gi');
      compiled.push({
        regex,
        name: pattern.name,
        category: pattern.category || 'unknown',
      });
    } catch {
      // Skip invalid patterns
    }
  }

  return compiled;
}

/**
 * SecretRedactor class for redacting sensitive information.
 * Implements TECH §9 and SPEC-SECURITY §2 requirements.
 */
export class SecretRedactor {
  /**
   * @param {RedactionConfig} [config] - Configuration (loads defaults if not provided)
   */
  constructor(config) {
    this.config = config || loadConfig();
    this.sensitiveKeysLower = this.config.sensitiveKeys.map((k) => k.toLowerCase());
    this.patterns = compilePatterns(this.config.patterns);
    this.stackPatterns = compilePatterns(this.config.stackTracePatterns);
    this.envVarRegex = this._buildEnvVarRegex();
  }

  /**
   * Builds regex for environment variable detection.
   *
   * @returns {RegExp} Compiled regex for env var patterns
   * @private
   */
  _buildEnvVarRegex() {
    const prefixes = this.config.envVarPrefixes
      .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');

    // Match env var references like ${VAR}, $VAR, or process.env.VAR
    return new RegExp(
      `(?:\\$\\{?(${prefixes}[A-Z0-9_]*)\\}?|process\\.env\\.(${prefixes}[A-Z0-9_]*))`,
      'gi'
    );
  }

  /**
   * Checks if a key is sensitive (case-insensitive).
   *
   * @param {string} key - Key to check
   * @returns {boolean} True if sensitive
   */
  isSensitiveKey(key) {
    if (!key || typeof key !== 'string') {
      return false;
    }

    const lowerKey = key.toLowerCase();
    return this.sensitiveKeysLower.some((sensitive) => lowerKey.includes(sensitive));
  }

  /**
   * Redacts sensitive patterns from a string value.
   *
   * @param {string} value - String to redact
   * @param {boolean} [isStackTrace=false] - Whether this is a stack trace
   * @returns {string} Redacted string
   */
  redactString(value, isStackTrace = false) {
    if (!value || typeof value !== 'string') {
      return value;
    }

    let result = value;

    // Apply main patterns
    for (const { regex } of this.patterns) {
      result = result.replace(regex, (match) => {
        // For patterns with capture groups, only redact the captured part
        // For full matches, redact the whole thing
        return REDACTED_PLACEHOLDER;
      });
    }

    // Apply env var pattern
    result = result.replace(this.envVarRegex, REDACTED_PLACEHOLDER);

    // Apply stack trace patterns if applicable
    if (isStackTrace && this.config.redactStackPaths) {
      for (const { regex } of this.stackPatterns) {
        result = result.replace(regex, REDACTED_PLACEHOLDER);
      }
    }

    return result;
  }

  /**
   * Redacts sensitive data from an object (recursively).
   * Handles both key-based and value-based redaction.
   *
   * @param {*} data - Data to redact
   * @returns {*} Redacted data (deep copy)
   */
  redactObject(data) {
    if (data === null || data === undefined) {
      return data;
    }

    // Handle primitives
    if (typeof data === 'string') {
      return this.redactString(data);
    }

    if (typeof data !== 'object') {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.redactObject(item));
    }

    // Handle Error objects specially
    if (data instanceof Error) {
      const redactedError = new Error(this.redactString(data.message));
      if (data.stack) {
        redactedError.stack = this.redactStackTrace(data.stack);
      }
      return redactedError;
    }

    // Handle plain objects
    const redacted = {};

    for (const key of Object.keys(data)) {
      if (this.isSensitiveKey(key)) {
        redacted[key] = REDACTED_PLACEHOLDER;
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        redacted[key] = this.redactObject(data[key]);
      } else if (typeof data[key] === 'string') {
        redacted[key] = this.redactString(data[key]);
      } else {
        redacted[key] = data[key];
      }
    }

    return redacted;
  }

  /**
   * Redacts sensitive information from a stack trace.
   * Implements SPEC-OBS §4 requirement for sanitized stack traces.
   *
   * @param {string} stackTrace - Stack trace string
   * @returns {string} Sanitized stack trace
   */
  redactStackTrace(stackTrace) {
    if (!stackTrace || typeof stackTrace !== 'string') {
      return stackTrace;
    }

    let result = stackTrace;

    // Apply main patterns (for any secrets in error messages)
    for (const { regex } of this.patterns) {
      result = result.replace(regex, REDACTED_PLACEHOLDER);
    }

    // Apply env var pattern
    result = result.replace(this.envVarRegex, REDACTED_PLACEHOLDER);

    // Apply stack trace specific patterns (path sanitization)
    if (this.config.redactStackPaths) {
      for (const { regex } of this.stackPatterns) {
        result = result.replace(regex, REDACTED_PLACEHOLDER);
      }
    }

    return result;
  }

  /**
   * Redacts an entire NDJSON log entry.
   * Ensures all fields are processed for sensitive data.
   *
   * @param {Object} entry - NDJSON log entry
   * @returns {Object} Redacted entry (deep copy)
   */
  redactLogEntry(entry) {
    if (!entry || typeof entry !== 'object') {
      return entry;
    }

    const redacted = {};

    for (const key of Object.keys(entry)) {
      const value = entry[key];

      // Handle known structured fields
      if (key === 'data' && typeof value === 'object') {
        redacted[key] = this.redactObject(value);
      } else if (key === 'message' && typeof value === 'string') {
        redacted[key] = this.redactString(value);
      } else if (key === 'stack' && typeof value === 'string') {
        redacted[key] = this.redactStackTrace(value);
      } else if (key === 'error' && typeof value === 'object') {
        redacted[key] = this.redactObject(value);
      } else if (typeof value === 'string') {
        redacted[key] = this.redactString(value);
      } else if (typeof value === 'object' && value !== null) {
        redacted[key] = this.redactObject(value);
      } else {
        redacted[key] = value;
      }
    }

    return redacted;
  }

  /**
   * Redacts telemetry data for export.
   * Implements SPEC-SECURITY §2 requirement for telemetry redaction.
   *
   * @param {Object|Object[]} telemetry - Telemetry data (single or array)
   * @returns {Object|Object[]} Redacted telemetry
   */
  redactTelemetry(telemetry) {
    if (Array.isArray(telemetry)) {
      return telemetry.map((item) => this.redactLogEntry(item));
    }
    return this.redactLogEntry(telemetry);
  }
}

// Singleton instance for convenience
let defaultRedactor = null;

/**
 * Gets the default redactor instance (lazy initialization).
 *
 * @returns {SecretRedactor}
 */
export function getRedactor() {
  if (!defaultRedactor) {
    defaultRedactor = new SecretRedactor();
  }
  return defaultRedactor;
}

/**
 * Creates a new redactor with custom configuration.
 *
 * @param {RedactionConfig} [config] - Configuration
 * @returns {SecretRedactor}
 */
export function createRedactor(config) {
  return new SecretRedactor(config);
}

/**
 * Convenience function: redacts sensitive data from an object.
 *
 * @param {*} data - Data to redact
 * @returns {*} Redacted data
 */
export function redactSensitive(data) {
  return getRedactor().redactObject(data);
}

/**
 * Convenience function: redacts a string value.
 *
 * @param {string} value - String to redact
 * @returns {string} Redacted string
 */
export function redactString(value) {
  return getRedactor().redactString(value);
}

/**
 * Convenience function: redacts a stack trace.
 *
 * @param {string} stackTrace - Stack trace to sanitize
 * @returns {string} Sanitized stack trace
 */
export function redactStackTrace(stackTrace) {
  return getRedactor().redactStackTrace(stackTrace);
}

/**
 * Convenience function: redacts an NDJSON log entry.
 *
 * @param {Object} entry - Log entry
 * @returns {Object} Redacted entry
 */
export function redactLogEntry(entry) {
  return getRedactor().redactLogEntry(entry);
}

/**
 * Convenience function: redacts telemetry data.
 *
 * @param {Object|Object[]} telemetry - Telemetry data
 * @returns {Object|Object[]} Redacted telemetry
 */
export function redactTelemetry(telemetry) {
  return getRedactor().redactTelemetry(telemetry);
}

export {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_PATH,
  REDACTED_PLACEHOLDER,
};
