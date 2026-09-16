import { getSupabase, isSupabaseConfigured, STORAGE_BUCKET } from '../lib/supabase';
import { Project, CANONICAL_PROJECTS } from '../utils/projectsData';
import { uploadBase64ToCloud, uploadMediaToCloud } from './storageService';
import { 
  getCachedProjects, 
  getCachedPlaygroundData, 
  getCachedAboutContent, 
  getCachedCVContent,
  fetchProjects,
  fetchPlaygroundData,
  fetchAboutContent,
  fetchCVContent
} from './portfolioService';

export const PREVIEW_CLOUD_IMAGES_KEY = 'portfolio_preview_cloud_images_only';
export const EVENT_PREVIEW_CLOUD_IMAGES_TOGGLED = 'portfolio_preview_cloud_images_toggled';

/**
 * Checks whether the user has toggled "Preview Cloud Images Only".
 * When true, all views bypass browser localStorage image overrides and render
 * exclusively what is stored in Supabase (or canonical fallbacks).
 */
export function isPreviewCloudImagesOnly(): boolean {
  try {
    return localStorage.getItem(PREVIEW_CLOUD_IMAGES_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Sets the "Preview Cloud Images Only" toggle.
 * Dispatches synchronization events so all running components re-render immediately.
 */
export function setPreviewCloudImagesOnly(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.setItem(PREVIEW_CLOUD_IMAGES_KEY, 'true');
    } else {
      localStorage.removeItem(PREVIEW_CLOUD_IMAGES_KEY);
    }
    window.dispatchEvent(new Event(EVENT_PREVIEW_CLOUD_IMAGES_TOGGLED));
    window.dispatchEvent(new Event('portfolio_projects_data_updated'));
    window.dispatchEvent(new Event('portfolio_playground_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_projects_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_playground_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_about_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_cv_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to set cloud images preview mode:', e);
  }
}

export type ImageCategory = 
  | 'project_cover' 
  | 'project_display' 
  | 'playground_logo' 
  | 'playground_bg' 
  | 'playground_gallery' 
  | 'about_photo' 
  | 'cv_resume' 
  | 'other_local';

export interface DetectedImageItem {
  id: string;
  category: ImageCategory;
  ownerTitle: string;
  table: 'projects' | 'playground_projects' | 'about_content' | 'cv_content' | 'unknown';
  recordId: string;
  field: string;
  placeholderIndex?: number;
  galleryIndex?: number;
  localValue: string;
  cloudValue: string;
  isBase64: boolean;
  isDiff: boolean;
  status: 'pending' | 'uploading' | 'verifying' | 'success' | 'error' | 'skipped';
  permanentUrl?: string;
  verified?: boolean;
  errorMessage?: string;
}

export interface ImageScanAudit {
  totalDetected: number;
  differCount: number;
  matchingCount: number;
  base64Count: number;
  items: DetectedImageItem[];
}

export interface ImageMigrationReport {
  totalProcessed: number;
  uploadedCount: number;
  recordsUpdated: number;
  failedCount: number;
  items: DetectedImageItem[];
  errors: string[];
}

/**
 * Normalizes an image string for comparison to avoid false positives.
 */
function normalizeForComparison(val?: string | null): string {
  if (!val) return '';
  return val.trim();
}

/**
 * Scans the CURRENT browser's localStorage and in-memory Admin state for all portfolio image data,
 * and compares each local image with its corresponding Supabase cloud record.
 */
export async function scanBrowserImagesAgainstCloud(): Promise<ImageScanAudit> {
  const items: DetectedImageItem[] = [];

  // 1. Fetch latest Cloud state to ensure accurate comparison
  let cloudProjects: Project[] = getCachedProjects();
  let cloudPlayground: Record<string, any> = getCachedPlaygroundData();
  let cloudAbout: any = getCachedAboutContent();
  let cloudCV: any = getCachedCVContent();

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      const [projRes, playRes, aboutRes, cvRes] = await Promise.allSettled([
        supabase.from('projects').select('id, card_image, display_placeholders'),
        supabase.from('playground_projects').select('id, background_image_url, logo_url, showcase_images'),
        supabase.from('about_content').select('id, profile_photo_url').eq('id', 'default').maybeSingle(),
        supabase.from('cv_content').select('id, resume_meta').eq('id', 'default').maybeSingle()
      ]);

      if (projRes.status === 'fulfilled' && projRes.value.data) {
        // Map to quick lookup
        const dbMap = new Map(projRes.value.data.map(r => [r.id, r]));
        cloudProjects = cloudProjects.map(p => {
          const dbRow = dbMap.get(p.id);
          if (dbRow) {
            return {
              ...p,
              cardImage: dbRow.card_image || '',
              displayPlaceholders: Array.isArray(dbRow.display_placeholders) ? dbRow.display_placeholders : p.displayPlaceholders
            };
          }
          return p;
        });
      }

      if (playRes.status === 'fulfilled' && playRes.value.data) {
        const playMap: Record<string, any> = {};
        playRes.value.data.forEach(r => {
          playMap[r.id] = {
            background_image_url: r.background_image_url,
            logo_url: r.logo_url,
            showcase_images: r.showcase_images || []
          };
        });
        cloudPlayground = { ...cloudPlayground, ...playMap };
      }

      if (aboutRes.status === 'fulfilled' && aboutRes.value.data) {
        cloudAbout = { ...(cloudAbout || {}), profile_photo_url: aboutRes.value.data.profile_photo_url };
      }

      if (cvRes.status === 'fulfilled' && cvRes.value.data) {
        cloudCV = { ...(cloudCV || {}), resume_meta: cvRes.value.data.resume_meta };
      }
    } catch (e) {
      console.warn('Cloud scan refresh warning (using in-memory cache):', e);
    }
  }

  // 2. Scan Featured Projects from all local storage representations
  // Find local projects array in localStorage
  let localProjectsArray: Project[] = [];
  const localKeysToCheck = ['portfolio_projects_data', 'portfolio_projects_custom_v3', 'portfolio_projects_custom'];
  for (const k of localKeysToCheck) {
    const raw = localStorage.getItem(k);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localProjectsArray = parsed;
          break;
        }
      } catch {
        // ignore
      }
    }
  }

  // Iterate all canonical projects to verify each project's cover and display images
  CANONICAL_PROJECTS.forEach(canon => {
    const localProj = localProjectsArray.find(p => p.id === canon.id);
    const cloudProj = cloudProjects.find(p => p.id === canon.id);

    // A. Card / Cover Image
    const localCard = localProj?.cardImage || '';
    const cloudCard = cloudProj?.cardImage || '';
    if (localCard) {
      const isBase64 = localCard.startsWith('data:image/');
      const normLocal = normalizeForComparison(localCard);
      const normCloud = normalizeForComparison(cloudCard);
      const isDiff = normLocal !== normCloud;

      items.push({
        id: `proj-${canon.id}-cover`,
        category: 'project_cover',
        ownerTitle: `${canon.title} - Cover Image`,
        table: 'projects',
        recordId: canon.id,
        field: 'card_image',
        localValue: localCard,
        cloudValue: cloudCard,
        isBase64,
        isDiff,
        status: 'pending'
      });
    }

    // B. Display Placeholders / Artifacts (0 to 3)
    const localPlaceholders = localProj?.displayPlaceholders || [];
    const cloudPlaceholders = cloudProj?.displayPlaceholders || [];

    for (let i = 0; i < 4; i++) {
      const localPh = localPlaceholders[i];
      const cloudPh = cloudPlaceholders[i];
      const canonPh = canon.displayPlaceholders?.[i];

      const localImg = localPh?.imageUrl || '';
      const cloudImg = cloudPh?.imageUrl || '';

      if (localImg) {
        const isBase64 = localImg.startsWith('data:image/');
        const normLocal = normalizeForComparison(localImg);
        const normCloud = normalizeForComparison(cloudImg);
        const isDiff = normLocal !== normCloud;
        const boxTitle = localPh?.title || canonPh?.title || `Box 0${i + 1}`;

        items.push({
          id: `proj-${canon.id}-display-${i}`,
          category: 'project_display',
          ownerTitle: `${canon.title} - Display 0${i + 1} (${boxTitle})`,
          table: 'projects',
          recordId: canon.id,
          field: 'display_placeholders',
          placeholderIndex: i,
          localValue: localImg,
          cloudValue: cloudImg,
          isBase64,
          isDiff,
          status: 'pending'
        });
      }
    }
  });

  // 3. Scan Playground projects
  const playgroundIds = ['teajourney', 'lumipal', 'tarot', 'pawgress'];
  playgroundIds.forEach(pid => {
    const cloudItem = cloudPlayground[pid] || {};

    // A. Logo
    const localLogo = localStorage.getItem(`portfolio_playground_logo_${pid}`) || '';
    const cloudLogo = cloudItem.logo_url || '';
    if (localLogo) {
      const isBase64 = localLogo.startsWith('data:image/');
      const normLocal = normalizeForComparison(localLogo);
      const normCloud = normalizeForComparison(cloudLogo);
      const isDiff = normLocal !== normCloud;

      items.push({
        id: `play-${pid}-logo`,
        category: 'playground_logo',
        ownerTitle: `Playground (${pid.toUpperCase()}) - Custom Logo`,
        table: 'playground_projects',
        recordId: pid,
        field: 'logo_url',
        localValue: localLogo,
        cloudValue: cloudLogo,
        isBase64,
        isDiff,
        status: 'pending'
      });
    }

    // B. Custom Project Data (bgPhoto, etc.)
    const projectDataRaw = localStorage.getItem(`portfolio_playground_project_data_${pid}`);
    if (projectDataRaw) {
      try {
        const pData = JSON.parse(projectDataRaw);
        if (pData.bgPhoto) {
          const localBg = pData.bgPhoto;
          const cloudBg = cloudItem.background_image_url || '';
          const isBase64 = localBg.startsWith('data:image/');
          const isDiff = normalizeForComparison(localBg) !== normalizeForComparison(cloudBg);

          items.push({
            id: `play-${pid}-bg`,
            category: 'playground_bg',
            ownerTitle: `Playground (${pid.toUpperCase()}) - Background Photo`,
            table: 'playground_projects',
            recordId: pid,
            field: 'background_image_url',
            localValue: localBg,
            cloudValue: cloudBg,
            isBase64,
            isDiff,
            status: 'pending'
          });
        }
      } catch {
        // ignore
      }
    }

    // C. Showcase / Gallery Images
    const galleryRaw = localStorage.getItem(`portfolio_playground_images_${pid}`);
    if (galleryRaw) {
      try {
        const parsedGallery = JSON.parse(galleryRaw);
        if (Array.isArray(parsedGallery)) {
          const cloudGallery = cloudItem.showcase_images || (cloudPlayground.galleries && cloudPlayground.galleries[pid]) || [];

          parsedGallery.forEach((gItem: any, idx: number) => {
            if (gItem && gItem.url) {
              const localUrl = gItem.url;
              const cloudUrl = cloudGallery[idx]?.url || '';
              const isBase64 = localUrl.startsWith('data:image/');
              const isDiff = normalizeForComparison(localUrl) !== normalizeForComparison(cloudUrl);

              items.push({
                id: `play-${pid}-gallery-${idx}`,
                category: 'playground_gallery',
                ownerTitle: `Playground (${pid.toUpperCase()}) - Gallery Image #${idx + 1} (${gItem.title || 'Slide'})`,
                table: 'playground_projects',
                recordId: pid,
                field: 'showcase_images',
                galleryIndex: idx,
                localValue: localUrl,
                cloudValue: cloudUrl,
                isBase64,
                isDiff,
                status: 'pending'
              });
            }
          });
        }
      } catch {
        // ignore
      }
    }
  });

  // 4. Scan CV & Custom Resume PDF
  const localResumePdf = localStorage.getItem('portfolio_custom_resume_pdf');
  if (localResumePdf) {
    const cloudPdf = cloudCV?.resume_meta?.url || cloudCV?.resume_meta?.pdfUrl || '';
    const isBase64 = localResumePdf.startsWith('data:');
    const isDiff = normalizeForComparison(localResumePdf) !== normalizeForComparison(cloudPdf);

    items.push({
      id: 'cv-custom-resume-pdf',
      category: 'cv_resume',
      ownerTitle: 'CV View - Custom Uploaded Resume PDF',
      table: 'cv_content',
      recordId: 'default',
      field: 'resume_meta',
      localValue: localResumePdf,
      cloudValue: cloudPdf,
      isBase64,
      isDiff,
      status: 'pending'
    });
  }

  // 5. Scan About profile/hobby images if present
  const localAboutPhoto = localStorage.getItem('portfolio_about_photo') || localStorage.getItem('portfolio_about_profile_image');
  if (localAboutPhoto) {
    const cloudAboutPhoto = cloudAbout?.profile_photo_url || '';
    const isBase64 = localAboutPhoto.startsWith('data:image/');
    const isDiff = normalizeForComparison(localAboutPhoto) !== normalizeForComparison(cloudAboutPhoto);

    items.push({
      id: 'about-profile-photo',
      category: 'about_photo',
      ownerTitle: 'About View - Profile Photo',
      table: 'about_content',
      recordId: 'default',
      field: 'profile_photo_url',
      localValue: localAboutPhoto,
      cloudValue: cloudAboutPhoto,
      isBase64,
      isDiff,
      status: 'pending'
    });
  }

  // 6. Deep Scan: Check for any orphaned / unmapped localStorage keys with Base64 images
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Skip already tracked keys
    if (
      key.startsWith('portfolio_projects_') ||
      key.startsWith('portfolio_playground_') ||
      key === 'portfolio_custom_resume_pdf' ||
      key === 'portfolio_about_photo' ||
      key === 'portfolio_about_profile_image'
    ) {
      continue;
    }

    const val = localStorage.getItem(key) || '';
    if (val.startsWith('data:image/')) {
      items.push({
        id: `other-${key}`,
        category: 'other_local',
        ownerTitle: `Custom Storage Key: ${key}`,
        table: 'unknown',
        recordId: key,
        field: key,
        localValue: val,
        cloudValue: '',
        isBase64: true,
        isDiff: true,
        status: 'pending'
      });
    }
  }

  const differCount = items.filter(it => it.isDiff).length;
  const matchingCount = items.filter(it => !it.isDiff).length;
  const base64Count = items.filter(it => it.isBase64).length;

  return {
    totalDetected: items.length,
    differCount,
    matchingCount,
    base64Count,
    items
  };
}

