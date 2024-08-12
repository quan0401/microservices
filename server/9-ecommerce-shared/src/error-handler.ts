import { StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
  serializeError(): IError;
}

interface IError {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
}

export abstract class CustomeError extends Error {
  abstract statusCode: number;
  abstract status: string;
  comingFrom: string;

  constructor(message: string, comingFrom: string) {
    super(message);
    this.comingFrom = comingFrom;
  }

  serializeError(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      comingFrom: this.comingFrom,
    };
  }
}

export class BadRequestError extends CustomeError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'error';
  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class NotFoundError extends CustomeError {
  statusCode = StatusCodes.NOT_FOUND;
  status = 'error';
  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class NotAuthorizedError extends CustomeError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status = 'error';
  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class FileTooLargeError extends CustomeError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  status = 'error';
  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class ServerError extends CustomeError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  status = 'error';
  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export interface ErrornoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}
