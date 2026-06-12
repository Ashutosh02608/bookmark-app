# Bookmark App

A simple Next.js + Supabase bookmark manager with auth, public profiles, and bookmark sharing.

## Live Demo

> Live URL: (https://bookmark-app-green.vercel.app/)

## GitHub Repository

> Repository: (https://github.com/Ashutosh02608/bookmark-app)

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your Supabase project values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)


## Where the AI agent got something wrong
 One issue was that the signup flow stored user handles only in Supabase Auth metadata, while the public profile page looked them up in the `profiles` table. This caused some profile pages to fail. I fixed it by saving the chosen handle in the `profiles` table during signup and using it as the source of truth for profile lookups.

## One thing to improve with more time
With more time, I would expand the bookmark management features by adding categories and tags, improve the public profile experience, and implement better loading states and UI feedback to create a more polished user experience.