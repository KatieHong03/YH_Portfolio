/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, getLiveProjects, getLiveProjectById, updateProjectCoverImage, updateProjectDisplayImage, EVENT_PROJECTS_UPDATED } from '../utils/projectsData';
import { CaseStudyView } from './CaseStudyView';
import { AppLogosTicker } from './AppLogosTicker';
import { getCachedCVContent, saveCVContent } from '../services/portfolioService';
import { uploadMediaToCloud } from '../services/storageService';
import { subscribeToAuth, logoutAdmin } from '../services/authService';
import { 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Award, 
  Download, 
  Mail, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Copy,
  Check,
  Linkedin,
  ExternalLink,
  ArrowUpRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  Lock,
  RotateCcw,
  X,
  Save,
  Layers,
  Upload,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface CVViewProps {
  setCurrentTab?: (tab: string) => void;
  onOpenConnect?: () => void;
}

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  caseStudyId?: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
  coursework?: string[];
}

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'langley-lnd',
    role: 'Learning & Development Intern',
    organization: 'Langley Federal Credit Union',
    location: 'Newport News, VA',
    period: 'June 2026 – Present',
    description: 'Assessed Financial Service Representatives learning needs and gaps to design a structured learning pathway with targeted onboarding and continuous development recommendations.',
    caseStudyId: 'fsr-product-knowledge'
  },
  {
    id: 'mentor-a-promise',
    role: 'Curriculum Designer Intern',
    organization: 'Mentor A Promise',
    location: 'New York, NY',
    period: 'September 2025 – Present',
    description: 'Designed and implemented SEL and arts-based instructional modules using the ADDIE framework to scaffold youth reflection and emotional articulation.',
    caseStudyId: 'mentor-promise'
  },
  {
    id: 'columbia-climate',
    role: 'Digital Learning & Course Design Assistant',
    organization: 'Columbia Climate School',
    location: 'New York, NY',
    period: 'September 2025 – Present',
    description: 'Collaborated with instructional teams to develop digital course materials, multimedia resources, and online learning modules for climate science education.'
  },
  {
    id: 'columbia-wellness',
    role: 'Engineering Wellness Education Content Designer',
    organization: 'Columbia University',
    location: 'New York, NY',
    period: 'September 2025 – Present',
    description: 'Designed multimedia educational campaigns and facilitated interactive workshops for 300+ students using experiential and scenario-based learning strategies.',
    caseStudyId: 'columbia-wellness'
  },
  {
    id: 'comma-reading',
    role: 'Instructional Designer Intern',
    organization: 'Comma Reading',
    location: 'Shanghai, China',
    period: 'June 2025 – August 2025',
    description: 'Conducted learner and usability analysis to develop 200+ multimodal learning resources and Figma prototypes across LMS modules.',
    caseStudyId: 'comma-reading'
  }
];

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: 'columbia-masters',
    degree: 'M.A. in Instructional Technology and Media',
    institution: 'Teachers College, Columbia University',
    location: 'New York, NY',
    period: 'September 2025 – Present',
    gpa: 'GPA: 4.00/4.00',
    coursework: [
      'Instructional Design of Ed Technology',
      'Theory & Programming: Interactive Media',
      'Introduction to Educational Technology & Learning Sciences',
      'Design for Play and Learning',
      'How Adults Learn'
    ]
  },
  {
    id: 'richmond-bachelors',
    degree: 'B.A. in Psychology & Cognitive Science',
    institution: 'University of Richmond',
    location: 'Richmond, VA',
    period: 'August 2021 – May 2025',
    gpa: 'GPA: 3.94/4.00',
    coursework: [
      'Cognitive Science',
      'Child Development',
      'Statistics',
      'Psycholinguistics'
    ]
  }
];

const DEFAULT_SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'id-theory',
    category: 'Instructional Design & Theory',
    items: [
      'Instructional Design Models (ADDIE, SAM, UbD)',
      'Cognitive Load & Learning Theory',
      'Needs Analysis & Thematic Analysis'
    ]
  },
  {
    id: 'authoring-tools',
    category: 'Authoring & Design Tools',
    items: [
      'Articulate 360 (Storyline & Rise)',
      'Figma',
      'Canva'
    ]
  },
  {
    id: 'lms-standards',
    category: 'LMS, EdTech & Standards',
    items: [
      'Canvas & Blackboard LMS',
      'SCORM & xAPI',
      'Google Workspace',
      'Microsoft 365'
    ]
  },
  {
    id: 'proto-languages',
    category: 'Prototyping & Languages',
    items: [
      'HTML, CSS & JavaScript',
      'Google AI Studio',
      'VS Code'
    ]
  }
];

