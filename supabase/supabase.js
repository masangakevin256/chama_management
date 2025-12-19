import ENV from "../env.js";

const supabase = window.supabase.createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY
);

export default supabase;
