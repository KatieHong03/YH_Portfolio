import { Project, CANONICAL_PROJECTS } from '../utils/projectsData';

export const EVENT_CLOUD_PROJECTS_UPDATED = 'portfolio_cloud_projects_updated';
export const EVENT_CLOUD_PLAYGROUND_UPDATED = 'portfolio_cloud_playground_updated';
export const EVENT_CLOUD_ABOUT_UPDATED = 'portfolio_cloud_about_updated';
export const EVENT_CLOUD_CV_UPDATED = 'portfolio_cloud_cv_updated';

// In-memory cache for all portfolio data
let cachedProjects: Project[] | null = null;
let cachedPlayground: Record<string, any> | null = null;
let cachedAbout: any | null = null;
let cachedCV: any | null = null;
let isInitialized = false;

/**
 * Initializes and fetches canonical data from the server disk.
 * This guarantees that changes made in admin mode are permanently loaded
 * across all computers, browsers, and page refreshes.
 */
export async function initPortfolioData(force = false): Promise<void> {
  if (isInitialized && !force) return;

  try {
    const res = await fetch('/api/portfolio-data', {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // 1. Projects
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          cachedProjects = data.projects;
          if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_projects_data', JSON.stringify(data.projects));
            window.dispatchEvent(new Event(EVENT_CLOUD_PROJECTS_UPDATED));
          }
        }

        // 2. Playground Projects
        if (data.playgroundProjects && typeof data.playgroundProjects === 'object') {
          cachedPlayground = data.playgroundProjects;
          if (typeof window !== 'undefined') {
            Object.entries(data.playgroundProjects).forEach(([id, pData]) => {
              localStorage.setItem(`portfolio_playground_project_data_${id}`, JSON.stringify(pData));
            });
            window.dispatchEvent(new Event(EVENT_CLOUD_PLAYGROUND_UPDATED));
          }
        }

        // 3. About / Philosophies
        if (Array.isArray(data.philosophies) && data.philosophies.length > 0) {
          cachedAbout = { philosophies: data.philosophies };
          if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_about_philosophies', JSON.stringify(data.philosophies));
            window.dispatchEvent(new Event(EVENT_CLOUD_ABOUT_UPDATED));
          }
        }

        // 4. CV Content
        if (data.cv) {
          cachedCV = data.cv;
          if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_cv_data', JSON.stringify(data.cv));
            window.dispatchEvent(new Event(EVENT_CLOUD_CV_UPDATED));
          }
        }

        isInitialized = true;
      }
    }
  } catch (err) {
    console.warn('Failed to load portfolio data from server:', err);
  }
}

// Auto-trigger init on module import in browser
if (typeof window !== 'undefined') {
  initPortfolioData().catch(() => {});
}

// ==========================================
// 1. PROJECTS (WORK / CASE STUDIES)
// ==========================================

export async function fetchProjects(): Promise<Project[]> {
  // If not initialized yet, wait for server fetch
  if (!isInitialized) {
    await initPortfolioData();
  }

  if (cachedProjects && cachedProjects.length > 0) {
    return cachedProjects;
  }

  // Check localStorage mirror if offline
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('portfolio_projects_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedProjects = parsed;
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }

  cachedProjects = CANONICAL_PROJECTS;
  return CANONICAL_PROJECTS;
}

export function getCachedProjects(): Project[] {
  if (cachedProjects && cachedProjects.length > 0) return cachedProjects;
  return CANONICAL_PROJECTS;
}

export async function saveProject(project: Project): Promise<boolean> {
  if (!cachedProjects) {
    cachedProjects = [...CANONICAL_PROJECTS];
  }
  
  const idx = cachedProjects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    cachedProjects[idx] = project;
  } else {
    cachedProjects.push(project);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_projects_data', JSON.stringify(cachedProjects));
    window.dispatchEvent(new Event(EVENT_CLOUD_PROJECTS_UPDATED));
  }

  // Permanently save to server disk
  return await syncAllDataToServer();
}

export async function saveAllProjects(projects: Project[]): Promise<boolean> {
  cachedProjects = projects;
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_projects_data', JSON.stringify(projects));
    window.dispatchEvent(new Event(EVENT_CLOUD_PROJECTS_UPDATED));
  }

  return await syncAllDataToServer();
}

// ==========================================
// 2. PLAYGROUND PROJECTS
// ==========================================

export async function fetchPlaygroundData(): Promise<Record<string, any>> {
  if (!isInitialized) {
    await initPortfolioData();
  }
  if (!cachedPlayground) {
    cachedPlayground = {};
  }
  return cachedPlayground;
}

export function getCachedPlaygroundData(): Record<string, any> {
  return cachedPlayground || {};
}

export async function savePlaygroundProject(projectId: string, data: any): Promise<boolean> {
  if (!cachedPlayground) cachedPlayground = {};
  cachedPlayground[projectId] = { ...cachedPlayground[projectId], ...data };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(`portfolio_playground_project_data_${projectId}`, JSON.stringify(cachedPlayground[projectId]));
    window.dispatchEvent(new Event(EVENT_CLOUD_PLAYGROUND_UPDATED));
  }

  return await syncAllDataToServer();
}

// ==========================================
// 3. ABOUT CONTENT
// ==========================================

export async function fetchAboutContent(): Promise<any> {
  if (!isInitialized) {
    await initPortfolioData();
  }
  if (cachedAbout) {
    return cachedAbout;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('portfolio_about_philosophies');
      if (saved) {
        cachedAbout = { philosophies: JSON.parse(saved) };
        return cachedAbout;
      }
    } catch {
      // ignore
    }
  }
  return cachedAbout || null;
}

export function getCachedAboutContent(): any {
  return cachedAbout || null;
}

export async function saveAboutContent(data: any): Promise<boolean> {
  cachedAbout = data;
  if (typeof window !== 'undefined') {
    if (data.philosophies) {
      localStorage.setItem('portfolio_about_philosophies', JSON.stringify(data.philosophies));
    }
    window.dispatchEvent(new Event(EVENT_CLOUD_ABOUT_UPDATED));
  }

  return await syncAllDataToServer();
}

// ==========================================
// 4. CV CONTENT
// ==========================================

export async function fetchCVContent(): Promise<any> {
  if (!isInitialized) {
    await initPortfolioData();
  }
  return cachedCV || null;
}

export function getCachedCVContent(): any {
  return cachedCV || null;
}

export async function saveCVContent(data: any): Promise<boolean> {
  cachedCV = data;
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_cv_data', JSON.stringify(data));
    window.dispatchEvent(new Event(EVENT_CLOUD_CV_UPDATED));
  }

  return await syncAllDataToServer();
}

// ==========================================
// 5. SERVER DISK SYNC (Permanent Persistence)
// ==========================================

export async function syncAllDataToServer(): Promise<boolean> {
  try {
    const payload = {
      projects: cachedProjects,
      playgroundProjects: cachedPlayground,
      philosophies: cachedAbout?.philosophies,
      cv: cachedCV
    };

    const res = await fetch('/api/admin/sync-all-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to permanently save data to server:', err);
    return false;
  }
}
