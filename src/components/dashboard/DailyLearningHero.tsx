import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import {
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
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

  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isCheckpointPulsing, setIsCheckpointPulsing] = useState(false);
  const [isRouteHovered, setIsRouteHovered] = useState(false);
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

  return (
    <AvenzaCardWrapper
      preset="primary"
      tint="blue"
      onHoverChange={handleHeroHoverChange}
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E302B] via-[#282923] to-[#242520] border border-[#3A3B34] p-6 sm:p-8 shadow-xl w-full h-full">
        {/* Background subtle ambient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8798B7]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#9BB59F]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top bar: Destination Pill & Time Allocation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#3A3B34]">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42]">
                Active Goal
              </span>
              <span className="text-sm font-bold text-[#F5EFE4]">
                {user.currentGoal?.title || 'Personalized Skill Path'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-[#A9B7D0] font-semibold bg-[#30312C] px-3 py-1 rounded-lg border border-[#4A4A42]">
                <Clock className="w-3.5 h-3.5 text-[#8798B7]" />
                <span>Today's Target: {user.availableMinutesPerDay} min</span>
              </div>
              <button
                onClick={() => setActiveTab('journey')}
                className="text-[#A39F94] hover:text-[#F5EFE4] text-xs font-medium transition-colors flex items-center gap-1"
              >
                <span>View Full Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: What to do right now */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#B4CCB8] px-2 py-0.5 rounded bg-[#9BB59F]/16 border border-[#9BB59F]/50 transition-transform duration-300"
                  style={{
                    animation: isCheckpointPulsing ? 'statusPulse 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) 1' : 'none',
                    // @ts-ignore
                    '--pulse-color': 'rgba(155, 181, 159, 0.45)',
                  }}
                >
                  <Sparkles className="w-3 h-3 text-[#9BB59F]" />
                  Current Checkpoint
                </span>
                <span className="text-xs text-[#A39F94]">
                  Estimated time: {activeStep?.estimatedMinutes || user.availableMinutesPerDay} min
                </span>
              </div>

              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight leading-snug transition-colors duration-200 ${
                  isHeroHovered ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
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

              {/* Micro Action Button */}
              <div
                className="pt-2 flex flex-wrap items-center gap-3"
                style={{
                  transform: isHeroHovered ? 'translateZ(14px)' : 'none',
                  transition: 'transform 0.25s ease',
                }}
              >
                <button
                  onClick={handleLaunchPrimaryAction}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-md shadow-[#8798B7]/20 transition-all flex items-center gap-2"
                >
                  {isMission ? (
                    <Zap className="w-4 h-4 text-[#20211E]" />
                  ) : isVerification ? (
                    <ShieldAlert className="w-4 h-4 text-[#20211E]" />
                  ) : (
                    <Play className="w-4 h-4 text-[#20211E]" />
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
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#30312C] hover:bg-[#373832] text-[#F5EFE4] border border-[#4A4A42] transition-colors"
                  >
                    Inspect Step Details
                  </button>
                )}
              </div>
            </div>

            {/* Right: Path Completion Progress Widget (Section 16: Route Completion Card) */}
            <AvenzaCardWrapper
              preset="secondary"
              tint="blue"
              onHoverChange={setIsRouteHovered}
              className="w-full h-full"
            >
              <div className="p-4 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-3 w-full h-full flex flex-col justify-between">
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

                {/* Route completion progress bar with hover sweep (Section 16) */}
                <div className="w-full bg-[#45463F] h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#8798B7] rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${journeyPercentage}%` }}
                  >
                    {isRouteHovered && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                        style={{
                          animation: 'progressSegmentGleam 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                        }}
                      />
                    )}
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

