import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { SeverityBadge } from '../../design-system/StatusBadge';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SkillGap } from '../../types';

interface SkillGapRowItemProps {
  gap: SkillGap;
  onVerify?: () => void;
}

const SkillGapRowItem: React.FC<SkillGapRowItemProps> = ({ gap, onVerify }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSignalActive, setIsSignalActive] = useState(false);
  const signalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
    };
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    setIsSignalActive(true);
    if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
    signalTimerRef.current = setTimeout(() => setIsSignalActive(false), 700);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsSignalActive(false);
  };

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative p-3 rounded-lg border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 overflow-hidden ${
        isHovered
          ? 'bg-[#353731] border-[#C6927D]/60 shadow-md shadow-[#12130F]/40'
          : 'bg-[#30312C] border-[#4A4A42]'
      }`}
      style={{
        transform: isHovered ? 'translate3d(0px, -2.5px, 6px)' : 'translate3d(0px, 0px, 0px)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Small Left Indicator Bar / Pip (Section 19) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-[#C6927D] rounded-l transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered ? '0 0 8px rgba(198, 146, 125, 0.6)' : 'none',
        }}
        aria-hidden="true"
      />

      <div className="space-y-1 pl-1">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold text-xs transition-colors duration-200 ${
              isHovered ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
            }`}
          >
            {gap.skillName}
          </span>
          <SeverityBadge severity={gap.gapSeverity} />

          {/* Skill Gap Signal (Section 20: • ───→) */}
          <div className="relative w-12 h-1.5 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#4A4A42]/40 -translate-y-1/2" />
            {isSignalActive && (
              <div
                className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full -translate-y-1/2 bg-[#C6927D]"
                style={{
                  animation: 'skillGapSignalGlide 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                }}
              />
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#BDB5A7] line-clamp-1 leading-normal">
          {gap.whatIsMissing}
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {gap.status === 'UNVERIFIED' ? (
          <button
            onClick={onVerify}
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#373832] text-[#E0C77F] border border-[#D1B46A]/50 hover:bg-[#40423A] transition-colors font-medium whitespace-nowrap"
            style={{
              transform: isHovered ? 'translateZ(6px)' : 'none',
            }}
          >
            Verify Claim
          </button>
        ) : (
          <span
            className={`text-[11px] font-mono transition-colors ${
              isHovered ? 'text-[#E3A28E] font-semibold' : 'text-[#A39F94]'
            }`}
            style={{
              transform: isHovered ? 'translateZ(6px)' : 'none',
            }}
          >
            Lvl {gap.currentLevel} → {gap.targetLevel}
          </span>
        )}
      </div>
    </div>
  );
};

export const SkillGapSummary: React.FC = () => {
  const { skillGaps, openVerificationModal, setActiveTab } = useAvenza();
  const [isCardHovered, setIsCardHovered] = useState(false);

  const priorityGaps = skillGaps.slice(0, 3);

  return (
    <AvenzaCardWrapper
      preset="secondary"
      tint="clay"
      onHoverChange={setIsCardHovered}
      className="w-full"
    >
      <div className="bg-[#282923] border border-[#4A4A42] rounded-2xl shadow-sm w-full p-5 sm:p-6">
        <div className="flex flex-row items-center justify-between pb-3 border-b border-[#373832]">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg bg-[#30312C] text-[#C6927D] border border-[#4A4A42] transition-transform duration-200"
              style={{
                transform: isCardHovered ? 'translateZ(12px)' : 'none',
              }}
            >
              <AlertCircle className="w-4 h-4 text-[#C6927D]" />
            </div>
            <h3
              className={`text-sm font-bold transition-colors ${
                isCardHovered ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
              style={{
                transform: isCardHovered ? 'translateZ(14px)' : 'none',
              }}
            >
              Identified Skill Gaps
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('skills')}
            className="text-xs text-[#A9B7D0] hover:text-[#F5EFE4] flex items-center gap-1 font-medium transition-colors"
            style={{
              transform: isCardHovered ? 'translateZ(10px)' : 'none',
            }}
          >
            <span>All Gaps ({skillGaps.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8798B7]" />
          </button>
        </div>

        <div className="pt-3 space-y-2.5">
          {priorityGaps.length === 0 ? (
            <div className="text-center py-4 text-xs text-[#A39F94] flex flex-col items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#9BB59F]" />
              <span>All target prerequisites satisfied!</span>
            </div>
          ) : (
            priorityGaps.map((gap) => (
              <SkillGapRowItem
                key={gap.skillId}
                gap={gap}
                onVerify={() => openVerificationModal(gap.skillId)}
              />
            ))
          )}
        </div>
      </div>
    </AvenzaCardWrapper>
  );
};

