import React from 'react';
import { cn } from './utils';
import { SkillStatus, GoalType } from '../types';
import { CheckCircle2, CircleDashed, AlertTriangle, HelpCircle, Sparkles, BookOpen, Clock } from 'lucide-react';

export interface StatusBadgeProps {
  status: SkillStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = false,
  showIcon = true,
  className,
}) => {
  const configs: Record<SkillStatus, { label: string; bg: string; border: string; text: string; icon: React.ReactNode }> = {
    VERIFIED: {
      label: 'Verified Skill',
      bg: 'bg-[#9BB59F]/16',
      border: 'border-[#9BB59F]/50',
      text: 'text-[#B4CCB8]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#9BB59F]" />,
    },
    LEARNING: {
      label: 'In Progress',
      bg: 'bg-[#8798B7]/16',
      border: 'border-[#8798B7]/50',
      text: 'text-[#A9B7D0]',
      icon: <BookOpen className="w-3.5 h-3.5 text-[#8798B7]" />,
    },
    WEAK: {
      label: 'Critical Gap',
      bg: 'bg-[#C6927D]/16',
      border: 'border-[#C6927D]/50',
      text: 'text-[#E3A28E]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#C6927D]" />,
    },
    UNVERIFIED: {
      label: 'Claimed (Unverified)',
      bg: 'bg-[#D1B46A]/14',
      border: 'border-[#D1B46A]/50',
      text: 'text-[#E0C77F]',
      icon: <HelpCircle className="w-3.5 h-3.5 text-[#D1B46A]" />,
    },
    KNOWN: {
      label: 'Self-Assessed',
      bg: 'bg-[#8798B7]/16',
      border: 'border-[#8798B7]/50',
      text: 'text-[#A9B7D0]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#8798B7]" />,
    },
    RECOMMENDED: {
      label: 'Recommended Next',
      bg: 'bg-[#A79BC4]/16',
      border: 'border-[#A79BC4]/50',
      text: 'text-[#BDB2D6]',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#A79BC4]" />,
    },
    NOT_YET_STARTED: {
      label: 'Not Started',
      bg: 'bg-[#77776E]/18',
      border: 'border-[#77776E]/50',
      text: 'text-[#A8A498]',
      icon: <CircleDashed className="w-3.5 h-3.5 text-[#77776E]" />,
    },
  };

  const current = configs[status] || configs.NOT_YET_STARTED;

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border backdrop-blur-sm tracking-wide',
        current.bg,
        current.border,
        current.text,
        sizes[size],
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', current.text.replace('text-', 'bg-'))} />}
      {showIcon && !showDot && current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export const GoalTypeBadge: React.FC<{ type: GoalType; className?: string }> = ({ type, className }) => {
  const styles: Record<GoalType, { bg: string; text: string; border: string; label: string }> = {
    CAREER: { bg: 'bg-[#8798B7]/16', text: 'text-[#A9B7D0]', border: 'border-[#8798B7]/50', label: 'Career Goal' },
    SKILL: { bg: 'bg-[#9BB59F]/16', text: 'text-[#B4CCB8]', border: 'border-[#9BB59F]/50', label: 'Skill Goal' },
    PROJECT: { bg: 'bg-[#D1B46A]/14', text: 'text-[#E0C77F]', border: 'border-[#D1B46A]/50', label: 'Project Goal' },
    LEARNING: { bg: 'bg-[#A79BC4]/16', text: 'text-[#BDB2D6]', border: 'border-[#A79BC4]/50', label: 'Learning Goal' },
  };

  const item = styles[type] || styles.CAREER;

  return (
    <span className={cn('inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md border', item.bg, item.text, item.border, className)}>
      {item.label}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: 'CRITICAL' | 'MODERATE' | 'MINOR' | 'SATISFIED'; className?: string }> = ({ severity, className }) => {
  const styles = {
    CRITICAL: 'bg-[#C6927D]/16 text-[#E3A28E] border-[#C6927D]/50',
    MODERATE: 'bg-[#D1B46A]/14 text-[#E0C77F] border-[#D1B46A]/50',
    MINOR: 'bg-[#8798B7]/16 text-[#A9B7D0] border-[#8798B7]/50',
    SATISFIED: 'bg-[#9BB59F]/16 text-[#B4CCB8] border-[#9BB59F]/50',
  };

  return (
    <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider', styles[severity], className)}>
      {severity === 'SATISFIED' ? 'Met Requirement' : `${severity === 'CRITICAL' ? 'Critical' : severity} Gap`}
    </span>
  );
};
