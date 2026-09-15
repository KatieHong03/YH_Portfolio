-- Supabase Schema for Katie Hong Portfolio CMS
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Projects Table (Work / Featured Case Studies)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  overview TEXT,
  audience TEXT,
  challenge TEXT,
  solution TEXT,
  project_type TEXT,
  types JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  skills_demonstrated JSONB DEFAULT '[]'::jsonb,
  timeline TEXT,
  outcome_metric TEXT,
  metrics_list JSONB DEFAULT '[]'::jsonb,
  process JSONB DEFAULT '{}'::jsonb,
  impact TEXT,
  card_image TEXT,
  is_flagship BOOLEAN DEFAULT false,
  external_url TEXT,
  case_study_doc_url TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  display_placeholders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Playground Projects Table
CREATE TABLE IF NOT EXISTS public.playground_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT,
  overview TEXT,
  challenge TEXT,
  solution TEXT,
  background_image_url TEXT,
  logo_url TEXT,
  demo_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  showcase_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. About Content Table (Philosophies, Bio, Hobbies)
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  philosophies JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  profile_photo_url TEXT,
  hobbies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CV Content Table (Experience, Education, Skills, Resume)
CREATE TABLE IF NOT EXISTS public.cv_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  resume_meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playground_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
DROP POLICY IF EXISTS "Public read playground" ON public.playground_projects;
DROP POLICY IF EXISTS "Admin write playground" ON public.playground_projects;
DROP POLICY IF EXISTS "Public read about" ON public.about_content;
DROP POLICY IF EXISTS "Admin write about" ON public.about_content;
DROP POLICY IF EXISTS "Public read cv" ON public.cv_content;
DROP POLICY IF EXISTS "Admin write cv" ON public.cv_content;

-- PUBLIC READ POLICIES (All visitors can view published content)
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read playground" ON public.playground_projects FOR SELECT USING (true);
CREATE POLICY "Public read about" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public read cv" ON public.cv_content FOR SELECT USING (true);

-- AUTHENTICATED WRITE POLICIES (Only authenticated Admins can modify content)
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write playground" ON public.playground_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write about" ON public.about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write cv" ON public.cv_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage Bucket for Media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media');
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-media');
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media');
