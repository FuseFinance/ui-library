export class LockedWorkflowError extends Error {
  errorCode: number | null;

  constructor(message = 'Locked Workflow Error', errorCode: number | null = null) {
    super(message);
    this.name = 'lockedWorkflowError';
    this.errorCode = errorCode;
  }
}
