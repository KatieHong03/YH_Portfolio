/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Play,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  PenTool,
  X,
  Layers,
  ArrowLeft,
  BookOpen,
  Upload,
  Trash2,
  Plus,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Camera,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  Edit3,
  Save,
  Tag
} from 'lucide-react';
import { Project, getLiveProjects, getLiveProjectById, updateProjectCoverImage, updateProjectDisplayImage, normalizeImageUrl, EVENT_PROJECTS_UPDATED } from '../utils/projectsData';
import { CaseStudyView } from './CaseStudyView';
import { uploadMediaToCloud } from '../services/storageService';
import { savePlaygroundProject, getCachedPlaygroundData } from '../services/portfolioService';
import { subscribeToAuth } from '../services/authService';
import { TarotDemo } from './demos/TarotDemo';
import { ScenarioBuilderDemo } from './demos/ScenarioBuilderDemo';
import { AnalyticsDemo } from './demos/AnalyticsDemo';
import { WellnessDemo } from './demos/WellnessDemo';
import { RASimDemo, ReadingScaffoldsDemo } from './demos/RASimDemo';

export interface ShowcaseImage {
  id: string;
  url: string;
  title: string;
  caption?: string;
}

export interface SandboxProject {
  id: string;
  title: string;
  projectType: string;
  badge: string;
  tagline: string;
  emoji: string;
  overview: string;
  headerPhase: string;
  caseStudyId: string;
  skills: string[];
  color: {
    bg: string;
    border: string;
    accent: string;
    text: string;
    glow: string;
  };
  bgPhoto: string;
  logoPhoto?: string;
  logoScale?: string;
  demoUrl?: string;
  defaultGallery: ShowcaseImage[];
  details: {
    background: {
      title: string;
      desc: string;
      content: string;
    };
    features: {
      title: string;
      desc: string;
      content: string;
    };
    deliverables: {
      title: string;
      desc: string;
      content: string;
    };
  };
}

export const PLAYGROUND_PROJECTS: SandboxProject[] = [
  {
    id: 'teajourney',
    title: 'Tea Journey',
    projectType: 'Interactive Culture & Brewing',
    badge: 'Mindful Sensory Discovery',
    tagline: 'Ancient Rituals, Modern Practice',
    headerPhase: 'IMMERSE IN CULTURE',
    emoji: '🍵',
    overview: 'An interactive cultural learning experience that combines guided brewing simulations, storytelling, and cultural history to make Chinese tea traditions accessible, engaging, and memorable.',
    caseStudyId: 'ra-training',
    skills: ['Instructional Design', 'eLearning', 'Graphic Design', 'Gamification', 'Prototyping'],
    color: {
      bg: 'bg-brand-peach/10',
      border: 'border-brand-peach/30',
      accent: '#DF9B9B', // Morandi Pink
      text: 'text-brand-peach',
      glow: 'rgba(223, 155, 155, 0.15)'
    },
    bgPhoto: '/images/teajourney.jpg',
    logoPhoto: '/images/logo-teajourney.png',
    logoScale: 'scale-[1.38]',
    demoUrl: 'https://your-tea-journey.vercel.app/',
    defaultGallery: [
      {
        id: 'tj-2',
        url: '/images/walkthrough-teajourney.jpg',
        title: 'Overview',
        caption: ''
      },
      {
        id: 'custom-1787455048410',
        url: '/images/teajourney-gallery-02.jpg',
        title: 'Home',
        caption: ''
      },
      {
        id: 'custom-1787455066258',
        url: '/images/teajourney-gallery-03.jpg',
        title: 'Tasseography',
        caption: ''
      },
      {
        id: 'custom-1787455162859',
        url: '/images/teajourney-gallery-04.jpg',
        title: 'Tea Making',
        caption: ''
      },
      {
        id: 'custom-1787455176602',
        url: '/images/teajourney-gallery-05.jpg',
        title: 'History',
        caption: ''
      }
    ],
    details: {
      background: {
        title: 'Background & Learning Friction',
        desc: 'The educational friction or gap explored.',
        content: 'Tea culture is traditionally learned through hands-on practice and in-person mentorship, making it difficult for beginners and global learners to experience and appreciate Chinese tea culture authentically.'
      },
      features: {
        title: 'Core Interactive Features',
        desc: 'The learning scenario design concept.',
        content: '• History & Terroir: Historical roots and regional evolution of tea leaves\n• Tea Making Simulation: Practice brewing techniques with water temperature, steeping timers, and pouring angles\n• Tassography: Explore the playful art of tea leaf reading\n• Tea Foam Art: Express creativity by etching delicate patterns on virtual tea foam'
      },
      deliverables: {
        title: 'Deliverables & Artifacts',
        desc: 'High-fidelity wireframes and instruction resources.',
        content: 'Interactive Brewing Engine, Gamified Steeping Timer, Historical Infographics'
      }
    }
  },
  {
    id: 'lumipal',
    title: 'Lumipal',
    projectType: 'AR Learning Companion',
    badge: 'Adaptive Guided Mentorship',
    tagline: '',
    headerPhase: 'GET READY TO LAUNCH',
    emoji: '💡',
    overview: 'An AR learning companion that combines contextual prompts, guided spatial exploration, and interactive challenges to transform real-world environments into purposeful learning journeys.',
    caseStudyId: 'ra-training',
    skills: ['AI Learning', 'Design Thinking', 'Instructional Design', 'Graphic Design', 'Prototyping'],
    color: {
      bg: 'bg-brand-peach/10',
      border: 'border-brand-peach/30',
      accent: '#ECCB7A', // Morandi Yellow
      text: 'text-brand-peach',
      glow: 'rgba(236, 203, 122, 0.15)'
    },
    bgPhoto: '/images/lumipal.jpg',
    logoPhoto: '/images/logo-lumipal.png',
    logoScale: 'scale-[1.38]',
    demoUrl: 'https://lumi-pal.vercel.app/',
    defaultGallery: [
      {
        id: 'lumi-2',
        url: '/images/walkthrough-lumipal.jpg',
        title: 'Overview',
        caption: ''
      },
      {
        id: 'custom-1787455363139',
        url: '/images/lumipal-gallery-02.jpg',
        title: 'Landing Page',
        caption: ''
      },
      {
        id: 'custom-1787455387254',
        url: '/images/lumipal-gallery-03.jpg',
        title: 'Home',
        caption: ''
      },
      {
        id: 'custom-1787455394920',
        url: '/images/lumipal-gallery-04.jpg',
        title: 'Shop',
        caption: ''
      },
      {
        id: 'custom-1787455415602',
        url: '/images/lumipal-gallery-05.jpg',
        title: 'Study Mode',
        caption: ''
      }
    ],
    details: {
      background: {
        title: 'Background & Learning Friction',
        desc: 'The educational friction or gap explored.',
        content: 'Immersive technology alone does not guarantee meaningful learning. Without instructional scaffolding, learners may become distracted by the novelty instead of engaging with the core learning objectives.'
      },
      features: {
        title: 'Core Interactive Features',
        desc: 'The learning scenario design concept.',
        content: '• Learning Mode: Interactive AR spatial exploration and guided prompt checkpoints\n• Companion Care: Nurture virtual companions through concept mastery\n• Admin Mode: Real-time teacher insights and classroom activity monitoring'
      },
      deliverables: {
        title: 'Deliverables & Artifacts',
        desc: 'High-fidelity wireframes and instruction resources.',
        content: 'Interactive WebAR Prototype, Spatial Wireframes, Companion Emotion Tree'
      }
    }
  },
  {
    id: 'tarot',
    title: 'Positive Tarot',
    projectType: 'Digital Tarot & Mindfulness',
    badge: 'Self-Reflective Exploration',
    tagline: 'A Taste of Uplifting Reflection',
    headerPhase: 'REFLECT & REFRAME',
    emoji: '🔮',
    overview: 'A positive-only digital tarot experience that combines uplifting affirmations, reflective prompts, and interactive card reveals to encourage mindfulness and intentional self-discovery.',
    caseStudyId: 'ra-training',
    skills: ['Design Thinking', 'Graphic Design', 'Prototyping', 'Content Strategy'],
    color: {
      bg: 'bg-brand-lavender/10',
      border: 'border-brand-lavender/30',
      accent: '#B19AC4', // Morandi Purple
      text: 'text-brand-lavender',
      glow: 'rgba(177, 154, 196, 0.15)'
    },
    bgPhoto: '/images/tarot.jpg',
    logoPhoto: '/images/logo-tarot.png',
    logoScale: 'scale-[1.38]',
    demoUrl: 'https://katiehong03.github.io/PositiveTarot/',
    defaultGallery: [
      {
        id: 'tarot-2',
        url: '/images/walkthrough-tarot.jpg',
        title: 'Workflow',
        caption: 'Constructive Socratic reflections and positive interpretations'
      },
      {
        id: 'custom-1787455509025',
        url: '/images/tarot-gallery-02.jpg',
        title: 'Landing Page',
        caption: ''
      },
      {
        id: 'custom-1787455520871',
        url: '/images/tarot-gallery-03.jpg',
        title: 'About',
        caption: ''
      },
      {
        id: 'custom-1787455529075',
        url: '/images/tarot-gallery-04.jpg',
        title: 'Card Reveal',
        caption: ''
      },
      {
        id: 'custom-1787455538734',
        url: '/images/tarot-gallery-05.jpg',
        title: 'Card Drawing Session',
        caption: ''
      }
    ],
    details: {
      background: {
        title: 'Background & Learning Friction',
        desc: 'The educational friction or gap explored.',
        content: 'People often seek tarot readings for reassurance and self-reflection, but negative or discouraging interpretations can create unnecessary anxiety instead of promoting personal growth.'
      },
      features: {
        title: 'Core Interactive Features',
        desc: 'The learning scenario design concept.',
        content: '• Shuffle and Select Your Card: Tactile card shuffling and dynamic reveals\n• Reveal Meaning: Uplifting affirmations, constructive interpretations, and guided mindfulness prompts\n• Daily Journal: Save insights to personal mindful logbook'
      },
      deliverables: {
        title: 'Deliverables & Artifacts',
        desc: 'High-fidelity wireframes and instruction resources.',
        content: 'AI Prompting Guide, Socratic Reflection Flow, Custom Illustrated Card Assets'
      }
    }
  },
  {
    id: 'pawgress',
    title: 'Pawgress',
    projectType: 'Productivity & Habit App',
    badge: 'Stigma-Free Well-being Habits',
    tagline: 'Fresh Habits, Daily Comfort',
    headerPhase: 'FIND THE RIGHT STARTING POINT',
    emoji: '🐾',
    overview: 'A calming productivity experience centered around a "Done List," playful pet interactions, and gentle reflections that celebrate incremental progress and cultivate sustainable daily routines.',
    caseStudyId: 'columbia-wellness',
    skills: ['Learning Research', 'Design Thinking', 'Prototyping', 'Gamification'],
    color: {
      bg: 'bg-brand-blue/10',
      border: 'border-brand-blue/30',
      accent: '#7B96B2', // Morandi Blue
      text: 'text-brand-blue',
      glow: 'rgba(123, 150, 178, 0.15)'
    },
    bgPhoto: '/images/pawgress.jpg',
    logoPhoto: '/images/logo-pawgress.png',
    logoScale: 'scale-[1.28]',
    demoUrl: 'https://katiehong03.github.io/Pawgress/login.html',
    defaultGallery: [
      {
        id: 'paw-2',
        url: '/images/walkthrough-pawgress.jpg',
        title: 'Workflow',
        caption: 'Positive reinforcement routines and habit consistency visualization'
      },
      {
        id: 'custom-1787455773260',
        url: '/images/pawgress-gallery-02.jpg',
        title: 'Landing',
        caption: ''
      },
      {
        id: 'custom-1787455815579',
        url: '/images/pawgress-gallery-03.jpg',
        title: 'Companion Selection',
        caption: ''
      }
    ],
    details: {
      background: {
        title: 'Background & Learning Friction',
        desc: 'The psychological friction and habit abandonment gap explored.',
        content: 'Traditional productivity tools often emphasize unfinished tasks and rigid deadlines, creating anxiety and cognitive fatigue. Pawgress shifts the paradigm to positive reinforcement and progress recognition.'
      },
      features: {
        title: 'Core Interactive Features',
        desc: 'The learning scenario and behavior design concept.',
        content: '• Select Your Animal: Choose and nurture a playful virtual companion\n• Add Task & Done List: Celebrate incremental progress by easily adding daily tasks\n• Calendar & Streak Log: Log consistency, review historical achievements, and visualize routines\n• My Praises: Curate a warm space of gentle reflections, small wins, and personal affirmations'
      },
      deliverables: {
        title: 'Deliverables & Artifacts',
        desc: 'High-fidelity wireframes and instruction resources.',
        content: 'Interactive Prototype, High-Fidelity UI, Storyboards, User Research Synthesis'
      }
    }
  }
];

