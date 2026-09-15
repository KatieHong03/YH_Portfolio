/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkCaseStudy, BranchingNode, SandboxPlaygroundItem } from './types';

export const CASE_STUDIES: WorkCaseStudy[] = [
  {
    id: 'ra-training',
    title: 'PracticeURWay (The RA training program)',
    subtitle: 'A structured learning website with policy review, scenario-based practice, reflection prompts, and an RA toolbox.',
    category: 'Product Design & Research',
    tag: 'Interactive RA Sandbox',
    isFlagship: true,
    role: 'Lead Educational Product Designer & UX Researcher',
    duration: 'Oct 2025 - Present',
    audience: 'New and returning University of Richmond Resident Assistants responsible for supporting residents, responding to crises, and navigating campus protocols.',
    overview: 'A training website that helps Resident Assistants review key policies, practice emergency decision-making, reflect on their responses, and access essential campus resources.',
    problem: 'RAs need to retain many policies, contacts, and response steps, but traditional training can make it difficult to remember and apply this knowledge confidently during real situations.',
    learningObjectives: [
      'Demonstrate protocol adherence across crisis response levels including mental safety checks and physical escalations.',
      'Formulate empathetic, resident-centered dialogue that preserves institutional trust while ensuring resident wellbeing.',
      'Evaluate situational indicators in real-time to trigger appropriate campus response workflows without diagnostic delay.'
    ],
    designProcess: [
      {
        title: 'Needs Assessment & Performance Gap Analysis',
        description: 'Conducted survey-based needs analysis with campus administrators to discover the key communication gaps in existing RA peer mentorship pathways.'
      },
      {
        title: 'ADDIE Instructional Mapping',
        description: 'Mapped critical scenario pathways from real past incident logs, designing structured decision-points backwards from required safety benchmarks.'
      },
      {
        title: 'Iterative Prototyping & User Testing',
        description: 'Led multiple rounds of iterative user testing cycles with active RAs, refining the navigation, instructional sequencing, and micro-interactive feedback loops.'
      }
    ],
    deliverables: [
      {
        name: 'Modular Branching Scenarios',
        type: 'Interactive EdTech Simulators',
        description: 'Digital simulation modules presenting common RA room-checks and resident-in-crisis interaction paths.'
      },
      {
        name: 'RA Facilitation Guidebooks',
        type: 'Standardized Handouts',
        description: 'Resource briefs containing debriefing questions to guide peer reflection sessions after module completions.'
      },
      {
        name: 'Behavioral Analytics Dashboard',
        type: 'Assessment Tool Blueprint',
        description: 'A layout mapping diagnostic metrics to track aggregate error rates across resident advisor cohorts.'
      }
    ],
    outcomes: {
      metrics: [
        '95% of RAs reported feeling "moderately or highly confident" in applying protocols, up from 40% in baseline surveys.',
        'Interactive decision-making modules showed a 30% speed improvement in selecting appropriate escalation workflows during crisis challenges.',
        'Perfect 100% adherence to critical safety check points during post-training assessments.'
      ],
      summary: 'The curriculum successfully scaled RA preparations, moving RAs from baseline anxiety to active situational readiness. Quantitative user testing proved that scenario-based practice heightened confidence in crisis management.'
    },
    reflection: 'Designing for RAs showed that capability is about safety and muscle memory. By providing low-stress, reflective sandbox formats, RAs are willing to test dangerous options, learn from incorrect choices, and adapt their behaviors without risk.'
  },
  {
    id: 'fsr-product-knowledge',
    title: 'The FSR Product Knowledge Pathway',
    subtitle: 'A tiered blended learning pathway, interactive troubleshooting simulators, and certification system for Field Service Representatives.',
    category: 'Instructional Design & L&D',
    tag: 'Technical Product Enablement',
    isFlagship: true,
    role: 'Lead Instructional Designer & Learning Architect',
    duration: '2024 - 2025',
    audience: 'New and transitioning Field Service / Sales Representatives (FSRs), technical product specialists, and enterprise customer engineering teams.',
    overview: 'A comprehensive product knowledge pathway combining microlearning modules, interactive virtual hardware simulations, diagnostic decision trees, and competency-based milestone assessments.',
    problem: 'Complex multi-system product architectures and fragmented documentation caused prolonged onboarding ramp times, low initial retention, and high diagnostic escalations to senior engineering.',
    learningObjectives: [
      'Accurately identify core architectural components and operational specifications across enterprise product lines.',
      'Execute standardized diagnostic decision trees to isolate fault codes and resolve field anomalies within targeted timeframes.',
      'Demonstrate mastery in customer communication protocols during high-stakes technical troubleshooting calls.'
    ],
    designProcess: [
      {
        title: 'Task Analysis & SME Knowledge Audits',
        description: 'Audited 200+ service escalation tickets and conducted deep-dive interviews with senior field specialists to isolate high-frequency troubleshooting bottlenecks.'
      },
      {
        title: 'Tiered Blended Curriculum Mapping',
        description: 'Designed a 3-tier progressive learning pathway (Foundational Specs → Interactive Scenario Diagnostics → Master Certification) applying cognitive chunking principles.'
      },
      {
        title: 'Simulator Authoring & Pilot Testing',
        description: 'Built branching virtual troubleshooting modules in Articulate Storyline and visual job aids in Figma, validating performance with a pilot cohort of new representatives.'
      }
    ],
    deliverables: [
      {
        name: 'Tiered Blended Learning Pathway',
        type: 'LMS Curriculum Architecture',
        description: 'Structured course paths with sequenced microlearning milestones and automated progress tracking.'
      },
      {
        name: 'Interactive Diagnostic Simulators',
        type: 'Storyline Hardware Simulations',
        description: 'Branching troubleshooting scenarios with realistic telemetry readouts, error code prompts, and immediate corrective guidance.'
      },
      {
        name: 'Pocket Field Job Aids & Cheat Sheets',
        type: 'Digital & Print Quick References',
        description: 'Scannable decision matrices, component pinouts, and step-by-step resolution workflows for active field service.'
      },
      {
        name: 'Kirkpatrick Evaluation Framework',
        type: 'Assessment & Analytics Dashboard',
        description: 'Multi-level evaluation model tracking learner satisfaction, knowledge retention assessments, and field ticket escalation metrics.'
      }
    ],
    outcomes: {
      metrics: [
        'Accelerated new FSR time-to-productivity by 28%, cutting onboarding duration from 8 weeks to under 6 weeks.',
        'Raised first-attempt product knowledge certification pass rate from 68% to 94%.',
        'Decreased field service diagnostic escalation tickets to senior engineering by 35% in the first 90 days post-training.'
      ],
      summary: 'The blended pathway transformed passive product documentation into active, scenario-driven diagnostic capability. Representatives gained real-world confidence before stepping into customer environments, directly improving field resolution speed and customer trust.'
    },
    reflection: 'Effective technical product training requires moving beyond dry specification sheets. When learners practice diagnostic decision-making within realistic virtual simulators and carry clear job aids into the field, knowledge retention converts directly into operational excellence.'
  },
  {
    id: 'columbia-wellness',
    title: 'Engineering Wellness Education (Curriculum design)',
    subtitle: 'Designing multimedia educational campaigns and experiential workshops to support student well-being at Columbia University.',
    category: 'Curriculum Design & Campaigns',
    tag: 'Multimedia Curriculum',
    role: 'Engineering Wellness Education Content Designer',
    duration: 'Sept 2025 - Present',
    audience: '300+ Columbia University Engineering Students',
    overview: 'To reduce acadamic stress faced by engineering students, this project designed multimedia campaigns and interactive experiential training workshops tailored to student wellness outcomes.',
    problem: 'Engineering programs are notoriously rigorous, leading to isolation and high stress. Typical institutional mental wellness campaigns feel generic and fail to engage highly analytical student audiences, resulting in underused resources and low workshop attendance.',
    learningObjectives: [
      'Formulate sustainable stress-reduction routines utilizing certified psychological coping strategies.',
      'Apply healthy conflict-resolution and peer-support skills in collaborative school environments.',
      'Navigate and utilize institutional wellness resources proactively before academic crises arise.'
    ],
    designProcess: [
      {
        title: 'SME Collaboration & Student Panels',
        description: 'Partnered with university counselors and wellness experts to pinpoint key triggers for engineering student anxiety, aligning learning topics with actual clinical data.'
      },
      {
        title: 'Experiential Content Strategy',
        description: 'Drafted workshop curricula that swap abstract lectures with gamified, scenario-based problem-solving, validating materials through peer focus groups.'
      },
      {
        title: 'Media Asset Design & Brand Scaling',
        description: 'Produced over 30 branded physical and digital instructional assets, iterating visual layouts to maintain high engagement rates.'
      }
    ],
    deliverables: [
      {
        name: '30+ Multimedia Branded Assets',
        type: 'Visual Campaign Materials',
        description: 'Instructional posters, guides, social media content, and digital toolkits styled for modern students.'
      },
      {
        name: 'Interactive Experiential Workshops',
        type: 'Facilitation Blueprints',
        description: 'Complete delivery plans, slide decks, and physical activities designed for peer-led workshops.'
      },
      {
        name: 'Standardized Facilitation Workflows',
        type: 'Scalability Documentation',
        description: 'Detailed manuals instructing volunteers how to run small-group wellness check-ins across different departments.'
      }
    ],
    outcomes: {
      metrics: [
        'Successfully initiated workshops engaging over 300+ student engineers across multiple departments.',
        'Produced 30+ custom-branded instructional assets with positive peer review ratings.',
        'Feedback loops logged a 20% increase in students reporting and utilizing university wellness resources.'
      ],
      summary: 'The student-centered approach succeeded in demystifying mental health resources and building actual wellness skills among a highly analytical student cohort.'
    },
    reflection: 'The success of this project relied on bridging clean visual design with active, stigma-free wellness activities. When engineering students analyze stress as a system rather than a private failure, their willingness to engage skyrockets.'
  },
  {
    id: 'comma-reading',
    title: 'Digital Reading Scaffolds (Instructional design)',
    subtitle: 'Usability and content architecture updates for digital children\'s reading pathways, improving learner comprehension and engagement.',
    category: 'Instructional Design & LMS',
    tag: 'Usability & Content Architecture',
    role: 'Instructional Designer Intern',
    duration: 'June 2025 - August 2025',
    audience: 'ESL / ELL Digital Learners navigating reading curriculums',
    overview: 'At Comma Reading, Yuting led learner analysis and usability investigations to identify comprehension and navigation friction points, curating reading modules and designing high-fidelity UI prototypes.',
    problem: 'Young learners often disengage with digital reading software due to visual overload, confusing navigation systems, and a lack of adaptive scaffolding, leading to low book-completion rates and poor reading outcome retention.',
    learningObjectives: [
      'Navigate digital reading modules independently with minor scaffolding.',
      'Demonstrate active comprehension of reading modules by passing aligned micro-assessments.',
      'Maintain voluntary daily reading habits within gamified digital book selections.'
    ],
    designProcess: [
      {
        title: 'Usability Audits & Learner Interviews',
        description: 'Conducted user research to spot areas where children hesitated, misclicked, or abandoned reading paths, revealing significant navigation hurdles.'
      },
      {
        title: 'Multimodal Scaffold Engineering',
        description: 'Developed and quality-checked over 200 reading resources, applying dual-coding theory to combine visual and audio cues to enhance learner retention.'
      },
      {
        title: 'LMS Content Restructuring',
        description: 'Curated and structured over 80 book series into clear, sequenced LMS learning modules maps, making search and discovery intuitive.'
      }
    ],
    deliverables: [
      {
        name: '200+ Multimodal Resources',
        type: 'Interactive Media Assets',
        description: 'Custom illustration cues, reading guides, assessment questions, and vocabulary flashcard systems.'
      },
      {
        name: 'LMS Content Architecture',
        type: 'Course Path Configurations',
        description: 'Structured pathways mapping books into pedagogical levels that balance difficulty and engagement.'
      },
      {
        name: 'High-Fidelity Figma UI Prototypes',
        type: 'Product Blueprints',
        description: 'Detailed interface layouts and mockups tested for child ergonomics and intuitive navigation.'
      }
    ],
    outcomes: {
      metrics: [
        'Curated and launched 80+ book series into pedagogical modules, increasing reading engagement metrics by 20%.',
        'Created 200+ top-tier interactive media resources validated by child educators.',
        'Figma prototypes successfully guided backend engineering iterations for child usability.'
      ],
      summary: 'Iterative prototype testing and system restructuring turned reading from a task into a friendly habit, minimizing interaction friction for young minds.'
    },
    reflection: 'Designing for kids requires stripping away visual clutter. If a child has to wonder where to click next, their cognitive bandwidth is wasted on UI mechanics instead of reading comprehension.'
  },
  {
    id: 'mentor-a-promise',
    title: 'L&D Youth Empowerment (Mentor A Promise)',
    subtitle: 'Designing social-emotional learning (SEL) modules and training guidelines to improve reflection quality and emotional articulation.',
    category: 'L&D // Social-Emotional Learning',
    tag: 'SEL & Facilitation Guides',
    role: 'Learning & Development Intern',
    duration: 'Sept 2025 - Present',
    audience: 'At-risk youth and program mentors within NY community networks',
    overview: 'At Mentor A Promise, this project conducts instructional needs assessments to design social-emotional (SEL) and arts-based curricula. We build learner-centered facilitation schemes to engage youth with mentors.',
    problem: 'Youth mentors often lack formal pedagogical backgrounds, leading them to use overly academic or lecturing styles. Consequently, youth participants disengage, show superficial reflection, or hesitate to share ideas.',
    learningObjectives: [
      'Articulate complex emotions and self-reflection points using arts-based expression strategies.',
      'Express active social-emotional reflection during mentor-led discussion sessions.',
      'Formulate peer-support bonds across structured community learning cohorts.'
    ],
    designProcess: [
      {
        title: 'Instructional Needs Assessments',
        description: 'Identified developmental and reflective gaps in youth cohorts using qualitative survey measures and program observation.'
      },
      {
        title: 'ADDIE Curriculum Synthesis',
        description: 'Built customized SEL guidelines integrating arts and storytelling, focusing on low-barrier entry exercises.'
      },
      {
        title: 'Mentor Training Scaffolds',
        description: 'Partnered closely with mentors to train them in youth-centered active listening and conversational strategies, replacing flat lecturing structures.'
      }
    ],
    deliverables: [
      {
        name: 'Arts-Based SEL Curriculum',
        type: 'Learning Modules Workbook',
        description: 'Custom storytelling guides, worksheets, and drawing prompts configured for emotional expression.'
      },
      {
        name: 'Mentor Facilitation Guides',
        type: 'Operational Playbooks',
        description: 'Comprehensive coaching sheets containing ice-breakers, active-listening rubrics, and conflict protocols.'
      },
      {
        name: 'L&D Evaluation Survey Deck',
        type: 'Feedback Instruments',
        description: 'Low-stress qualitative assessments to monitor engagement and reflection trends.'
      }
    ],
    outcomes: {
      metrics: [
        'Collaborative facilitation adjustments increased youth class participation by 20% compared to traditional models.',
        '100% of volunteer mentors reported improved confidence in delivering active emotional support.',
        'Achieved deep, qualitative storytelling markers across 85% of participant workbook entries.'
      ],
      summary: 'The custom L&D framework helped mentors speak the language of youths. Under the new curriculum, youth engagement rates rose sharply, producing richer self-reflections and genuine mentorship relationships.'
    },
    reflection: 'Pedagogy isn\'t only for institutional students. In community environments, instructions are relationships. Empowering mentors to facilitate instead of lecture bridges the gap to genuine youth participation.'
  }
];

