'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function addBookmark(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Verify profile exists (satisfies foreign key)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, handle')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // Attempt to "auto-repair" missing profile for existing users using their metadata handle
    const metadataHandle = user.user_metadata?.handle
    
    if (!metadataHandle) {
      throw new Error('Your profile is incomplete (missing handle). Please contact support.')
    }

    const supabaseAdmin = createAdminClient()
    const { error: repairError } = await supabaseAdmin.from('profiles').insert({
      id: user.id,
      handle: metadataHandle
    })

    if (repairError) {
      console.error('Profile repair failed:', repairError)
      throw new Error('Could not verify your profile. Please try again or contact support.')
    }
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string || null
  const note = formData.get('note') as string || null
  const is_public = formData.get('is_public') === 'on'

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    title,
    url,
    note,
    is_public,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function editBookmark(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string || null
  const note = formData.get('note') as string || null
  const is_public = formData.get('is_public') === 'on'

  const { error } = await supabase
    .from('bookmarks')
    .update({
      title,
      url,
      note,
      is_public,
    })
    .eq('id', id)
    .eq('user_id', user.id) // Security: Ensure owner

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bookmarks').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function togglePublic(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bookmarks')
    .update({ is_public: !currentStatus })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
