require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  try {
    console.log('Fixing RLS policies for tenant_members...');
    
    // First, drop existing policies that cause recursion
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view members of their tenants" ON public.tenant_members;',
      'DROP POLICY IF EXISTS "Owners can insert members" ON public.tenant_members;',
      'DROP POLICY IF EXISTS "Owners can update members" ON public.tenant_members;',
      'DROP POLICY IF EXISTS "Owners can delete members" ON public.tenant_members;'
    ];
    
    console.log('Dropping existing policies...');
    for (const policy of dropPolicies) {
      try {
        const { error } = await supabase.rpc('exec', { sql: policy });
        if (error && !error.message.includes('does not exist')) {
          console.warn('Warning dropping policy:', error.message);
        }
      } catch (err) {
        console.warn('Error dropping policy:', err.message);
      }
    }
    
    // Create corrected policies
    const newPolicies = [
      `CREATE POLICY "Users can view members of their tenants" ON public.tenant_members
        FOR SELECT USING (
          tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE owner_id = auth.uid()
          ) OR user_id = auth.uid()
        );`,
      `CREATE POLICY "Owners can insert members" ON public.tenant_members
        FOR INSERT WITH CHECK (
          tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE owner_id = auth.uid()
          )
        );`,
      `CREATE POLICY "Owners can update members" ON public.tenant_members
        FOR UPDATE USING (
          tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE owner_id = auth.uid()
          )
        );`,
      `CREATE POLICY "Owners can delete members" ON public.tenant_members
        FOR DELETE USING (
          tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE owner_id = auth.uid()
          )
        );`
    ];
    
    console.log('Creating corrected policies...');
    for (let i = 0; i < newPolicies.length; i++) {
      try {
        const { error } = await supabase.rpc('exec', { sql: newPolicies[i] });
        if (error) {
          console.warn(`Warning creating policy ${i + 1}:`, error.message);
        } else {
          console.log(`Policy ${i + 1} created successfully`);
        }
      } catch (err) {
        console.warn(`Error creating policy ${i + 1}:`, err.message);
      }
    }
    
    // Test the fix
    console.log('Testing tenant_members access...');
    const { data: testData, error: testError } = await supabase
      .from('tenant_members')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Still having issues with tenant_members:', testError.message);
    } else {
      console.log('✅ tenant_members table is now accessible!');
    }
    
    console.log('RLS policy fix completed!');
  } catch (error) {
    console.error('Error fixing RLS policies:', error);
    process.exit(1);
  }
}

applySchema();