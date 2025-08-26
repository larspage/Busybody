import request from 'supertest';
import express from 'express';
import { healthRouter } from '../../routes/health';
import { config } from '../../config';

describe('Health Check Endpoint', () => {
  const app = express();
  app.use('/health', healthRouter);

  it('should return 200 and healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      environment: config.environment,
    });
  });

  it('should return ISO timestamp', async () => {
    const response = await request(app).get('/health');
    
    // Verify timestamp is valid ISO format
    expect(() => new Date(response.body.timestamp)).not.toThrow();
  });
});