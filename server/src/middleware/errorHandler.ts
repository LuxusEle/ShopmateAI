import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface APIError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  logger.error(`${statusCode} - ${message}`, {
    path: req.path,
    method: req.method,
    error: error.stack,
    code
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    code: code,
    timestamp: new Date(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export class AppError extends Error implements APIError {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
