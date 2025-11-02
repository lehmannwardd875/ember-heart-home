# tasks.md - Hearth Implementation Task List

**Source of Truth for Feature Implementation**

> This document tracks all tasks from concept to completion. Mark tasks as `[✓]` when done, `[→]` when in progress, `[ ]` when upcoming.

---

## 📋 TASK OVERVIEW

### Phase 1: Foundation & Design System ✓
- [✓] Landing page with hero, features, stats, CTA
- [✓] Design system (colors, typography, spacing)
- [✓] Component library setup

### Phase 2: Core Pages & Navigation ✓
- [✓] Multi-page routing setup
- [✓] Welcome/Onboarding flow
- [✓] Mock verification flow
- [✓] Narrative profile builder
- [✓] Settings page

### Phase 3: Reflection & Matching (Backend Required)
- [✓] Enable Lovable Cloud (Supabase connected)
- [✓] Database schema & migrations
- [✓] User authentication
- [✓] Guided reflection mode
- [✓] Daily matches engine
- [✓] Admin panel (moderation)

### Phase 4: Chat & Real-time
- [✓] Private verified chat
- [✓] Real-time messaging
- [✓] Chat UI with copper-sage design

### Phase 5: Payments & Upsells
- [ ] Stripe integration
- [ ] Profile makeover upsell flow
- [ ] Connection coach scheduling

### Phase 6: Polish & Launch Prep
- [✓] Image upload & storage (Supabase)
- [✓] Email notifications
- [ ] Testing & QA
- [✓] SEO optimization
- [ ] Performance audit

### Phase 7: Future Features
- [ ] HearthCircle community (Phase 2)
- [ ] Real Persona/Onfido integration
- [ ] Ember AI companion
- [ ] Mobile responsive refinements

---

## 📦 PHASE 2: CORE PAGES & NAVIGATION

### Task 2.1: Multi-Page Routing Setup
**Status:** [✓] COMPLETED  
**Priority:** High  
**Dependencies:** None  
**Estimated Time:** 30 min

**Implementation:**
```typescript
// Add to src/App.tsx or create src/routes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/welcome" element={<Welcome />} />
  <Route path="/verify" element={<Verification />} />
  <Route path="/profile/create" element={<ProfileBuilder />} />
  <Route path="/profile/:userId" element={<ProfileView />} />
  <Route path="/reflection" element={<ReflectionMode />} />
  <Route path="/matches" element={<DailyMatches />} />
  <Route path="/chat/:matchId" element={<PrivateChat />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/upsell/makeover" element={<ProfileMakeover />} />
  <Route path="/upsell/coach" element={<ConnectionCoach />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Subtasks:**
- [✓] Create route structure in App.tsx
- [ ] Add protected route wrapper (for post-auth pages) - Phase 3
- [✓] Create placeholder pages for all routes
- [✓] Test navigation between pages

---

### Task 2.2: Welcome/Onboarding Flow
**Status:** [✓] COMPLETED  
**Priority:** High  
**Dependencies:** 2.1  
**Estimated Time:** 2 hours

**Reference:** `docs/app-flow-pages-and-roles.md` (lines 21-22), `docs/design-guidelines.md` (lines 106-113)

**Page Structure:**
```
/welcome
  ├── Hero Section: "Welcome Home to Hearth"
  ├── Mission Statement: "You've lived, loved, and learned — that's your story."
  ├── Basic Info Collection:
      - Full Name (input)
      - Age (number input, 45-65 validation)
      - Email (for later auth setup)
  ├── CTA: "Begin Your Journey" → /verify
```

**Copy Tone:**
- Headline: "Welcome Home to Hearth"
- Subheadline: "You've lived, loved, and learned — that's your story. Let's write the next chapter together."
- Button: "Begin Your Journey"

**Design Requirements:**
- Ivory background (`#FAF3ED`)
- Cormorant Garamond H1 (40pt, semi-bold)
- Inter body text (18pt)
- Copper CTA button with hover lift
- Warm glow animation on page load (300ms fade-in)

**Validation:**
```typescript
const onboardingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  age: z.number().min(45, "Hearth is designed for adults 45+").max(65, "Hearth is designed for adults 45-65"),
  email: z.string().email("Please enter a valid email"),
});
```

**Subtasks:**
- [✓] Create `/src/pages/Welcome.tsx`
- [✓] Design form with warm, spacious layout
- [✓] Add form validation with Zod
- [✓] Store data in localStorage temporarily (until backend)
- [✓] Create smooth transition to verification page
- [✓] Add "Skip for now" option that goes to profile builder

---

### Task 2.3: Mock Verification Flow
**Status:** [✓] COMPLETED  
**Priority:** High  
**Dependencies:** 2.2  
**Estimated Time:** 2 hours

