import React, { useState } from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { Bot, ArrowRight } from 'lucide-react';

export const HudBottomLeft: React.FC = () => {
  const { state, openModuleDrawer } = useVisual();
  const { sendMentorQuery } = useAvenza();
  const [askInput, setAskInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    sendMentorQuery(askInput.trim());
    setAskInput('');
    openModuleDrawer('mentor');
  };

  const navLinks = [
    {
      label: 'MAP MY SKILLS',
      moduleId: 'skills',
      accent: '#8FA2C2', // dusty blue
      cue: 'READY',
    },
    {
      label: 'BUILD MY ROUTE',
      moduleId: 'journey',
      accent: '#9DB09B', // muted sage
      cue: 'BUILD',
    },
    {
      label: 'TALK TO MENTOR',
      moduleId: 'mentor',
      accent: '#B4A4C8', // soft lavender
      cue: 'ASK',
    },
    {
      label: 'EXPLORE CAREERS',
      moduleId: 'discover',
      accent: '#C58F78', // muted clay
      cue: 'EXPLORE',
    },
    {
      label: 'VERIFY A SKILL',
      moduleId: 'verification',
      accent: '#9DB09B', // warm sage
      cue: 'VERIFY',
    },
    {
      label: 'MY PASSPORT',
      moduleId: 'passport',
      accent: '#D3B873', // muted gold
      cue: 'PROOF',
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-auto hidden md:block w-72 transition-opacity duration-500">
      {/* Layer 1: Outer Warm Charcoal Shell (#24251F) */}
      <div
        className="p-3.5 rounded-[22px] bg-[#24251F] border border-[#4B4A40] space-y-3"
        style={{
          boxShadow:
            '0 16px 36px -6px rgba(42, 35, 27, 0.28), 0 4px 14px -2px rgba(42, 35, 27, 0.16), inset 0 1px 0 rgba(255, 245, 225, 0.06)',
        }}
      >
        {/* Header: Subtle letter spacing, muted warm beige #C9BDAA, tiny route dot */}
        <div className="flex items-center gap-2 px-1 pt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#8FA2C2] flex-shrink-0"
            style={{ boxShadow: '0 0 6px rgba(143, 162, 194, 0.45)' }}
          />
          <h3 className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#C9BDAA] select-none">
            WHAT ARE YOU LOOKING FOR?
          </h3>
        </div>

        {/* Layer 2: Inner Action Deck (#2D2E28) */}
        <div className="p-1 rounded-[16px] bg-[#2D2E28] border border-[#3A3B33] space-y-0.5">
          {navLinks.map((link) => {
            const isActive = state.activeModuleDrawer === link.moduleId;
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => openModuleDrawer(link.moduleId)}
                className={`w-full text-left font-mono text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-between group relative ${
                  isActive
                    ? 'bg-white/[0.055] text-[#FFF8ED]'
                    : 'text-[#E4DDD2] hover:bg-[#35362F]/65 hover:text-[#FFF8ED]'
                }`}
              >
                {/* Active / Hover accent line indicator */}
                <span
                  className={`absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ backgroundColor: link.accent }}
                />

                {/* Left navigation marker + action text */}
                <div className="flex items-center gap-2 pl-1.5 transition-transform duration-200 group-hover:translate-x-[3px]">
                  {/* Subtle semantic node dot */}
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                    style={{ backgroundColor: link.accent }}
                  />
                  {/* Terminal navigation arrow */}
                  <span
                    className={`text-[11px] font-mono transition-colors duration-200 ${
                      isActive ? 'text-[#FFF8ED]' : 'text-[#A9A294] group-hover:text-[#F4EDE1]'
                    }`}
                  >
                    -&gt;
                  </span>
                  {/* Action label */}
                  <span className="tracking-wide text-[11px] select-none">{link.label}</span>
                </div>

                {/* Right command cue / micro-label */}
                <span
                  className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 select-none ${
                    isActive ? 'text-[#C9BDAA]' : 'text-[#A9A294]/60 group-hover:text-[#C9BDAA]'
                  }`}
                >
                  {link.cue}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layer 3: Learning Command Input (#31322C) */}
        <form onSubmit={handleAskSubmit} className="pt-1 border-t border-[#3A3B33] space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[9px] font-mono tracking-widest uppercase text-[#A9A294]/75 select-none">
            <span>LEARNING COMMAND</span>
            <span className="text-[#8FA2C2]/80">AI MENTOR</span>
          </div>

          <div className="relative flex items-center">
            <Bot className="w-3.5 h-3.5 text-[#9DB09B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
            <input
              type="text"
              placeholder="ASK ME ANYTHING..."
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#31322C] border border-[#505047] text-xs font-mono text-[#F4EDE1] placeholder-[#B1AA9D] focus:outline-none focus:border-[#8FA2C2] focus:ring-1 focus:ring-[#8FA2C2]/40 transition-all shadow-inner"
            />
            <button
              type="submit"
              aria-label="Send question to AI Mentor"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#D6C8B0] hover:text-[#FFF8ED] p-1 rounded transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
