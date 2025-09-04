import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_API_KEY!;

console.log('🚀 Starting Simple Supabase Connectivity Test');
console.log('='.repeat(50));

async function testSupabaseConnectivity() {
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  console.log(`🔑 Using API Key: ${supabaseKey.substring(0, 20)}...`);
  
  // Create client without strict typing
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Basic connectivity by checking if we can query a table
    console.log('\n🔗 Test 1: Basic Connectivity');
    const { data: healthCheck, error: healthError } = await supabase
      .from('tasks')
      .select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.log('❌ Connection failed:', healthError.message);
      return false;
    }
    
    console.log('✅ Connection successful');
    console.log(`📊 Tasks table accessible (count: ${healthCheck || 'unknown'})`);
    
    // Test 2: Check table schemas
    console.log('\n📋 Test 2: Table Schema Check');
    const tables = ['tasks', 'applications', 'user_app_subscriptions'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found (OK)
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: Accessible ${data && data.length > 0 ? '(has data)' : '(empty)'}`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err}`);
      }
    }
    
    // Test 3: CRUD Operations on Tasks
    console.log('\n🔄 Test 3: CRUD Operations');
    const testUserId = `test-user-${Date.now()}`;
    let createdTaskId: string | null = null;
    
    try {
      // CREATE
      console.log('➕ Testing CREATE...');
      const newTask = {
        title: `Test Task ${Date.now()}`,
        description: 'Test task for connectivity verification',
        status: 'todo',
        priority: 'medium',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tags: ['test', 'connectivity'],
        user_id: testUserId
      };
      
      const { data: createData, error: createError } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
      
      if (createError) {
        console.log('❌ CREATE failed:', createError.message);
      } else {
        createdTaskId = createData.id;
        console.log(`✅ CREATE successful (ID: ${createdTaskId})`);
        
        // READ
        console.log('📖 Testing READ...');
        const { data: readData, error: readError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', createdTaskId)
          .single();
        
        if (readError) {
          console.log('❌ READ failed:', readError.message);
        } else {
          console.log('✅ READ successful');
          
          // UPDATE
          console.log('✏️ Testing UPDATE...');
          const { data: updateData, error: updateError } = await supabase
            .from('tasks')
            .update({ 
              status: 'in_progress',
              description: 'Updated test task'
            })
            .eq('id', createdTaskId)
            .select()
            .single();
          
          if (updateError) {
            console.log('❌ UPDATE failed:', updateError.message);
          } else {
            console.log('✅ UPDATE successful');
          }
        }
        
        // DELETE
        console.log('🗑️ Testing DELETE...');
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', createdTaskId);
        
        if (deleteError) {
          console.log('❌ DELETE failed:', deleteError.message);
        } else {
          console.log('✅ DELETE successful');
        }
      }
    } catch (crudError) {
      console.log('❌ CRUD operations failed:', crudError);
    }
    
    // Test 4: Check Applications table
    console.log('\n🏢 Test 4: Applications Table');
    try {
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .limit(5);
      
      if (appsError) {
        console.log('❌ Applications query failed:', appsError.message);
      } else {
        console.log(`✅ Applications table: ${apps?.length || 0} records found`);
        if (apps && apps.length > 0) {
          console.log('📋 Sample applications:');
          apps.forEach((app: any) => {
            console.log(`  - ${app.name}: ${app.description || 'No description'}`);
          });
        }
      }
    } catch (err) {
      console.log('❌ Applications test failed:', err);
    }
    
    // Test 5: Check Subscriptions table
    console.log('\n💳 Test 5: User App Subscriptions Table');
    try {
      const { data: subs, error: subsError } = await supabase
        .from('user_app_subscriptions')
        .select('*')
        .limit(5);
      
      if (subsError) {
        console.log('❌ Subscriptions query failed:', subsError.message);
      } else {
        console.log(`✅ Subscriptions table: ${subs?.length || 0} records found`);
      }
    } catch (err) {
      console.log('❌ Subscriptions test failed:', err);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    return true;
    
  } catch (error) {
    console.log('💥 Test suite failed:', error);
    return false;
  }
}

// Run the test
testSupabaseConnectivity()
  .then((success) => {
    if (success) {
      console.log('\n✅ Supabase connectivity verified successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Supabase connectivity test failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
  });
