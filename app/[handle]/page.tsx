import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Bookmark } from 'lucide-react'
import Link from 'next/link'
import PublicBookmarkList from '@/components/PublicBookmarkList'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle: rawHandle } = await params
  const supabase = await createClient()

  // Support @handle URLs by stripping the leading @ if present
  const handle = rawHandle.startsWith('%40') 
    ? rawHandle.substring(3) 
    : rawHandle.startsWith('@') 
      ? rawHandle.substring(1) 
      : rawHandle

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, handle')
    .eq('handle', handle.toLowerCase())
    .single()

  if (!profile) {
    return notFound()
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-600 text-white text-4xl font-bold mb-6 uppercase shadow-lg shadow-indigo-100">
            {profile.handle.substring(0, 1)}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">@{profile.handle}</h1>
        </header>

        <PublicBookmarkList initialBookmarks={bookmarks || []} />

        <footer className="mt-20 text-center flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-indigo-600 transition-colors">
            <Bookmark className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Bookmarks App</span>
          </Link>
        </footer>
      </div>
    </div>
  )
}
