import React from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { Sparkles, ArrowDown, ChevronRight, Target, ShieldCheck, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { openModuleDrawer } = useVisual();
  const { user, passport } = useAvenza();

  return (
    <section className="min-h-screen relative flex flex-col justify-between p-6 sm:p-12 z-20 pointer-events-none">
      {/* Upper Area: Technical Monospace Label & Context Chips */}
      <div className="pt-20 sm:pt-16 max-w-xl space-y-4">
        {/* System / Brand Badge: #E6EDF5 bg, #46597A text, #D5E0EC border */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6EDF5] dark:bg-[#232733] border border-[#D5E0EC] dark:border-[#3B4459] shadow-sm pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#46597A] dark:text-[#9FB0D3]" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#46597A] dark:text-[#9FB0D3] uppercase">
            AVENZA // NAVIGATION SYSTEM 2.0
          </span>
        </div>

        {/* Small Contextual Information Chips around Core */}
        <div className="flex flex-wrap gap-2 pointer-events-auto">
          {/* Target Chip: #E6EDF5 bg, #46597A text, #D5E0EC border */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E6EDF5] dark:bg-[#232733] border border-[#D5E0EC] dark:border-[#3B4459] text-[11px] font-mono font-semibold text-[#46597A] dark:text-[#9FB0D3]">
            <Target className="w-3 h-3 text-[#46597A] dark:text-[#9FB0D3]" />
            <span>Target: {user.currentGoal?.targetRoleOrSkill || 'AI Engineer'}</span>
          </div>

          {/* Verified Chip: #E3EFE5 bg, #4C6650 text, #CFE2D2 border */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E3EFE5] dark:bg-[#1C2920] border border-[#CFE2D2] dark:border-[#2C4233] text-[11px] font-mono font-semibold text-[#4C6650] dark:text-[#B0BFA9]">
            <ShieldCheck className="w-3 h-3 text-[#4C6650] dark:text-[#B0BFA9]" />
            <span>{passport.verifiedSkillsCount} Verified Proofs</span>
          </div>

          {/* Pace Chip: #F1E7CF bg, #6F5522 text, #E6D8B5 border */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1E7CF] dark:bg-[#2B2516] border border-[#E6D8B5] dark:border-[#483D24] text-[11px] font-mono font-semibold text-[#6F5522] dark:text-[#E0C57F]">
            <Zap className="w-3 h-3 text-[#6F5522] dark:text-[#E0C57F]" />
            <span>Pace: {user.availableMinutesPerDay}m/day</span>
          </div>
        </div>
      </div>

      {/* Main Editorial Headline & Primary CTA */}
      <div className="max-w-3xl space-y-6 pb-8">
        {/* Main Headline: Ink #20211E for high contrast (13.7:1) on warm paper */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#20211E] dark:text-[#F4EDE1] leading-[1.05]">
          DYNAMIC PATHS FOR YOUR LEARNING <br />
          <span className="bg-gradient-to-r from-[#4F6288] to-[#8A7050] bg-clip-text text-transparent">
            & CAREER GROWTH.
          </span>
        </h1>

        {/* Hero Paragraph: Ink-Secondary #5A5B53 (5.2:1 contrast) */}
        <p className="text-sm sm:text-base text-[#5A5B53] dark:text-[#BDB5A6] max-w-xl leading-relaxed font-normal">
          Avenza discovers where you are, verifies what you actually know, bridges critical skill gaps, and guides you step-by-step to your target destination.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2 pointer-events-auto">
          {/* Primary CTA: Background #20211E (Soft Black), Text #F8F4EC (Cream, 14.8:1 contrast), Hover #32332E */}
          <button
            onClick={() => openModuleDrawer('journey')}
            className="px-6 py-3.5 rounded-full bg-[#20211E] hover:bg-[#32332E] text-[#F8F4EC] font-bold text-sm shadow-md transition-all flex items-center gap-2 group"
          >
            <span>START NAVIGATION</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Button (Scroll to Explore): Background #20211E, Text #F8F4EC, Hover #32332E */}
          <button
            onClick={() => {
              window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' });
            }}
            className="px-5 py-3.5 rounded-full bg-[#20211E] hover:bg-[#32332E] text-[#F8F4EC] text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#F8F4EC]" />
            <span>SCROLL TO EXPLORE</span>
          </button>
        </div>
      </div>
    </section>
  );
};
