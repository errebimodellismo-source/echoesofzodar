import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oaqjsuaqbzkvoljbmmjx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcWpzdWFxYnprdm9samJtbWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTYzNDcsImV4cCI6MjA4ODUzMjM0N30.nvi-TG4PgnE6rpN96m99ypmJmYe_jt0rnyQJxfIdt70"

export const supabase = createClient(supabaseUrl, supabaseKey)
