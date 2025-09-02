import request from 'supertest';
import express from 'express';
import { authRouter } from '../../routes/auth';
import { errorHandler } from '../../middleware/errorHandler';

describe('Auth API Endpoints', () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use(errorHandler);

  const mockUser = {
    email: 'test@example.com',
    password: 'TestPass123',
    name: 'Test User'
  };

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        user: {
          id: expect.any(String),
          email: mockUser.email,
          name: mockUser.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        },
        token: expect.any(String)
      });
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return validation error for invalid user data', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // too short
          name: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send(mockUser);

      // Attempt duplicate registration
      const response = await request(app)
        .post('/auth/register')
        .send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Email already registered');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/auth/register')
        .send(mockUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        user: {
          email: mockUser.email,
          name: mockUser.name
        },
        token: expect.any(String)
      });
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: mockUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Invalid email or password');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPass123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Invalid email or password');
    });
  });

  describe('POST /auth/logout', () => {
    it('should return success message', async () => {
      const response = await request(app)
        .post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Logged out successfully'
      });
    });
  });
});