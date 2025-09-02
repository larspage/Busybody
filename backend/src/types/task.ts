import { z } from 'zod';
import { TaskRow, TaskInsert, TaskUpdate, TaskStatus, TaskPriority } from './database';

// Export database types
export type Task = TaskRow;
export type CreateTaskDTO = Omit<TaskInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateTaskDTO = Omit<TaskUpdate, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

// Validation schemas
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  priority: z.enum(['low', 'medium', 'high'] as const, {
    required_error: 'Priority is required'
  }),
  status: z.enum(['todo', 'in_progress', 'completed'] as const, {
    required_error: 'Status is required'
  }),
  due_date: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format'
    }),
  tags: z.array(z.string()).default([])
});

export const updateTaskSchema = taskSchema.partial();

export const defaultTaskFormValues: CreateTaskDTO = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  due_date: new Date().toISOString(),
  tags: []
};