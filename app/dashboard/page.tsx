import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { addBookmark } from './actions'
import { signOut } from '@/app/auth/actions'
import { LogOut, Plus, Bookmark as BookmarkIcon } from 'lucide-react'
import Link from 'next/link'
import BookmarkList from '@/components/BookmarkList'

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
                    className="mt-1 block w-full rounded-xl border-zinc-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-5 h-12 leading-6 text-black bg-zinc-50 outline-none transition-all placeholder:text-zinc-400"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-zinc-700">
                    URL (optional)
                  </label>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    placeholder="https://example.com"
                    className="mt-1 block w-full rounded-xl border-zinc-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-5 h-12 leading-6 text-black bg-zinc-50 outline-none transition-all placeholder:text-zinc-400"
                  />
                </div>
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-zinc-700">
                    Note (optional)
                  </label>
                  <textarea
                    name="note"
                    id="note"
                    rows={3}
                    placeholder="Add a quick note..."
                    className="mt-1 block w-full rounded-xl border-zinc-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 text-black bg-zinc-50 outline-none transition-all resize-none"
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
            <BookmarkList initialBookmarks={bookmarks || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
