import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://gxsiokjeswgddumssjwj.supabase.co"; 
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4c2lva2plc3dnZGR1bXNzandqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzM3NDcsImV4cCI6MjA3ODM0OTc0N30.U4Zd3530jYLDE1P5c68ImvYT1M1ajG3KVxOj8apfpM4"; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

const PORT = process.env.PORT || 3000;
export { PORT };