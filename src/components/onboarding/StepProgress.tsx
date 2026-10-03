import React from 'react';
import { cn } from '../../design-system/utils';
import { Check } from 'lucide-react';

export interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <div className="w-full mb-6">
      {/* Top indicator: Current step / Total steps */}
      <div className="flex justify-between items-center text-xs text-gray-400 font-medium mb-3">
        <span className="uppercase tracking-wider text-[11px] font-bold text-cyan-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-semibold text-gray-300">{stepLabels[currentStep - 1]}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-2">
        {stepLabels.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={label} className="space-y-1">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  isDone
                    ? 'bg-emerald-400'
                    : isCurrent
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    : 'bg-[#1F2C42]'
                )}
              />
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 truncate">
                {isDone && <Check className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />}
                <span className={cn(isCurrent ? 'text-cyan-300 font-bold' : isDone ? 'text-gray-300' : 'text-gray-400')}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
