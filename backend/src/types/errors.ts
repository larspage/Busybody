import { z } from 'zod';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    stack?: string;
    details?: Record<string, unknown>;
  };
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON(): ErrorResponse['error'] {
    return {
      message: this.message || 'An unexpected error occurred',
      code: this.code,
      stack: this.stack,
      details: this.details,
    };
  }
}

// Common error types
export class ValidationError extends AppError {
  constructor(message: string, details?: z.ZodError) {
    super(
      message,
      400,
      'VALIDATION_ERROR',
      details ? { zodErrors: details.errors } : undefined
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(
      `${resource} not found`,
      404,
      'NOT_FOUND'
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}