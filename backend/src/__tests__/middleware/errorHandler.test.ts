import { Request, Response } from 'express';
import { errorHandler } from '../../middleware/errorHandler';
import { config } from '../../config';
import { AppError, ValidationError, NotFoundError } from '../../types/errors';

// Mock Sentry module
jest.mock('@sentry/node', () => {
  const mockScope = {
    setContext: jest.fn(),
  };
  return {
    init: jest.fn(),
    getCurrentHub: jest.fn(() => ({ getClient: jest.fn() })),
    withScope: jest.fn((callback) => callback(mockScope)),
    captureException: jest.fn(),
    Scope: jest.fn(),
    mockScope, // Export for test assertions
  };
});

// Import Sentry after mocking
import * as Sentry from '@sentry/node';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let originalEnv: string;

  beforeEach(() => {
    mockRequest = {
      url: '/test',
      method: 'GET',
      query: { test: 'value' },
      headers: { 'content-type': 'application/json' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    originalEnv = config.environment;
    (config as any).environment = 'development';
    
    // Clear mock calls
    jest.clearAllMocks();
  });

  afterEach(() => {
    (config as any).environment = originalEnv;
    jest.clearAllMocks();
  });

  it('should handle AppError instances correctly', () => {
    const error = new AppError('Test error', 400, 'TEST_ERROR', { detail: 'test' });

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Test error',
        code: 'TEST_ERROR',
        stack: expect.any(String),
        details: { detail: 'test' },
      },
    });
  });

  it('should convert regular Error to AppError with 500 status', () => {
    const error = new Error('Regular error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Regular error',
        stack: expect.any(String),
      },
    });
  });

  it('should handle ValidationError with details', () => {
    const error = new ValidationError('Invalid input', {
      errors: [{ path: ['field'], message: 'Required' }],
    } as any);

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Invalid input',
        code: 'VALIDATION_ERROR',
        stack: expect.any(String),
        details: { zodErrors: [{ path: ['field'], message: 'Required' }] },
      },
    });
  });

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('User');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'User not found',
        code: 'NOT_FOUND',
        stack: expect.any(String),
      },
    });
  });

  it('should not include stack trace in production', () => {
    (config as any).environment = 'production';
    const error = new AppError('Production error', 400);

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Production error',
        stack: undefined,
      },
    });
  });

  it('should set Sentry context and capture exception when configured', () => {
    const error = new AppError('Sentry error');
    const mockUser = { id: '123' };
    mockRequest = {
      ...mockRequest,
      user: mockUser,
    } as Partial<Request>;

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect((Sentry as any).mockScope.setContext).toHaveBeenCalledWith('request', {
      url: '/test',
      method: 'GET',
      query: { test: 'value' },
      headers: { 'content-type': 'application/json' },
      userId: '123',
    });
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('should use default message for undefined error message', () => {
    const error = new Error();
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'An unexpected error occurred',
        stack: expect.any(String),
      },
    });
  });
});