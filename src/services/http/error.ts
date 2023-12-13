import { IHttpErrorData } from './types';

export class HttpError extends Error {
  public statusCode?: number;
  public data: IHttpErrorData;

  constructor(message: string, statusCode?: number, data: IHttpErrorData = {}) {
    super(message);
    this.data = data;

    if (statusCode) this.statusCode = statusCode;
  }
}
