/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { safeLocalStorageSet } from './imageCompressor';
import { getCachedProjects, saveAllProjects } from '../services/portfolioService';

export interface Project {
  id: string;
  title: string;
  cardImage?: string; // High-level portfolio overview card cover image URL
  isFlagship?: boolean;
  projectType: string; // Instructional Design / eLearning / Curriculum Design / L&D
  types: string[];      // Multi-filtering types
  overview: string;    // A 1–2 sentence summary of the project and its purpose.
  audience: string;    // Who were the learners?
  challenge: string;   // What learning or performance problem needed to be addressed?
  solution: string;    // What learning experience, training, or instructional solution was designed?
  externalUrl?: string; // External link for the project (optional)
  caseStudyDocUrl?: string; // Optional external document link
  orderIndex?: number;
  visible?: boolean;
  process: {
    needsAnalysis: string;
    learningObjectives: string;
    designDevelopment: string;
    implementation: string;
  };
  deliverables: string[];
  tools: string[];
  impact: string;      // Key outcomes, learner feedback, engagement metrics, or business results.
  skillsDemonstrated: string[]; // ADDIE • Curriculum Design • eLearning Development • Facilitation • Learning Evaluation
  skills: string[];    // Match filter compatibility
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

export const CANONICAL_PROJECTS: Project[] = [
  {
    id: 'ra-training',
    title: 'PracticeURWay: A Training Website for Resident Assistants',
    cardImage: '/images/ra-training-cover.jpg',
    isFlagship: true,
    projectType: 'Instructional Design',
    types: [
      'Instructional Design',
      'eLearning',
      'Learning & Development'
    ],
    overview: 'A training website that helps Resident Assistants review key policies, practice emergency decision-making, reflect on their responses, and access essential campus resources.',
    audience: '**Resident Assistants** supporting residents, responding to crises, and navigating campus protocols.',
    challenge: 'RAs needed **quick access **to key policies, emergency steps, and practice opportunities to support **retention and decision-making**.',
    solution: 'Built a **scenario-based training website** with policy review, branching practice, reflection prompts, and centralized resources.',
    externalUrl: 'https://sites.google.com/view/practice-ur-way/ra-toolbox',
    process: {
      needsAnalysis: 'Surveyed and interviewed learners; reviewed training data to identify knowledge gaps.',
      learningObjectives: 'Mapped training needs into scenario-based practice, policy review, and reflection activities.',
      designDevelopment: 'Built the website with interactive scenarios, feedback prompts, and centralized resources.',
      implementation: 'Analyzed feedback and revised content for clarity, engagement, and retention.'
    },
    deliverables: [
      'Website',
      'Interactive Slides',
      'Knowledge Checks',
      'Assessment Forms',
      'Tutorial Video'
    ],
    tools: [
      'Google Sites',
      'Google Forms',
      'Google Slides',
      'Figma'
    ],
    impact: '',
    skillsDemonstrated: [
      'ADDIE',
      'Needs Analysis',
      'Learning Evaluation',
      'Thematic Analysis'
    ],
    skills: [
      'ADDIE',
      'Needs Analysis',
      'Learning Evaluation',
      'Thematic Analysis'
    ],
    timeline: 'September 2025 - May 2026',
    outcomeMetric: '95% Rating',
    metricsList: [
      {
        value: '15%',
        label: 'Engagement Increase'
      },
      {
        value: '95%',
        label: 'Rated Experience 5/5'
      },
      {
        value: '2.4x',
        label: 'Safety Confidence'
      }
    ],
    displayPlaceholders: [
      {
        title: 'Google Site Hub',
        description: 'Centralized digital policy center & mobile toolkit for active duty RAs.',
        icon: 'Layers',
        externalUrl: 'https://sites.google.com/view/practice-ur-way/ra-toolbox',
        imageUrl: '/images/ra-training-display-01.png'
      },
      {
        title: 'Interactive Scenario Practices',
        description: 'Scenario simulator with branching decision points & protocol guides.',
        icon: 'Compass',
        externalUrl: 'https://docs.google.com/presentation/d/1Cy0W_el54MJqr-ncG5eqtOHZ8TtFPJDAXkX2TWgyLKQ/present?slide=id.g4dfce81f19_0_45',
        imageUrl: '/images/ra-training-display-02.png'
      },
      {
        title: 'Tutorial Video',
        description: 'Screencast walk-through detailing UI features and RA toolkit usage.',
        icon: 'Video',
        imageUrl: '/images/ra-training-display-03.png',
        externalUrl: 'https://drive.google.com/file/d/1g31j_2YxMFp2iCw9-ZPoahNbaue_C0-T/view?usp=sharing'
      },
      {
        title: 'Guides & Checklists',
        description: 'Centralized emergency response sheets and active checklist guides.',
        icon: 'CheckSquare',
        imageUrl: '/images/ra-training-display-04.png',
        externalUrl: 'https://drive.google.com/file/d/12VPsfuBIGhe3RLU2crlChgpyTfxJlL2j/view?usp=sharing'
      }
    ]
  },
  {
    id: 'fsr-product-knowledge',
    title: 'Financial Service Representatives (FSR) Developmental Framework',
    cardImage: '/images/fsr-product-knowledge-cover.jpg',
    isFlagship: true,
    projectType: 'Instructional Design',
    types: [
      'Instructional Design',
      'eLearning',
      'Learning & Development',
      'Flagship Project'
    ],
    overview: 'A **developmental pathway** that transformed FSR learning needs into targeted recommendations and high-fidelity learning solutions.',
    audience: '**Financial Service Representatives**, Learning & Development Team, Human Resources Department',
    challenge: 'FSRs lacked a **clear, structured development path**, making it difficult to address **performance gaps ** and build skills consistently across different stages of growth.',
    solution: 'Designed a **role-aligned developmental framework** that translated identified learning needs into **targeted recommendations, structured learning stages, and practical eLearning solutions**.',
    process: {
      needsAnalysis: 'Reviewed FSR development stages, learning needs, performance gaps, and existing resources.',
      learningObjectives: 'Mapped development stages to targeted learning strategies and support.',
      designDevelopment: 'Built the pathway, recommendations, and high-fidelity learning materials.',
      implementation: 'Refined recommendations and solutions based on stakeholder feedback.'
    },
    deliverables: [
      'Learning Pathway',
      'Recommendation Plan',
      'Storyline Courses',
      'Job Aids'
    ],
    tools: [
      'Articulate Storyline',
      'Articulate Rise',
      'LMS Platform',
      'Canva',
      'Microsoft 365'
    ],
    impact: '',
    skillsDemonstrated: [
      'ADDIE',
      'Storyline',
      'Needs Analysis',
      'LMS',
      'Learning Evaluation',
      'Thematic Analysis',
      'Workshop Design'
    ],
    skills: [
      'ADDIE',
      'Storyline',
      'Needs Analysis',
      'LMS',
      'Learning Evaluation',
      'Thematic Analysis',
      'Workshop Design'
    ],
    timeline: 'June 2026 - August 2026',
    outcomeMetric: '18% Faster Ramp',
    metricsList: [
      {
        value: '12+',
        label: 'Targeted Recommendations Proposed'
      },
      {
        value: '4+',
        label: 'Learning Courses Created'
      },
      {
        value: '18%',
        label: 'Faster Ramp-up'
      }
    ],
    displayPlaceholders: [
      {
        title: 'Pathway Architecture',
        description: 'Staged Financial Service Representatives Learning Pathway',
        icon: 'Map',
        imageUrl: '/images/fsr-product-knowledge-display-01.jpg',
        externalUrl: 'https://drive.google.com/file/d/1cOCFw5R_3u4eZCjaISD-43Ewq6KSvm0h/view?usp=drive_link'
      },
      {
        title: 'Course Highlight #1',
        description: 'Introduction to Products & Services Course: Visual Highlight',
        icon: 'Sliders',
        imageUrl: '/images/fsr-product-knowledge-display-02.jpg',
        externalUrl: 'https://drive.google.com/file/d/1YiRM0YYvn2dU2HYM9-6M7KB7weur-urM/view?usp=drive_link'
      },
      {
        title: 'Course Highlight #2',
        description: 'Introduction to Products & Services Course: Interactivity Highlight',
        icon: 'CheckSquare',
        imageUrl: '/images/fsr-product-knowledge-display-03.jpg',
        externalUrl: 'https://drive.google.com/file/d/1-uYdrKR03B8vDBxHdYkdWBelZk3UzqSa/view?usp=drive_link'
      },
      {
        title: 'Course Highlight #3',
        description: 'Introduction to Products & Services Course: Interactivity Highlight',
        icon: 'BarChart3',
        imageUrl: '/images/fsr-product-knowledge-display-04.jpg',
        externalUrl: 'https://drive.google.com/file/d/103pml61MEvQbTWSonuoOPHcI9VymD3jd/view?usp=drive_link'
      }
    ]
  },
  {
    id: 'columbia-wellness',
    title: 'STEM Wellness Program Design',
    cardImage: '/images/columbia-wellness-cover.jpg',
    projectType: 'Learning & Development',
    types: [
      'Learning & Development',
      'Program Design',
      'Wellness Education'
    ],
    overview: 'A student-centered wellness initiative translating mental health needs into accessible programs, community-led workshops, event proposals, and execution plans.',
    audience: '**Columbia Engineering students** seeking accessible wellness support, stress-management resources, and community-based programming.',
    challenge: 'Students needed **engaging and approachable wellness experiences** that fit into a busy academic environment.',
    solution: 'Designed and supported **wellness workshops, campaigns, newsletters, and events** to promote mental health, connection, and self-care across campus.',
    process: {
      needsAnalysis: 'Assessed student wellness needs and communication gaps.',
      learningObjectives: 'Created student-centered workshop and campaign concepts.',
      designDevelopment: 'Developed newsletters, visual assets, and event materials.',
      implementation: 'Refined outreach and programming based on feedback.'
    },
    deliverables: [
      'Instagram Campaign',
      'Wellness Newsletter',
      'Event Proposal',
      'Wellness Website',
      'Workshop Materials'
    ],
    tools: [
      'Figma',
      'Canva',
      'Google Workspace'
    ],
    impact: '',
    skillsDemonstrated: [
      'Workshop Design',
      'Facilitation',
      'Needs Analysis'
    ],
    skills: [
      'Workshop Design',
      'Facilitation',
      'Needs Analysis'
    ],
    timeline: 'September 2025 –Present',
    outcomeMetric: '33% Growth',
    metricsList: [
      {
        value: '+33%',
        label: 'Attendance Growth'
      },
      {
        value: '400+',
        label: 'Engaged Students'
      },
      {
        value: '100%',
        label: 'Program Viability'
      }
    ],
    displayPlaceholders: [
      {
        title: 'Wellness Website',
        description: '',
        icon: 'Sliders',
        imageUrl: '/images/columbia-wellness-display-01.png',
        externalUrl: 'https://wellness.engineering.columbia.edu/'
      },
      {
        title: 'Wellness Newsletter',
        description: '',
        icon: 'BookOpen',
        imageUrl: '/images/columbia-wellness-display-02.png',
        externalUrl: 'https://wellness.engineering.columbia.edu/content/wellness-newsletter-0'
      },
      {
        title: 'Wellness Campaign',
        description: '',
        icon: 'Image',
        imageUrl: '/images/columbia-wellness-display-03.png',
        externalUrl: 'https://drive.google.com/file/d/1FduJXN6iAAn505xhaWwZu6h0WC6tNRZE/view?usp=sharing'
      }
    ]
  },
  {
    id: 'comma-reading',
    title: 'Digital Reading Pathway for ESL Learners',
    cardImage: '/images/comma-reading-cover.jpg',
    projectType: 'Instructional Design',
    types: [
      'Instructional Design',
      'eLearning',
      'Curriculum Design'
    ],
    overview: 'A structured learning pathway that makes English articles more accessible through guided, step-by-step reading experiences.',
    audience: '**ESL learners ** building vocabulary, comprehension, and reading confidence.',
    challenge: 'Learners struggled with **complex articles, unfamiliar vocabulary, and limited reading confidence**.',
    solution: 'Transformed traditional reading materials into **guided digital learning pathways** with curated articles, vocabulary support, comprehension tasks, and **interactive LMS activities**.',
    process: {
      needsAnalysis: 'Identified ESL learners’ reading challenges and support needs.',
      learningObjectives: 'Curated articles and structured them into guided reading pathways.',
      designDevelopment: 'Built learner-facing LMS modules with reading activities and clear instructions.',
      implementation: 'Refined article selection, pathway structure, and activity instructions based on learner engagement.'
    },
    deliverables: [
      'Digital Reading Pathway',
      'LMS Learning Modules',
      'Competitive Product Analysis Report',
      'LMS Book Data Audit & Entry'
    ],
    tools: [
      'Figma',
      'LMS Platform',
      'Microsoft 365'
    ],
    impact: 'Identified ESL learners’ reading challenges and support needs.',
    skillsDemonstrated: [
      'LMS',
      'ADDIE',
      'Needs Analysis',
      'Learning Evaluation'
    ],
    skills: [
      'LMS',
      'ADDIE',
      'Needs Analysis',
      'Learning Evaluation'
    ],
    timeline: '2024',
    outcomeMetric: '+18% Reading Engagement',
    metricsList: [
      {
        value: '20k+',
        label: 'Engaged Learners'
      },
      {
        value: '+18%',
        label: 'Reading Engagement'
      },
      {
        value: '15+',
        label: 'Published LMS Learning Modules'
      }
    ],
    displayPlaceholders: [
      {
        title: 'Digital Reading Pathway',
        description: 'Interaction Highlight',
        icon: 'Tablet',
        imageUrl: '/images/comma-reading-display-01.jpg',
        externalUrl: 'https://drive.google.com/file/d/1m8jiAhb22lf9qM5Iedx5Aj8yYKDcpQ37/view?usp=drive_link'
      },
      {
        title: 'LMS Learning Modules ',
        description: 'Vocabulary Interaction Highlight',
        icon: 'Volume2',
        imageUrl: '/images/comma-reading-display-02.jpg',
        externalUrl: 'https://drive.google.com/file/d/1kwQbwupMBP8yaYdlJXbGyAJJJZ89wMdO/view?usp=drive_link'
      },
      {
        title: 'LMS Learning Modules ',
        description: 'Gamified Quiz Highlight',
        icon: 'Map',
        imageUrl: '/images/comma-reading-display-03.jpg',
        externalUrl: 'https://drive.google.com/file/d/1US7c4rBs0nGF4-gN2ABGeNOfrfbUpV2W/view?usp=drive_link'
      }
    ]
  },
  {
    id: 'mentor-promise',
    title: 'Art-based Social-Emotional Learning Curriculum',
    cardImage: '/images/mentor-promise-cover.jpg',
    projectType: 'Instructional Design',
    types: [
      'Instructional Design',
      'Curriculum Design'
    ],
    overview: 'A social-emotional coaching curriculum and highly artistic mentor-training handbook developed to support developmental conversations for high-risk youth.',
    audience: '**K–12 students** learning emotional awareness, self-expression, empathy, and peer relationship skills.',
    challenge: 'SEL concepts can feel **abstract **when taught through traditional instruction alone.',
    solution: 'Designed an **art-based SEL** course with drawing, reflection, and discussion activities.',
    process: {
      needsAnalysis: 'Identified student SEL needs around emotional awareness, self-expression, empathy, and peer relationships.',
      learningObjectives: 'Created lesson themes, art prompts, reflection questions, and discussion activities.',
      designDevelopment: 'Facilitated interactive SEL lessons with mentors and supported student reflection.',
      implementation: 'Adjusted content and activities for different student populations.'
    },
    deliverables: [
      'Lesson Plan',
      'Lesson Slide',
      'Facilitation Guide'
    ],
    tools: [
      'Google Workspace',
      'Canva'
    ],
    impact: '',
    skillsDemonstrated: [
      'Facilitation',
      'Learning Evaluation'
    ],
    skills: [
      'Facilitation',
      'Learning Evaluation'
    ],
    timeline: 'September 2025 - June 2026',
    outcomeMetric: '100% Confident',
    metricsList: [
      {
        value: '10',
        label: 'Lessons Designed'
      },
      {
        value: '+12%',
        label: 'Student Engagement'
      },
      {
        value: '2',
        label: 'School Launches'
      }
    ],
    displayPlaceholders: [
      {
        title: 'Lesson Plan',
        description: 'Sample #1',
        icon: 'GitMerge',
        imageUrl: '/images/mentor-promise-display-01.jpg',
        externalUrl: 'https://drive.google.com/file/d/15ImkIzT4ydpGzfMS3yglPUFgMg8iq-gY/view?usp=sharing'
      },
      {
        title: 'Lesson Slide',
        description: 'Sample #2',
        icon: 'PenTool',
        imageUrl: '/images/mentor-promise-display-02.jpg',
        externalUrl: 'https://drive.google.com/file/d/1qJPHEFzNwZ0s9MFBFBQZTxExXjjwLWXL/view?usp=sharing'
      },
      {
        title: 'Lesson Template',
        description: 'Sample #3',
        icon: 'HelpCircle',
        imageUrl: '/images/mentor-promise-display-03.jpg',
        externalUrl: 'https://drive.google.com/file/d/1NeXdd25IrxmU04F4N5-U_4YWafDS1-d-/view?usp=drive_link'
      }
    ]
  }
];

export const STORAGE_KEY_PROJECTS = 'portfolio_projects_data';
export const EVENT_PROJECTS_UPDATED = 'portfolio_projects_data_updated';

/**
 * Canonical image path normalizer ensuring all image references strictly follow
 * the clean lowercase hyphenated standard in /images/
 */
export function normalizeImageUrl(url?: string): string | undefined {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  let base = url.trim();
  const lastSlash = base.lastIndexOf('/');
  if (lastSlash >= 0) {
    base = base.substring(lastSlash + 1);
  }
  let clean = base.replace(/_/g, '-').toLowerCase();
  clean = clean.replace(/-display-(\d)\./, '-display-0$1.');
  return `/images/${clean}`;
}

/**
 * Loads all live projects, prioritizing the persistent cloud database if loaded,
 * while safely checking browser localStorage for pending unmigrated edits,
 * and falling back to CANONICAL_PROJECTS.
 */
export function getLiveProjects(): Project[] {
  const cached = getCachedProjects();
  if (cached && Array.isArray(cached) && cached.length > 0 && cached !== CANONICAL_PROJECTS) {
    return cached;
  }
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_PROJECTS) : null;
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Project[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return CANONICAL_PROJECTS.map((defaultProj) => {
          const savedProj = parsed.find((p) => p.id === defaultProj.id);
          if (savedProj) {
            const updatedPlaceholders = defaultProj.displayPlaceholders.map((dpPh, idx) => {
              const savedPh = savedProj.displayPlaceholders?.[idx];
              const merged = savedPh ? { ...dpPh, ...savedPh } : dpPh;
              if (merged.imageUrl) {
                merged.imageUrl = normalizeImageUrl(merged.imageUrl);
              }
              return merged;
            });

            // Ensure impact reflects canonical defaults: only comma-reading has wording underneath
            let resolvedImpact = defaultProj.impact;
            if (defaultProj.impact === '') {
              resolvedImpact = '';
            } else if (defaultProj.id === 'comma-reading') {
              resolvedImpact = defaultProj.impact;
            } else if (savedProj.impact !== undefined) {
              resolvedImpact = savedProj.impact;
            }

            const cardImage = normalizeImageUrl(savedProj.cardImage) !== undefined 
              ? normalizeImageUrl(savedProj.cardImage) 
              : defaultProj.cardImage;

            return {
              ...defaultProj,
              ...savedProj,
              cardImage,
              isFlagship: defaultProj.isFlagship !== undefined ? defaultProj.isFlagship : savedProj.isFlagship,
              title: savedProj.title || defaultProj.title,
              impact: resolvedImpact,
              outcomeMetric: savedProj.outcomeMetric || defaultProj.outcomeMetric,
              process: savedProj.process ? { ...defaultProj.process, ...savedProj.process } : defaultProj.process,
              deliverables: savedProj.deliverables || defaultProj.deliverables,
              tools: savedProj.tools || defaultProj.tools,
              externalUrl: savedProj.externalUrl !== undefined ? savedProj.externalUrl : defaultProj.externalUrl,
              displayPlaceholders: updatedPlaceholders
            };
          }
          return defaultProj;
        });
      }
    } catch (e) {
      console.error('Error parsing projects from localStorage:', e);
    }
  }
  return CANONICAL_PROJECTS;
}

