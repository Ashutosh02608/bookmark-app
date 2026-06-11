'use client'

import { useState, useMemo } from 'react'
import { Trash2, Globe, Lock, Search, Filter, SortAsc, Calendar, Pencil, X, Check } from 'lucide-react'
import { deleteBookmark, togglePublic, editBookmark } from '@/app/dashboard/actions'

interface Bookmark {
  id: string
  title: string
  url: string | null
  note: string | null
  is_public: boolean
  created_at: string
}

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
}

type SortOption = 'newest' | 'oldest' | 'title-az' | 'title-za'
type FilterOption = 'all' | 'public' | 'private'

export default function BookmarkList({ initialBookmarks }: BookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

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

    // Filter by public/private status
    if (filterBy !== 'all') {
      result = result.filter((b) => (filterBy === 'public' ? b.is_public : !b.is_public))
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
  }, [initialBookmarks, searchQuery, sortBy, filterBy])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="bg-transparent border-none outline-none text-zinc-600 font-medium cursor-pointer"
              >
                <option value="all">All Bookmarks</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-none outline-none text-zinc-600 font-medium cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-az">Title (A-Z)</option>
                <option value="title-za">Title (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="text-zinc-400 text-xs font-medium">
            Showing {filteredAndSortedBookmarks.length} of {initialBookmarks.length}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-zinc-100">
          {filteredAndSortedBookmarks.length === 0 ? (
            <li className="p-12 text-center text-zinc-500">
              {initialBookmarks.length === 0
                ? "No bookmarks yet. Add your first one!"
                : "No bookmarks match your search/filters."}
            </li>
          ) : (
            filteredAndSortedBookmarks.map((bookmark) => (
              <li
                key={bookmark.id}
                className="p-5 hover:bg-zinc-50 flex items-start justify-between transition-colors"
              >
                {editingId === bookmark.id ? (
                  <form 
                    action={async (formData) => {
                      await editBookmark(bookmark.id, formData)
                      setEditingId(null)
                    }}
                    className="flex-1 space-y-3 mr-4"
                  >
                    <input
                      name="title"
                      defaultValue={bookmark.title}
                      required
                      className="w-full p-2 text-sm font-bold text-black border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      name="url"
                      defaultValue={bookmark.url || ''}
                      placeholder="URL (optional)"
                      className="w-full p-2 text-xs text-black border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      name="note"
                      defaultValue={bookmark.note || ''}
                      placeholder="Note (optional)"
                      className="w-full p-2 text-sm text-black border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={2}
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-zinc-600">
                        <input
                          type="checkbox"
                          name="is_public"
                          defaultChecked={bookmark.is_public}
                          className="rounded border-zinc-300 text-indigo-600"
                        />
                        Public
                      </label>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-full hover:bg-zinc-200 text-zinc-500 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          type="submit"
                          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        {bookmark.url ? (
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-zinc-900 truncate block hover:text-indigo-600 transition-colors"
                          >
                            {bookmark.title}
                          </a>
                        ) : (
                          <span className="text-sm font-bold text-zinc-900 block">
                            {bookmark.title}
                          </span>
                        )}
                      </div>
                      {bookmark.url && (
                        <p className="text-xs text-zinc-400 truncate">{bookmark.url}</p>
                      )}
                      {bookmark.note && (
                        <p className="text-sm text-zinc-600 mt-2 bg-zinc-50 p-2 rounded-lg border border-zinc-100 italic">
                          {bookmark.note}
                        </p>
                      )}
                      <div 
                        className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400 uppercase tracking-wider font-bold"
                        suppressHydrationWarning
                      >
                        <Calendar className="h-3 w-3" />
                        {new Date(bookmark.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingId(bookmark.id)}
                        title="Edit"
                        className="p-2.5 rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <form action={() => togglePublic(bookmark.id, bookmark.is_public)}>
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
                      <form action={() => deleteBookmark(bookmark.id)}>
                        <button
                          type="submit"
                          title="Delete"
                          className="p-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
