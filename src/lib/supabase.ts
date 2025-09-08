// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

// Define a function that creates the client, so we can pass in the keys
// This is necessary because process.env is not available in the browser
// directly in client components.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
