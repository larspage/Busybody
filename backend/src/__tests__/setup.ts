import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock Sentry
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  Handlers: {
    requestHandler: jest.fn(() => (req: any, res: any, next: any) => next()),
    errorHandler: jest.fn(() => (err: any, req: any, res: any, next: any) => next(err)),
  },
  captureException: jest.fn(),
}));

// Mock Axiom
jest.mock('@axiomhq/js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    ingest: jest.fn().mockResolvedValue(undefined),
  })),
}));