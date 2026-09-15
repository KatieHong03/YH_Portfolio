/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { safeLocalStorageSet } from './imageCompressor';

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
    types: ['Instructional Design', 'Prototypes'],
    overview: 'A training website that helps Resident Assistants review key policies, practice emergency decision-making, reflect on their responses, and access essential campus resources.',
    audience: 'University RAs responsible for active duty safety protocols and crisis response.',
    challenge: 'Information overload from 100+ page policy binders makes rapid, confident decision-making difficult during live crises.',
    solution: 'A high-accessibility web portal integrating branching scenario simulations, instant knowledge checks, and a consolidated mobile-friendly resource utility.',
    externalUrl: 'https://sites.google.com/view/practice-ur-way/ra-toolbox',
    process: {
      needsAnalysis: 'Reviewed three years of crisis logs and interviewed housing stakeholders to locate protocol bottlenecks.',
      learningObjectives: 'Established measurable target metrics for emergency response times and policy-compliant safety checks.',
      designDevelopment: 'Developed high-fidelity UI layouts in Figma and authored interactive branching scenarios.',
      implementation: 'Launched the training portal on Google Sites with built-in reflection feedback prompts.'
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
      'Curriculum Design',
      'eLearning Development',
      'Facilitation',
      'Learning Evaluation'
    ],
    skills: ['ADDIE', 'Needs Analysis', 'Learning Evaluation'],
    timeline: '2025',
    outcomeMetric: '95% Rating',
    metricsList: [
      { value: '15%', label: 'Engagement Increase' },
      { value: '95%', label: 'Rated Experience 5/5' },
      { value: '2.4x', label: 'Safety Confidence' }
    ],
    displayPlaceholders: [
      { title: "Google Site Hub", description: "Centralized digital policy center & mobile toolkit for active duty RAs.", icon: "Layers", externalUrl: "https://sites.google.com/view/practice-ur-way/ra-toolbox", imageUrl: "/images/ra-training-display-01.png" },
      { title: "Interactive Scenario Practices", description: "Scenario simulator with branching decision points & protocol guides.", icon: "Compass", externalUrl: "https://docs.google.com/presentation/d/1Cy0W_el54MJqr-ncG5eqtOHZ8TtFPJDAXkX2TWgyLKQ/present?slide=id.g4dfce81f19_0_45", imageUrl: "/images/ra-training-display-02.png" },
      { title: "Tutorial Video", description: "Screencast walk-through detailing UI features and RA toolkit usage.", icon: "Video", imageUrl: "/images/ra-training-display-03.png" },
      { title: "Guides & Checklists", description: "Centralized emergency response sheets and active checklist guides.", icon: "CheckSquare", imageUrl: "/images/ra-training-display-04.png" }
    ]
  },
  {
    id: 'fsr-product-knowledge',
    title: 'The FSR Product Knowledge Pathway',
    cardImage: '/images/fsr-learning-pathway-cover.jpg',
    isFlagship: true,
    projectType: 'InstructionD Design',
    types: ['Instructional Design', 'eLearning', 'Learning & Development'],
    overview: 'A tiered blended learning pathway, interactive troubleshooting simulators, and certification system for Field Service Representatives.',
    audience: 'New and transitioning Field Service / Sales Representatives (FSRs), technical product specialists, and enterprise customer engineering teams.',
    challenge: 'Complex multi-system product architectures and fragmented documentation caused prolonged onboarding ramp times, low initial retention, and high diagnostic escalations to senior engineering.',
    solution: 'Designed a modular, scenario-driven learning pathway integrating microlearning modules, interactive virtual hardware simulators, pocket-sized diagnostic job aids, and tiered certification milestones.',
    process: {
      needsAnalysis: 'Audited 200+ service escalation tickets and conducted deep-dive interviews with senior field specialists to isolate high-frequency troubleshooting bottlenecks.',
      learningObjectives: 'Mapped behavioral competency benchmarks for product architecture identification, error code diagnostics, and rapid on-site resolution.',
      designDevelopment: 'Developed interactive branching scenarios in Articulate Storyline, authored micro-modules in Rise, and designed scannable visual reference guides in Figma.',
      implementation: 'Deployed the curriculum across enterprise LMS cohorts with integrated knowledge checks, manager observation rubrics, and automated certification tracking.'
    },
    deliverables: [
      'Blended Learning Pathway',
      'Interactive Storyline Simulators',
      'Microlearning Modules',
      'Diagnostic Job Aids & Cheat Sheets',
      'Milestone Assessments',
      'Manager Coaching Rubrics'
    ],
    tools: [
      'Articulate Storyline',
      'Articulate Rise',
      'Figma',
      'LMS Platform',
      'Adobe Illustrator',
      'Canva'
    ],
    impact: '',
    skillsDemonstrated: [
      'ADDIE',
      'Curriculum Design',
      'eLearning Development',
      'Blended Learning',
      'Needs Analysis',
      'Learning Evaluation'
    ],
    skills: ['ADDIE', 'Storyline', 'Needs Analysis', 'LMS', 'Curriculum Design', 'Learning Evaluation'],
    timeline: '2024–2025',
    outcomeMetric: '28% Faster Ramp',
    metricsList: [
      { value: '28%', label: 'Ramp Time Reduction' },
      { value: '94%', label: 'Certification Pass Rate' },
      { value: '-35%', label: 'Field Escalation Drop' }
    ],
    displayPlaceholders: [
      { title: "Pathway Curriculum Architecture", description: "Tiered learning roadmap mapping foundational specs to advanced diagnostics.", icon: "Map", imageUrl: "/images/fsr-learning-pathway-cover.jpg" },
      { title: "Interactive Product Simulator", description: "Branching virtual troubleshooting simulator with real-time feedback.", icon: "Sliders", imageUrl: "/images/cognitive-load-cover.jpg" },
      { title: "Diagnostic Field Job Aids", description: "Pocket-sized quick-reference decision trees and error code lookup guides.", icon: "CheckSquare", imageUrl: "/images/columbia-wellness-display-01.png" },
      { title: "Competency & Assessment Dashboard", description: "Kirkpatrick Level 2 & 3 evaluation metrics and cohort performance tracker.", icon: "BarChart3", imageUrl: "/images/columbia-wellness-display-02.png" }
    ]
  },
  {
    id: 'columbia-wellness',
    title: 'STEM Wellness Program Design',
    cardImage: '/images/columbia-wellness-cover.jpg',
    projectType: 'Curriculum Design',
    types: ['Learning & Development', 'Program Design', 'Wellness Education'],
    overview: 'An interactive outreach and curriculum framework delivering low-barrier mental health programming and community-led workshops for Columbia Engineering students.',
    audience: 'Columbia Engineering students managing high academic pressure and rigorous schedules.',
    challenge: 'Existing campus mental health resources felt clinical and disconnected, leading to low student engagement.',
    solution: 'Built highly visible peer-centered campaigns, bite-sized curriculum guides, and community-led workshops using interactive materials.',
    process: {
      needsAnalysis: 'Analyzed campus communication gaps and conducted student focus groups to assess wellness bottlenecks.',
      learningObjectives: 'Mapped student-first workshop formats and designed dynamic newsletter communication strategies.',
      designDevelopment: 'Designed interactive visual assets in Canva/Figma and created targeted workshop templates.',
      implementation: 'Rolled out workshops and refined communication channels based on feedback.'
    },
    deliverables: [
      'Instagram campaign posts',
      'wellness newsletter',
      'event proposal',
      'execution plan',
      'vendor list and proposal',
      'website refinement',
      'workshop materials'
    ],
    tools: [
      'Figma',
      'Canva',
      'Vyond',
      'Adobe Illustrator',
      'PowerPoint'
    ],
    impact: '',
    skillsDemonstrated: [
      'Curriculum Design',
      'Facilitation',
      'Needs Analysis',
      'Learning Evaluation'
    ],
    skills: ['Workshop Design', 'Facilitation', 'Needs Analysis'],
    timeline: '2024–Present',
    outcomeMetric: '33% Growth',
    metricsList: [
      { value: '+33%', label: 'Attendance Growth' },
      { value: '400+', label: 'Engaged Students' },
      { value: '100%', label: 'Program Viability' }
    ],
    displayPlaceholders: [
      { title: "Stress Systems Map", description: "Cognitive-load modeling explaining fatigue as systemic signal blocks.", icon: "Sliders", imageUrl: "/images/columbia-wellness-display-01.png" },
      { title: "Workshop Conversation Cards", description: "Structured discussion cards designed for student group check-ins.", icon: "BookOpen", imageUrl: "/images/columbia-wellness-display-02.png" },
      { title: "STEM Infographic Graphics", description: "High-impact visual summaries tailored for STEM student spaces.", icon: "Image", imageUrl: "/images/columbia-wellness-display-03.png" },
      { title: "Evaluation Performance Index", description: "Satisfaction tracker and engagement outcome metric dashboard.", icon: "BarChart3", imageUrl: "/images/generic-placeholder.jpg" }
    ]
  },
  {
    id: 'comma-reading',
    title: 'Digital Reading Scaffolds',
    cardImage: '/images/comma-reading-cover.jpg',
    projectType: 'eLearning',
    types: ['Instructional Design', 'eLearning'],
    overview: 'Interactive Storyline reading overlays, audio-visual scaffolds, and phonics scaffolding engineered for ESL / ELL learners to improve vocabulary retention and reduce cognitive load.',
    audience: 'ESL / ELL students, early language learners, literacy specialists, and reading coaches.',
    challenge: 'ESL / ELL readers experience cognitive fatigue, comprehension barriers, and high abandonment rates when navigating complex digital English texts without dual-coded scaffolding.',
    solution: 'Engineered 200+ Articulate Storyline interactive hot-spots coupling spoken audio pronunciation prompts with descriptive visual graphics and vocabulary popups.',
    process: {
      needsAnalysis: 'Conducted learner eye-tracking, ESL vocabulary hurdle reviews, and tablet click testing to pinpoint interaction distractions.',
      learningObjectives: 'Defined clear objectives to increase ebook completion rates, phonics recognition, and English language comprehension.',
      designDevelopment: 'Designed responsive illustrated layouts in Figma and programmed click-to-play audio-visual triggers in Storyline.',
      implementation: 'Integrated interactive modules into LMS reading portals for weekly sessions.'
    },
    deliverables: [
      'eLearning Module',
      'Scenario-Based Activities',
      'Assessment',
      'Job Aid'
    ],
    tools: [
      'Articulate Storyline',
      'Figma',
      'LMS Platform',
      'PowerPoint'
    ],
    impact: 'Identified ESL learners’ reading challenges and support needs.',
    skillsDemonstrated: [
      'ADDIE',
      'Curriculum Design',
      'eLearning Development',
      'ESL / ELL Scaffolding',
      'Learning Evaluation'
    ],
    skills: ['Storyline', 'LMS', 'ADDIE'],
    timeline: '2024',
    outcomeMetric: '+18% Engagement',
    metricsList: [
      { value: '20k+', label: 'Engaged Learners' },
      { value: '+18%', label: 'Reading Engagement' },
      { value: '15+', label: 'Published Textbooks' }
    ],
    displayPlaceholders: [
      { title: "Interactive Touch-Target Map", description: "Ergonomically spaced target maps for language learners in Figma.", icon: "Tablet", imageUrl: "/images/comma-reading-cover.jpg" },
      { title: "Storyline Sound Triggers", description: "Auditory phonics cues synchronized with reading overlays.", icon: "Volume2", imageUrl: "/images/generic-placeholder-kids.jpg" },
      { title: "LMS Learning Path Blueprint", description: "LMS-integrated curriculum mapping for weekly sessions.", icon: "Map", imageUrl: "/images/columbia-wellness-display-01.png" },
      { title: "Progress Report Sheet", description: "Minimalist learner-centered reading log and dashboard templates.", icon: "CheckSquare", imageUrl: "/images/columbia-wellness-display-02.png" }
    ]
  },
  {
    id: 'mentor-promise',
    title: 'Social-Emotional Mentoring Curriculum',
    cardImage: '/images/mentor-promise-cover.jpg',
    projectType: 'L&D',
    types: ['Learning & Development', 'Research'],
    overview: 'A modern social-emotional (SEL) curriculum and interactive training guide that equips adult mentors with developmental conversation tools.',
    audience: 'L&D coordinators, community mentors, and adolescent workshop participants.',
    challenge: 'Mentors often default to lecturing or dry instruction, causing teenagers to disconnect during sensitive mentoring discussions.',
    solution: 'Developed structured workbook drawings and reflective card prompts to scaffold youth reflection and emotional articulation.',
    process: {
      needsAnalysis: 'Audited mentor communication styles using surveys and session observation reports.',
      learningObjectives: 'Designed milestones to facilitate genuine youth-led discussion and trust-building.',
      designDevelopment: 'Authored high-impact visual workbooks, prompt-card templates, and flexible workshop lesson plans.',
      implementation: 'Conducted live rehearsal sessions for mentors and shipped print kits to urban community centers.'
    },
    deliverables: [
      'Facilitator Guide',
      'Workshop',
      'Scenario-Based Activities',
      'Job Aid'
    ],
    tools: [
      'Canva',
      'Figma',
      'PowerPoint',
      'Adobe InDesign'
    ],
    impact: '',
    skillsDemonstrated: [
      'Curriculum Design',
      'Facilitation',
      'Learning Evaluation'
    ],
    skills: ['Needs Analysis', 'Facilitation', 'Learning Evaluation'],
    timeline: '2025',
    outcomeMetric: '100% Confident',
    metricsList: [
      { value: '+20%', label: 'Group Dialogue Rate' },
      { value: '100%', label: 'Mentor Self-Efficacy' },
      { value: 'SEL', label: 'Framework Aligned' }
    ],
    displayPlaceholders: [
      { title: "Competency Mapping", description: "Social-emotional competence mappings for drawing exercises.", icon: "GitMerge", imageUrl: "/images/mentor-promise-cover.jpg" },
      { title: "Adolescent Workbook Layouts", description: "High-engagement print sheets styled in Adobe InDesign.", icon: "PenTool", imageUrl: "/images/generic-placeholder.jpg" },
      { title: "Mentor Dialogue Pocket Cards", description: "Pocket guides with conversational coaching triggers.", icon: "HelpCircle", imageUrl: "/images/columbia-wellness-display-03.png" },
      { title: "Relational Evaluation Panel", description: "Self-efficacy trackers assessing student safety metrics.", icon: "Heart", imageUrl: "/images/generic-placeholder-kids.jpg" }
    ]
  }
];

