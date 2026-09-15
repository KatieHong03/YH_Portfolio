import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, CANONICAL_PROJECTS } from '../utils/projectsData';
import { uploadBase64ToCloud } from './storageService';

export const EVENT_CLOUD_PROJECTS_UPDATED = 'portfolio_cloud_projects_updated';
export const EVENT_CLOUD_PLAYGROUND_UPDATED = 'portfolio_cloud_playground_updated';
export const EVENT_CLOUD_ABOUT_UPDATED = 'portfolio_cloud_about_updated';
export const EVENT_CLOUD_CV_UPDATED = 'portfolio_cloud_cv_updated';

// In-memory cache
let cachedProjects: Project[] | null = null;
let cachedPlayground: Record<string, any> | null = null;
let cachedAbout: any | null = null;
let cachedCV: any | null = null;

// ==========================================
// 1. PROJECTS (WORK / CASE STUDIES)
// ==========================================

export async function fetchProjects(): Promise<Project[]> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Map database records to Project type
        const mapped: Project[] = data.map((row) => ({
          id: row.id,
          title: row.title,
          cardImage: row.card_image || '',
          projectType: row.project_type || '',
          types: Array.isArray(row.types) ? row.types : [],
          overview: row.overview || '',
          audience: row.audience || '',
          challenge: row.challenge || '',
          solution: row.solution || '',
          process: row.process || {},
          deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
          tools: Array.isArray(row.tools) ? row.tools : [],
          impact: row.impact || '',
          skillsDemonstrated: Array.isArray(row.skills_demonstrated) ? row.skills_demonstrated : [],
          skills: Array.isArray(row.skills) ? row.skills : [],
          timeline: row.timeline || '',
          outcomeMetric: row.outcome_metric || '',
          metricsList: Array.isArray(row.metrics_list) ? row.metrics_list : [],
          displayPlaceholders: Array.isArray(row.display_placeholders) ? row.display_placeholders : [],
          isFlagship: row.is_flagship ?? false,
          externalUrl: row.external_url,
          caseStudyDocUrl: row.case_study_doc_url,
          orderIndex: row.order_index,
          visible: row.visible
        }));

        cachedProjects = mapped;
        return mapped;
      }
    } catch (err) {
      console.warn('Failed to load projects from Supabase, using fallback:', err);
    }
  }

  // Fallback to CANONICAL_PROJECTS
  cachedProjects = CANONICAL_PROJECTS;
  return CANONICAL_PROJECTS;
}

export function getCachedProjects(): Project[] {
  if (cachedProjects) return cachedProjects;
  return CANONICAL_PROJECTS;
}

export async function saveProject(project: Project): Promise<boolean> {
  const supabase = getSupabase();

  // Format record for PostgreSQL schema
  const record = {
    id: project.id,
    title: project.title,
    overview: project.overview || '',
    audience: project.audience || '',
    challenge: project.challenge || '',
    solution: project.solution || '',
    project_type: project.projectType || '',
    types: project.types || [],
    deliverables: project.deliverables || [],
    tools: project.tools || [],
    skills: project.skills || [],
    skills_demonstrated: project.skillsDemonstrated || [],
    timeline: project.timeline || '',
    outcome_metric: project.outcomeMetric || '',
    metrics_list: project.metricsList || [],
    process: project.process || {},
    impact: project.impact || '',
    card_image: project.cardImage || '',
    is_flagship: project.isFlagship ?? false,
    external_url: project.externalUrl || null,
    case_study_doc_url: project.caseStudyDocUrl || null,
    order_index: project.orderIndex ?? 0,
    visible: project.visible ?? true,
    display_placeholders: project.displayPlaceholders || [],
    updated_at: new Date().toISOString()
  };

  // Update in-memory cache
  if (cachedProjects) {
    const idx = cachedProjects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      cachedProjects[idx] = project;
    } else {
      cachedProjects.push(project);
    }
  } else {
    cachedProjects = [project];
  }
  window.dispatchEvent(new Event(EVENT_CLOUD_PROJECTS_UPDATED));

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('projects')
        .upsert(record, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save project error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase save project exception:', err);
      return false;
    }
  }

  // Also save to server API as secondary local fallback
  try {
    await fetch('/api/admin/sync-all-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects: cachedProjects })
    });
  } catch {
    // ignore
  }

  return true;
}

