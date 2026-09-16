/**
 * Saves a File or Blob directly to /public/images/ on the server and returns its public path (/images/...).
 */
export async function uploadMediaToCloud(
  fileOrBlob: File | Blob, 
  suggestedFilename: string, 
  _folder = 'uploads'
): Promise<string> {
  const reader = new FileReader();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(fileOrBlob);
  });

  try {
    const res = await fetch('/api/admin/save-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: suggestedFilename,
        dataUrl,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.url) return json.url;
    }
  } catch (err) {
    console.warn('Local server save failed, using dataUrl fallback:', err);
  }

  // Fallback to dataUrl in browser memory
  return dataUrl;
}

/**
 * Converts a Base64 data URL to a saved local asset path if possible.
 */
export async function uploadBase64ToCloud(
  dataUrl: string, 
  suggestedFilename: string,
  _folder = 'migrated'
): Promise<string> {
  // If it is already a permanent or relative /images/ path, return directly
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/images/')) {
    return dataUrl;
  }

  // If it is a data: URL, save to server
  if (dataUrl.startsWith('data:')) {
    try {
      const res = await fetch('/api/admin/save-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: suggestedFilename,
          dataUrl,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.url) return json.url;
      }
    } catch {
      // Return dataUrl as fallback
    }
  }

  return dataUrl;
}
