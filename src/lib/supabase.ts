import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qutxqmwxoednswgorbjr.supabase.co";
const supabaseAnonKey = "c9e7f49814cdb51cab88b95c154afce4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
