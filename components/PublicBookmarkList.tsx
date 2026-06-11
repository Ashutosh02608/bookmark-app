'use client'

import { useState, useMemo } from 'react'
import { Search, SortAsc, ExternalLink, Calendar } from 'lucide-react'

interface Bookmark {
  id: string
  title: string
  url: string | null
  note: string | null
  is_public: boolean
  created_at: string
}

interface PublicBookmarkListProps {
  initialBookmarks: Bookmark[]
}

type SortOption = 'newest' | 'oldest' | 'title-az' | 'title-za'

export default function PublicBookmarkList({ initialBookmarks }: PublicBookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const filteredAndSortedBookmarks = useMemo(() => {
    let result = [...initialBookmarks]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.url?.toLowerCase().includes(query) ||
          b.note?.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title-az':
          return a.title.localeCompare(b.title)
        case 'title-za':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return result
  }, [initialBookmarks, searchQuery, sortBy])

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm">
          <SortAsc className="h-5 w-5 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent border-none outline-none text-zinc-600 font-medium cursor-pointer text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title-az">A-Z</option>
            <option value="title-za">Z-A</option>
          </select>
        </div>
      </div>

      {/* List */}
      <main className="space-y-4">
        {filteredAndSortedBookmarks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center shadow-sm">
            <p className="text-zinc-500">
              {initialBookmarks.length === 0
                ? "No public bookmarks shared yet."
                : "No bookmarks match your search."}
            </p>
          </div>
        ) : (
          filteredAndSortedBookmarks.map((bookmark) => {
            const content = (
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">
                    {bookmark.title}
                  </h2>
                  {bookmark.url && (
                    <p className="text-sm text-zinc-400 truncate mt-1">{bookmark.url}</p>
                  )}
                  {bookmark.note && (
                    <p className="text-sm text-zinc-600 mt-3 bg-zinc-50 p-3 rounded-xl border border-zinc-100 italic">
                      {bookmark.note}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                    <Calendar className="h-3 w-3" />
                    {new Date(bookmark.created_at).toLocaleDateString()}
                  </div>
                </div>
                {bookmark.url && (
                  <ExternalLink className="h-5 w-5 text-zinc-300 group-hover:text-indigo-600 flex-shrink-0 ml-4 transition-colors mt-1" />
                )}
              </div>
            );

            return bookmark.url ? (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:border-indigo-500 transition-all hover:shadow-md hover:-translate-y-1"
              >
                {content}
              </a>
            ) : (
              <div
                key={bookmark.id}
                className="group block w-full bg-white p-6 rounded-2xl shadow-sm border border-zinc-200"
              >
                {content}
              </div>
            );
          })
        )}
      </main>
    </div>
  )
}