export async function saveAllProjects(projects: Project[]): Promise<boolean> {
  const supabase = getSupabase();
  cachedProjects = projects;
  window.dispatchEvent(new Event(EVENT_CLOUD_PROJECTS_UPDATED));

  if (supabase && isSupabaseConfigured()) {
    try {
      const records = projects.map((p, idx) => ({
        id: p.id,
        title: p.title,
        overview: p.overview || '',
        audience: p.audience || '',
        challenge: p.challenge || '',
        solution: p.solution || '',
        project_type: p.projectType || '',
        types: p.types || [],
        deliverables: p.deliverables || [],
        tools: p.tools || [],
        skills: p.skills || [],
        skills_demonstrated: p.skillsDemonstrated || [],
        timeline: p.timeline || '',
        outcome_metric: p.outcomeMetric || '',
        metrics_list: p.metricsList || [],
        process: p.process || {},
        impact: p.impact || '',
        card_image: p.cardImage || '',
        is_flagship: p.isFlagship ?? false,
        external_url: p.externalUrl || null,
        case_study_doc_url: p.caseStudyDocUrl || null,
        order_index: idx,
        visible: p.visible ?? true,
        display_placeholders: p.displayPlaceholders || [],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('projects')
        .upsert(records, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save all projects error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase save all projects exception:', err);
      return false;
    }
  }

  return true;
}

// ==========================================
// 2. PLAYGROUND PROJECTS
// ==========================================

export async function fetchPlaygroundData(): Promise<Record<string, any>> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('playground_projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        const result: Record<string, any> = {};
        data.forEach((row) => {
          result[row.id] = {
            id: row.id,
            title: row.title,
            subtitle: row.subtitle,
            category: row.category,
            overview: row.overview,
            challenge: row.challenge,
            solution: row.solution,
            bgPhoto: row.background_image_url,
            logoPhoto: row.logo_url,
            demoUrl: row.demo_url,
            tags: row.tags,
            deliverables: row.deliverables,
            images: row.showcase_images || []
          };
        });
        cachedPlayground = result;
        return result;
      }
    } catch (err) {
      console.warn('Failed to load playground from Supabase:', err);
    }
  }

  return cachedPlayground || {};
}

export function getCachedPlaygroundData(): Record<string, any> {
  return cachedPlayground || {};
}

export async function savePlaygroundProject(projectId: string, data: any): Promise<boolean> {
  const supabase = getSupabase();

  const record = {
    id: projectId,
    title: data.title || projectId,
    subtitle: data.subtitle || '',
    category: data.category || '',
    overview: data.overview || '',
    challenge: data.challenge || '',
    solution: data.solution || '',
    background_image_url: data.bgPhoto || '',
    logo_url: data.logoPhoto || '',
    demo_url: data.demoUrl || '',
    tags: data.tags || [],
    deliverables: data.deliverables || [],
    showcase_images: data.images || [],
    updated_at: new Date().toISOString()
  };

  if (!cachedPlayground) cachedPlayground = {};
  cachedPlayground[projectId] = { ...cachedPlayground[projectId], ...data };
  window.dispatchEvent(new Event(EVENT_CLOUD_PLAYGROUND_UPDATED));

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('playground_projects')
        .upsert(record, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save playground error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase save playground exception:', err);
      return false;
    }
  }

  return true;
}

// ==========================================
// 3. ABOUT CONTENT
// ==========================================

export async function fetchAboutContent(): Promise<any> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        cachedAbout = {
          philosophies: data.philosophies || [],
          bio: data.bio || '',
          profilePhotoUrl: data.profile_photo_url || '',
          hobbies: data.hobbies || []
        };
        return cachedAbout;
      }
    } catch (err) {
      console.warn('Failed to load about content from Supabase:', err);
    }
  }

  return cachedAbout || null;
}

export function getCachedAboutContent(): any {
  return cachedAbout || null;
}

