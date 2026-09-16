/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudUpload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Key
} from 'lucide-react';
import { 
  scanBrowserImagesAgainstCloud, 
  executeImageMigrationToCloud, 
  isPreviewCloudImagesOnly, 
  setPreviewCloudImagesOnly,
  DetectedImageItem,
  ImageScanAudit,
  ImageMigrationReport,
  EVENT_PREVIEW_CLOUD_IMAGES_TOGGLED
} from '../services/imageMigrationService';
import { isSupabaseConfigured, getSupabaseCredentials } from '../lib/supabase';

interface ImageMigrationPanelProps {
  onSwitchToConfigTab?: () => void;
}

export const ImageMigrationPanel: React.FC<ImageMigrationPanelProps> = ({ onSwitchToConfigTab }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanAudit, setScanAudit] = useState<ImageScanAudit | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    percent: number;
    currentItem?: DetectedImageItem;
  }>({ current: 0, total: 0, percent: 0 });
  const [migrationReport, setMigrationReport] = useState<ImageMigrationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewCloudOnly, setPreviewCloudOnly] = useState<boolean>(() => isPreviewCloudImagesOnly());
  const [filterMode, setFilterMode] = useState<'diff' | 'all' | 'base64'>('diff');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const [configured, setConfigured] = useState<boolean>(() => isSupabaseConfigured());
  const creds = getSupabaseCredentials();
  const [inputUrl, setInputUrl] = useState<string>(creds.url);
  const [inputKey, setInputKey] = useState<string>(creds.anonKey);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [showInlineConfig, setShowInlineConfig] = useState<boolean>(!isSupabaseConfigured());

  const handleSaveInlineCredentials = () => {
    if (!inputUrl.trim() || !inputKey.trim()) {
      setErrorMessage('Please provide both Supabase Project URL and Anon Key.');
      return;
    }
    localStorage.setItem('portfolio_supabase_url_override', inputUrl.trim());
    localStorage.setItem('portfolio_supabase_key_override', inputKey.trim());
    const isNowConfigured = isSupabaseConfigured();
    setConfigured(isNowConfigured);
    if (isNowConfigured) {
      setSaveSuccessNotice(true);
      setErrorMessage(null);
      setShowInlineConfig(false);
      handleRunScan();
      setTimeout(() => setSaveSuccessNotice(false), 4000);
    } else {
      setErrorMessage('The Supabase URL must start with https:// and the Anon Key must be valid.');
    }
  };

  // Run audit scan on mount
  const handleRunScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    try {
      const result = await scanBrowserImagesAgainstCloud();
      setScanAudit(result);
    } catch (err: any) {
      console.error('Scan failed:', err);
      setErrorMessage(err.message || 'Failed to scan browser images');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    handleRunScan();
  }, []);

  // Listen for external toggle changes
  useEffect(() => {
    const handleToggleEvent = () => {
      setPreviewCloudOnly(isPreviewCloudImagesOnly());
    };
    window.addEventListener(EVENT_PREVIEW_CLOUD_IMAGES_TOGGLED, handleToggleEvent);
    return () => {
      window.removeEventListener(EVENT_PREVIEW_CLOUD_IMAGES_TOGGLED, handleToggleEvent);
    };
  }, []);

  const handleTogglePreviewCloudOnly = () => {
    const nextVal = !previewCloudOnly;
    setPreviewCloudImagesOnly(nextVal);
    setPreviewCloudOnly(nextVal);
  };

  const handleCopyUrl = (id: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2500);
  };

  const toggleExpand = (id: string) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartMigration = async (forceAll: boolean = false) => {
    if (!scanAudit) return;
    setIsMigrating(true);
    setErrorMessage(null);
    setMigrationReport(null);
    setProgress({ current: 0, total: 0, percent: 0 });

    try {
      const itemsToMigrate = forceAll 
        ? scanAudit.items 
        : scanAudit.items.filter(it => it.isDiff || it.isBase64);

      if (itemsToMigrate.length === 0) {
        setErrorMessage('No differing or Base64 images need migration. All browser images already match Supabase.');
        setIsMigrating(false);
        return;
      }

      const report = await executeImageMigrationToCloud(itemsToMigrate, (current, total, currentItem) => {
        const percent = Math.round((current / total) * 100);
        setProgress({ current, total, percent, currentItem });
      });

      setMigrationReport(report);
      // Re-scan so counts update immediately
      await handleRunScan();
    } catch (err: any) {
      console.error('Migration failed:', err);
      setErrorMessage(err.message || 'Image migration encountered an error.');
    } finally {
      setIsMigrating(false);
    }
  };

  // Filter items
  const displayItems = React.useMemo(() => {
    if (!scanAudit) return [];
    if (filterMode === 'diff') {
      return scanAudit.items.filter(it => it.isDiff);
    }
    if (filterMode === 'base64') {
      return scanAudit.items.filter(it => it.isBase64);
    }
    return scanAudit.items;
  }, [scanAudit, filterMode]);

  return (
    <div className="space-y-6">
      {/* 1. Supabase Credentials Warning / Quick Connection Card */}
      {!configured ? (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-3 text-amber-950 shadow-xs animate-fadeIn" id="supabase-connection-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-900 block text-sm">
                  Supabase Connection Required
                </span>
                <p className="leading-relaxed text-amber-800/90">
                  To upload your 33 images to permanent cloud storage, the portfolio needs to know which Supabase project to send them to. Enter your project credentials below:
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInlineConfig(!showInlineConfig)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
            >
              <Key className="w-3.5 h-3.5" /> {showInlineConfig ? 'Hide Form' : 'Enter Credentials'}
            </button>
          </div>

          {showInlineConfig && (
            <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[9.5px] uppercase tracking-wider text-amber-900 font-bold block">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://yourproject.supabase.co"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono text-brand-text placeholder-amber-900/40 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9.5px] uppercase tracking-wider text-amber-900 font-bold block">
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono text-brand-text placeholder-amber-900/40 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-amber-800/80 font-sans">
                  💡 Find these in your <strong>Supabase Dashboard &gt; Project Settings &gt; API</strong>.
                </div>

                <div className="flex items-center gap-2">
                  {onSwitchToConfigTab && (
                    <button
                      type="button"
                      onClick={onSwitchToConfigTab}
                      className="px-3 py-1.5 text-xs text-amber-900 hover:text-amber-950 font-medium underline cursor-pointer"
                    >
                      Open Full Connection Tab
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveInlineCredentials}
                    className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Save &amp; Connect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Connected to Supabase Cloud Storage (<strong>portfolio-media</strong> bucket)
            </span>
          </div>
          <button
            onClick={() => {
              if (onSwitchToConfigTab) {
                onSwitchToConfigTab();
              } else {
                setShowInlineConfig(true);
              }
            }}
            className="text-[11px] text-emerald-800 font-medium hover:underline cursor-pointer flex items-center gap-1"
          >
            <Key className="w-3 h-3" /> Edit Credentials
          </button>
        </div>
      )}

      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Connected successfully! You can now click &ldquo;Migrate Current Images to Cloud&rdquo; below.</span>
        </div>
      )}

      {/* 2. Strict Safety Guarantee Banner */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            Strict Zero-Text Impact Guarantee
            <span className="bg-emerald-200/70 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold">
              IMAGE-ONLY
            </span>
          </span>
          <p className="leading-relaxed opacity-90 font-sans">
            This tool migrates <strong>only image URLs and media binaries</strong>. All titles, project descriptions, case study copy, challenge/solution texts, skill tags, metrics, and layouts will remain <strong>completely untouched</strong>. Local browser storage is preserved as a backup.
          </p>
        </div>
      </div>

      {/* 3. Preview Cloud Images Only Toggle Card */}
      <div className="p-4 bg-[#FAF8F5] border border-brand-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-brand-text">
              Preview Cloud Images Only
            </span>
            {previewCloudOnly ? (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3" /> ACTIVE (Vercel View)
              </span>
            ) : (
              <span className="bg-brand-border/60 text-brand-muted text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> INACTIVE (Local View)
              </span>
            )}
          </div>
          <p className="text-[11px] text-brand-muted font-sans leading-relaxed max-w-xl">
            {previewCloudOnly 
              ? 'Local browser overrides are currently ignored. You are viewing the live public Vercel experience.' 
              : 'Temporarily ignore local browser overrides to test what public visitors on Vercel see.'}
          </p>
        </div>

        <button
          onClick={handleTogglePreviewCloudOnly}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-3xs ${
            previewCloudOnly
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-white hover:bg-brand-bg text-brand-text border border-brand-border'
          }`}
          title="Toggle Cloud Images Preview"
        >
          {previewCloudOnly ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Disable Cloud Preview</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-brand-muted" />
              <span>Enable Cloud Preview</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Audit Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FAF8F5] border border-brand-border/70 p-3.5 rounded-2xl space-y-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
            Total Detected
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-brand-text">
              {scanAudit ? scanAudit.totalDetected : '—'}
            </span>
            <span className="text-[10px] text-brand-muted font-sans">local images</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] border border-amber-200/80 p-3.5 rounded-2xl space-y-1 bg-amber-50/30">
          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-700 font-bold block">
            Differ from Cloud
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-amber-800">
              {scanAudit ? scanAudit.differCount : '—'}
            </span>
            <span className="text-[10px] text-amber-700/80 font-sans">needs migration</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] border border-emerald-200/80 p-3.5 rounded-2xl space-y-1 bg-emerald-50/30">
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700 font-bold block">
            Synced with Cloud
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-emerald-800">
              {scanAudit ? scanAudit.matchingCount : '—'}
            </span>
            <span className="text-[10px] text-emerald-700/80 font-sans">permanent</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] border border-purple-200/80 p-3.5 rounded-2xl space-y-1 bg-purple-50/30">
          <span className="font-mono text-[9px] uppercase tracking-wider text-purple-700 font-bold block">
            Base64 Images
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-purple-800">
              {scanAudit ? scanAudit.base64Count : '—'}
            </span>
            <span className="text-[10px] text-purple-700/80 font-sans">local data URIs</span>
          </div>
        </div>
      </div>

      {/* 5. Error Message Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* 6. In-Progress Migration Progress Card */}
      {isMigrating && (
        <div className="p-4 bg-brand-sage/10 border border-brand-sage/30 rounded-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-sage flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-sage" />
              Migrating Images to Supabase Storage...
            </span>
            <span className="font-mono font-bold text-brand-sage">
              {progress.percent}% ({progress.current}/{progress.total})
            </span>
          </div>

          <div className="w-full h-2.5 bg-brand-border/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-sage rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          {progress.currentItem && (
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-brand-border/60 text-xs text-brand-text">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-brand-border overflow-hidden shrink-0 flex items-center justify-center">
                {progress.currentItem.category === 'cv_resume' ? (
                  <FileText className="w-5 h-5 text-brand-muted" />
                ) : (
                  <img 
                    src={progress.currentItem.localValue} 
                    alt="Current upload preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold block truncate">
                  {progress.currentItem.ownerTitle}
                </span>
                <span className="text-[10px] text-brand-muted font-mono block">
                  Uploading to Supabase Storage &amp; updating {progress.currentItem.table}.{progress.currentItem.field}...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Post-Migration Verification Report */}
      {migrationReport && (
        <div className="p-5 bg-emerald-50/90 border border-emerald-300/80 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-3xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-emerald-950">
                  Image Migration Complete &amp; Verified!
                </h4>
                <p className="text-xs text-emerald-800 font-sans mt-0.5">
                  Uploaded {migrationReport.uploadedCount} images to Supabase Storage and updated {migrationReport.recordsUpdated} database records.
                </p>
              </div>
            </div>

            <button
              onClick={handleTogglePreviewCloudOnly}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewCloudOnly ? 'Cloud View Enabled' : 'Verify Cloud View'}</span>
            </button>
          </div>

          {/* Verification Table / List */}
          <div className="space-y-2 max-h-60 overflow-y-auto bg-white/80 p-3 rounded-xl border border-emerald-200">
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 font-bold block">
              Verified Supabase Permanent URLs:
            </span>
            {migrationReport.items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between gap-3 p-2 bg-white rounded-lg border border-emerald-100 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded bg-emerald-50 border border-emerald-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.category === 'cv_resume' ? (
                      <FileText className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <img 
                        src={item.permanentUrl || item.localValue} 
                        alt={item.ownerTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-brand-text truncate block text-[11px]">
                      {item.ownerTitle}
                    </span>
                    <span className="font-mono text-[9.5px] text-brand-muted truncate block">
                      {item.permanentUrl || 'Synced'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                  {item.permanentUrl && (
                    <>
                      <button
                        onClick={() => handleCopyUrl(item.id, item.permanentUrl!)}
                        className="p-1 hover:bg-emerald-50 text-emerald-700 rounded transition-colors cursor-pointer"
                        title="Copy permanent Supabase URL"
                      >
                        {copiedMap[item.id] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={item.permanentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:bg-emerald-50 text-emerald-700 rounded transition-colors cursor-pointer"
                        title="Open permanent image in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-emerald-800/80 font-sans flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Local browser storage has NOT been deleted. Your browser data remains preserved.</span>
          </div>
        </div>
      )}

      {/* 8. Action Bar: Migrate Button & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-brand-bg p-1 rounded-xl border border-brand-border">
          <button
            onClick={() => setFilterMode('diff')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterMode === 'diff' 
                ? 'bg-white text-brand-text shadow-3xs font-semibold' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Differing Only ({scanAudit ? scanAudit.differCount : 0})
          </button>
          <button
            onClick={() => setFilterMode('base64')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterMode === 'base64' 
                ? 'bg-white text-brand-text shadow-3xs font-semibold' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Base64 ({scanAudit ? scanAudit.base64Count : 0})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterMode === 'all' 
                ? 'bg-white text-brand-text shadow-3xs font-semibold' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            All ({scanAudit ? scanAudit.totalDetected : 0})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunScan}
            disabled={isScanning || isMigrating}
            className="px-3.5 py-2.5 bg-white hover:bg-brand-bg text-brand-text rounded-xl border border-brand-border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Re-scan current browser and Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-muted ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-scan</span>
          </button>

          <button
            onClick={() => {
              if (!configured) {
                setShowInlineConfig(true);
                const el = document.getElementById('supabase-connection-card');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setErrorMessage('Please enter and save your Supabase Project URL and Anon Key above before migrating images.');
                return;
              }
              handleStartMigration(false);
            }}
            disabled={isMigrating || (configured && scanAudit && scanAudit.differCount === 0)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              !configured
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-brand-sage hover:bg-brand-sage/90 disabled:opacity-50 text-white disabled:cursor-not-allowed'
            }`}
            id="btn-migrate-current-images-to-cloud"
            title={!configured ? 'Enter Supabase credentials to enable image migration' : 'Upload local images to Supabase'}
          >
            {!configured ? <Key className="w-4 h-4" /> : <CloudUpload className="w-4 h-4" />}
            <span>
              {isMigrating 
                ? 'Migrating Images...' 
                : !configured 
                  ? `Connect Supabase to Migrate (${scanAudit ? scanAudit.differCount : 0})` 
                  : `Migrate Current Images to Cloud (${scanAudit ? scanAudit.differCount : 0})`}
            </span>
          </button>
        </div>
      </div>

      {/* 9. Itemized Pre-Migration Comparison List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold">
            Detected Browser Images ({displayItems.length} listed)
          </span>
          <span className="text-[10px] text-brand-muted">
            The visible local image in this browser is authoritative.
          </span>
        </div>

        {displayItems.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] border border-dashed border-brand-border rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <span className="font-serif font-bold text-sm text-brand-text block">
              {filterMode === 'diff' 
                ? 'All browser images already match Supabase!' 
                : 'No images detected matching the filter.'}
            </span>
            <p className="text-xs text-brand-muted max-w-sm mx-auto font-sans leading-relaxed">
              Your public Vercel version is in sync with your local browser images.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {displayItems.map((item) => {
              const isExpanded = !!expandedDetails[item.id];
              return (
                <div 
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    item.isDiff 
                      ? 'bg-white border-amber-300/80 shadow-3xs' 
                      : 'bg-white/70 border-brand-border/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Thumbnail Preview */}
                      <div className="w-12 h-10 rounded-xl bg-[#FAF8F5] border border-brand-border overflow-hidden shrink-0 relative flex items-center justify-center">
                        {item.category === 'cv_resume' ? (
                          <FileText className="w-5 h-5 text-brand-muted" />
                        ) : (
                          <img 
                            src={item.localValue} 
                            alt={item.ownerTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        )}
                        {item.isBase64 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-purple-600 text-white text-[7px] font-mono font-bold px-1 rounded-xs">
                            B64
                          </span>
                        )}
                      </div>

                      {/* Info & Target */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-brand-text truncate block">
                            {item.ownerTitle}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-brand-muted block truncate">
                          Target: {item.table}.{item.field} (ID: {item.recordId})
                        </span>
                      </div>
                    </div>

                    {/* Status Badges & Expand Trigger */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.isDiff ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                          Authoritative Local (Differs)
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Synced
                        </span>
                      )}

                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-xs text-brand-muted hover:text-brand-text p-1 rounded hover:bg-brand-bg transition-colors cursor-pointer"
                        title="View raw value details"
                      >
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details View */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-brand-border/60 text-xs space-y-2 font-mono text-[10px] text-brand-muted bg-[#FAF8F5] p-2.5 rounded-xl">
                      <div>
                        <span className="font-bold text-brand-text block">Authoritative Local Browser Value:</span>
                        <p className="truncate text-brand-sage font-medium mt-0.5">
                          {item.localValue.startsWith('data:') 
                            ? `${item.localValue.slice(0, 70)}... (Base64 data URI)` 
                            : item.localValue}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-brand-text block">Current Supabase Cloud Value:</span>
                        <p className="truncate text-brand-muted mt-0.5">
                          {item.cloudValue || '<none / empty>'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
