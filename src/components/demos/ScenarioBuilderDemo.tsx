import React, { useState } from 'react';
import { motion } from 'motion/react';

export function ScenarioBuilderDemo() {
  const [nodes, setNodes] = useState<{ id: string; label: string; text: string; score: number; pos: { x: number; y: number } }[]>([
    { id: 'n1', label: 'Intro Scenario', text: 'Resident knocks: "My roomie is playing loud bass at 2 AM."', score: 0, pos: { x: 40, y: 50 } },
    { id: 'n2', label: 'Route A: Empathetic', text: 'Validation first: "That weight is tough. Let\'s check in together."', score: 25, pos: { x: 260, y: 20 } },
    { id: 'n3', label: 'Route B: Compliance', text: 'Direct policy command: "Quiet hours started at midnight. Go back."', score: -15, pos: { x: 260, y: 110 } }
  ]);

  const [activeNodeId, setActiveNodeId] = useState<string>('n1');
  const [learnerFatigue, setLearnerFatigue] = useState<number>(30);
  const [protocolAutomaticity, setProtocolAutomaticity] = useState<number>(40);

  const handleNodeSelect = (id: string) => {
    setActiveNodeId(id);
    if (id === 'n2') {
      setLearnerFatigue(20);
      setProtocolAutomaticity(75);
    } else if (id === 'n3') {
      setLearnerFatigue(85);
      setProtocolAutomaticity(20);
    } else {
      setLearnerFatigue(30);
      setProtocolAutomaticity(40);
    }
  };

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-blue font-bold block">🧩 Scenario Builder Canvas</span>
        <h3 className="font-serif font-bold text-xl text-brand-text">Interactive Node Branching Map</h3>
        <p className="font-sans text-xs text-brand-muted">
          Select a node route to dry-run user metrics in our feedback monitor.
        </p>
      </div>

      <div className="h-[210px] bg-gradient-to-tr from-[#EAEEF4] to-white border border-brand-border rounded-2xl relative overflow-hidden shadow-inner">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d={`M ${nodes[0].pos.x + 85} ${nodes[0].pos.y + 25} C ${nodes[0].pos.x + 160} ${nodes[0].pos.y + 25}, ${nodes[1].pos.x - 30} ${nodes[1].pos.y + 25}, ${nodes[1].pos.x} ${nodes[1].pos.y + 25}`}
            fill="none"
            stroke="#A7B7C7"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d={`M ${nodes[0].pos.x + 85} ${nodes[0].pos.y + 25} C ${nodes[0].pos.x + 160} ${nodes[0].pos.y + 25}, ${nodes[2].pos.x - 30} ${nodes[2].pos.y + 25}, ${nodes[2].pos.x} ${nodes[2].pos.y + 25}`}
            fill="none"
            stroke="#C49A8A"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {nodes.map(node => {
          const isSelected = node.id === activeNodeId;
          return (
            <div
              key={node.id}
              style={{ top: `${node.pos.y}px`, left: `${node.pos.x}px` }}
              onClick={() => handleNodeSelect(node.id)}
              className={`absolute p-3 rounded-xl border bg-white shadow-3xs cursor-pointer select-none transition-all duration-200 min-w-[130px] z-10 ${
                isSelected 
                  ? 'border-[#3F3F3F] scale-105 ring-2 ring-brand-blue/20' 
                  : 'border-brand-border/60 hover:border-brand-blue/60'
              }`}
            >
              <div className="flex items-center gap-1.5 border-b border-[#FAF8F5] pb-1 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${node.score > 0 ? 'bg-brand-sage' : node.score < 0 ? 'bg-brand-peach' : 'bg-brand-blue'}`} />
                <span className="font-mono text-[7.5px] uppercase text-brand-muted font-bold">{node.label}</span>
              </div>
              <p className="font-sans text-[9px] text-[#525A50] leading-tight truncate">{node.text}</p>
              <div className="flex justify-between items-center text-[7px] font-mono text-brand-muted pt-1 mt-1 border-t border-[#FAF8F5]">
                <span>Impact</span>
                <span className={`font-semibold ${node.score >= 0 ? 'text-brand-sage' : 'text-brand-peach'}`}>
                  {node.score > 0 ? `+${node.score}` : node.score !== 0 ? node.score : '0'}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-brand-border p-4 rounded-xl space-y-3">
          <span className="font-mono text-[8px] text-brand-muted uppercase font-bold block">Active Node Parameter Tuning</span>
          <div className="space-y-1.5">
            <label className="font-sans text-[10px] text-brand-text font-bold block">Route Dialogue Text</label>
            <input
              id="node-text-field"
              type="text"
              value={activeNode.text}
              onChange={(e) => {
                const val = e.target.value;
                setNodes(prev => prev.map(n => n.id === activeNodeId ? { ...n, text: val } : n));
              }}
              className="w-full font-sans text-xs p-2 rounded-lg border border-brand-border focus:ring-1 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5 bg-[#FAF8F5] p-2.5 rounded-lg border border-brand-border/40">
            <span className="font-mono text-[8px] text-brand-muted uppercase block">NODE LOGICAL ID: {activeNode.id}</span>
            <p className="font-sans text-[10px] text-[#525A50] leading-relaxed">
              Drilling nodes triggers auto-linking arrays used by our Storyline/web simulators natively.
            </p>
          </div>
        </div>

        <div className="bg-white border border-brand-border p-4 rounded-xl space-y-3">
          <span className="font-mono text-[8px] text-brand-muted uppercase font-bold block">Projected Pathway Simulation Metrics</span>
          
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-sans">
                <span className="text-brand-muted">Learner Cognitive Fatigue</span>
                <span className="font-mono font-bold text-brand-text">{learnerFatigue}%</span>
              </div>
              <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-brand-border/30">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${learnerFatigue}%` }}
                  className={`h-full ${learnerFatigue > 70 ? 'bg-brand-peach' : 'bg-brand-sage'}`} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-sans">
                <span className="text-brand-muted">Empathy / Protocol Accuracy</span>
                <span className="font-mono font-bold text-brand-text">{protocolAutomaticity}%</span>
              </div>
              <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-brand-border/30">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${protocolAutomaticity}%` }}
                  className="h-full bg-brand-blue" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