export async function saveAboutContent(data: any): Promise<boolean> {
  const supabase = getSupabase();

  const record = {
    id: 'default',
    philosophies: data.philosophies || [],
    bio: data.bio || '',
    profile_photo_url: data.profilePhotoUrl || '',
    hobbies: data.hobbies || [],
    updated_at: new Date().toISOString()
  };

  cachedAbout = data;
  window.dispatchEvent(new Event(EVENT_CLOUD_ABOUT_UPDATED));

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert(record, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save about error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase save about exception:', err);
      return false;
    }
  }

  return true;
}

// ==========================================
// 4. CV CONTENT
// ==========================================

export async function fetchCVContent(): Promise<any> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('cv_content')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        cachedCV = {
          experiences: data.experiences || [],
          education: data.education || [],
          skills: data.skills || [],
          resumeMeta: data.resume_meta || {}
        };
        return cachedCV;
      }
    } catch (err) {
      console.warn('Failed to load CV content from Supabase:', err);
    }
  }

  return cachedCV || null;
}

export function getCachedCVContent(): any {
  return cachedCV || null;
}

export async function saveCVContent(data: any): Promise<boolean> {
  const supabase = getSupabase();

  const record = {
    id: 'default',
    experiences: data.experiences || [],
    education: data.education || [],
    skills: data.skills || [],
    resume_meta: data.resumeMeta || {},
    updated_at: new Date().toISOString()
  };

  cachedCV = data;
  window.dispatchEvent(new Event(EVENT_CLOUD_CV_UPDATED));

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('cv_content')
        .upsert(record, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save CV error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase save CV exception:', err);
      return false;
    }
  }

  return true;
}

// ==========================================
// 5. ONE-TIME MIGRATION OF LOCAL ADMIN DATA
// ==========================================

export interface MigrationReport {
  projectsMigrated: number;
  playgroundProjectsMigrated: number;
  aboutMigrated: boolean;
  cvMigrated: boolean;
  imagesUploaded: number;
  errors: string[];
}