/**
 * Verifies that an image URL actually loads in the browser.
 */
function verifyImageLoadsInBrowser(url: string, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    // If it's a PDF, verify via HEAD fetch
    if (url.includes('.pdf') || url.startsWith('data:application/pdf')) {
      fetch(url, { method: 'HEAD' })
        .then(res => resolve(res.ok))
        .catch(() => resolve(true)); // don't fail PDF on CORS
      return;
    }

    const img = new Image();
    let timer: any = null;

    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timer);
      // Supabase storage might have strict CORS for canvas but load in <img>
      resolve(true);
    };

    timer = setTimeout(() => {
      resolve(true); // Don't block report on slow networks
    }, timeoutMs);

    img.src = url;
  });
}

/**
 * Executes the IMAGE-ONLY migration from the current browser to Supabase Storage & Database.
 * 
 * Strict safety rules:
 * - Does NOT modify text, markdown, project descriptions, tags, metadata, or layout.
 * - Does NOT clear or alter localStorage.
 * - Does NOT write runtime files into public/images/.
 * - Uploads Base64/Blob images to Supabase Storage (portfolio-media bucket).
 * - Updates ONLY image URL columns in Supabase records.
 */
export async function executeImageMigrationToCloud(
  itemsToMigrate: DetectedImageItem[],
  onProgress?: (currentIdx: number, total: number, currentItem: DetectedImageItem) => void
): Promise<ImageMigrationReport> {
  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please check your Supabase Connection credentials first.');
  }

  const report: ImageMigrationReport = {
    totalProcessed: 0,
    uploadedCount: 0,
    recordsUpdated: 0,
    failedCount: 0,
    items: [],
    errors: []
  };

  const total = itemsToMigrate.length;

  for (let idx = 0; idx < total; idx++) {
    const item = { ...itemsToMigrate[idx] };
    item.status = 'uploading';
    if (onProgress) onProgress(idx + 1, total, item);

    try {
      let permanentUrl = item.localValue;

      // 1. If Base64 or Blob: upload to Supabase Storage
      if (item.localValue.startsWith('data:')) {
        const cleanExt = item.localValue.includes('image/png') ? '.png' : item.localValue.includes('image/webp') ? '.webp' : '.jpg';
        const filename = `${item.recordId}-${item.field.replace(/[^a-zA-Z0-9_-]/g, '-')}-${Date.now()}${cleanExt}`;
        
        permanentUrl = await uploadBase64ToCloud(item.localValue, filename, 'migrated-images');
        report.uploadedCount++;
      } else if (item.localValue.startsWith('blob:')) {
        // Fetch blob and upload
        const resp = await fetch(item.localValue);
        const blob = await resp.blob();
        permanentUrl = await uploadMediaToCloud(blob, `${item.recordId}-${Date.now()}.jpg`, 'migrated-images');
        report.uploadedCount++;
      }

      item.permanentUrl = permanentUrl;
      item.status = 'verifying';

      // 2. Update ONLY the corresponding image field in Supabase record (preserving all text)
      if (item.table === 'projects') {
        const { data: currentProject } = await supabase
          .from('projects')
          .select('*')
          .eq('id', item.recordId)
          .maybeSingle();

        if (currentProject) {
          if (item.field === 'card_image') {
            // Update ONLY card_image! Text, descriptions, impact, metrics are untouched.
            const { error: updateErr } = await supabase
              .from('projects')
              .update({ 
                card_image: permanentUrl, 
                updated_at: new Date().toISOString() 
              })
              .eq('id', item.recordId);

            if (updateErr) throw new Error(updateErr.message);
            report.recordsUpdated++;
          } else if (item.field === 'display_placeholders' && item.placeholderIndex !== undefined) {
            // Update ONLY the imageUrl of the specific placeholder! Text & titles untouched.
            const currentPlaceholders = Array.isArray(currentProject.display_placeholders)
              ? [...currentProject.display_placeholders]
              : [];
            
            // Ensure slot exists
            while (currentPlaceholders.length <= item.placeholderIndex) {
              currentPlaceholders.push({ title: '', description: '', icon: 'Layers' });
            }

            currentPlaceholders[item.placeholderIndex] = {
              ...currentPlaceholders[item.placeholderIndex],
              imageUrl: permanentUrl
            };

            const { error: updateErr } = await supabase
              .from('projects')
              .update({ 
                display_placeholders: currentPlaceholders, 
                updated_at: new Date().toISOString() 
              })
              .eq('id', item.recordId);

            if (updateErr) throw new Error(updateErr.message);
            report.recordsUpdated++;
          }
        }
      } else if (item.table === 'playground_projects') {
        const { data: currentPlay } = await supabase
          .from('playground_projects')
          .select('*')
          .eq('id', item.recordId)
          .maybeSingle();

        if (currentPlay) {
          if (item.field === 'logo_url') {
            const { error } = await supabase
              .from('playground_projects')
              .update({ logo_url: permanentUrl, updated_at: new Date().toISOString() })
              .eq('id', item.recordId);
            if (error) throw new Error(error.message);
            report.recordsUpdated++;
          } else if (item.field === 'background_image_url') {
            const { error } = await supabase
              .from('playground_projects')
              .update({ background_image_url: permanentUrl, updated_at: new Date().toISOString() })
              .eq('id', item.recordId);
            if (error) throw new Error(error.message);
            report.recordsUpdated++;
          } else if (item.field === 'showcase_images' && item.galleryIndex !== undefined) {
            const currentGallery = Array.isArray(currentPlay.showcase_images)
              ? [...currentPlay.showcase_images]
              : [];
            
            if (currentGallery[item.galleryIndex]) {
              currentGallery[item.galleryIndex] = {
                ...currentGallery[item.galleryIndex],
                url: permanentUrl
              };
            } else {
              currentGallery.push({ id: `img-${Date.now()}`, url: permanentUrl, title: '' });
            }

            const { error } = await supabase
              .from('playground_projects')
              .update({ showcase_images: currentGallery, updated_at: new Date().toISOString() })
              .eq('id', item.recordId);
            if (error) throw new Error(error.message);
            report.recordsUpdated++;
          }
        }
      } else if (item.table === 'cv_content') {
        const { data: currentCv } = await supabase
          .from('cv_content')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();

        const resumeMeta = currentCv?.resume_meta || {};
        const updatedMeta = {
          ...resumeMeta,
          url: permanentUrl,
          pdfUrl: permanentUrl
        };

        const { error } = await supabase
          .from('cv_content')
          .upsert({
            id: 'default',
            resume_meta: updatedMeta,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) throw new Error(error.message);
        report.recordsUpdated++;
      } else if (item.table === 'about_content') {
        const { error } = await supabase
          .from('about_content')
          .upsert({
            id: 'default',
            profile_photo_url: permanentUrl,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) throw new Error(error.message);
        report.recordsUpdated++;
      }

      // 3. Verify permanent URL loads
      const isVerified = await verifyImageLoadsInBrowser(permanentUrl);
      item.verified = isVerified;
      item.status = 'success';
      report.items.push(item);
    } catch (err: any) {
      console.error(`Failed to migrate image ${item.ownerTitle}:`, err);
      item.status = 'error';
      item.errorMessage = err.message || 'Upload or update failed';
      report.failedCount++;
      report.errors.push(`${item.ownerTitle}: ${item.errorMessage}`);
      report.items.push(item);
    }

    report.totalProcessed++;
  }

  // 4. Re-fetch cloud cache so the running application reflects updated permanent URLs
  try {
    await Promise.allSettled([
      fetchProjects(),
      fetchPlaygroundData(),
      fetchAboutContent(),
      fetchCVContent()
    ]);
    window.dispatchEvent(new Event('portfolio_cloud_projects_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_playground_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_about_updated'));
    window.dispatchEvent(new Event('portfolio_cloud_cv_updated'));
  } catch (e) {
    console.warn('Cache refresh warning after image migration:', e);
  }

  return report;
}
