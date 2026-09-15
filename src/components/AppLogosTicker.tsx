/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface AppLogoItem {
  id: string;
  name: string;
  category: string;
  iconBg: string;
  iconBorder: string;
  icon: React.ReactNode;
}

export const APP_LOGOS: AppLogoItem[] = [
  {
    id: 'articulate-360',
    name: 'Articulate 360',
    category: 'Storyline & Rise 360',
    iconBg: 'bg-[#F0FDF4]',
    iconBorder: 'border-emerald-200',
    icon: (
      <svg className="w-5 h-5 rounded-md overflow-hidden" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="articulateBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E54B7" />
            <stop offset="35%" stopColor="#0B8793" />
            <stop offset="70%" stopColor="#1BA848" />
            <stop offset="100%" stopColor="#9BD838" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="20" fill="url(#articulateBrandGrad)" />
        {/* Exact Articulate A Mark */}
        <path
          d="M 43.5 28 H 56.5 L 77.5 76 H 63 L 50 43.5 L 37 76 H 22.5 L 43.5 28 Z"
          fill="white"
        />
      </svg>
    )
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'UI/UX & Prototyping',
    iconBg: 'bg-[#FAF5FF]',
    iconBorder: 'border-purple-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M8 2.5C6.34 2.5 5 3.84 5 5.5C5 7.16 6.34 8.5 8 8.5H12V2.5H8Z" fill="#F24E1E" />
        <path d="M12 2.5H16C17.66 2.5 19 3.84 19 5.5C19 7.16 17.66 8.5 16 8.5C14.34 8.5 13 7.16 13 5.5V2.5H12Z" fill="#FF7262" />
        <path d="M12 8.5H16C17.66 8.5 19 9.84 19 11.5C19 13.16 17.66 14.5 16 14.5C14.34 14.5 13 13.16 13 11.5V8.5H12Z" fill="#1ABCFE" />
        <path d="M8 8.5C6.34 8.5 5 9.84 5 11.5C5 13.16 6.34 14.5 8 14.5H12V8.5H8Z" fill="#A259FF" />
        <path d="M8 14.5C6.34 14.5 5 15.84 5 17.5C5 19.16 6.34 20.5 8 20.5C9.66 20.5 11 19.16 11 17.5V14.5H8Z" fill="#0ACF83" />
      </svg>
    )
  },
  {
    id: 'canvas-lms',
    name: 'Canvas LMS',
    category: 'Learning Management',
    iconBg: 'bg-[#FEF2F2]',
    iconBorder: 'border-red-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#E62429" />
        <circle cx="12" cy="5.5" r="1.6" fill="white" />
        <circle cx="16.5" cy="7.5" r="1.6" fill="white" />
        <circle cx="18.5" cy="12" r="1.6" fill="white" />
        <circle cx="16.5" cy="16.5" r="1.6" fill="white" />
        <circle cx="12" cy="18.5" r="1.6" fill="white" />
        <circle cx="7.5" cy="16.5" r="1.6" fill="white" />
        <circle cx="5.5" cy="12" r="1.6" fill="white" />
        <circle cx="7.5" cy="7.5" r="1.6" fill="white" />
        <circle cx="12" cy="12" r="2.8" fill="white" />
      </svg>
    )
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'Docs, Slides & Forms',
    iconBg: 'bg-[#EFF6FF]',
    iconBorder: 'border-blue-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
    )
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    category: 'Gemini Prototyping',
    iconBg: 'bg-[#EEF2FF]',
    iconBorder: 'border-indigo-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="aiStudioGrad1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4285F4" />
            <stop offset="0.5" stopColor="#9B72CB" />
            <stop offset="1" stopColor="#D96570" />
          </linearGradient>
        </defs>
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#aiStudioGrad1)" />
      </svg>
    )
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'PowerPoint, Teams & Word',
    iconBg: 'bg-[#F0F9FF]',
    iconBorder: 'border-sky-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9" height="9" fill="#F25022" rx="1" />
        <rect x="13" y="2" width="9" height="9" fill="#7FBA00" rx="1" />
        <rect x="2" y="13" width="9" height="9" fill="#00A4EF" rx="1" />
        <rect x="13" y="13" width="9" height="9" fill="#FFB900" rx="1" />
      </svg>
    )
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'Visual & Interactive Media',
    iconBg: 'bg-[#ECFEFF]',
    iconBorder: 'border-cyan-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="canvaGrad1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00C4CC" />
            <stop offset="1" stopColor="#7D2AE8" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#canvaGrad1)" />
        <path d="M14.5 8.5C13.2 7.2 10.8 7.2 9.2 8.8C7.6 10.4 7.5 13.2 9 14.8C10.5 16.4 13.2 16.2 14.8 14.8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'blackboard',
    name: 'Blackboard',
    category: 'LMS & Course Delivery',
    iconBg: 'bg-[#F0FDF4]',
    iconBorder: 'border-emerald-200',
    icon: (
      <svg className="w-5 h-5 rounded-md overflow-hidden" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="blackboardBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E54B7" />
            <stop offset="35%" stopColor="#0B8793" />
            <stop offset="70%" stopColor="#1BA848" />
            <stop offset="100%" stopColor="#9BD838" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="20" fill="url(#blackboardBrandGrad)" />
        <path
          d="M 43.5 28 H 56.5 L 77.5 76 H 63 L 50 43.5 L 37 76 H 22.5 L 43.5 28 Z"
          fill="white"
        />
      </svg>
    )
  },
  {
    id: 'vs-code',
    name: 'VS Code',
    category: 'Development & HTML/CSS/JS',
    iconBg: 'bg-[#EFF6FF]',
    iconBorder: 'border-blue-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M17.5 2.2L6.8 11.2L2.5 7.8L1 8.8L5.5 12.5L1 16.2L2.5 17.2L6.8 13.8L17.5 22.8L23 20.2V4.8L17.5 2.2ZM17.5 17.5L9.8 12.5L17.5 7.5V17.5Z" fill="#007ACC" />
      </svg>
    )
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    category: 'Photoshop & Illustrator',
    iconBg: 'bg-[#FFF1F2]',
    iconBorder: 'border-rose-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#DA1F26" />
        <path d="M14.5 7.5C12.8 7.5 11.5 8.6 11 9.8C10.5 8.6 9.2 7.5 7.5 7.5C5.6 7.5 4 9.1 4 11C4 13.2 5.8 15 8 15C9.2 15 10.3 14.4 11 13.5C11.7 14.4 12.8 15 14 15C16.2 15 18 13.2 18 11C18 9.1 16.4 7.5 14.5 7.5Z" fill="white" />
      </svg>
    )
  },
  {
    id: 'qualtrics',
    name: 'Qualtrics',
    category: 'Assessment & Survey Design',
    iconBg: 'bg-[#ECFEFF]',
    iconBorder: 'border-cyan-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#00B0F0" />
        <circle cx="12" cy="11" r="5" stroke="white" strokeWidth="2.5" fill="none" />
        <path d="M15 14L18 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'zoom',
    name: 'Zoom Video',
    category: 'Facilitation & Workshops',
    iconBg: 'bg-[#EFF6FF]',
    iconBorder: 'border-blue-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="14" height="16" rx="4" fill="#2D8CFF" />
        <path d="M16 9.5L21.5 6V18L16 14.5V9.5Z" fill="#2D8CFF" />
      </svg>
    )
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Collaboration & Cohort Hub',
    iconBg: 'bg-[#F0FDF4]',
    iconBorder: 'border-emerald-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M6 15a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2v2a2 2 0 0 1-2 2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5z" fill="#E01E5A" />
        <path d="M9 6a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5z" fill="#36C5F0" />
        <path d="M18 9a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2V11a2 2 0 0 1 2-2zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5z" fill="#2EB67D" />
        <path d="M15 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z" fill="#ECB22E" />
      </svg>
    )
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Repository & Versioning',
    iconBg: 'bg-[#F5F5F5]',
    iconBorder: 'border-neutral-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#24292F" />
      </svg>
    )
  }
];

export function AppLogosTicker() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div 
      className="relative w-full overflow-hidden py-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Soft edge gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent z-10" />

      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: isPaused ? undefined : ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 52, // Slow, gentle drift
        }}
      >
        {[...APP_LOGOS, ...APP_LOGOS].map((app, idx) => (
          <div
            key={`${app.id}-${idx}`}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-brand-border/70 shadow-2xs hover:border-brand-sage hover:shadow-xs transition-all duration-200 cursor-default shrink-0"
          >
            <div className={`w-7 h-7 rounded-lg ${app.iconBg} border ${app.iconBorder} flex items-center justify-center shrink-0`}>
              {app.icon}
            </div>
            <div className="min-w-0 pr-1">
              <span className="font-serif font-bold text-xs text-brand-text truncate block">
                {app.name}
              </span>
              <span className="text-[10px] font-sans text-brand-muted truncate block">
                {app.category}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
