import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../types/task';

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
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format'
    }),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).default([])
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const defaultTaskFormValues: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: new Date().toISOString().split('T')[0],
  tags: []
};