**Reference:** `docs/masterplan.md` (lines 29), `docs/design-guidelines.md` (line 109)

**Note:** This is a MOCK flow. Real Persona/Onfido integration comes later.

**Page Structure:**
```
/verify
  ├── Header: "Trust begins when we show up as ourselves."
  ├── Verification Steps:
      1. Selfie Upload (with guidelines)
      2. Short Video Intro (15 sec, guidelines provided)
      3. Optional LinkedIn verification (link input)
  ├── Success Animation: Warm ember glow (300ms)
  ├── CTA: "Continue to Profile" → /profile/create
```

**Mock Implementation:**
```typescript
// src/pages/Verification.tsx
const [step, setStep] = useState<'selfie' | 'video' | 'linkedin' | 'success'>('selfie');
const [selfie, setSelfie] = useState<File | null>(null);
const [video, setVideo] = useState<File | null>(null);
const [linkedinUrl, setLinkedinUrl] = useState('');

// Mock verification success after uploads
const handleVerification = () => {
  // Simulate verification delay
  setTimeout(() => {
    setStep('success');
    // Store verification status in localStorage
    localStorage.setItem('hearth_verified', 'true');
  }, 2000);
};
```

**Design Requirements:**
- Step indicator with copper progress bar
- Camera/video upload with preview
- Success screen with ember glow animation
- Copy: "You're verified! Welcome to Hearth's community of hearts with history."

**File Upload Guidelines:**
```typescript
// Selfie guidelines
const selfieGuidelines = [
  "Natural lighting works best",
  "Face clearly visible",
  "No sunglasses or hats",
  "Be yourself — authenticity is beautiful"
];

// Video intro guidelines
const videoGuidelines = [
  "15 seconds to introduce yourself",
  "Share what you're looking for",
  "Speak from the heart",
  "No rehearsal needed — just be you"
];
```

**Subtasks:**
- [✓] Create `/src/pages/Verification.tsx`
- [✓] Add file upload components for selfie & video
- [✓] Create step-by-step flow with progress indicator
- [✓] Design success animation (warm ember glow)
- [✓] Add optional LinkedIn URL input
- [✓] Store mock verification status
- [✓] Create transition to profile builder

---

### Task 2.4: Narrative Profile Builder
**Status:** [✓] COMPLETED  
**Priority:** High  
**Dependencies:** 2.3  
**Estimated Time:** 4 hours

**Reference:** `docs/masterplan.md` (lines 30), `docs/app-flow-pages-and-roles.md` (line 23), `design-guidelines.md` (lines 112)

**Page Structure:**
```
/profile/create
  ├── Progress Indicator (5 sections)
  ├── Section 1: Basic Info
      - Profession (text input)
      - Education/Alma Mater (optional)
  ├── Section 2: Life Focus
      - Single line: "What matters most to you right now?"
  ├── Section 3: Personal Reflection
      - Freeform textarea (300-500 words)
      - Prompt: "Your story, beautifully told"
  ├── Section 4: Taste Cards
      - Books that moved me (3-5)
      - Films I revisit (3-5)
      - Music that centers me (3-5)
      - What inspires me lately (3-5)
  ├── Section 5: Preview & Publish
      - Preview mode with story-like layout
      - Optional hand-drawn dividers
```

**Data Schema:**
```typescript
interface HearthProfile {
  userId: string;
  profession: string;
  education?: string;
  lifeFocus: string; // single line, max 150 chars
  reflection: string; // 300-500 words
  tasteCards: {
    books: string[];
    films: string[];
    music: string[];
    inspiration: string[];
  };
  photos: string[]; // To be added later with Supabase Storage
  createdAt: string;
  updatedAt: string;
}
```

**Design Requirements:**
- Single-column flow (max 720px width)
- Generous spacing (32-48pt margins)
- Soft copper dividers between sections
- Preview mode shows profile as story-like layout
- Hand-drawn accent lines for visual warmth
- "Save Draft" functionality (localStorage until backend)

**Validation:**
```typescript
const profileSchema = z.object({
  profession: z.string().min(2, "Please share your profession"),
  education: z.string().optional(),
  lifeFocus: z.string().min(10).max(150, "Keep it to one meaningful line"),
  reflection: z.string().min(300).max(500, "Between 300-500 words works best"),
  tasteCards: z.object({
    books: z.array(z.string()).min(3).max(5),
    films: z.array(z.string()).min(3).max(5),
    music: z.array(z.string()).min(3).max(5),
    inspiration: z.array(z.string()).min(3).max(5),
  }),
});
```

