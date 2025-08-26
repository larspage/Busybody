import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { config } from '../config';
import { AppError, ErrorResponse } from '../types/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Convert to AppError if not already
  const appError = err instanceof AppError ? err : new AppError(
    err.message || 'An unexpected error occurred',
    500
  );

  // Add request context for better error tracking
  if (config.sentry.enabled) {
    // Initialize Sentry with current config if not already done
    if (!Sentry.getCurrentHub().getClient()) {
      Sentry.init({
        dsn: config.sentry.dsn,
        environment: config.sentry.environment,
        release: config.sentry.release,
        sampleRate: config.sentry.sampleRate,
      });
    }
    
    Sentry.withScope((scope) => {
      scope.setContext('request', {
        url: req.url,
        method: req.method,
        query: req.query,
        headers: req.headers,
        userId: (req as any).user?.id,
      });
      Sentry.captureException(err);
    });
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      ...appError.toJSON(),
      // Only include stack trace in development
      stack: config.environment === 'development' ? appError.stack : undefined,
    },
  };

  res.status(appError.statusCode).json(errorResponse);
};