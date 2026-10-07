import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { AvenzaCardWrapper, CardLightTint } from './AvenzaCardWrapper';
import { ShieldCheck, Award, Zap, Flame } from 'lucide-react';

type StatType = 'verified' | 'missions' | 'streak' | 'ledger';

interface StatItemConfig {
  type: StatType;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
  tint: CardLightTint;
}

const StatIcon: React.FC<{ type: StatType; isHovered: boolean }> = ({ type, isHovered }) => {
  switch (type) {
    case 'verified':
      return (
        <div className="relative flex items-center justify-center">
          <ShieldCheck
            className="w-4 h-4 text-[#9BB59F] transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.12)' : 'none' }}
          />
          {isHovered && (
            <span
              className="absolute -inset-1 rounded-full border border-[#9BB59F] opacity-70 animate-ping pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      );
    case 'missions':
      return (
        <div className="relative flex items-center justify-center">
          <Zap
            className="w-4 h-4 text-[#8798B7] transition-all duration-200"
            style={{
              transform: isHovered ? 'scale(1.2)' : 'none',
              filter: isHovered ? 'drop-shadow(0 0 3px rgba(135,152,183,0.8))' : 'none',
            }}
          />
        </div>
      );
    case 'streak':
      return (
        <div className="relative flex items-center justify-center">
          <Flame
            className="w-4 h-4 text-[#D1B46A] fill-[#D1B46A] transition-all duration-300"
            style={{
              transform: isHovered ? 'scale(1.15) rotate(-6deg)' : 'none',
              filter: isHovered ? 'drop-shadow(0 0 4px rgba(209,180,106,0.8))' : 'none',
            }}
          />
        </div>
      );
    case 'ledger':
      return (
        <div className="relative flex items-center justify-center">
          <Award
            className="w-4 h-4 text-[#A79BC4] transition-transform duration-300"
            style={{ transform: isHovered ? 'rotate(12deg) scale(1.1)' : 'none' }}
          />
        </div>
      );
    default:
      return null;
  }
};

const StatMetricCard: React.FC<{ stat: StatItemConfig }> = ({ stat }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Parse value and optional unit (e.g. "4 Days" -> primary: "4", unit: "Days")
  const valueStr = String(stat.value).trim();
  const parts = valueStr.split(/\s+/);
  const primaryValue = parts[0];
  const unit = parts.length > 1 ? parts.slice(1).join(' ') : null;

  return (
    <AvenzaCardWrapper
      preset="metric"
      tint={stat.tint}
      onHoverChange={setIsHovered}
      className="w-full h-full"
    >
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#282923] border border-[#4A4A42] w-full h-full flex flex-col justify-between transition-colors shadow-sm min-h-[110px] sm:min-h-[118px] relative overflow-hidden">
        {/* Top Header: Label & Personality Icon (Idea 07 & Section 25-26) */}
        <div className="flex items-start justify-between gap-1.5 mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A39F94] leading-snug break-words hyphens-none">
            {stat.label}
          </span>
          <div
            className="shrink-0"
            style={{
              transform: isHovered ? 'translateZ(10px)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <StatIcon type={stat.type} isHovered={isHovered} />
          </div>
        </div>

        {/* Metric Value & Supporting Description */}
        <div className="mt-auto">
          <div
            className="flex items-baseline gap-1.5 flex-wrap"
            style={{
              transform: isHovered
                ? 'translate3d(calc(var(--px, 0) * 0.8px), calc(var(--py, 0) * 0.5px), 14px)'
                : 'none',
              transition: 'transform 0.2s ease-out',
            }}
          >
            <span
              className={`text-xl sm:text-2xl font-black ${stat.color} font-mono tracking-tight leading-none transition-transform duration-200`}
              style={{
                transform: isHovered ? 'translateZ(12px)' : 'none',
              }}
            >
              {primaryValue}
            </span>
            {unit && (
              <span
                className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${stat.color} opacity-85 leading-none whitespace-nowrap`}
              >
                {unit}
              </span>
            )}
          </div>

          <div className="text-[10px] sm:text-[11px] text-[#A39F94] mt-1 leading-snug">
            {stat.subtext}
          </div>
        </div>
      </div>
    </AvenzaCardWrapper>
  );
};

export const QuickStats: React.FC = () => {
  const { user, passport, skills } = useAvenza();
  const allSkillsList = Object.values(skills);
  const claimedSkills = allSkillsList.filter((s) => s.currentLevel > 0).length;

  const stats: StatItemConfig[] = [
    {
      type: 'verified',
      label: 'Verified Skills',
      value: passport.verifiedSkillsCount,
      subtext: `out of ${claimedSkills} claimed`,
      color: 'text-[#B4CCB8]',
      tint: 'sage',
    },
    {
      type: 'missions',
      label: 'Missions Mastered',
      value: passport.completedMissionsCount,
      subtext: 'practical lab challenges',
      color: 'text-[#A9B7D0]',
      tint: 'blue',
    },
    {
      type: 'streak',
      label: 'Learning Streak',
      value: `${user.streakDays} Days`,
      subtext: 'consecutive consistency',
      color: 'text-[#E0C77F]',
      tint: 'gold',
    },
    {
      type: 'ledger',
      label: 'Evidence Ledger',
      value: passport.evidenceLedger.length,
      subtext: 'verifiable proof items',
      color: 'text-[#BDB2D6]',
      tint: 'lavender',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-3.5">
      {stats.map((stat, idx) => (
        <StatMetricCard key={idx} stat={stat} />
      ))}
    </div>
  );
};
