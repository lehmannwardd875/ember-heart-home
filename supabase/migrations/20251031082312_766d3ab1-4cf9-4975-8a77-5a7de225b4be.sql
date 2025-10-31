-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migration 001: Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Migration 002: Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 45 AND age <= 65),
  profession TEXT NOT NULL,
  education TEXT,
  life_focus TEXT NOT NULL CHECK (char_length(life_focus) <= 150),
  reflection TEXT NOT NULL CHECK (char_length(reflection) BETWEEN 80 AND 800),
  taste_cards JSONB NOT NULL DEFAULT '{"books":[],"films":[],"music":[],"inspiration":[]}',
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'US',
  selfie_url TEXT,
  video_intro_url TEXT,
  linkedin_url TEXT,
  linkedin_verified BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  invisible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Verified users can view other verified profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (verified = true AND (SELECT verified FROM public.profiles WHERE user_id = auth.uid()) = true);

-- Migration 003: Create user_roles table (SECURITY)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migration 004: Profiles UPDATE policies (user-safe vs admin-only trust flags)
CREATE POLICY "Users can update their own safe profile fields"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND COALESCE(verified, false) = COALESCE((SELECT verified FROM public.profiles WHERE user_id = auth.uid()), false)
    AND COALESCE(linkedin_verified, false) = COALESCE((SELECT linkedin_verified FROM public.profiles WHERE user_id = auth.uid()), false)
  );

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migration 005: Create reflections table
CREATE TABLE public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tone_tags TEXT[] DEFAULT '{}',
  shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reflections
CREATE POLICY "Users can view their own reflections"
  ON public.reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections"
  ON public.reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
  ON public.reflections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
  ON public.reflections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Verified users can view shared reflections"
  ON public.reflections FOR SELECT
  TO authenticated
  USING (shared = true AND (SELECT verified FROM public.profiles WHERE user_id = auth.uid()) = true);

CREATE POLICY "Admins can moderate reflections"
  ON public.reflections FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migration 006: Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mutual_values JSONB DEFAULT '[]',
  shared_reflections JSONB DEFAULT '[]',
  match_score DECIMAL(3,2),
  match_date DATE DEFAULT CURRENT_DATE,
  user1_interest TEXT,
  user2_interest TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Admins can manage matches"
  ON public.matches FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migration 007: Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their matches"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Participants can toggle read only"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = match_id
        AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );

CREATE POLICY "Sender can delete own message"
  ON public.messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());

CREATE POLICY "Admins can moderate messages"
  ON public.messages FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migration 008: Create trigger for profile updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Migration 009: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, age, profession, life_focus, reflection)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 50),
    COALESCE(NEW.raw_user_meta_data->>'profession', 'Professional'),
    'Building my profile...',
    'I am new to Hearth and looking forward to meaningful connections.'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Migration 010: Performance indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);
CREATE INDEX IF NOT EXISTS profiles_verified_idx ON public.profiles (verified);
CREATE INDEX IF NOT EXISTS reflections_user_created_idx ON public.reflections (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS matches_users_idx ON public.matches (user1_id, user2_id);
CREATE INDEX IF NOT EXISTS messages_match_created_idx ON public.messages (match_id, created_at);
CREATE INDEX IF NOT EXISTS profiles_taste_cards_gin ON public.profiles USING GIN (taste_cards);
CREATE INDEX IF NOT EXISTS matches_mutual_values_gin ON public.matches USING GIN (mutual_values);

-- Migration 011: Verified profile cards view
CREATE OR REPLACE VIEW public.verified_profile_cards AS
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