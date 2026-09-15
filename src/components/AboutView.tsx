/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Award, 
  Bookmark, 
  Globe, 
  PawPrint, 
  Music, 
  PenTool, 
  Camera, 
  Smile,
  Edit,
  Trash2,
  Plus,
  Lock,
  RotateCcw,
  X,
  Save,
  Compass,
  Check,
  MapPin,
  Mail,
  GraduationCap
} from 'lucide-react';

interface AboutViewProps {
  setCurrentTab: (tab: string) => void;
  onOpenConnect?: () => void;
}

interface PhilosophyItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

const DEFAULT_PHILOSOPHIES: PhilosophyItem[] = [
  {
    id: 'phil-1',
    title: 'Learners First',
    desc: 'Learning should be designed around the needs, motivations, and experiences of learners—not around content alone. I strive to create experiences that are relevant, accessible, and meaningful, helping learners build confidence as they progress.',
    iconName: 'Brain'
  },
  {
    id: 'phil-2',
    title: 'Learning Through Engagement',
    desc: 'People learn best when they actively participate. I use interaction, storytelling, practice, and reflection to transform passive information into engaging learning experiences that encourage exploration and retention.',
    iconName: 'Sparkles'
  },
  {
    id: 'phil-3',
    title: 'From Knowledge to Action',
    desc: 'Learning is most valuable when it leads to real-world application. I design experiences that help learners not only understand concepts, but also apply skills, solve problems, and perform effectively in authentic contexts.',
    iconName: 'Award'
  }
];

