// Test script to verify Supabase connection and schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test 1: Check if we can query tables
    console.log('\n=== Test 1: Query hustles table ===');
    const { data: hustles, error: hustlesError } = await supabase
      .from('hustles')
      .select('id, name')
      .limit(5);

    if (hustlesError) {
      console.error('Error querying hustles:', hustlesError);
    } else {
      console.log('Hustles found:', hustles?.length || 0);
      if (hustles?.length > 0) {
        console.log('Sample:', hustles[0]);
      }
    }

    // Test 2: Check if we can query transactions table
    console.log('\n=== Test 2: Query transactions table ===');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, type, amount')
      .limit(5);

    if (transactionsError) {
      console.error('Error querying transactions:', transactionsError);
    } else {
      console.log('Transactions found:', transactions?.length || 0);
    }

    // Test 3: Try to insert a test transaction (will be deleted)
    console.log('\n=== Test 3: Try insert (requires auth) ===');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user - insert test skipped');
    } else {
      console.log('Authenticated as:', user.email);
      
      // Get a hustle_id to use
      if (hustles && hustles.length > 0) {
        const testHustleId = hustles[0].id;
        const { data: insertResult, error: insertError } = await supabase
          .from('transactions')
          .insert([{
            hustle_id: testHustleId,
            type: 'income',
            amount: 1.00,
            category: 'test',
            description: 'Test transaction - can be deleted'
          }]);

        if (insertError) {
          console.error('Insert failed:', insertError);
        } else {
          console.log('Insert succeeded!');
          // Clean up test transaction
          if (insertResult && insertResult[0]?.id) {
            await supabase.from('transactions').delete().eq('id', insertResult[0].id);
            console.log('Test transaction cleaned up');
          }
        }
      } else {
        console.log('No hustles available for insert test');
      }
    }

    console.log('\n=== Tests Complete ===');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
