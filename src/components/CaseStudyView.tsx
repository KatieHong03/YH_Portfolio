/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { compressImageFile } from '../utils/imageCompressor';
import { uploadMediaToCloud } from '../services/storageService';
import { 
  User, 
  Flame, 
  Target, 
  Compass, 
  Layers, 
  BookOpen, 
  Image, 
  BarChart3, 
  Tablet, 
  Volume2, 
  Map, 
  GitMerge, 
  PenTool, 
  HelpCircle, 
  Heart, 
  Columns, 
  Presentation, 
  TrendingDown, 
  Info, 
  Video,
  ExternalLink,
  ChevronRight,
  CheckSquare,
  CheckCircle2,
  Award,
  ArrowUp,
  Edit,
  Sparkles,
  Star,
  Sliders,
  Upload,
  Camera,
  Trash2,
  Image as ImageIcon,
  Check,
  ArrowLeft,
  Clock,
  X,
  X as CloseIcon
} from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  cardImage?: string;
  isFlagship?: boolean;
  projectType: string;
  types: string[];
  overview: string;
  audience: string;
  challenge: string;
  solution: string;
  externalUrl?: string;
  process: {
    needsAnalysis: string;
    learningObjectives: string;
    designDevelopment: string;
    implementation: string;
  };
  deliverables: string[];
  tools: string[];
  impact: string;
  skillsDemonstrated: string[];
  skills: string[];
  timeline: string;
  outcomeMetric?: string;
  metricsList?: {
    value: string;
    label: string;
  }[];
  displayPlaceholders: {
    title: string;
    description: string;
    icon: string;
    externalUrl?: string;
    imageUrl?: string;
  }[];
}

const IconMap: Record<string, React.ComponentType<any>> = {
  Compass,
  Layers,
  Activity: Sparkles,
  CheckSquare,
  Sliders,
  BookOpen,
  Image,
  BarChart3,
  Tablet,
  Volume2,
  Map,
  GitMerge,
  PenTool,
  HelpCircle,
  Heart,
  Flame,
  Columns,
  Presentation,
  TrendingDown,
  Info,
  Video
};

const renderFormattedText = (text: string | undefined): React.ReactNode => {
  if (!text) return null;

  const regex = /\*\*(.*?)\*\*|<b>(.*?)<\/b>|<strong>(.*?)<\/strong>/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }
    
    const boldText = match[1] || match[2] || match[3] || '';
    parts.push(
      <strong key={matchIndex} className="font-extrabold text-brand-text">
        {boldText}
      </strong>
    );
    
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

