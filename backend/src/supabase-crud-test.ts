import dotenv from 'dotenv';
import { supabase } from './lib/supabase';
import { config } from './config';

// Load environment variables
dotenv.config();

interface TestResult {
  operation: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
}

class SupabaseCRUDTester {
  private results: TestResult[] = [];

  private async executeTest(operation: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const data = await testFn();
      const duration = Date.now() - startTime;
      const result: TestResult = { operation, success: true, data, duration };
      this.results.push(result);
      console.log(`✅ ${operation} - ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const result: TestResult = { operation, success: false, error: errorMessage, duration };
      this.results.push(result);
      console.log(`❌ ${operation} - ${errorMessage} (${duration}ms)`);
      return result;
    }
  }

  async testConnectivity(): Promise<void> {
    console.log('\n🔗 Testing Supabase Connectivity...');
    console.log(`URL: ${config.supabase.url}`);
    console.log(`API Key: ${config.supabase.apiKey.substring(0, 20)}...`);
    
    await this.executeTest('Connection Test', async () => {
      const { data, error } = await supabase.from('tasks').select('count', { count: 'exact', head: true });
      if (error) throw new Error(`Connection failed: ${error.message}`);
      return { connected: true, taskCount: data };
    });
  }

  async testTasksCRUD(): Promise<void> {
    console.log('\n📋 Testing Tasks Table CRUD Operations...');
    
    let createdTaskId: string | null = null;
    
    // First, we need to create a test user or use existing auth
    // For this test, we'll use a mock user ID
    const testUserId = 'test-user-' + Date.now();
    
    // CREATE - Insert a new task
    const createResult = await this.executeTest('CREATE Task', async () => {
      const newTask = {
        title: 'Test Task - ' + Date.now(),
        description: 'This is a test task created by CRUD test',
        status: 'todo' as const,
        priority: 'medium' as const,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        tags: ['test', 'crud', 'automated'],
        user_id: testUserId
      };
      
      const { data, error } = await (supabase
        .from('tasks')
        .insert(newTask as any)
        .select()
        .single() as any);
        
      if (error) throw new Error(`Create failed: ${error.message}`);
      if (!data) throw new Error('No data returned from create');
      
      createdTaskId = data.id;
      return data;
    });

    if (!createdTaskId) {
      console.log('❌ Skipping remaining CRUD tests - CREATE failed');
      return;
    }

    // READ - Get the created task
    await this.executeTest('READ Task', async () => {
      const { data, error } = await (supabase
        .from('tasks')
        .select('*')
        .eq('id', createdTaskId!)
        .single() as any);
        
      if (error) throw new Error(`Read failed: ${error.message}`);
      if (!data) throw new Error('Task not found');
      
      return data;
    });

    // UPDATE - Modify the task
    await this.executeTest('UPDATE Task', async () => {
      const updates = {
        status: 'in_progress' as const,
        description: 'Updated description - test completed',
        priority: 'high' as const
      };
      
      const { data, error } = await (supabase
        .from('tasks')
        .update(updates as any)
        .eq('id', createdTaskId!)
        .select()
        .single() as any);
        
      if (error) throw new Error(`Update failed: ${error.message}`);
      if (!data) throw new Error('No data returned from update');
      
      return data;
    });

    // LIST - Get all tasks for the user
    await this.executeTest('LIST Tasks', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', testUserId)
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(`List failed: ${error.message}`);
      
      return { count: data?.length || 0, tasks: data };
    });

    // DELETE - Remove the test task
    await this.executeTest('DELETE Task', async () => {
      const { error } = await (supabase
        .from('tasks')
        .delete()
        .eq('id', createdTaskId!) as any);
        
      if (error) throw new Error(`Delete failed: ${error.message}`);
      
      return { deleted: true, taskId: createdTaskId };
    });
  }

  async testApplicationsTable(): Promise<void> {
    console.log('\n🏢 Testing Applications Table...');
    
    await this.executeTest('READ Applications', async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*');
        
      if (error) throw new Error(`Applications read failed: ${error.message}`);
      
      return { count: data?.length || 0, applications: data };
    });
  }

  async testSubscriptionsTable(): Promise<void> {
    console.log('\n💳 Testing User App Subscriptions Table...');
    
    await this.executeTest('READ Subscriptions', async () => {
      const { data, error } = await supabase
        .from('user_app_subscriptions')
        .select('*')
        .limit(5); // Limit to avoid too much data
        
      if (error) throw new Error(`Subscriptions read failed: ${error.message}`);
      
      return { count: data?.length || 0, subscriptions: data };
    });
  }

  async testTableSchemas(): Promise<void> {
    console.log('\n📊 Testing Table Schemas...');
    
    const tables = ['tasks', 'applications', 'user_app_subscriptions'];
    
    for (const table of tables) {
      await this.executeTest(`Schema Check - ${table}`, async () => {
        // Try to get one record to verify schema
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found" which is OK
          throw new Error(`Schema check failed: ${error.message}`);
        }
        
        return { table, accessible: true, hasData: data && data.length > 0 };
      });
    }
  }

  printSummary(): void {
    console.log('\n📊 Test Summary');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => r.success === false).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Success Rate: ${((successful / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.operation}: ${r.error}`);
      });
    }
    
    console.log('\n✅ Successful Tests:');
    this.results.filter(r => r.success).forEach(r => {
      console.log(`  - ${r.operation} (${r.duration}ms)`);
    });
  }
}

async function runSupabaseCRUDTest(): Promise<void> {
  console.log('🚀 Starting Supabase CRUD Test Suite');
  console.log('='.repeat(50));
  
  const tester = new SupabaseCRUDTester();
  
  try {
    await tester.testConnectivity();
    await tester.testTableSchemas();
    await tester.testApplicationsTable();
    await tester.testSubscriptionsTable();
    await tester.testTasksCRUD();
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    tester.printSummary();
  }
}

// Run the tests
if (require.main === module) {
  runSupabaseCRUDTest()
    .then(() => {
      console.log('\n🏁 Test suite completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test suite crashed:', error);
      process.exit(1);
    });
}

export { SupabaseCRUDTester, runSupabaseCRUDTest };
