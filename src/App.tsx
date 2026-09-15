/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutView from './components/AboutView';
import WorkView from './components/WorkView';
import PlaygroundView from './components/PlaygroundView';
import CVView from './components/CVView';
import ConnectModal from './components/ConnectModal';
import PortfolioGuide from './components/PortfolioGuide';
import { initAuthListener } from './services/authService';
import { 
  fetchProjects, 
  fetchPlaygroundData, 
  fetchAboutContent, 
  fetchCVContent 
} from './services/portfolioService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('about');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Initialize Auth & fetch cloud database content on mount
  useEffect(() => {
    initAuthListener();
    fetchProjects().catch((e) => console.warn('Fetch projects error:', e));
    fetchPlaygroundData().catch((e) => console.warn('Fetch playground error:', e));
    fetchAboutContent().catch((e) => console.warn('Fetch about error:', e));
    fetchCVContent().catch((e) => console.warn('Fetch cv error:', e));
  }, []);

  // Instant scroll to top on tab change so user starts cleanly at the header
  useEffect(() => {
    if (currentTab === 'connect') {
      setIsConnectModalOpen(true);
      setCurrentTab('about');
      return;
    }
    // Instant scroll to top immediately when switching views
    window.scrollTo(0, 0);
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between selection:bg-brand-sage/35 selection:text-brand-text">

      {/* Main Persistent navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Stage */}
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 flex-grow">
        {currentTab === 'about' && (
          <AboutView 
            setCurrentTab={setCurrentTab} 
            onOpenConnect={() => setIsConnectModalOpen(true)} 
          />
        )}
        
        {currentTab === 'work' && (
          <WorkView />
        )}

        {currentTab === 'playground' && (
          <PlaygroundView />
        )}

        {currentTab === 'cv' && (
          <CVView 
            setCurrentTab={setCurrentTab} 
            onOpenConnect={() => setIsConnectModalOpen(true)} 
          />
        )}
      </main>

      {/* Structured footer with educational and design philosophy labels */}
      <footer className="border-t border-brand-border bg-white py-12 px-4 sm:px-8 lg:px-12 xl:px-16 mt-12 transition-all">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-end gap-6">

          <div className="flex flex-col items-center md:items-end gap-2.5">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-brand-muted">
              <button onClick={() => setCurrentTab('about')} className="hover:text-brand-text cursor-pointer">about</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('work')} className="hover:text-brand-text cursor-pointer">work</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('playground')} className="hover:text-brand-text cursor-pointer">playground</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('cv')} className="hover:text-brand-text cursor-pointer">cv</button>
            </div>
            <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">
              Yuting (Katie) Hong © 2026
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Floating Portfolio Guide */}
      <PortfolioGuide 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isOpen={isGuideOpen}
        setIsOpen={setIsGuideOpen}
      />

      {/* Connect Modal Overlay Card */}
      <ConnectModal 
        isOpen={isConnectModalOpen} 
        onClose={() => setIsConnectModalOpen(false)} 
      />
    </div>
  );
}
