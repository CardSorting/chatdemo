import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log environment variable status
console.log("Supabase Config:", {
  url: supabaseUrl ? "✅ Present" : "❌ Missing",
  key: supabaseAnonKey ? "✅ Present" : "❌ Missing",
});

// Provide default values for development
const url = supabaseUrl || "https://your-project-url.supabase.co";
const anonKey = supabaseAnonKey || "your-anon-key";

// Create the client
export const supabase = createClient(url, anonKey);

// Test the connection without throwing
supabase
  .from("profiles")
  .select("count(*)", { count: "exact", head: true })
  .then(({ error }) => {
    if (error) {
      console.error("Supabase connection failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
    } else {
      console.log("✅ Supabase connection successful");
    }
  });
