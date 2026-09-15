/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Sparkles, Send, X, RefreshCw, MessageSquare, Compass, Award, ExternalLink, HelpCircle, GripVertical } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'Which project best shows your instructional design process?',
  'Tell me about the corporate onboarding project (FSR)',
  'What tools and technologies do you use?',
  'Tell me about your education and background'
];

interface PortfolioGuideProps {
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const getReferredTabs = (text: string): { id: string; label: string }[] => {
  const lowercase = text.toLowerCase();
  const tabs: { id: string; label: string }[] = [];
  
  // 1. Work tab
  if (
    lowercase.includes('work') ||
    lowercase.includes('project') ||
    lowercase.includes('case stud') ||
    lowercase.includes('practiceurway') ||
    lowercase.includes('fsr') ||
    lowercase.includes('comma') ||
    lowercase.includes('reading') ||
    lowercase.includes('esl') ||
    lowercase.includes('ell') ||
    lowercase.includes('corporate') ||
    lowercase.includes('enterprise') ||
    lowercase.includes('onboarding') ||
    lowercase.includes('columbia') ||
    lowercase.includes('wellness') ||
    lowercase.includes('curriculum') ||
    lowercase.includes('elearning') ||
    lowercase.includes('lms') ||
    lowercase.includes('addie') ||
    lowercase.includes('instructional design') ||
    lowercase.includes('design process')
  ) {
    tabs.push({ id: 'work', label: 'Work' });
  }

  // 2. Playground tab
  if (
    lowercase.includes('playground') ||
    lowercase.includes('pawgress') ||
    lowercase.includes('lumipal') ||
    lowercase.includes('tarot') ||
    lowercase.includes('tea journey') ||
    lowercase.includes('creative prototype') ||
    lowercase.includes('sandbox') ||
    lowercase.includes('playful') ||
    lowercase.includes('toy') ||
    lowercase.includes('game')
  ) {
    tabs.push({ id: 'playground', label: 'Playground' });
  }

  // 3. About tab
  if (
    lowercase.includes('about') ||
    lowercase.includes('philosophy') ||
    lowercase.includes('pillar') ||
    lowercase.includes('background') ||
    lowercase.includes('learners first') ||
    lowercase.includes('pedagog')
  ) {
    tabs.push({ id: 'about', label: 'About' });
  }

  // 4. CV tab
  if (
    lowercase.includes('cv') ||
    lowercase.includes('resume') ||
    lowercase.includes('experience') ||
    lowercase.includes('education') ||
    lowercase.includes('degree') ||
    lowercase.includes('school') ||
    lowercase.includes('skills') ||
    lowercase.includes('toolkit') ||
    lowercase.includes('certif') ||
    lowercase.includes('coursework')
  ) {
    tabs.push({ id: 'cv', label: 'CV' });
  }

  // 5. Connect tab
  if (
    lowercase.includes('connect') ||
    lowercase.includes('contact') ||
    lowercase.includes('email') ||
    lowercase.includes('linkedin') ||
    lowercase.includes('message') ||
    lowercase.includes('hire') ||
    lowercase.includes('collab') ||
    lowercase.includes('reach out')
  ) {
    tabs.push({ id: 'connect', label: 'Connect' });
  }

  return tabs;
};

export default function PortfolioGuide({ 
  currentTab, 
  setCurrentTab,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen 
}: PortfolioGuideProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const panelDragControls = useDragControls();
  const isDraggingTriggerRef = useRef(false);

  // Focus input automatically whenever guide is opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Load or set initial greeting on load
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Hi there! I'm **Katie's Portfolio Guide**.\n\nThink of me as a warm, direct window into Katie's work and design thinking. Ask me anything about her case studies, psychology background, favorite tools, or what kind of learning design roles she's looking for.\n\nWhat would you like to explore together?`
      }
    ]);
  }, []);

  // Always scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isTyping]);

  const handleOpenGuide = () => {
    setIsOpen(true);
    setErrorMsg(null);
  };

  const handleCloseGuide = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || isTyping) return;

    setErrorMsg(null);
    const userMsgId = `user-${Date.now()}`;
    const userMsgText = textToSend.trim();
    
    // Append user message
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userMsgText }]);
    setInputVal('');
    setIsLoading(true);

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // Map current message thread for backend context history
      // Keep only recent messages to respect token envelopes
      const historyPayload = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsgText,
          history: historyPayload
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server returned an error');
      }

      // Ensure a natural conversational pause (at least 750ms) so response doesn't jump instantly
      const elapsed = Date.now() - startTime;
      const minThinkingTime = 750;
      if (elapsed < minThinkingTime) {
        await new Promise(resolve => setTimeout(resolve, minThinkingTime - elapsed));
      }

      // Switch from thinking indicator to typewriter streaming
      setIsLoading(false);
      setIsTyping(true);

      const assistantMsgId = `assistant-${Date.now()}`;
      setTypingMessageId(assistantMsgId);

      // Append empty assistant message placeholder
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        sender: 'assistant',
        text: ''
      }]);

      const fullReply = data.reply || '';
      // Tokenize by word boundaries including whitespaces and newlines
      const tokens = fullReply.split(/(\s+)/);
      let currentAccumulated = '';
      let tokenIdx = 0;

      await new Promise<void>((resolve) => {
        // Stream at a comfortable, readable speed (~32ms per token)
        typingIntervalRef.current = setInterval(() => {
          if (tokenIdx < tokens.length) {
            currentAccumulated += tokens[tokenIdx];
            tokenIdx++;
            setMessages(prev => prev.map(m => (m.id === assistantMsgId ? { ...m, text: currentAccumulated } : m)));
          } else {
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
            }
            setIsTyping(false);
            setTypingMessageId(null);
            resolve();
          }
        }, 32);
      });

    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Error fetching reply from server:', err);
      if (err.name === 'AbortError') {
        setErrorMsg('Request timed out. Please try sending your question again.');
      } else {
        setErrorMsg(err.message || 'Unable to connect to the guide right now.');
      }
      setIsLoading(false);
      setIsTyping(false);
      setTypingMessageId(null);
    }
  };

  const handlePromptClick = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const clearChat = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setIsTyping(false);
    setIsLoading(false);
    setTypingMessageId(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Hi there! I'm **Katie's Portfolio Guide**.\n\nThink of me as a warm, direct window into Katie's work and design thinking. Ask me anything about her case studies, psychology background, favorite tools, or what kind of learning design roles she's looking for.\n\nWhat would you like to explore together?`
      }
    ]);
    setErrorMsg(null);
  };

  // Safe renderer for markdown-like bold/newline text in chat balloons
  const renderMessageText = (rawText: string) => {
    return (rawText || '').split('\n').map((line, idx) => {
      // Parse basic bold markdown (**text**)
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const elements = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-brand-text">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block min-h-[0.5rem] leading-relaxed">
          {elements}
        </span>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING ACTION TRIGGER (Draggable & Movable) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 pointer-events-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0.08}
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 30 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onDragStart={() => {
                isDraggingTriggerRef.current = true;
              }}
              onDragEnd={() => {
                setTimeout(() => {
                  isDraggingTriggerRef.current = false;
                }, 120);
              }}
              id="portfolio-guide-trigger"
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full bg-brand-sage text-white shadow-xl shadow-brand-sage/30 hover:shadow-2xl hover:shadow-brand-sage/40 border border-white/30 cursor-grab active:cursor-grabbing select-none transition-shadow group touch-none"
              onClick={() => {
                if (isDraggingTriggerRef.current) return;
                handleOpenGuide();
              }}
              title="Click to open or drag to reposition anywhere"
            >
              <div className="flex items-center text-white/50 group-hover:text-white/90 transition-colors">
                <GripVertical className="w-3.5 h-3.5 -ml-1" />
              </div>
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-brand-sage animate-ping opacity-75" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide text-white">
                Ask Katie's Guide
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CHAT PANEL INTERFACE (Sage-green & warm ivory Morandi styled, fully draggable & movable) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragListener={false}
            dragControls={panelDragControls}
            dragMomentum={false}
            dragElastic={0.08}
            initial={{ opacity: 0, scale: 0.92, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 60 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            id="portfolio-guide-panel"
            className="fixed bottom-2 right-2 left-2 sm:left-auto sm:bottom-6 sm:right-6 z-50 bg-[#FAF8F5] border border-brand-border/80 rounded-[2rem] shadow-2xl flex flex-col sm:w-[410px] max-w-[calc(100vw-1rem)] h-[550px] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-5rem)] overflow-hidden"
          >
            {/* Soft creative Morandi header (Draggable header handle) */}
            <header
              onPointerDown={(e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('button') && !target.closest('input')) {
                  panelDragControls.start(e);
                }
              }}
              title="Drag header to move guide anywhere on screen"
              className="pt-2 px-4 pb-3.5 bg-white border-b border-brand-border/60 flex flex-col shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
            >
              {/* Visual drag handle pill */}
              <div className="w-9 h-1 bg-brand-border/80 rounded-full mx-auto mb-2 opacity-70 hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-sage/10 border border-brand-sage/20 flex items-center justify-center text-brand-sage shrink-0">
                    <Sparkles className="w-4.5 h-4.5 text-brand-sage" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-brand-text leading-none">
                        Katie's Portfolio Guide
                      </h4>
                      <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F4A45] font-bold block mt-1">
                      Thoughtful Learning Companion
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearChat}
                    title="Restart conversation"
                    className="p-2 hover:bg-brand-bg rounded-xl transition-colors cursor-pointer text-[#8B918B]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCloseGuide}
                    className="p-2 hover:bg-brand-bg rounded-xl transition-colors cursor-pointer text-[#8B918B]"
                    id="portfolio-guide-close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Chat Messages Scrolling Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans scrollbar-thin">
              {messages.map((msg) => {
                const isAI = msg.sender === 'assistant';
                return (
                  <div key={msg.id} className="space-y-4">
                    <div
                      className={`flex ${isAI ? 'justify-start' : 'justify-end'} w-full animate-fadeIn`}
                    >
                      <div className="flex gap-2.5 max-w-[85%]">
                        {isAI && (
                          <div className="w-7 h-7 rounded-xl bg-brand-sage/10 border border-brand-sage/25 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-brand-sage shadow-3xs">
                            ★
                          </div>
                        )}
                        
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-3xs border ${
                            isAI
                              ? 'bg-white text-brand-text border-brand-border/40 rounded-tl-none text-[12.5px] sm:text-[13px] leading-relaxed'
                              : 'bg-brand-sage text-white border-transparent rounded-tr-none text-[12.5px] sm:text-[13px] leading-relaxed font-medium'
                          }`}
                        >
                          <div className="space-y-2">
                            {renderMessageText(msg.text)}
                            {isTyping && typingMessageId === msg.id && (
                              <span className="inline-block w-1.5 h-3.5 bg-brand-sage ml-1 animate-pulse align-middle rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Suggested Questions Grid right below the welcome message bubble */}
                    {msg.id === 'welcome' && messages.length === 1 && !isLoading && !isTyping && (
                      <div className="pl-9 pr-2 space-y-3.5 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse shrink-0" />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4F4A45] font-bold">
                            Suggested Questions
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {SUGGESTED_QUESTIONS.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handlePromptClick(prompt)}
                              className="text-left font-sans text-[11.5px] sm:text-xs bg-white border border-[#EBE5DA] text-brand-text hover:border-brand-sage hover:bg-brand-sage/5 hover:text-brand-sage active:scale-[0.98] hover:shadow-2xs transition-all p-3 rounded-xl cursor-pointer leading-relaxed flex items-start gap-2.5 group shadow-3xs"
                            >
                              <span className="text-brand-sage/60 group-hover:text-brand-sage transition-colors text-[10px] shrink-0 mt-0.5">✦</span>
                              <span className="font-semibold">{prompt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Redirect Tabs for Assistant Responses */}
                    {isAI && msg.id !== 'welcome' && !isLoading && !isTyping && (
                      <div className="pl-9 pr-2 space-y-2 animate-fadeIn">
                        {getReferredTabs(msg.text).length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted/80">
                              Related Sections
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {getReferredTabs(msg.text).map((tab) => {
                                const isActive = currentTab === tab.id;
                                return (
                                  <button
                                    key={tab.id}
                                    onClick={() => {
                                      if (setCurrentTab) {
                                        setCurrentTab(tab.id);
                                      }
                                    }}
                                    className={`text-left font-sans text-[11px] sm:text-xs bg-white border text-brand-text hover:border-brand-sage hover:bg-brand-sage/5 hover:text-brand-sage active:scale-[0.98] hover:shadow-2xs transition-all px-3.5 py-2 rounded-xl cursor-pointer leading-relaxed flex items-center gap-2 group shadow-3xs ${
                                      isActive
                                        ? 'border-brand-sage bg-brand-sage/5 text-brand-sage font-bold'
                                        : 'border-[#EBE5DA]'
                                    }`}
                                  >
                                    <span>Go to {tab.label}</span>
                                    {isActive && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Graceful connection status & retry panel */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Connection Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    {errorMsg}
                  </p>
                  <button
                    onClick={() => {
                      setErrorMsg(null);
                      if (messages.length > 0) {
                        const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                        if (lastUser) handleSendMessage(lastUser.text);
                      }
                    }}
                    className="text-[11px] font-mono font-semibold text-brand-sage hover:underline cursor-pointer"
                  >
                    Tap to retry question →
                  </button>
                </div>
              )}

              {/* Typing Dot animators */}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="w-7 h-7 rounded-xl bg-brand-sage/10 border border-brand-sage/25 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-brand-sage">
                      ★
                    </div>
                    <div className="bg-white border border-brand-border/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-sage/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-sage/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-sage/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Anchor target to keep chat aligned bottom */}
              <div ref={chatBottomRef} />
            </div>

            {/* Input prompt text fields */}
            <footer className="p-4 bg-white border-t border-brand-border/60 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isLoading
                      ? "Katie's Guide is thinking..."
                      : isTyping
                      ? "Katie's Guide is responding..."
                      : "Ask about a project, skill, or process"
                  }
                  disabled={isLoading || isTyping}
                  className="flex-1 bg-brand-bg hover:bg-[#FAF8F5] focus:bg-white border border-brand-border/80 focus:border-brand-sage rounded-2xl px-4 py-3 text-xs sm:text-[13px] text-brand-text placeholder-brand-muted/70 focus:outline-none transition-all shadow-3xs disabled:opacity-75"
                />
                <button
                  type="submit"
                  disabled={isLoading || isTyping || !inputVal.trim()}
                  className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                    inputVal.trim() && !isLoading && !isTyping
                      ? 'bg-brand-sage text-white cursor-pointer hover:bg-brand-text active:scale-95 hover:shadow-md'
                      : 'bg-brand-bg text-[#B1B7B1] cursor-not-allowed border border-brand-border/30'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
