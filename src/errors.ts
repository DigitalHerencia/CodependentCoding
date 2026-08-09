export type LoadedVibesErrorCode =
  | 'INVALID_PROJECT_NAME'
  | 'UNSAFE_TARGET'
  | 'TARGET_NOT_EMPTY'
  | 'INVALID_CONFIG'
  | 'UNSUPPORTED_CONFIGURATION'
  | 'TEMPLATE_INVALID'
  | 'COPY_FAILED'
  | 'TRANSFORM_FAILED'
  | 'INSTALL_FAILED'
  | 'VALIDATION_FAILED'
  | 'GIT_INIT_FAILED';

export class LoadedVibesError extends Error {
  constructor(
    readonly code: LoadedVibesErrorCode,
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'LoadedVibesError';
  }
}