export default function CVView({ setCurrentTab, onOpenConnect }: CVViewProps) {
  const [activeSection, setActiveSection] = useState<'all' | 'experience' | 'education' | 'skills'>('all');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Reset scroll to top instantly on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('portfolio_admin_active') === 'true';
  });

  useEffect(() => {
    const unsub = subscribeToAuth((st) => {
      setIsAdminMode(st.isAuthenticated);
    });
    return unsub;
  }, []);

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Custom Resume PDF State
  const [customResumePdf, setCustomResumePdf] = useState<string>(() => {
    const cached = getCachedCVContent();
    if (cached?.resume_meta?.url) return cached.resume_meta.url;
    return localStorage.getItem('portfolio_custom_resume_pdf') || '';
  });
  const [customResumeName, setCustomResumeName] = useState<string>(() => {
    const cached = getCachedCVContent();
    if (cached?.resume_meta?.name) return cached.resume_meta.name;
    return localStorage.getItem('portfolio_custom_resume_name') || '';
  });
  const [customResumeDate, setCustomResumeDate] = useState<string>(() => {
    const cached = getCachedCVContent();
    if (cached?.resume_meta?.updatedAt) return cached.resume_meta.updatedAt;
    return localStorage.getItem('portfolio_custom_resume_date') || '';
  });
  const [customResumeSize, setCustomResumeSize] = useState<string>(() => {
    const cached = getCachedCVContent();
    if (cached?.resume_meta?.size) return cached.resume_meta.size;
    return localStorage.getItem('portfolio_custom_resume_size') || '';
  });

  const [showResumeUploadModal, setShowResumeUploadModal] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const [isDraggingPdf, setIsDraggingPdf] = useState<boolean>(false);

  // Experiences State
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => {
    const saved = localStorage.getItem('portfolio_cv_experiences');
    if (saved) {
      try {
        let parsed: ExperienceItem[] = JSON.parse(saved);

        // Check if Columbia Climate School exists in parsed
        const hasClimate = parsed.some(exp => 
          exp.id.toLowerCase().includes('climate') ||
          exp.organization.toLowerCase().includes('climate') ||
          exp.role.toLowerCase().includes('climate') ||
          exp.description.toLowerCase().includes('climate')
        );

        // If not present in saved items, insert default Columbia Climate School entry
        if (!hasClimate) {
          const defaultClimate = DEFAULT_EXPERIENCES.find(e => e.id === 'columbia-climate')!;
          const wellnessIdx = parsed.findIndex(exp =>
            exp.id === 'columbia-wellness' ||
            exp.role.toLowerCase().includes('wellness')
          );
          if (wellnessIdx !== -1) {
            parsed.splice(wellnessIdx, 0, defaultClimate);
          } else {
            parsed.push(defaultClimate);
          }
        }

        // Reorder: Move present job experience upward / wellness below Columbia Climate School
        const climateIdx = parsed.findIndex(exp => 
          exp.id.toLowerCase().includes('climate') ||
          exp.organization.toLowerCase().includes('climate') ||
          exp.role.toLowerCase().includes('climate') ||
          exp.description.toLowerCase().includes('climate')
        );
        const wellnessIdx = parsed.findIndex(exp =>
          exp.id === 'columbia-wellness' ||
          exp.role.toLowerCase().includes('wellness')
        );

        if (climateIdx !== -1 && wellnessIdx !== -1 && wellnessIdx < climateIdx) {
          const wellnessItem = parsed[wellnessIdx];
          parsed.splice(wellnessIdx, 1);
          const newClimateIdx = parsed.findIndex(exp => 
            exp.id.toLowerCase().includes('climate') ||
            exp.organization.toLowerCase().includes('climate') ||
            exp.role.toLowerCase().includes('climate') ||
            exp.description.toLowerCase().includes('climate')
          );
          parsed.splice(newClimateIdx + 1, 0, wellnessItem);
        }

        // Ensure all mapped experiences have their respective caseStudyId linked (except Climate School)
        const remapped = parsed.map(exp => {
          // Explicitly clear case study for Climate School
          const isClimate = 
            exp.id.toLowerCase().includes('climate') ||
            exp.organization.toLowerCase().includes('climate') ||
            exp.role.toLowerCase().includes('climate') ||
            exp.description.toLowerCase().includes('climate');

          if (isClimate) {
            const { caseStudyId, ...rest } = exp;
            return rest;
          }

          if (!exp.caseStudyId) {
            if (exp.id === 'langley-lnd' || exp.organization.toLowerCase().includes('langley')) {
              return { ...exp, caseStudyId: 'fsr-product-knowledge' };
            }
            if (exp.id === 'mentor-a-promise' || exp.organization.toLowerCase().includes('mentor') || exp.role.toLowerCase().includes('curriculum')) {
              return { ...exp, caseStudyId: 'mentor-promise' };
            }
            if (
              (exp.id === 'columbia-wellness' || exp.role.toLowerCase().includes('wellness')) &&
              !exp.organization.toLowerCase().includes('climate')
            ) {
              return { ...exp, caseStudyId: 'columbia-wellness' };
            }
            if (exp.id === 'comma-reading' || exp.organization.toLowerCase().includes('comma')) {
              return { ...exp, caseStudyId: 'comma-reading' };
            }
          }
          return exp;
        });

        try {
          localStorage.setItem('portfolio_cv_experiences', JSON.stringify(remapped));
        } catch (e) {
          console.error(e);
        }

        return remapped;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EXPERIENCES;
  });

  // Available Portfolio Projects (loaded dynamically from unified getLiveProjects) for admin experience linking
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>(() => {
    return getLiveProjects();
  });

  // Active Case Study modal state to open single project view in-place on CV page
  const [selectedCaseStudyProject, setSelectedCaseStudyProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleSyncProjects = () => {
      const live = getLiveProjects();
      setPortfolioProjects(live);
      if (selectedCaseStudyProject) {
        const refreshed = live.find((p) => p.id === selectedCaseStudyProject.id);
        if (refreshed) {
          setSelectedCaseStudyProject(refreshed);
        }
      }
    };
    window.addEventListener(EVENT_PROJECTS_UPDATED, handleSyncProjects);
    window.addEventListener('storage', handleSyncProjects);
    return () => {
      window.removeEventListener(EVENT_PROJECTS_UPDATED, handleSyncProjects);
      window.removeEventListener('storage', handleSyncProjects);
    };
  }, [selectedCaseStudyProject]);

  // Education State
  const [educationList, setEducationList] = useState<EducationItem[]>(() => {
    const saved = localStorage.getItem('portfolio_cv_education_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EDUCATION;
  });

  // Skills State
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() => {
    const saved = localStorage.getItem('portfolio_cv_skills_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SKILL_GROUPS;
  });

  // Experience Modal Editing State
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isNewExp, setIsNewExp] = useState<boolean>(false);
  const [expRole, setExpRole] = useState('');
  const [expOrg, setExpOrg] = useState('');
  const [expLoc, setExpLoc] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expCaseStudyId, setExpCaseStudyId] = useState('');

  // Education Modal Editing State
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isNewEdu, setIsNewEdu] = useState<boolean>(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduLocation, setEduLocation] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduGpa, setEduGpa] = useState('');
  const [eduCourseworkStr, setEduCourseworkStr] = useState('');

  // Skill Group / Category Editing State
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);

  // Sync admin state across tabs/views
  useEffect(() => {
    const handleStorage = () => {
      setIsAdminMode(localStorage.getItem('portfolio_admin_active') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('yh3892@columbia.edu');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdminMode(false);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to revert all CV experiences and skills back to original defaults?')) {
      localStorage.removeItem('portfolio_cv_experiences');
      localStorage.removeItem('portfolio_cv_education');
      localStorage.removeItem('portfolio_cv_education_v3');
      localStorage.removeItem('portfolio_cv_skills');
      localStorage.removeItem('portfolio_cv_skills_v2');
      localStorage.removeItem('portfolio_cv_skills_v3');
      localStorage.removeItem('portfolio_cv_skills_v4');
      setExperiences(DEFAULT_EXPERIENCES);
      setEducationList(DEFAULT_EDUCATION);
      setSkillGroups(DEFAULT_SKILL_GROUPS);
      setEditingExp(null);
      setEditingEdu(null);
    }
  };

  // Education Handlers
  const handleOpenAddEdu = () => {
    setIsNewEdu(true);
    setEduDegree('');
    setEduInstitution('');
    setEduLocation('New York, NY');
    setEduPeriod('September 2025 – Present');
    setEduGpa('GPA: 4.00/4.00');
    setEduCourseworkStr('');
    setEditingEdu({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      period: '',
      gpa: '',
      coursework: []
    });
  };

  const handleOpenEditEdu = (edu: EducationItem) => {
    setIsNewEdu(false);
    setEduDegree(edu.degree);
    setEduInstitution(edu.institution);
    setEduLocation(edu.location);
    setEduPeriod(edu.period);
    setEduGpa(edu.gpa || '');
    setEduCourseworkStr(edu.coursework ? edu.coursework.join(', ') : '');
    setEditingEdu(edu);
  };

  const handleSaveEdu = () => {
    if (!editingEdu) return;
    if (!eduDegree.trim() || !eduInstitution.trim()) {
      alert('Degree and institution are required.');
      return;
    }

    const courseworkArr = eduCourseworkStr
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const updatedItem: EducationItem = {
      ...editingEdu,
      degree: eduDegree.trim(),
      institution: eduInstitution.trim(),
      location: eduLocation.trim(),
      period: eduPeriod.trim(),
      gpa: eduGpa.trim() ? eduGpa.trim() : undefined,
      coursework: courseworkArr.length > 0 ? courseworkArr : undefined
    };

    let updatedList: EducationItem[];
    if (isNewEdu) {
      updatedList = [...educationList, updatedItem];
    } else {
      updatedList = educationList.map(e => e.id === updatedItem.id ? updatedItem : e);
    }

    setEducationList(updatedList);
    saveCVContent({ education: updatedList }).catch(err => console.warn('Cloud save education:', err));
    localStorage.setItem('portfolio_cv_education_v3', JSON.stringify(updatedList));
    setEditingEdu(null);
  };

  const handleDeleteEdu = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this academic education item?')) {
      const updatedList = educationList.filter(edu => edu.id !== id);
      setEducationList(updatedList);
      saveCVContent({ education: updatedList }).catch(err => console.warn('Cloud save education:', err));
      localStorage.setItem('portfolio_cv_education_v3', JSON.stringify(updatedList));
    }
  };

  const handleMoveEdu = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= educationList.length) return;
    const updated = [...educationList];
    const item = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = item;
    setEducationList(updated);
    saveCVContent({ education: updated }).catch(err => console.warn('Cloud save education:', err));
    localStorage.setItem('portfolio_cv_education_v3', JSON.stringify(updated));
  };

  // Experience Handlers
  const handleOpenAddExp = () => {
    setIsNewExp(true);
    setExpRole('');
    setExpOrg('');
    setExpLoc('New York, NY');
    setExpPeriod('Present');
    setExpDesc('');
    setExpCaseStudyId('');
    setEditingExp({
      id: `exp-${Date.now()}`,
      role: '',
      organization: '',
      location: '',
      period: '',
      description: '',
      caseStudyId: ''
    });
  };

  const handleOpenEditExp = (exp: ExperienceItem) => {
    setIsNewExp(false);
    setExpRole(exp.role);
    setExpOrg(exp.organization);
    setExpLoc(exp.location);
    setExpPeriod(exp.period);
    setExpDesc(exp.description);
    setExpCaseStudyId(exp.caseStudyId || '');
    setEditingExp(exp);
  };

  const handleSaveExp = () => {
    if (!editingExp) return;
    if (!expRole.trim() || !expOrg.trim()) {
      alert('Role title and organization are required.');
      return;
    }

    const updatedItem: ExperienceItem = {
      ...editingExp,
      role: expRole.trim(),
      organization: expOrg.trim(),
      location: expLoc.trim(),
      period: expPeriod.trim(),
      description: expDesc.trim(),
      caseStudyId: expCaseStudyId.trim() ? expCaseStudyId.trim() : undefined
    };

    let updatedList: ExperienceItem[];
    if (isNewExp) {
      updatedList = [updatedItem, ...experiences];
    } else {
      updatedList = experiences.map(e => e.id === updatedItem.id ? updatedItem : e);
    }

    setExperiences(updatedList);
    saveCVContent({ experiences: updatedList }).catch(err => console.warn('Cloud save experiences:', err));
    localStorage.setItem('portfolio_cv_experiences', JSON.stringify(updatedList));
    setEditingExp(null);
  };

  const handleDeleteExp = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this experience role?')) {
      const updatedList = experiences.filter(exp => exp.id !== id);
      setExperiences(updatedList);
      saveCVContent({ experiences: updatedList }).catch(err => console.warn('Cloud save experiences:', err));
      localStorage.setItem('portfolio_cv_experiences', JSON.stringify(updatedList));
    }
  };

  const handleMoveExp = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;
    const updated = [...experiences];
    const item = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = item;
    setExperiences(updated);
    saveCVContent({ experiences: updated }).catch(err => console.warn('Cloud save experiences:', err));
    localStorage.setItem('portfolio_cv_experiences', JSON.stringify(updated));
  };

  // Skill Handlers
  const handleAddSkillItem = (groupId: string) => {
    const text = (newSkillInputs[groupId] || '').trim();
    if (!text) return;

    const updatedGroups = skillGroups.map(g => {
      if (g.id === groupId) {
        if (!g.items.includes(text)) {
          return { ...g, items: [...g.items, text] };
        }
      }
      return g;
    });

    setSkillGroups(updatedGroups);
    saveCVContent({ skills: updatedGroups }).catch(err => console.warn('Cloud save skills:', err));
    localStorage.setItem('portfolio_cv_skills_v4', JSON.stringify(updatedGroups));
    setNewSkillInputs({ ...newSkillInputs, [groupId]: '' });
  };

  const handleRemoveSkillItem = (groupId: string, itemToRemove: string) => {
    const updatedGroups = skillGroups.map(g => {
      if (g.id === groupId) {
        return { ...g, items: g.items.filter(i => i !== itemToRemove) };
      }
      return g;
    });

    setSkillGroups(updatedGroups);
    saveCVContent({ skills: updatedGroups }).catch(err => console.warn('Cloud save skills:', err));
    localStorage.setItem('portfolio_cv_skills_v4', JSON.stringify(updatedGroups));
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;

    const newGroup: SkillGroup = {
      id: `skill-cat-${Date.now()}`,
      category: name,
      items: []
    };

    const updated = [...skillGroups, newGroup];
    setSkillGroups(updated);
    localStorage.setItem('portfolio_cv_skills_v4', JSON.stringify(updated));
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this skill group?')) {
      const updated = skillGroups.filter(g => g.id !== groupId);
      setSkillGroups(updated);
      saveCVContent({ skills: updated }).catch(err => console.warn('Cloud save skills:', err));
      localStorage.setItem('portfolio_cv_skills_v4', JSON.stringify(updated));
    }
  };

  const handleUpdateCategoryName = (groupId: string, newName: string) => {
    const updated = skillGroups.map(g => g.id === groupId ? { ...g, category: newName } : g);
    setSkillGroups(updated);
    saveCVContent({ skills: updated }).catch(err => console.warn('Cloud save skills:', err));
    localStorage.setItem('portfolio_cv_skills_v4', JSON.stringify(updated));
  };

  // PDF Resume Upload & Reset Handlers
  const handlePdfUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file (.pdf)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB limit.');
      return;
    }

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let finalUrl = '';
    try {
      finalUrl = await uploadMediaToCloud(file, `resume-${Date.now()}.pdf`, 'portfolio-media');
    } catch {
      finalUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }

    setCustomResumePdf(finalUrl);
    setCustomResumeName(file.name);
    setCustomResumeDate(dateStr);
    setCustomResumeSize(sizeStr);

    saveCVContent({
      resumeMeta: {
        url: finalUrl,
        name: file.name,
        size: sizeStr,
        updatedAt: dateStr
      }
    }).catch(err => console.warn('Cloud save resume meta:', err));

    localStorage.setItem('portfolio_custom_resume_pdf', finalUrl);
    localStorage.setItem('portfolio_custom_resume_name', file.name);
    localStorage.setItem('portfolio_custom_resume_date', dateStr);
    localStorage.setItem('portfolio_custom_resume_size', sizeStr);

    window.dispatchEvent(new Event('storage'));
    setUploadSuccessMsg(`Resume PDF "${file.name}" successfully uploaded and activated!`);
    setTimeout(() => setUploadSuccessMsg(''), 4000);
  };

  const handleResetResumePdf = () => {
    if (window.confirm('Are you sure you want to revert to the default system resume PDF?')) {
      setCustomResumePdf('');
      setCustomResumeName('');
      setCustomResumeDate('');
      setCustomResumeSize('');
      localStorage.removeItem('portfolio_custom_resume_pdf');
      localStorage.removeItem('portfolio_custom_resume_name');
      localStorage.removeItem('portfolio_custom_resume_date');
      localStorage.removeItem('portfolio_custom_resume_size');
      window.dispatchEvent(new Event('storage'));
      setUploadSuccessMsg('Reverted back to default resume template.');
      setTimeout(() => setUploadSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-16">
      {/* 1. Header Card */}
      <motion.section 
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-brand-border rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sage/10 border border-brand-sage/20 rounded-full">
              <Sparkles className="w-3 h-3 text-brand-sage" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted font-mono">
                Curriculum Vitae
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-brand-text font-normal">
              Yuting (Katie) Hong
            </h1>

            <p className="font-sans text-brand-text text-sm sm:text-base font-medium">
              Instructional Designer & Learning Experience Designer
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-brand-muted pt-1">
              <span className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-lg border border-brand-border/60">
                <MapPin className="w-3.5 h-3.5 text-brand-sage" /> New York, Manhattan
              </span>
              <span className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-lg border border-brand-border/60">
                <Mail className="w-3.5 h-3.5 text-brand-blue" /> yh3892@columbia.edu
              </span>
              <span className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-lg border border-brand-border/60">
                <GraduationCap className="w-3.5 h-3.5 text-brand-peach" /> Columbia University (M.A.)
              </span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
            {isAdminMode && (
              <button
                onClick={() => setShowResumeUploadModal(true)}
                id="cv-admin-manage-pdf-btn"
                className="px-4 py-2.5 bg-brand-sage text-white hover:bg-brand-sage/90 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-brand-sage/40"
                title="Upload or replace the resume PDF"
              >
                <Upload className="w-4 h-4" />
                <span>{customResumePdf ? 'Manage Resume PDF' : 'Upload Resume PDF'}</span>
                {customResumePdf && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            )}

            <button
              onClick={handleCopyEmail}
              id="cv-copy-email-btn"
              className="px-4 py-2.5 bg-white border border-brand-border text-brand-text rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-bg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-brand-sage" />
                  <span className="text-brand-sage font-bold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-brand-muted" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <a
              href="https://www.linkedin.com/in/yuting-h-21736b27a/"
              target="_blank"
              rel="noopener noreferrer"
              id="cv-linkedin-btn"
              className="px-4 py-2.5 bg-white border border-brand-border text-brand-text rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-bg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
              title="Connect on LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-muted/70 group-hover:text-brand-text transition-colors" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* 2. Filter Navigation Pills */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center"
      >
        <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1 bg-white border border-brand-border rounded-xl shadow-xs">
          {[
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'skills', label: 'Skills', icon: Wrench }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                id={`cv-filter-${tab.id}-btn`}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                  ${isActive 
                    ? 'bg-brand-text text-white shadow-xs' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-sage' : 'text-brand-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* 3. EXPERIENCE SECTION */}
      {(activeSection === 'all' || activeSection === 'experience') && (
        <motion.section 
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-sage" />
              <h2 className="font-serif font-bold text-xl text-brand-text">Professional Experience</h2>
            </div>
            {isAdminMode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddExp}
                  className="px-3 py-1 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>
            )}
          </div>

          <div className="divide-y divide-brand-border/60 border-t border-b border-brand-border/60">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="py-6 sm:py-7 group transition-colors relative space-y-3"
              >
                {/* Header row: Role Title & Admin Controls */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-[25px] text-brand-text group-hover:text-brand-sage transition-colors leading-tight">
                    {exp.role}
                  </h3>

                  {/* Admin Actions */}
                  {isAdminMode && (
                    <div className="flex items-center gap-1 shrink-0 bg-white border border-brand-border px-2 py-1 rounded-lg shadow-xs self-start sm:self-auto">
                      <button
                        onClick={() => handleMoveExp(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Move experience up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveExp(index, 'down')}
                        disabled={index === experiences.length - 1}
                        className="p-1 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Move experience down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-px h-3.5 bg-brand-border mx-0.5" />
                      <button
                        onClick={() => handleOpenEditExp(exp)}
                        className="p-1 text-brand-sage hover:bg-brand-sage/10 rounded transition-colors cursor-pointer"
                        title="Edit this experience"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteExp(exp.id, e)}
                        className="p-1 text-[#9C5A4C] hover:bg-[#9C5A4C]/10 rounded transition-colors cursor-pointer"
                        title="Delete this experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtitle Dot-Separated Metadata Line */}
                <div className="font-sans text-xs sm:text-sm text-brand-muted flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-brand-text">{exp.organization}</span>
                  <span className="text-brand-border">•</span>
                  <span>{exp.location}</span>
                  <span className="text-brand-border">•</span>
                  <span>{exp.period}</span>
                </div>

                {/* Role Description */}
                <p className="font-sans text-sm sm:text-[15px] text-brand-muted leading-relaxed max-w-4xl pt-0.5">
                  {exp.description}
                </p>

                {/* Bottom Row: Metadata Pills & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-sans text-brand-text/80 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-brand-muted" />
                      <span>{exp.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-sans text-brand-text/80 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                      <span>{exp.period}</span>
                    </span>
                  </div>

                  {exp.caseStudyId && (
                    <button
                      onClick={() => {
                        const targetProject = getLiveProjectById(exp.caseStudyId!) || portfolioProjects.find(p => p.id === exp.caseStudyId);
                        if (targetProject) {
                          setSelectedCaseStudyProject(targetProject);
                        } else if (setCurrentTab) {
                          localStorage.setItem('selected_portfolio_project', exp.caseStudyId!);
                          window.dispatchEvent(new Event('storage_sync_project'));
                          setCurrentTab('work');
                        }
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#2C2C2C] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 ml-auto self-center"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-brand-sage" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 4. EDUCATION SECTION */}
      {(activeSection === 'all' || activeSection === 'education') && (
        <motion.section 
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-blue" />
              <h2 className="font-serif font-bold text-xl text-brand-text">Academic Education</h2>
            </div>
            {isAdminMode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddEdu}
                  className="px-3 py-1 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationList.map((edu, index) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-transparent border border-[#E5DFD3] hover:border-brand-blue/50 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between transition-all duration-300 hover:shadow-xs relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded font-bold">
                      {edu.period}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-brand-muted">{edu.location}</span>
                      {isAdminMode && (
                        <div className="flex items-center gap-1 bg-white/90 border border-brand-border px-1.5 py-0.5 rounded-lg shadow-xs">
                          <button
                            onClick={() => handleMoveEdu(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Move education up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveEdu(index, 'down')}
                            disabled={index === educationList.length - 1}
                            className="p-1 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Move education down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-px h-3.5 bg-brand-border mx-0.5" />
                          <button
                            onClick={() => handleOpenEditEdu(edu)}
                            className="p-1 text-brand-blue hover:bg-brand-blue/10 rounded transition-colors cursor-pointer"
                            title="Edit this education entry"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteEdu(edu.id, e)}
                            className="p-1 text-[#9C5A4C] hover:bg-[#9C5A4C]/10 rounded transition-colors cursor-pointer"
                            title="Delete this education entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-brand-text">
                      {edu.institution}
                    </h3>
                    <p className="font-sans text-xs font-semibold text-brand-muted">
                      {edu.degree}
                    </p>
                    {edu.gpa && (
                      <p className="font-mono text-[11px] text-brand-sage font-medium mt-0.5">
                        {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>

                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="pt-2 border-t border-brand-border/40 space-y-1.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-brand-muted font-bold block">
                      Core Coursework:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.coursework.map((course, idx) => (
                        <span 
                          key={idx}
                          className="font-sans text-[11px] bg-brand-bg text-brand-text px-2 py-0.5 rounded border border-brand-border/50"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 5. SKILLS SECTION */}
      {(activeSection === 'all' || activeSection === 'skills') && (
        <motion.section 
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-peach" />
              <h2 className="font-serif font-bold text-xl text-brand-text">Skills</h2>
            </div>
            {isAdminMode && (
              <div className="flex items-center gap-2">
                {showAddCategory ? (
                  <div className="flex items-center gap-1.5 bg-white border border-brand-peach rounded-xl px-2 py-0.5 shadow-xs">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name..."
                      className="text-xs bg-transparent focus:outline-none w-32 font-sans py-0.5"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCategory();
                        if (e.key === 'Escape') setShowAddCategory(false);
                      }}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="text-brand-peach hover:text-brand-peach/80 p-0.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="text-brand-muted hover:text-[#9C5A4C] p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="px-3 py-1 bg-brand-peach/20 hover:bg-brand-peach/30 text-brand-text border border-brand-peach/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-peach" />
                    <span>Add Category</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillGroups.map((group, idx) => (
              <motion.div 
                key={group.id || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-brand-border rounded-2xl p-4 shadow-xs space-y-2.5 hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-brand-border/40">
                    {isAdminMode && editingGroupId === group.id ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="text"
                          defaultValue={group.category}
                          onBlur={(e) => {
                            handleUpdateCategoryName(group.id, e.target.value);
                            setEditingGroupId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCategoryName(group.id, (e.target as HTMLInputElement).value);
                              setEditingGroupId(null);
                            }
                          }}
                          autoFocus
                          className="font-mono text-[10px] uppercase tracking-wider font-bold text-brand-text border-b border-brand-sage focus:outline-none w-full bg-transparent"
                        />
                      </div>
                    ) : (
                      <h3 
                        onClick={() => isAdminMode && setEditingGroupId(group.id)}
                        className={`font-mono text-[10px] uppercase tracking-wider font-bold text-brand-muted ${isAdminMode ? 'hover:text-brand-sage cursor-pointer' : ''}`}
                        title={isAdminMode ? 'Click to rename' : undefined}
                      >
                        {group.category}
                      </h3>
                    )}

                    {isAdminMode && (
                      <button
                        onClick={() => handleDeleteCategory(group.id)}
                        className="text-brand-muted hover:text-[#9C5A4C] p-0.5 rounded cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <ul className="space-y-1.5 pt-2">
                    {group.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-xs text-brand-text flex items-center justify-between group/item">
                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                          <span className="w-1 h-1 rounded-full bg-brand-sage shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                        {isAdminMode && (
                          <button
                            onClick={() => handleRemoveSkillItem(group.id, item)}
                            className="text-brand-muted/40 hover:text-[#9C5A4C] p-0.5 rounded cursor-pointer opacity-0 group-hover/item:opacity-100 transition-opacity"
                            title={`Remove ${item}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Admin Add Skill Input */}
                {isAdminMode && (
                  <div className="pt-2 border-t border-brand-border/30">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddSkillItem(group.id);
                      }}
                      className="flex items-center gap-1 bg-[#FAF8F5] border border-brand-border/80 rounded-lg px-2 py-1"
                    >
                      <input
                        type="text"
                        value={newSkillInputs[group.id] || ''}
                        onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [group.id]: e.target.value })}
                        placeholder="+ Add skill..."
                        className="bg-transparent text-[11px] text-brand-text focus:outline-none w-full font-sans placeholder:text-brand-muted/60"
                      />
                      <button
                        type="submit"
                        className="text-brand-sage hover:text-brand-sage/80 p-0.5 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Scrolling App Logos Marquee Ticker (Underneath Skills) */}
          <div className="pt-2">
            <AppLogosTicker />
          </div>
        </motion.section>
      )}

      {/* Bottom Action Banner */}
      <section className="bg-brand-sage/10 border border-brand-sage/25 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-brand-text">
            Let's connect and build impactful learning experiences
          </h3>
          <p className="font-sans text-xs text-brand-muted">
            Open for Instructional Design, Learning Architecture, and Educational Product consulting.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="mailto:yh3892@columbia.edu"
            className="px-4 py-2 bg-brand-text text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-brand-sage" />
            <span>Email</span>
          </a>
          {setCurrentTab && (
            <button
              onClick={() => onOpenConnect ? onOpenConnect() : (setCurrentTab && setCurrentTab('connect'))}
              className="px-4 py-2 bg-white border border-brand-border text-brand-text rounded-xl text-xs font-semibold hover:bg-brand-bg transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Connect</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-sage" />
            </button>
          )}
        </div>
      </section>

      {/* ==========================================
          EDIT EXPERIENCE MODAL
          ========================================== */}
      <AnimatePresence>
        {editingExp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2 text-brand-sage">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg text-brand-text">
                    {isNewExp ? 'Add Professional Experience' : 'Edit Professional Experience'}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingExp(null)}
                  className="text-brand-muted hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-brand-bg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Role / Position Title *
                  </label>
                  <input
                    type="text"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    placeholder="e.g. Learning & Development Intern"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                      Organization / Company *
                    </label>
                    <input
                      type="text"
                      value={expOrg}
                      onChange={(e) => setExpOrg(e.target.value)}
                      placeholder="e.g. Columbia University"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                      Location
                    </label>
                    <input
                      type="text"
                      value={expLoc}
                      onChange={(e) => setExpLoc(e.target.value)}
                      placeholder="e.g. New York, NY"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Time Period
                  </label>
                  <input
                    type="text"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    placeholder="e.g. September 2025 – Present"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Description & Key Accomplishments
                  </label>
                  <textarea
                    rows={4}
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="Summary of responsibilities and instructional design achievements..."
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-sage font-bold block">
                    Linked Case Study / Project Window
                  </label>
                  <select
                    value={expCaseStudyId}
                    onChange={(e) => setExpCaseStudyId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text bg-white"
                  >
                    <option value="">-- No Case Study Linked --</option>
                    {portfolioProjects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title} ({proj.projectType})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-brand-muted font-sans pt-0.5">
                    Clicking "View Case Study" on this role in CV will immediately open this project as a card/window.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-brand-border/40">
                <button
                  onClick={() => setEditingExp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:bg-brand-bg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExp}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-sage hover:bg-brand-sage/90 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save Experience
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          EDIT EDUCATION MODAL
          ========================================== */}
      <AnimatePresence>
        {editingEdu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2 text-brand-blue">
                  <GraduationCap className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg text-brand-text">
                    {isNewEdu ? 'Add Academic Education' : 'Edit Academic Education'}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingEdu(null)}
                  className="text-brand-muted hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-brand-bg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Degree / Program Title *
                  </label>
                  <input
                    type="text"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    placeholder="e.g. M.A. in Instructional Technology and Media"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus:outline-none text-xs font-sans text-brand-text"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                      Institution / University *
                    </label>
                    <input
                      type="text"
                      value={eduInstitution}
                      onChange={(e) => setEduInstitution(e.target.value)}
                      placeholder="e.g. Teachers College, Columbia University"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus:outline-none text-xs font-sans text-brand-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                      Location
                    </label>
                    <input
                      type="text"
                      value={eduLocation}
                      onChange={(e) => setEduLocation(e.target.value)}
                      placeholder="e.g. New York, NY"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus:outline-none text-xs font-sans text-brand-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                      Time Period
                    </label>
                    <input
                      type="text"
                      value={eduPeriod}
                      onChange={(e) => setEduPeriod(e.target.value)}
                      placeholder="e.g. September 2025 – Present"
                      className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus:outline-none text-xs font-sans text-brand-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                      GPA / Honors (Optional)
                    </label>
                    <input
                      type="text"
                      value={eduGpa}
                      onChange={(e) => setEduGpa(e.target.value)}
                      placeholder="e.g. GPA: 4.00/4.00"
                      className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus:outline-none text-xs font-sans text-brand-text"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Core Coursework (Comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={eduCourseworkStr}
                    onChange={(e) => setEduCourseworkStr(e.target.value)}
                    placeholder="e.g. Cognitive Science of Multimedia Learning, Design of Educational Games, Interactive Media Production"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus:outline-none text-xs font-sans text-brand-text leading-relaxed"
                  />
                  <p className="font-mono text-[9.5px] text-brand-muted">
                    Separate course titles with commas. They will be rendered as individual tags.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-brand-border/40">
                <button
                  onClick={() => setEditingEdu(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:bg-brand-bg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdu}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save Education
                </button>
              </div>
            </motion.div>
          </div>
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
              onClick={() => setShowResumeUploadModal(true)}
              className="text-brand-sage hover:underline font-semibold font-sans cursor-pointer flex items-center gap-1.5"
              title="Upload and manage custom resume PDF"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Resume PDF</span>
              {customResumePdf && <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />}
            </button>
            <span className="text-brand-border h-4 w-px bg-brand-border/80" />
            <button 
              onClick={handleResetToDefaults}
              className="text-brand-muted hover:text-[#9C5A4C] hover:underline transition-colors cursor-pointer flex items-center gap-1 font-sans"
              title="Reset CV data to default"
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
          RESUME PDF UPLOAD MODAL (ADMIN)
          ========================================== */}
      <AnimatePresence>
        {showResumeUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-5 text-left relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-border/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-brand-sage/15 border border-brand-sage/30 flex items-center justify-center text-brand-sage">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-text">Resume PDF Management</h3>
                    <p className="font-sans text-[11px] text-brand-muted">Upload and activate your custom PDF resume file</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResumeUploadModal(false)}
                  className="text-brand-muted hover:text-brand-text cursor-pointer p-1.5 rounded-full hover:bg-brand-bg transition-colors"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success Notification Alert */}
              {uploadSuccessMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="p-3 bg-brand-sage/10 border border-brand-sage/30 rounded-xl flex items-center gap-2.5 text-xs text-brand-text font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </motion.div>
              )}

              {/* Current Active Status Card */}
              <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-muted">
                    Currently Active Resume
                  </span>
                  {customResumePdf ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage text-[10.5px] font-bold font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse" />
                      Custom Uploaded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-border/60 text-brand-muted text-[10.5px] font-bold font-mono">
                      Default Template
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-brand-border/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-brand-sage shrink-0" />
                    <div className="truncate">
                      <p className="font-sans text-xs sm:text-[13px] font-semibold text-brand-text truncate">
                        {customResumeName || 'Yuting_Katie_Hong_Resume.pdf'}
                      </p>
                      <p className="font-mono text-[10px] text-brand-muted">
                        {customResumeDate ? `Uploaded ${customResumeDate} ${customResumeSize ? `• ${customResumeSize}` : ''}` : 'Original default PDF bundle'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={customResumePdf || "/resume.pdf"}
                    download={customResumeName || "Yuting_Katie_Hong_Resume.pdf"}
                    className="px-2.5 py-1.5 bg-brand-bg hover:bg-brand-sage/10 text-brand-text hover:text-brand-sage rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-brand-border transition-colors cursor-pointer shrink-0"
                    title="Download active PDF to preview"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPdf(true);
                }}
                onDragLeave={() => setIsDraggingPdf(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingPdf(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handlePdfUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => {
                  const input = document.getElementById('admin-pdf-file-input');
                  if (input) input.click();
                }}
                className={`
                  border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group
                  ${isDraggingPdf 
                    ? 'border-brand-sage bg-brand-sage/10 scale-[1.01]' 
                    : 'border-brand-border hover:border-brand-sage hover:bg-brand-sage/5'
                  }
                `}
              >
                <input
                  id="admin-pdf-file-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePdfUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-full bg-brand-sage/10 border border-brand-sage/20 flex items-center justify-center text-brand-sage group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="font-sans text-sm font-semibold text-brand-text">
                    Click to select PDF or drag and drop here
                  </p>
                  <p className="font-mono text-[11px] text-brand-muted">
                    Supports .PDF documents (up to 20MB)
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-1 px-4 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-sage/90 shadow-xs cursor-pointer transition-transform group-hover:scale-105"
                >
                  Choose PDF File
                </button>
              </div>

              {/* Informational hint & Footer Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-brand-border/40 text-xs">
                <p className="font-sans text-[11px] text-brand-muted flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                  <span>Automatically syncs with all download buttons.</span>
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {customResumePdf && (
                    <button
                      onClick={handleResetResumePdf}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9C5A4C] hover:bg-[#9C5A4C]/10 border border-[#9C5A4C]/30 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revert to Default</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowResumeUploadModal(false)}
                    className="px-4 py-2 bg-brand-text text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  Enter the administrator password to enable live editing of the CV experiences and skills.
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:bg-brand-bg transition-colors cursor-pointer"
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
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-sage hover:bg-brand-sage/90 shadow-xs cursor-pointer transition-all"
                >
                  Unlock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Overlay Layer for Case Study - Opens single project window directly on CV page */}
      <AnimatePresence>
        {selectedCaseStudyProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            {/* Backdrop with subtle blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedCaseStudyProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              aria-label="Close project detail overlay"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative z-10 w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] bg-brand-bg rounded-2xl sm:rounded-3xl border border-brand-border shadow-2xl flex flex-col overflow-hidden text-left"
            >
              {/* Sticky Top Control Header */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-brand-border shrink-0 z-20">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedCaseStudyProject(null)}
                    id="cv-modal-back-btn"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg hover:bg-brand-border/60 text-brand-muted hover:text-brand-text border border-brand-border text-xs font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to CV</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {setCurrentTab && (
                    <button
                      onClick={() => {
                        localStorage.setItem('selected_portfolio_project', selectedCaseStudyProject.id);
                        window.dispatchEvent(new Event('storage_sync_project'));
                        setSelectedCaseStudyProject(null);
                        setCurrentTab('work');
                      }}
                      id="cv-modal-open-project-page-btn"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-text hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
                      title="Open full interactive page in Project section"
                    >
                      <span>Open on Project Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-brand-sage" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCaseStudyProject(null)}
                    id="cv-modal-close-x-btn"
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
                  activeProject={selectedCaseStudyProject as any} 
                  isAdminMode={isAdminMode} 
                  setEditingProject={() => {}} 
                  onClose={() => setSelectedCaseStudyProject(null)}
                  onUpdateCoverImage={(newImg) => {
                    const updated = updateProjectCoverImage(selectedCaseStudyProject.id, newImg);
                    const refreshed = updated.find(p => p.id === selectedCaseStudyProject.id);
                    if (refreshed) setSelectedCaseStudyProject(refreshed);
                  }}
                  onUpdateDisplayImage={(phIdx, newImg) => {
                    const updated = updateProjectDisplayImage(selectedCaseStudyProject.id, phIdx, newImg);
                    const refreshed = updated.find(p => p.id === selectedCaseStudyProject.id);
                    if (refreshed) setSelectedCaseStudyProject(refreshed);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

