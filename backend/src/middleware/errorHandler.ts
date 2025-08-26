import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { config } from '../config';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error to Sentry if configured
  if (config.sentry.dsn) {
    Sentry.captureException(err);
  }

  // Set default status code if not provided
  const statusCode = err.statusCode || 500;

  // Don't expose stack traces in production
  const error = {
    message: err.message,
    stack: config.environment === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json({
    success: false,
    error,
  });
};