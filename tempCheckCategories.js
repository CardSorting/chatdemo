require('dotenv').config({ path: '.env' });
console.log('Loaded environment variables:', {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
});

const { supabase } = require('./src/lib/supabase');

(async () => {
  try {
    console.log('Checking Supabase connection...');
    
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('companions')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('Supabase connection error:', testError);
      return;
    }
    
    console.log('Supabase connection successful. Test data:', testData);

    // Check if categories table exists
    console.log('Checking if categories table exists...');
    const { data: tableExists, error: tableError } = await supabase
      .rpc('table_exists', { table_name: 'categories' });
      
    if (tableError) {
      console.error('Error checking table existence:', tableError);
      return;
    }
    
    if (!tableExists) {
      console.log('Categories table does not exist');
      return;
    }

    // Get categories data
    console.log('Fetching categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
      
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }
    
    console.log('Categories:', categories);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
})();