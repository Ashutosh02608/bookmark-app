import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { addBookmark, deleteBookmark, togglePublic } from './actions'
import { signOut } from '@/app/auth/actions'
import { Trash2, Globe, Lock, LogOut, Plus, Bookmark as BookmarkIcon } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('handle')
    .eq('id', user.id)
    .single()

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <nav className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <BookmarkIcon className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold text-zinc-900">Bookmarks</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href={`/${profile?.handle}`}
                className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
              >
                @{profile?.handle}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Add Bookmark Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-900">
                <Plus className="h-5 w-5 text-indigo-600" />
                Add Bookmark
              </h2>
              <form action={addBookmark} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    placeholder="My Favorite Article"
                    className="mt-1 block w-full rounded-xl border-zinc-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 bg-zinc-50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-zinc-700">
                    URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    required
                    placeholder="https://example.com"
                    className="mt-1 block w-full rounded-xl border-zinc-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 bg-zinc-50 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_public"
                    id="is_public"
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_public" className="ml-2 block text-sm text-zinc-700">
                    Make public (visible on your profile)
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Add Bookmark
                </button>
              </form>
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
              <ul className="divide-y divide-zinc-100">
                {bookmarks?.length === 0 ? (
                  <li className="p-12 text-center text-zinc-500">
                    No bookmarks yet. Add your first one!
                  </li>
                ) : (
                  bookmarks?.map((bookmark) => (
                    <li key={bookmark.id} className="p-5 hover:bg-zinc-50 flex items-center justify-between transition-colors">
                      <div className="flex-1 min-w-0 mr-4">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-zinc-900 truncate block hover:text-indigo-600 transition-colors"
                        >
                          {bookmark.title}
                        </a>
                        <p className="text-xs text-zinc-400 truncate mt-1">{bookmark.url}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <form action={togglePublic.bind(null, bookmark.id, bookmark.is_public)}>
                          <button
                            type="submit"
                            title={bookmark.is_public ? 'Make private' : 'Make public'}
                            className={`p-2.5 rounded-full transition-all ${
                              bookmark.is_public
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                            }`}
                          >
                            {bookmark.is_public ? (
                              <Globe className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </button>
                        </form>
                        <form action={deleteBookmark.bind(null, bookmark.id)}>
                          <button
                            type="submit"
                            title="Delete"
                            className="p-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
