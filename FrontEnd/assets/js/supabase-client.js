import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://fylxzjgcvylsqipisozz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bHh6amdjdnlsc3FpcGlzb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODgyNjksImV4cCI6MjA4MDg2NDI2OX0.OpiME6EUSrVlS4ypw9qZDJYXaHvU3Coe5jGTSONdTeI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);