import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { NotFoundError } from '../types/errors';
import { supabase } from '../lib/supabase';

export class TaskService {
  async createTask(taskData: CreateTaskDTO, userId: string): Promise<Task> {
    const result = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: userId,
      } as any)
      .select()
      .single();

    if (result.error) {
      throw new Error(`Failed to create task: ${result.error.message}`);
    }

    if (!result.data) {
      throw new Error('Failed to create task: No data returned');
    }

    return result.data as Task;
  }

  async getTasks(userId: string): Promise<Task[]> {
    const result = await supabase
      .from('tasks')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (result.error) {
      throw new Error(`Failed to fetch tasks: ${result.error.message}`);
    }

    return (result.data || []) as Task[];
  }

  async getTaskById(taskId: string, userId: string): Promise<Task> {
    const result = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        throw new NotFoundError('Task');
      }
      throw new Error(`Failed to fetch task: ${result.error.message}`);
    }

    if (!result.data) {
      throw new NotFoundError('Task');
    }

    return result.data as Task;
  }

  async updateTask(taskId: string, userId: string, updateData: UpdateTaskDTO): Promise<Task> {
    const result = await supabase
      .from('tasks')
      .update(updateData as any)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        throw new NotFoundError('Task');
      }
      throw new Error(`Failed to update task: ${result.error.message}`);
    }

    if (!result.data) {
      throw new NotFoundError('Task');
    }

    return result.data as Task;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const result = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        throw new NotFoundError('Task');
      }
      throw new Error(`Failed to delete task: ${result.error.message}`);
    }
  }
}

// Export a singleton instance
export const taskService = new TaskService();