**Copy Examples:**
- Section 1 Header: "Your Professional Story"
- Section 2 Header: "What Matters Most Right Now?"
- Section 3 Header: "Your Story, Beautifully Told"
- Section 4 Header: "A Glimpse Into Your World"
- Save Button: "Save Your Story"
- Preview Button: "See How Your Story Reads"

**Subtasks:**
- [✓] Create `/src/pages/ProfileBuilder.tsx`
- [✓] Design multi-step form with progress indicator
- [✓] Add all input fields with validation
- [✓] Create taste cards input (dynamic add/remove)
- [✓] Design preview mode with story-like layout
- [✓] Add save draft functionality (localStorage)
- [✓] Create smooth transitions between sections
- [ ] Add hand-drawn accent line SVGs (future polish)
- [✓] Implement character counters for length limits

---

### Task 2.5: Settings Page
**Status:** [✓] COMPLETED  
**Priority:** Medium  
**Dependencies:** 2.4  
**Estimated Time:** 2 hours

**Page Structure:**
```
/settings
  ├── Profile Management
      - Edit profile
      - Update photos
      - Verification status badge
  ├── Privacy Settings
      - Invisible Mode toggle
      - Who can see my reflections
      - Block list
  ├── Preferences
      - Age range (for future matching)
      - Geographic proximity radius
      - Email notifications
  ├── Account
      - Change password (future)
      - Delete account
```

**Design Requirements:**
- Clean, organized sections
- Toggle switches for privacy options
- Verification badge with ember glow
- Invisible Mode with clear explanation: "Take a break from new matches while staying connected with current conversations"

**Subtasks:**
- [✓] Create `/src/pages/Settings.tsx`
- [✓] Design settings sections layout
- [✓] Add privacy toggles
- [✓] Create preferences form
- [✓] Add verification badge display
- [✓] Implement localStorage for settings (until backend)

---

## 📦 PHASE 3: REFLECTION & MATCHING (Backend Required)

### Task 3.1: Enable Lovable Cloud
**Status:** [✓] COMPLETED  
**Priority:** Critical  
**Dependencies:** None  
**Estimated Time:** 15 min

**Action:**
1. Click "Enable Lovable Cloud" in the UI
2. Wait for provisioning to complete
3. Note the project ID for config

**Subtasks:**
- [✓] Enable Lovable Cloud via UI (Supabase project connected)
- [✓] Verify connection in Cloud tab
- [✓] Review auto-generated Supabase client in `src/integrations/supabase`

---

### Task 3.2: Database Schema & Migrations
**Status:** [✓]  
**Priority:** Critical  
**Dependencies:** 3.1  
**Estimated Time:** 2 hours

**Reference:** `docs/masterplan.md` (lines 51-65)

**SQL Migrations:**

```sql
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
  reflection TEXT NOT NULL CHECK (char_length(reflection) BETWEEN 300 AND 500),
  taste_cards JSONB NOT NULL DEFAULT '{"books":[],"films":[],"music":[],"inspiration":[]}',
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'US',
  selfie_url TEXT,
  video_intro_url TEXT,
  linkedin_url TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
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

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
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

-- Migration 004: Create reflections table
CREATE TABLE public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tone_tags TEXT[] DEFAULT '{}', -- e.g., ['hopeful', 'introspective', 'adventurous']
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

CREATE POLICY "Verified users can view shared reflections"
  ON public.reflections FOR SELECT
  TO authenticated
  USING (shared = true AND (SELECT verified FROM public.profiles WHERE user_id = auth.uid()) = true);

-- Migration 005: Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mutual_values JSONB DEFAULT '[]',
  shared_reflections JSONB DEFAULT '[]',
  match_score DECIMAL(3,2), -- 0.00 to 1.00
  match_date DATE DEFAULT CURRENT_DATE,
  user1_interest TEXT, -- 'interested', 'not_interested', 'pending'
  user2_interest TEXT, -- 'interested', 'not_interested', 'pending'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensures no duplicate pairs
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Migration 006: Create messages table
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

-- Migration 007: Create trigger for profile updates
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

-- Migration 008: Auto-create profile on signup
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
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

**Subtasks:**
- [✓] Create all migrations in Supabase SQL editor
- [✓] Test RLS policies with test users
- [✓] Verify foreign key constraints
- [✓] Test trigger functions
- [✓] Document schema in comments

---

### Task 3.3: User Authentication
**Status:** [✓] COMPLETED  
**Priority:** Critical  
**Dependencies:** 3.2  
**Estimated Time:** 3 hours

**Reference:** Supabase auth documentation

**Implementation:**

**Auth Page Structure:**
```
/auth
  ├── Email/Password Sign Up
  ├── Email/Password Sign In
  ├── Password Reset
  ├── OAuth (Google) - optional
