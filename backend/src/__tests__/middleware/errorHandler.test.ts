import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { errorHandler } from '../../middleware/errorHandler';
import { config } from '../../config';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let originalEnv: string;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    originalEnv = config.environment;
    (config as any).environment = 'development';
  });

  afterEach(() => {
    (config as any).environment = originalEnv;
  });

  it('should handle errors with status code', () => {
    const error = new Error('Test error');
    (error as any).statusCode = 400;

    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Test error',
        stack: expect.any(String),
      },
    });
  });

  it('should use 500 status code for errors without status code', () => {
    const error = new Error('Internal error');

    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  it('should not include stack trace in production', () => {
    (config as any).environment = 'production';

    const error = new Error('Production error');
    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Production error',
        stack: undefined,
      },
    });
  });

  it('should call Sentry.captureException when Sentry is configured', () => {
    const error = new Error('Sentry error');
    const sentrySpy = jest.spyOn(Sentry, 'captureException');

    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(sentrySpy).toHaveBeenCalledWith(error);
  });
});