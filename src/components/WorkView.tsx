/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CaseStudyView } from './CaseStudyView';
import { motion, AnimatePresence } from 'motion/react';
import { compressImageFile, safeLocalStorageSet } from '../utils/imageCompressor';
import { Project, CANONICAL_PROJECTS, getLiveProjects, saveLiveProjects, EVENT_PROJECTS_UPDATED } from '../utils/projectsData';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Target, 
  Compass, 
  ArrowRight, 
  ArrowLeft,
  Clock, 
  Sparkles, 
  Star,
  Layers, 
  Search,
  CheckCircle,
  Sliders,
  Image,
  BarChart3,
  Tablet,
  Volume2,
  Map,
  CheckSquare,
  GitMerge,
  PenTool,
  HelpCircle,
  Heart,
  Flame,
  Columns,
  Presentation,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Info,
  Lock,
  Unlock,
  Edit,
  Save,
  X,
  RotateCcw,
  FileText,
  Check,
  Bookmark,
  ExternalLink,
  Video,
  ArrowUp,
  Upload,
  Camera,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export type { Project };
export const PROJECTS = CANONICAL_PROJECTS;

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

  // Pattern matches either **text** or <b>text</b> or <strong>text</strong>
  const regex = /\*\*(.*?)\*\*|<b>(.*?)<\/b>|<strong>(.*?)<\/strong>/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    // Add plain text before match
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }
    
    // The bold text can be in group 1 (**), group 2 (<b>), or group 3 (<strong>)
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

  return parts.length > 0 ? <>{parts}</> : text;
};

const DEFAULT_TYPE_FILTERS = [
  'Flagship Project',
  'Instructional Design',
  'Curriculum Design',
  'eLearning',
  'Learning & Development'
];

const DEFAULT_SKILL_FILTERS = [
  'ADDIE',
  'Needs Analysis',
  'Storyline',
  'LMS',
  'Facilitation',
  'Workshop Design',
  'Learning Evaluation'
];

