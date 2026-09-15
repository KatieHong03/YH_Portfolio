import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Mail } from 'lucide-react';

export function AnalyticsDemo() {
  const [selectedCohort, setSelectedCohort] = useState<'A' | 'B' | 'C'>('A');
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const COHORTS = {
    A: {
      name: 'STEM Undergrads',
      rates: [85, 92, 54, 76, 45, 90],
      hotspot: 'Node 4 [Crisis Referral Validation Error Point]',
      dropoutReason: 'Academic high anxiety and immediate checklist abandonment.'
    },
    B: {
      name: 'Senior L&D Directors',
      rates: [95, 88, 80, 85, 92, 94],
      hotspot: 'Node 2 [Structural Metacognition Alignment Limit]',
      dropoutReason: 'Time scheduling constraint bottlenecks during live webinars.'
    },
    C: {
      name: 'Junior Support Reps',
      rates: [60, 72, 45, 52, 68, 70],
      hotspot: 'Node 3 [Direct Policy Communication Escalation Point]',
      dropoutReason: 'Empathy protocol freeze during high-friction furious loops.'
    }
  };

  const active = COHORTS[selectedCohort];

  const handleTriggerEmail = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-sage font-bold block">📊 Learning Analytics Dashboard</span>
        <h3 className="font-serif font-bold text-xl text-brand-text">Cohort Performance Diagnostic Grid</h3>
        <p className="font-sans text-xs text-brand-muted">
          Compare diagnostic metrics across courseware groups, and click to trigger automated learning scaffolds.
        </p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(COHORTS) as Array<keyof typeof COHORTS>).map(key => (
          <button
            key={key}
            id={`cohort-${key}`}
            onClick={() => { setSelectedCohort(key); setSendSuccess(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold cursor-pointer transition-all ${
              selectedCohort === key 
                ? 'bg-[#3F3F3F] text-white border border-[#3F3F3F]' 
                : 'bg-white text-brand-text border border-brand-border/60 hover:border-brand-sage'
            }`}
          >
            {COHORTS[key].name}
          </button>
        ))}
      </div>

      <div className="p-4 bg-[#FAF8F5]/90 border border-brand-border rounded-xl space-y-4">
        <div className="space-y-1">
          <span className="font-mono text-[8px] text-brand-muted uppercase font-bold block">Active Progression & Completion Curve</span>
          <div className="flex items-end justify-between gap-2.5 pt-4 h-[100px] border-b border-brand-border/50 pb-1">
            {active.rates.map((rate, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-mono text-[7.5px] text-brand-text font-bold">{rate}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${rate}%` }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-full bg-brand-sage/60 border border-brand-sage rounded-t-md relative group hover:bg-brand-sage transition-colors"
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#3F3F3F] text-white text-[7px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    Session {idx + 1}
                  </div>
                </motion.div>
                <span className="font-mono text-[7px] text-brand-muted">S-{idx+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="space-y-1">
            <span className="font-mono text-[7.5px] text-brand-peach uppercase font-bold block">Identified Friction Hotspot</span>
            <p className="font-sans font-semibold text-brand-text">{active.hotspot}</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[7.5px] text-brand-muted uppercase font-bold block">Drop-Out Analysis</span>
            <p className="font-sans text-brand-muted leading-relaxed text-[11px]">{active.dropoutReason}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-brand-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h5 className="font-serif font-semibold text-xs text-brand-text">Trigger Automated Learning Scaffold Email?</h5>
          <p className="font-sans text-[10px] text-brand-muted leading-relaxed">
            Distribute a targeted PDF checksheet custom-scaffolded for the <strong className="text-brand-text">{active.name}</strong> struggle.
          </p>
        </div>

        <button
          id="trigger-intervention-email-btn"
          onClick={handleTriggerEmail}
          className="px-5 py-2.5 bg-brand-sage text-white rounded-xl text-xs font-semibold hover:bg-brand-text transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-3xs"
        >
          {sendSuccess ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-white" />
              <span>Diagnostic Email Dispatched!</span>
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5" />
              <span>Dispatch Intervention Action</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