```

**Code Example:**
```typescript
// src/pages/Auth.tsx
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          age: parseInt(age),
        }
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome to Hearth! Please check your email.');
      navigate('/profile/create');
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/matches');
    }
  };

  // ... rest of component
};
```

**Protected Route Wrapper:**
```typescript
// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  
  return <>{children}</>;
};
```

**Subtasks:**
- [✓] Create `/src/pages/Auth.tsx`
- [✓] Implement sign up, sign in, password reset
- [✓] Add form validation with Zod
- [✓] Create ProtectedRoute wrapper
- [✓] Update routing to use ProtectedRoute for authenticated pages
- [✓] Add error handling & user-friendly messages
- [✓] Style auth page with Hearth design system
- [✓] Test auth flow end-to-end
- [ ] Disable "Confirm email" in Supabase settings for testing (user action required)

---

### Task 3.4: Guided Reflection Mode
**Status:** [✓]  
**Priority:** High  
**Dependencies:** 3.3  
**Estimated Time:** 3 hours

**Reference:** `docs/masterplan.md` (line 31), `docs/app-flow-pages-and-roles.md` (lines 24, 56-60)

**Page Structure:**
```
/reflection
  ├── Daily Prompt (rotates each day)
  ├── Freeform Textarea (journal-style)
  ├── Optional: Mark as "Share excerpt on match card"
  ├── Character count (150-300 words optimal)
  ├── Save Reflection
  ├── View Past Reflections
```

**Daily Prompts:**
```typescript
const reflectionPrompts = [
  "What kind of connection would feel nourishing today?",
  "What made you feel alive this week?",
  "What are you grateful for in this season of life?",
  "What does 'home' mean to you right now?",
  "What brings you peace when life feels uncertain?",
  "What story from your past still makes you smile?",
  "What would you want someone to know about your heart?",
];

// Rotate prompt based on day of year
const getDailyPrompt = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return reflectionPrompts[dayOfYear % reflectionPrompts.length];
};
```

**Design Requirements:**
- Minimal, distraction-free writing interface
- Warm ivory background
- Handwritten-style prompt at top
- No timer or pressure elements
- Soft copper dividers
- Optional "Share excerpt" toggle with clear explanation

**API Integration:**
```typescript
// Save reflection
const saveReflection = async (prompt: string, response: string, shared: boolean) => {
  const { data, error } = await supabase
    .from('reflections')
    .insert({
      user_id: user.id,
      prompt,
      response,
      shared,
      tone_tags: [], // Future: AI-generated tone tags
    });
    
  if (error) {
    toast.error('Could not save reflection');
  } else {
    toast.success('Reflection saved beautifully');
  }
};

