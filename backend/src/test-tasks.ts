import { supabase } from './lib/supabase';
import dotenv from 'dotenv';
import { Task } from './types/task';

dotenv.config();

async function testTasks() {
  try {
    // First, sign in to get a user ID
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'your-email@example.com', // Replace with your Supabase user email
      password: 'your-password'        // Replace with your Supabase user password
    });

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('No user ID found');
    }

    console.log('Authenticated as user:', userId);

    // Create a test task
    const { data: createData, error: createError } = await (supabase
      .from('tasks')
      .insert({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'todo',
        priority: 'medium',
        due_date: new Date().toISOString(),
        tags: ['test', 'api'],
        user_id: userId
      } as any)
      .select()
      .single() as any);

    if (createError) {
      throw new Error(`Create error: ${createError.message}`);
    }

    const createdTask = createData as Task;
    console.log('Created task:', createdTask);

    // Get the task
    const { data: getData, error: getError } = await (supabase
      .from('tasks')
      .select()
      .eq('id', createdTask.id)
      .single() as any);

    if (getError) {
      throw new Error(`Get error: ${getError.message}`);
    }

    const retrievedTask = getData as Task;
    console.log('Retrieved task:', retrievedTask);

    // Update the task
    const { data: updateData, error: updateError } = await (supabase
      .from('tasks')
      .update({
        status: 'in_progress',
        description: 'This task has been updated'
      } as any)
      .eq('id', createdTask.id)
      .select()
      .single() as any);

    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
    }

    const updatedTask = updateData as Task;
    console.log('Updated task:', updatedTask);

    // Delete the task
    const { error: deleteError } = await (supabase
      .from('tasks')
      .delete()
      .eq('id', createdTask.id) as any);

    if (deleteError) {
      throw new Error(`Delete error: ${deleteError.message}`);
    }

    console.log('Successfully deleted task');

    // Verify deletion
    const { data: verifyData, error: verifyError } = await (supabase
      .from('tasks')
      .select()
      .eq('id', createdTask.id)
      .single() as any);

    if (verifyError && verifyError.code === 'PGRST116') {
      console.log('Verified task was deleted');
    } else if (!verifyError) {
      throw new Error('Task was not deleted');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Add script to package.json
// "scripts": {
//   ...
//   "test:tasks": "ts-node src/test-tasks.ts"
// }

testTasks().catch(console.error);