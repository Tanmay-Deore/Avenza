import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Button } from '../../design-system/Button';
import {
  Compass,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Target,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenOnboarding: () => void }> = ({ onOpenOnboarding }) => {
  const { user, passport, resetAllData, activeTab, setActiveTab } = useAvenza();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#3A3B34] bg-[#232420]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#30312C] border border-[#4A4A42] flex items-center justify-center text-[#F7F0E5] shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-[#8798B7]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#F5EFE4]">
                AVENZA
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#30312C] text-[#BDB2D6] border border-[#4A4A42]">
                AI Navigator
              </span>
            </div>
          </div>
        </div>

        {/* Center: Current Goal Indicator */}
        {user.currentGoal && (
          <div
            onClick={() => setActiveTab('journey')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#30312C] border border-[#4A4A42] hover:border-[#8798B7]/60 cursor-pointer transition-colors max-w-sm"
          >
            <Target className="w-3.5 h-3.5 text-[#8798B7] flex-shrink-0" />
            <span className="text-xs text-[#BDB5A7] font-medium">Navigating to:</span>
            <span className="text-xs font-semibold text-[#F5EFE4] truncate">{user.currentGoal.title}</span>
          </div>
        )}

        {/* Right Stats & Quick Tools */}
        <div className="flex items-center gap-3">
          {/* Daily Streak (4d in gold-t) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#30312C] border border-[#4A4A42] text-[#E0C77F] text-xs font-semibold" title="Daily Streak">
            <Flame className="w-3.5 h-3.5 fill-[#E0C77F] text-[#E0C77F]" />
            <span>{user.streakDays}d</span>
          </div>

          {/* Daily Time Budget (30m/day in blue-t) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#30312C] border border-[#4A4A42] text-[#A9B7D0] text-xs font-medium" title="Daily Pace">
            <Clock className="w-3.5 h-3.5 text-[#8798B7]" />
            <span>{user.availableMinutesPerDay}m/day</span>
          </div>

          {/* Verified Skills Counter (2 Verified in sage-t) */}
          <button
            onClick={() => setActiveTab('passport')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#30312C] border border-[#4A4A42] hover:border-[#9BB59F]/60 text-[#B4CCB8] text-xs font-semibold transition-colors"
            title="Verified Skills in Passport"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#9BB59F]" />
            <span>{passport.verifiedSkillsCount} Verified</span>
          </button>

          {/* User / Reset Demo Menu */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#4A4A42]">
            <button
              onClick={onOpenOnboarding}
              className="px-2.5 py-1.5 rounded-lg bg-[#30312C] border border-[#4A4A42] hover:bg-[#373832] text-xs font-semibold text-[#BDB5A7] hover:text-[#F5EFE4] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A79BC4]" />
              <span>Restart Tour</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data and start fresh?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-[#A39F94] hover:text-[#E3A28E] hover:bg-[#30312C] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
