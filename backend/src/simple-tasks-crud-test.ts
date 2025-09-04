import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_API_KEY!;

console.log('🚀 Starting Tasks Table CRUD Test');
console.log('='.repeat(50));

async function testTasksCRUD() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Generate a proper UUID for testing
  const testUserId = uuidv4();
  let createdTaskId: string | null = null;
  
  console.log(`🆔 Using test user ID: ${testUserId}`);
  
  try {
    // Step 1: CREATE - Insert a new task
    console.log('\n➕ Step 1: CREATE Task');
    const newTask = {
      title: `Test Task ${Date.now()}`,
      description: 'This is a test task for CRUD verification',
      status: 'todo',
      priority: 'medium',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      tags: ['test', 'crud', 'verification'],
      user_id: testUserId
    };
    
    const { data: createData, error: createError } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();
    
    if (createError) {
      console.log('❌ CREATE failed:', createError.message);
      console.log('Error details:', createError);
      return false;
    }
    
    createdTaskId = createData.id;
    console.log(`✅ CREATE successful!`);
    console.log(`   Task ID: ${createdTaskId}`);
    console.log(`   Title: ${createData.title}`);
    console.log(`   Status: ${createData.status}`);
    
    // Step 2: READ - Get the created task
    console.log('\n📖 Step 2: READ Task');
    const { data: readData, error: readError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', createdTaskId)
      .single();
    
    if (readError) {
      console.log('❌ READ failed:', readError.message);
      return false;
    }
    
    console.log('✅ READ successful!');
    console.log(`   Retrieved: ${readData.title}`);
    console.log(`   Description: ${readData.description}`);
    console.log(`   Due Date: ${readData.due_date}`);
    console.log(`   Tags: ${readData.tags?.join(', ')}`);
    
    // Step 3: UPDATE - Modify the task
    console.log('\n✏️ Step 3: UPDATE Task');
    const updates = {
      status: 'in_progress',
      description: 'Updated: This task has been modified by CRUD test',
      priority: 'high'
    };
    
    const { data: updateData, error: updateError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', createdTaskId)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ UPDATE failed:', updateError.message);
      return false;
    }
    
    console.log('✅ UPDATE successful!');
    console.log(`   New Status: ${updateData.status}`);
    console.log(`   New Priority: ${updateData.priority}`);
    console.log(`   New Description: ${updateData.description}`);
    
    // Step 4: LIST - Get all tasks for the user
    console.log('\n📋 Step 4: LIST Tasks');
    const { data: listData, error: listError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false });
    
    if (listError) {
      console.log('❌ LIST failed:', listError.message);
      return false;
    }
    
    console.log(`✅ LIST successful! Found ${listData?.length || 0} tasks`);
    listData?.forEach((task, index) => {
      console.log(`   ${index + 1}. ${task.title} (${task.status})`);
    });
    
    // Step 5: DELETE - Remove the test task
    console.log('\n🗑️ Step 5: DELETE Task');
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', createdTaskId);
    
    if (deleteError) {
      console.log('❌ DELETE failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ DELETE successful!');
    console.log(`   Task ${createdTaskId} has been removed`);
    
    // Step 6: VERIFY DELETE - Confirm task is gone
    console.log('\n🔍 Step 6: VERIFY DELETE');
    const { data: verifyData, error: verifyError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', createdTaskId)
      .single();
    
    if (verifyError && verifyError.code === 'PGRST116') {
      console.log('✅ VERIFY DELETE successful! Task no longer exists');
    } else if (verifyError) {
      console.log('❌ VERIFY DELETE failed:', verifyError.message);
      return false;
    } else {
      console.log('❌ VERIFY DELETE failed: Task still exists!');
      return false;
    }
    
    console.log('\n🎉 ALL CRUD OPERATIONS SUCCESSFUL!');
    console.log('='.repeat(50));
    console.log('✅ CREATE: Task inserted successfully');
    console.log('✅ READ: Task retrieved successfully');  
    console.log('✅ UPDATE: Task modified successfully');
    console.log('✅ LIST: Tasks queried successfully');
    console.log('✅ DELETE: Task removed successfully');
    console.log('✅ VERIFY: Deletion confirmed');
    
    return true;
    
  } catch (error) {
    console.log('💥 CRUD test crashed:', error);
    
    // Cleanup: Try to delete the test task if it exists
    if (createdTaskId) {
      console.log('\n🧹 Cleaning up test data...');
      try {
        await supabase.from('tasks').delete().eq('id', createdTaskId);
        console.log('✅ Cleanup successful');
      } catch (cleanupError) {
        console.log('❌ Cleanup failed:', cleanupError);
      }
    }
    
    return false;
  }
}

// Run the test
testTasksCRUD()
  .then((success) => {
    if (success) {
      console.log('\n🏆 Tasks CRUD Test: PASSED');
      process.exit(0);
    } else {
      console.log('\n💔 Tasks CRUD Test: FAILED');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  });
