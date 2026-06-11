-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Bookmarks Policies
CREATE POLICY "Public bookmarks are viewable by everyone."
  ON public.bookmarks FOR SELECT
  USING ( is_public = true );

CREATE POLICY "Users can view their own bookmarks."
  ON public.bookmarks FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own bookmarks."
  ON public.bookmarks FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own bookmarks."
  ON public.bookmarks FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own bookmarks."
  ON public.bookmarks FOR DELETE
  USING ( auth.uid() = user_id );

-- Function to handle new user signups
-- Note: We handle profile creation in the Server Action to include the 'handle',
-- but we could also use a trigger if we had a default handle.
-- Since the plan says "Choose at Sign-up", the Server Action is better for this.
