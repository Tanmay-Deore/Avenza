import React from 'react';
import { DailyLearningHero } from './DailyLearningHero';
import { GoalSummaryCard } from './GoalSummaryCard';
import { SkillGapSummary } from './SkillGapSummary';
import { ActiveMissionCard } from './ActiveMissionCard';
import { MentorQuickCallout } from './MentorQuickCallout';
import { QuickStats } from './QuickStats';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* 1. Daily Hero: Today's Focus & Next Action */}
      <DailyLearningHero />

      {/* 2. Contextual Mentor Callout */}
      <MentorQuickCallout />

      {/* 3. High-Priority Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <SkillGapSummary />
          <ActiveMissionCard />
        </div>

        <div className="space-y-6">
          <GoalSummaryCard />
          <QuickStats />
        </div>
      </div>
    </div>
  );
};
