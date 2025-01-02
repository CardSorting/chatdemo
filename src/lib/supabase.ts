import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkTableExists(tableName: string) {
  try {
    // Check if table exists in public schema
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();

    if (tableError) throw tableError;

    if (!tableExists) {
      return {
        exists: false,
        schema: 'public',
        rlsEnabled: false,
        policies: []
      };
    }

    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('pg_tables')
      .select('rls_enabled')
      .eq('schemaname', 'public')
      .eq('tablename', tableName)
      .single();

    if (rlsError) throw rlsError;

    // Get RLS policies if enabled
    let policies = [];
    if (rlsStatus?.rls_enabled) {
      const { data: policyData, error: policyError } = await supabase
        .from('pg_policy')
        .select('polname, polcmd, polroles')
        .eq('schemaname', 'public')
        .eq('tablename', tableName);

      if (policyError) throw policyError;
      policies = policyData || [];
    }

    return {
      exists: true,
      schema: 'public',
      rlsEnabled: rlsStatus?.rls_enabled || false,
      policies
    };
  } catch (error) {
    console.error('Error checking table status:', error);
    throw error;
  }
}
