import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { Bookmark } from 'lucide-react'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-zinc-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/" className="flex justify-center items-center gap-2 mb-10">
          <Bookmark className="h-10 w-10 text-indigo-600" />
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">Bookmarks</span>
        </Link>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <form className="space-y-6" action={signup}>
            {searchParams.error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="text-sm text-red-700">{searchParams.error}</div>
              </div>
            )}
            {searchParams.message && (
              <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                <div className="text-sm text-indigo-700">{searchParams.message}</div>
              </div>
            )}

            <div>
              <label
                htmlFor="handle"
                className="block text-sm font-medium leading-6 text-zinc-700"
              >
                Unique Handle (@yourname)
              </label>
              <div className="mt-2 flex rounded-xl shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md bg-zinc-50 overflow-hidden">
                <span className="flex select-none items-center pl-3 text-zinc-500 sm:text-sm">
                  @
                </span>
                <input
                  id="handle"
                  name="handle"
                  type="text"
                  required
                  minLength={3}
                  className="block flex-1 border-0 bg-transparent py-3 pl-1 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                  placeholder="janesmith"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-zinc-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="block w-full rounded-xl border-zinc-200 py-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-zinc-700"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border-zinc-200 py-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
