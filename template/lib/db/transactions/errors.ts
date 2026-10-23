export class ConcurrencyConflictError extends Error {
  readonly code = "CONFLICT";

  constructor(resource: string) {
    super(
      `${resource} changed after it was read. Refresh and retry with the current version.`,
    );
    this.name = "ConcurrencyConflictError";
  }
}

export class ResourceNotFoundError extends Error {
  readonly code = "NOT_FOUND";

  constructor(resource: string) {
    super(`${resource} was not found in the active organization.`);
    this.name = "ResourceNotFoundError";
  }
}

export class InvariantViolationError extends Error {
  readonly code = "VALIDATION";

  constructor(message: string) {
    super(message);
    this.name = "InvariantViolationError";
  }
}

/**
 * A versioned update matched no row: the row changed (CONFLICT) or is not in
 * this organization (NOT_FOUND, so cross-tenant IDs never leak existence).
 */
export function staleOrMissing(resource: string, exists: boolean) {
  return exists
    ? new ConcurrencyConflictError(resource)
    : new ResourceNotFoundError(resource);
}