export async function migrateLocalAdminDataToCloud(
  onProgress?: (step: string, percent: number) => void
): Promise<MigrationReport> {
  const report: MigrationReport = {
    projectsMigrated: 0,
    playgroundProjectsMigrated: 0,
    aboutMigrated: false,
    cvMigrated: false,
    imagesUploaded: 0,
    errors: []
  };

  if (onProgress) onProgress('Auditing local storage data...', 10);

  // Helper to convert and upload image if Base64
  const processImage = async (url: string | undefined, name: string): Promise<string> => {
    if (!url) return '';
    if (url.startsWith('data:image/')) {
      try {
        const cloudUrl = await uploadBase64ToCloud(url, name);
        report.imagesUploaded++;
        return cloudUrl;
      } catch (err: any) {
        report.errors.push(`Failed to upload ${name}: ${err.message}`);
        return url;
      }
    }
    return url;
  };

  // 1. Projects
  if (onProgress) onProgress('Migrating Featured Projects...', 25);
  try {
    const savedProjectsRaw = localStorage.getItem('portfolio_projects_data');
    let projectsToMigrate: Project[] = CANONICAL_PROJECTS;

    if (savedProjectsRaw) {
      try {
        const parsed = JSON.parse(savedProjectsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          projectsToMigrate = parsed;
        }
      } catch (e) {
        report.errors.push('Error parsing local projects');
      }
    }

    const processedProjects: Project[] = [];
    for (const p of projectsToMigrate) {
      const cardImage = await processImage(p.cardImage, `${p.id}-cover`);
      const placeholders = [];
      if (Array.isArray(p.displayPlaceholders)) {
        for (let i = 0; i < p.displayPlaceholders.length; i++) {
          const ph = p.displayPlaceholders[i];
          const img = await processImage(ph.imageUrl, `${p.id}-display-0${i + 1}`);
          placeholders.push({ ...ph, imageUrl: img });
        }
      }
      processedProjects.push({
        ...p,
        cardImage,
        displayPlaceholders: placeholders
      });
    }

    const ok = await saveAllProjects(processedProjects);
    if (ok) report.projectsMigrated = processedProjects.length;
    else report.errors.push('Failed to save projects to Supabase database.');
  } catch (e: any) {
    report.errors.push(`Projects migration failed: ${e.message}`);
  }

  // 2. Playground Projects
  if (onProgress) onProgress('Migrating Playground content...', 50);
  try {
    const playgroundIds = ['teajourney', 'lumipal', 'tarot', 'pawgress'];
    for (const pid of playgroundIds) {
      let data: any = {};
      const dataRaw = localStorage.getItem(`portfolio_playground_project_data_${pid}`);
      if (dataRaw) {
        try {
          data = JSON.parse(dataRaw);
        } catch {
          // ignore
        }
      }

      // Check logo
      const logoRaw = localStorage.getItem(`portfolio_playground_logo_${pid}`);
      if (logoRaw) {
        data.logoPhoto = await processImage(logoRaw, `logo-${pid}`);
      }

      // Check gallery images
      const galleryRaw = localStorage.getItem(`portfolio_playground_images_${pid}`);
      if (galleryRaw) {
        try {
          const gallery = JSON.parse(galleryRaw);
          if (Array.isArray(gallery)) {
            const processedGallery = [];
            for (let i = 0; i < gallery.length; i++) {
              const item = gallery[i];
              const imgUrl = await processImage(item.url, `${pid}-gallery-0${i + 1}`);
              processedGallery.push({ ...item, url: imgUrl });
            }
            data.images = processedGallery;
          }
        } catch {
          // ignore
        }
      }

      const ok = await savePlaygroundProject(pid, data);
      if (ok) report.playgroundProjectsMigrated++;
    }
  } catch (e: any) {
    report.errors.push(`Playground migration failed: ${e.message}`);
  }

  // 3. About Page
  if (onProgress) onProgress('Migrating About & Philosophies...', 75);
  try {
    const philosophiesRaw = localStorage.getItem('portfolio_about_philosophies') 
      || localStorage.getItem('portfolio_philosophies');
    let philosophies = [];
    if (philosophiesRaw) {
      try {
        philosophies = JSON.parse(philosophiesRaw);
      } catch {
        // ignore
      }
    }

    const ok = await saveAboutContent({ philosophies });
    if (ok) report.aboutMigrated = true;
  } catch (e: any) {
    report.errors.push(`About migration failed: ${e.message}`);
  }

  // 4. CV & Resume
  if (onProgress) onProgress('Migrating CV & Resume...', 90);
  try {
    const expRaw = localStorage.getItem('portfolio_cv_experiences');
    const eduRaw = localStorage.getItem('portfolio_cv_education_v3');
    const skillsRaw = localStorage.getItem('portfolio_cv_skills_v4');
    const pdfRaw = localStorage.getItem('portfolio_custom_resume_pdf');
    const nameRaw = localStorage.getItem('portfolio_custom_resume_name');
    const dateRaw = localStorage.getItem('portfolio_custom_resume_date');
    const sizeRaw = localStorage.getItem('portfolio_custom_resume_size');

    let experiences = [];
    let education = [];
    let skills = [];
    let resumeMeta: any = {};

    if (expRaw) try { experiences = JSON.parse(expRaw); } catch {}
    if (eduRaw) try { education = JSON.parse(eduRaw); } catch {}
    if (skillsRaw) try { skills = JSON.parse(skillsRaw); } catch {}

    if (pdfRaw) {
      const cloudPdfUrl = await processImage(pdfRaw, nameRaw || 'resume.pdf');
      resumeMeta = {
        pdfUrl: cloudPdfUrl,
        fileName: nameRaw || 'resume.pdf',
        uploadDate: dateRaw || '',
        fileSize: sizeRaw || ''
      };
    }

    const ok = await saveCVContent({
      experiences,
      education,
      skills,
      resumeMeta
    });
    if (ok) report.cvMigrated = true;
  } catch (e: any) {
    report.errors.push(`CV migration failed: ${e.message}`);
  }

  if (onProgress) onProgress('Migration complete!', 100);
  return report;
}
