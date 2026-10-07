import React from 'react';
import { Compass, ArrowLeft, Sun, Moon, Shield } from 'lucide-react';
import { useVisual } from '../../visual/visualStateStore';

interface LegalHeaderProps {
  currentRoute: 'privacy' | 'terms';
  onNavigate: (route: 'app' | 'privacy' | 'terms') => void;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({ currentRoute, onNavigate }) => {
  const { state, toggleTheme } = useVisual();
  const isBright = state.theme === 'bright';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8CCB9] dark:border-[#3A3B34] bg-[#F8F4EC]/90 dark:bg-[#232420]/95 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Link */}
        <div
          onClick={() => onNavigate('app')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('app');
            }
          }}
          aria-label="Return to Avenza Home"
        >
          <div className="w-9 h-9 rounded-xl bg-[#20211E] dark:bg-[#30312C] border border-[#3A3B34] flex items-center justify-center text-[#F3EBDD] dark:text-[#F7F0E5] shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-[#8495B8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-[#20211E] dark:text-[#F4EDE1]">
                AVENZA
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#ECE7F4] dark:bg-[#2E2838] text-[#5E5277] dark:text-[#D4CBE5] border border-[#DDD5EA] dark:border-[#4B425A]">
                LEGAL
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#64625A] dark:text-[#BDB5A6]">
              GOVERNANCE & TRUST
            </div>
          </div>
        </div>

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-3">
          {/* Quick Tab Switcher between Privacy and Terms */}
          <div className="hidden sm:flex items-center p-1 rounded-full bg-[#EFE6D6] dark:bg-[#2C2D27] border border-[#D8CCB9] dark:border-[#3D3F37] text-xs font-mono font-bold">
            <button
              onClick={() => onNavigate('privacy')}
              className={`px-3 py-1 rounded-full transition-all ${
                currentRoute === 'privacy'
                  ? 'bg-[#20211E] text-[#F8F4EC] shadow-sm'
                  : 'text-[#5A5B53] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-[#F4EDE1]'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className={`px-3 py-1 rounded-full transition-all ${
                currentRoute === 'terms'
                  ? 'bg-[#20211E] text-[#F8F4EC] shadow-sm'
                  : 'text-[#5A5B53] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-[#F4EDE1]'
              }`}
            >
              Terms
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Bright/Dark Visual Theme"
            className="w-9 h-9 rounded-full bg-[#EFE6D6] dark:bg-[#2C2D27] border border-[#D8CCB9] dark:border-[#3D3F37] shadow-sm hover:scale-105 flex items-center justify-center text-[#20211E] dark:text-[#F7F0E5] transition-all"
            title={`Switch to ${isBright ? 'Dark' : 'Bright'} Theme`}
          >
            {isBright ? <Moon className="w-4 h-4 text-[#5A5B53]" /> : <Sun className="w-4 h-4 text-[#E0C77F]" />}
          </button>

          {/* Return to App Button */}
          <button
            onClick={() => onNavigate('app')}
            className="px-3.5 py-1.5 rounded-full bg-[#20211E] hover:bg-[#32332E] dark:bg-[#F4EDE1] dark:hover:bg-[#FFFFFF] text-[#F8F4EC] dark:text-[#20211E] font-mono font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
