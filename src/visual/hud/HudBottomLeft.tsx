import React, { useState } from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { Bot, ArrowRight } from 'lucide-react';
import { AvenzaActionScroller } from './AvenzaActionScroller';

interface WaterDroplet {
  id: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: number;
  height: number;
  opacity: number;
  hasGlint: boolean;
  animClass: string;
  tilt?: number;
}

const WATER_DROPLETS: WaterDroplet[] = [
  // Cluster 1: Upper-left corner above header
  { id: 1, top: '10px', left: '26px', width: 6.5, height: 5.5, opacity: 0.88, hasGlint: true, animClass: 'droplet-drift-a', tilt: 10 },
  { id: 2, top: '8px', left: '36px', width: 3.5, height: 3.5, opacity: 0.78, hasGlint: false, animClass: 'droplet-drift-b', tilt: -5 },
  { id: 3, top: '15px', left: '40px', width: 2.5, height: 2.5, opacity: 0.70, hasGlint: false, animClass: '' },

  // Cluster 2: Upper-right corner
  { id: 4, top: '10px', right: '32px', width: 7, height: 6, opacity: 0.90, hasGlint: true, animClass: 'droplet-drift-b', tilt: -8 },
  { id: 5, top: '18px', right: '24px', width: 4, height: 4, opacity: 0.80, hasGlint: false, animClass: 'droplet-drift-a', tilt: 12 },
  { id: 6, top: '8px', right: '44px', width: 3, height: 3, opacity: 0.70, hasGlint: false, animClass: '' },

  // Cluster 3: Left margin beside scroller
  { id: 7, top: '92px', left: '7px', width: 5.5, height: 5, opacity: 0.85, hasGlint: true, animClass: 'droplet-drift-c', tilt: 6 },
  { id: 8, top: '102px', left: '9px', width: 3, height: 3, opacity: 0.75, hasGlint: false, animClass: 'droplet-drift-a' },

  // Cluster 4: Right margin beside scroller
  { id: 9, top: '170px', right: '7px', width: 5.5, height: 5, opacity: 0.85, hasGlint: true, animClass: 'droplet-drift-a', tilt: 8 },
  { id: 10, top: '178px', right: '10px', width: 3, height: 3, opacity: 0.72, hasGlint: false, animClass: 'droplet-drift-c' },

  // Cluster 5: Lower margin & corners
  { id: 11, top: '290px', left: '10px', width: 8, height: 7, opacity: 0.92, hasGlint: true, animClass: 'droplet-drift-b', tilt: -12 },
  { id: 12, top: '298px', left: '20px', width: 3.5, height: 3.5, opacity: 0.78, hasGlint: false, animClass: 'droplet-drift-a', tilt: 4 },
  { id: 13, bottom: '12px', right: '22px', width: 5, height: 4.5, opacity: 0.82, hasGlint: true, animClass: 'droplet-drift-c', tilt: 6 },
  { id: 14, bottom: '8px', right: '30px', width: 3, height: 3, opacity: 0.70, hasGlint: false, animClass: '' },
];

const DROPLET_KEYFRAME_STYLES = `
@keyframes dropletDriftA {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0.5px, 1.8px, 0);
  }
}
@keyframes dropletDriftB {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-0.4px, 1.4px, 0);
  }
}
@keyframes dropletDriftC {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0.2px, 0.8px, 0);
  }
}
.droplet-drift-a {
  animation: dropletDriftA 10s ease-in-out infinite;
}
.droplet-drift-b {
  animation: dropletDriftB 14s ease-in-out infinite 1.5s;
}
.droplet-drift-c {
  animation: dropletDriftC 18s ease-in-out infinite 3s;
}
@media (prefers-reduced-motion: reduce) {
  .droplet-drift-a, .droplet-drift-b, .droplet-drift-c {
    animation: none !important;
  }
}
`;

