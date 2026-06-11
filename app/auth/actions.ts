'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { sendWelcomeEmail } from '@/utils/resend'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const handle = formData.get('handle') as string

  // 1. Basic validation (should also be on client side)
  if (!handle || handle.length < 3) {
    return redirect('/signup?error=Handle must be at least 3 characters')
  }

  // 2. Check if handle is taken
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('handle')
    .eq('handle', handle)
    .single()

  if (existingProfile) {
    return redirect('/signup?error=Handle is already taken')
  }

  // 3. Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
    },
  })

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    // 4. Create profile record
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      handle: handle,
    })

    if (profileError) {
      // In a real app, you might want to cleanup the user if profile creation fails,
      // but Supabase Auth signups are often async (email confirmation).
      return redirect(`/signup?error=${encodeURIComponent(profileError.message)}`)
    }

    // 5. Send welcome email (via Resend)
    await sendWelcomeEmail(email, handle)
  }

  return redirect('/signup?message=Check your email to confirm your account')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
