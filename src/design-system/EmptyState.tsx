import React from 'react';
import { cn } from './utils';
import { Button } from './Button';
import { Compass } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#182234]/40 border border-[#26354D]/60 max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#1F2C42] border border-[#2F4263] flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
        {icon || <Compass className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">{description}</p>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <Button
              variant="glow"
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
