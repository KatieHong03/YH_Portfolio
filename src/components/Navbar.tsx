/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Compass, Layers, FileText } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const navItems = [
    { id: 'about', label: 'About', icon: Compass },
    { id: 'work', label: 'Work', icon: BookOpen },
    { id: 'playground', label: 'Playground', icon: Layers },
    { id: 'cv', label: 'CV', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border py-3.5 transition-all duration-300">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Logo / Positioning */}
        <button 
          onClick={() => setCurrentTab('about')}
          className="group flex items-center gap-3 focus:outline-none cursor-pointer"
          id="nav-logo-btn"
        >
          <div className="w-8 h-8 rounded-full bg-brand-sage flex items-center justify-center transition-transform group-hover:scale-105 duration-250 shadow-2xs">
            <div className="w-3.5 h-3.5 bg-brand-bg rounded-full shadow-inner"></div>
          </div>
          <div className="text-left flex items-center">
            <span className="text-sm font-bold tracking-wider uppercase text-brand-muted group-hover:text-brand-text transition-colors">
              YUTING (KATIE) HONG
            </span>
          </div>
        </button>

        {/* Right-aligned Navigation Tabs */}
        <div className="flex items-center sm:ml-auto max-w-full overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
          <div className="flex items-center bg-brand-border/30 p-1 rounded-2xl border border-brand-border/60 shrink-0">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentTab === item.id;
              
              // Map tab colors
              const activeColorClass = 
                item.id === 'about' ? 'text-brand-sage' :
                item.id === 'work' ? 'text-brand-blue' :
                item.id === 'playground' ? 'text-brand-peach' :
                'text-brand-sage';

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  id={`nav-${item.id}-btn`}
                  className={`
                    relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer
                    ${isActive 
                      ? 'bg-white text-brand-text shadow-xs font-semibold' 
                      : 'text-brand-muted hover:text-brand-text hover:bg-white/40'
                    }
                  `}
                >
                  <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? activeColorClass : 'text-brand-muted/70'}`} />
                  <span className="font-sans">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