interface CaseStudyViewProps {
  activeProject: Project;
  isAdminMode: boolean;
  setEditingProject: (project: Project) => void;
  onClose?: () => void;
  onUpdateCoverImage?: (newImage: string) => void;
  onUpdateDisplayImage?: (placeholderIdx: number, newImageUrl: string) => void;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({
  activeProject,
  isAdminMode,
  setEditingProject,
  onClose,
  onUpdateCoverImage,
  onUpdateDisplayImage
}) => {
  const caseStudyRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('summary');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [showCoverUrlModal, setShowCoverUrlModal] = useState(false);
  const [customCoverUrlInput, setCustomCoverUrlInput] = useState('');
  const [editingDisplayUrlIdx, setEditingDisplayUrlIdx] = useState<number | null>(null);
  const [customDisplayUrlInput, setCustomDisplayUrlInput] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (!caseStudyRef.current) return;
      const sections = ['cs-summary', 'cs-process', 'cs-displays', 'cs-outcomes', 'cs-tools'];
      let current = 'summary';
      
      const caseStudyRect = caseStudyRef.current.getBoundingClientRect();
      const caseStudyTop = caseStudyRect.top;
      
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            current = id.replace('cs-', '');
          }
        }
      }
      setActiveSection(current);

      const elementHeight = caseStudyRect.height;
      const viewportHeight = window.innerHeight;
      
      const startOffset = window.scrollY + caseStudyTop - 120;
      const scrollRange = elementHeight - viewportHeight + 120;
      
      if (scrollRange > 0) {
        const currentScroll = window.scrollY - startOffset;
        const pct = Math.min(Math.max(currentScroll / scrollRange, 0), 1);
        setScrollProgress(pct);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeProject.id]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`cs-${id}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const offsetPosition = window.scrollY + rect.top - 125;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={caseStudyRef} className="relative w-full max-w-6xl mx-auto transition-all duration-300">
      <div className="space-y-8 animate-fadeIn">
        {/* Case Study Title & Top Tags */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {activeProject.timeline && (
              <span 
                onClick={() => isAdminMode && setEditingProject(activeProject)}
                className={`text-[11px] font-sans font-medium text-brand-muted bg-transparent border border-brand-border px-3 py-1 rounded-full flex items-center gap-1.5 ${isAdminMode ? 'cursor-pointer hover:border-brand-sage hover:text-brand-sage' : ''}`}
                title={isAdminMode ? 'Click to edit in Admin Mode' : undefined}
              >
                <Clock className="w-3 h-3" />
                {activeProject.timeline}
                {isAdminMode && <Edit className="w-2.5 h-2.5 text-brand-sage ml-0.5" />}
              </span>
            )}
            {activeProject.types && activeProject.types.length > 0 && activeProject.types.map((type) => (
              <span 
                key={type} 
                className="text-[11px] font-sans font-medium text-brand-sage bg-transparent border border-brand-border px-3 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-brand-border/30">
            <div className="space-y-3 flex-1">
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl md:text-[36px] text-brand-text tracking-tight leading-tight">
                {renderFormattedText(activeProject.title)}
              </h2>
              <div className="pt-2">
                <p className="font-serif not-italic text-base sm:text-[19px] text-brand-text/95 leading-relaxed max-w-3xl border-l-3 border-brand-sage pl-5 py-1.5">
                  {renderFormattedText(activeProject.overview)}
                </p>
              </div>

              {/* Dynamic impact strip directly below the intro */}
              {activeProject.metricsList && activeProject.metricsList.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs font-mono font-bold text-brand-sage uppercase tracking-widest">
                  {activeProject.metricsList.map((m, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-brand-muted/40 font-normal">·</span>}
                      <span className="hover:text-brand-text transition-colors">
                        {m.value} {m.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3 shrink-0 self-start">
              {isAdminMode && (
                <button
                  onClick={() => setEditingProject(activeProject)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-brand-sage bg-brand-sage/10 hover:bg-brand-sage/20 border border-brand-sage/30 transition-all cursor-pointer shadow-3xs shrink-0"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Text
                </button>
              )}
              {activeProject.externalUrl && (
                <a
                  href={activeProject.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-brand-sage hover:bg-[#8EA288] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Project Site
                </a>
              )}
            </div>
          </div>

          {/* ==========================================
              COVER PAGE HERO / SHOWCASE (With Admin Edit)
              ========================================== */}
          <div className="relative group/cover">
            {/* Normal Photo Frame */}
            <div 
              className="relative w-full rounded-2xl bg-[#F5F2EC] border border-[#E3DDD1] overflow-hidden shadow-[0_12px_36px_-8px_rgba(75,70,64,0.12)] transition-all duration-300"
            >
              {/* Cover Mockup Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[3/2] w-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center">
                {activeProject.cardImage ? (
                  <img
                    src={activeProject.cardImage}
                    alt={`${activeProject.title} Cover Mockup`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const currentSrc = target.src;
                      if (currentSrc.endsWith('.jpg') && !target.dataset.triedPng) {
                        target.dataset.triedPng = 'true';
                        target.src = currentSrc.slice(0, -4) + '.png';
                        return;
                      }
                      if (currentSrc.endsWith('.png') && !target.dataset.triedJpg) {
                        target.dataset.triedJpg = 'true';
                        target.src = currentSrc.slice(0, -4) + '.jpg';
                        return;
                      }
                      if (currentSrc.includes('fsr-product-knowledge') && !target.dataset.triedPathway) {
                        target.dataset.triedPathway = 'true';
                        target.src = currentSrc.replace('fsr-product-knowledge', 'fsr-learning-pathway');
                        return;
                      }
                      if (currentSrc.includes('-cover.jpg') && !target.dataset.triedCover1) {
                        target.dataset.triedCover1 = 'true';
                        target.src = currentSrc.replace('-cover.jpg', '-cover-1.jpg');
                        return;
                      }
                      if (currentSrc.includes('-cover-1.jpg') && !target.dataset.triedCover) {
                        target.dataset.triedCover = 'true';
                        target.src = currentSrc.replace('-cover-1.jpg', '-cover.jpg');
                        return;
                      }
                    }}
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-sage/10 text-brand-sage flex items-center justify-center mx-auto border border-brand-sage/20">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-brand-text text-sm sm:text-base">No Cover Page Uploaded Yet</p>
                      <p className="font-sans text-xs text-brand-muted mt-1">Upload a hero image or mockup representing this project.</p>
                    </div>
                  </div>
                )}

                {/* Admin Overlay on Cover */}
                {isAdminMode && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 gap-3">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-brand-border/60 max-w-sm w-full text-center space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-brand-sage uppercase tracking-wider">
                        <Camera className="w-4 h-4" /> Admin: Change Cover Page
                      </div>
                      <p className="text-[11px] font-sans text-brand-muted">
                        Upload a screenshot or photo from your computer, or enter an image URL.
                      </p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCoverUrlInput(activeProject.cardImage || '');
                            setShowCoverUrlModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Edit className="w-3.5 h-3.5" /> Set Image Path / URL
                        </button>
                        {activeProject.cardImage && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Remove cover image for this project?')) {
                                onUpdateCoverImage?.('');
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* URL Input Popup for Cover */}
            {showCoverUrlModal && (
              <div className="mt-3 p-4 rounded-2xl bg-white border border-brand-sage/40 shadow-lg animate-fadeIn flex flex-col sm:flex-row gap-2.5 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                    Image File URL or Relative Path (e.g. /images/ra-training-cover.jpg or https://...)
                  </label>
                  <input
                    type="text"
                    value={customCoverUrlInput}
                    onChange={(e) => setCustomCoverUrlInput(e.target.value)}
                    placeholder="https://... or /images/ra-training-cover.jpg"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none bg-[#FAF8F5]"
                  />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateCoverImage) {
                        onUpdateCoverImage(customCoverUrlInput.trim());
                      }
                      setShowCoverUrlModal(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCoverUrlModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-brand-muted text-xs font-bold hover:bg-gray-200 cursor-pointer transition-all"
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* One centered case study container with a comfortable max width */}
        <div className="w-full max-w-4xl mx-auto space-y-12 pt-4">

          {/* Audience, Challenge, and Solution Grid (Fully visible, content-rich with fade-up transition) */}
          <motion.div 
            id="cs-summary" 
            className="space-y-4 scroll-mt-28"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 bg-brand-sage rounded-full" />
              <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Project Summary</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {/* Audience */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-5 flex flex-col justify-between hover:border-brand-sage/30 hover:shadow-xs transition-all duration-300 group/card h-full">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-brand-sage/10 text-brand-sage w-7.5 h-7.5 rounded-full flex items-center justify-center border border-brand-sage/15 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <h5 className="font-sans font-bold text-xs text-brand-text tracking-normal group-hover/card:text-brand-sage transition-colors">
                      Audience
                    </h5>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.audience)}
                  </p>
                </div>
              </div>

              {/* Challenge */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-5 flex flex-col justify-between hover:border-brand-peach/30 hover:shadow-xs transition-all duration-300 group/card h-full">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-brand-peach/10 text-brand-peach w-7.5 h-7.5 rounded-full flex items-center justify-center border border-brand-peach/15 shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <h5 className="font-sans font-bold text-xs text-brand-text tracking-normal group-hover/card:text-brand-peach transition-colors">
                      Challenge
                    </h5>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.challenge)}
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-5 flex flex-col justify-between hover:border-brand-blue/30 hover:shadow-xs transition-all duration-300 group/card h-full">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-brand-blue/10 text-brand-blue w-7.5 h-7.5 rounded-full flex items-center justify-center border border-brand-blue/15 shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <h5 className="font-sans font-bold text-xs text-brand-text tracking-normal group-hover/card:text-brand-blue transition-colors">
                      Solution
                    </h5>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.solution)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project Displays & Visual Artifacts (With fade-up transition, strict 2-column, uniform 3:4 image sizes) */}
          {(() => {
            const visiblePlaceholders = activeProject.displayPlaceholders
              .map((ph, idx) => ({ ...ph, originalIdx: idx }))
              .filter((ph) => {
                return !!ph.title?.trim();
              });

            if (visiblePlaceholders.length === 0) return null;

            return (
              <motion.div 
                id="cs-displays" 
                className="border-t border-brand-border/30 pt-5 space-y-4 scroll-mt-28"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-blue rounded-full" />
                  <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Project Displays & Visual Artifacts</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {visiblePlaceholders.map((ph) => {
                    const PlaceholderIcon = IconMap[ph.icon] || Info;
                    const isLink = !!ph.externalUrl;
                    const imgKey = `${activeProject.id}_${ph.originalIdx}`;
                    const hasImageError = imageErrors[imgKey];
                    const defaultLowerUrl = `/images/${activeProject.id}-display-0${ph.originalIdx + 1}.png`;
                    const currentImgUrl = imageUrls[imgKey] || ph.imageUrl || defaultLowerUrl;
                    const isCustomImageActive = !!imageUrls[imgKey] || !!ph.imageUrl;
                    
                    return (
                      <div
                        key={ph.originalIdx}
                        className="flex flex-col h-full group/displaycard"
                      >
                        <div 
                          className={`flex flex-col justify-between bg-white border border-[#EBE5DA] hover:border-brand-sage rounded-2xl p-5 transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 w-full h-full ${
                            isLink ? 'cursor-pointer' : ''
                          }`}
                        >
                          {/* Stretched Link covering the entire card when project link exists */}
                          {isLink && (
                            <a
                              href={ph.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Launch ${ph.title} project link`}
                              className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
                              onClick={(e) => {
                                if (editingDisplayUrlIdx === ph.originalIdx) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          )}

                          <div className="flex flex-col flex-grow">
                            <div className="flex items-center justify-between mb-3.5">
                              <span className="font-mono text-[8px] uppercase tracking-wider text-brand-muted/85 bg-[#FAF8F4] border border-brand-border/50 px-2.5 py-0.5 rounded-md font-bold">
                                DISPLAY 0{ph.originalIdx + 1}
                              </span>
                              {isLink && (
                                <span
                                  className="text-brand-sage text-[8px] font-mono font-bold flex items-center gap-0.5 bg-brand-sage/5 group-hover/displaycard:bg-brand-sage/15 px-2 py-0.5 rounded-full border border-brand-sage/15 transition-colors"
                                >
                                  LIVE LINK <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>

                            {/* Image Area: Enforced EXACT 4:3 Aspect Ratio */}
                            <div 
                              className="w-full aspect-[4/3] rounded-xl bg-[#FAF8F5]/60 border border-brand-border/60 mb-4 overflow-hidden relative transition-all duration-300 flex flex-col shadow-2xs group/displayimg"
                            >
                              {!hasImageError ? (
                                <img 
                                  src={currentImgUrl} 
                                  alt={ph.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/displayimg:scale-105"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    const currentSrc = target.src;
                                    if (currentSrc.endsWith('.jpg') && !target.dataset.triedPng) {
                                      target.dataset.triedPng = 'true';
                                      target.src = currentSrc.slice(0, -4) + '.png';
                                      return;
                                    }
                                    if (currentSrc.endsWith('.png') && !target.dataset.triedJpg) {
                                      target.dataset.triedJpg = 'true';
                                      target.src = currentSrc.slice(0, -4) + '.jpg';
                                      return;
                                    }
                                    if (currentSrc.includes('fsr-product-knowledge') && !target.dataset.triedPathway) {
                                      target.dataset.triedPathway = 'true';
                                      target.src = currentSrc.replace('fsr-product-knowledge', 'fsr-learning-pathway');
                                      return;
                                    }
                                    setImageErrors(prev => ({ ...prev, [imgKey]: true }));
                                  }}
                                />
                              ) : (
                                <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
                                  {ph.originalIdx === 0 ? (
                                    <div className="absolute inset-0 flex flex-col bg-[#F6F5F2] text-brand-text">
                                      <div className="px-3 py-1.5 bg-white border-b border-[#EBE5DA] flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-1 shrink-0">
                                          <div className="w-1.5 h-1.5 rounded-full bg-brand-peach/60" />
                                          <div className="w-1.5 h-1.5 rounded-full bg-brand-sage/60" />
                                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/60" />
                                        </div>
                                        <div className="bg-[#FAF8F5] border border-brand-border/40 rounded px-2 py-0.5 text-[6.5px] font-mono text-brand-muted truncate max-w-[130px] font-medium scale-95">
                                          {activeProject.id}.edu/portal
                                        </div>
                                        <PlaceholderIcon className="w-3 h-3 text-brand-sage/70" />
                                      </div>
                                      <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-brand-sage/10 to-brand-peach/10 border border-[#E4E9EF] rounded-lg p-2 flex flex-col justify-between shrink-0 shadow-3xs">
                                          <div className="font-mono text-[7px] text-brand-text font-bold truncate max-w-[100px]">
                                            {ph.title}
                                          </div>
                                          <div className="w-16 h-0.5 bg-brand-muted/25 rounded-[1px] mt-1" />
                                        </div>
                                        
                                        <div className="w-full bg-white/70 border border-brand-border/30 rounded-lg p-1.5 flex flex-col gap-1.5 flex-grow">
                                          <div className="w-5 h-1.5 bg-brand-sage/40 rounded-sm" />
                                          <div className="space-y-1">
                                            <div className="w-full h-0.5 bg-brand-muted/20 rounded-[1px]" />
                                            <div className="w-9/12 h-0.5 bg-brand-muted/15 rounded-[1px]" />
                                            <div className="w-10/12 h-0.5 bg-brand-muted/15 rounded-[1px]" />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 shrink-0">
                                          <div className="bg-white/90 border border-brand-border/30 rounded-lg p-1 flex flex-col justify-between h-8">
                                            <div className="w-6 h-0.5 bg-brand-blue/30 rounded-[1px]" />
                                            <div className="w-8 h-1.5 bg-brand-sage/10 rounded-sm" />
                                          </div>
                                          <div className="bg-white/90 border border-brand-border/30 rounded-lg p-1 flex flex-col justify-between h-8">
                                            <div className="w-6 h-0.5 bg-brand-peach/30 rounded-[1px]" />
                                            <div className="w-8 h-1.5 bg-brand-peach/10 rounded-sm" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : ph.originalIdx === 1 ? (
                                    <div className="absolute inset-0 flex flex-col bg-[#FDFBF7] text-brand-text">
                                      <div className="px-3 py-1.5 bg-white border-b border-[#EBE5DA] flex items-center justify-between shrink-0">
                                        <span className="font-mono text-[6.5px] font-bold text-brand-sage uppercase flex items-center gap-1">
                                          <span className="w-1 h-1 rounded-full bg-brand-sage animate-pulse" />
                                          Interactive Sandbox
                                        </span>
                                        <span className="font-mono text-[6.5px] text-brand-muted scale-90">Progress 33%</span>
                                      </div>
                                      <div className="flex-1 p-2.5 flex flex-col justify-between gap-1 overflow-hidden">
                                        <div className="flex gap-1.5 items-start">
                                          <div className="w-4.5 h-4.5 rounded-full bg-brand-peach/15 border border-brand-peach/30 flex items-center justify-center shrink-0">
                                            <PlaceholderIcon className="w-2.5 h-2.5 text-brand-peach" />
                                          </div>
                                          <div className="bg-white border border-brand-border/30 rounded-lg p-1.5 shadow-4xs flex-grow flex flex-col gap-0.5">
                                            <div className="font-mono text-[6.5px] font-bold text-brand-text truncate max-w-[110px]">{ph.title}</div>
                                            <div className="w-24 h-0.5 bg-brand-muted/30 rounded-[1px] mt-0.5" />
                                            <div className="w-14 h-0.5 bg-brand-muted/20 rounded-[1px]" />
                                          </div>
                                        </div>

                                        <div className="bg-white/50 border border-brand-border/25 rounded-md p-1.5 flex-grow flex flex-col justify-center gap-1">
                                          <div className="w-10 h-1 bg-brand-sage/20 rounded-full overflow-hidden">
                                            <div className="w-1/3 h-full bg-brand-sage" />
                                          </div>
                                          <div className="w-12 h-0.5 bg-brand-muted/20 rounded-[1px]" />
                                        </div>

                                        <div className="space-y-1 mt-auto shrink-0">
                                          <div className="bg-white hover:bg-brand-sage/5 border border-brand-sage/20 rounded-md py-1 px-1.5 flex items-center gap-1.5 cursor-pointer shadow-4xs transition-colors">
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-sage/10 border border-brand-sage/30 flex items-center justify-center text-[5.5px] font-mono text-brand-sage font-black">A</div>
                                            <div className="w-24 h-0.5 bg-brand-text/50 rounded-[1px]" />
                                          </div>
                                          <div className="bg-white hover:bg-brand-peach/5 border border-brand-border/30 rounded-md py-1 px-1.5 flex items-center gap-1.5 cursor-pointer shadow-4xs transition-colors">
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-peach/10 border border-brand-peach/30 flex items-center justify-center text-[5.5px] font-mono text-brand-peach font-black">B</div>
                                            <div className="w-20 h-0.5 bg-brand-muted/40 rounded-[1px]" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : ph.originalIdx === 2 ? (
                                    <div className="absolute inset-0 flex flex-col bg-[#1A1816] text-white">
                                      <div className="flex-grow relative flex items-center justify-center bg-gradient-to-tr from-[#1E221D] via-[#2A2421] to-[#1B1D24]">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                                        <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-3xs border border-white/20 flex items-center justify-center group-hover/displayimg:scale-105 group-hover/displayimg:bg-white/15 transition-all duration-300 shadow-lg cursor-pointer">
                                          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-brand-peach border-b-[5px] border-b-transparent ml-0.5" />
                                        </div>
                                        <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-3xs px-2 py-0.5 rounded border border-white/10 text-[6px] font-mono text-white/90 uppercase tracking-widest flex items-center gap-1 font-medium scale-90">
                                          <PlaceholderIcon className="w-2 h-2 text-brand-peach" />
                                          {ph.title}
                                        </div>
                                      </div>
                                      <div className="px-3 py-2 bg-[#2B2724] border-t border-white/5 flex flex-col gap-1.5 shrink-0">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-white/80 rounded-sm shrink-0" />
                                          <div className="flex-grow h-1 bg-white/20 rounded-full overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-[55%] h-full bg-brand-peach rounded-full" />
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[5.5px] font-mono text-white/60">
                                          <span>Curated Video Cover</span>
                                          <span className="scale-90">03:42 / 06:15</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col bg-[#F9F8F6] text-brand-text">
                                      <div className="px-3 py-1.5 bg-white border-b border-[#EBE5DA] flex items-center justify-between shrink-0">
                                        <span className="font-mono text-[6.5px] font-bold text-brand-blue uppercase flex items-center gap-1">
                                          <PlaceholderIcon className="w-2.5 h-2.5 text-brand-blue" />
                                          {ph.title}
                                        </span>
                                        <span className="font-mono text-[6.5px] text-brand-muted scale-90">Verified</span>
                                      </div>
                                      <div className="flex-grow p-2.5 flex flex-col justify-between gap-1 overflow-hidden">
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-1.5 opacity-60">
                                            <div className="w-3 h-3 rounded-md bg-brand-sage/20 border border-brand-sage/40 flex items-center justify-center shrink-0">
                                              <span className="text-[7.5px] font-mono text-brand-sage font-black leading-none mt-0.5">✓</span>
                                            </div>
                                            <div className="w-24 h-0.5 bg-brand-text/30 line-through rounded-[0.5px]" />
                                          </div>
                                          <div className="flex items-center gap-1.5 opacity-60">
                                            <div className="w-3 h-3 rounded-md bg-brand-sage/20 border border-brand-sage/40 flex items-center justify-center shrink-0">
                                              <span className="text-[7.5px] font-mono text-brand-sage font-black leading-none mt-0.5">✓</span>
                                            </div>
                                            <div className="w-20 h-0.5 bg-brand-text/30 line-through rounded-[0.5px]" />
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-md bg-white border border-brand-border flex items-center justify-center shrink-0 shadow-3xs" />
                                            <div className="w-28 h-0.5 bg-brand-text/60 rounded-[0.5px]" />
                                          </div>
                                        </div>
                                        <div className="bg-white border border-brand-border/40 rounded-lg p-1.5 flex items-center justify-between shrink-0 mt-auto shadow-3xs">
                                          <div className="w-16 h-0.5 bg-brand-muted/30 rounded-[0.5px]" />
                                          <div className="w-5 h-2 bg-brand-blue/15 rounded-sm" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Admin Action Overlay on Display Image */}
                              {isAdminMode && (
                                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/displayimg:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 gap-2 z-30 pointer-events-auto">
                                  <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-brand-border/60 max-w-[220px] w-full text-center space-y-2">
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-brand-sage uppercase">
                                      <Camera className="w-3 h-3" /> Display 0{ph.originalIdx + 1} Image
                                    </div>
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCustomDisplayUrlInput(ph.imageUrl || imageUrls[imgKey] || '');
                                          setEditingDisplayUrlIdx(ph.originalIdx);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-brand-sage text-white text-[10px] font-bold hover:bg-brand-sage/90 transition-all flex items-center gap-1 cursor-pointer shadow-3xs"
                                      >
                                        <Edit className="w-3 h-3" /> Set Image Path
                                      </button>
                                      {isCustomImageActive && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Remove image for Display 0${ph.originalIdx + 1}?`)) {
                                              if (onUpdateDisplayImage) {
                                                onUpdateDisplayImage(ph.originalIdx, '');
                                              }
                                              setImageUrls(prev => {
                                                const next = { ...prev };
                                                delete next[imgKey];
                                                return next;
                                              });
                                              setImageErrors(prev => ({ ...prev, [imgKey]: true }));
                                            }
                                          }}
                                          className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold hover:bg-red-100 border border-red-200 transition-all flex items-center gap-0.5 cursor-pointer"
                                          title="Remove Image"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-[8px] font-mono text-brand-muted/70">Or drag & drop image here</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* URL Input Popup for Display Placeholder */}
                            {editingDisplayUrlIdx === ph.originalIdx && (
                              <div className="relative z-30 mb-4 p-3 rounded-xl bg-white border border-brand-sage/40 shadow-lg animate-fadeIn flex flex-col gap-2 pointer-events-auto">
                                <div>
                                  <label className="block text-[9px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                                    Display 0{ph.originalIdx + 1} Image URL or File Path
                                  </label>
                                  <input
                                    type="text"
                                    value={customDisplayUrlInput}
                                    onChange={(e) => setCustomDisplayUrlInput(e.target.value)}
                                    placeholder="https://... or /images/ra-training-display-01.png"
                                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-brand-border focus:border-brand-sage focus:outline-none bg-[#FAF8F5]"
                                  />
                                </div>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const trimmed = customDisplayUrlInput.trim();
                                      if (onUpdateDisplayImage) {
                                        onUpdateDisplayImage(ph.originalIdx, trimmed);
                                      }
                                      setImageErrors(prev => ({ ...prev, [imgKey]: false }));
                                      setImageUrls(prev => ({ ...prev, [imgKey]: trimmed }));
                                      setEditingDisplayUrlIdx(null);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-brand-sage text-white text-[10px] font-bold hover:bg-brand-sage/90 cursor-pointer transition-all flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" /> Apply
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingDisplayUrlIdx(null)}
                                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-brand-muted text-[10px] font-bold hover:bg-gray-200 cursor-pointer transition-all"
                                  >
                                    <CloseIcon className="w-3 h-3" /> Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Title & supporting text: supporting text strictly restricted to one line to keep card alignments balanced */}
                            <div className="space-y-1.5 mt-1.5">
                              <h5 className="font-serif font-extrabold text-base text-brand-text group-hover/displaycard:text-brand-sage transition-colors leading-snug truncate">
                                {renderFormattedText(ph.title)}
                              </h5>
                              <p className="font-sans text-xs text-brand-muted leading-relaxed line-clamp-1">
                                {renderFormattedText(ph.description)}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-[#EBE5DA]/30 pt-3.5 mt-4 flex items-center justify-between shrink-0">
                            {isLink ? (
                              <span
                                className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-brand-sage group-hover/displaycard:text-brand-text group-hover/displaycard:underline transition-colors flex items-center gap-1"
                              >
                                Launch Project Link <ExternalLink className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-brand-sage group-hover/displaycard:text-brand-text transition-colors">
                                View Image Artifact
                              </span>
                            )}
                            <div className="w-6 h-6 rounded-full bg-brand-sage/5 flex items-center justify-center text-brand-sage group-hover/displaycard:bg-brand-sage group-hover/displaycard:text-white transition-all duration-300">
                              <ChevronRight className="w-3.5 h-3.5 group-hover/displaycard:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}

          {/* Analytical Process Timeline (With fade-up transition) */}
          <motion.div 
            id="cs-process" 
            className="pt-5 space-y-4 border-t border-brand-border/30 scroll-mt-28"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 bg-brand-sage rounded-full" />
              <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Instructional Process</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stage 01: Research */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-4 hover:border-brand-sage/40 transition-all duration-300 hover:shadow-xs flex flex-col justify-between group/step">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-sage transition-colors">
                      Needs Analysis
                    </h5>
                    <div className="w-6.5 h-6.5 rounded-full bg-transparent text-brand-muted border border-brand-border flex items-center justify-center font-serif text-xs font-bold group-hover/step:bg-brand-sage group-hover/step:text-white group-hover/step:border-brand-sage transition-all duration-300 shadow-4xs shrink-0">
                      1
                    </div>
                  </div>
                  <p className="font-sans text-xs text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.process.needsAnalysis)}
                  </p>
                </div>
              </div>

              {/* Stage 02: Design */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-4 hover:border-brand-peach/40 transition-all duration-300 hover:shadow-xs flex flex-col justify-between group/step">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-peach transition-colors">
                      Learning Design
                    </h5>
                    <div className="w-6.5 h-6.5 rounded-full bg-transparent text-brand-muted border border-brand-border flex items-center justify-center font-serif text-xs font-bold group-hover/step:bg-brand-peach group-hover/step:text-white group-hover/step:border-brand-peach transition-all duration-300 shadow-4xs shrink-0">
                      2
                    </div>
                  </div>
                  <p className="font-sans text-xs text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.process.learningObjectives)}
                  </p>
                </div>
              </div>

              {/* Stage 03: Development / Implementation */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-4 hover:border-brand-blue/40 transition-all duration-300 hover:shadow-xs flex flex-col justify-between group/step">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-blue transition-colors">
                      {activeProject.projectType === 'Curriculum Design' || activeProject.projectType === 'L&D' ? 'Implementation' : 'Development'}
                    </h5>
                    <div className="w-6.5 h-6.5 rounded-full bg-transparent text-brand-muted border border-brand-border flex items-center justify-center font-serif text-xs font-bold group-hover/step:bg-brand-blue group-hover/step:text-white group-hover/step:border-brand-blue transition-all duration-300 shadow-4xs shrink-0">
                      3
                    </div>
                  </div>
                  <p className="font-sans text-xs text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.process.designDevelopment)}
                  </p>
                </div>
              </div>

              {/* Stage 04: Reiteration */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-4 hover:border-brand-muted transition-all duration-300 hover:shadow-xs flex flex-col justify-between group/step">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-muted transition-colors">
                      Reiteration
                    </h5>
                    <div className="w-6.5 h-6.5 rounded-full bg-transparent text-brand-muted border border-brand-border flex items-center justify-center font-serif text-xs font-bold group-hover/step:bg-brand-muted group-hover/step:text-white group-hover/step:border-brand-muted transition-all duration-300 shadow-4xs shrink-0">
                      4
                    </div>
                  </div>
                  <p className="font-sans text-xs text-brand-muted leading-relaxed">
                    {renderFormattedText(activeProject.process.implementation)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Deliverables & Outcomes section - Combined clean 2-column layout with fade-up transition */}
          {(() => {
            const validMetrics = activeProject.metricsList ? activeProject.metricsList.filter(m => m.value && m.value.trim() !== '') : [];
            const hasImpact = validMetrics.length > 0 || !!(activeProject.outcomeMetric && activeProject.outcomeMetric.trim() !== '');

            return (
              <motion.div 
                id="cs-outcomes" 
                className="border-t border-brand-border/30 pt-5 space-y-4 scroll-mt-28"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-peach rounded-full" />
                  <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Outcomes & Deliverables</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Deliverables Card */}
                  <div className="bg-white border border-[#EBE5DA] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-sage/10 text-brand-sage">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                        <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Key Deliverables</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeProject.deliverables.map((del, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 bg-[#FAF8F5]/70 p-3 rounded-xl border border-brand-border/40">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage shrink-0 mt-0.5" />
                            <span className="font-sans text-xs sm:text-sm text-brand-text font-medium leading-tight">{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Impact Card */}
                  {hasImpact && (
                    <div className="bg-white border border-[#EBE5DA] rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[160px] h-full">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-sage/5 blur-xl pointer-events-none" />
                      
                      <div className="space-y-4 relative z-10 w-full flex-1 flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-brand-sage/15 text-brand-sage">
                            <Award className="w-4 h-4" />
                          </div>
                          <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Impact & Evaluation</h4>
                        </div>

                        <div className={`grid gap-2.5 pt-1 flex-1 items-stretch ${
                          validMetrics.length === 1 ? 'grid-cols-1' :
                          validMetrics.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                          'grid-cols-1 sm:grid-cols-3'
                        }`}>
                          {validMetrics.map((m, mIdx) => (
                            <div key={mIdx} className="bg-[#FAF8F5]/70 border border-brand-border/40 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-3xs h-full">
                              <span className="font-serif font-extrabold text-xl sm:text-2xl text-brand-sage leading-none">
                                {m.value}
                              </span>
                              <span className="font-sans text-[10px] sm:text-[10.5px] text-brand-muted font-medium mt-1.5 leading-tight">
                                {m.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {activeProject.impact && activeProject.impact.trim() !== '' && (
                          <p className="font-sans text-xs sm:text-[13px] text-brand-muted leading-relaxed pt-3 border-t border-brand-border/40">
                            {renderFormattedText(activeProject.impact)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()}

          {/* Side-by-side Tools Used & Skills Demonstrated with fade-up transition */}
          <motion.div 
            id="cs-tools" 
            className="border-t border-brand-border/30 pt-5 space-y-4 scroll-mt-28"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tools Card */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-300 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-blue rounded-full" />
                  <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Tools Used</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.tools.map((tool, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="font-sans text-[11px] sm:text-xs font-semibold bg-transparent text-brand-text border border-brand-border px-2.5 py-1 rounded-lg hover:border-brand-blue/30 transition-all duration-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Demonstrated Card */}
              <div className="bg-transparent border border-[#EBE5DA] rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-300 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-lavender rounded-full" />
                  <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Skills Demonstrated</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(activeProject.skillsDemonstrated || activeProject.skills).map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="font-mono text-[9px] sm:text-[9.5px] font-bold bg-transparent text-brand-muted border border-brand-border px-2.5 py-1.5 rounded-md uppercase tracking-wider hover:border-brand-lavender/30 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div> {/* Close One centered case study container */}
      </div> {/* Close space-y-8 animate-fadeIn */}
    </section>
  );
};
