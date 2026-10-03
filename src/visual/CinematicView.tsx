import React from 'react';
import { useVisual } from './visualStateStore';
import { SceneRoot } from './SceneRoot';
import { MasterScrollController } from './MasterScrollController';
import { HeroSection } from './sections/HeroSection';
import { StatementSection } from './sections/StatementSection';
import { GallerySection } from './sections/GallerySection';
import { ClosingSection } from './sections/ClosingSection';
import { HudNav } from './hud/HudNav';
import { HudBottomLeft } from './hud/HudBottomLeft';
import { ScrollIndicator } from './hud/ScrollIndicator';
import { CursorDot } from './hud/CursorDot';
import { ModuleDrawerContainer } from './drawers/ModuleDrawerContainer';

export const CinematicView: React.FC = () => {
  const { state } = useVisual();
  const isBright = state.theme === 'bright';

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-500 ${
        isBright
          ? 'bg-[#F3EBDD] text-[#20211E]'
          : 'bg-[#1B1C19] text-[#F4EDE1]'
      }`}
    >
      {/* 1. Soft Warm Atmosphere (Section 04: Warm Beige -> Sage Mist -> Blue Mist -> Clay Mist) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Blue Mist & Sage Mist Aurora at top (reads as clean warm cream with subtle tint) */}
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full blur-[140px] transition-opacity duration-1000 ${
            isBright
              ? 'bg-gradient-to-b from-[#E6E9F0]/60 via-[#E3E8DE]/35 to-[#F8F4EC]/40 opacity-70'
              : 'bg-gradient-to-b from-[#242520]/60 via-[#2E302B]/40 to-[#1B1C19]/30 opacity-60'
          }`}
        />

        {/* Soft Sage Mist -> Clay Mist Bloom in lower-left */}
        <div
          className={`absolute -bottom-40 -left-20 w-[800px] h-[600px] rounded-full blur-[150px] transition-opacity duration-1000 ${
            isBright
              ? 'bg-gradient-to-tr from-[#E3E8DE]/40 via-[#F1E5DC]/35 to-transparent opacity-60'
              : 'bg-gradient-to-tr from-[#242520]/40 via-[#2E302B]/25 to-transparent opacity-50'
          }`}
        />

        {/* Subtle Fine Paper Grain Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(32,33,30,0.025)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(244,237,225,0.025)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      </div>

      {/* 2. WebGL 3D Canvas Layer */}
      <SceneRoot />

      {/* 3. Master Smooth Scroll Driven Story Layer */}
      <MasterScrollController>
        <div className="relative z-20">
          <HeroSection />
          <StatementSection />
          <GallerySection />
          <ClosingSection />
        </div>
      </MasterScrollController>

      {/* 4. Persistent 2D HTML HUD Layer */}
      <HudNav />
      <HudBottomLeft />
      <ScrollIndicator />
      <CursorDot />

      {/* 5. Interactive Module Detail Drawers */}
      <ModuleDrawerContainer />
    </div>
  );
};
