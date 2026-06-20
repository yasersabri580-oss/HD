import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load .env.local explicitly for local/CLI builds (won't override real envs)
try {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath })
} catch (err) {
  // ignore dotenv errors
}

const clean = (v?: string) => (v ? v.trim().replace(/^['\"]|['\"]$/g, '') : '')

const SUPABASE_URL = clean(process.env.NEXT_PUBLIC_SUPABASE_URL)
const SUPABASE_ANON_KEY = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

let supabase: any = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  // Fallback stub client to avoid build-time crashes when envs are absent.
  console.warn('Supabase env vars not found. Falling back to a stub client. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel project settings for production.')

  class FakeQuery {
    private singleMode = false
    select(..._args: any[]) { return this }
    eq(..._args: any[]) { return this }
    order(..._args: any[]) { return this }
    limit(..._args: any[]) { return this }
    single() { this.singleMode = true; return this }
    maybeSingle() { this.singleMode = true; return this }
    then(onFulfilled?: any, onRejected?: any) {
      const res = this.singleMode ? { data: null, error: null } : { data: [], error: null }
      try {
        return Promise.resolve(onFulfilled ? onFulfilled(res) : res)
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }

  const fakeClient = {
    from: (_table: string) => new FakeQuery(),
    storage: { from: () => ({ getPublicUrl: () => ({ publicURL: '' }) }) },
    auth: { getUser: async () => null },
  } as any

  supabase = fakeClient
}

export { supabase }