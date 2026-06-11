'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addBookmark(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const is_public = formData.get('is_public') === 'on'

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    title,
    url,
    is_public,
  })

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
