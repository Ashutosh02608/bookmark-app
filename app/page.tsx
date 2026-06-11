import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Bookmark, Shield, Zap, Globe } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8 border-b border-zinc-100" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Bookmark className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight text-zinc-900">Bookmarks</span>
          </Link>
        </div>
        <div className="flex gap-x-8 items-center">
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Linktree meets Pocket
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Your personal bookmark manager and public link profile. Save links for yourself, share the ones you love with the world.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                >
                  Get started for free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-zinc-50">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Better Bookmarking</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Everything you need to manage your links
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-zinc-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Private by Default
              </dt>
              <dd className="mt-2 text-base leading-7 text-zinc-600">
                Your bookmarks are yours. We use Row Level Security to ensure only you can access your private data.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-zinc-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <Globe className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Public Profiles
              </dt>
              <dd className="mt-2 text-base leading-7 text-zinc-600">
                Claim your unique @handle and share your favorite links with anyone on a beautiful profile page.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-zinc-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Lightning Fast
              </dt>
              <dd className="mt-2 text-base leading-7 text-zinc-600">
                Built with Next.js Server Components and Supabase for a seamless, high-performance experience.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
