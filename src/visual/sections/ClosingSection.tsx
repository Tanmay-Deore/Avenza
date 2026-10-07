import React from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const ClosingSection: React.FC = () => {
  const { setViewMode, openModuleDrawer } = useVisual();
  const { passport } = useAvenza();

  return (
    <section className="min-h-screen relative flex flex-col justify-center items-center text-center p-6 sm:p-16 z-20 pointer-events-none">
      <div className="max-w-3xl space-y-8 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6EDF5] dark:bg-[#232733] border border-[#D5E0EC] dark:border-[#3B4459] shadow-sm">
          <Sparkles className="w-4 h-4 text-[#46597A] dark:text-[#9FB0D3]" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#46597A] dark:text-[#9FB0D3] uppercase">
            TARGET DESTINATION IN SIGHT
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#20211E] dark:text-[#F4EDE1] font-mono uppercase leading-tight">
          READY TO NAVIGATE <br />
          <span className="bg-gradient-to-r from-[#4F6288] to-[#8A7050] bg-clip-text text-transparent">
            YOUR NEXT CAREER MILESTONE?
          </span>
        </h2>

        <p className="text-sm sm:text-base text-[#5A5B53] dark:text-[#BDB5A6] max-w-xl mx-auto leading-relaxed font-normal">
          Switch to your full workspace to complete daily micro-actions, execute verifiable code tests, and grow your official skill passport.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setViewMode('workspace')}
            className="px-8 py-4 rounded-full bg-[#20211E] hover:bg-[#32332E] text-[#F8F4EC] font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>ENTER COMPLETE WORKSPACE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => openModuleDrawer('passport')}
            className="px-6 py-4 rounded-full bg-[#E8DDCB] dark:bg-[#2E302B] hover:bg-[#EDE3D2] dark:hover:bg-[#383A35] border border-[#CFC2AE] dark:border-[#4B4E44] text-xs font-mono font-bold text-[#20211E] dark:text-[#F4EDE1] transition-all flex items-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-[#4C6650] dark:text-[#B0BFA9]" />
            <span>VIEW PASSPORT ({passport.verifiedSkillsCount})</span>
          </button>
        </div>

        {/* Discreet Legal Links */}
        <div className="pt-8 text-xs font-mono text-[#64625A] dark:text-[#BDB5A6] flex items-center justify-center gap-4">
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:text-[#20211E] dark:hover:text-[#F4EDE1] underline underline-offset-4 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-[#A39F94] dark:text-[#64625A]">•</span>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/terms');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:text-[#20211E] dark:hover:text-[#F4EDE1] underline underline-offset-4 transition-colors"
          >
            Terms & Conditions
          </a>
        </div>
      </div>
    </section>
  );
};
