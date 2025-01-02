import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your .env file."
  );
}

// Singleton Supabase client instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token'
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    });
  }
  return supabaseInstance;
};

// Enhanced connection test with detailed diagnostics
const testConnection = async () => {
  const supabase = getSupabaseClient();
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Connection timed out after 5 seconds'));
      }, 5000);
    });

    // Create the Supabase query promise
    const queryPromise = supabase
      .from("profiles")
      .select("count(*)", { 
        count: "exact", 
        head: true
      });

    // Race the promises with proper type handling
    const result = await Promise.race<typeof queryPromise | typeof timeoutPromise>([
      queryPromise,
      timeoutPromise
    ]);

    // Handle the result
    if ('error' in result) {
      const { error } = result;
      console.error("Supabase connection failed:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack,
        url: supabaseUrl,
        timestamp: new Date().toISOString(),
        request: {
          method: 'GET',
          path: '/profiles',
          params: { select: 'count(*)' }
        }
      });
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("Critical Supabase connection error:", {
      error: error.toString(),
      url: supabaseUrl,
      timestamp: new Date().toISOString(),
      stack: error.stack,
      request: {
        method: 'GET',
        path: '/profiles',
        params: { select: 'count(*)' }
      }
    });
    throw new Error("Failed to establish connection with Supabase");
  }
};

// Run connection test on initialization
testConnection().catch((error) => {
  console.error("Supabase initialization failed:", {
    error: error.toString(),
    url: supabaseUrl,
    timestamp: new Date().toISOString(),
    stack: error.stack
  });
  throw error;
});

export const supabase = getSupabaseClient();
