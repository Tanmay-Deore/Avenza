import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { useDashboardMotion } from './useDashboardMotion';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import {
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export const DailyLearningHero: React.FC = () => {
  const {
    user,
    journey,
    activeStep,
    openStepDetail,
    openMissionModal,
    openVerificationModal,
    setActiveTab,
  } = useAvenza();

  const {
    pulsePhase,
    activeRelationship,
    triggerJourneyPulse,
  } = useDashboardMotion();

  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isCheckpointPulsing, setIsCheckpointPulsing] = useState(false);
  const [isRouteHovered, setIsRouteHovered] = useState(false);
  const [isGoalHovered, setIsGoalHovered] = useState(false);
  const [isRoutePreviewOpen, setIsRoutePreviewOpen] = useState(false);
  const checkpointTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (checkpointTimerRef.current) clearTimeout(checkpointTimerRef.current);
    };
  }, []);

  const handleHeroHoverChange = (hovered: boolean) => {
    setIsHeroHovered(hovered);
    if (hovered) {
      setIsCheckpointPulsing(true);
      if (checkpointTimerRef.current) clearTimeout(checkpointTimerRef.current);
      checkpointTimerRef.current = setTimeout(() => {
        setIsCheckpointPulsing(false);
      }, 700);
    } else {
      setIsCheckpointPulsing(false);
    }
  };

  const completedSteps = journey.filter((s) => s.status === 'COMPLETED').length;
  const totalSteps = Math.max(1, journey.length);
  const journeyPercentage = Math.round((completedSteps / totalSteps) * 100);

  const isMission = activeStep?.type === 'MISSION';
  const isVerification = activeStep?.type === 'VERIFICATION';

  const handleLaunchPrimaryAction = () => {
    if (!activeStep) return;
    if (activeStep.type === 'MISSION' && activeStep.missionId) {
      openMissionModal(activeStep.missionId);
    } else if (activeStep.type === 'VERIFICATION' && activeStep.verificationId) {
      openVerificationModal(activeStep.skills[0] || 'python-core');
    } else {
      openStepDetail(activeStep);
    }
  };

  // Cross-section relationship linking (Idea 11): Is current checkpoint linked to hovered gap?
  const isLinkedToCheckpoint = Boolean(
    activeRelationship &&
      (activeStep?.skills?.includes(activeRelationship) ||
        (activeStep?.title?.toLowerCase() || '').includes(activeRelationship.toLowerCase()))
  );

  const isGoalActiveInPulse = pulsePhase === 'goal';
  const isCheckpointActiveInPulse = pulsePhase === 'checkpoint';

  return (
    <AvenzaCardWrapper
      preset="primary"
      tint="blue"
      isHighlighted={isLinkedToCheckpoint}
      highlightColor="#8798B7"
      isPulsing={isCheckpointActiveInPulse}
      onHoverChange={handleHeroHoverChange}
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E302B] via-[#282923] to-[#242520] border border-[#3A3B34] p-6 sm:p-8 shadow-xl w-full h-full">
        {/* Background subtle ambient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8798B7]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#9BB59F]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top bar: ACTIVE GOAL — “MISSION CONTROL” (Idea 01) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#3A3B34]">
            <div
              onMouseEnter={() => setIsGoalHovered(true)}
              onMouseLeave={() => setIsGoalHovered(false)}
              className="flex items-center gap-2 group cursor-pointer"
              onClick={triggerJourneyPulse}
              title="Click to pulse learning journey"
            >
              {/* Mission Control Goal Badge */}
              <span
                className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md transition-all duration-300 flex items-center gap-1.5 ${
                  isGoalHovered || isGoalActiveInPulse
                    ? 'bg-[#3A3C34] text-[#E0C77F] border border-[#D1B46A]/60 shadow-sm shadow-[#D1B46A]/20'
                    : 'bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#8798B7] transition-transform duration-300 group-hover:rotate-45" />
                Active Goal
              </span>

              {/* Mission Control Directional Route Signal: GOAL •────→ DESTINATION (Idea 01) */}
              <div
                className="hidden sm:flex items-center gap-1 transition-all duration-300 pointer-events-none"
                style={{
                  opacity: isGoalHovered || isGoalActiveInPulse ? 0.95 : 0.35,
                  transform: isGoalHovered ? 'translateX(2px)' : 'none',
                }}
                aria-hidden="true"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8798B7]" />
                <span
                  className="h-[1px] bg-[#8798B7] transition-all duration-300"
                  style={{ width: isGoalHovered ? '24px' : '12px' }}
                />
                <span className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[4px] border-l-[#8798B7]" />
              </div>

              {/* Exact Destination Title */}
              <span
                className={`text-sm font-bold transition-colors duration-200 ${
                  isGoalHovered || isGoalActiveInPulse ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
                }`}
              >
                {user.currentGoal?.title || 'Personalized Skill Path'}
              </span>
            </div>

            {/* Time Allocation & View Full Journey with Route Preview (Idea 10) */}
            <div className="flex items-center gap-4 text-xs relative">
              <div className="flex items-center gap-1.5 text-[#A9B7D0] font-semibold bg-[#30312C] px-3 py-1 rounded-lg border border-[#4A4A42]">
                <Clock className="w-3.5 h-3.5 text-[#8798B7]" />
                <span>Today's Target: {user.availableMinutesPerDay} min</span>
              </div>

              {/* View Full Journey -> with Route Preview Popover (Idea 10) */}
              <div
                className="relative"
                onMouseEnter={() => setIsRoutePreviewOpen(true)}
                onMouseLeave={() => setIsRoutePreviewOpen(false)}
              >
                <button
                  onClick={() => setActiveTab('journey')}
                  className="text-[#A39F94] hover:text-[#F5EFE4] text-xs font-medium transition-colors flex items-center gap-1 py-1"
                >
                  <span>View Full Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Route Preview Miniature Overlay (Idea 10: uses actual journey data) */}
                {isRoutePreviewOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#282923] border border-[#4A4A42] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                    style={{
                      boxShadow:
                        '0 16px 36px -6px rgba(18, 19, 15, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#373832] text-[10px] font-mono uppercase tracking-wider text-[#A39F94]">
                      <span className="flex items-center gap-1.5 text-[#B4CCB8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9BB59F] animate-pulse" />
                        Route Preview
                      </span>
                      <span>
                        {completedSteps} / {totalSteps} Checkpoints
                      </span>
                    </div>

                    <div className="pt-2 space-y-1.5">
                      {journey.slice(0, 4).map((step, idx) => {
                        const isCurrent = step.id === activeStep?.id;
                        const isDone = step.status === 'COMPLETED';
                        return (
                          <div key={step.id} className="flex items-center gap-2 text-xs py-0.5">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                                isCurrent
                                  ? 'bg-[#8798B7] text-[#20211E]'
                                  : isDone
                                  ? 'bg-[#9BB59F]/20 text-[#B4CCB8] border border-[#9BB59F]/40'
                                  : 'bg-[#30312C] text-[#A39F94]'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span
                              className={`truncate text-[11px] ${
                                isCurrent
                                  ? 'font-bold text-[#FFF9EE]'
                                  : isDone
                                  ? 'line-through text-[#A39F94]'
                                  : 'text-[#BDB5A7]'
                              }`}
                            >
                              {step.title}
                            </span>
                            {isCurrent && (
                              <span className="ml-auto text-[9px] font-mono text-[#8798B7] uppercase tracking-wider shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {journey.length > 4 && (
                        <div className="text-[10px] font-mono text-[#A39F94] pt-1 text-center border-t border-[#373832]/60">
                          + {journey.length - 4} more checkpoints → Capstone
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: CURRENT CHECKPOINT — “CHECKPOINT REACTOR” (Idea 02) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Checkpoint Reactor Activation Badge (Idea 02) */}
                <span
                  className="relative inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B4CCB8] px-2.5 py-0.5 rounded bg-[#9BB59F]/16 border border-[#9BB59F]/50 transition-all duration-300"
                  style={{
                    boxShadow:
                      isCheckpointPulsing || isCheckpointActiveInPulse
                        ? '0 0 12px rgba(155, 181, 159, 0.45)'
                        : 'none',
                  }}
                >
                  <span className="relative flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#9BB59F]" />
                    {(isCheckpointPulsing || isCheckpointActiveInPulse) && (
                      <span
                        className="absolute -inset-1 rounded-full border border-[#9BB59F] opacity-75 animate-ping pointer-events-none"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  Current Checkpoint
                </span>

                <span className="text-xs text-[#A39F94]">
                  Estimated time: {activeStep?.estimatedMinutes || user.availableMinutesPerDay} min
                </span>

                {/* Cross-section connection telemetry badge (Idea 11) */}
                {isLinkedToCheckpoint && (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#8798B7]/20 text-[#A9B7D0] border border-[#8798B7]/40 animate-pulse">
                    Linked // Resolves Active Gap
                  </span>
                )}
              </div>

              {/* Checkpoint Hero Title */}
              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight leading-snug transition-colors duration-200 ${
                  isHeroHovered || isCheckpointActiveInPulse ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
                }`}
                style={{
                  transform: isHeroHovered
                    ? 'translate3d(calc(var(--px, 0) * 1.3px), calc(var(--py, 0) * 0.9px - 1px), 16px)'
                    : 'none',
                  transition: 'transform 0.2s ease-out, color 0.2s ease',
                }}
              >
                {activeStep ? activeStep.title : 'All Milestones Completed!'}
              </h2>

              <p className="text-sm text-[#BDB5A7] leading-relaxed max-w-2xl">
                {activeStep?.actionInstruction ||
                  'You have completed all checkpoints for this learning route. Take the final capstone assessment to lock in your Skill Passport credential.'}
              </p>

              {/* “Why This Matters” Micro-Reveal (Idea 12) */}
              <div
                className="text-[11px] font-mono text-[#A9B7D0] flex items-center gap-1.5 transition-opacity duration-300"
                style={{ opacity: isHeroHovered || isLinkedToCheckpoint ? 0.95 : 0.6 }}
              >
                <span className="text-[#8798B7]">Why this matters →</span>
                <span>Directly builds core prerequisite skills for AI/ML engineering pipeline.</span>
              </div>

              {/* Tactical Actions (Idea 02 & Launch Button) */}
              <div
                className="pt-2 flex flex-wrap items-center gap-3"
                style={{
                  transform: isHeroHovered ? 'translateZ(14px)' : 'none',
                  transition: 'transform 0.25s ease',
                }}
              >
                <button
                  onClick={handleLaunchPrimaryAction}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-md shadow-[#8798B7]/20 transition-all flex items-center gap-2 active:scale-[0.988] group"
                >
                  {isMission ? (
                    <Zap className="w-4 h-4 text-[#20211E] transition-transform duration-200 group-hover:scale-110" />
                  ) : isVerification ? (
                    <ShieldAlert className="w-4 h-4 text-[#20211E] transition-transform duration-200 group-hover:scale-110" />
                  ) : (
                    <Play className="w-4 h-4 text-[#20211E] transition-transform duration-200 group-hover:scale-110" />
                  )}
                  <span>
                    {isMission
                      ? 'Launch Mission Workspace'
                      : isVerification
                      ? 'Start Skill Verification'
                      : 'Start Action'}
                  </span>
                </button>

                {activeStep && (
                  <button
                    onClick={() => openStepDetail(activeStep)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#30312C] hover:bg-[#373832] text-[#F5EFE4] border border-[#4A4A42] transition-colors active:scale-[0.988]"
                  >
                    Inspect Step Details
                  </button>
                )}
              </div>
            </div>

            {/* Right: ROUTE COMPLETION — “LIVING ROUTE” (Idea 03) */}
            <AvenzaCardWrapper
              preset="secondary"
              tint="blue"
              onHoverChange={setIsRouteHovered}
              className="w-full h-full"
            >
              <div className="p-4 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-3.5 w-full h-full flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#BDB5A7]">Route Completion</span>
                  <span
                    className={`font-mono font-bold transition-colors ${
                      isRouteHovered ? 'text-[#FFF9EE]' : 'text-[#A9B7D0]'
                    }`}
                    style={{
                      transform: isRouteHovered ? 'translateZ(12px)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {journeyPercentage}%
                  </span>
                </div>

                {/* Living Route Progress Representation (Idea 03 & 14) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#A39F94] uppercase tracking-wider">
                    <span>START</span>
                    <span className="text-[#8798B7] font-semibold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#8798B7] animate-pulse" />
                      YOU ARE HERE
                    </span>
                    <span>DESTINATION</span>
                  </div>

                  <div className="w-full bg-[#373832] h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B6D8D] to-[#8798B7] rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: `${Math.max(4, journeyPercentage)}%` }}
                    >
                      {/* Living Waypoint Beacon Node */}
                      <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#FFF9EE] shadow-sm pointer-events-none"
                        style={{
                          boxShadow: '0 0 6px rgba(255, 249, 238, 0.9)',
                        }}
                      />

                      {/* Moving route sheen on hover */}
                      {isRouteHovered && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                          style={{
                            animation:
                              'progressSegmentGleam 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between text-[11px] text-[#A39F94] pt-1"
                  style={{
                    transform: isRouteHovered ? 'translateZ(8px)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <span>
                    {completedSteps} of {totalSteps} checkpoints
                  </span>
                  <span className="flex items-center gap-1 text-[#B4CCB8] font-medium">
                    <CheckCircle2 className="w-3 h-3 text-[#9BB59F]" />
                    {totalSteps - completedSteps} steps remaining
                  </span>
                </div>
              </div>
            </AvenzaCardWrapper>
          </div>
        </div>
      </div>
    </AvenzaCardWrapper>
  );
};