// PLAYGROUND CONTENT: High Fidelity Interactive Simulator Paths
export const BRANCHING_SCENARIO: BranchingNode[] = [
  {
    id: 'start',
    text: 'You are designing an AI onboarding tool for junior customer service reps. Your goal is to maximize their active listening skills without overwhelming them. On Day 1, how do you kick off the learner\'s journey?',
    question: 'Choose your instructional strategy:',
    choices: [
      {
        text: 'Give them a 45-slide slide-deck covering the historical development of remote active listening models.',
        nextNodeId: 'slides_death',
        feedback: 'Oh no! The dreaded "Death by PowerPoint." Cognitive load spikes instantly. The junior reps are already scrolling social media. Graduation outcomes look grim.',
        scoreChange: -15
      },
      {
        text: 'Drop them straight into a simulated chat window where a furious customer is typing, alongside clear, in-context hints.',
        nextNodeId: 'furious_cust',
        feedback: 'Excellent choice! This is an active "Productive Failure" paradigm of the SAM model (Successive Approximation Model). Empathy is piqued!',
        scoreChange: 25
      },
      {
        text: 'Require them to pass a 50-question multiple choice vocabulary assessment about empathy theory.',
        nextNodeId: 'quiz_death',
        feedback: 'Ugh. You are testing academic recall rather than practical behavioral skills. They feel like they are studying psychology, not acting as customer helpers.',
        scoreChange: -5
      }
    ]
  },
  {
    id: 'slides_death',
    text: 'The learner is completely disengaged. Some reps dropped out of the session. A manager calls noting that "retention is flat." You need to switch tactics immediately. How do you recover?',
    question: 'Choose your recovery tactic:',
    choices: [
      {
        text: 'Pivot to an interactive diagnostic exercise where reps review a recorded chat and tag the moment empathy was broken.',
        nextNodeId: 'diagnostic_route',
        feedback: 'Great save! Moving from passive text to active analysis immediately triggers deeper cognitive processing (Bloom\'s Taxonomy Analyze level).',
        scoreChange: 15
      },
      {
        text: 'Send a reminder that completing the slide-deck is mandatory for internal compliance.',
        nextNodeId: 'fail_compliance',
        feedback: 'Boom. Compliance hammer. It makes them hate learning and complete it cursorily. Performance metrics remain flat.',
        scoreChange: -20
      }
    ]
  },
  {
    id: 'quiz_death',
    text: 'Recalls scores are high, but the very first day on real support chats, junior reps are freezing or typing cold answers. The VP of Support is skeptical about your instructional design. What do you do?',
    question: 'How do you fix this application gap?',
    choices: [
      {
        text: 'Rebuild with interactive simulations, replacing the multiple choice tests with situational performance checkpoints.',
        nextNodeId: 'furious_cust',
        feedback: 'Spot on! Real capability is proven through action, not theoretical multiple-choice. This saves the project.',
        scoreChange: 20
      },
      {
        text: 'Double down by adding a secondary lecture on telemedicine psychology.',
        nextNodeId: 'total_fail',
        feedback: 'Oh my. Pouring more water on a drowning person. They leave the company in frustration. Project declared a failure.',
        scoreChange: -30
      }
    ]
  },
  {
    id: 'furious_cust',
    text: 'A chatbot simulation displays: "I\'ve been waiting for 35 minutes! This is ridiculous! Just refund my credit card immediately!" How do you instruct the reps to answer first?',
    question: 'Which pedagogical cue do you active-scaffold first?',
    choices: [
      {
        text: 'The Procedural: "We refund within 5 days. What is your account ID?"',
        nextNodeId: 'procedural_stiffness',
        feedback: 'The customer feels ignored. Empathy score sinks. You missed a vital teaching moment: validating emotion before action.',
        scoreChange: -5
      },
      {
        text: 'The Empathic Validator: "I hear how frustrating that wait is. Let\'s resolve this credit card charge for you right now."',
        nextNodeId: 'celebrate_success',
        feedback: 'Superb! You\'ve practiced validation first. Relieving transactional friction while demonstrating instant support.',
        scoreChange: 30
      }
    ]
  },
  {
    id: 'diagnostic_route',
    text: 'By analyzing actual client conversations, junior reps start highlighting the exact conversational turning points. They request extra sandbox practice to build confidence before taking live phone lines.',
    question: 'What platform do you use to scale this practice?',
    choices: [
      {
        text: 'Create a lightweight, digital choice-tree sandbox playable on any mobile device during down-times.',
        nextNodeId: 'celebrate_success',
        feedback: 'Fantastic! Scalable, self-paced, microlearning. Designers love it; learners execute beautifully.',
        scoreChange: 25
      },
      {
        text: 'Schedule live roleplay phone calls that require booking calendar blocks with busy senior reps.',
        nextNodeId: 'roleplay_bottleneck',
        feedback: 'Though highly personal, this introduces a huge scheduling bottleneck. Senior employees get annoyed and onboarding slows.',
        scoreChange: -10
      }
    ]
  },
  {
    id: 'procedural_stiffness',
    text: 'The customer escalates, demanding a supervisor. The virtual simulator lights up with red critical alert. You need to salvage the situation.',
    question: 'How do you train them to handle the critical alert?',
    choices: [
      {
        text: 'Apologize for the friction, acknowledge the wait, and immediately provide the refund with a personal note.',
        nextNodeId: 'celebrate_success',
        feedback: 'Nice rescue. You taught the rep how to pivot when emotional thresholds are violated. Level cleared!',
        scoreChange: 15
      },
      {
        text: 'Instruct them to quote terms and conditions page 14.',
        nextNodeId: 'total_fail',
        feedback: 'Unacceptable. The automated customer hangs up and writes a devastating 1-star social media post. Game over.',
        scoreChange: -25
      }
    ]
  },
  {
    id: 'roleplay_bottleneck',
    text: 'Onboarding is clogged with calendar scheduling conflicts. Junior reps sit idle for days waiting for their roleplay partner. You need to automate the peer roleplay loop.',
    question: 'How do you automate this peer session securely?',
    choices: [
      {
        text: 'Implement peer-to-peer review boards where learners submit audio prompts for community feedback rubrics.',
        nextNodeId: 'celebrate_success',
        feedback: 'Outstanding! Peer-assessment triggers collaborative social-learning. It keeps onboarding fast while fostering community.',
        scoreChange: 20
      },
      {
        text: 'Tell them to practice with an actor at home.',
        nextNodeId: 'total_fail',
        feedback: 'Unprofessional guidance. You failed to establish a standardized learning environment.',
        scoreChange: -20
      }
    ]
  },
  {
    id: 'celebrate_success',
    text: 'Success! Your instructional intervention has doubled the reps empathy scores in pilot audits. The VP promotes your curriculum framework as the new internal corporate benchmark!',
    question: 'Project is complete!',
    choices: []
  },
  {
    id: 'fail_compliance',
    text: 'Learners are checking boxes absent-mindedly. Behavioral change is non-existent. The executive sponsor cancels the funding. Game Over.',
    question: 'Project failed.',
    choices: []
  },
  {
    id: 'total_fail',
    text: 'The program is cancelled due to poor feedback and zero measurable outcomes. Play again!',
    question: 'Try a different strategy next time:',
    choices: []
  }
];

