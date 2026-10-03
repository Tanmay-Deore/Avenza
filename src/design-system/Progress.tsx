import React from 'react';
import { cn } from './utils';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'cyan' | 'emerald' | 'gradient' | 'warning';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'gradient',
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    primary: 'bg-blue-500',
    cyan: 'bg-cyan-400',
    emerald: 'bg-emerald-500',
    warning: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs text-gray-300 font-medium">
          <span>{label || 'Progress'}</span>
          <span className="font-mono text-gray-400">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-[#121826] rounded-full overflow-hidden border border-[#26354D]/60', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CircularProgress: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'cyan' | 'emerald' | 'gradient';
  children?: React.ReactNode;
}> = ({
  value,
  max = 100,
  size = 72,
  strokeWidth = 6,
  children,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-[#182234] stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-cyan-400 stroke-current transition-all duration-700 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || <span className="text-xs font-bold font-mono text-gray-100">{percentage}%</span>}
      </div>
    </div>
  );
};
