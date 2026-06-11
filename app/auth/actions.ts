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
  const rawHandle = formData.get('handle') as string

  // Clean handle: strip leading @ if present and convert to lowercase
  const handle = (rawHandle.startsWith('@') ? rawHandle.substring(1) : rawHandle).toLowerCase().trim()

  // 1. Basic validation
  if (!handle || handle.length < 3) {
    return redirect('/signup?error=Handle must be at least 3 characters')
  }

  if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
    return redirect('/signup?error=Handle can only contain letters, numbers, and underscores')
  }

  // 2. Check if handle is taken in the profiles table
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('handle')
    .eq('handle', handle)
    .maybeSingle()

  if (existingProfile) {
    return redirect('/signup?error=Handle is already taken')
  }

  // 3. Create user in Supabase Auth with handle in metadata
  // This metadata will be picked up by the database trigger to create the profile record
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
      data: {
        handle: handle,
      },
    },
  })

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // 4. Send welcome email (via Resend)
  if (data.user) {
    const emailResult = await sendWelcomeEmail(email, handle)
    if (emailResult.error) {
      console.warn('Welcome email failed to send, but user was created:', emailResult.error)
    }
  }

  return redirect('/signup?message=Check your email to confirm your account')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