// DIGITAL SPECIFICATIONS SYSTEM (Fulfills deliverables 1-12 in rich interactive system)
export interface PortfolioSpecSection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string;
}

export const PORTFOLIO_SPECS = {
  sitemap: {
    title: '1. Fully Realized Sitemap',
    description: 'This single-page portfolio application implements a highly streamlined, modern site architecture that minimizes click friction for prospective recruiters and hiring managers.',
    nodes: [
      {
        name: 'Portfolio Root (index.html)',
        details: 'Self-contained, lightning-fast React SPA architecture with persistent, micro-interactive main navigation.',
        children: [
          {
            name: 'About Section',
            details: 'Includes Greeting Banner, Personal Biography, Core Design Philosophy, Areas of Expertise, Skills & Tools grid, and this interactive Portfolio Architecture Blueprint.'
          },
          {
            name: 'Work (Case Studies)',
            details: 'Strategic "Proof of Capability" view. Detailed, multi-layered tabbed sliders built specifically for recruitment inspection. Non-linear, highly readable, structured case reports.'
          },
          {
            name: 'Playground (Interactive Lab)',
            details: 'Highly immersive sandbox including Branching Scenario Simulator, diagnostic matrices, and tactile design systems. Reinforces EdTech proficiency.'
          },
          {
            name: 'Connect (Contact Hub)',
            details: 'Polished micro-portal housing recruiter calls to action, resume downloads, email triggers, and high-quality portfolio meta-descriptions.'
          }
        ]
      }
    ]
  },
  designSystem: {
    title: '4 & 5. Design System & Morandi/Macaron Color Palette',
    description: 'A bespoke design standard merging technical functionality with gentle educational textures. A peaceful alternative to sterile corporate grids.',
    colors: [
      { name: 'Sage Green', hex: '#A8C3A0', purpose: 'Primary brand identifier, micro-learning status highlights, and success states.' },
      { name: 'Dusty Blue', hex: '#AFC4D5', purpose: 'Secondary elements, passive information badges, and timeline indicators.' },
      { name: 'Muted Lavender', hex: '#CFC5E8', purpose: 'Accents, creative project highlights, interactive indicators, and focus outlines.' },
      { name: 'Soft Peach', hex: '#F4C9B8', purpose: 'Highlights, warning hints, gamified score indicators, and CTA accents.' },
      { name: 'Warm Beige', hex: '#FAF8F3', purpose: 'Core application background, replacing harsh high-contrast pure white.' },
      { name: 'Charcoal Text', hex: '#2D312E', purpose: 'High-contrast typography to ensure Web Content Accessibility Compliance (WCAG).' }
    ],
    typography: [
      { element: 'Primary Display Headings & Titles', font: 'LL Bradford by Lineto', details: 'A contemporary serif typeface with warm, humanistic, and highly structured details. Used for titles, headings, and key display statements to convey literary depth and academic poise.' },
      { element: 'Body Copy & Content', font: 'Söhne by Klim Type Foundry', details: 'A precise, high-clarity neo-grotesque sans-serif that projects crisp modernist elegance and readability across dense instructional texts.' },
      { element: 'Metadata & Code Indicators', font: 'JetBrains Mono', details: 'Used for learning parameters (e.g. [Audience], [ Kirkpatrick Level ]). Signals technical posture, AI fluency, and analytical precision.' }
    ],
    componentHierarchy: [
      { level: 'Root Structure', components: ['App.tsx', 'main.tsx'] },
      { level: 'Layout & Navigation', components: ['Navbar.tsx', 'PageWrapper.tsx'] },
      { level: 'Feature Containers', components: ['AboutView.tsx', 'WorkView.tsx', 'PlaygroundView.tsx', 'ConnectView.tsx'] },
      { level: 'Core Components', components: ['BranchingSimulator.tsx', 'LXDCardDeck.tsx', 'PortfolioSpecs.tsx'] }
    ]
  },
  interactionDesign: [
    { title: 'Subtle Micro-Interactions', detail: 'Buttons scale organically (98%) on click. Elements glide gently in response to hover triggers to establish virtual feedback.' },
    { title: 'Smooth Tab Transitions', detail: 'Tab shifts utilize absolute-fade layout transitions to prevent viewport jerking during long-scroll exploration.' },
    { title: 'Card-Based Layouts', detail: 'Every piece of metadata sits in curved, low-weight cards (rounded-2xl) featuring soft clay shadows.' },
    { title: 'Responsive Density', detail: 'On desktop, elements are split into side-by-side bento layouts to optimize negative space. On mobile, elements fall into a clean single-scroll card order.' }
  ],
  memorableTriggers: [
    { title: 'The Interactive Playable Sandbox', detail: 'Instead of simply describing branching scenarios, recruiters actively play one on Page 3. This is instant evidence of interactive design skill.' },
    { title: 'The Blueprint Toggle', detail: 'The portfolio website documents itself completely inside this section. This proves the candidate operates as a product and learning design engineer.' },
    { title: 'Clear Strategic Positioning', detail: 'Zero academic research clutter. The copywriting is laser-targeted on L&D metrics: ROI, time-to-onboard, and active behavioral change.' }
  ],
  lxdSuggestions: [
    { title: 'Avoid "Study" Language', detail: 'Hiring directors at Amazon or Google care about behavioral outcomes. Frame projects around business impact, user friction, and product adoption.' },
    { title: 'Lead with Problem, Not Tools', detail: 'Do not brag about Storyline or Captivate. Highlight cognitive workflows, user-testing prototypes, and Kirkpatrick evaluation framework depth.' },
    { title: 'Show AI Collaboration', detail: 'L&D teams are rushing to embed generative AI. Showcase yourself leading this charge by displaying concrete pedagogical AI prompting copilots.' }
  ]
};
