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
  Eye
} from 'lucide-react';
import { STORAGE_KEY_PROJECTS, getLiveProjects } from '../utils/projectsData';

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditReport {
  projectCount: number;
  base64ImagesCount: number;
  customCoverCount: number;
  customDisplayCount: number;
  playgroundGalleriesCount: number;
  keysDetected: string[];
}

export const AdminSyncModal: React.FC<AdminSyncModalProps> = ({ isOpen, onClose }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [audit, setAudit] = useState<AuditReport>({
    projectCount: 0,
    base64ImagesCount: 0,
    customCoverCount: 0,
    customDisplayCount: 0,
    playgroundGalleriesCount: 0,
    keysDetected: []
  });

  // Audit current browser localStorage
  const runAudit = () => {
    try {
      const keys: string[] = [];
      let base64Count = 0;
      let coverCount = 0;
      let displayCount = 0;
      let galleryCount = 0;

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
          } catch (e) {
            // ignore
          }
        }
      });

      setAudit({
        projectCount: projects.length,
        base64ImagesCount: base64Count,
        customCoverCount: coverCount,
        customDisplayCount: displayCount,
        playgroundGalleriesCount: galleryCount,
        keysDetected: keys
      });
    } catch (err) {
      console.error('Audit failed:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runAudit();
      setSyncSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleSyncToCodebase = async () => {
    setIsSyncing(true);
    setErrorMessage(null);

    try {
      // Gather all data from localStorage and live memory
      const projects = getLiveProjects();

      // Gather playground galleries
      const playgroundGalleries: Record<string, any[]> = {};
      ['teajourney', 'lumipal', 'tarot', 'pawgress'].forEach((pid) => {
        const saved = localStorage.getItem(`portfolio_playground_images_${pid}`);
        if (saved) {
          try {
            playgroundGalleries[pid] = JSON.parse(saved);
          } catch (e) {
            // ignore
          }
        }
      });

      // Gather CV / Philosophies
      const philosophiesRaw = localStorage.getItem('portfolio_philosophies');
      const philosophies = philosophiesRaw ? JSON.parse(philosophiesRaw) : [];

      const cvRaw = localStorage.getItem('portfolio_cv_data');
      const cv = cvRaw ? JSON.parse(cvRaw) : null;

      const payload = {
        projects,
        playgroundGalleries,
        philosophies,
        cv
      };

      const res = await fetch('/api/admin/sync-all-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setSyncResult(data);
      setSyncSuccess(true);
      runAudit();
    } catch (err: any) {
      console.error('Sync failed:', err);
      setErrorMessage(err.message || 'Failed to sync data to codebase.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadBundle = () => {
    window.location.href = '/api/admin/export-bundle';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-brand-border shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-brand-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-sage/15 text-brand-sage">
                <Database className="w-5 h-5" />
              </span>
              <h3 className="font-serif font-bold text-xl text-brand-text">
                Persistence Migration Utility
              </h3>
            </div>
            <p className="text-xs text-brand-muted font-sans">
              Export and permanently persist browser-local Admin edits into source control (<code className="bg-brand-bg px-1 py-0.5 rounded font-mono text-[11px]">public/images/</code> & canonical JSON).
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-brand-muted hover:text-brand-text rounded-full hover:bg-brand-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audit Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Projects</span>
            <span className="block font-serif font-bold text-xl text-brand-text mt-1">{audit.projectCount}</span>
            <span className="text-[10px] text-brand-sage font-medium">Ready</span>
          </div>

          <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Base64 Images</span>
            <span className="block font-serif font-bold text-xl text-brand-sage mt-1">{audit.base64ImagesCount}</span>
            <span className="text-[10px] text-brand-muted">To File</span>
          </div>

          <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Display Visuals</span>
            <span className="block font-serif font-bold text-xl text-brand-text mt-1">{audit.customDisplayCount}</span>
            <span className="text-[10px] text-brand-sage font-medium">Permanent</span>
          </div>

          <div className="bg-[#FAF8F5] border border-brand-border/60 rounded-2xl p-3 text-center">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Storage Keys</span>
            <span className="block font-serif font-bold text-xl text-brand-text mt-1">{audit.keysDetected.length}</span>
            <span className="text-[10px] text-brand-muted">Tracked</span>
          </div>
        </div>

        {/* Sync Success Message */}
        {syncSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Migration Completed Successfully!</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              All images have been saved into <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10.5px]">public/images/</code> with lowercase hyphens, and the canonical snapshot file <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10.5px]">src/data/canonicalAdminData.json</code> is updated.
            </p>
            {syncResult && (
              <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 text-[11px] text-emerald-800 font-mono">
                <div>Images Converted: <strong>{syncResult.imagesRecovered}</strong></div>
                <div>Projects Synced: <strong>{syncResult.projectsCount}</strong></div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Explain Parity Rule */}
        <div className="p-4 bg-brand-sage/5 border border-brand-sage/20 rounded-2xl space-y-2 text-xs text-brand-muted">
          <div className="flex items-center gap-1.5 font-bold text-brand-text">
            <ShieldCheck className="w-4 h-4 text-brand-sage" />
            <span>Safe Migration Guarantee</span>
          </div>
          <p className="leading-relaxed">
            Your browser's <code className="font-mono text-[11px]">localStorage</code> remains completely untouched and active as a safety fallback. Once synced, fresh browser tabs, GitHub commits, and Vercel deployments will all render identically with full parity.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadBundle}
            className="w-full sm:w-auto px-4 py-2.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-text hover:border-brand-sage flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white"
            title="Download export bundle containing all recovered files"
          >
            <Download className="w-3.5 h-3.5 text-brand-sage" />
            Download Backup Archive (.zip)
          </button>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncToCodebase}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Data to Files...</span>
              </>
            ) : syncSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Re-Sync to Codebase</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Sync Admin Edits to Codebase</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
