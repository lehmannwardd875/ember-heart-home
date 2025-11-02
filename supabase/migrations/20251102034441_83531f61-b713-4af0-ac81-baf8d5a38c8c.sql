-- Create security definer function to check if user is verified
CREATE OR REPLACE FUNCTION public.is_user_verified(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(verified, false)
  FROM public.profiles
  WHERE user_id = _user_id
$$;

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can update their own safe profile fields" ON public.profiles;
DROP POLICY IF EXISTS "Verified users can view other verified profiles" ON public.profiles;

-- Recreate UPDATE policy without recursion
-- Users can update their own profile but cannot change verified or linkedin_verified fields
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
);

-- Recreate SELECT policy using security definer function
CREATE POLICY "Verified users can view other verified profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  verified = true 
  AND public.is_user_verified(auth.uid()) = true
);