// Fetch user's reflections
const fetchReflections = async () => {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data;
};
```

**Subtasks:**
- [✓] Create `/src/pages/ReflectionMode.tsx`
- [✓] Design minimal writing interface
- [✓] Implement daily prompt rotation
- [✓] Add character counter
- [✓] Create "Share excerpt" toggle
- [✓] Integrate with Supabase reflections table
- [✓] Create "Past Reflections" view
- [✓] Add auto-save draft functionality
- [✓] Style with handwritten accent font for prompts

---

### Task 3.5: Daily Matches Engine
**Status:** [✓]  
**Priority:** High  
**Dependencies:** 3.4  
**Estimated Time:** 6 hours

**Reference:** `docs/masterplan.md` (line 32), `docs/app-flow-pages-and-roles.md` (lines 25, 47-51)

**Matching Priority (per user clarification):**
1. Reflection tone
2. Geographic proximity
3. Age range
4. Profession

**Edge Function for Matching Algorithm:**
```typescript
// supabase/functions/generate-daily-matches/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all verified users who haven't received matches today
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('user_id, location_city, location_state, age, profession')
      .eq('verified', true);

    if (usersError) throw usersError;

    // For each user, generate 1-2 matches
    for (const user of users) {
      // Check if user already has matches for today
      const { data: existingMatches } = await supabase
        .from('matches')
        .select('id')
        .eq('match_date', new Date().toISOString().split('T')[0])
        .or(`user1_id.eq.${user.user_id},user2_id.eq.${user.user_id}`);

      if (existingMatches && existingMatches.length > 0) continue;

      // Get user's recent reflections for tone analysis
      const { data: userReflections } = await supabase
        .from('reflections')
        .select('response, tone_tags')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Find potential matches
      const { data: candidates } = await supabase
        .from('profiles')
        .select('user_id, location_city, location_state, age, profession')
        .eq('verified', true)
        .neq('user_id', user.user_id);

      if (!candidates || candidates.length === 0) continue;

      // Score each candidate
      const scoredCandidates = candidates.map(candidate => {
        let score = 0;

        // 1. Reflection tone (40% weight) - TODO: Implement tone similarity
        // Future: Use Ember AI to analyze tone similarity
        score += 0.4 * Math.random(); // Placeholder

        // 2. Geographic proximity (30% weight)
        if (candidate.location_city === user.location_city) {
          score += 0.3;
        } else if (candidate.location_state === user.location_state) {
          score += 0.15;
        }

        // 3. Age range (20% weight)
        const ageDiff = Math.abs(candidate.age - user.age);
        if (ageDiff <= 5) score += 0.2;
        else if (ageDiff <= 10) score += 0.1;

        // 4. Profession (10% weight)
        if (candidate.profession === user.profession) {
          score += 0.1;
        }

        return { ...candidate, score };
      });

      // Sort by score and take top 2
      const topMatches = scoredCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

      // Create match records
      for (const match of topMatches) {
        const [user1, user2] = [user.user_id, match.user_id].sort();
        
        await supabase.from('matches').insert({
          user1_id: user1,
          user2_id: user2,
          match_score: match.score,
          match_date: new Date().toISOString().split('T')[0],
          user1_interest: 'pending',
          user2_interest: 'pending',
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Matching error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

**Daily Matches Page:**
```
/matches
  ├── Header: "Your Daily Introductions"
  ├── Match Cards (1-2 per day):
      - Profile photo
      - Name, age, profession
      - Life focus line
      - Shared reflection excerpt (if available)
      - "Interested" / "Not now" buttons
  ├── Empty State: "Check back tomorrow for new connections"
```

**Match Card Component:**
```typescript
// src/components/MatchCard.tsx
interface MatchCardProps {
  match: {
    profile: {
      full_name: string;
      age: number;
      profession: string;
      life_focus: string;
      selfie_url?: string;
    };
    sharedReflection?: string;
    matchScore: number;
  };
  onInterested: () => void;
  onNotInterested: () => void;
}

const MatchCard = ({ match, onInterested, onNotInterested }: MatchCardProps) => {
  return (
    <div className="match-card">
      <img src={match.profile.selfie_url} alt={match.profile.full_name} />
      <h2>{match.profile.full_name}, {match.profile.age}</h2>
      <p className="profession">{match.profile.profession}</p>
      <p className="life-focus">"{match.profile.life_focus}"</p>
      {match.sharedReflection && (
        <div className="shared-reflection">
          <p>{match.sharedReflection}</p>
        </div>
      )}
      <div className="actions">
        <Button variant="secondary" onClick={onNotInterested}>Not now</Button>
        <Button variant="primary" onClick={onInterested}>I'm interested</Button>
      </div>
    </div>
  );
};
```

**Subtasks:**
- [✓] Create edge function `generate-daily-matches`
- [✓] Implement matching algorithm with scoring
- [ ] Create cron job to run matching at midnight (Supabase cron)
- [✓] Create `/src/pages/DailyMatches.tsx`
- [✓] Design MatchCard component
- [✓] Implement "Interested" / "Not interested" actions
- [✓] Handle mutual interest (both users interested)
- [✓] Add empty state for no matches
- [ ] Add UI discouragement for multiple active chats (soft warning)
- [✓] Test matching algorithm with test users

---

### Task 3.6: Admin Panel (Moderation)
**Status:** [✓]  
**Priority:** Medium  
**Dependencies:** 3.3  
**Estimated Time:** 4 hours

**Page Structure:**
```
/admin (protected by admin role)
  ├── Dashboard
      - Total users
      - Verified users
      - Active matches
      - Flagged content
  ├── User Management
      - Search users
      - View profiles
      - Verify/unverify users
      - Ban/unban users
  ├── Content Moderation
      - Flagged profiles
      - Flagged messages
      - Review and action
  ├── Matching Stats
      - Match rate
      - Chat engagement
      - User retention
```

**Admin Role Check:**
```typescript
// src/hooks/useIsAdmin.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      setIsAdmin(!!data);
      setLoading(false);
    };

    checkAdminRole();
  }, []);

  return { isAdmin, loading };
};
```

**Admin Route Protection:**
```typescript
// src/components/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};
```

**Subtasks:**
- [✓] Create `/src/pages/Admin.tsx`
- [✓] Create useIsAdmin hook
- [✓] Implement AdminRoute protection
- [✓] Design admin dashboard layout
- [✓] Add user search & management
- [✓] Create content moderation interface
- [✓] Add stats dashboard
- [✓] Test admin access controls
- [ ] Manually assign first admin role via SQL

---

## 📦 PHASE 4: CHAT & REAL-TIME

### Task 4.1: Private Verified Chat
**Status:** [✓]  
**Priority:** High
**Dependencies:** 3.5  
**Estimated Time:** 4 hours

**Reference:** `docs/masterplan.md` (line 33), `docs/app-flow-pages-and-roles.md` (lines 26, 65-69)

**Page Structure:**
```
/chat/:matchId
  ├── Chat Header
      - Match name & age
      - Verified badge
      - Menu (mute, report, block)
  ├── Message List
      - Soft copper-sage design
      - Gentle fade-in for new messages
      - No timestamps by default (optional show)
  ├── Message Input
      - Textarea with placeholder
      - Send button
      - Character counter
```

**Design Requirements:**
- Copper-sage palette
- Rounded message bubbles
- No "ping" sound on new messages
- Soft 200ms fade-in animation
- Maximum calm, minimum distraction

**Real-time Implementation:**
```typescript
// src/pages/PrivateChat.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

const PrivateChat = () => {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });
      
      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const messageChannel = supabase
      .channel(`chat:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    setChannel(messageChannel);

    return () => {
      messageChannel.unsubscribe();
    };
  }, [matchId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: user.id,
        content: newMessage,
      });

    if (!error) {
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      {/* Chat UI */}
    </div>
  );
};
```

**Subtasks:**
- [✓] Create `/src/pages/PrivateChat.tsx`
- [✓] Design calm copper-sage chat UI
- [✓] Implement real-time message subscription
- [✓] Add message sending functionality
- [✓] Create message bubbles with soft animations
- [✓] Add verified badge in header
- [✓] Implement mute/report/block menu
- [✓] Add character counter for messages
- [✓] Test real-time messaging

---

## 📦 PHASE 5: PAYMENTS & UPSELLS

### Task 5.1: Stripe Integration
**Status:** [ ]  
**Priority:** High  
**Dependencies:** 3.3  
**Estimated Time:** 3 hours

**Reference:** `docs/masterplan.md` (line 34), `docs/implementation-plan.md` (lines 42-44)

**Products:**
1. Profile Makeover - $49 one-time
2. Connection Coach Session - $99 one-time

**Enable Stripe:**
1. Use Lovable tool to enable Stripe
2. Follow prompts to add Stripe secret key
3. Verify connection in Lovable UI

**Create Products (via Edge Function):**
```typescript
// supabase/functions/create-stripe-products/index.ts
// This will be auto-generated by Lovable Stripe integration
```

**Subtasks:**
- [ ] Enable Stripe via Lovable tool
- [ ] Create product: Profile Makeover ($49)
- [ ] Create product: Connection Coach Session ($99)
- [ ] Test payment flow
- [ ] Add webhook handling for successful payments

---

### Task 5.2: Profile Makeover Upsell
**Status:** [ ]  
**Priority:** Medium  
**Dependencies:** 5.1  
**Estimated Time:** 2 hours

**Page Structure:**
```
/upsell/makeover
  ├── Header: "Let Your Story Shine"
  ├── Description: Professional writing & tone guidance
  ├── What's Included:
      - Profile review by relationship coach
      - Rewritten profile with emotional depth
      - Reflection prompt suggestions
      - 1 round of revisions
  ├── Price: $49 one-time
  ├── CTA: "Enhance My Profile"
  ├── Testimonials (optional)
```

**Payment Flow:**
```typescript
// Integrate with Stripe checkout
const handlePurchase = async () => {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { productId: 'profile_makeover' }
  });
  
  if (data?.url) {
    window.location.href = data.url; // Redirect to Stripe Checkout
  }
};
```

**After Purchase:**
- Send email with instructions
- Create internal ticket for coach
- Update user's profile with "makeover_purchased" flag

**Subtasks:**
- [ ] Create `/src/pages/ProfileMakeover.tsx`
- [ ] Design compelling upsell page
- [ ] Integrate Stripe checkout
- [ ] Add post-purchase flow (email, ticket creation)
- [ ] Create coach dashboard to review submissions

---

### Task 5.3: Connection Coach Scheduling
**Status:** [ ]  
**Priority:** Medium  
**Dependencies:** 5.1  
**Estimated Time:** 2 hours

**Page Structure:**
```
/upsell/coach
  ├── Header: "1:1 Support for Your Journey"
  ├── Description: Video call with relationship coach
  ├── What's Included:
      - 45-minute video session
      - Personalized dating guidance
      - Profile & reflection feedback
      - Follow-up resources
  ├── Price: $99 one-time
  ├── CTA: "Schedule My Session"