export const STORAGE_KEY_PROJECTS = 'portfolio_projects_data';
export const EVENT_PROJECTS_UPDATED = 'portfolio_projects_data_updated';

/**
 * Helper to normalize image URLs so legacy /assets/ paths map to clean /images/ paths
 */
function normalizeImageUrl(url?: string): string | undefined {
  if (!url) return url;
  if (url.startsWith('/assets/')) {
    const filename = url.replace('/assets/', '').replace(/_/g, '-').toLowerCase();
    return `/images/${filename}`;
  }
  return url;
}

/**
 * Loads all live projects, seamlessly merging default CANONICAL_PROJECTS with any user customizations saved in localStorage.
 */
export function getLiveProjects(): Project[] {
  const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
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
 * Saves projects array to localStorage and broadcasts an update event to all active views.
 */
export function saveLiveProjects(projects: Project[]): void {
  safeLocalStorageSet(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  window.dispatchEvent(new Event(EVENT_PROJECTS_UPDATED));
  window.dispatchEvent(new Event('storage'));
}

/**
 * Updates a project's cover image.
 */
export function updateProjectCoverImage(projectId: string, newImage: string): Project[] {
  const current = getLiveProjects();
  const updated = current.map((p) => {
    if (p.id === projectId) {
      return { ...p, cardImage: newImage };
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
  const updated = current.map((p) => {
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
  saveLiveProjects(updated);
  return updated;
}