export const HudBottomLeft: React.FC = () => {
  const { state, openModuleDrawer } = useVisual();
  const { sendMentorQuery } = useAvenza();
  const [askInput, setAskInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div
      className="fixed z-30 pointer-events-auto hidden md:block w-72 transition-all duration-500"
      style={{
        bottom: '24px',
        left: '32px',
      }}
    >
      <style>{DROPLET_KEYFRAME_STYLES}</style>

      {/* Layer 1: Outer Smoked Acrylic / Optical Glass Shell */}
      <div
        className="relative p-3.5 rounded-[22px] space-y-3 overflow-hidden"
        style={{
          background:
            'linear-gradient(145deg, rgba(42, 44, 38, 0.68) 0%, rgba(34, 35, 29, 0.64) 50%, rgba(28, 29, 24, 0.68) 100%)',
          border: '1px solid rgba(244, 237, 225, 0.16)',
          backdropFilter: 'blur(18px) saturate(125%) contrast(102%)',
          WebkitBackdropFilter: 'blur(18px) saturate(125%) contrast(102%)',
          boxShadow: [
            'inset 0 1px 1.5px 0 rgba(255, 250, 240, 0.28)',
            'inset 0 0 0 1px rgba(255, 245, 225, 0.06)',
            'inset 0 -1.5px 3px 0 rgba(10, 10, 8, 0.35)',
            '0 24px 48px -10px rgba(15, 15, 12, 0.48)',
            '0 10px 22px -4px rgba(15, 15, 12, 0.28)',
          ].join(', '),
        }}
      >
        {/* Subtle static optical reflection & specular light sheen (pointer-events-none) */}
        <div
          aria-hidden="true"
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 35% at 32% 28%, rgba(255, 248, 235, 0.065) 0%, rgba(255, 248, 235, 0.015) 45%, transparent 70%)',
          }}
        />

        {/* Top edge subtle reflection line across top-left to top-center (pointer-events-none) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-6 right-12 h-[1px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 250, 240, 0.35) 0%, rgba(255, 250, 240, 0.12) 60%, transparent 100%)',
          }}
        />

        {/* Water-Drop / Condensation Particles (Layered behind UI content, pointer-events-none) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
        >
          {WATER_DROPLETS.map((drop) => (
            <span
              key={drop.id}
              className={drop.animClass}
              style={{
                position: 'absolute',
                top: drop.top,
                bottom: drop.bottom,
                left: drop.left,
                right: drop.right,
                width: `${drop.width}px`,
                height: `${drop.height}px`,
                opacity: drop.opacity,
                borderRadius: '50%',
                pointerEvents: 'none',
                background:
                  'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 250, 240, 0.50) 25%, rgba(244, 237, 225, 0.12) 55%, rgba(255, 252, 245, 0.35) 85%, rgba(215, 208, 195, 0.20) 100%)',
                border: '0.8px solid rgba(255, 250, 240, 0.50)',
                boxShadow:
                  'inset 0 1px 1px 0 rgba(255, 255, 255, 0.85), inset -0.5px -0.5px 1px 0 rgba(255, 250, 240, 0.40), inset 0 -1px 1px 0 rgba(25, 25, 20, 0.25), 0 1.5px 3px 0 rgba(10, 10, 8, 0.35)',
                transform: drop.tilt ? `rotate(${drop.tilt}deg)` : undefined,
              }}
            >
              {drop.hasGlint && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16%',
                    left: '18%',
                    width: `${Math.max(1.5, drop.width * 0.28)}px`,
                    height: `${Math.max(1.5, drop.height * 0.28)}px`,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 2px rgba(255, 255, 255, 0.95)',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </span>
          ))}
        </div>

        {/* Header: Subtle letter spacing, muted warm beige #C9BDAA, tiny route dot + minimize toggle */}
        <div className="relative z-10 flex items-center justify-between px-1 pt-0.5">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity"
            title={isCollapsed ? 'Expand Navigation Deck' : 'Minimize Navigation Deck'}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#8FA2C2] flex-shrink-0"
              style={{ boxShadow: '0 0 6px rgba(143, 162, 194, 0.45)' }}
            />
            <h3 className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#C9BDAA] select-none">
              WHAT ARE YOU LOOKING FOR?
            </h3>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[11px] font-mono font-bold text-[#A9A294] hover:text-[#FFF8ED] px-1.5 py-0.5 rounded transition-colors"
            title={isCollapsed ? 'Expand Navigation Deck' : 'Minimize Navigation Deck'}
          >
            {isCollapsed ? '+' : '−'}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Layer 2: Inner Action Deck with Blur Text Scroller */}
            <div className="relative z-10">
              <AvenzaActionScroller
                actions={navLinks}
                onSelect={openModuleDrawer}
                activeModuleId={state.activeModuleDrawer}
              />
            </div>

            {/* Layer 3: Learning Command Input (#31322C Inset Acrylic) */}
            <form onSubmit={handleAskSubmit} className="relative z-10 pt-1 border-t border-[rgba(244,237,225,0.08)] space-y-1.5">
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
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl text-xs font-mono text-[#F4EDE1] placeholder-[#B1AA9D] focus:outline-none focus:border-[#8FA2C2]/50 focus:ring-1 focus:ring-[#8FA2C2]/30 transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 250, 241, 0.055)',
                    border: '1px solid rgba(244, 237, 225, 0.13)',
                    boxShadow:
                      'inset 0 1.5px 3px rgba(10, 10, 8, 0.30), inset 0 0 0 1px rgba(255, 245, 225, 0.04)',
                  }}
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
          </>
        )}
      </div>
    </div>
  );
};