// Helper to retrieve saved showcase images
const getSavedProjectImages = (projectId: string, defaultImages: ShowcaseImage[]): ShowcaseImage[] => {
  try {
    const saved = localStorage.getItem(`portfolio_playground_images_${projectId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: ShowcaseImage) => {
          if (item && item.url) {
            return { ...item, url: normalizeImageUrl(item.url) || item.url };
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
  return defaultImages;
};

// Helper for client-side image compression
const compressImageFile = (file: File, maxWidth = 1200, maxHeight = 900, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// =========================================================================
// VERTICAL ANIMATED SCROLLING REEL COMPONENT
// =========================================================================
interface VerticalShowcaseReelProps {
  projectId: string;
  title: string;
  defaultImages: ShowcaseImage[];
  onImageClick: (imgUrl: string) => void;
  onManageClick: () => void;
  isAdmin: boolean;
}

function VerticalShowcaseReel({
  projectId,
  title,
  defaultImages,
  onImageClick,
  onManageClick,
  isAdmin
}: VerticalShowcaseReelProps) {
  const [images, setImages] = useState<ShowcaseImage[]>(() => getSavedProjectImages(projectId, defaultImages));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setImages(getSavedProjectImages(projectId, defaultImages));
    };
    window.addEventListener(`playground_images_updated_${projectId}`, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(`playground_images_updated_${projectId}`, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [projectId, defaultImages]);

  // Duplicate items for continuous seamless loop
  const displayItems = images.length >= 2 ? [...images, ...images] : images;

  return (
    <div 
      className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-brand-border/80 shadow-inner group/reel select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top & Bottom gradient fades for elegant viewport blending */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#F6F2EC] via-[#F6F2EC]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#F6F2EC] via-[#F6F2EC]/80 to-transparent z-10 pointer-events-none" />

      {/* Floating Status & Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-brand-border text-[11px] font-sans font-medium text-brand-text shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Preview</span>
        </div>
        
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManageClick();
            }}
            className="pointer-events-auto px-2.5 py-1 rounded-full bg-brand-text text-white hover:bg-brand-peach text-[10px] font-sans font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            title="Upload or manage showcase images"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Pics</span>
          </button>
        )}
      </div>

      {/* Animated Vertical Track */}
      <div 
        className="w-full py-4 px-3 sm:px-4 space-y-4 animate-vertical-scroll"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {displayItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            onClick={() => onImageClick(item.url)}
            className="group/item relative rounded-xl overflow-hidden border border-brand-border bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-zoom-in hover:scale-[1.02] transform-gpu"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#ECE8E1] relative flex items-center justify-center">
              <img
                src={item.url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.reel-img-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="reel-img-fallback hidden absolute inset-0 bg-[#EFEBE4] flex flex-col items-center justify-center p-3 text-center">
                <ImageIcon className="w-5 h-5 text-brand-muted/70 mb-1" />
                <span className="text-[10px] font-mono font-medium text-brand-text truncate max-w-[88%]">
                  {item.url.replace('/images/', '')}
                </span>
                <span className="text-[9px] font-sans text-brand-muted mt-0.5">
                  Save to public/images/ to view
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 group-hover/item:opacity-90 transition-opacity pointer-events-none" />
              
              {/* Expand Icon */}
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity shadow-xs">
                <Eye className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
                <p className="text-[9.5px] font-mono text-white/70 uppercase tracking-wider">
                  0{((idx % images.length) + 1)} • {title}
                </p>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-white leading-tight drop-shadow-xs">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-[10px] font-sans text-white/80 line-clamp-1 mt-0.5">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Hover Indicator at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover/reel:opacity-100 transition-opacity">
        <span className="text-[10px] font-sans bg-black/70 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
          Click any card to expand
        </span>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN PLAYGROUND VIEW COMPONENT
// =========================================================================
export default function PlaygroundView() {
  const [activeProjectModal, setActiveProjectModal] = useState<SandboxProject | null>(null);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeCaseStudyModal, setActiveCaseStudyModal] = useState<Project | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string>(PLAYGROUND_PROJECTS[0].id);
  const [expandedDetail, setExpandedDetail] = useState<'background' | 'features' | null>('features');

  // Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('portfolio_admin_active') === 'true';
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Image Management Modal state
  const [managingProject, setManagingProject] = useState<SandboxProject | null>(null);
  const [tempGallery, setTempGallery] = useState<ShowcaseImage[]>([]);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Logo Customization State (Admin Mode)
  const [customLogos, setCustomLogos] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    PLAYGROUND_PROJECTS.forEach(p => {
      const saved = localStorage.getItem(`portfolio_playground_logo_${p.id}`);
      if (saved) {
        map[p.id] = saved;
      }
    });
    return map;
  });
  const [tempLogoPhoto, setTempLogoPhoto] = useState<string | undefined>(undefined);
  const [newLogoUrlInput, setNewLogoUrlInput] = useState<string>('');

  // Project Content & Tags Customization State (Admin Mode)
  const [customProjectData, setCustomProjectData] = useState<Record<string, Partial<SandboxProject>>>(() => {
    const map: Record<string, Partial<SandboxProject>> = {};
    PLAYGROUND_PROJECTS.forEach(p => {
      const saved = localStorage.getItem(`portfolio_playground_project_data_${p.id}`);
      if (saved) {
        try {
          map[p.id] = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved project data', e);
        }
      }
    });
    return map;
  });

  // Tag inputs per project card
  const [cardTagInputs, setCardTagInputs] = useState<Record<string, string>>({});
  const [isAddingTagOnCard, setIsAddingTagOnCard] = useState<Record<string, boolean>>({});

  // Detail Modal Edit State
  const [isEditingDetailModal, setIsEditingDetailModal] = useState(false);
  const [modalTagInput, setModalTagInput] = useState('');
  const [detailEditForm, setDetailEditForm] = useState<{
    title: string;
    projectType: string;
    tagline: string;
    overview: string;
    demoUrl: string;
    skills: string[];
    bgTitle: string;
    bgDesc: string;
    bgContent: string;
    featTitle: string;
    featDesc: string;
    featContent: string;
  }>({
    title: '',
    projectType: '',
    tagline: '',
    overview: '',
    demoUrl: '',
    skills: [],
    bgTitle: '',
    bgDesc: '',
    bgContent: '',
    featTitle: '',
    featDesc: '',
    featContent: '',
  });

  // Helper to get fully merged project with custom details, custom skills, and custom logo
  const getMergedProject = (p: SandboxProject): SandboxProject => {
    const custom = customProjectData[p.id] || {};
    const customLogo = customLogos[p.id];
    return {
      ...p,
      ...custom,
      logoPhoto: customLogo || custom.logoPhoto || p.logoPhoto,
      skills: custom.skills || p.skills,
      details: {
        background: {
          ...p.details.background,
          ...(custom.details?.background || {})
        },
        features: {
          ...p.details.features,
          ...(custom.details?.features || {})
        },
        deliverables: {
          ...p.details.deliverables,
          ...(custom.details?.deliverables || {})
        }
      }
    };
  };

  // Mouse follower custom cursor state (matching WorkView with prototype peach color)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHoveringCard, setIsHoveringCard] = useState<boolean>(false);
  const [cursorLabel, setCursorLabel] = useState<string>('View');
  const [isCursorVisible, setIsCursorVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setIsCursorVisible(false);
      setIsHoveringCard(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Ensure playground view always renders scrolled cleanly to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync admin state
  useEffect(() => {
    const unsub = subscribeToAuth((st) => {
      setIsAdminMode(st.isAuthenticated);
    });
    const checkAdmin = () => {
      setIsAdminMode(localStorage.getItem('portfolio_admin_active') === 'true');
    };
    window.addEventListener('storage', checkAdmin);
    return () => {
      unsub();
      window.removeEventListener('storage', checkAdmin);
    };
  }, []);

  // Listen for playground updates
  useEffect(() => {
    const refreshPlaygroundImages = () => {
      const map: Record<string, string> = {};
      PLAYGROUND_PROJECTS.forEach(p => {
        const saved = localStorage.getItem(`portfolio_playground_logo_${p.id}`);
        if (saved) {
          map[p.id] = saved;
        }
      });
      setCustomLogos(map);
    };

    window.addEventListener('portfolio_cloud_playground_updated', refreshPlaygroundImages);

    return () => {
      window.removeEventListener('portfolio_cloud_playground_updated', refreshPlaygroundImages);
    };
  }, []);

  // Track active project as user scrolls
  const projectRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (const project of PLAYGROUND_PROJECTS) {
        const el = projectRefs.current[project.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionId(project.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProject = (id: string) => {
    const el = projectRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveSectionId(id);
    }
  };

  const getDemoMappingId = (projectId: string) => {
    if (projectId === 'tarot') return 'tarot';
    if (projectId === 'lumipal') return 'lumioal';
    if (projectId === 'teajourney') return 'teajourney';
    if (projectId === 'pawgress') return 'progress';
    return null;
  };

  // Tag management (Add and Delete Skills / Chips)
  const handleAddSkillTag = (projectId: string, newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const baseProj = PLAYGROUND_PROJECTS.find(p => p.id === projectId);
    if (!baseProj) return;
    const merged = getMergedProject(baseProj);
    if (merged.skills.includes(trimmed)) {
      setCardTagInputs(prev => ({ ...prev, [projectId]: '' }));
      return;
    }
    const updatedSkills = [...merged.skills, trimmed];
    const existingCustom = customProjectData[projectId] || {};
    const updatedData: Partial<SandboxProject> = {
      ...existingCustom,
      skills: updatedSkills
    };
    setCustomProjectData(prev => ({ ...prev, [projectId]: updatedData }));
    localStorage.setItem(`portfolio_playground_project_data_${projectId}`, JSON.stringify(updatedData));
    setCardTagInputs(prev => ({ ...prev, [projectId]: '' }));
    setIsAddingTagOnCard(prev => ({ ...prev, [projectId]: false }));

    if (activeProjectModal && activeProjectModal.id === projectId) {
      setActiveProjectModal(getMergedProject({ ...baseProj, skills: updatedSkills }));
      setDetailEditForm(prev => ({ ...prev, skills: updatedSkills }));
    }
  };

  const handleDeleteSkillTag = (projectId: string, tagToDelete: string) => {
    const baseProj = PLAYGROUND_PROJECTS.find(p => p.id === projectId);
    if (!baseProj) return;
    const merged = getMergedProject(baseProj);
    const updatedSkills = merged.skills.filter(s => s !== tagToDelete);
    const existingCustom = customProjectData[projectId] || {};
    const updatedData: Partial<SandboxProject> = {
      ...existingCustom,
      skills: updatedSkills
    };
    setCustomProjectData(prev => ({ ...prev, [projectId]: updatedData }));
    localStorage.setItem(`portfolio_playground_project_data_${projectId}`, JSON.stringify(updatedData));

    if (activeProjectModal && activeProjectModal.id === projectId) {
      setActiveProjectModal(getMergedProject({ ...baseProj, skills: updatedSkills }));
      setDetailEditForm(prev => ({ ...prev, skills: updatedSkills }));
    }
  };

  // Open Details Modal
  const handleOpenDetails = (project: SandboxProject) => {
    const merged = getMergedProject(project);
    setActiveProjectModal(merged);
    setIsEditingDetailModal(false);
    setExpandedDetail('features');
  };

  // Start editing the active project's detail content
  const handleStartEditDetail = (project: SandboxProject) => {
    const merged = getMergedProject(project);
    setDetailEditForm({
      title: merged.title,
      projectType: merged.projectType,
      tagline: merged.tagline || '',
      overview: merged.overview,
      demoUrl: merged.demoUrl || '',
      skills: [...merged.skills],
      bgTitle: merged.details.background.title,
      bgDesc: merged.details.background.desc || '',
      bgContent: merged.details.background.content,
      featTitle: merged.details.features.title,
      featDesc: merged.details.features.desc || '',
      featContent: merged.details.features.content,
    });
    setModalTagInput('');
    setIsEditingDetailModal(true);
  };

  // Save the edited detail content
  const handleSaveDetailForm = () => {
    if (!activeProjectModal) return;
    const projectId = activeProjectModal.id;
    const existingCustom = customProjectData[projectId] || {};
    const updatedData: Partial<SandboxProject> = {
      ...existingCustom,
      title: detailEditForm.title.trim() || activeProjectModal.title,
      projectType: detailEditForm.projectType.trim() || activeProjectModal.projectType,
      tagline: detailEditForm.tagline.trim(),
      overview: detailEditForm.overview.trim() || activeProjectModal.overview,
      demoUrl: detailEditForm.demoUrl.trim() || undefined,
      skills: detailEditForm.skills,
      details: {
        background: {
          title: detailEditForm.bgTitle.trim() || activeProjectModal.details.background.title,
          desc: detailEditForm.bgDesc.trim() || activeProjectModal.details.background.desc,
          content: detailEditForm.bgContent.trim() || activeProjectModal.details.background.content,
        },
        features: {
          title: detailEditForm.featTitle.trim() || activeProjectModal.details.features.title,
          desc: detailEditForm.featDesc.trim() || activeProjectModal.details.features.desc,
          content: detailEditForm.featContent.trim() || activeProjectModal.details.features.content,
        },
        deliverables: activeProjectModal.details.deliverables,
      }
    };

    setCustomProjectData(prev => ({ ...prev, [projectId]: updatedData }));
    savePlaygroundProject(projectId, updatedData).catch(err => console.warn('Cloud save project data:', err));
    localStorage.setItem(`portfolio_playground_project_data_${projectId}`, JSON.stringify(updatedData));
    
    const baseProj = PLAYGROUND_PROJECTS.find(p => p.id === projectId);
    if (baseProj) {
      const merged = {
        ...baseProj,
        ...updatedData,
        skills: detailEditForm.skills,
        details: {
          ...baseProj.details,
          ...(updatedData.details || {})
        }
      };
      setActiveProjectModal(getMergedProject(merged as SandboxProject));
    }
    setIsEditingDetailModal(false);
  };

  // Cancel detail editing
  const handleCancelEditDetail = () => {
    setIsEditingDetailModal(false);
  };

  // Reset project details & tags to defaults
  const handleResetProjectData = (projectId: string) => {
    if (window.confirm('Reset this project content, descriptions, and tags back to default?')) {
      localStorage.removeItem(`portfolio_playground_project_data_${projectId}`);
      setCustomProjectData(prev => {
        const copy = { ...prev };
        delete copy[projectId];
        return copy;
      });
      const baseProj = PLAYGROUND_PROJECTS.find(p => p.id === projectId);
      if (baseProj) {
        setActiveProjectModal(getMergedProject(baseProj));
        setDetailEditForm({
          title: baseProj.title,
          projectType: baseProj.projectType,
          tagline: baseProj.tagline || '',
          overview: baseProj.overview,
          demoUrl: baseProj.demoUrl || '',
          skills: [...baseProj.skills],
          bgTitle: baseProj.details.background.title,
          bgDesc: baseProj.details.background.desc || '',
          bgContent: baseProj.details.background.content,
          featTitle: baseProj.details.features.title,
          featDesc: baseProj.details.features.desc || '',
          featContent: baseProj.details.features.content,
        });
      }
      setIsEditingDetailModal(false);
    }
  };

  const handleViewCaseStudy = (caseStudyId: string) => {
    const proj = getLiveProjectById(caseStudyId);
    if (proj) {
      setActiveCaseStudyModal(proj);
    } else {
      localStorage.setItem('selected_portfolio_project', caseStudyId);
      window.dispatchEvent(new Event('storage_sync_project'));
      const workBtn = document.getElementById('nav-work-btn');
      if (workBtn) workBtn.click();
    }
  };

  // Open Image Manager for project
  const handleOpenImageManager = (project: SandboxProject) => {
    setManagingProject(project);
    setTempGallery(getSavedProjectImages(project.id, project.defaultGallery));
    setTempLogoPhoto(customLogos[project.id] || project.logoPhoto);
    setNewLogoUrlInput('');
    setNewImageTitle('');
    setNewImageCaption('');
    setNewImageUrl('');
  };

  const handleResetLogo = (projectId: string) => {
    localStorage.removeItem(`portfolio_playground_logo_${projectId}`);
    setCustomLogos(prev => {
      const copy = { ...prev };
      delete copy[projectId];
      return copy;
    });
    const defaultProj = PLAYGROUND_PROJECTS.find(p => p.id === projectId);
    if (defaultProj) {
      setTempLogoPhoto(defaultProj.logoPhoto);
    }
    setFailedImages(prev => ({ ...prev, [`logo-${projectId}`]: false, [`modal-logo-${projectId}`]: false }));
  };

  // Save Image & Logo Manager changes
  const handleSaveGallery = () => {
    if (!managingProject) return;
    try {
      savePlaygroundProject(managingProject.id, {
        showcase_images: tempGallery,
        logo_url: tempLogoPhoto
      }).catch(err => console.warn('Cloud save gallery:', err));

      localStorage.setItem(`portfolio_playground_images_${managingProject.id}`, JSON.stringify(tempGallery));
      if (tempLogoPhoto) {
        localStorage.setItem(`portfolio_playground_logo_${managingProject.id}`, tempLogoPhoto);
        setCustomLogos(prev => ({ ...prev, [managingProject.id]: tempLogoPhoto }));
      }
      window.dispatchEvent(new Event(`playground_images_updated_${managingProject.id}`));
      setManagingProject(null);
    } catch (e) {
      console.error(e);
      alert('Unable to save changes due to storage limit. Try uploading a smaller image.');
    }
  };

  // Reset Gallery & Logo to defaults
  const handleResetGallery = () => {
    if (!managingProject) return;
    if (window.confirm('Reset this showcase reel and logo back to default placeholder images?')) {
      localStorage.removeItem(`portfolio_playground_images_${managingProject.id}`);
      localStorage.removeItem(`portfolio_playground_logo_${managingProject.id}`);
      setTempGallery(managingProject.defaultGallery);
      setTempLogoPhoto(managingProject.logoPhoto);
      setCustomLogos(prev => {
        const copy = { ...prev };
        delete copy[managingProject.id];
        return copy;
      });
      window.dispatchEvent(new Event(`playground_images_updated_${managingProject.id}`));
    }
  };

  const handleAddUrlImage = () => {
    if (!newImageUrl.trim()) return;
    const newImg: ShowcaseImage = {
      id: `url-${Date.now()}`,
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || 'Custom Interface Screen',
      caption: newImageCaption.trim() || undefined
    };
    setTempGallery(prev => [...prev, newImg]);
    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageCaption('');
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const updated = [...tempGallery];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const item = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = item;
    setTempGallery(updated);
  };

  const handleDeleteImage = (index: number) => {
    if (tempGallery.length <= 1) {
      alert('You must keep at least one image in the showcase reel.');
      return;
    }
    setTempGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerifyPassword = () => {
    const trimmed = (passwordInput || '').trim();
    if (trimmed === '030226' || trimmed === 'admin') {
      setIsAdminMode(true);
      localStorage.setItem('portfolio_admin_active', 'true');
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid credentials. Passcode must be 030226.');
    }
  };

  const handleResetAllPlaygroundDefaults = () => {
    if (window.confirm('Reset all playground edits, custom logos, and custom gallery images back to default?')) {
      PLAYGROUND_PROJECTS.forEach(p => {
        localStorage.removeItem(`portfolio_playground_project_data_${p.id}`);
        localStorage.removeItem(`portfolio_playground_logo_${p.id}`);
        localStorage.removeItem(`portfolio_playground_gallery_${p.id}`);
      });
      setCustomProjectData({});
      setCustomLogos({});
      setFailedImages({});
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    localStorage.removeItem('portfolio_admin_active');
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24 relative">
      {/* Title Header Section with Soft Motion Stagger */}
      <motion.section 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-4xl mx-auto text-center relative"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic font-bold text-4xl sm:text-5xl md:text-6xl text-brand-text tracking-tight mt-2"
        >
          Interactive <span className="text-brand-peach not-italic font-normal">Playground</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-2"
        >
          A collection of small experiments exploring interaction, learning, AI, and playful digital experiences.
        </motion.p>
      </motion.section>

      {/* Floating Right-Side Dot Navigation Indicator */}
      <aside className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 bg-white/85 backdrop-blur-md px-2 py-3.5 rounded-full border border-brand-border/50 shadow-sm">
        {PLAYGROUND_PROJECTS.map(proj => {
          const isActive = activeSectionId === proj.id;
          return (
            <button
              key={proj.id}
              onClick={() => scrollToProject(proj.id)}
              className="group relative flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label={`Scroll to ${proj.title}`}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 bg-brand-text text-brand-bg text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                {proj.title}
              </span>
              
              {/* Outer ring for active */}
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-brand-text'
                      : 'w-1.5 h-1.5 bg-brand-border group-hover:bg-brand-text'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </aside>

      {/* =========================================================================
          SOFT CARDS CONTAINER
          ========================================================================= */}
      <div className="relative max-w-6xl mx-auto space-y-12 sm:space-y-16 pb-24">
        {PLAYGROUND_PROJECTS.map((rawProject, index) => {
          const project = getMergedProject(rawProject);

          return (
            <motion.div
              key={project.id}
              ref={el => { projectRefs.current[project.id] = el; }}
              id={`playground-showcase-${project.id}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                duration: 0.7, 
                delay: (index % 2) * 0.12,
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="rounded-3xl overflow-hidden border border-brand-border/40 bg-white shadow-2xs hover:shadow-md transition-all duration-500 group"
            >
              {/* 2-COLUMN SPLIT: LEFT = ANIMATED VERTICAL SCROLLING REEL, RIGHT = SHORT DESCRIPTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                
                {/* ----------------- LEFT SIDE: VERTICAL ANIMATED SCROLLING BAR ----------------- */}
                <div 
                  onMouseEnter={() => {
                    setIsHoveringCard(true);
                    setCursorLabel('View');
                  }}
                  onMouseLeave={() => setIsHoveringCard(false)}
                  className="lg:col-span-6 bg-[#FAF8F5]/90 relative flex flex-col justify-center items-center overflow-hidden p-5 sm:p-7 md:p-8 min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] border-b lg:border-b-0 lg:border-r border-brand-border/40 group/vis"
                >
                  {/* Atmospheric background glow with soft pastel hue */}
                  <div 
                    className="absolute inset-0 opacity-40 filter blur-3xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${project.color.accent}26 0%, transparent 70%)`
                    }}
                  />

                  {/* Vertical Animated Scrolling Gallery Component */}
                  <VerticalShowcaseReel
                    projectId={project.id}
                    title={project.title}
                    defaultImages={project.defaultGallery}
                    onImageClick={(imgUrl) => setLightboxImage(imgUrl)}
                    onManageClick={() => handleOpenImageManager(project)}
                    isAdmin={isAdminMode}
                  />
                </div>

                {/* ----------------- RIGHT SIDE: SHORT DESCRIPTION (Warm Neutral Palette) ----------------- */}
                <div 
                  className="lg:col-span-6 bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6 sm:space-y-7 text-left my-auto"
                >
                  <div className="space-y-5 sm:space-y-6">
                    {/* Logo & Display Title */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-3.5">
                        {(() => {
                          const currentLogo = customLogos[project.id] || project.logoPhoto;
                          const scaleClass = project.logoScale || '';
                          return currentLogo && !failedImages[`logo-${project.id}`] ? (
                            <div className="relative group/logo w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-brand-border/60 shadow-2xs flex items-center justify-center overflow-hidden shrink-0">
                              <img
                                src={currentLogo}
                                alt={`${project.title} logo`}
                                referrerPolicy="no-referrer"
                                onError={() => setFailedImages(prev => ({ ...prev, [`logo-${project.id}`]: true }))}
                                className={`w-full h-full object-cover transition-transform duration-300 ${scaleClass}`}
                              />
                            </div>
                          ) : (
                              <div className="relative w-12 h-12 rounded-2xl bg-brand-sage/15 border border-brand-sage/30 text-2xl flex items-center justify-center shrink-0">
                                {project.emoji}
                              </div>
                            );
                        })()}
                        <div>
                          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-brand-text tracking-tight uppercase">
                            {project.title}
                          </h2>
                          {project.tagline ? (
                            <p className="font-sans text-xs tracking-wider uppercase text-brand-muted font-medium mt-0.5">
                              {project.tagline}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="font-sans text-sm sm:text-[15px] text-brand-text/85 leading-relaxed sm:leading-loose">
                      {project.overview}
                    </p>

                    {/* Skill Tags / Chips (Supports Manual Add and Delete in Admin Mode) */}
                    <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                      {project.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-brand-border/60 text-[11px] font-sans text-brand-text font-medium shadow-2xs group/tag"
                        >
                          <span>{skill}</span>
                          {isAdminMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkillTag(project.id, skill);
                              }}
                              title={`Delete "${skill}" tag`}
                              className="w-3.5 h-3.5 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-brand-muted transition-colors cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </span>
                      ))}

                      {/* Admin Inline Add Tag */}
                      {isAdminMode && (
                        <div className="inline-flex items-center">
                          {isAddingTagOnCard[project.id] ? (
                            <div className="inline-flex items-center gap-1 bg-white border border-brand-sage/60 rounded-xl p-0.5 shadow-2xs">
                              <input
                                type="text"
                                value={cardTagInputs[project.id] || ''}
                                onChange={(e) => setCardTagInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSkillTag(project.id, cardTagInputs[project.id] || '');
                                  } else if (e.key === 'Escape') {
                                    setIsAddingTagOnCard(prev => ({ ...prev, [project.id]: false }));
                                  }
                                }}
                                placeholder="New tag..."
                                autoFocus
                                className="w-24 text-[11px] font-sans px-2 py-0.5 focus:outline-none text-brand-text"
                              />
                              <button
                                onClick={() => handleAddSkillTag(project.id, cardTagInputs[project.id] || '')}
                                className="px-1.5 py-0.5 rounded-lg bg-brand-sage text-white text-[10px] font-bold hover:bg-brand-sage/80 cursor-pointer"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setIsAddingTagOnCard(prev => ({ ...prev, [project.id]: false }))}
                                className="p-0.5 text-brand-muted hover:text-brand-text cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setIsAddingTagOnCard(prev => ({ ...prev, [project.id]: true }))}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-dashed border-brand-border hover:border-brand-sage hover:bg-brand-sage/10 text-brand-muted hover:text-brand-sage text-[11px] font-sans font-medium transition-all cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Tag</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action CTA Buttons */}
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {/* Primary Launch Action */}
                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => {
                            setIsHoveringCard(true);
                            setCursorLabel('Demo');
                          }}
                          onMouseLeave={() => setIsHoveringCard(false)}
                          className="py-3 px-4 bg-brand-text text-brand-bg hover:bg-brand-peach transition-all duration-300 rounded-2xl text-xs sm:text-sm font-semibold font-sans flex items-center justify-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs text-center"
                        >
                          <Play className="w-3.5 h-3.5 text-brand-peach group-hover:text-white" />
                          <span>Launch Demo</span>
                          <ExternalLink className="w-3.5 h-3.5 text-brand-bg/70 group-hover:text-white" />
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            const demoId = getDemoMappingId(project.id);
                            if (demoId) setActiveDemoId(demoId);
                          }}
                          onMouseEnter={() => {
                            setIsHoveringCard(true);
                            setCursorLabel('Demo');
                          }}
                          onMouseLeave={() => setIsHoveringCard(false)}
                          className="py-3 px-4 bg-brand-text text-brand-bg hover:bg-brand-peach transition-all duration-300 rounded-2xl text-xs sm:text-sm font-semibold font-sans flex items-center justify-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs text-center"
                        >
                          <Play className="w-3.5 h-3.5 text-brand-peach group-hover:text-white" />
                          <span>Launch Interactive Demo</span>
                        </button>
                      )}

                      {/* Secondary Read Case Study / Details Action */}
                      <button
                        onClick={() => handleOpenDetails(project)}
                        onMouseEnter={() => {
                          setIsHoveringCard(true);
                          setCursorLabel('Details');
                        }}
                        onMouseLeave={() => setIsHoveringCard(false)}
                        className="py-3 px-4 bg-[#FAF8F5] text-brand-text border border-brand-border/60 hover:border-brand-border hover:bg-white transition-all duration-300 rounded-2xl text-xs sm:text-sm font-semibold font-sans flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs text-center"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-sage" />
                        <span>Details & Insights</span>
                      </button>
                    </div>

                    {/* Admin Image Manager Trigger */}
                    {isAdminMode && (
                      <button
                        onClick={() => handleOpenImageManager(project)}
                        className="w-full py-2 px-3 rounded-xl border border-dashed border-brand-sage/60 hover:bg-brand-sage/10 text-brand-sage text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Manage Showcase Gallery ({project.defaultGallery.length} images)</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================================
          DETAILED PROJECT MODAL (With Full Content Editing in Admin Mode)
          ========================================================================= */}
      <AnimatePresence>
        {activeProjectModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-brand-border rounded-[2.5rem] shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden max-h-[90vh] flex flex-col justify-between"
              id="playground-details-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveProjectModal(null);
                  setIsEditingDetailModal(false);
                }}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF8F5] border border-brand-border/60 hover:border-brand-sage flex items-center justify-center text-brand-text hover:text-brand-sage transition-all cursor-pointer shadow-xs z-20"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Admin Mode Edit Toolbar in Modal */}
              {isAdminMode && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#FAF8F5] border border-brand-border mr-10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-text font-bold flex items-center gap-1.5">
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Admin Content Editor
                    </span>
                    {isEditingDetailModal ? (
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Editing Mode Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-brand-muted">
                        (Click Edit Content to modify text & sections)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditingDetailModal ? (
                      <>
                        <button
                          onClick={handleSaveDetailForm}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={handleCancelEditDetail}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-brand-border hover:bg-gray-100 text-brand-muted text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartEditDetail(activeProjectModal)}
                        className="px-3 py-1.5 rounded-xl bg-brand-text hover:bg-brand-peach text-white font-sans text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-peach hover:text-white" />
                        <span>Edit Content</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleResetProjectData(activeProjectModal.id)}
                      title="Reset project content and tags back to default preset"
                      className="p-1.5 rounded-xl bg-white border border-brand-border hover:text-red-600 text-brand-muted text-xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Scrollable Modal Content (View or Edit Mode) */}
              <div className="space-y-5 overflow-y-auto pr-1">
                {isEditingDetailModal ? (
                  /* ================= EDIT FORM MODE ================= */
                  <div className="space-y-4 text-left">
                    {/* Basic Info Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={detailEditForm.title}
                          onChange={(e) => setDetailEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full font-serif font-bold text-lg bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage text-brand-text"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                          Category / Badge
                        </label>
                        <input
                          type="text"
                          value={detailEditForm.projectType}
                          onChange={(e) => setDetailEditForm(prev => ({ ...prev, projectType: e.target.value }))}
                          className="w-full font-sans text-sm bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage text-brand-text"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={detailEditForm.tagline}
                        onChange={(e) => setDetailEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="e.g. Ancient Rituals, Modern Practice"
                        className="w-full font-sans text-sm bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage text-brand-text"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                        Overview Description
                      </label>
                      <textarea
                        rows={3}
                        value={detailEditForm.overview}
                        onChange={(e) => setDetailEditForm(prev => ({ ...prev, overview: e.target.value }))}
                        className="w-full font-sans text-sm bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage text-brand-text leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-muted font-bold mb-1">
                        Live Demo Web App URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={detailEditForm.demoUrl}
                        onChange={(e) => setDetailEditForm(prev => ({ ...prev, demoUrl: e.target.value }))}
                        placeholder="https://your-demo-app.vercel.app"
                        className="w-full font-sans text-xs font-mono bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage text-brand-text"
                      />
                    </div>

                    {/* Tags / Skills Editing */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-border space-y-2">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-muted font-bold">
                        Skill Tags / Chips
                      </label>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {detailEditForm.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-brand-border text-xs font-sans text-brand-text shadow-2xs"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setDetailEditForm(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter(s => s !== skill)
                                }));
                              }}
                              className="text-brand-muted hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}

                        <div className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            value={modalTagInput}
                            onChange={(e) => setModalTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = modalTagInput.trim();
                                if (trimmed && !detailEditForm.skills.includes(trimmed)) {
                                  setDetailEditForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
                                  setModalTagInput('');
                                }
                              }
                            }}
                            placeholder="Add new tag..."
                            className="text-xs font-sans bg-white border border-brand-border px-2.5 py-1 rounded-lg focus:outline-brand-sage w-28"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = modalTagInput.trim();
                              if (trimmed && !detailEditForm.skills.includes(trimmed)) {
                                setDetailEditForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
                                setModalTagInput('');
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-brand-sage text-white text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section 1: Background & Problem */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-border space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-brand-sage" />
                        <span className="font-serif font-bold text-sm text-brand-text">Section 1: Background & Context</span>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={detailEditForm.bgTitle}
                          onChange={(e) => setDetailEditForm(prev => ({ ...prev, bgTitle: e.target.value }))}
                          placeholder="Section Title"
                          className="w-full font-serif font-bold text-sm bg-white border border-brand-border px-3 py-1.5 rounded-xl mb-2 focus:outline-brand-sage"
                        />
                        <textarea
                          rows={3}
                          value={detailEditForm.bgContent}
                          onChange={(e) => setDetailEditForm(prev => ({ ...prev, bgContent: e.target.value }))}
                          placeholder="Background description content..."
                          className="w-full font-sans text-xs sm:text-sm bg-white border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Section 2: Core Features */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-border space-y-2.5">
                      <div className="flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-brand-peach" />
                        <span className="font-serif font-bold text-sm text-brand-text">Section 2: Core Interactive Features</span>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={detailEditForm.featTitle}
                          onChange={(e) => setDetailEditForm(prev => ({ ...prev, featTitle: e.target.value }))}
                          placeholder="Section Title"
                          className="w-full font-serif font-bold text-sm bg-white border border-brand-border px-3 py-1.5 rounded-xl mb-2 focus:outline-brand-sage"
                        />
                        <textarea
                          rows={3}
                          value={detailEditForm.featContent}
                          onChange={(e) => setDetailEditForm(prev => ({ ...prev, featContent: e.target.value }))}
                          placeholder="Core features description content..."
                          className="w-full font-sans text-xs sm:text-sm bg-white border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= PRESENTATION VIEW MODE ================= */
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3.5 border-b border-[#FAF8F5] pb-4 pr-8">
                      {(() => {
                        const currentModalLogo = customLogos[activeProjectModal.id] || activeProjectModal.logoPhoto;
                        const modalScaleClass = activeProjectModal.logoScale || '';
                        return (
                          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] border border-brand-border/60 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                            {currentModalLogo && !failedImages[`modal-logo-${activeProjectModal.id}`] ? (
                              <img
                                src={currentModalLogo}
                                alt={activeProjectModal.title}
                                referrerPolicy="no-referrer"
                                onError={() => setFailedImages(prev => ({ ...prev, [`modal-logo-${activeProjectModal.id}`]: true }))}
                                className={`w-full h-full object-cover ${modalScaleClass}`}
                              />
                            ) : (
                              activeProjectModal.emoji
                            )}
                          </div>
                        );
                      })()}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-brand-muted font-bold bg-[#FAF8F5] px-2 py-0.5 rounded border border-brand-border">
                            {activeProjectModal.projectType}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-2xl text-brand-text">
                          {activeProjectModal.title}
                        </h3>
                        {activeProjectModal.tagline ? (
                          <p className="font-sans text-xs text-brand-muted uppercase tracking-wider mt-0.5">
                            {activeProjectModal.tagline}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <p className="font-sans text-sm text-[#4A5048] leading-relaxed">
                      {activeProjectModal.overview}
                    </p>

                    {/* Skill Tags with Add and Delete */}
                    <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                      {activeProjectModal.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-brand-border text-[11px] font-sans text-brand-text font-medium shadow-2xs"
                        >
                          <span>{skill}</span>
                          {isAdminMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkillTag(activeProjectModal.id, skill);
                              }}
                              title={`Delete "${skill}" tag`}
                              className="w-3.5 h-3.5 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-brand-muted transition-colors cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </span>
                      ))}

                      {isAdminMode && (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            value={modalTagInput}
                            onChange={(e) => setModalTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSkillTag(activeProjectModal.id, modalTagInput);
                                setModalTagInput('');
                              }
                            }}
                            placeholder="Add tag..."
                            className="w-20 text-[11px] font-sans px-2 py-0.5 bg-[#FAF8F5] border border-brand-border rounded-lg focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              handleAddSkillTag(activeProjectModal.id, modalTagInput);
                              setModalTagInput('');
                            }}
                            className="px-1.5 py-0.5 rounded bg-brand-sage text-white text-[10px] font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Accordion Tabs */}
                    <div className="space-y-2.5">
                      {/* Background */}
                      <div className="border border-brand-border/60 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setExpandedDetail(expandedDetail === 'background' ? null : 'background')}
                          className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Info className="w-4 h-4 text-brand-sage shrink-0" />
                            <span className="font-serif font-bold text-sm text-brand-text">
                              {activeProjectModal.details.background.title}
                            </span>
                          </div>
                          {expandedDetail === 'background' ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
                        </button>
                        {expandedDetail === 'background' && (
                          <div className="p-4 bg-white border-t border-brand-border/40 font-sans text-xs sm:text-sm text-[#4A5048] leading-relaxed whitespace-pre-line">
                            {activeProjectModal.details.background.content}
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="border border-brand-border/60 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setExpandedDetail(expandedDetail === 'features' ? null : 'features')}
                          className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <PenTool className="w-4 h-4 text-brand-peach shrink-0" />
                            <span className="font-serif font-bold text-sm text-brand-text">
                              {activeProjectModal.details.features.title}
                            </span>
                          </div>
                          {expandedDetail === 'features' ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
                        </button>
                        {expandedDetail === 'features' && (
                          <div className="p-4 bg-white border-t border-brand-border/40 font-sans text-xs sm:text-sm text-[#4A5048] leading-relaxed whitespace-pre-line">
                            {activeProjectModal.details.features.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-brand-border/40 flex flex-col sm:flex-row gap-3">
                {activeProjectModal.demoUrl ? (
                  <a
                    href={activeProjectModal.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#3F3F3F] text-white hover:bg-brand-sage transition-colors rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
                  >
                    <Play className="w-3.5 h-3.5 text-[#D6A692]" />
                    <span>Launch Live Interactive Web App ↗</span>
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      const demoId = getDemoMappingId(activeProjectModal.id);
                      if (demoId) {
                        setActiveProjectModal(null);
                        setActiveDemoId(demoId);
                      }
                    }}
                    className="w-full py-3 px-4 bg-[#3F3F3F] text-white hover:bg-brand-sage transition-colors rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 text-[#D6A692]" />
                    <span>Open Interactive Simulator</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          ADMIN IMAGE MANAGEMENT & UPLOAD MODAL
          ========================================================================= */}
      <AnimatePresence>
        {managingProject && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-brand-border rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-brand-border flex items-center justify-center text-xl">
                    {managingProject.emoji}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-brand-text">
                      Manage Showcase Images: {managingProject.title}
                    </h3>
                    <p className="text-xs font-sans text-brand-muted">
                      Upload screenshots or mockups for the animated vertical scrolling bar.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setManagingProject(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-text cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body: Logo + Showcase Images */}
              <div className="space-y-6 overflow-y-auto pr-1">
                {/* App Icon / Logo Cover Customization */}
                <div className="p-4 rounded-2xl border border-brand-border bg-[#FAF8F5]/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-brand-text font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-brand-peach" /> App Logo / Cover Icon
                    </span>
                    {tempLogoPhoto !== managingProject.logoPhoto && (
                      <button
                        onClick={() => {
                          setTempLogoPhoto(managingProject.logoPhoto);
                        }}
                        className="text-[11px] font-mono text-brand-muted hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset Logo
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Logo Preview Squircle */}
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-brand-border shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                      {tempLogoPhoto ? (
                        <img
                          src={tempLogoPhoto}
                          alt="App Logo Preview"
                          className={`w-full h-full object-cover ${managingProject.logoScale || ''}`}
                        />
                      ) : (
                        <span className="text-3xl">{managingProject.emoji}</span>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        {/* URL / Path Input for Logo */}
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={newLogoUrlInput}
                            onChange={(e) => setNewLogoUrlInput(e.target.value)}
                            placeholder="Image URL or static path in /images/..."
                            className="font-sans text-xs bg-white border border-brand-border px-3 py-1.5 rounded-xl flex-1 focus:outline-brand-sage"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newLogoUrlInput.trim()) {
                                setTempLogoPhoto(newLogoUrlInput.trim());
                                setNewLogoUrlInput('');
                              }
                            }}
                            disabled={!newLogoUrlInput.trim()}
                            className="px-3 py-1.5 rounded-xl bg-brand-sage text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] font-sans text-brand-muted">
                        Changes will be applied to the prototype card and details view upon saving.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Existing Images List */}
                <div className="space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-brand-muted font-bold block">
                    Current Showcase Images ({tempGallery.length})
                  </span>
                  
                  <div className="space-y-2.5">
                    {tempGallery.map((img, idx) => (
                      <div
                        key={img.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all"
                      >
                        <div className="w-16 h-12 rounded-lg bg-neutral-200 border border-brand-border overflow-hidden shrink-0">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTempGallery(prev => prev.map((item, i) => i === idx ? { ...item, title: val } : item));
                            }}
                            placeholder="Screen Title"
                            className="font-serif font-bold text-xs sm:text-sm text-brand-text bg-white border border-brand-border px-2 py-1 rounded w-full focus:outline-brand-sage"
                          />
                          <input
                            type="text"
                            value={img.caption || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTempGallery(prev => prev.map((item, i) => i === idx ? { ...item, caption: val } : item));
                            }}
                            placeholder="Optional Caption / Feature description..."
                            className="font-sans text-[11px] text-brand-muted bg-white border border-brand-border px-2 py-0.5 rounded w-full mt-1 focus:outline-brand-sage"
                          />
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-muted hover:text-brand-text disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveImage(idx, 'down')}
                            disabled={idx === tempGallery.length - 1}
                            className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-muted hover:text-brand-text disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(idx)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Image Section */}
                <div className="p-4 rounded-2xl border border-dashed border-brand-border bg-white space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-brand-sage font-bold flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add New Showcase Screen
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      placeholder="Screen Name (e.g. Brewing Simulator)"
                      className="font-sans text-xs bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage"
                    />
                    <input
                      type="text"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      placeholder="Short Caption / Interaction details"
                      className="font-sans text-xs bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl focus:outline-brand-sage"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full pt-1">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Image URL or static path in /images/ (e.g. /images/playground-01.png)"
                      className="font-sans text-xs bg-[#FAF8F5] border border-brand-border px-3 py-2 rounded-xl flex-1 focus:outline-brand-sage"
                    />
                    <button
                      onClick={handleAddUrlImage}
                      disabled={!newImageUrl.trim()}
                      className="px-4 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow-xs shrink-0"
                    >
                      Add Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between border-t border-brand-border/60 pt-4">
                <button
                  onClick={handleResetGallery}
                  className="flex items-center gap-1 text-xs font-mono text-brand-muted hover:text-red-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setManagingProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-sans text-brand-muted hover:text-brand-text cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGallery}
                    className="px-5 py-2 rounded-xl bg-brand-text hover:bg-brand-peach text-white font-sans text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-brand-peach group-hover:text-white" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          ADMIN PASSWORD PROMPT MODAL
          ========================================================================= */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-brand-border shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2 text-brand-sage">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg text-brand-text">Admin Authentication</h3>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordInput('');
                    setPasswordError('');
                  }}
                  className="text-brand-muted hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-brand-bg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="font-sans text-xs text-brand-muted leading-relaxed">
                  Enter the administrator password to enable live editing and image management.
                </p>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleVerifyPassword();
                      }
                    }}
                    placeholder="Enter administrator password"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border/80 focus:border-brand-sage focus:outline-none text-sm font-sans placeholder:text-brand-muted"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-[#9C5A4C] text-[11px] font-medium font-sans mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordInput('');
                    setPasswordError('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:bg-brand-bg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPassword}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-sage hover:bg-brand-sage/90 transition-all shadow-xs cursor-pointer"
                >
                  Verify Key
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          INTERACTIVE PROTOTYPE SIMULATION MODALS
          ========================================================================= */}
      <AnimatePresence>
        {activeDemoId && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-brand-border rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden"
              id="sandbox-demo-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDemoId(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] border border-brand-border/60 hover:border-brand-sage flex items-center justify-center text-brand-text hover:text-brand-sage transition-all cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>

              {activeDemoId === 'tarot' && <TarotDemo />}
              {activeDemoId === 'lumioal' && <ScenarioBuilderDemo />}
              {activeDemoId === 'teajourney' && <AnalyticsDemo />}
              {activeDemoId === 'progress' && <WellnessDemo />}
              {activeDemoId === 'ra-sim' && <RASimDemo />}
              {activeDemoId === 'reading-scaffolds' && <ReadingScaffoldsDemo />}

              <div className="border-t border-brand-border/50 pt-3 flex justify-between items-center text-[10px] font-mono text-brand-muted">
                <span>ACTIVE DEV SIMULATOR</span>
                <span className="font-sans font-bold text-brand-sage">★ Interactive L&D Prototype</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CASE STUDY IN-PLACE MODAL
          ========================================================================= */}
      <AnimatePresence>
        {activeCaseStudyModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setActiveCaseStudyModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              aria-label="Close case study overlay"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative z-10 w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] bg-brand-bg rounded-2xl sm:rounded-3xl border border-brand-border shadow-2xl flex flex-col overflow-hidden text-left"
            >
              <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-brand-border shrink-0 z-20">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    onClick={() => setActiveCaseStudyModal(null)}
                    id="pg-modal-back-btn"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg hover:bg-brand-border/60 text-brand-muted hover:text-brand-text border border-brand-border text-xs font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveCaseStudyModal(null)}
                    id="pg-modal-close-x-btn"
                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-brand-bg hover:bg-brand-border/60 text-brand-muted hover:text-brand-text text-xs font-semibold transition-all flex items-center gap-1.5 border border-brand-border shadow-2xs cursor-pointer"
                    title="Close overlay"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-3 sm:p-6 md:p-8 custom-scrollbar">
                <CaseStudyView 
                  activeProject={activeCaseStudyModal as any} 
                  isAdminMode={isAdminMode} 
                  setEditingProject={() => {}} 
                  onClose={() => setActiveCaseStudyModal(null)}
                  onUpdateCoverImage={(newImg) => {
                    const updated = updateProjectCoverImage(activeCaseStudyModal.id, newImg);
                    const refreshed = updated.find(p => p.id === activeCaseStudyModal.id);
                    if (refreshed) setActiveCaseStudyModal(refreshed);
                  }}
                  onUpdateDisplayImage={(phIdx, newImg) => {
                    const updated = updateProjectDisplayImage(activeCaseStudyModal.id, phIdx, newImg);
                    const refreshed = updated.find(p => p.id === activeCaseStudyModal.id);
                    if (refreshed) setActiveCaseStudyModal(refreshed);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          IMAGE EXPAND LIGHTBOX MODAL
          ========================================================================= */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 cursor-zoom-out select-none"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center gap-4"
              onClick={() => setLightboxImage(null)}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-10 sm:-top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-50 border border-white/10"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative bg-neutral-900/60 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-1.5 shadow-2xl">
                <img
                  src={lightboxImage}
                  alt="Expanded Mockup Preview"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[75vh] object-contain rounded-xl select-none"
                />
              </div>
              <p className="text-white/60 text-xs font-sans tracking-wide bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-xs">
                Click anywhere to close preview
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Mouse Follower Cursor (Prototypes Peach/Terracotta dot that expands into 'View' / 'Demo' / 'Details' on prototype card hover) */}
      {isCursorVisible && !activeProjectModal && !activeDemoId && !lightboxImage && (
        <motion.div
          className="fixed pointer-events-none z-50 hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            borderRadius: '9999px',
          }}
          animate={{
            width: isHoveringCard ? 68 : 14,
            height: isHoveringCard ? 68 : 14,
            backgroundColor: '#C49A8A',
            borderRadius: '9999px',
          }}
          transition={{
            type: "spring",
            damping: 24,
            stiffness: 320,
            mass: 0.3,
          }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isHoveringCard ? (
                <motion.div
                  key={`cursor-label-${cursorLabel}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center text-[10px] font-sans font-bold text-white uppercase tracking-wider select-none text-center px-1"
                >
                  <span>{cursorLabel}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="dot-core"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#FAF0EC]"
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          ADMIN FLOATING CONTROL PANEL 
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isAdminMode ? (
          <div className="bg-white/95 backdrop-blur-md border border-brand-sage/40 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-3.5 text-xs animate-fadeIn">
            <span className="flex items-center gap-1.5 text-brand-sage font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-sage animate-ping" />
              Admin Active
            </span>
            <span className="text-brand-border h-4 w-px bg-brand-border/80" />
            <button 
              onClick={handleResetAllPlaygroundDefaults}
              className="text-brand-muted hover:text-[#9C5A4C] hover:underline transition-colors cursor-pointer flex items-center gap-1 font-sans"
              title="Reset all playground customizations to default"
            >
              <RotateCcw className="w-3 h-3" /> Revert
            </button>
            <span className="text-brand-border h-4 w-px bg-brand-border/80" />
            <button 
              onClick={handleAdminLogout}
              className="text-[#9C5A4C] hover:underline font-bold font-sans cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-10 h-10 rounded-full bg-white hover:bg-brand-bg text-brand-muted hover:text-brand-sage border border-brand-border/60 shadow-md flex items-center justify-center transition-all cursor-pointer group"
            title="Admin Mode Login"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
