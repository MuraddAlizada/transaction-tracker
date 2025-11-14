/**
 * Abstract base class for all application errors
 * Implements Problem+JSON format (RFC 7807)
 */
export abstract class AppError extends Error {
  public readonly status: number;
  public readonly type: string;
  public readonly detail?: string;
  public readonly instance?: string;

  constructor(
    title: string,
    status: number,
    type: string,
    detail?: string,
    instance?: string
  ) {
    super(title);
    this.name = this.constructor.name;
    this.status = status;
    this.type = type;
    this.detail = detail;
    this.instance = instance;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts error to Problem+JSON format
   */
  public toJSON() {
    return {
      type: this.type,
      title: this.message,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
    };
  }
}