/**
 * Gets a single live project by its unique ID.
 */
export function getLiveProjectById(id: string): Project | undefined {
  const projects = getLiveProjects();
  return projects.find((p) => p.id === id);
}

/**
 * Saves projects array to cloud database, safe local backup, and broadcasts an update event.
 */
export function saveLiveProjects(projects: Project[]): void {
  const sanitized = projects.map((p) => ({
    ...p,
    cardImage: p.cardImage ? normalizeImageUrl(p.cardImage) : undefined,
    displayPlaceholders: (p.displayPlaceholders || []).map((ph) => ({
      ...ph,
      imageUrl: ph.imageUrl ? normalizeImageUrl(ph.imageUrl) : undefined
    }))
  }));

  // Save to persistent cloud database
  saveAllProjects(sanitized).catch((err) => {
    console.warn('Cloud save projects warning:', err);
  });

  // Keep local backup in browser
  safeLocalStorageSet(STORAGE_KEY_PROJECTS, JSON.stringify(sanitized));
  window.dispatchEvent(new Event(EVENT_PROJECTS_UPDATED));
  window.dispatchEvent(new Event('storage'));
}

/**
 * Updates a project's cover image.
 */
export function updateProjectCoverImage(projectId: string, newImage: string): Project[] {
  const current = getLiveProjects();
  const normalized = newImage ? (normalizeImageUrl(newImage) || newImage) : '';
  const updated = current.map((p) => {
    if (p.id === projectId) {
      return { ...p, cardImage: normalized };
    }
    return p;
  });
  saveLiveProjects(updated);
  return updated;
}

/**
 * Updates a project's visual artifact placeholder image.
 */
export function updateProjectDisplayImage(projectId: string, placeholderIdx: number, newImageUrl: string): Project[] {
  const current = getLiveProjects();
  const normalized = newImageUrl ? (normalizeImageUrl(newImageUrl) || newImageUrl) : '';
  const updated = current.map((p) => {
    if (p.id === projectId) {
      const updatedPlaceholders = [...(p.displayPlaceholders || [])];
      if (updatedPlaceholders[placeholderIdx]) {
        updatedPlaceholders[placeholderIdx] = {
          ...updatedPlaceholders[placeholderIdx],
          imageUrl: normalized
        };
      }
      return {
        ...p,
        displayPlaceholders: updatedPlaceholders
      };
    }
    return p;
  });
  saveLiveProjects(updated);
  return updated;
}
