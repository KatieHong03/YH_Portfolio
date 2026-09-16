import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudUpload, 
  CheckCircle2, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Database, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  ShieldCheck,
  Eye,
  Key,
  Copy,
  ExternalLink,
  Lock,
  Server,
  Layers,
  GitBranch
} from 'lucide-react';
import { getLiveProjects } from '../utils/projectsData';
import { 
  migrateLocalAdminDataToCloud, 
  MigrationReport 
} from '../services/portfolioService';
import { 
  isSupabaseConfigured, 
  getSupabaseCredentials 
} from '../lib/supabase';
import { ImageMigrationPanel } from './ImageMigrationPanel';

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'images' | 'migrate' | 'config' | 'sql';
}

interface AuditReport {
  projectCount: number;
  base64ImagesCount: number;
  customCoverCount: number;
  customDisplayCount: number;
  playgroundGalleriesCount: number;
  aboutPillarsCount: number;
  cvItemsCount: number;
  hasCustomResume: boolean;
  keysDetected: string[];
}

export const AdminSyncModal: React.FC<AdminSyncModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'images'
}) => {
  const [activeTab, setActiveTab] = useState<'images' | 'migrate' | 'config' | 'sql'>(initialTab);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<{ step: string; percent: number }>({
    step: '',
    percent: 0
  });
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual Supabase credentials override in browser
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [audit, setAudit] = useState<AuditReport>({
    projectCount: 0,
    base64ImagesCount: 0,
    customCoverCount: 0,
    customDisplayCount: 0,
    playgroundGalleriesCount: 0,
    aboutPillarsCount: 0,
    cvItemsCount: 0,
    hasCustomResume: false,
    keysDetected: []
  });

  const configured = isSupabaseConfigured();
  const creds = getSupabaseCredentials();

  // Audit current browser localStorage
  const runAudit = () => {
    try {
      const keys: string[] = [];
      let base64Count = 0;
      let coverCount = 0;
      let displayCount = 0;
      let galleryCount = 0;
      let aboutPillars = 0;
      let cvItems = 0;
      let hasResume = false;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('portfolio_') || key.includes('project'))) {
          keys.push(key);
          const val = localStorage.getItem(key) || '';
          if (val.includes('data:image/')) {
            const matches = val.match(/data:image\//g);
            base64Count += matches ? matches.length : 0;
          }
        }
      }

      const projects = getLiveProjects();
      projects.forEach((p) => {
        if (p.cardImage) coverCount++;
        if (Array.isArray(p.displayPlaceholders)) {
          p.displayPlaceholders.forEach((ph) => {
            if (ph.imageUrl) displayCount++;
          });
        }
      });

      // Check playground images
      ['teajourney', 'lumipal', 'tarot', 'pawgress'].forEach((pid) => {
        const pKey = `portfolio_playground_images_${pid}`;
        const saved = localStorage.getItem(pKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) galleryCount += parsed.length;
          } catch {
            // ignore
          }
        }
      });

      // Check about
      const aboutRaw = localStorage.getItem('portfolio_about_philosophies') 
        || localStorage.getItem('portfolio_philosophies');
      if (aboutRaw) {
        try {
          const parsed = JSON.parse(aboutRaw);
          if (Array.isArray(parsed)) aboutPillars = parsed.length;
        } catch {
          // ignore
        }
      }

      // Check CV
      const expRaw = localStorage.getItem('portfolio_cv_experiences');
      const eduRaw = localStorage.getItem('portfolio_cv_education_v3');
      const skillsRaw = localStorage.getItem('portfolio_cv_skills_v4');
      if (expRaw) {
        try { cvItems += JSON.parse(expRaw).length; } catch {}
      }
      if (eduRaw) {
        try { cvItems += JSON.parse(eduRaw).length; } catch {}
      }
      if (skillsRaw) {
        try { cvItems += JSON.parse(skillsRaw).length; } catch {}
      }
      if (localStorage.getItem('portfolio_custom_resume_pdf')) {
        hasResume = true;
      }

      setAudit({
        projectCount: projects.length,
        base64ImagesCount: base64Count,
        customCoverCount: coverCount,
        customDisplayCount: displayCount,
        playgroundGalleriesCount: galleryCount,
        aboutPillarsCount: aboutPillars,
        cvItemsCount: cvItems,
        hasCustomResume: hasResume,
        keysDetected: keys
      });
    } catch (err) {
      console.error('Audit failed:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      runAudit();
      setMigrationReport(null);
      setErrorMessage(null);
      setSupabaseUrlInput(creds.url);
      setSupabaseKeyInput(creds.anonKey);
    }
  }, [isOpen, initialTab]);

  const handleSaveCredentials = () => {
    if (supabaseUrlInput.trim()) {
      localStorage.setItem('portfolio_supabase_url_override', supabaseUrlInput.trim());
    }
    if (supabaseKeyInput.trim()) {
      localStorage.setItem('portfolio_supabase_key_override', supabaseKeyInput.trim());
    }
    setCredentialsSaved(true);
    setTimeout(() => setCredentialsSaved(false), 3000);
  };

  const handleRunMigration = async () => {
    setIsMigrating(true);
    setErrorMessage(null);
    setMigrationReport(null);

    try {
      const report = await migrateLocalAdminDataToCloud((step, percent) => {
        setMigrationProgress({ step, percent });
      });
      setMigrationReport(report);
      runAudit();
    } catch (err: any) {
      console.error('Migration failed:', err);
      setErrorMessage(err.message || 'Migration encountered an error.');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCopySql = () => {
    const sql = `-- Supabase Schema for Katie Hong Portfolio CMS
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

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

CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  philosophies JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  profile_photo_url TEXT,
  hobbies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cv_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  resume_meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playground_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_content ENABLE ROW LEVEL SECURITY;

-- Public READ
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read playground" ON public.playground_projects FOR SELECT USING (true);
CREATE POLICY "Public read about" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public read cv" ON public.cv_content FOR SELECT USING (true);

-- Admin WRITE
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write playground" ON public.playground_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write about" ON public.about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write cv" ON public.cv_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Admin write media" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'portfolio-media');
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadJsonBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      localStorage: {} as Record<string, string>
    };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('portfolio_') || key.includes('project'))) {
        backup.localStorage[key] = localStorage.getItem(key) || '';
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-brand-border shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-brand-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-sage/15 text-brand-sage">
                <Database className="w-5 h-5" />
              </span>
              <h3 className="font-serif font-bold text-xl text-brand-text">
                Cloud CMS &amp; Migration Manager
              </h3>
            </div>
            <p className="text-xs text-brand-muted font-sans leading-relaxed">
              Transition from browser-only storage to a real Supabase database &amp; storage backend.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-brand-muted hover:text-brand-text rounded-full hover:bg-brand-bg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-brand-border/60 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'images' 
                ? 'bg-brand-sage text-white shadow-3xs' 
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Migrate Images Only</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              activeTab === 'images' ? 'bg-white/20 text-white' : 'bg-brand-border/60 text-brand-muted'
            }`}>
              Recommended
            </span>
          </button>
          <button
            onClick={() => setActiveTab('migrate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'migrate' 
                ? 'bg-brand-sage text-white shadow-3xs' 
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>All Content Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'config' 
                ? 'bg-brand-sage text-white shadow-3xs' 
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Supabase Connection
            {configured ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'sql' 
                ? 'bg-brand-sage text-white shadow-3xs' 
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            SQL Schema
          </button>
        </div>

        {/* ==========================================
            TAB 0: MIGRATE IMAGES ONLY (IMAGE-ONLY FOCUS)
            ========================================== */}
        {activeTab === 'images' && (
          <ImageMigrationPanel 
            onSwitchToConfigTab={() => setActiveTab('config')} 
          />
        )}

        {/* ==========================================
            TAB 1: MIGRATE TO CLOUD (ALL CONTENT)
            ========================================== */}
        {activeTab === 'migrate' && (
          <div className="space-y-5">
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              configured 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {configured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <span className="font-bold block">
                  {configured ? 'Supabase Backend Connected' : 'Supabase Credentials Needed'}
                </span>
                <p className="leading-relaxed opacity-90">
                  {configured 
                    ? `Connected to ${creds.url.replace(/^https?:\/\//, '').split('.')[0]}.supabase.co. You can run the one-time migration to upload all local browser data to permanent cloud storage.` 
                    : 'To migrate to permanent cloud storage, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Supabase Connection tab or your .env file.'
                  }
                </p>
              </div>
            </div>

            {/* Audit Status Grid */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand-muted font-bold block">
                Discovered in Current Browser Storage
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Projects</span>
                  <span className="block font-serif font-bold text-xl text-brand-text mt-1">{audit.projectCount}</span>
                  <span className="text-[10px] text-brand-sage font-medium">Ready</span>
                </div>

                <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Base64 Images</span>
                  <span className="block font-serif font-bold text-xl text-brand-sage mt-1">{audit.base64ImagesCount}</span>
                  <span className="text-[10px] text-brand-muted">To Storage</span>
                </div>

                <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Playground</span>
                  <span className="block font-serif font-bold text-xl text-brand-text mt-1">{audit.playgroundGalleriesCount}</span>
                  <span className="text-[10px] text-brand-muted">Galleries</span>
                </div>

                <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">About & CV</span>
                  <span className="block font-serif font-bold text-xl text-brand-text mt-1">{audit.aboutPillarsCount + audit.cvItemsCount}</span>
                  <span className="text-[10px] text-brand-muted">Entries</span>
                </div>
              </div>
            </div>

            {/* Migration In Progress */}
            {isMigrating && (
              <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-brand-text font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-sage" />
                    {migrationProgress.step || 'Migrating...'}
                  </span>
                  <span className="text-brand-sage font-bold">{migrationProgress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-brand-border/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-sage transition-all duration-300 rounded-full"
                    style={{ width: `${migrationProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Migration Report */}
            {migrationReport && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Migration to Cloud Succeeded!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-emerald-900 font-mono">
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    Projects in Database: <strong>{migrationReport.projectsMigrated}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    Images in Storage: <strong>{migrationReport.imagesUploaded}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    Playground Migrated: <strong>{migrationReport.playgroundProjectsMigrated} items</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    About & CV Migrated: <strong>{migrationReport.aboutMigrated && migrationReport.cvMigrated ? 'Yes' : 'Partial'}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-sans">
                  Your browser's local data has been preserved untouched as a safe backup. Visitors to your Vercel deployment will now fetch all content directly from Supabase!
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* GitHub & Vercel Deployment Guide */}
            <div className="p-4 bg-stone-50 border border-brand-border/70 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-brand-text font-bold text-xs">
                <GitBranch className="w-4 h-4 text-brand-sage" />
                <span>Deploying with GitHub &amp; Vercel (No Database Required)</span>
              </div>
              <p className="text-[11.5px] text-brand-muted leading-relaxed font-sans">
                If you host your portfolio on Vercel connected to GitHub, you do not need Supabase! All you need is to export your local edits into your repository code:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-brand-text space-y-1 font-sans pl-1">
                <li>Click <strong>&ldquo;Download Local Data Backup (.json)&rdquo;</strong> below to save your 33 images and edits.</li>
                <li>Send or drop that file here in the AI Studio chat.</li>
                <li>The coding assistant will permanently embed all your images and copy into the project files so that your next commit to GitHub will show everything on Vercel!</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleDownloadJsonBackup}
                className="w-full sm:w-auto flex-1 px-5 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                title="Download complete JSON backup of current browser localStorage"
              >
                <Download className="w-4 h-4" />
                <span>Download Local Data Backup (.json)</span>
              </button>

              <button
                onClick={() => {
                  if (!configured) {
                    setActiveTab('config');
                  } else {
                    handleRunMigration();
                  }
                }}
                disabled={isMigrating}
                className={`w-full sm:w-auto px-4 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  !configured 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                    : 'bg-brand-bg hover:bg-brand-border/40 text-brand-text border-brand-border'
                }`}
                title={!configured ? 'Configure Supabase to enable cloud database migration' : 'Migrate data to Supabase'}
              >
                <CloudUpload className="w-4 h-4 text-brand-sage" />
                <span>{configured ? 'Migrate to Supabase Cloud' : 'Connect Supabase Cloud'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: SUPABASE CONFIGURATION
            ========================================== */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            <p className="text-xs text-brand-muted font-sans leading-relaxed">
              Supabase provides your persistent PostgreSQL database, media storage bucket, and Admin authentication.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-mono text-[9.5px] uppercase tracking-wider text-brand-muted font-bold block">
                  Supabase Project URL (<code className="text-brand-text">VITE_SUPABASE_URL</code>)
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs font-mono text-brand-text focus:outline-hidden focus:border-brand-sage"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9.5px] uppercase tracking-wider text-brand-muted font-bold block">
                  Supabase Anon Key (<code className="text-brand-text">VITE_SUPABASE_ANON_KEY</code>)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs font-mono text-brand-text focus:outline-hidden focus:border-brand-sage"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSaveCredentials}
                  className="px-4 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Connection Settings</span>
                </button>

                {credentialsSaved && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved for session!
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-brand-border/60 rounded-2xl space-y-2 text-xs font-sans text-brand-muted">
              <span className="font-bold text-brand-text block">Vercel & AI Studio Environment Variables</span>
              <p className="leading-relaxed">
                Add these two variables to your Vercel Project Settings (Settings &gt; Environment Variables) and Google AI Studio:
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-brand-text">
                <li><span className="text-brand-sage font-bold">VITE_SUPABASE_URL</span>: Your Supabase project URL</li>
                <li><span className="text-brand-sage font-bold">VITE_SUPABASE_ANON_KEY</span>: Your Supabase anonymous public API key</li>
              </ul>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: SQL SCHEMA SCRIPT
            ========================================== */}
        {activeTab === 'sql' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-brand-muted font-sans">
                Run this SQL in your Supabase project (<strong>SQL Editor &gt; New Query</strong>) to create the tables, RLS security policies, and storage bucket.
              </p>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 bg-brand-bg hover:bg-brand-border/40 text-brand-text rounded-xl border border-brand-border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-2xl font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto border border-brand-border">
              <pre>{`-- 1. Projects Table
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

-- 3. About Content Table
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  philosophies JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  profile_photo_url TEXT,
  hobbies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CV Content Table
CREATE TABLE IF NOT EXISTS public.cv_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  resume_meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playground_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read playground" ON public.playground_projects FOR SELECT USING (true);
CREATE POLICY "Public read about" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public read cv" ON public.cv_content FOR SELECT USING (true);

CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write playground" ON public.playground_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write about" ON public.about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write cv" ON public.cv_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Admin write media" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'portfolio-media');`}</pre>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