```

**Integration:**
- Use Calendly or SavvyCal embed
- After payment, redirect to scheduling link
- Send confirmation email

**Subtasks:**
- [ ] Create `/src/pages/ConnectionCoach.tsx`
- [ ] Integrate Stripe checkout
- [ ] Add Calendly/SavvyCal embed
- [ ] Create post-payment redirect flow
- [ ] Set up automated confirmation emails

---

## 📦 PHASE 6: POLISH & LAUNCH PREP

### Task 6.1: Image Upload & Storage
**Status:** [✓] COMPLETED  
**Priority:** High  
**Dependencies:** 3.1  
**Estimated Time:** 3 hours

**Storage Buckets:**
1. `profile-photos` - public
2. `video-intros` - public
3. `reflections-images` - private (future)

**SQL Migration for Storage:**
```sql
-- Create profile-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Create video-intros bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-intros', 'video-intros', true);

-- RLS policies for profile-photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view public profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Similar policies for video-intros bucket
-- (repeat above pattern)
```

**Upload Component:**
```typescript
// src/components/ImageUpload.tsx
const uploadProfilePhoto = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    toast.error('Upload failed');
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
```

**Subtasks:**
- [✓] Create storage buckets via SQL
- [✓] Set up RLS policies for storage
- [✓] Create ImageUpload component
- [✓] Create VideoUpload component
- [ ] Add photo upload to profile builder
- [ ] Add video upload to verification
- [ ] Implement image optimization (resize, compress)
- [ ] Test upload/download flows

---

### Task 6.2: Email Notifications
**Status:** [✓] COMPLETED  
**Priority:** Medium  
**Dependencies:** 3.3  
**Estimated Time:** 2 hours

**Email Triggers:**
1. Welcome email (after signup)
2. New match available
3. New message received
4. Profile makeover completed
5. Coach session reminder

**Use Resend or SendGrid:**
```typescript
// supabase/functions/send-email/index.ts
import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  const { to, subject, html } = await req.json();

  const { data, error } = await resend.emails.send({
    from: 'Hearth <hello@hearth.app>',
    to,
    subject,
    html,
  });

  return new Response(JSON.stringify({ data, error }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Subtasks:**
- [✓] Choose email provider (Resend recommended)
- [✓] Add RESEND_API_KEY secret
- [✓] Create email templates (HTML)
- [✓] Create send-email edge function
- [ ] Add email triggers for key events
- [ ] Test email delivery

---

### Task 6.3: Testing & QA
**Status:** [ ]  
**Priority:** High  
**Dependencies:** All previous tasks  
**Estimated Time:** 4 hours

**Testing Checklist:**
- [ ] Sign up flow (email/password)
- [ ] Verification flow (mock)
- [ ] Profile creation (all fields)
- [ ] Reflection creation & sharing
- [ ] Daily matches display
- [ ] Interest actions (mutual match)
- [ ] Chat functionality (real-time)
- [ ] Settings updates
- [ ] Admin panel access
- [ ] Stripe payments
- [ ] Image uploads
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Dark mode (future)
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Performance (Lighthouse audit)

---

### Task 6.4: SEO Optimization
**Status:** [✓] COMPLETED  
**Priority:** Medium  
**Dependencies:** All pages complete  
**Estimated Time:** 2 hours

**SEO Checklist:**
- [✓] Meta titles (unique per page, <60 chars)
- [✓] Meta descriptions (unique per page, <160 chars)
- [✓] Open Graph tags (og:title, og:description, og:image)
- [✓] Twitter Card tags
- [✓] Canonical URLs
- [ ] Structured data (JSON-LD for Organization)
- [✓] robots.txt
- [✓] sitemap.xml
- [ ] Alt text for all images
- [✓] Semantic HTML (header, main, article, aside)

**Example Meta Tags:**
```html
<!-- index.html for landing page -->
<title>Hearth - Real Dating for Life's Next Chapter</title>
<meta name="description" content="A verified, emotionally intelligent dating platform for divorced or widowed professionals aged 45-65. Come home to real love." />
<meta property="og:title" content="Hearth - Come Home to Real Love" />
<meta property="og:description" content="Safe, mature connections for hearts with history." />
<meta property="og:image" content="https://hearth.app/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

---

### Task 6.5: Performance Audit
**Status:** [ ]  
**Priority:** Medium  
**Dependencies:** All pages complete  
**Estimated Time:** 2 hours

**Performance Checklist:**
- [ ] Run Lighthouse audit (target: 90+ performance score)
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Minify CSS/JS (handled by Vite)
- [ ] Enable compression
- [ ] Reduce bundle size (code splitting)
- [ ] Optimize fonts (preload, font-display: swap)
- [ ] Cache static assets
- [ ] Database query optimization (indexes)

---

## 📦 PHASE 7: FUTURE FEATURES

### Task 7.1: HearthCircle Community
**Status:** [ ]  
**Priority:** Low (Phase 2)  
**Dependencies:** 3.3  
**Estimated Time:** 8 hours

**Reference:** `docs/masterplan.md` (line 35), `docs/app-flow-pages-and-roles.md` (lines 29, 73-78)

**Features:**
- Verified-only group discussions
- Topics: "Wine & Conversation," "New Beginnings," "Life After Loss"
- Event RSVP system
- Optional offline event coordination

**Schema:**
```sql
CREATE TABLE public.circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  max_members INTEGER DEFAULT 20,
  verified_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (circle_id, user_id)
);
```

**Subtasks:**
- [ ] Design HearthCircle concept & UX
- [ ] Create database schema
- [ ] Build circle listing page
- [ ] Create circle detail & discussion page
- [ ] Add RSVP system for events
- [ ] Test with small pilot group

---

### Task 7.2: Real Persona/Onfido Integration
**Status:** [ ]  
**Priority:** Low (Future)  
**Dependencies:** 2.3  
**Estimated Time:** 4 hours

**Replace mock verification with real Persona/Onfido API calls**

**Steps:**
1. Sign up for Persona or Onfido account
2. Get API keys
3. Add keys as Supabase secrets
4. Integrate SDK into verification page
5. Handle webhooks for verification status

**Subtasks:**
- [ ] Research Persona vs Onfido pricing
- [ ] Choose provider
- [ ] Set up account & API keys
- [ ] Integrate SDK
- [ ] Replace mock flow with real verification
- [ ] Add webhook handling
- [ ] Update verified status in profiles table

---

### Task 7.3: Ember AI Companion
**Status:** [ ]  
**Priority:** Low (Future)  
**Dependencies:** 3.4, 3.5  
**Estimated Time:** 12 hours

**Features:**
- Sentiment analysis on reflections
- Tone matching for daily matches
- Scam detection in messages
- Conversational AI for guidance

**Integration:**
- Use Lovable AI (enable separately)
- Create edge function for tone analysis
- Integrate with matching algorithm
- Add passive monitoring to chat

**Subtasks:**
- [ ] Enable Lovable AI
- [ ] Create tone analysis edge function
- [ ] Train/configure sentiment model
- [ ] Integrate with matching algorithm (Task 3.5)
- [ ] Add scam detection to chat
- [ ] Create conversational AI interface (optional)

---

### Task 7.4: Mobile Responsive Refinements
**Status:** [ ]  
**Priority:** Medium  
**Dependencies:** All pages complete  
**Estimated Time:** 4 hours

**Mobile Optimization:**
- [ ] Test all pages on mobile devices
- [ ] Fix layout issues
- [ ] Optimize touch targets (min 44x44px)
- [ ] Test mobile navigation
- [ ] Optimize images for mobile
- [ ] Add mobile-specific interactions (swipe, etc.)
- [ ] Test on iOS and Android browsers

---

## 📝 NOTES & CONVENTIONS

### Code Style
- Use TypeScript for all new code
- Follow React functional components + hooks
- Use Tailwind semantic tokens (never direct colors)
- All colors must be HSL format
- Component files: PascalCase
- Utility files: camelCase

### Database Conventions
- Table names: snake_case, plural
- Column names: snake_case
- Always enable RLS on new tables
- Use UUID for primary keys
- Add timestamps (created_at, updated_at)

### Git Workflow (if using GitHub)
- Branch naming: `feature/task-number-description`
- Commit messages: "Task X.Y: Description"
- PR reviews required before merge

### Testing
- Test with minimum 3 users per flow
- Document bugs in GitHub Issues
- Use Lovable's built-in preview for live testing

---

## 🎯 COMPLETION CRITERIA

**MVP Complete When:**
- [ ] Users can sign up & authenticate
- [ ] Users can complete mock verification
- [ ] Users can create full narrative profiles
- [ ] Users can write & share reflections
- [ ] Daily matches are generated automatically
- [ ] Users can chat in real-time
- [ ] Admin panel is functional
- [ ] Stripe payments work for upsells
- [ ] Images upload to Supabase Storage
- [ ] All pages are mobile responsive
- [ ] SEO & performance audits pass
- [ ] 10 beta users tested successfully

---

## 📚 REFERENCE DOCS

- `docs/masterplan.md` - Product vision & features
- `docs/implementation-plan.md` - Build timeline
- `docs/design-guidelines.md` - Design system & voice
- `docs/app-flow-pages-and-roles.md` - User journeys & pages
- Lovable Cloud Docs: https://docs.lovable.dev/features/cloud
- Supabase Docs: https://supabase.com/docs

---

**Last Updated:** 2025-10-30  
**Next Review:** After Phase 3 completion
