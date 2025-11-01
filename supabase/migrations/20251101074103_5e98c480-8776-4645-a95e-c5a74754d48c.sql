-- Update the handle_new_user function with proper defaults that meet all constraints
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, age, profession, life_focus, reflection)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 50),
    COALESCE(NEW.raw_user_meta_data->>'profession', 'Professional'),
    'Building my profile and looking forward to meaningful connections with others.',
    'I am new to Hearth and excited to meet others who value depth, authenticity, and genuine connection. I believe in taking things slowly and getting to know someone beyond the surface.'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$fn$;

-- Ensure secure ownership
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;