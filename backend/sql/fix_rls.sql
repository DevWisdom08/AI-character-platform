-- Fix RLS policies for user registration

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Allow insert during registration (service role)
CREATE POLICY "Allow service role to insert users"
    ON public.users FOR INSERT
    WITH CHECK (true);

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

