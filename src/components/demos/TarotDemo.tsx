import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Send } from 'lucide-react';

export function TarotDemo() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [userReflection, setUserReflection] = useState<string>('');
  const [coachResponse, setCoachResponse] = useState<{
    shift: string;
    socratic: string;
    action: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const CARDS = [
    { name: 'The Catalyst', trait: 'Behavioral Change Check', detail: 'Represents the threshold of user momentum.', prompt: 'When a junior service rep freezes during a live customer escalation, how might we structure an immediate, non-punitive micro-scaffold to restore their confidence?' },
    { name: 'The Sanctuary', trait: 'Productive Failure Circle', detail: 'Represents systemic psychological safety.', prompt: 'To normalize making training mistakes, what visual safety anchors or error-receptive badges can we display in our LMS layouts?' },
    { name: 'The Compass', trait: 'Navigation Friction Check', detail: 'Represents intuitive scaffolding workflows.', prompt: 'If analytical STEM students reject soft emotional counseling sessions, how can we design a stressful conflict-response scenario framed as structural systems debugging?' }
  ];

  const handleDrawCard = (idx: number) => {
    setSelectedCard(idx);
    setCoachResponse(null);
    setUserReflection('');
  };

  const handleAnalyze = () => {
    if (!userReflection.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setCoachResponse({
        shift: `Excellent. By targeting high-stress pivot points directly, your proposal moves the learner from immediate anxiety to active systematic evaluation.`,
        socratic: `How can you integrate this feedback step natively inside the LMS workflow so that advisors do not have to disrupt their active sandbox simulation to read instructions?`,
        action: `Action Task: Design a 3-step 'Crisis Hotkey' overlay wireframe mapping helper coordinates directly on client-side simulation frames.`
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-peach font-bold block">🤖 AI Learning Coach Simulation</span>
        <h3 className="font-serif font-bold text-xl text-brand-text">Draw a Socratic Reflection Card</h3>
        <p className="font-sans text-xs text-brand-muted">
          Select and flip one of our reflective learning cards below to load its respective instructional problem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CARDS.map((card, idx) => {
          const isCurrent = selectedCard === idx;
          return (
            <button
              key={idx}
              id={`tarot-card-btn-${idx}`}
              onClick={() => handleDrawCard(idx)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-[130px] transition-all cursor-pointer duration-200 ${
                isCurrent 
                  ? 'bg-brand-peach/10 border-brand-peach ring-2 ring-brand-peach/20 scale-[1.02]' 
                  : 'bg-white border-brand-border/60 hover:border-brand-peach/60 hover:shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-brand-muted uppercase font-bold block">CARD 0{idx+1}</span>
                <h4 className="font-serif font-bold text-xs.5 text-brand-text">{card.name}</h4>
              </div>
              <span className="font-sans text-[9px] text-[#A8B8A5] font-semibold">{card.trait}</span>
            </button>
          );
        })}
      </div>

      {selectedCard !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-border p-5 rounded-2xl space-y-4"
        >
          <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-brand-border/60">
            <span className="font-mono text-[8px] text-brand-peach uppercase font-bold block">SOCRATIC CHALLENGE</span>
            <p className="font-serif italic text-xs.5 text-brand-text leading-relaxed">
              "{CARDS[selectedCard].prompt}"
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[8px] text-brand-muted uppercase font-bold">Your Proposed Instructional Strategy</label>
            <textarea
              id="tarot-reflection-input"
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder="e.g. I would implement a low-stakes mock chat simulation where mistakes are treated as dynamic node feedback pathways..."
              rows={3}
              className="w-full font-sans text-xs p-3 rounded-xl border border-brand-border focus:ring-1 focus:ring-brand-peach focus:border-brand-peach focus:outline-none placeholder:text-gray-400 bg-white"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="font-sans text-[10px] text-brand-muted">
              Character Count: {userReflection.length}
            </span>
            <button
              id="tarot-submit-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !userReflection.trim()}
              className="px-5 py-2.5 bg-brand-peach text-white disabled:opacity-40 rounded-xl text-xs font-semibold hover:bg-brand-text transition-colors flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Analyzing Reflection...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Submit to Coach</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {coachResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-brand-peach/5 border border-brand-peach/40 p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center gap-1.5 border-b border-brand-peach/20 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-peach shrink-0" />
              <h4 className="font-mono text-[9px] uppercase tracking-wider text-brand-peach font-bold">Coach Evaluation Feedback</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-brand-border/40">
                <span className="font-mono text-[7.5px] uppercase tracking-wider text-[#A8B8A5] font-bold block">1. Cognitive Shift</span>
                <p className="font-sans text-[10.5px] text-[#525A50] leading-relaxed">{coachResponse.shift}</p>
              </div>
              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-brand-border/40">
                <span className="font-mono text-[7.5px] uppercase tracking-wider text-brand-peach font-bold block">2. Socratic Query</span>
                <p className="font-sans text-[10.5px] text-[#525A50] leading-relaxed italic">"{coachResponse.socratic}"</p>
              </div>
              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-brand-border/40">
                <span className="font-mono text-[7.5px] uppercase tracking-wider text-[#A7B7C7] font-bold block">3. L&D action task</span>
                <p className="font-sans text-[10.5px] text-[#525A50] leading-relaxed">{coachResponse.action}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
