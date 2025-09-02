import request from 'supertest';
import express from 'express';
import { tasksRouter } from '../../routes/tasks';
import { errorHandler } from '../../middleware/errorHandler';
import { Task } from '../../types/task';

describe('Tasks API Endpoints', () => {
  const app = express();
  app.use(express.json());
  app.use('/tasks', tasksRouter);
  app.use(errorHandler);

  const mockTask = {
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium' as const,
    status: 'todo' as const,
    dueDate: '2025-12-31',
    tags: ['test']
  };

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(mockTask);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        ...mockTask,
        id: expect.any(String),
        userId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return validation error for invalid task data', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: '',
          description: '',
          priority: 'invalid',
          status: 'invalid',
          dueDate: 'invalid-date'
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/tasks');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      // First create a task
      const createResponse = await request(app)
        .post('/tasks')
        .send(mockTask);
      
      const taskId = createResponse.body.id;
      
      const response = await request(app)
        .get(`/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...mockTask,
        id: taskId
      });
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/tasks/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', async () => {
      // First create a task
      const createResponse = await request(app)
        .post('/tasks')
        .send(mockTask);
      
      const taskId = createResponse.body.id;
      
      const updateData = {
        title: 'Updated Title',
        status: 'in_progress' as const
      };

      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...mockTask,
        ...updateData,
        id: taskId
      });
    });

    it('should return 404 for updating non-existent task', async () => {
      const response = await request(app)
        .patch('/tasks/non-existent-id')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      // First create a task
      const createResponse = await request(app)
        .post('/tasks')
        .send(mockTask);
      
      const taskId = createResponse.body.id;
      
      const response = await request(app)
        .delete(`/tasks/${taskId}`);

      expect(response.status).toBe(204);

      // Verify task is deleted
      const getResponse = await request(app)
        .get(`/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for deleting non-existent task', async () => {
      const response = await request(app)
        .delete('/tasks/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});