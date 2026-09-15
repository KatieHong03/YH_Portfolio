/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PORTFOLIO_SPECS } from '../data';
import { LayoutGrid, Palette, Target, Award, ListFilter, HelpCircle, CheckCircle, Code, Shuffle } from 'lucide-react';

export default function PortfolioSpecs() {
  const [activeSpecTab, setActiveSpecTab] = useState<'visuals' | 'elements' | 'strategy'>('visuals');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-brand-border/60 pb-6 mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-brand-muted bg-brand-bg border border-brand-border">
            <Code className="w-3.5 h-3.5" /> SPEC-001 // PORTFOLIO BLUEPRINT
          </span>
          <h3 className="font-display font-bold text-2xl text-brand-text mt-2">
            Interactive Portfolio Architecture Center
          </h3>
          <p className="font-sans text-brand-muted text-sm mt-1 max-w-xl">
            A real-time display of the underlying design choices, wireframe hierarchies, and L&D strategy guidelines applied to construct this platform.
          </p>
        </div>

        {/* Tab System */}
        <div className="flex gap-2 bg-brand-bg p-1.5 rounded-xl border border-brand-border">
          <button
            onClick={() => setActiveSpecTab('visuals')}
            id="spec-tab-visuals"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              activeSpecTab === 'visuals' ? 'bg-white text-brand-text shadow-sm' : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Design & Palette
          </button>
          <button
            onClick={() => setActiveSpecTab('elements')}
            id="spec-tab-elements"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              activeSpecTab === 'elements' ? 'bg-white text-brand-text shadow-sm' : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Structure & Wireframes
          </button>
          <button
            onClick={() => setActiveSpecTab('strategy')}
            id="spec-tab-strategy"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              activeSpecTab === 'strategy' ? 'bg-white text-brand-text shadow-sm' : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Recruiter Strategy
          </button>
        </div>
      </div>

      {/* VIEW 1: DESIGN & PALETTE */}
      {activeSpecTab === 'visuals' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Color Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-brand-sage" />
              <h4 className="font-display font-semibold text-lg text-brand-text">
                The Morandi & Macaron Color System
              </h4>
            </div>
            <p className="font-sans text-brand-muted text-sm mb-6 leading-relaxed max-w-3xl">
              This system merges the calm sophistication of Italian painter Giorgio Morandi's muted slate-tones with the warm, approachable cream textures of classic French macarons. It avoids clinical corporate blue while remaining clean, highly legible, and reassuring.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PORTFOLIO_SPECS.designSystem.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleCopyColor(color.hex)}
                  id={`color-box-${color.name.toLowerCase().replace(/\s/g, '-')}`}
                  className="flex flex-col items-left p-4 rounded-2xl border border-brand-border text-left hover:bg-brand-bg transition-colors relative group focus:outline-none"
                >
                  <div className="w-full h-14 rounded-xl border border-brand-border shadow-sm mb-3 flex items-end justify-end p-2" style={{ backgroundColor: color.hex }}>
                    <span className="font-mono text-[10px] font-semibold bg-white/90 text-brand-text px-1.5 py-0.5 rounded border border-brand-border">
                      {color.hex}
                    </span>
                  </div>
                  <span className="font-display font-semibold text-sm text-brand-text flex justify-between w-full">
                    {color.name}
                    <span className="text-[10px] font-sans text-brand-sage font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedColor === color.hex ? 'Copied!' : 'Click to copy'}
                    </span>
                  </span>
                  <span className="font-sans text-xs text-brand-muted mt-1 leading-relaxed">
                    {color.purpose}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Section */}
          <div className="border-t border-brand-border/60 pt-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-brand-blue" />
              <h4 className="font-display font-semibold text-lg text-brand-text">
                Typography & Contrast Hierarchy
              </h4>
            </div>
            <p className="font-sans text-brand-muted text-sm mb-6 leading-relaxed max-w-3xl">
              Typography is the critical container of information design. To project "product designer" posture over "textbook researcher" dryness, we combine Geometric display fonts with technical monospaced metadata labels:
            </p>

            <div className="space-y-4">
              {PORTFOLIO_SPECS.designSystem.typography.map((typo, idx) => (
                <div key={idx} className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <span className="font-mono text-[10px] text-brand-muted uppercase tracking-wider">{typo.element}</span>
                    <h5 className="font-display font-semibold text-base text-brand-text mt-0.5">{typo.font}</h5>
                    <p className="font-sans text-xs text-brand-muted mt-1 leading-relaxed">{typo.details}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    {typo.font.includes('LL Bradford') && (
                      <span className="font-serif font-bold text-xl text-brand-text">Aa Bb Cc // 48px</span>
                    )}
                    {typo.font.includes('Söhne') && (
                      <span className="font-sans text-sm text-brand-text">The quick brown fox jumps over the lazy dog.</span>
                    )}
                    {typo.font === 'JetBrains Mono' && (
                      <span className="font-mono text-xs text-brand-sage">[03] METADATA // SYSTEM</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STRUCTURE & WIREFRAMES */}
      {activeSpecTab === 'elements' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Sitemap Block */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-brand-lavender" />
              <h4 className="font-display font-semibold text-lg text-brand-text">
                Streamlined Sitemap & Navigation Tree
              </h4>
            </div>
            <p className="font-sans text-brand-muted text-sm mb-6 leading-relaxed max-w-3xl">
              By structuring navigation into a clean horizontal bar, recruiters never experience information paralysis. Sidebars and drawer systems are avoided to optimize focus on immediate proof of design ability.
            </p>

            {/* Sitemap Nodes Render */}
            <div className="bg-brand-bg rounded-2xl p-6 border border-brand-border">
              {PORTFOLIO_SPECS.sitemap.nodes.map((root, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-brand-border shadow-sm max-w-sm">
                    <div className="w-2 h-2 bg-brand-peach rounded-full" />
                    <span className="font-mono text-xs font-semibold text-brand-text">{root.name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pl-4 border-l border-brand-border/60 ml-4 py-2">
                    {root.children.map((child, j) => (
                      <div key={j} className="bg-white p-3 rounded-xl border border-brand-border text-left hover:border-brand-sage transition-all">
                        <span className="block font-display font-semibold text-xs text-brand-text mb-1">{child.name}</span>
                        <span className="block font-sans text-[10px] text-brand-muted leading-relaxed">{child.details}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wireframe Viewer Concept */}
          <div className="border-t border-brand-border/60 pt-8">
            <div className="flex items-center gap-2 mb-4">
              <Shuffle className="w-5 h-5 text-brand-peach" />
              <h4 className="font-display font-semibold text-lg text-brand-text">
                Tactile Wireframe & Layout Examples
              </h4>
            </div>
            <p className="font-sans text-brand-muted text-sm mb-6 leading-relaxed max-w-3xl">
              Every section of this application uses purposeful spacing and structured grid systems to elevate content scannability:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Home hero Wireframe */}
              <div className="border border-brand-border rounded-2xl p-4 bg-white hover:shadow-md transition-shadow">
                <span className="font-mono text-[9px] text-brand-muted">[ Layout-A: Hero ]</span>
                <div className="border-2 border-dashed border-brand-border/60 rounded-xl p-3 bg-brand-bg/50 mt-2 space-y-2 h-36 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-brand-sage/40 rounded" />
                    <div className="h-5 w-full bg-brand-text/10 rounded" />
                    <div className="h-3 w-2/3 bg-brand-text/10 rounded" />
                  </div>
                  <div className="flex gap-1.5 justify-start">
                    <div className="h-6 w-12 bg-brand-lavender/30 rounded" />
                    <div className="h-6 w-12 bg-brand-blue/30 rounded" />
                  </div>
                </div>
                <h5 className="font-display font-semibold text-xs text-brand-text mt-3">Geometric Top Accent</h5>
                <p className="font-sans text-[11px] text-brand-muted mt-1">
                  Soft card framing with negative space of 56px to focus eye tracking on the instructional design definition.
                </p>
              </div>

              {/* Case study wireframe */}
              <div className="border border-brand-border rounded-2xl p-4 bg-white hover:shadow-md transition-shadow">
                <span className="font-mono text-[9px] text-brand-muted">[ Layout-B: Case Studies ]</span>
                <div className="border-2 border-dashed border-brand-border/60 rounded-xl p-3 bg-brand-bg/50 mt-2 space-y-2 h-36 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-brand-blue/40 rounded" />
                    <div className="h-3 w-8 bg-brand-text/10 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-3/4 bg-brand-text/20 rounded-md" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-8 bg-white rounded border border-brand-border flex items-center justify-center text-[8px] font-mono">[Objectives]</div>
                      <div className="h-8 bg-white rounded border border-brand-border flex items-center justify-center text-[8px] font-mono">[Outcome]</div>
                    </div>
                  </div>
                </div>
                <h5 className="font-display font-semibold text-xs text-brand-text mt-3">Split-Screen Strategic Deck</h5>
                <p className="font-sans text-[11px] text-brand-muted mt-1">
                  Keeps strategic objectives locked in view on the left while process stages and metrics flow on the right.
                </p>
              </div>

              {/* Split elements wireframe */}
              <div className="border border-brand-border rounded-2xl p-4 bg-white hover:shadow-md transition-shadow">
                <span className="font-mono text-[9px] text-brand-muted">[ Layout-C: Playground ]</span>
                <div className="border-2 border-dashed border-brand-border/60 rounded-xl p-3 bg-brand-bg/50 mt-2 space-y-2 h-36 flex flex-col justify-between">
                  <div className="h-3 w-28 bg-brand-lavender/40 rounded" />
                  <div className="bg-white rounded-lg p-2 border border-brand-border shadow-sm space-y-1">
                    <div className="h-2 w-full bg-brand-sage/20 rounded" />
                    <div className="grid grid-cols-3 gap-1">
                      <div className="h-4 bg-brand-bg rounded" />
                      <div className="h-4 bg-brand-bg rounded" />
                      <div className="h-4 bg-brand-bg rounded" />
                    </div>
                  </div>
                </div>
                <h5 className="font-display font-semibold text-xs text-brand-text mt-3">Branching Interactive Sandbox</h5>
                <p className="font-sans text-[11px] text-brand-muted mt-1">
                  Live interaction simulator styled like a chat UI, providing immediate visual, emotional, and cognitive feedback indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: STRATEGIC RECRUITER ADVICE */}
      {activeSpecTab === 'strategy' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/40">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-brand-sage animate-pulse" />
                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-text">
                  Memorable recruiter triggers
                </h4>
              </div>
              <ul className="space-y-3.5">
                {PORTFOLIO_SPECS.memorableTriggers.map((trigger, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                    <div>
                      <span className="font-display font-bold text-brand-text">{trigger.title}: </span>
                      <span className="font-sans text-brand-muted">{trigger.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-brand-border rounded-2xl p-5 bg-brand-bg/40">
              <div className="flex items-center gap-2 mb-3">
                <ListFilter className="w-5 h-5 text-brand-blue" />
                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-text">
                  LXD & EdTech Portfolio tips
                </h4>
              </div>
              <ul className="space-y-3.5">
                {PORTFOLIO_SPECS.lxdSuggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="font-display font-bold text-brand-text">{suggestion.title}: </span>
                      <span className="font-sans text-brand-muted">{suggestion.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hero Section Ideas */}
          <div className="border-t border-brand-border/60 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-brand-peach" />
              <h4 className="font-display font-semibold text-base text-brand-text">
                Homepage Hero concepts explored in this design
              </h4>
            </div>
            <div className="p-4 bg-[#F5F2EA] rounded-2xl border border-brand-border text-xs text-brand-muted space-y-3">
              <p>
                <strong>The "Action-In-Design" Hero Option (Implemented):</strong> Centered typography that contrasts theory against practice: <em>"I design learning products, I don't just study learning science."</em> Paired with interactive quick links to jump directly to evidence or sandbox prototyping.
              </p>
              <p>
                <strong>The "Cognitive Friction" Narrative:</strong> Focuses purely on problem solving: <em>"We replace 40-hour lecture slides with actionable simulations that decrease production bugs by 42%."</em> Showcases a direct business mindset.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
