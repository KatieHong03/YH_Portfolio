import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckSquare } from 'lucide-react';

export function WellnessDemo() {
  const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [energyScore, setEnergyScore] = useState<number>(45);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBreathePhase(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        setCyclesCompleted(c => c + 1);
        setEnergyScore(score => Math.min(100, score + 8));
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const ACTIONS = [
    { id: 'stretch', label: 'Systems Backstretch Checks', desc: 'Roll shoulders back and sit up straight.', energy: 15 },
    { id: 'visual', label: '20-20-20 Sight Sanctuary', desc: 'Look at an object 20 feet away for 20s.', energy: 10 },
    { id: 'water', label: 'Hydration Circuit Loop', desc: 'Slowly sip a glass of water mindfully.', energy: 12 }
  ];

  const handleActivityToggle = (id: string, energy: number) => {
    if (completedActivities.includes(id)) {
      setCompletedActivities(prev => prev.filter(a => a !== id));
      setEnergyScore(score => Math.max(0, score - energy));
    } else {
      setCompletedActivities(prev => [...prev, id]);
      setEnergyScore(score => Math.min(100, score + energy));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">📱 Tranquil Wellness Overlay</span>
        <h3 className="font-serif font-bold text-xl text-brand-text">Student Focus & Breathing Pacing Hub</h3>
        <p className="font-sans text-xs text-brand-muted">
          Follow the breathing bubble to lower cognitive fatigue, and complete self-care pacing tasks below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="bg-[#FAF8F5]/90 border border-brand-border p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 h-[220px]">
          <span className="font-mono text-[8px] text-brand-muted uppercase font-bold tracking-wider">Breathing Helper Sphere</span>
          <div className="relative flex items-center justify-center w-28 h-28">
            <motion.div
              animate={{
                scale: breathePhase === 'Inhale' ? 1.3 : breathePhase === 'Hold' ? 1.3 : 0.85,
                backgroundColor: breathePhase === 'Inhale' ? '#A8B8A5' : breathePhase === 'Hold' ? '#A7B7C7' : '#C49A8A'
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-serif italic text-xs.5 font-bold shadow-md opacity-80"
            >
              {breathePhase}
            </motion.div>
          </div>
          <div className="flex justify-between w-full text-[8px] font-mono text-brand-muted px-2 border-t border-brand-border/30 pt-2">
            <span>PHASE TRIGGER: 4.0s</span>
            <span>CYCLE LOGS: {cyclesCompleted}</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[8px] text-brand-muted uppercase font-bold block">Physical Energy checksheets</span>
          <div className="space-y-2">
            {ACTIONS.map(action => {
              const isDone = completedActivities.includes(action.id);
              return (
                <button
                  key={action.id}
                  id={`wellness-act-btn-${action.id}`}
                  onClick={() => handleActivityToggle(action.id, action.energy)}
                  className={`w-full text-left p-3 rounded-xl border flex items-start gap-2.5 transition-all cursor-pointer ${
                    isDone 
                      ? 'bg-brand-sage/5 border-brand-sage shadow-3xs' 
                      : 'bg-white border-brand-border/60 hover:border-brand-sage/40 hover:shadow-3xs'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                    isDone ? 'bg-brand-sage border-brand-sage text-white' : 'border-[#CBD5E1]'
                  }`}>
                    {isDone && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-xs text-brand-text leading-tight">{action.label}</h5>
                    <p className="font-sans text-[10px] text-brand-muted leading-tight mt-0.5">{action.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-1.5">
            <div className="flex justify-between text-[10px] font-sans">
              <span className="text-brand-muted font-medium">Virtual Student Energy Quotient</span>
              <span className="font-mono font-bold text-brand-text">{energyScore}%</span>
            </div>
            <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-[#E2E8F0]">
              <motion.div 
                animate={{ width: `${energyScore}%` }}
                className="h-full bg-brand-sage" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
