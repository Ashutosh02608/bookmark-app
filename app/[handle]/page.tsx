import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ExternalLink, Bookmark } from 'lucide-react'

export default async function PublicProfilePage({
  params,
}: {
  params: { handle: string }
}) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, handle')
    .eq('handle', params.handle)
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

        <main className="space-y-4">
          {bookmarks?.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center shadow-sm">
              <p className="text-zinc-500">
                No public bookmarks shared yet.
              </p>
            </div>
          ) : (
            bookmarks?.map((bookmark) => (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 hover:border-indigo-500 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">
                      {bookmark.title}
                    </h2>
                    <p className="text-sm text-zinc-400 truncate mt-1">{bookmark.url}</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-zinc-300 group-hover:text-indigo-600 flex-shrink-0 ml-4 transition-colors" />
                </div>
              </a>
            ))
          )}
        </main>

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
