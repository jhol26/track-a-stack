import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getSession() {
  const cookieStore = await cookies()
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })

  const authToken = cookieStore.get('auth-token')?.value

  if (!authToken) {
    return null
  }

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  return session
}

export async function getUser() {
  const session = await getSession()
  return session?.user ?? null
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function signUp(email: string, password: string) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signUp({ email, password })
}

export async function signIn(email: string, password: string) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })
}

export async function signOut() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signOut()
}
