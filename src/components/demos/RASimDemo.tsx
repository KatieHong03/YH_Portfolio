import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function RASimDemo() {
  const [confidence, setConfidence] = useState<number>(40);
  const [safetyAdherence, setSafetyAdherence] = useState<number>(50);
  const [drillOutcomes, setDrillOutcomes] = useState<string | null>(null);

  const OPTIONS = [
    { text: 'Validate & Escalation: "Thank you for letting me know. I need to call the Residence Life Director immediately while I sit with your roommate. What did they take?"', confidence: 35, safety: 45, feedback: 'Highly Effective! Prioritizes student safety while maintaining psychological comfort.' },
    { text: 'Room Inspection First: "Before we call anyone, I need to search the drawer and cabinet for medication containers to verify what they took."', confidence: -15, safety: 15, feedback: 'Suboptimal. Searching delay halts life safety reporting and creates immediate panic.' },
    { text: 'Compliance Admonishment: "Quiet hours started at midnight. Please try to quiet down and tell your roommate to go to bed and sleep it off."', confidence: -35, safety: -45, feedback: 'Dangerously Ineffective. Ignoring high-priority emergency indicators violates absolute duty of care.' }
  ];

  const handleOptionSelect = (confDelta: number, safetyDelta: number, fdb: string) => {
    setConfidence(c => Math.min(100, Math.max(0, c + confDelta)));
    setSafetyAdherence(s => Math.min(100, Math.max(0, s + safetyDelta)));
    setDrillOutcomes(fdb);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-sage font-bold block">🚨 Resident Advisor Emergency Simulation</span>
        <h3 className="font-serif font-bold text-xl text-brand-text">RA Safety Protocol Decisions</h3>
        <p className="font-sans text-xs text-brand-muted">
          Read the high-stakes situation below and select the response that best scales protocol execution.
        </p>
      </div>

      <div className="p-4 bg-white border border-brand-border rounded-2xl space-y-3 shadow-3xs">
        <span className="font-mono text-[8px] uppercase text-[#D6A692] font-semibold block">ACTIVE CRISIS CHALLENGE</span>
        <p className="font-sans text-xs text-brand-text leading-relaxed">
          You hear loud crying and banging from Room 204 at 1:30 AM. When you knock, a resident opens, highly anxious, stating their roommate has ingested unknown medication and is lethargic.
        </p>
      </div>

      <div className="space-y-2.5">
        {OPTIONS.map((option, idx) => (
          <button
            key={idx}
            id={`ra-option-btn-${idx}`}
            onClick={() => handleOptionSelect(option.confidence, option.safety, option.feedback)}
            className="w-full text-left p-3.5 rounded-xl border border-brand-border bg-white hover:border-brand-sage hover:bg-brand-sage/5 hover:shadow-2xs transition-all cursor-pointer text-xs font-sans text-brand-text leading-relaxed block"
          >
            {option.text}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {drillOutcomes && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-sage/5 border border-brand-sage/30 rounded-2xl space-y-2"
          >
            <span className="font-mono text-[8px] text-brand-sage uppercase font-bold block">Simulator Evaluation</span>
            <p className="font-sans text-[11px] text-[#525A50] leading-relaxed">
              {drillOutcomes}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-brand-border/30">
          <div className="flex justify-between text-[9px] font-mono text-brand-muted uppercase">
            <span>RA Confidence</span>
            <span>{confidence}%</span>
          </div>
          <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-brand-border/40">
            <div className="h-full bg-[#C49A8A] transition-all duration-300" style={{ width: `${confidence}%` }} />
          </div>
        </div>
        <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-brand-border/30">
          <div className="flex justify-between text-[9px] font-mono text-brand-muted uppercase">
            <span>Protocol Adherence</span>
            <span>{safetyAdherence}%</span>
          </div>
          <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-brand-border/40">
            <div className="h-full bg-brand-sage transition-all duration-300" style={{ width: `${safetyAdherence}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReadingScaffoldsDemo() {
  const [audioGuided, setAudioGuided] = useState<boolean>(false);
  const [visualHighlights, setVisualHighlights] = useState<boolean>(true);
  const [vocabularySimplified, setVocabularySimplified] = useState<boolean>(false);
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);

  const DEFINITIONS: Record<string, string> = {
    'ecosystem': 'A biological community of interacting organisms and their physical environment.',
    'biodiversity': 'The variety of life in the world or in a particular habitat or ecosystem.',
    'conservation': 'The prevention of wasteful use of a resource, or the preservation of nature.'
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-lavender font-bold block">📖 Dual-Coding Readability Scaffolding</span>
        <h3 className="font-serif font-bold text-xl text-brand-text">Adaptive Reading Scaffold</h3>
        <p className="font-sans text-xs text-brand-muted">
          Toggle instructional scaffolds to observe how interactive definitions and dual channels boost active reading comprehension.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          id="scaffold-toggle-visual"
          onClick={() => setVisualHighlights(!visualHighlights)}
          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-[10px] uppercase font-mono font-semibold ${
            visualHighlights 
              ? 'bg-brand-lavender/10 border-brand-lavender text-brand-lavender' 
              : 'bg-white border-brand-border text-gray-400'
          }`}
        >
          {visualHighlights ? '★ Highlights On' : '☆ Highlights Off'}
        </button>
        <button
          id="scaffold-toggle-audio"
          onClick={() => setAudioGuided(!audioGuided)}
          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-[10px] uppercase font-mono font-semibold ${
            audioGuided 
              ? 'bg-brand-sage/10 border-brand-sage text-brand-sage' 
              : 'bg-white border-brand-border text-gray-400'
          }`}
        >
          {audioGuided ? '🔊 Audio Assist On' : '🔇 Audio Off'}
        </button>
        <button
          id="scaffold-toggle-vocab"
          onClick={() => setVocabularySimplified(!vocabularySimplified)}
          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-[10px] uppercase font-mono font-semibold ${
            vocabularySimplified 
              ? 'bg-brand-peach/10 border-brand-peach text-[#D6A692]' 
              : 'bg-white border-brand-border text-gray-400'
          }`}
        >
          {vocabularySimplified ? '💬 Plain Text' : '📝 Standard Vocab'}
        </button>
      </div>

      <div className="p-5 bg-[#FAF8F5] border border-brand-border/70 rounded-2xl space-y-4 shadow-inner relative min-h-[140px]">
        {audioGuided && (
          <div className="flex items-center gap-1 bg-[#E8EDF2] px-2 py-1 rounded-md text-[8px] font-mono text-brand-blue absolute top-3 right-3 animate-pulse">
            <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-ping shrink-0" />
            <span>Dual-Coding Audio Track Active</span>
          </div>
        )}

        <div className="font-serif text-[13.5px] text-brand-text leading-relaxed">
          "The tropical forest is an intricate{' '}
          {vocabularySimplified ? (
            <span className="text-[#3F3F3F] font-bold">natural neighborhood</span>
          ) : (
            <span
              onMouseEnter={() => visualHighlights && setHoveredTerm('ecosystem')}
              onMouseLeave={() => setHoveredTerm(null)}
              className={`transition-colors cursor-help pb-0.5 ${
                visualHighlights ? 'border-b border-dashed border-brand-lavender font-semibold text-brand-lavender' : ''
              }`}
            >
              ecosystem
            </span>
          )}{' '}
          harboring immense{' '}
          {vocabularySimplified ? (
            <span className="text-[#3F3F3F] font-bold">animal and plant variety</span>
          ) : (
            <span
              onMouseEnter={() => visualHighlights && setHoveredTerm('biodiversity')}
              onMouseLeave={() => setHoveredTerm(null)}
              className={`transition-colors cursor-help pb-0.5 ${
                visualHighlights ? 'border-b border-dashed border-brand-lavender font-semibold text-brand-lavender' : ''
              }`}
            >
              biodiversity
            </span>
          )}{' '}. 
          To support wildlife, local{' '}
          {vocabularySimplified ? (
            <span className="text-[#3F3F3F] font-bold">habitat protection efforts</span>
          ) : (
            <span
              onMouseEnter={() => visualHighlights && setHoveredTerm('conservation')}
              onMouseLeave={() => setHoveredTerm(null)}
              className={`transition-colors cursor-help pb-0.5 ${
                visualHighlights ? 'border-b border-dashed border-brand-lavender font-semibold text-brand-lavender' : ''
              }`}
            >
              conservation
            </span>
          )}{' '}
          is our most absolute priority."
        </div>

        <AnimatePresence>
          {hoveredTerm && visualHighlights && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3.5 bg-white border border-brand-lavender rounded-xl shadow-xs text-xs space-y-1 block mt-2"
            >
              <span className="font-mono text-[8px] uppercase text-brand-lavender font-bold">SCAFFOLD DEFINITION: {hoveredTerm}</span>
              <p className="font-sans text-brand-text leading-tight">{DEFINITIONS[hoveredTerm]}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white border border-brand-border p-4 rounded-xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="font-mono text-[8px] text-brand-muted uppercase font-bold">Projected Scaffolding Impact</span>
          <p className="font-sans text-xs font-semibold text-brand-text">Comprehension Rate climbs to <strong className="text-brand-sage">95%</strong></p>
        </div>
        <div className="h-2 w-28 bg-[#FAF8F5] rounded-full overflow-hidden border border-brand-border/40">
          <div className="h-full bg-brand-sage transition-all duration-300" style={{ width: '95%' }} />
        </div>
      </div>
    </div>
  );
}
