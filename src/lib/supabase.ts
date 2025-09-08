// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

// This file is intended to be used in client components
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