export default function WorkView() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Scroll to top immediately when WorkView is visited/mounted
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Mouse follower custom cursor state
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHoveringProject, setIsHoveringProject] = useState<boolean>(false);
  const [isCursorVisible, setIsCursorVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setIsCursorVisible(false);
      setIsHoveringProject(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const [typeFilters, setTypeFilters] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio_type_filters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (!parsed.includes('Flagship Project')) {
            return ['Flagship Project', ...parsed];
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_TYPE_FILTERS;
  });

  const [skillFilters, setSkillFilters] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio_skill_filters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SKILL_FILTERS;
  });

  const [newTypeInput, setNewTypeInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddType, setShowAddType] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleDeleteType = (typeToDelete: string) => {
    const updated = typeFilters.filter(t => t !== typeToDelete);
    setTypeFilters(updated);
    localStorage.setItem('portfolio_type_filters', JSON.stringify(updated));
    if (selectedTypes.includes(typeToDelete)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeToDelete));
    }
  };

  const handleAddType = (newType: string) => {
    const trimmed = newType.trim();
    if (trimmed && !typeFilters.includes(trimmed)) {
      const updated = [...typeFilters, trimmed];
      setTypeFilters(updated);
      localStorage.setItem('portfolio_type_filters', JSON.stringify(updated));
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const updated = skillFilters.filter(s => s !== skillToDelete);
    setSkillFilters(updated);
    localStorage.setItem('portfolio_skill_filters', JSON.stringify(updated));
    if (selectedSkills.includes(skillToDelete)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillToDelete));
    }
  };

  const handleAddSkill = (newSkill: string) => {
    const trimmed = newSkill.trim();
    if (trimmed && !skillFilters.includes(trimmed)) {
      const updated = [...skillFilters, trimmed];
      setSkillFilters(updated);
      localStorage.setItem('portfolio_skill_filters', JSON.stringify(updated));
    }
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    return getLiveProjects();
  });

  useEffect(() => {
    const handleSyncProjects = () => {
      setProjects(getLiveProjects());
    };
    window.addEventListener(EVENT_PROJECTS_UPDATED, handleSyncProjects);
    window.addEventListener('storage', handleSyncProjects);
    return () => {
      window.removeEventListener(EVENT_PROJECTS_UPDATED, handleSyncProjects);
      window.removeEventListener('storage', handleSyncProjects);
    };
  }, []);

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('portfolio_admin_active') === 'true';
  });

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [editTitle, setEditTitle] = useState('');
  const [editOverview, setEditOverview] = useState('');
  const [editAudience, setEditAudience] = useState('');
  const [editChallenge, setEditChallenge] = useState('');
  const [editSolution, setEditSolution] = useState('');
  const [editImpact, setEditImpact] = useState('');
  const [editTimeline, setEditTimeline] = useState('');
  const [editOutcomeMetric, setEditOutcomeMetric] = useState('');
  const [editCardImage, setEditCardImage] = useState('');
  
  const [editMetric1Value, setEditMetric1Value] = useState('');
  const [editMetric1Label, setEditMetric1Label] = useState('');
  const [editMetric2Value, setEditMetric2Value] = useState('');
  const [editMetric2Label, setEditMetric2Label] = useState('');
  const [editMetric3Value, setEditMetric3Value] = useState('');
  const [editMetric3Label, setEditMetric3Label] = useState('');
  
  const [editNeedsAnalysis, setEditNeedsAnalysis] = useState('');
  const [editLearningObjectives, setEditLearningObjectives] = useState('');
  const [editDesignDevelopment, setEditDesignDevelopment] = useState('');
  const [editImplementation, setEditImplementation] = useState('');

  const [editDeliverables, setEditDeliverables] = useState('');
  const [editTools, setEditTools] = useState('');

  const [editPh1Title, setEditPh1Title] = useState('');
  const [editPh1Desc, setEditPh1Desc] = useState('');
  const [editPh1ImageUrl, setEditPh1ImageUrl] = useState('');
  const [editPh1ExternalUrl, setEditPh1ExternalUrl] = useState('');
  
  const [editPh2Title, setEditPh2Title] = useState('');
  const [editPh2Desc, setEditPh2Desc] = useState('');
  const [editPh2ImageUrl, setEditPh2ImageUrl] = useState('');
  const [editPh2ExternalUrl, setEditPh2ExternalUrl] = useState('');
  
  const [editPh3Title, setEditPh3Title] = useState('');
  const [editPh3Desc, setEditPh3Desc] = useState('');
  const [editPh3ImageUrl, setEditPh3ImageUrl] = useState('');
  const [editPh3ExternalUrl, setEditPh3ExternalUrl] = useState('');
  
  const [editPh4Title, setEditPh4Title] = useState('');
  const [editPh4Desc, setEditPh4Desc] = useState('');
  const [editPh4ImageUrl, setEditPh4ImageUrl] = useState('');
  const [editPh4ExternalUrl, setEditPh4ExternalUrl] = useState('');

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const [editProjectTypes, setEditProjectTypes] = useState<string[]>([]);
  const [editProjectSkills, setEditProjectSkills] = useState<string[]>([]);
  const [newProjectTypeInput, setNewProjectTypeInput] = useState('');
  const [newProjectSkillInput, setNewProjectSkillInput] = useState('');

  const [activeEditTab, setActiveEditTab] = useState<'main' | 'addie' | 'artifacts' | 'tags'>('main');

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    const saved = localStorage.getItem('selected_portfolio_project');
    if (saved) {
      localStorage.removeItem('selected_portfolio_project');
      return saved;
    }
    return null;
  });

  useEffect(() => {
    const checkSelectedProject = () => {
      const saved = localStorage.getItem('selected_portfolio_project');
      if (saved) {
        setSelectedProjectId(saved);
        localStorage.removeItem('selected_portfolio_project');
      }
    };
    checkSelectedProject();
    window.addEventListener('storage_sync_project', checkSelectedProject);
    window.addEventListener('storage', checkSelectedProject);
    return () => {
      window.removeEventListener('storage_sync_project', checkSelectedProject);
      window.removeEventListener('storage', checkSelectedProject);
    };
  }, []);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);
  const [revealedStages, setRevealedStages] = useState<Record<string, Record<number, boolean>>>({});
  
  const caseStudyRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState('summary');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Back to top button visibility
      setShowBackToTop(window.scrollY > 400);

      // 2. Active section tracking within the case study
      if (!caseStudyRef.current) return;
      const sections = ['cs-summary', 'cs-process', 'cs-displays', 'cs-outcomes'];
      let current = 'summary';
      
      const caseStudyRect = caseStudyRef.current.getBoundingClientRect();
      const caseStudyTop = caseStudyRect.top;
      
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Offset of 150px provides a highly natural transition as user scrolls
          if (rect.top <= 160) {
            current = id.replace('cs-', '');
          }
        }
      }
      setActiveSection(current);

      // 3. Scroll progress calculation specifically for the case study container
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
  }, [selectedProjectId]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`cs-${id}`);
    if (el) {
      const navbarOffset = 135; // combined height of main sticky header + sticky local sub-navbar
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Populate form fields
  useEffect(() => {
    if (editingProject) {
      setEditTitle(editingProject.title || '');
      setEditOverview(editingProject.overview || '');
      setEditAudience(editingProject.audience || '');
      setEditChallenge(editingProject.challenge || '');
      setEditSolution(editingProject.solution || '');
      setEditImpact(editingProject.impact || '');
      setEditTimeline(editingProject.timeline || '');
      setEditOutcomeMetric(editingProject.outcomeMetric || '');
      setEditCardImage(editingProject.cardImage || '');
      
      const metrics = editingProject.metricsList || [];
      setEditMetric1Value(metrics[0]?.value || '');
      setEditMetric1Label(metrics[0]?.label || '');
      setEditMetric2Value(metrics[1]?.value || '');
      setEditMetric2Label(metrics[1]?.label || '');
      setEditMetric3Value(metrics[2]?.value || '');
      setEditMetric3Label(metrics[2]?.label || '');
      
      setEditNeedsAnalysis(editingProject.process?.needsAnalysis || '');
      setEditLearningObjectives(editingProject.process?.learningObjectives || '');
      setEditDesignDevelopment(editingProject.process?.designDevelopment || '');
      setEditImplementation(editingProject.process?.implementation || '');

      setEditDeliverables((editingProject.deliverables || []).join(', '));
      setEditTools((editingProject.tools || []).join(', '));

      setEditPh1Title(editingProject.displayPlaceholders?.[0]?.title || '');
      setEditPh1Desc(editingProject.displayPlaceholders?.[0]?.description || '');
      setEditPh1ImageUrl(editingProject.displayPlaceholders?.[0]?.imageUrl || '');
      setEditPh1ExternalUrl(editingProject.displayPlaceholders?.[0]?.externalUrl || '');
      setEditPh2Title(editingProject.displayPlaceholders?.[1]?.title || '');
      setEditPh2Desc(editingProject.displayPlaceholders?.[1]?.description || '');
      setEditPh2ImageUrl(editingProject.displayPlaceholders?.[1]?.imageUrl || '');
      setEditPh2ExternalUrl(editingProject.displayPlaceholders?.[1]?.externalUrl || '');
      setEditPh3Title(editingProject.displayPlaceholders?.[2]?.title || '');
      setEditPh3Desc(editingProject.displayPlaceholders?.[2]?.description || '');
      setEditPh3ImageUrl(editingProject.displayPlaceholders?.[2]?.imageUrl || '');
      setEditPh3ExternalUrl(editingProject.displayPlaceholders?.[2]?.externalUrl || '');
      setEditPh4Title(editingProject.displayPlaceholders?.[3]?.title || '');
      setEditPh4Desc(editingProject.displayPlaceholders?.[3]?.description || '');
      setEditPh4ImageUrl(editingProject.displayPlaceholders?.[3]?.imageUrl || '');
      setEditPh4ExternalUrl(editingProject.displayPlaceholders?.[3]?.externalUrl || '');

      setEditProjectTypes(editingProject.types || []);
      setEditProjectSkills(editingProject.skills || []);
      setNewProjectTypeInput('');
      setNewProjectSkillInput('');

      setActiveEditTab('main');
    }
  }, [editingProject]);

  const handleSaveProject = () => {
    if (!editingProject) return;

    const updatedProjects = projects.map((p) => {
      if (p.id === editingProject.id) {
        return {
          ...p,
          title: editTitle,
          overview: editOverview,
          cardImage: editCardImage,
          audience: editAudience,
          challenge: editChallenge,
          solution: editSolution,
          impact: editImpact,
          timeline: editTimeline,
          outcomeMetric: editOutcomeMetric,
          metricsList: [
            { value: editMetric1Value, label: editMetric1Label },
            { value: editMetric2Value, label: editMetric2Label },
            { value: editMetric3Value, label: editMetric3Label },
          ],
          process: {
            ...p.process,
            needsAnalysis: editNeedsAnalysis,
            learningObjectives: editLearningObjectives,
            designDevelopment: editDesignDevelopment,
            implementation: editImplementation,
          },
          deliverables: editDeliverables.split(',').map(s => s.trim()).filter(Boolean),
          tools: editTools.split(',').map(s => s.trim()).filter(Boolean),
          types: editProjectTypes,
          skills: editProjectSkills,
          skillsDemonstrated: editProjectSkills,
          projectType: editProjectTypes[0] || p.projectType,
          displayPlaceholders: [
            { ...p.displayPlaceholders?.[0], title: editPh1Title, description: editPh1Desc, imageUrl: editPh1ImageUrl, externalUrl: editPh1ExternalUrl },
            { ...p.displayPlaceholders?.[1], title: editPh2Title, description: editPh2Desc, imageUrl: editPh2ImageUrl, externalUrl: editPh2ExternalUrl },
            { ...p.displayPlaceholders?.[2], title: editPh3Title, description: editPh3Desc, imageUrl: editPh3ImageUrl, externalUrl: editPh3ExternalUrl },
            { ...p.displayPlaceholders?.[3], title: editPh4Title, description: editPh4Desc, imageUrl: editPh4ImageUrl, externalUrl: editPh4ExternalUrl },
          ],
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    saveLiveProjects(updatedProjects);
    setEditingProject(null);
  };

  const handleUpdateCoverImage = (projectId: string, newImage: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, cardImage: newImage };
      }
      return p;
    });
    setProjects(updatedProjects);
    saveLiveProjects(updatedProjects);
    if (editingProject && editingProject.id === projectId) {
      setEditCardImage(newImage);
    }
  };

  const handleCoverFileUpload = async (projectId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    try {
      // Auto compress to prevent exceeding browser localStorage quota
      const compressed = await compressImageFile(file, 1400, 1000, 0.85);
      handleUpdateCoverImage(projectId, compressed);
    } catch (e) {
      console.error('Failed to process cover image:', e);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) handleUpdateCoverImage(projectId, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateDisplayImage = (projectId: string, placeholderIdx: number, newImageUrl: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const updatedPlaceholders = [...(p.displayPlaceholders || [])];
        if (updatedPlaceholders[placeholderIdx]) {
          updatedPlaceholders[placeholderIdx] = {
            ...updatedPlaceholders[placeholderIdx],
            imageUrl: newImageUrl
          };
        }
        return {
          ...p,
          displayPlaceholders: updatedPlaceholders
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    saveLiveProjects(updatedProjects);
    
    if (editingProject && editingProject.id === projectId) {
      if (placeholderIdx === 0) setEditPh1ImageUrl(newImageUrl);
      if (placeholderIdx === 1) setEditPh2ImageUrl(newImageUrl);
      if (placeholderIdx === 2) setEditPh3ImageUrl(newImageUrl);
      if (placeholderIdx === 3) setEditPh4ImageUrl(newImageUrl);
    }
  };

  const handleDisplayFileUpload = async (projectId: string, placeholderIdx: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    try {
      const compressed = await compressImageFile(file, 1400, 1000, 0.85);
      handleUpdateDisplayImage(projectId, placeholderIdx, compressed);
    } catch (e) {
      console.error('Failed to process display image:', e);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) handleUpdateDisplayImage(projectId, placeholderIdx, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    localStorage.removeItem('portfolio_admin_active');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to revert all text changes back to original defaults?')) {
      localStorage.removeItem('portfolio_projects_data');
      localStorage.removeItem('portfolio_type_filters');
      localStorage.removeItem('portfolio_skill_filters');
      setProjects(CANONICAL_PROJECTS);
      setTypeFilters(DEFAULT_TYPE_FILTERS);
      setSkillFilters(DEFAULT_SKILL_FILTERS);
      setEditingProject(null);
      window.dispatchEvent(new Event(EVENT_PROJECTS_UPDATED));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleAdminKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isBKey = e.key.toLowerCase() === 'b';
    const isMetaOrCtrl = e.metaKey || e.ctrlKey;
    if (isMetaOrCtrl && isBKey) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        e.preventDefault();
        
        const start = target.selectionStart;
        const end = target.selectionEnd;
        if (start === null || end === null) return;

        const fullText = target.value;
        const selectedText = fullText.slice(start, end);
        
        let newText: string;
        let newCursorStart: number;
        let newCursorEnd: number;

        if (selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4) {
          // Toggle bold off
          const unwrapped = selectedText.slice(2, -2);
          newText = fullText.slice(0, start) + unwrapped + fullText.slice(end);
          newCursorStart = start;
          newCursorEnd = start + unwrapped.length;
        } else {
          // Toggle bold on
          const wrapped = `**${selectedText}**`;
          newText = fullText.slice(0, start) + wrapped + fullText.slice(end);
          newCursorStart = start + 2;
          newCursorEnd = start + 2 + selectedText.length;
        }

        const prototype = target.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(target, newText);
          target.dispatchEvent(new Event('input', { bubbles: true }));
          
          requestAnimationFrame(() => {
            target.focus();
            target.setSelectionRange(newCursorStart, newCursorEnd);
          });
        }
      }
    }
  };

  // Sync selected project from other tab trigger (e.g. PlaygroundView)
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('selected_portfolio_project');
      if (saved) {
        setSelectedProjectId(saved);
        localStorage.removeItem('selected_portfolio_project');
      }
    };
    handleSync();
    window.addEventListener('storage_sync_project', handleSync);
    return () => window.removeEventListener('storage_sync_project', handleSync);
  }, []);

  // Filter projects based on BOTH Selected Types and Selected Skills
  const filteredProjects = projects.filter((project) => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.some(t => {
      if (t === 'Flagship Project') return !!project.isFlagship;
      return project.types.includes(t) || project.projectType === t;
    });
    const matchesSkill = selectedSkills.length === 0 || selectedSkills.some(s => project.skills.includes(s));
    return matchesType && matchesSkill;
  });

  // Lock background scroll and add Escape key listener when project modal layer is active
  useEffect(() => {
    if (selectedProjectId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedProjectId(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProjectId]);

  const activeProject = selectedProjectId ? (projects.find((p) => p.id === selectedProjectId) || null) : null;

  const handleTypeToggle = (type: string) => {
    if (type === 'All') {
      setSelectedTypes([]);
      setSelectedSkills([]);
      return;
    }
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const isAllActive = selectedTypes.length === 0 && selectedSkills.length === 0;

  return (
    <div className="space-y-12 animate-fadeIn pb-20">
      {/* Title Header Block */}
      <motion.section 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-4xl mx-auto text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic font-bold text-4xl sm:text-5xl md:text-6xl text-brand-text tracking-tight mt-2"
        >
          Featured <span className="text-brand-sage not-italic font-normal">Work</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-2"
        >
          Thoughtfully designed learning experiences that turn complexity into clarity and knowledge into action.
        </motion.p>
      </motion.section>

      {/* Filter-First Interactive Control Deck */}
      <motion.section 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white border border-brand-border/40 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300"
      >
        {/* Toggle Bar Header */}
        <div
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="w-full flex items-center justify-between py-3 px-4 bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/60 text-left cursor-pointer transition-all select-none"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-brand-sage" />
            <div>
              <span className="font-serif font-bold text-xs sm:text-sm text-brand-text">Filter Featured Work</span>
              <span className="font-sans text-[10px] sm:text-xs text-brand-muted block mt-0.5">
                {isAllActive 
                  ? "Click to filter experiences by role, subject matter, or skills" 
                  : `Active filters: ${[...selectedTypes, ...selectedSkills].join(', ')}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {!isAllActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTypes([]);
                  setSelectedSkills([]);
                }}
                className="font-sans text-[9px] font-bold tracking-wider text-[#9C5A4C] hover:underline cursor-pointer bg-[#FFF5F3] hover:bg-[#FFEAE5] border border-[#FDE8E1] px-2 py-0.5 rounded-md"
              >
                Reset Filters
              </button>
            )}
            <motion.div
              animate={{ rotate: isFiltersExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
            </motion.div>
          </div>
        </div>

        {/* Collapsible content section */}
        <AnimatePresence initial={false}>
          {isFiltersExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-t border-[#FAF8F5]"
            >
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Project Types Filter Row */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 pb-0.5">
                    <Layers className="w-3 h-3 text-brand-sage" />
                    <span className="font-mono text-[9px] uppercase text-brand-muted font-semibold tracking-wider">
                      Filter by Project Type
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleTypeToggle('All')}
                      id="filter-type-all"
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                        isAllActive
                          ? 'bg-brand-sage text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-brand-text border border-brand-border/60 hover:border-brand-sage'
                      }`}
                    >
                      All Projects
                    </button>
                    {typeFilters.map((type) => {
                      const isActive = selectedTypes.includes(type);
                      const isFlagshipFilter = type === 'Flagship Project';
                      return (
                        <div
                          key={type}
                          className={`inline-flex items-center rounded-full text-[11px] font-medium transition-all duration-200 overflow-hidden border ${
                            isActive
                              ? 'bg-brand-sage text-white border-brand-sage shadow-xs'
                              : 'bg-[#FAF8F5] text-brand-text border-brand-border/60 hover:border-brand-sage'
                          }`}
                        >
                          <button
                            type="button"
                            id={`filter-type-${type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => handleTypeToggle(type)}
                            className={`px-2.5 py-1 font-medium cursor-pointer focus:outline-none select-none text-left flex items-center gap-1.5 ${
                              isActive ? 'text-white' : 'text-brand-text'
                            }`}
                          >
                            {isFlagshipFilter && (
                              <Star className={`w-3 h-3 ${isActive ? 'text-white fill-white' : 'text-brand-text fill-brand-text'}`} />
                            )}
                            <span>{type}</span>
                          </button>
                          {isAdminMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteType(type);
                              }}
                              className={`px-1.5 py-1 border-l h-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer ${
                                isActive ? 'border-white/20 text-white/80 hover:text-white' : 'border-brand-border/40 text-[#9C5A4C] hover:text-[#7A3E32]'
                              }`}
                              title={`Delete ${type}`}
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {isAdminMode && (
                      <div className="inline-flex items-center">
                        {showAddType ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddType(newTypeInput);
                              setNewTypeInput('');
                              setShowAddType(false);
                            }}
                            className="flex items-center gap-1.5 bg-[#FAF8F5] border border-brand-sage rounded-full px-2 py-0.5"
                          >
                            <input
                              type="text"
                              value={newTypeInput}
                              onChange={(e) => setNewTypeInput(e.target.value)}
                              placeholder="New Type..."
                              className="bg-transparent text-[11px] text-brand-text focus:outline-none px-1 py-0.5 w-20 font-medium"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="text-brand-sage hover:text-brand-sage/80 p-0.5 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddType(false);
                                setNewTypeInput('');
                              }}
                              className="text-brand-muted hover:text-[#9C5A4C] p-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </form>
                        ) : (
                          <button
                            onClick={() => setShowAddType(true)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-bg/60 text-brand-sage border border-dashed border-brand-sage/40 hover:border-brand-sage hover:bg-brand-bg/80 transition-all cursor-pointer flex items-center gap-1"
                          >
                            + Add Type
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skill Filter Row */}
                <div className="space-y-1.5 pt-3 border-t border-[#FAF8F5]">
                  <div className="flex items-center gap-1 pb-0.5">
                    <Sparkles className="w-3 h-3 text-brand-lavender" />
                    <span className="font-mono text-[9px] uppercase text-brand-muted font-semibold tracking-wider">
                      Filter by Skill Tag
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {skillFilters.map((skill) => {
                      const isActive = selectedSkills.includes(skill);
                      return (
                        <div
                          key={skill}
                          className={`inline-flex items-center rounded-xl text-[11px] transition-all duration-200 overflow-hidden font-sans border ${
                            isActive
                              ? 'bg-brand-lavender text-white border-brand-lavender shadow-xs'
                              : 'bg-[#FAF8F5] text-brand-text border-brand-border/60 hover:border-brand-lavender'
                          }`}
                        >
                          <button
                            type="button"
                            id={`filter-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => handleSkillToggle(skill)}
                            className="px-2.5 py-1 font-sans cursor-pointer focus:outline-none select-none text-left"
                          >
                            ★ {skill}
                          </button>
                          {isAdminMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkill(skill);
                              }}
                              className={`px-1.5 py-1 border-l h-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer ${
                                isActive ? 'border-white/20 text-white/80 hover:text-white' : 'border-brand-border/40 text-[#9C5A4C] hover:text-[#7A3E32]'
                              }`}
                              title={`Delete ${skill}`}
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {isAdminMode && (
                      <div className="inline-flex items-center">
                        {showAddSkill ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddSkill(newSkillInput);
                              setNewSkillInput('');
                              setShowAddSkill(false);
                            }}
                            className="flex items-center gap-1.5 bg-[#FAF8F5] border border-brand-lavender rounded-xl px-2 py-0.5"
                          >
                            <input
                              type="text"
                              value={newSkillInput}
                              onChange={(e) => setNewSkillInput(e.target.value)}
                              placeholder="New Skill..."
                              className="bg-transparent text-[11px] text-brand-text focus:outline-none px-1 py-0.5 w-20 font-medium"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="text-brand-lavender hover:text-brand-lavender/80 p-0.5 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddSkill(false);
                                setNewSkillInput('');
                              }}
                              className="text-brand-muted hover:text-[#9C5A4C] p-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </form>
                        ) : (
                          <button
                            onClick={() => setShowAddSkill(true)}
                            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-brand-bg/60 text-brand-lavender border border-dashed border-brand-lavender/40 hover:border-brand-lavender hover:bg-brand-bg/80 transition-all cursor-pointer flex items-center gap-1"
                          >
                            + Add Skill
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Filters Clear Indicator */}
                {(!isAllActive) && (
                  <div className="flex items-center justify-between pt-3 border-t border-brand-border/20 text-[10px] sm:text-xs text-brand-muted">
                    <p>
                      Showing <span className="font-bold text-brand-text">{filteredProjects.length}</span> of {projects.length} experiences matching current filter markers
                    </p>
                    <button
                      id="clear-all-filters-expanded"
                      onClick={() => {
                        setSelectedTypes([]);
                        setSelectedSkills([]);
                      }}
                      className="font-mono text-[8px] uppercase tracking-widest text-[#9C5A4C] hover:underline font-bold font-sans cursor-pointer"
                    >
                      [ Reset Filters ]
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Projects Grid Container with motion layouts */}
      <section className="w-full">
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-12 lg:gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const isSelected = project.id === selectedProjectId;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: (index % 2) * 0.12,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  onMouseEnter={() => setIsHoveringProject(true)}
                  onMouseLeave={() => setIsHoveringProject(false)}
                  id={`project-card-${project.id}`}
                  className={`
                    group text-left transition-all duration-300 relative focus:outline-none flex flex-col justify-start cursor-pointer
                    ${isSelected ? 'opacity-100' : 'opacity-95 hover:opacity-100'}
                  `}
                >
                  {/* Admin Edit Floating Action */}
                  {isAdminMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                      }}
                      className="absolute top-4 right-4 bg-brand-sage/20 hover:bg-brand-sage/30 text-brand-sage border border-brand-sage/40 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all z-20 shadow-xs backdrop-blur-xs"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Project
                    </button>
                  )}

                  {/* Large Cover Image with 4:3 Aspect Ratio */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: (index % 2) * 0.12 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectId(project.id);
                    }}
                    className="w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl bg-[#FAF8F5] border border-brand-border/60 overflow-hidden relative flex items-center justify-center shrink-0 cursor-pointer shadow-xs group-hover:shadow-md transition-all duration-300 mb-5"
                  >
                    {project.cardImage ? (
                      <img
                        src={project.cardImage}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.fallback-box')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-box w-full h-full bg-brand-bg flex flex-col items-center justify-center p-6 text-center';
                            fallback.innerHTML = `<span class="font-serif font-bold text-base text-brand-text/75 line-clamp-2">${project.title}</span>`;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
                        <FileText className="w-10 h-10 text-brand-muted/40 mb-2" />
                        <span className="font-serif font-bold text-sm text-brand-text/75 line-clamp-2">{project.title}</span>
                      </div>
                    )}

                    {/* Admin Quick Cover Upload Action */}
                    {isAdminMode && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <label className="bg-black/85 hover:bg-black text-white px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md backdrop-blur-xs transition-all">
                          <Camera className="w-3.5 h-3.5 text-brand-sage" /> Change Cover
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleCoverFileUpload(project.id, file);
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </motion.div>

                  {/* Clean Typography Title & Index Block */}
                  <motion.div 
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: (index % 2) * 0.12 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full space-y-2"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif font-bold text-2xl sm:text-[26px] md:text-3xl text-brand-text leading-snug group-hover:text-brand-sage transition-colors">
                        {renderFormattedText(project.title)}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0 select-none">
                        {project.isFlagship && (
                          <Star 
                            className="w-4 h-4 text-[#2E4A36] fill-[#2E4A36] -mt-0.5" 
                            title="Flagship Project" 
                          />
                        )}
                        <span className="font-serif italic font-normal text-xl sm:text-2xl text-brand-muted/60">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Body Text Overview */}
                    <p className="font-sans text-sm sm:text-[15px] text-brand-muted leading-relaxed font-normal line-clamp-3 sm:line-clamp-4">
                      {project.overview}
                    </p>

                    {/* Minimalist Metadata & Skills Strip */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-2.5 text-xs text-brand-muted mt-auto">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {project.types && project.types.length > 0 && project.types.map((type) => (
                          <span 
                            key={type}
                            className="text-[11px] font-sans text-brand-text/80 font-medium bg-brand-bg border border-brand-border/70 px-2.5 py-0.5 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                        {project.skills.slice(0, 3).map((skill) => (
                          <span 
                            key={skill}
                            className="font-mono text-[9px] bg-transparent text-brand-muted border border-brand-border/60 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 3 && (
                          <span className="font-mono text-[9px] text-brand-muted/60 px-1 py-0.5">
                            +{project.skills.length - 3}
                          </span>
                        )}
                      </div>

                      {project.timeline && (
                        <div className="ml-auto shrink-0 font-mono text-xs text-brand-muted/80 font-medium">
                          {project.timeline}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-[#FAF8F3]/20 border border-dashed border-brand-border rounded-3xl">
            <Search className="w-8 h-8 text-brand-muted mx-auto mb-2 opacity-50" />
            <h4 className="font-serif text-base font-semibold text-brand-text">No matching learning experiences found</h4>
            <p className="font-sans text-xs text-brand-muted mt-1">
              Try selection of alternative skills or clear your project type filters to explore further.
            </p>
            <button
              onClick={() => {
                setSelectedTypes([]);
                setSelectedSkills([]);
              }}
              className="mt-4 px-4 py-2 bg-brand-sage text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Clear Filter Tags
            </button>
          </div>
        )}
      </section>

      {/* Modal Overlay Layer for Case Study */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            {/* Backdrop with subtle blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedProjectId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              aria-label="Close project detail overlay"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative z-10 w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] bg-brand-bg rounded-2xl sm:rounded-3xl border border-brand-border shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Sticky Top Control Header */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-brand-border shrink-0 z-20">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    id="modal-back-btn"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg hover:bg-brand-border/60 text-brand-muted hover:text-brand-text border border-brand-border text-xs font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to projects</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isAdminMode && (
                    <button
                      onClick={() => setEditingProject(activeProject)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-brand-sage bg-brand-sage/10 hover:bg-brand-sage/20 border border-brand-sage/30 transition-all cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit Text</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    id="modal-close-x-btn"
                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-brand-bg hover:bg-brand-border/60 text-brand-muted hover:text-brand-text text-xs font-semibold transition-all flex items-center gap-1.5 border border-brand-border shadow-2xs cursor-pointer"
                    title="Close overlay"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Case Study Container */}
              <div className="overflow-y-auto flex-1 p-3 sm:p-6 md:p-8 custom-scrollbar">
                <CaseStudyView 
                  activeProject={activeProject as any} 
                  isAdminMode={isAdminMode} 
                  setEditingProject={setEditingProject} 
                  onClose={() => setSelectedProjectId(null)}
                  onUpdateCoverImage={(newImg) => handleUpdateCoverImage(activeProject.id, newImg)}
                  onUpdateDisplayImage={(phIdx, newImg) => handleUpdateDisplayImage(activeProject.id, phIdx, newImg)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legacy layout disabled */}
      {false && activeProject && (
        <section ref={caseStudyRef} className="bg-white rounded-3xl border border-brand-border/75 p-5 sm:p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(114,109,104,0.05)] relative overflow-hidden max-w-5xl mx-auto transition-all duration-300">
          {/* Top aesthetic decorative color header line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-sage via-brand-blue to-brand-peach" />

          <div className="space-y-8 animate-fadeIn">

            {/* Case Study Title & Top Tags */}
            <div className="space-y-5">
              {activeProject.types && activeProject.types.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.types.map((type) => (
                    <span 
                      key={type}
                      className="text-[11px] font-sans text-brand-sage font-medium bg-[#FAF8F4] border border-brand-border px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
              
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
            </div>

            {/* Tighter two-column case study layout */}
            <div className="lg:flex lg:gap-[4%] items-start relative w-full pt-1">
              {/* Main content column (around 70% width) */}
              <div className="w-full lg:w-[70%] space-y-6 flex-grow">
                
                {/* Audience, Challenge, and Solution Grid (Fully visible, content-rich) */}
                <div id="cs-summary" className="space-y-3 scroll-mt-24">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-brand-sage rounded-full" />
                    <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Project Summary</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Audience */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4 }}
                      className="bg-gradient-to-b from-[#FFFDFB] to-[#FAF8F5]/40 border border-[#EBE5DA] rounded-2xl p-4 flex flex-col justify-between hover:border-brand-sage/30 shadow-xs hover:shadow-sm transition-all duration-300 group/card"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-brand-sage/10 text-brand-sage w-7 h-7 rounded-full flex items-center justify-center border border-brand-sage/15 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h5 className="font-sans font-bold text-xs text-brand-text group-hover/card:text-brand-sage/90 transition-colors">
                              Audience
                            </h5>
                          </div>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {renderFormattedText(activeProject.audience)}
                        </p>
                      </div>
                    </motion.div>

                    {/* Challenge */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="bg-gradient-to-b from-[#FFFDFB] to-[#FAF8F5]/40 border border-[#EBE5DA] rounded-2xl p-4 flex flex-col justify-between hover:border-brand-peach/30 shadow-xs hover:shadow-sm transition-all duration-300 group/card"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-brand-peach/10 text-brand-peach w-7 h-7 rounded-full flex items-center justify-center border border-brand-peach/15 shrink-0">
                            <Flame className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h5 className="font-sans font-bold text-xs text-brand-text group-hover/card:text-brand-peach/90 transition-colors">
                              Challenge
                            </h5>
                          </div>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {renderFormattedText(activeProject.challenge)}
                        </p>
                      </div>
                    </motion.div>

                    {/* Solution */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="bg-gradient-to-b from-[#FFFDFB] to-[#FAF8F5]/40 border border-[#EBE5DA] rounded-2xl p-4 flex flex-col justify-between hover:border-brand-blue/30 shadow-xs hover:shadow-sm transition-all duration-300 group/card"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-brand-blue/10 text-brand-blue w-7 h-7 rounded-full flex items-center justify-center border border-brand-blue/15 shrink-0">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h5 className="font-sans font-bold text-xs text-brand-text group-hover/card:text-brand-blue/90 transition-colors">
                              Solution
                            </h5>
                          </div>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {renderFormattedText(activeProject.solution)}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Analytical Process Timeline */}
                <div id="cs-process" className="pt-5 space-y-3 border-t border-brand-border/30 scroll-mt-24">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-brand-sage rounded-full" />
                    <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Instructional Process</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative">
                    {/* Stage 01: Research */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4 }}
                      className="z-10 relative bg-transparent border border-[#EBE5DA] rounded-2xl p-3.5 hover:border-brand-sage/40 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 flex flex-col justify-between group/step"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-sage/90 transition-colors">
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
                    </motion.div>

                    {/* Stage 02: Design */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="z-10 relative bg-transparent border border-[#EBE5DA] rounded-2xl p-3.5 hover:border-brand-peach/40 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 flex flex-col justify-between group/step"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-peach/90 transition-colors">
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
                    </motion.div>

                    {/* Stage 03: Development / Implementation */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="z-10 relative bg-transparent border border-[#EBE5DA] rounded-2xl p-3.5 hover:border-brand-blue/40 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 flex flex-col justify-between group/step"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-blue/90 transition-colors">
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
                    </motion.div>

                    {/* Stage 04: Reiteration */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="z-10 relative bg-transparent border border-[#EBE5DA] rounded-2xl p-3.5 hover:border-brand-lavender transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 flex flex-col justify-between group/step"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-sans font-bold text-xs text-brand-text group-hover/step:text-brand-lavender/90 transition-colors">
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
                    </motion.div>
                  </div>
                </div>

                {/* Project Displays & Visual Artifacts */}
                {(() => {
                  const visiblePlaceholders = activeProject.displayPlaceholders
                    .map((ph, idx) => ({ ...ph, originalIdx: idx }))
                    .filter((ph) => {
                      return !!ph.title?.trim();
                    });

                  if (visiblePlaceholders.length === 0) return null;

                  const gridColsClass = 
                    visiblePlaceholders.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
                    'grid-cols-1 sm:grid-cols-2';

                  return (
                    <div id="cs-displays" className="border-t border-brand-border/30 pt-5 space-y-3 scroll-mt-24">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-brand-blue rounded-full" />
                        <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Project Displays & Visual Artifacts</h4>
                      </div>
                      
                      <div className={`grid ${gridColsClass} gap-4`}>
                        {visiblePlaceholders.map((ph) => {
                          const PlaceholderIcon = IconMap[ph.icon] || Info;
                          const isLink = !!ph.externalUrl;
                          const CardComponent = isLink ? 'a' : 'div';
                          const imgKey = `${activeProject.id}_${ph.originalIdx}`;
                          const hasImageError = imageErrors[imgKey];
                          const defaultLowerUrl = `/images/${activeProject.id}_display_${ph.originalIdx + 1}.png`;
                          const currentImgUrl = (imageUrls[imgKey] || ph.imageUrl || defaultLowerUrl).replace(/^\/assets\//, '/images/');
                          
                          return (
                            <motion.div
                              key={ph.originalIdx}
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-20px" }}
                              transition={{ duration: 0.4, delay: Math.min(ph.originalIdx * 0.05, 0.15) }}
                            >
                              <CardComponent 
                                {...(isLink ? { href: ph.externalUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
                                className={`group/ph flex flex-col justify-between bg-white border border-[#EBE5DA] hover:border-brand-sage rounded-2xl p-4 min-h-[220px] transition-all duration-300 relative overflow-hidden shadow-2xs hover:shadow-sm w-full ${
                                  isLink 
                                    ? 'cursor-pointer hover:-translate-y-1' 
                                    : ''
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="font-mono text-[7px] uppercase tracking-wider text-brand-muted/70 bg-[#FAF8F4] border border-brand-border/40 px-2.5 py-0.5 rounded-md font-semibold">
                                      DISPLAY 0{ph.originalIdx + 1}
                                    </span>
                                    {isLink && (
                                      <span className="text-brand-sage text-[8px] font-mono font-bold flex items-center gap-0.5 bg-brand-sage/5 px-2 py-0.5 rounded-full border border-brand-sage/15">
                                        LIVE LINK <ExternalLink className="w-2.5 h-2.5" />
                                      </span>
                                    )}
                                  </div>

                                  {/* Visual Image / Wireframe Preview Mockup (Enlarged by ~15%: h-52 sm:h-60) */}
                                  <div className="w-full h-52 sm:h-60 rounded-xl bg-[#FAF8F5]/60 border border-brand-border/60 mb-3 overflow-hidden relative group-hover/ph:border-brand-sage/40 transition-all duration-300 flex flex-col shadow-xs group-hover/ph:shadow-sm">
                                    {!hasImageError ? (
                                      <img 
                                        src={currentImgUrl} 
                                        alt={ph.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/ph:scale-[1.03]"
                                        referrerPolicy="no-referrer"
                                        onError={() => {
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
                                            <div className="flex-1 p-2.5 flex gap-2 overflow-hidden">
                                              <div className="w-9 shrink-0 bg-white/70 border border-brand-border/30 rounded-lg p-1.5 flex flex-col gap-1.5">
                                                <div className="w-5 h-1.5 bg-brand-sage/40 rounded-sm" />
                                                <div className="space-y-1">
                                                  <div className="w-full h-0.5 bg-brand-muted/20 rounded-[1px]" />
                                                  <div className="w-9/12 h-0.5 bg-brand-muted/15 rounded-[1px]" />
                                                  <div className="w-10/12 h-0.5 bg-brand-muted/15 rounded-[1px]" />
                                                </div>
                                              </div>
                                              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                                                <div className="bg-gradient-to-r from-brand-sage/10 to-brand-peach/10 border border-[#E4E9EF] rounded-lg p-2 flex flex-col justify-between shrink-0 shadow-3xs">
                                                  <div className="font-mono text-[7px] text-brand-text font-bold truncate max-w-[100px]">
                                                    {ph.title}
                                                  </div>
                                                  <div className="w-16 h-0.5 bg-brand-muted/25 rounded-[1px] mt-1" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
                                                  <div className="bg-white/90 border border-brand-border/30 rounded-lg p-1.5 flex flex-col justify-between">
                                                    <div className="w-6 h-0.5 bg-brand-blue/30 rounded-[1px]" />
                                                    <div className="w-8 h-2 bg-brand-sage/10 rounded-sm" />
                                                  </div>
                                                  <div className="bg-white/90 border border-brand-border/30 rounded-lg p-1.5 flex flex-col justify-between">
                                                    <div className="w-6 h-0.5 bg-brand-peach/30 rounded-[1px]" />
                                                    <div className="w-8 h-2 bg-brand-peach/10 rounded-sm" />
                                                  </div>
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
                                                <div className="bg-white border border-brand-border/30 rounded-lg p-1.5 shadow-4xs max-w-[85%] flex flex-col gap-0.5">
                                                  <div className="font-mono text-[6.5px] font-bold text-brand-text truncate max-w-[110px]">{ph.title}</div>
                                                  <div className="w-24 h-0.5 bg-brand-muted/30 rounded-[1px] mt-0.5" />
                                                  <div className="w-14 h-0.5 bg-brand-muted/20 rounded-[1px]" />
                                                </div>
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
                                            <div className="flex-1 relative flex items-center justify-center bg-gradient-to-tr from-[#1E221D] via-[#2A2421] to-[#1B1D24]">
                                              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                                              <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-3xs border border-white/20 flex items-center justify-center group-hover/ph:scale-105 group-hover/ph:bg-white/15 transition-all duration-300 shadow-lg cursor-pointer">
                                                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-brand-peach border-b-[5px] border-b-transparent ml-0.5" />
                                              </div>
                                              <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-3xs px-2 py-0.5 rounded border border-white/10 text-[6px] font-mono text-white/90 uppercase tracking-widest flex items-center gap-1 font-medium scale-90">
                                                <PlaceholderIcon className="w-2 h-2 text-brand-peach animate-pulse" />
                                                {ph.title}
                                              </div>
                                            </div>
                                            <div className="px-3 py-1.5 bg-[#2B2724] border-t border-white/5 flex items-center gap-2 shrink-0">
                                              <div className="w-2 h-2 bg-white/80 rounded-sm shrink-0" />
                                              <div className="flex-grow h-1 bg-white/20 rounded-full overflow-hidden relative">
                                                <div className="absolute top-0 left-0 w-[55%] h-full bg-brand-peach rounded-full" />
                                              </div>
                                              <span className="font-mono text-[5.5px] text-white/60 shrink-0 scale-90">03:42 / 06:15</span>
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
                                            <div className="flex-1 p-2.5 flex flex-col justify-between gap-1 overflow-hidden">
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
                                        <div className="absolute bottom-2 left-2 right-2 border-t border-dashed border-brand-border/60 pt-1 text-center shrink-0 z-10 bg-white/95 backdrop-blur-3xs rounded-md shadow-3xs p-1">
                                          <span className="font-mono text-[7px] font-bold text-brand-muted/80 block">
                                            <span className="uppercase text-brand-sage">📷 Add Pic:</span> /public/images/{activeProject.id}_display_{ph.originalIdx + 1}.png
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Strengthened artifact card titles (text-base font-extrabold) */}
                                  <div className="space-y-1 mt-1">
                                    <h5 className="font-serif font-extrabold text-base text-brand-text group-hover/ph:text-brand-sage transition-colors leading-snug">
                                      {renderFormattedText(ph.title)}
                                    </h5>
                                  </div>
                                </div>

                                {/* Clickable active link design */}
                                <div className="border-t border-[#EBE5DA]/30 pt-3.5 mt-4 flex items-center justify-between">
                                  <span className={`font-mono text-[9px] uppercase tracking-wider font-extrabold transition-colors flex items-center gap-1 ${
                                    isLink 
                                      ? 'text-brand-sage group-hover/ph:text-brand-text group-hover/ph:underline' 
                                      : 'text-brand-sage group-hover/ph:text-brand-text group-hover/ph:underline cursor-pointer'
                                  }`}>
                                    {isLink ? (
                                      <>Launch Project Link <ExternalLink className="w-3 h-3" /></>
                                    ) : (
                                      'View Image Artifact'
                                    )}
                                  </span>
                                  <div className="w-6 h-6 rounded-full bg-brand-sage/5 flex items-center justify-center text-brand-sage group-hover/ph:bg-brand-sage group-hover/ph:text-white transition-all duration-300">
                                    <ChevronRight className="w-3.5 h-3.5 group-hover/ph:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </CardComponent>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Deliverables & Outcomes section */}
                {(() => {
                  const validMetrics = activeProject.metricsList ? activeProject.metricsList.filter(m => m.value && m.value.trim() !== '') : [];
                  const hasImpact = validMetrics.length > 0 || !!(activeProject.outcomeMetric && activeProject.outcomeMetric.trim() !== '');

                  return (
                    <div id="cs-outcomes" className="border-t border-brand-border/30 pt-5 space-y-3 scroll-mt-24">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-brand-peach rounded-full" />
                        <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Outcomes & Deliverables</h4>
                      </div>
                      
                      <div className={`grid grid-cols-1 ${hasImpact ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                        {/* Deliverables Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20px" }}
                          transition={{ duration: 0.4 }}
                          className="bg-white border border-[#EBE5DA] hover:border-brand-sage/50 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-brand-sage/10 text-brand-sage">
                                <CheckSquare className="w-4 h-4" />
                              </div>
                              <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Deliverables</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {activeProject.deliverables.map((del, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2 bg-[#FAF8F5]/70 hover:bg-[#FAF8F5] p-2.5 rounded-xl border border-brand-border/40 hover:border-brand-sage/40 transition-all">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage shrink-0 mt-0.5" />
                                  <span className="font-sans text-sm text-brand-text font-medium leading-tight">{del}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Impact Card */}
                        {hasImpact && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="bg-white border border-[#EBE5DA] hover:border-brand-sage/50 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group/impact min-h-[160px]"
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-sage/5 blur-xl group-hover/impact:bg-brand-sage/10 transition-all duration-300" />
                            
                            <div className="flex items-center gap-2 relative z-10">
                              <div className="p-1.5 rounded-lg bg-brand-sage/15 text-brand-sage">
                                <Award className="w-4 h-4" />
                              </div>
                              <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Impact & Evaluation</h4>
                            </div>
                            
                            <div className="flex-1 flex flex-col mt-3 relative z-10">
                              {validMetrics.length > 0 ? (
                                <div className={`grid gap-2 items-stretch w-full flex-1 ${
                                  validMetrics.length === 1 ? 'grid-cols-1' :
                                  validMetrics.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                                  'grid-cols-1 sm:grid-cols-3'
                                }`}>
                                  {validMetrics.map((m, mIdx) => (
                                    <div key={mIdx} className="bg-[#FAF8F5]/70 border border-brand-border/40 p-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-3xs transition-all duration-300 hover:border-brand-sage/50 hover:bg-white hover:-translate-y-0.5 h-full">
                                      <span className="font-serif font-extrabold text-xl text-brand-sage leading-none">
                                        {m.value}
                                      </span>
                                      <span className="font-sans text-[9.5px] text-brand-muted font-medium mt-1 leading-tight">
                                        {m.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : activeProject.outcomeMetric ? (
                                <div className="w-20 h-20 rounded-xl bg-[#FAF8F5]/70 border border-brand-border/40 flex flex-col items-center justify-center shrink-0 p-1.5 text-center shadow-3xs">
                                  <span className="font-serif font-bold text-[19px] text-brand-sage leading-none">
                                    {activeProject.outcomeMetric.split(' ')[0]}
                                  </span>
                                  <span className="font-sans text-[9px] text-brand-muted font-medium mt-1.5 leading-tight">
                                    {activeProject.outcomeMetric.split(' ').slice(1).join(' ') || 'Metric'}
                                  </span>
                                </div>
                              ) : null}

                              {activeProject.impact && activeProject.impact.trim() !== '' && (
                                <p className="font-sans text-xs text-brand-muted leading-relaxed pt-2.5 mt-2.5 border-t border-brand-border/40">
                                  {renderFormattedText(activeProject.impact)}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Tools Used section */}
                <div id="cs-tools" className="border-t border-brand-border/30 pt-5 space-y-3 scroll-mt-24">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-brand-blue rounded-full" />
                    <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Tools Used</h4>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-[#EBE5DA] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all duration-300"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.tools.map((tool, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="font-sans text-xs font-semibold bg-[#FAF8F5] text-brand-text border border-brand-border px-3 py-1 rounded-lg hover:border-brand-blue/30 hover:bg-white hover:-translate-y-0.5 transition-all duration-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Skills Demonstrated section */}
                <div id="cs-skills" className="border-t border-brand-border/30 pt-5 space-y-3 scroll-mt-24">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-brand-lavender rounded-full" />
                    <h4 className="font-mono text-xs uppercase text-brand-text font-bold tracking-wider">Skills Demonstrated</h4>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-[#EBE5DA] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all duration-300"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {(activeProject.skillsDemonstrated || activeProject.skills).map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="font-mono text-[9.5px] font-bold bg-[#FAF8F5] text-brand-muted border border-brand-border px-2.5 py-1 rounded-md uppercase tracking-wider"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

              </div>

              {/* Sticky Right Sidebar (around 26% width) */}
              <div className="w-full lg:w-[26%] lg:sticky lg:top-[95px] space-y-5 shrink-0 mt-8 lg:mt-0 self-start z-10">
                
                {/* On This Page Navigation Module */}
                <div className="bg-[#FFFDFB] border border-brand-border/60 rounded-2xl p-4 shadow-3xs">
                  <h5 className="font-mono text-[10px] uppercase text-brand-muted tracking-wider font-extrabold mb-3">On This Page</h5>
                  <div className="relative pl-4">
                    {/* Thin vertical scroll progress line */}
                    <div className="absolute left-[3px] top-1 bottom-1 w-0.5 bg-brand-border/20 rounded-full" />
                    <div 
                      className="absolute left-[3px] top-1 w-0.5 bg-brand-sage rounded-full transition-all duration-150 origin-top"
                      style={{ height: `${scrollProgress * 95}%` }}
                    />
                    
                    <div className="space-y-2.5">
                      {[
                        { id: 'summary', label: 'Summary' },
                        { id: 'process', label: 'Process' },
                        { id: 'displays', label: 'Artifacts' },
                        { id: 'outcomes', label: 'Outcomes' },
                        { id: 'tools', label: 'Tools' },
                        { id: 'skills', label: 'Skills' }
                      ].map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`block text-left text-xs font-sans transition-all duration-200 cursor-pointer ${
                              isActive 
                                ? 'text-brand-text font-extrabold scale-[1.02] pl-1' 
                                : 'text-brand-muted hover:text-brand-text font-medium'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Impact Snapshot Module */}
                {activeProject.metricsList && activeProject.metricsList.length > 0 && (
                  <div className="bg-[#FFFDFB] border border-brand-border/60 rounded-2xl p-4 shadow-3xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-brand-peach/5 blur-md" />
                    <h5 className="font-mono text-[10px] uppercase text-brand-text tracking-wider font-extrabold mb-3 flex items-center gap-1.5 relative z-10">
                      <Award className="w-3.5 h-3.5 text-brand-peach" /> Impact Snapshot
                    </h5>
                    <div className="space-y-3 relative z-10">
                      {activeProject.metricsList.map((metric, idx) => (
                        <div key={idx} className="bg-[#FCFAF7]/50 border border-brand-border/40 p-2.5 rounded-xl text-center shadow-3xs">
                          <div className="font-serif font-extrabold text-xl text-brand-peach leading-none">
                            {metric.value}
                          </div>
                          <div className="font-sans text-[9.5px] text-brand-muted font-medium mt-1 leading-tight">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Role Module */}
                <div className="bg-[#FFFDFB] border border-brand-border/60 rounded-2xl p-4 shadow-3xs">
                  <h5 className="font-mono text-[10px] uppercase text-brand-muted tracking-wider font-extrabold mb-3">Project Role</h5>
                  <div className="space-y-2">
                    {(() => {
                      let bullets = [
                        'LMS Content Management',
                        'Learning Pathway Design',
                        'Content Curation',
                        'Competitive Product Analysis'
                      ];
                      if (activeProject.id === 'ra-training') {
                        bullets = [
                          'Crisis Response Research',
                          'Branching Scenario Design',
                          'High-Fidelity Prototyping',
                          'Usability Evaluation'
                        ];
                      } else if (activeProject.id === 'fsr-product-knowledge') {
                        bullets = [
                          'Blended Pathway Architecture',
                          'Technical SME Interviews',
                          'Interactive Simulator Authoring',
                          'Kirkpatrick Evaluation Modeling'
                        ];
                      } else if (activeProject.id === 'columbia-wellness') {
                        bullets = [
                          'Needs Analysis',
                          'Multimedia Brand Scaling',
                          'Interactive Workshops',
                          'Voluntary Feedback Loop'
                        ];
                      } else if (activeProject.id === 'mentor-promise' || activeProject.id === 'mentor-a-promise') {
                        bullets = [
                          'SEL Competency Mapping',
                          'Arts-Based Curriculum',
                          'Coaching Operational Guides',
                          'Qualitative Feedback'
                        ];
                      } else if (activeProject.id === 'cognitive-load') {
                        bullets = [
                          'Administrative Message Auditing',
                          'Communication Standards Design',
                          'Job-Aid Layout Formatting',
                          'Cohort Training Facilitation'
                        ];
                      }
                      return bullets.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-sans font-medium text-brand-text leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-sage/80 shrink-0 mt-1.5" />
                          <span>{b}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Quick Actions Module */}
                <div className="bg-[#FFFDFB] border border-brand-border/60 rounded-2xl p-4 shadow-3xs space-y-2">
                  <h5 className="font-mono text-[10px] uppercase text-brand-muted tracking-wider font-extrabold mb-1">Quick Actions</h5>
                  <button
                    onClick={() => scrollToSection('displays')}
                    className="w-full py-2 bg-brand-sage hover:bg-[#8EA288] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-3xs hover:shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" /> View Artifacts
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full py-2 bg-white hover:bg-[#FAF8F5] text-brand-text border border-brand-border/80 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-3xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowUp className="w-3.5 h-3.5" /> Back to Top
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#FFFDFB]/95 backdrop-blur-md border border-brand-border text-brand-sage hover:text-white hover:bg-brand-sage shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center group"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

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
              onClick={handleResetToDefaults}
              className="text-brand-muted hover:text-[#9C5A4C] hover:underline transition-colors cursor-pointer flex items-center gap-1 font-sans"
              title="Reset all texts to default"
            >
              <RotateCcw className="w-3 h-3" /> Revert
            </button>
            <span className="text-brand-border h-4 w-px bg-brand-border/80" />
            <button 
              onClick={handleLogout}
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

      {/* ==========================================
          PASSWORD MODAL 
          ========================================== */}
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
                  Enter the administrator password to enable live editing of the portfolio texts.
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
                        if (passwordInput === '030226') {
                          setIsAdminMode(true);
                          localStorage.setItem('portfolio_admin_active', 'true');
                          setShowPasswordModal(false);
                          setPasswordInput('');
                          setPasswordError('');
                        } else {
                          setPasswordError('Invalid credentials.');
                        }
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
                  onClick={() => {
                    if (passwordInput === '030226') {
                      setIsAdminMode(true);
                      localStorage.setItem('portfolio_admin_active', 'true');
                      setShowPasswordModal(false);
                      setPasswordInput('');
                      setPasswordError('');
                    } else {
                      setPasswordError('Invalid credentials.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-sage hover:bg-brand-sage/90 transition-all shadow-xs cursor-pointer"
                >
                  Verify Key
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          STRUCTURED CONTENT EDITOR MODAL 
          ========================================== */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              onKeyDown={handleAdminKeyDown}
              className="bg-white rounded-[32px] border border-brand-border shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col my-8 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-brand-border/40 flex items-center justify-between bg-[#FAF8F5]/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-sage/10 text-brand-sage flex items-center justify-center">
                    <FileText className="w-5 h-5 text-brand-sage" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-text">Edit Case Study Text</h3>
                    <p className="text-[10px] font-sans text-brand-muted mt-0.5">Editing: {editingProject.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-brand-muted hover:text-brand-text cursor-pointer p-1.5 rounded-full hover:bg-brand-bg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-brand-border/30 bg-[#FAF8F5]/20 font-sans text-xs font-medium">
                <button
                  onClick={() => setActiveEditTab('main')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                    activeEditTab === 'main'
                      ? 'border-brand-sage text-brand-sage font-semibold bg-white'
                      : 'border-transparent text-brand-muted hover:text-brand-text hover:bg-brand-bg/40'
                  }`}
                >
                  1. Basic Details
                </button>
                <button
                  onClick={() => setActiveEditTab('addie')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                    activeEditTab === 'addie'
                      ? 'border-brand-sage text-brand-sage font-semibold bg-white'
                      : 'border-transparent text-brand-muted hover:text-brand-text hover:bg-brand-bg/40'
                  }`}
                >
                  2. Process Stages
                </button>
                <button
                  onClick={() => setActiveEditTab('artifacts')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                    activeEditTab === 'artifacts'
                      ? 'border-brand-sage text-brand-sage font-semibold bg-white'
                      : 'border-transparent text-brand-muted hover:text-brand-text hover:bg-brand-bg/40'
                  }`}
                >
                  3. Artifacts & Displays
                </button>
                <button
                  onClick={() => setActiveEditTab('tags')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                    activeEditTab === 'tags'
                      ? 'border-brand-sage text-brand-sage font-semibold bg-white'
                      : 'border-transparent text-brand-muted hover:text-brand-text hover:bg-brand-bg/40'
                  }`}
                >
                  4. Project Tags
                </button>
              </div>

              {/* Scrollable Content Fields Area */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 max-h-[55vh] text-left font-sans">
                {/* Text Formatting / Bolding Help Tip */}
                <div className="bg-[#FAF8F5] border border-[#EBE5DA] rounded-2xl p-3.5 flex items-start gap-2.5 text-brand-muted shrink-0">
                  <span className="text-base shrink-0 mt-0.5">💡</span>
                  <div className="space-y-1">
                    <span className="font-sans font-bold text-xs text-brand-text block">Text Formatting & Bolding Guide</span>
                    <span className="font-sans text-[11px] leading-relaxed block">
                      Any field below supports live formatting! Simply highlight any text and press <kbd className="px-1.5 py-0.5 bg-white border border-brand-border rounded font-mono text-[9px] font-bold text-brand-text">Cmd+B</kbd> (or <kbd className="px-1.5 py-0.5 bg-white border border-brand-border rounded font-mono text-[9px] font-bold text-brand-text">Ctrl+B</kbd>) to automatically bold key terms, or type <code>**your bold text**</code>.
                    </span>
                  </div>
                </div>

                {activeEditTab === 'main' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Project Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Timeline</label>
                        <input
                          type="text"
                          value={editTimeline}
                          onChange={(e) => setEditTimeline(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Overview Quote</label>
                        <textarea
                          rows={2}
                          value={editOverview}
                          onChange={(e) => setEditOverview(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Outcome Metric</label>
                        <input
                          type="text"
                          value={editOutcomeMetric}
                          onChange={(e) => setEditOutcomeMetric(e.target.value)}
                          placeholder="e.g. 95% Confident"
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text"
                        />
                      </div>
                    </div>

                    {/* Cover Mockup Page & Image Manager */}
                    <div className="bg-[#FAF8F5]/60 border border-brand-border/60 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-sage font-bold flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-brand-sage" /> Cover Page Mockup Image (Card & Case Study Hero)
                        </label>
                        {editCardImage && (
                          <button
                            type="button"
                            onClick={() => setEditCardImage('')}
                            className="text-red-500 hover:text-red-600 font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Cover
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Live Cover Preview Thumbnail */}
                        <div className="w-full sm:w-44 aspect-[3/2] rounded-xl bg-white border border-brand-border/80 overflow-hidden relative flex items-center justify-center shrink-0 shadow-inner group/prev">
                          {editCardImage ? (
                            <img
                              src={editCardImage}
                              alt="Cover Preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-brand-muted/50">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-60" />
                              <span className="text-[10px] font-mono block">No Cover</span>
                            </div>
                          )}
                        </div>

                        {/* Upload & URL Controls */}
                        <div className="flex-1 space-y-2.5 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-3.5 py-1.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                              <Upload className="w-3.5 h-3.5" /> Upload File from Computer
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (!file.type.startsWith('image/')) {
                                      alert('Please select an image file');
                                      return;
                                    }
                                    try {
                                      const compressed = await compressImageFile(file, 1400, 1000, 0.85);
                                      setEditCardImage(compressed);
                                    } catch {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const res = ev.target?.result as string;
                                        if (res) setEditCardImage(res);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                  e.target.value = '';
                                }}
                              />
                            </label>
                            <span className="text-[10px] font-mono text-brand-muted">or paste file URL below</span>
                          </div>

                          <input
                            type="text"
                            value={editCardImage}
                            onChange={(e) => setEditCardImage(e.target.value)}
                            placeholder="e.g. /images/ra-training_cover.jpg or https://..."
                            className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text font-medium bg-white"
                          />
                          <p className="text-[10px] font-mono text-brand-muted/80">
                            Recommended ratio: 3:2 or 16:9. Supports PNG, JPG, WebP, SVG, and Data URLs.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Audience</label>
                      <textarea
                        rows={2}
                        value={editAudience}
                        onChange={(e) => setEditAudience(e.target.value)}
                        className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Challenge</label>
                        <textarea
                          rows={3}
                          value={editChallenge}
                          onChange={(e) => setEditChallenge(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Solution</label>
                        <textarea
                          rows={3}
                          value={editSolution}
                          onChange={(e) => setEditSolution(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Impact Highlights (Three Metric Cards) */}
                    <div className="pt-4 border-t border-brand-border/40 space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🎯</span>
                        <span className="font-sans font-bold text-xs text-brand-text">Impact Highlights (Three Metric Cards)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Metric 1 */}
                        <div className="bg-[#FAF8F5]/50 border border-brand-border/60 p-3.5 rounded-2xl space-y-3">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-peach font-bold block">Card 1</span>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[8px] uppercase tracking-wider text-brand-muted font-bold block">Percentage / Value</label>
                            <input
                              type="text"
                              value={editMetric1Value}
                              onChange={(e) => setEditMetric1Value(e.target.value)}
                              placeholder="e.g., 15%"
                              className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs bg-white focus:outline-none focus:border-brand-sage"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[8px] uppercase tracking-wider text-brand-muted font-bold block">Label / Text That Follows</label>
                            <input
                              type="text"
                              value={editMetric1Label}
                              onChange={(e) => setEditMetric1Label(e.target.value)}
                              placeholder="e.g., Engagement Increase"
                              className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs bg-white focus:outline-none focus:border-brand-sage"
                            />
                          </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-[#FAF8F5]/50 border border-brand-border/60 p-3.5 rounded-2xl space-y-3">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-peach font-bold block">Card 2</span>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[8px] uppercase tracking-wider text-brand-muted font-bold block">Percentage / Value</label>
                            <input
                              type="text"
                              value={editMetric2Value}
                              onChange={(e) => setEditMetric2Value(e.target.value)}
                              placeholder="e.g., 95%"
                              className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs bg-white focus:outline-none focus:border-brand-sage"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[8px] uppercase tracking-wider text-brand-muted font-bold block">Label / Text That Follows</label>
                            <input
                              type="text"
                              value={editMetric2Label}
                              onChange={(e) => setEditMetric2Label(e.target.value)}
                              placeholder="e.g., Rated Experience 5/5"
                              className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs bg-white focus:outline-none focus:border-brand-sage"
                            />
                          </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-[#FAF8F5]/50 border border-brand-border/60 p-3.5 rounded-2xl space-y-3">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-peach font-bold block">Card 3</span>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[8px] uppercase tracking-wider text-brand-muted font-bold block">Percentage / Value</label>
                            <input
                              type="text"
                              value={editMetric3Value}
                              onChange={(e) => setEditMetric3Value(e.target.value)}
                              placeholder="e.g., 2.4x"
                              className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs bg-white focus:outline-none focus:border-brand-sage"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[8px] uppercase tracking-wider text-brand-muted font-bold block">Label / Text That Follows</label>
                            <input
                              type="text"
                              value={editMetric3Label}
                              onChange={(e) => setEditMetric3Label(e.target.value)}
                              placeholder="e.g., Safety Confidence"
                              className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs bg-white focus:outline-none focus:border-brand-sage"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeEditTab === 'addie' && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-sans text-brand-muted italic pb-1">
                      Edit details mapping the instructional design process milestones:
                    </p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-sage font-bold block">Stage 01: Research (Needs Analysis)</label>
                        <textarea
                          rows={2}
                          value={editNeedsAnalysis}
                          onChange={(e) => setEditNeedsAnalysis(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#9C5A4C] font-bold block">Stage 02: Design (Learning Experience Design)</label>
                        <textarea
                          rows={2}
                          value={editLearningObjectives}
                          onChange={(e) => setEditLearningObjectives(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#4C6285] font-bold block">Stage 03: Implementation (Website Development)</label>
                        <textarea
                          rows={2}
                          value={editDesignDevelopment}
                          onChange={(e) => setEditDesignDevelopment(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#8A7A6E] font-bold block">Stage 04: Reiteration (Evaluation & Refinement)</label>
                        <textarea
                          rows={2}
                          value={editImplementation}
                          onChange={(e) => setEditImplementation(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeEditTab === 'artifacts' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Deliverables (Comma separated)</label>
                        <input
                          type="text"
                          value={editDeliverables}
                          onChange={(e) => setEditDeliverables(e.target.value)}
                          placeholder="e.g. Activity, Slide, Facilitator Guide"
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold">Tools Used (Comma separated)</label>
                        <input
                          type="text"
                          value={editTools}
                          onChange={(e) => setEditTools(e.target.value)}
                          placeholder="e.g. Figma, Miro, Google Sites"
                          className="w-full px-3 py-2 border border-brand-border rounded-xl focus:border-brand-sage focus:outline-none text-xs text-brand-text"
                        />
                      </div>
                    </div>

                    <div className="border-t border-brand-border/30 pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-brand-text">Display Box Visual Artifacts & Mockups</h4>
                          <p className="text-[11px] text-brand-muted mt-0.5 font-sans">
                            Upload high-res images directly from your computer or provide URLs for each artifact display box.
                          </p>
                        </div>
                      </div>
                      
                      {/* Display Boxes Grid (1, 2, 3, 4) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            idx: 0,
                            title: editPh1Title,
                            setTitle: setEditPh1Title,
                            desc: editPh1Desc,
                            setDesc: setEditPh1Desc,
                            imageUrl: editPh1ImageUrl,
                            setImageUrl: setEditPh1ImageUrl,
                            extUrl: editPh1ExternalUrl,
                            setExtUrl: setEditPh1ExternalUrl
                          },
                          {
                            idx: 1,
                            title: editPh2Title,
                            setTitle: setEditPh2Title,
                            desc: editPh2Desc,
                            setDesc: setEditPh2Desc,
                            imageUrl: editPh2ImageUrl,
                            setImageUrl: setEditPh2ImageUrl,
                            extUrl: editPh2ExternalUrl,
                            setExtUrl: setEditPh2ExternalUrl
                          },
                          {
                            idx: 2,
                            title: editPh3Title,
                            setTitle: setEditPh3Title,
                            desc: editPh3Desc,
                            setDesc: setEditPh3Desc,
                            imageUrl: editPh3ImageUrl,
                            setImageUrl: setEditPh3ImageUrl,
                            extUrl: editPh3ExternalUrl,
                            setExtUrl: setEditPh3ExternalUrl
                          },
                          {
                            idx: 3,
                            title: editPh4Title,
                            setTitle: setEditPh4Title,
                            desc: editPh4Desc,
                            setDesc: setEditPh4Desc,
                            imageUrl: editPh4ImageUrl,
                            setImageUrl: setEditPh4ImageUrl,
                            extUrl: editPh4ExternalUrl,
                            setExtUrl: setEditPh4ExternalUrl
                          }
                        ].map((box) => {
                          const hasImg = !!box.imageUrl && box.imageUrl.trim() !== '';
                          const fallbackUrl = editingProject ? `/images/${editingProject.id}_display_${box.idx + 1}.png` : '';
                          const displaySrc = box.imageUrl || fallbackUrl;
                          
                          return (
                            <div key={box.idx} className="bg-[#FAF8F5]/60 border border-brand-border/60 p-3.5 rounded-2xl space-y-2.5 shadow-3xs flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[8px] tracking-wide text-brand-sage font-bold uppercase bg-white border border-brand-border/60 px-2 py-0.5 rounded-md">
                                    Display Box 0{box.idx + 1}
                                  </span>
                                  {hasImg && (
                                    <span className="font-mono text-[7.5px] font-bold text-brand-sage flex items-center gap-0.5">
                                      <Check className="w-2.5 h-2.5" /> Custom Image Set
                                    </span>
                                  )}
                                </div>

                                {/* Image Preview & Direct Upload Area */}
                                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-brand-border/50">
                                  <div className="w-16 h-12 rounded-lg bg-[#FAF8F5] border border-brand-border/60 overflow-hidden relative shrink-0 flex items-center justify-center">
                                    <img 
                                      src={displaySrc} 
                                      alt={`Display ${box.idx + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                    <ImageIcon className="w-4 h-4 text-brand-muted/40 absolute" />
                                  </div>

                                  <div className="flex-1 space-y-1.5 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono text-white bg-brand-sage hover:bg-brand-sage/90 cursor-pointer shadow-3xs transition-all shrink-0">
                                        <Upload className="w-3 h-3" /> Upload Pic
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              if (!file.type.startsWith('image/')) {
                                                alert('Please select a valid image file');
                                                return;
                                              }
                                              try {
                                                const compressed = await compressImageFile(file, 1400, 1000, 0.85);
                                                box.setImageUrl(compressed);
                                              } catch {
                                                const reader = new FileReader();
                                                reader.onload = (re) => {
                                                  const result = re.target?.result as string;
                                                  if (result) {
                                                    box.setImageUrl(result);
                                                  }
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }
                                            e.target.value = '';
                                          }}
                                        />
                                      </label>
                                      {hasImg && (
                                        <button
                                          type="button"
                                          onClick={() => box.setImageUrl('')}
                                          className="px-2 py-1 rounded-lg text-[10px] font-bold font-mono text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                                          title="Remove Image"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Or paste image URL / path"
                                      value={box.imageUrl}
                                      onChange={(e) => box.setImageUrl(e.target.value)}
                                      className="w-full px-2 py-0.5 border border-brand-border/60 rounded-md text-[9px] bg-[#FAF8F5] focus:outline-none focus:border-brand-sage truncate"
                                    />
                                  </div>
                                </div>

                                <input
                                  type="text"
                                  placeholder="Title"
                                  value={box.title}
                                  onChange={(e) => box.setTitle(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs font-serif font-semibold bg-white focus:outline-none focus:border-brand-sage"
                                />
                                <textarea
                                  rows={2}
                                  placeholder="Brief description"
                                  value={box.desc}
                                  onChange={(e) => box.setDesc(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-[11px] bg-white focus:outline-none focus:border-brand-sage leading-relaxed"
                                />
                                <input
                                  type="text"
                                  placeholder="Optional Custom Link / PDF / Google Drive URL"
                                  value={box.extUrl}
                                  onChange={(e) => box.setExtUrl(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-[10px] bg-white focus:outline-none focus:border-brand-sage placeholder:text-brand-muted/70"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeEditTab === 'tags' && (
                  <div className="space-y-6">
                    {/* Project Types Section */}
                    <div className="bg-[#FAF8F5]/50 border border-brand-border/60 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-brand-text">Project Type Tags Attached</h4>
                        <p className="text-[11px] text-brand-muted mt-0.5 font-sans">
                          These categorize which high-level category tabs this case study appears in.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {editProjectTypes.length === 0 ? (
                          <span className="text-xs text-brand-muted italic font-sans">No project types attached yet.</span>
                        ) : (
                          editProjectTypes.map((type) => (
                            <div
                              key={type}
                              className="inline-flex items-center gap-1.5 bg-[#FAF8F5] text-brand-text border border-brand-sage/60 px-3 py-1.5 rounded-full text-xs font-semibold"
                            >
                              <span>{type}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditProjectTypes(editProjectTypes.filter(t => t !== type));
                                }}
                                className="text-[#9C5A4C] hover:text-[#7A3E32] transition-colors p-0.5 hover:bg-black/5 rounded cursor-pointer"
                                title={`Remove ${type}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 items-center">
                        <div className="flex items-center gap-1.5 bg-white border border-brand-border rounded-xl px-2.5 py-1.5 flex-1 min-w-[200px]">
                          <input
                            type="text"
                            value={newProjectTypeInput}
                            onChange={(e) => setNewProjectTypeInput(e.target.value)}
                            placeholder="Add a new custom project type..."
                            className="bg-transparent text-xs text-brand-text focus:outline-none w-full font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = newProjectTypeInput.trim();
                                if (trimmed && !editProjectTypes.includes(trimmed)) {
                                  setEditProjectTypes([...editProjectTypes, trimmed]);
                                  setNewProjectTypeInput('');
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = newProjectTypeInput.trim();
                              if (trimmed && !editProjectTypes.includes(trimmed)) {
                                setEditProjectTypes([...editProjectTypes, trimmed]);
                                setNewProjectTypeInput('');
                              }
                            }}
                            className="text-brand-sage hover:text-brand-sage/80 text-xs font-bold font-sans cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            + Add Tag
                          </button>
                        </div>
                      </div>

                      {/* Small list of global types for easy single-click addition */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">Quick Add From Global Types:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {typeFilters.map((globalType) => {
                            const isAttached = editProjectTypes.includes(globalType);
                            return (
                              <button
                                key={globalType}
                                type="button"
                                disabled={isAttached}
                                onClick={() => {
                                  setEditProjectTypes([...editProjectTypes, globalType]);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                                  isAttached
                                    ? 'bg-brand-bg text-brand-muted/50 border border-brand-border/40 cursor-not-allowed'
                                    : 'bg-white text-brand-text border border-brand-border/60 hover:border-brand-sage hover:text-brand-sage cursor-pointer'
                                }`}
                              >
                                {globalType}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Skill Tags Section */}
                    <div className="bg-[#FAF8F5]/50 border border-brand-border/60 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-brand-text">Skill Tags Attached</h4>
                        <p className="text-[11px] text-brand-muted mt-0.5 font-sans">
                          These categorize which active skill filters this case study corresponds to.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {editProjectSkills.length === 0 ? (
                          <span className="text-xs text-brand-muted italic font-sans">No skills attached yet.</span>
                        ) : (
                          editProjectSkills.map((skill) => (
                            <div
                              key={skill}
                              className="inline-flex items-center gap-1.5 bg-white text-brand-text border border-brand-lavender/60 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            >
                              <span>★ {skill}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditProjectSkills(editProjectSkills.filter(s => s !== skill));
                                }}
                                className="text-[#9C5A4C] hover:text-[#7A3E32] transition-colors p-0.5 hover:bg-black/5 rounded cursor-pointer"
                                title={`Remove ${skill}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 items-center">
                        <div className="flex items-center gap-1.5 bg-white border border-brand-border rounded-xl px-2.5 py-1.5 flex-1 min-w-[200px]">
                          <input
                            type="text"
                            value={newProjectSkillInput}
                            onChange={(e) => setNewProjectSkillInput(e.target.value)}
                            placeholder="Add a new custom skill..."
                            className="bg-transparent text-xs text-brand-text focus:outline-none w-full font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = newProjectSkillInput.trim();
                                if (trimmed && !editProjectSkills.includes(trimmed)) {
                                  setEditProjectSkills([...editProjectSkills, trimmed]);
                                  setNewProjectSkillInput('');
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = newProjectSkillInput.trim();
                              if (trimmed && !editProjectSkills.includes(trimmed)) {
                                setEditProjectSkills([...editProjectSkills, trimmed]);
                                setNewProjectSkillInput('');
                              }
                            }}
                            className="text-brand-lavender hover:text-brand-lavender/80 text-xs font-bold font-sans cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            + Add Tag
                          </button>
                        </div>
                      </div>

                      {/* Small list of global skills for easy single-click addition */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">Quick Add From Global Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skillFilters.map((globalSkill) => {
                            const isAttached = editProjectSkills.includes(globalSkill);
                            return (
                              <button
                                key={globalSkill}
                                type="button"
                                disabled={isAttached}
                                onClick={() => {
                                  setEditProjectSkills([...editProjectSkills, globalSkill]);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                                  isAttached
                                    ? 'bg-brand-bg text-brand-muted/50 border border-brand-border/40 cursor-not-allowed'
                                    : 'bg-white text-brand-text border border-brand-border/60 hover:border-brand-lavender hover:text-brand-lavender cursor-pointer'
                                }`}
                              >
                                {globalSkill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-brand-border/40 bg-[#FAF8F5]/50 flex justify-end items-center gap-3">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-brand-muted hover:bg-brand-bg hover:text-brand-text transition-all cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-sage hover:bg-brand-sage/90 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-sans"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Mouse Follower Cursor (Green Dot that expands into 'View' on project hover) */}
      {isCursorVisible && !selectedProjectId && (
        <motion.div
          className="fixed pointer-events-none z-50 hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            borderRadius: '9999px',
          }}
          animate={{
            width: isHoveringProject ? 64 : 14,
            height: isHoveringProject ? 64 : 14,
            backgroundColor: '#2E4A36',
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
              {isHoveringProject ? (
                <motion.div
                  key="view-label"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center text-[11px] font-sans font-bold text-white uppercase tracking-wider select-none text-center"
                >
                  <span>View</span>
                </motion.div>
              ) : (
                <motion.div
                  key="dot-core"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#85A98F]/90"
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
