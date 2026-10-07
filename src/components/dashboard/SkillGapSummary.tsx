import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { useDashboardMotion } from './useDashboardMotion';
import { SeverityBadge } from '../../design-system/StatusBadge';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import { AlertCircle, ArrowRight, ShieldCheck, Radar, List } from 'lucide-react';
import { SkillGap } from '../../types';

interface SkillGapRowItemProps {
  gap: SkillGap;
  isPulsing?: boolean;
  onVerify?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

const SkillGapRowItem: React.FC<SkillGapRowItemProps> = ({
  gap,
  isPulsing = false,
  onVerify,
  onHoverChange,
}) => {
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
    onHoverChange?.(true);
    if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
    signalTimerRef.current = setTimeout(() => setIsSignalActive(false), 700);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsSignalActive(false);
    onHoverChange?.(false);
  };

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative p-3 rounded-lg border transition-all duration-300 flex flex-col justify-between gap-1.5 overflow-hidden ${
        isHovered || isPulsing
          ? 'bg-[#353731] border-[#C6927D]/70 shadow-md shadow-[#12130F]/40'
          : 'bg-[#30312C] border-[#4A4A42]'
      }`}
      style={{
        transform:
          isHovered || isPulsing
            ? 'translate3d(0px, -2.5px, 6px)'
            : 'translate3d(0px, 0px, 0px)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Obstacle Indicator Pip (Idea 05 & Section 19) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-[#C6927D] rounded-l transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered || isPulsing ? 1 : 0,
          boxShadow: isHovered || isPulsing ? '0 0 8px rgba(198, 146, 125, 0.6)' : 'none',
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-bold text-xs transition-colors duration-200 ${
                isHovered || isPulsing ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
            >
              {gap.skillName}
            </span>
            <SeverityBadge severity={gap.gapSeverity} />

            {/* Gap Path Signal: • ───→ (Idea 05 & 20) */}
            <div
              className="relative w-12 h-1.5 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#4A4A42]/50 -translate-y-1/2" />
              {(isSignalActive || isPulsing) && (
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
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#373832] text-[#E0C77F] border border-[#D1B46A]/50 hover:bg-[#40423A] transition-colors font-medium whitespace-nowrap active:scale-[0.985]"
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

      {/* “Why This Matters” Micro-Reveal (Idea 12 & Section 38: smooth non-shifting reveal) */}
      <div
        className="text-[10px] font-mono text-[#C6927D] overflow-hidden transition-all duration-300 pl-1 flex items-center gap-1.5"
        style={{
          maxHeight: isHovered ? '20px' : '0px',
          opacity: isHovered ? 0.95 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(-2px)',
        }}
      >
        <span>Why this matters →</span>
        <span className="text-[#A39F94]">Required milestone on your target AI Engineer path.</span>
      </div>
    </div>
  );
};

export const SkillGapSummary: React.FC = () => {
  const { skillGaps, openVerificationModal, setActiveTab } = useAvenza();
  const { pulsePhase, setHoveredGapId, isRadarOpen, setIsRadarOpen } = useDashboardMotion();
  const [isCardHovered, setIsCardHovered] = useState(false);

  const priorityGaps = skillGaps.slice(0, 3);
  const isGapActiveInPulse = pulsePhase === 'gap';

  return (
    <AvenzaCardWrapper
      preset="secondary"
      tint="clay"
      isPulsing={isGapActiveInPulse}
      highlightColor="#C6927D"
      onHoverChange={setIsCardHovered}
      className="w-full"
    >
      <div className="bg-[#282923] border border-[#4A4A42] rounded-2xl shadow-sm w-full p-5 sm:p-6 relative">
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
                isCardHovered || isGapActiveInPulse ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
              style={{
                transform: isCardHovered ? 'translateZ(14px)' : 'none',
              }}
            >
              Identified Skill Gaps
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Gap Radar Toggle (Idea 09) */}
            <button
              type="button"
              onClick={() => setIsRadarOpen(!isRadarOpen)}
              className={`text-xs px-2 py-1 rounded-md border transition-all flex items-center gap-1 font-mono text-[11px] ${
                isRadarOpen
                  ? 'bg-[#C6927D]/20 text-[#E3A28E] border-[#C6927D]/50 shadow-sm'
                  : 'bg-[#30312C] text-[#A39F94] hover:text-[#F5EFE4] border-[#4A4A42]'
              }`}
              title="Toggle Gap Radar Visualization"
            >
              {isRadarOpen ? <List className="w-3.5 h-3.5" /> : <Radar className="w-3.5 h-3.5" />}
              <span>{isRadarOpen ? 'List' : 'Radar'}</span>
            </button>

            {/* Preserved Action: All Gaps (7) -> */}
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
        </div>

        {/* Content Body: Either Gap Radar (Idea 09) or Interactive Roadblock Rows (Idea 05) */}
        <div className="pt-3">
          {isRadarOpen ? (
            /* GAP RADAR (Idea 09 & Section 31-33) */
            <div className="relative py-4 px-2 bg-[#20211E]/70 rounded-xl border border-[#3A3B34] flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
              {/* Concentric Priority Rings */}
              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                {/* Outer Ring: Medium */}
                <div className="absolute inset-0 rounded-full border border-[#4A4A42]/40" />
                {/* Middle Ring: High */}
                <div className="absolute inset-6 rounded-full border border-[#4A4A42]/60" />
                {/* Inner Ring: Critical */}
                <div className="absolute inset-12 rounded-full border border-[#C6927D]/40 bg-[#C6927D]/5" />

                {/* Radar Rotating Sweep Line */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, rgba(198, 146, 125, 0.15) 60deg, transparent 65deg)',
                    animation: 'spin 4s linear infinite',
                  }}
                />

                {/* Center Core: Target Position */}
                <div className="w-3 h-3 rounded-full bg-[#E0C77F] shadow-sm shadow-[#E0C77F] flex items-center justify-center z-10">
                  <span className="w-1 h-1 rounded-full bg-[#20211E]" />
                </div>

                {/* Blips plotted on real gaps */}
                {skillGaps.slice(0, 5).map((gap, idx) => {
                  const isCrit = gap.gapSeverity === 'CRITICAL';
                  // Radius based on severity
                  const radius = isCrit ? 36 : 64;
                  const angle = (idx / 5) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <button
                      key={gap.skillId}
                      type="button"
                      onClick={() => openVerificationModal(gap.skillId)}
                      className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full flex items-center justify-center group z-20 transition-transform hover:scale-125"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      title={`${gap.skillName} (${gap.gapSeverity})`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCrit ? 'bg-[#C6927D] shadow-sm shadow-[#C6927D]' : 'bg-[#8798B7]'
                        }`}
                      />
                      <span className="hidden group-hover:block absolute bottom-full mb-1 px-2 py-0.5 rounded bg-[#1A1B18] border border-[#4A4A42] text-[9px] font-mono text-[#F5EFE4] whitespace-nowrap z-30">
                        {gap.skillName} ({gap.gapSeverity})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Radar Legend */}
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono pt-2 text-[#A39F94] border-t border-[#373832] w-full">
                <span className="flex items-center gap-1.5 text-[#E3A28E]">
                  <span className="w-2 h-2 rounded-full bg-[#C6927D]" />
                  CRITICAL (Inner)
                </span>
                <span className="flex items-center gap-1.5 text-[#A9B7D0]">
                  <span className="w-2 h-2 rounded-full bg-[#8798B7]" />
                  HIGH / MEDIUM (Outer)
                </span>
              </div>
            </div>
          ) : (
            /* ROADBLOCK ROWS (Idea 05 & Section 18-20) */
            <div className="space-y-2.5">
              {priorityGaps.length === 0 ? (
                <div className="text-center py-4 text-xs text-[#A39F94] flex flex-col items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#9BB59F]" />
                  <span>All target prerequisites satisfied!</span>
                </div>
              ) : (
                priorityGaps.map((gap, idx) => (
                  <SkillGapRowItem
                    key={gap.skillId}
                    gap={gap}
                    isPulsing={isGapActiveInPulse && idx === 0}
                    onVerify={() => openVerificationModal(gap.skillId)}
                    onHoverChange={(hovered) => setHoveredGapId(hovered ? gap.skillId : null)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AvenzaCardWrapper>
  );
};
