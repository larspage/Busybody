import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Supabase Configuration Verification');
console.log('='.repeat(50));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

console.log('📋 Environment Variables:');
console.log(`SUPABASE_URL: ${supabaseUrl || 'NOT SET'}`);
console.log(`SUPABASE_API_KEY: ${supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET'}`);

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing Supabase environment variables!');
  console.log('Please ensure SUPABASE_URL and SUPABASE_API_KEY are set in your .env file');
  process.exit(1);
}

console.log('\n🌐 Testing URL accessibility...');

// Test if the URL is reachable
async function testUrlReachability(url: string): Promise<boolean> {
  try {
    // Use Node.js built-in fetch (available in Node 18+)
    const response = await fetch(url);
    return response.ok || response.status < 500; // Accept any non-server-error response
  } catch (error) {
    console.log(`❌ URL not reachable: ${error}`);
    return false;
  }
}

async function verifySupabase() {
  // Test base URL
  console.log(`\n🔗 Testing base URL: ${supabaseUrl}`);
  const baseReachable = await testUrlReachability(supabaseUrl!);
  
  if (!baseReachable) {
    console.log('❌ Base URL is not reachable');
    console.log('\n💡 This suggests either:');
    console.log('   1. The Supabase project doesn\'t exist');
    console.log('   2. The URL is incorrect');
    console.log('   3. Network connectivity issues');
    console.log('   4. The project has been deleted or suspended');
    return false;
  }
  
  // Test REST API endpoint
  const restUrl = `${supabaseUrl}/rest/v1/`;
  console.log(`\n🔗 Testing REST API: ${restUrl}`);
  const restReachable = await testUrlReachability(restUrl);
  
  if (!restReachable) {
    console.log('❌ REST API endpoint is not reachable');
    return false;
  }
  
  // Test with API key
  console.log('\n🔑 Testing API key authentication...');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ API key authentication successful');
      return true;
    } else {
      console.log(`❌ API key authentication failed: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.log('Response body:', text);
      return false;
    }
  } catch (error) {
    console.log(`❌ API key test failed: ${error}`);
    return false;
  }
}

verifySupabase()
  .then((success) => {
    if (success) {
      console.log('\n✅ Supabase configuration is valid!');
      console.log('You can proceed with database operations.');
    } else {
      console.log('\n❌ Supabase configuration issues detected!');
      console.log('\n🛠️ Next steps:');
      console.log('1. Verify your Supabase project exists at https://supabase.com/dashboard');
      console.log('2. Check that the URL and API key are correct');
      console.log('3. Ensure the project is not paused or deleted');
      console.log('4. Create a new Supabase project if needed');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Verification crashed:', error);
    process.exit(1);
  });
