import React, { useState } from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import {
  Compass,
  Sun,
  Moon,
  Layers,
  Map,
  Bot,
  Award,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const HudNav: React.FC = () => {
  const { state, toggleTheme, setViewMode, openModuleDrawer } = useVisual();
  const { user, resetAllData } = useAvenza();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBright = state.theme === 'bright';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-5 flex items-center justify-between pointer-events-none">
        {/* Top-Left: Brand & Technical Monospace Label (Section 09) */}
        <div className="flex items-center gap-3 pointer-events-auto group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {/* Compass Icon Tile: #20211E background with #F3EBDD icon */}
          <div className="w-9 h-9 rounded-xl bg-[#20211E] dark:bg-[#F4EDE1] flex items-center justify-center text-[#F3EBDD] dark:text-[#20211E] shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-[#F3EBDD] dark:text-[#20211E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* Wordmark AVENZA: #20211E */}
              <span className="text-base font-black tracking-tight text-[#20211E] dark:text-[#F4EDE1]">
                AVENZA
              </span>
              {/* AI NAVIGATOR tag: bg #ECE7F4, text #5E5277, border #DDD5EA */}
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#ECE7F4] dark:bg-[#252230] text-[#5E5277] dark:text-[#D4CBE5] border border-[#DDD5EA] dark:border-[#3E384D]">
                AI NAVIGATOR
              </span>
            </div>
            {/* Small line: #64625A */}
            <div className="text-[10px] font-mono text-[#64625A] dark:text-[#BDB5A6]">
              SYS // REAL-TIME LEARNING ENGINE
            </div>
          </div>
        </div>

        {/* Top-Right: Video Reference Signature Nav Pill (Section 10) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Nav Pill: background rgba(248,244,236,0.88), border #D8CCB9, text #20211E, secondary text #5A5B53, active #4F6288 */}
          <div
            className="flex items-center px-4 py-2 rounded-full bg-[#F8F4EC]/90 dark:bg-[#242520]/90 backdrop-blur-xl border border-[#D8CCB9] dark:border-[#3B3E36] text-xs font-mono font-bold transition-all shadow-sm"
            style={{ boxShadow: '0 4px 16px rgba(40, 34, 27, 0.08)' }}
          >
            <button
              onClick={() => {
                if (state.viewMode === 'workspace') {
                  setViewMode('cinematic');
                } else {
                  window.scrollTo({ top: window.innerHeight * 3.5, behavior: 'smooth' });
                }
              }}
              className="text-[#20211E] dark:text-[#F4EDE1] hover:text-[#4F6288] dark:hover:text-[#9FB0D3] transition-colors"
            >
              LEARN
            </button>

            {/* Video-style short line divider: #D8CCB9 */}
            <span className="mx-3 w-6 h-[1.5px] bg-[#D8CCB9] dark:bg-[#3B3E36]" />

            <button
              onClick={() => setViewMode(state.viewMode === 'cinematic' ? 'workspace' : 'cinematic')}
              className={`transition-colors ${
                state.viewMode === 'workspace'
                  ? 'text-[#4F6288] dark:text-[#9FB0D3]'
                  : 'text-[#5A5B53] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-[#F4EDE1]'
              }`}
            >
              {state.viewMode === 'cinematic' ? 'WORKSPACE' : '3D NAV'}
            </button>
          </div>

          {/* Theme Toggle: Charcoal #292A26 with Cream #F7F0E5 icon */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Bright/Dark Visual Theme"
            className="w-9 h-9 rounded-full bg-[#292A26] dark:bg-[#F4EDE1] border border-[#57584E] dark:border-[#D8CCB9] shadow-sm hover:scale-105 flex items-center justify-center text-[#F7F0E5] dark:text-[#20211E] transition-all"
            title={`Switch to ${isBright ? 'Dark' : 'Bright'} Theme`}
          >
            {isBright ? <Moon className="w-4 h-4 text-[#F7F0E5]" /> : <Sun className="w-4 h-4 text-[#20211E]" />}
          </button>

          {/* Quick Menu Trigger: Charcoal #292A26 with Cream #F7F0E5 icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open Navigation Menu"
            className="w-9 h-9 rounded-full bg-[#292A26] dark:bg-[#F4EDE1] border border-[#57584E] dark:border-[#D8CCB9] shadow-sm hover:scale-105 flex items-center justify-center text-[#F7F0E5] dark:text-[#20211E] transition-all"
          >
            <Layers className="w-4 h-4 text-[#F7F0E5] dark:text-[#20211E]" />
          </button>
        </div>
      </header>

      {/* Floating Modal / Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#20211E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#F8F4EC] dark:bg-[#242520] border border-[#D8CCB9] dark:border-[#3B3E36] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#D8CCB9] dark:border-[#3B3E36] pb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#20211E] dark:text-[#F4EDE1]" />
                <h3 className="font-bold text-sm text-[#20211E] dark:text-[#F4EDE1]">AVENZA NAVIGATION PORTAL</h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-xs font-mono text-[#64625A] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-white"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'skills', label: '01. Skill Map', icon: <Layers className="w-4 h-4" />, color: '#4F6288' },
                { id: 'journey', label: '02. Learning Route', icon: <Map className="w-4 h-4" />, color: '#4C6650' },
                { id: 'mentor', label: '03. AI Mentor', icon: <Bot className="w-4 h-4" />, color: '#5E5277' },
                { id: 'discover', label: '04. Discovery Compass', icon: <Sparkles className="w-4 h-4" />, color: '#8A5440' },
                { id: 'missions', label: '05. Practical Labs', icon: <Zap className="w-4 h-4" />, color: '#4C6650' },
                { id: 'passport', label: '06. Skill Passport', icon: <Award className="w-4 h-4" />, color: '#4F6288' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMenuOpen(false);
                    openModuleDrawer(item.id);
                  }}
                  className="p-3 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] hover:bg-[#E8DDCB] dark:hover:bg-[#383A35] border border-[#D8CCB9] dark:border-[#3B3E36] text-left transition-all group"
                >
                  <div className="mb-1 group-hover:scale-110 transition-transform" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-[#20211E] dark:text-[#F4EDE1]">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#D8CCB9] dark:border-[#3B3E36] flex items-center justify-between text-xs text-[#64625A] dark:text-[#BDB5A6]">
              <span className="font-mono">User: {user.name}</span>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (window.confirm('Reset demo state to initial fresh status?')) {
                    resetAllData();
                  }
                }}
                className="text-[#8A5440] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
