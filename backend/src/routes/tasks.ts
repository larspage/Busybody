import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../types/errors';
import { taskSchema, updateTaskSchema } from '../types/task';
import { authenticateToken } from '../middleware/auth';
import { taskService } from '../services/task.service';
import { AuthRequest, AuthRequestHandler } from '../types/auth';

export const tasksRouter = Router();

// Protect all task routes
tasksRouter.use(authenticateToken as AuthRequestHandler);

// Create task
const createTask: AuthRequestHandler = async (req, res, next) => {
  try {
    const taskData = taskSchema.parse(req.body);
    const task = await taskService.createTask(taskData, req.user!.id);
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError('Invalid task data', error));
    } else {
      next(error);
    }
  }
};

// Get all tasks
const getAllTasks: AuthRequestHandler = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user!.id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get task by id
const getTaskById: AuthRequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user!.id);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Update task
const updateTask: AuthRequestHandler = async (req, res, next) => {
  try {
    const taskData = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(
      req.params.id,
      req.user!.id,
      taskData
    );
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError('Invalid task data', error));
    } else {
      next(error);
    }
  }
};

// Delete task
const deleteTask: AuthRequestHandler = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Register routes
tasksRouter.post('/', createTask);
tasksRouter.get('/', getAllTasks);
tasksRouter.get('/:id', getTaskById);
tasksRouter.patch('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);