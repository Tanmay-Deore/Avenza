import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import { Bot, ArrowRight } from 'lucide-react';

export const MentorQuickCallout: React.FC = () => {
  const { user, activeStep, setActiveTab, sendMentorQuery } = useAvenza();
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
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#30312C] via-[#373832] to-[#30312C] border border-[#4A4A42] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm w-full h-full">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-[#282923] text-[#BDB2D6] border border-[#4A4A42] flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200"
            style={{
              transform: isHovered ? 'translateZ(14px)' : 'none',
            }}
          >
            <Bot className="w-5 h-5 text-[#A79BC4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#BDB2D6] uppercase tracking-wider">
                Contextual AI Mentor Insight
              </span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded bg-[#9BB59F]/16 text-[#B4CCB8] border border-[#9BB59F]/50 font-mono font-bold transition-all duration-300"
                style={{
                  animation: isLivePulsing
                    ? 'livePulseOnce 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) 1'
                    : 'none',
                }}
              >
                Live
              </span>
            </div>
            <p className="text-xs text-[#BDB5A7] mt-1 leading-relaxed">
              {activeStep
                ? `You're working on "${activeStep.title}". Remember: focus on understanding data flow and error states before writing code.`
                : `You're in great shape! Ready to verify your next competency for your Skill Passport?`}
            </p>
          </div>
        </div>

        <button
          onClick={handleAskContextual}
          className="self-start sm:self-center px-3.5 py-2 rounded-lg bg-[#282923] hover:bg-[#30312C] text-[#A9B7D0] hover:text-[#F5EFE4] border border-[#4A4A42] text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap"
          style={{
            transform: isHovered ? 'translateZ(12px)' : 'none',
          }}
        >
          <span>Ask AI Mentor</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8798B7]" />
        </button>
      </div>
    </AvenzaCardWrapper>
  );
};