export default function AboutView({ setCurrentTab, onOpenConnect }: AboutViewProps) {
  const [activeSection, setActiveSection] = useState<'all' | 'philosophy' | 'journey' | 'pursuits'>('all');
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Reset scroll to top instantly on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Admin Mode
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('portfolio_admin_active') === 'true';
  });

  // Philosophies state
  const [philosophies, setPhilosophies] = useState<PhilosophyItem[]>(() => {
    const saved = localStorage.getItem('portfolio_about_philosophies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PHILOSOPHIES;
  });

  // Editing Philosophy State
  const [editingPhil, setEditingPhil] = useState<PhilosophyItem | null>(null);
  const [isNewPhil, setIsNewPhil] = useState<boolean>(false);
  const [philTitle, setPhilTitle] = useState('');
  const [philDesc, setPhilDesc] = useState('');
  const [philIcon, setPhilIcon] = useState('Brain');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return Brain;
      case 'Sparkles': return Sparkles;
      case 'Award': return Award;
      case 'Compass': return Compass;
      default: return Sparkles;
    }
  };

  const handleOpenAddPhil = () => {
    setIsNewPhil(true);
    setPhilTitle('');
    setPhilDesc('');
    setPhilIcon('Sparkles');
    setEditingPhil({
      id: `phil-${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'Sparkles'
    });
  };

  const handleOpenEditPhil = (phil: PhilosophyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNewPhil(false);
    setPhilTitle(phil.title);
    setPhilDesc(phil.desc);
    setPhilIcon(phil.iconName);
    setEditingPhil(phil);
  };

  const handleSavePhil = () => {
    if (!editingPhil) return;
    if (!philTitle.trim() || !philDesc.trim()) {
      alert('Title and description are required.');
      return;
    }

    const updatedItem: PhilosophyItem = {
      ...editingPhil,
      title: philTitle.trim(),
      desc: philDesc.trim(),
      iconName: philIcon
    };

    let updatedList: PhilosophyItem[];
    if (isNewPhil) {
      updatedList = [...philosophies, updatedItem];
    } else {
      updatedList = philosophies.map(p => p.id === updatedItem.id ? updatedItem : p);
    }

    setPhilosophies(updatedList);
    localStorage.setItem('portfolio_about_philosophies', JSON.stringify(updatedList));
    setEditingPhil(null);
  };

  const handleDeletePhil = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this philosophy pillar?')) {
      const updatedList = philosophies.filter(p => p.id !== id);
      setPhilosophies(updatedList);
      localStorage.setItem('portfolio_about_philosophies', JSON.stringify(updatedList));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Revert all about page customizations to default?')) {
      localStorage.removeItem('portfolio_about_philosophies');
      setPhilosophies(DEFAULT_PHILOSOPHIES);
      setEditingPhil(null);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-white rounded-[2.5rem] border border-brand-border p-8 sm:p-12 md:p-14 lg:p-16 shadow-xs min-h-[70vh] flex flex-col justify-center"
      >
        {/* Soft background ambient light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#EAEFE9]/40 via-brand-peach/10 to-brand-lavender/15 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-brand-sage/5 to-transparent rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Animated Large Display Headline without background boxes */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-serif text-3xl sm:text-5xl md:text-5.5xl lg:text-6xl xl:text-[66px] leading-[1.18] sm:leading-[1.14] text-brand-text tracking-tight font-normal">
                Bridging <span className="italic font-serif text-brand-sage">complexity & understanding</span> through thoughtful learning design.
              </h1>
            </motion.div>

            {/* Subtext description with delayed fade-in */}
            <motion.p 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-brand-muted text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal"
            >
              Hi, I'm <strong className="text-brand-text font-semibold">Yuting (Katie) Hong</strong>. I create learner-centered learning experiences that transform complex ideas into engaging, meaningful, and actionable learning.
            </motion.p>

            {/* CTA Button Deck: 2x2 Grid aligning View CV under Featured Work, and Connect under Playground */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pt-3"
            >
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 max-w-fit">
                {/* Row 1, Column 1: Featured Work */}
                <button
                  onClick={() => setCurrentTab('work')}
                  id="hero-view-work-btn"
                  className="w-full px-6 py-3.5 sm:px-7 sm:py-4 bg-[#2D2B2A] text-white hover:bg-black rounded-full text-base sm:text-lg font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <span>Featured Work</span>
                  <ArrowRight className="w-5 h-5 text-brand-sage" />
                </button>

                {/* Row 1, Column 2: Playground */}
                <button
                  onClick={() => setCurrentTab('playground')}
                  id="hero-play-sandbox-btn"
                  className="w-full px-6 py-3.5 sm:px-7 sm:py-4 bg-white border-2 border-[#E7E2DA] text-brand-text rounded-full text-base sm:text-lg font-bold hover:bg-[#FAF8F5] hover:border-brand-text/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <span>Playground</span>
                </button>

                {/* Row 2, Column 1: View CV (underneath Featured Work) */}
                <button
                  onClick={() => setCurrentTab('cv')}
                  id="hero-view-cv-btn"
                  className="w-full px-6 py-3.5 sm:px-7 sm:py-4 bg-white border-2 border-[#E7E2DA] text-brand-text rounded-full text-base sm:text-lg font-bold hover:bg-[#FAF8F5] hover:border-brand-text/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <span>View CV</span>
                  <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
                </button>

                {/* Row 2, Column 2: Connect (underneath Playground) */}
                <button
                  onClick={() => onOpenConnect ? onOpenConnect() : setCurrentTab('connect')}
                  id="hero-connect-btn"
                  className="w-full px-6 py-3.5 sm:px-7 sm:py-4 bg-white border-2 border-[#E7E2DA] text-brand-text rounded-full text-base sm:text-lg font-bold hover:bg-[#FAF8F5] hover:border-brand-text/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <Mail className="w-5 h-5 text-brand-sage" />
                  <span>Connect</span>
                  <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Floating Focus & Exploration Card with soft ambient animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center items-center py-4"
          >
            {/* Background rotated card accent */}
            <div className="w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] bg-brand-blue rounded-[44px] rotate-6 absolute -z-10 opacity-20 transition-all duration-500"></div>
            
            {/* Main Interactive Floating Focus Card */}
            <motion.div 
              whileHover={{ y: -4, rotate: -0.5 }}
              transition={{ duration: 0.3 }}
              className="w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] bg-white rounded-[36px] shadow-xl p-7 sm:p-8 flex flex-col justify-between border border-brand-border/70 relative z-10 backdrop-blur-xs"
            >
              <div className="flex justify-between items-center pb-3 border-b border-brand-border/40">
                <span className="text-[11px] font-mono tracking-wider text-brand-muted uppercase font-semibold">Focus & Exploration</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-border"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-border"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-sage animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center py-4">
                <span className="text-[11px] uppercase tracking-widest font-bold text-brand-sage block mb-3.5 font-mono">Currently Exploring</span>
                <ul className="space-y-3">
                  {['AI Literacy & Workforce Learning', 'Adaptive Learning Experiences', 'Learning Analytics', 'Scenario-Based eLearning'].map((item, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3 text-xs sm:text-[14px] md:text-[15px] font-serif text-brand-text font-medium tracking-tight"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#C49A8A] flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. DESIGN PHILOSOPHY SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-brand-sage" />
              <h2 className="font-serif font-bold text-xl text-brand-text">My Learning Philosophy</h2>
            </div>
            <div className="flex items-center gap-2">
              {isAdminMode && (
                <button
                  onClick={handleOpenAddPhil}
                  className="px-3 py-1 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pillar</span>
                </button>
              )}
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand-muted bg-brand-bg px-2 py-0.5 rounded border border-brand-border/60">
                {philosophies.length} Core Pillars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophies.map((philosophy, idx) => {
              const Icon = getIconComponent(philosophy.iconName);
              const accentBgClass = 
                idx % 3 === 0 ? 'bg-[#A8B8A5]/10' :
                idx % 3 === 1 ? 'bg-[#C49A8A]/10' :
                'bg-[#A7B7C7]/10';

              const backBgColor = 
                idx % 3 === 0 ? 'bg-[#A8B8A5]' :
                idx % 3 === 1 ? 'bg-[#C49A8A]' :
                'bg-[#BCC7D6]';

              const isFlipped = !!flippedCards[idx];

              return (
                <motion.div 
                  key={philosophy.id || idx} 
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group [perspective:1000px] h-[280px] sm:h-[300px] w-full cursor-pointer relative"
                  onClick={() => {
                    setFlippedCards(prev => ({
                      ...prev,
                      [idx]: !prev[idx]
                    }));
                  }}
                >
                  <div 
                    className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
                      isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]'
                    }`}
                  >
                    
                    {/* FRONT SIDE */}
                    <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border border-brand-border p-6 sm:p-7 flex flex-col justify-between [backface-visibility:hidden] shadow-xs hover:shadow-md transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10.5px] uppercase tracking-widest text-brand-muted font-bold bg-[#FAF8F4] px-2.5 py-1 rounded-full border border-brand-border/60">
                            Pillar 0{idx + 1}
                          </span>
                          {isAdminMode && (
                            <div className="flex items-center gap-1 bg-white/90 border border-brand-border px-1.5 py-0.5 rounded-lg shadow-xs" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => handleOpenEditPhil(philosophy, e)}
                                className="p-1 text-brand-sage hover:bg-brand-sage/10 rounded transition-colors cursor-pointer"
                                title="Edit pillar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeletePhil(philosophy.id, e)}
                                className="p-1 text-[#9C5A4C] hover:bg-[#9C5A4C]/10 rounded transition-colors cursor-pointer"
                                title="Delete pillar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="pt-2">
                          <h4 className="font-serif font-bold text-2xl sm:text-[26px] md:text-[28px] text-brand-text leading-[1.22] tracking-tight group-hover:text-brand-peach transition-colors duration-300">
                            {philosophy.title}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-brand-border/50 flex items-center justify-between text-xs font-mono text-[#4F4A45]">
                        <span className="flex items-center gap-1.5 font-bold transition-colors group-hover:text-brand-sage duration-300 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse shrink-0" />
                          Tap / Hover to reveal
                        </span>
                        <Bookmark className="w-3.5 h-3.5 text-brand-text/60 group-hover:text-brand-sage transition-colors duration-300 shrink-0" />
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className={`absolute inset-0 w-full h-full ${backBgColor} rounded-2xl p-6 sm:p-8 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] text-white shadow-md`}>
                      <div className="overflow-y-auto max-h-full py-1">
                        <p className="font-sans text-sm sm:text-[15px] text-white leading-relaxed font-normal">
                          {philosophy.desc}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

      {/* 3. WHO AM I & CREATIVE PURSUITS */}
      <motion.section 
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-blue" />
            <h2 className="font-serif font-bold text-xl text-brand-text">Background & Creative Disciplines</h2>
          </div>
          <span className="font-sans text-[11px] sm:text-xs tracking-wider text-[#68635B] bg-white/40 px-3 py-0.5 rounded-[7px] border border-[#DDD7CD] uppercase font-normal">
            Personal Journey
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Who Am I */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-gradient-to-b from-[#FAF8F5] to-white border border-brand-border rounded-[2rem] p-6 flex flex-col space-y-5 shadow-xs"
          >
                <div className="space-y-4">
                  <h3 className="font-serif italic text-2xl text-brand-text leading-tight font-normal">
                    Who Am I?
                  </h3>
                  
                  <div 
                    className="aspect-square w-full rounded-2xl overflow-hidden border border-brand-border/60 shadow-inner bg-brand-bg relative group/photo"
                  >
                    <img 
                      src="/assets/self_photo.jpg" 
                      alt="Yuting (Katie) Hong Portrait" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, self: true }))}
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {!imagesLoaded.self && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-peach/5 p-4 text-center">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted">Profile Photo</span>
                        <span className="font-mono text-[10px] text-brand-sage font-bold mt-1">self_photo.jpg</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="font-sans text-brand-muted text-sm sm:text-[15.5px] leading-relaxed sm:leading-loose">
                  Originally from the vibrant city of <strong className="text-brand-text font-semibold">Shanghai, China</strong>, I bring a multilingual background and a cross-cultural perspective shaped by my academic journey in the <strong className="text-brand-text font-semibold">United States</strong>.
                </p>
                
                <div className="flex-1 flex flex-col justify-between bg-brand-sage/5 border border-brand-sage/20 p-5 sm:p-7 rounded-2xl space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-sage/15 rounded-lg text-xs sm:text-[12px] font-mono font-bold uppercase tracking-wider text-brand-sage w-fit">
                    <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
                    <span>Fun Facts</span>
                  </div>
                  <ul className="flex-1 flex flex-col justify-around space-y-4 sm:space-y-5 font-sans text-sm sm:text-[15px] text-brand-muted/95 leading-relaxed sm:leading-loose list-none pl-0 my-auto">
                    <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[9px] sm:before:top-[11px] before:w-2.5 before:h-2.5 before:bg-brand-sage/80 before:rounded-full">
                      <strong className="text-brand-text font-semibold">Languages:</strong> I speak Japanese, Mandarin Chinese, and English.
                    </li>
                    <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[9px] sm:before:top-[11px] before:w-2.5 before:h-2.5 before:bg-brand-sage/80 before:rounded-full">
                      <strong className="text-brand-text font-semibold">Martial Arts:</strong> I used to learn boxing for self-defense.
                    </li>
                    <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[9px] sm:before:top-[11px] before:w-2.5 before:h-2.5 before:bg-brand-sage/80 before:rounded-full">
                      <strong className="text-brand-text font-semibold">Rodent Fan:</strong> I am a huge fan of rodents, especially hamsters, chinchillas, capybaras, and small fluffy animals.
                    </li>
                  </ul>
                </div>
              </motion.div>

            {/* Right Column: Creative Pursuits & Hobbies */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-brand-text mb-0.5">Creative Pursuits & Hobbies</h4>
                <p className="font-sans text-brand-muted text-[11px]">When I'm not designing learning experiences, you can find me exploring these creative disciplines:</p>
              </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Guitarist */}
                  <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-brand-border/60 rounded-2xl overflow-hidden flex flex-col h-full text-center"
                  >
                    <div className="aspect-square w-full bg-brand-lavender/5 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-brand-border/30">
                      <img 
                        src="/assets/hobby_guitarist.jpg" 
                        alt="Guitarist Hobby"
                        className="w-full h-full object-cover"
                        onLoad={() => setImagesLoaded(prev => ({ ...prev, guitarist: true }))}
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {!imagesLoaded.guitarist && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-brand-lavender/5">
                          <span className="font-mono text-[7px] uppercase tracking-wider text-brand-muted">Hobby Photo</span>
                          <span className="font-mono text-[8px] text-brand-lavender font-bold mt-0.5">hobby_guitarist.jpg</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-center space-y-1.5">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-5 h-5 rounded bg-brand-lavender/10 flex items-center justify-center text-brand-lavender shrink-0">
                          <Music className="w-2.5 h-2.5" />
                        </div>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-brand-text">Guitarist</h5>
                      </div>
                      <p className="font-sans text-[10.5px] text-brand-muted leading-relaxed max-w-[200px]">
                        Expressing emotion and setting atmosphere through melodic fingerstyle and acoustic tunes.
                      </p>
                    </div>
                  </motion.div>

                  {/* Calligrapher */}
                  <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-brand-border/60 rounded-2xl overflow-hidden flex flex-col h-full text-center"
                  >
                    <div className="aspect-square w-full bg-brand-sage/5 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-brand-border/30">
                      <img 
                        src="/assets/hobby_calligrapher.jpg" 
                        alt="Calligrapher Hobby"
                        className="w-full h-full object-cover"
                        onLoad={() => setImagesLoaded(prev => ({ ...prev, calligrapher: true }))}
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {!imagesLoaded.calligrapher && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-brand-sage/5">
                          <span className="font-mono text-[7px] uppercase tracking-wider text-brand-muted">Hobby Photo</span>
                          <span className="font-mono text-[8px] text-brand-sage font-bold mt-0.5">hobby_calligrapher.jpg</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-center space-y-1.5">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-5 h-5 rounded bg-brand-sage/10 flex items-center justify-center text-brand-sage shrink-0">
                          <PenTool className="w-2.5 h-2.5" />
                        </div>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-brand-text">Calligrapher</h5>
                      </div>
                      <p className="font-sans text-[10.5px] text-brand-muted leading-relaxed max-w-[200px]">
                        Practicing the meditative arts of ink brush strokes, classical lettering, and spatial design.
                      </p>
                    </div>
                  </motion.div>

                  {/* Photographer */}
                  <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-brand-border/60 rounded-2xl overflow-hidden flex flex-col h-full text-center"
                  >
                    <div className="aspect-square w-full bg-brand-peach/5 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-brand-border/30">
                      <img 
                        src="/assets/hobby_photographer.jpg" 
                        alt="Photographer Hobby"
                        className="w-full h-full object-cover"
                        onLoad={() => setImagesLoaded(prev => ({ ...prev, photographer: true }))}
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {!imagesLoaded.photographer && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-brand-peach/5">
                          <span className="font-mono text-[7px] uppercase tracking-wider text-brand-muted">Hobby Photo</span>
                          <span className="font-mono text-[8px] text-brand-peach font-bold mt-0.5">hobby_photographer.jpg</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-center space-y-1.5">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-5.5 h-5.5 rounded bg-brand-peach/10 flex items-center justify-center text-brand-peach shrink-0">
                          <Camera className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-brand-text">Photographer</h5>
                      </div>
                      <p className="font-sans text-[10.5px] text-brand-muted leading-relaxed max-w-[200px]">
                        Framing moments, chasing natural light, and storytelling through aesthetic, captured lenses.
                      </p>
                    </div>
                  </motion.div>

                  {/* Cosplayer */}
                  <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-brand-border/60 rounded-2xl overflow-hidden flex flex-col h-full text-center"
                  >
                    <div className="aspect-square w-full bg-brand-blue/5 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-brand-border/30">
                      <img 
                        src="/assets/hobby_cosplayer.jpg" 
                        alt="Cosplayer Hobby"
                        className="w-full h-full object-cover"
                        onLoad={() => setImagesLoaded(prev => ({ ...prev, cosplayer: true }))}
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {!imagesLoaded.cosplayer && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-brand-blue/5">
                          <span className="font-mono text-[7px] uppercase tracking-wider text-brand-muted">Hobby Photo</span>
                          <span className="font-mono text-[9px] text-brand-blue font-bold mt-0.5">hobby_cosplayer.jpg</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-center space-y-1.5">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-5.5 h-5.5 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                          <Smile className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-brand-text">Cosplayer</h5>
                      </div>
                      <p className="font-sans text-[10.5px] text-brand-muted leading-relaxed max-w-[200px]">
                        Constructing detailed character costumes, staging performances, and portraying fictional roles.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
          </div>
        </motion.section>

      {/* EDIT PHILOSOPHY MODAL */}
      <AnimatePresence>
        {editingPhil && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2 text-brand-sage">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg text-brand-text">
                    {isNewPhil ? 'Add Learning Philosophy Pillar' : 'Edit Philosophy Pillar'}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingPhil(null)}
                  className="text-brand-muted hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-brand-bg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Pillar Title *
                  </label>
                  <input
                    type="text"
                    value={philTitle}
                    onChange={(e) => setPhilTitle(e.target.value)}
                    placeholder="e.g. Learners First"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Icon Representation
                  </label>
                  <select
                    value={philIcon}
                    onChange={(e) => setPhilIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text bg-white"
                  >
                    <option value="Brain">Brain (Cognitive Science & Psychology)</option>
                    <option value="Sparkles">Sparkles (Engagement & Creative)</option>
                    <option value="Award">Award (Action & Real-World Results)</option>
                    <option value="Compass">Compass (Guidance & Navigation)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                    Philosophy Description *
                  </label>
                  <textarea
                    rows={4}
                    value={philDesc}
                    onChange={(e) => setPhilDesc(e.target.value)}
                    placeholder="Describe your guiding instructional design principle..."
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-sage focus:outline-none text-xs font-sans text-brand-text leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-brand-border/40">
                <button
                  onClick={() => setEditingPhil(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:bg-brand-bg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhil}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-sage hover:bg-brand-sage/90 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save Pillar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN FLOATING CONTROL PANEL */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isAdminMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md border border-brand-border/80 shadow-xl rounded-2xl p-2.5 flex items-center gap-2"
          >
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-sage/15 text-brand-sage font-mono text-[10px] font-bold rounded-lg uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse" />
              About Edit Mode
            </span>
            <button
              onClick={handleResetDefaults}
              className="px-2.5 py-1 text-xs font-mono text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Reset all custom about edits back to default"
            >
              <RotateCcw className="w-3 h-3" /> Revert
            </button>
          </motion.div>
        )}

        <button
          onClick={() => {
            const next = !isAdminMode;
            setIsAdminMode(next);
            localStorage.setItem('portfolio_admin_active', String(next));
          }}
          className={`p-3 rounded-full shadow-lg border transition-all duration-300 cursor-pointer flex items-center justify-center ${
            isAdminMode 
              ? 'bg-brand-text text-brand-bg border-brand-text scale-105' 
              : 'bg-white text-brand-muted border-brand-border hover:text-brand-text hover:bg-brand-bg'
          }`}
          title={isAdminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
