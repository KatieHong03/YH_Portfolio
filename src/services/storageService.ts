import { getSupabase, STORAGE_BUCKET, isSupabaseConfigured } from '../lib/supabase';

/**
 * Uploads a File or Blob directly to Supabase Storage and returns its permanent hosted public URL.
 */
export async function uploadMediaToCloud(
  fileOrBlob: File | Blob, 
  suggestedFilename: string, 
  folder = 'uploads'
): Promise<string> {
  const supabase = getSupabase();

  // If Supabase is configured, use real Supabase Storage
  if (supabase && isSupabaseConfigured()) {
    const ext = suggestedFilename.includes('.') 
      ? suggestedFilename.substring(suggestedFilename.lastIndexOf('.')) 
      : '.jpg';
    const cleanBase = suggestedFilename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();
    const timestamp = Date.now();
    const storagePath = `${folder}/${cleanBase}-${timestamp}${ext}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileOrBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType: (fileOrBlob as any).type || 'image/jpeg'
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw new Error(`Cloud storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    if (publicUrlData && publicUrlData.publicUrl) {
      return publicUrlData.publicUrl;
    }
  }

  // Fallback to local server API if Supabase Storage is not yet configured
  console.warn('Supabase Storage not configured. Falling back to local server upload.');
  const formData = new FormData();
  formData.append('image', fileOrBlob, suggestedFilename);

  const res = await fetch('/api/admin/upload-image-file', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    const json = await res.json();
    return json.url || '';
  }

  throw new Error('Storage is not configured and local upload failed.');
}

/**
 * Converts a Base64 data URL to a Blob and uploads it to Supabase Storage.
 */
export async function uploadBase64ToCloud(
  dataUrl: string, 
  suggestedFilename: string,
  folder = 'migrated'
): Promise<string> {
  // If it is already a permanent hosted URL (http/https), return directly
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
    return dataUrl;
  }

  // If it is a relative /images/ path, it is already a canonical asset
  if (dataUrl.startsWith('/images/')) {
    return dataUrl;
  }

  // If it is a data: URL, convert to Blob and upload
  if (dataUrl.startsWith('data:')) {
    const parts = dataUrl.split(';base64,');
    const mimeType = parts[0].replace('data:', '');
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return uploadMediaToCloud(blob, suggestedFilename, folder);
  }

  return dataUrl;
}
