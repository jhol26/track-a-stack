import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Hustle = Database['public']['Tables']['hustles']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TimeLog = Database['public']['Tables']['time_logs']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']

export type NewHustle = Database['public']['Tables']['hustles']['Insert']
export type NewTransaction = Database['public']['Tables']['transactions']['Insert']
export type NewTimeLog = Database['public']['Tables']['time_logs']['Insert']
export type NewGoal = Database['public']['Tables']['goals']['Insert']
