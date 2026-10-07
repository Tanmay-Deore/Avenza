import React from 'react';
import { DashboardMotionProvider } from './DashboardMotionProvider';
import { DailyLearningHero } from './DailyLearningHero';
import { GoalSummaryCard } from './GoalSummaryCard';
import { SkillGapSummary } from './SkillGapSummary';
import { ActiveMissionCard } from './ActiveMissionCard';
import { MentorQuickCallout } from './MentorQuickCallout';
import { QuickStats } from './QuickStats';

const DASHBOARD_KEYFRAME_STYLES = `
@keyframes skillGapSignalGlide {
  0% {
    left: 0%;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 85%;
    opacity: 0;
  }
}

@keyframes progressSegmentGleam {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes livePulseOnce {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(155, 181, 159, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 2px rgba(155, 181, 159, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(155, 181, 159, 0);
  }
}

@keyframes statusPulse {
  0% {
    box-shadow: 0 0 0 0 var(--pulse-color, rgba(155, 181, 159, 0.6));
  }
  70% {
    box-shadow: 0 0 0 6px rgba(155, 181, 159, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(155, 181, 159, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-reduced-motion,
  .dashboard-reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}
`;

export const DashboardView: React.FC = () => {
  return (
    <DashboardMotionProvider>
      <div className="space-y-6 pb-20 select-none outline-none dashboard-reduced-motion">
        <style>{DASHBOARD_KEYFRAME_STYLES}</style>

        {/* 1. Daily Hero: Today's Focus, Active Goal & Living Route (Scroll Story Step 1 & 2) */}
        <div
          className="transition-all duration-500 ease-out"
          style={{
            animation: 'fadeIn 400ms ease-out forwards',
          }}
        >
          <DailyLearningHero />
        </div>

        {/* 2. Contextual AI Mentor Callout: Guidance Signal (Scroll Story Step 3) */}
        <div
          className="transition-all duration-500 ease-out"
          style={{
            animation: 'fadeIn 450ms ease-out 100ms both',
          }}
        >
          <MentorQuickCallout />
        </div>

        {/* 3. High-Priority Action Grid (Scroll Story Step 4 & 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Learning Obstacles & Mission Launchpad */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{
              animation: 'fadeIn 500ms ease-out 200ms both',
            }}
          >
            <SkillGapSummary />
            <ActiveMissionCard />
          </div>

          {/* Right Column: Goal Beacon & Achievement Capsules */}
          <div
            className="space-y-6"
            style={{
              animation: 'fadeIn 550ms ease-out 300ms both',
            }}
          >
            <GoalSummaryCard />
            <QuickStats />
          </div>
        </div>
      </div>
    </DashboardMotionProvider>
  );
};
