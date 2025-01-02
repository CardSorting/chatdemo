import { supabase } from './src/lib/supabase';

(async () => {
  try {
    // First check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .rpc('table_exists', { table_name: 'categories' });
      
    if (tableError) throw tableError;
    
    if (!tableExists) {
      console.log('Categories table does not exist');
      return;
    }

    // If table exists, get its data
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
      
    if (categoriesError) throw categoriesError;
    
    console.log('Categories:', categories);
  } catch (error) {
    console.error('Error:', error);
  }
})();