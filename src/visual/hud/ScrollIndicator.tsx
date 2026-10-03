import React from 'react';
import { useVisual } from '../visualStateStore';

export const ScrollIndicator: React.FC = () => {
  const { state } = useVisual();
  const p = state.scrollProgress;

  return (
    <aside aria-label="Journey Progress Indicator" className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex flex-col items-end gap-3">
      {/* Track bar: #D8CCB9 background, #292A26 (soft black) fill */}
      <div className="relative w-1.5 h-48 rounded-full bg-[#D8CCB9] dark:bg-[#3B3E36] overflow-hidden">
        <div
          className="w-full bg-[#292A26] dark:bg-[#F4EDE1] transition-all duration-150 rounded-full"
          style={{ height: `${Math.min(100, p * 100)}%` }}
        />
      </div>

      {/* Numerical percentage in #20211E & Active Scene Label in #64625A */}
      <div className="text-right font-mono">
        <div className="text-xs font-black text-[#20211E] dark:text-[#F4EDE1]">
          {Math.round(p * 100)}%
        </div>
        <div className="text-[9px] text-[#64625A] dark:text-[#BDB5A6] font-bold uppercase tracking-wider">
          {state.coreState}
        </div>
      </div>
    </aside>
  );
};
