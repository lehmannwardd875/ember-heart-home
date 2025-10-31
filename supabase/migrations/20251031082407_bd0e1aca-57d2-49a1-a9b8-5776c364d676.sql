-- Fix Security Linter Issues

-- Issue 1: Remove SECURITY DEFINER from view by dropping and recreating as regular view
-- The verified_profile_cards view doesn't need SECURITY DEFINER since it has RLS
DROP VIEW IF EXISTS public.verified_profile_cards;

CREATE VIEW public.verified_profile_cards AS
SELECT
  p.user_id,
  p.full_name,
  p.profession,
  p.education,
  p.life_focus,
  p.linkedin_url,
  p.verified,
  p.selfie_url,
  p.video_intro_url
FROM public.profiles p
WHERE p.verified = true;

GRANT SELECT ON public.verified_profile_cards TO authenticated;

-- Issue 2: Fix function search paths
-- Already set on has_role and handle_new_user, but ensure handle_updated_at has it too
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;