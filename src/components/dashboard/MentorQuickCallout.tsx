import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import { Bot, ArrowRight } from 'lucide-react';

export const MentorQuickCallout: React.FC = () => {
  const { activeStep, setActiveTab, sendMentorQuery } = useAvenza();
  const [isHovered, setIsHovered] = useState(false);
  const [isLivePulsing, setIsLivePulsing] = useState(false);
  const liveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (liveTimerRef.current) clearTimeout(liveTimerRef.current);
    };
  }, []);

  const handleHoverChange = (hovered: boolean) => {
    setIsHovered(hovered);
    if (hovered) {
      setIsLivePulsing(true);
      if (liveTimerRef.current) clearTimeout(liveTimerRef.current);
      liveTimerRef.current = setTimeout(() => {
        setIsLivePulsing(false);
      }, 700);
    } else {
      setIsLivePulsing(false);
    }
  };

  const handleAskContextual = () => {
    sendMentorQuery(
      `Can you give me a practical intuition and hint for "${
        activeStep?.title || 'my current checkpoint'
      }"?`
    );
    setActiveTab('mentor');
  };

  return (
    <AvenzaCardWrapper
      preset="secondary"
      tint="lavender"
      onHoverChange={handleHoverChange}
      className="w-full"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#30312C] via-[#373832] to-[#30312C] border border-[#4A4A42] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm w-full h-full relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          {/* AI Mentor Bot Tile with Antenna Signal Ripple (Idea 04) */}
          <div
            className="relative w-9 h-9 rounded-xl bg-[#282923] text-[#BDB2D6] border border-[#4A4A42] flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200"
            style={{
              transform: isHovered ? 'translateZ(14px) scale(1.05)' : 'none',
            }}
          >
            <Bot className="w-5 h-5 text-[#A79BC4] transition-transform duration-300" />
            
            {/* Restrained Antenna Guidance Ripple (Idea 04) */}
            {(isHovered || isLivePulsing) && (
              <span
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-[#A79BC4] opacity-70 pointer-events-none animate-ping"
                aria-hidden="true"
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#BDB2D6] uppercase tracking-wider">
                Contextual AI Mentor Insight
              </span>

              {/* Live Signal Indicator Pill */}
              <span
                className="text-[10px] px-1.5 py-0.2 rounded bg-[#9BB59F]/16 text-[#B4CCB8] border border-[#9BB59F]/50 font-mono font-bold transition-all duration-300 flex items-center gap-1"
                style={{
                  animation: isLivePulsing
                    ? 'livePulseOnce 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) 1'
                    : 'none',
                }}
              >
                <span className="w-1 h-1 rounded-full bg-[#9BB59F] animate-pulse" />
                Live
              </span>

              {/* Signal Vector: AI •────→ INSIGHT (Idea 04) */}
              <div
                className="hidden sm:flex items-center gap-1 transition-opacity duration-300 pointer-events-none"
                style={{ opacity: isHovered ? 0.85 : 0.2 }}
                aria-hidden="true"
              >
                <span className="w-1 h-1 rounded-full bg-[#A79BC4]" />
                <span
                  className="h-[1px] bg-[#A79BC4] transition-all duration-300"
                  style={{ width: isHovered ? '18px' : '8px' }}
                />
                <span className="w-0 h-0 border-y-[2.5px] border-y-transparent border-l-[3.5px] border-l-[#A79BC4]" />
              </div>
            </div>

            <p
              className={`text-xs mt-1 leading-relaxed transition-colors duration-200 ${
                isHovered ? 'text-[#FFF9EE]' : 'text-[#BDB5A7]'
              }`}
            >
              {activeStep
                ? `You're working on "${activeStep.title}". Remember: focus on understanding data flow and error states before writing code.`
                : `You're in great shape! Ready to verify your next competency for your Skill Passport?`}
            </p>
          </div>
        </div>

        {/* Ask AI Mentor CTA Button */}
        <button
          onClick={handleAskContextual}
          className="self-start sm:self-center px-3.5 py-2 rounded-lg bg-[#282923] hover:bg-[#30312C] text-[#A9B7D0] hover:text-[#F5EFE4] border border-[#4A4A42] text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-[0.985] group"
          style={{
            transform: isHovered ? 'translateZ(12px)' : 'none',
          }}
        >
          <span>Ask AI Mentor</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8798B7] transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </AvenzaCardWrapper>
  );
};
