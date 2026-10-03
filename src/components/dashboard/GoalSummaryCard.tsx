import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import { Target, ArrowUpRight } from 'lucide-react';

export const GoalSummaryCard: React.FC = () => {
  const { user, setActiveTab } = useAvenza();
  const [isHovered, setIsHovered] = useState(false);
  const goal = user.currentGoal;

  if (!goal) return null;

  return (
    <AvenzaCardWrapper
      preset="secondary"
      tint="gold"
      onHoverChange={setIsHovered}
      className="w-full"
    >
      <div className="bg-[#282923] border border-[#4A4A42] rounded-2xl shadow-sm w-full p-5 sm:p-6">
        <div className="flex flex-row items-center justify-between pb-3 border-b border-[#373832]">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg bg-[#30312C] text-[#D1B46A] border border-[#4A4A42] transition-transform duration-200"
              style={{
                transform: isHovered ? 'translateZ(14px)' : 'none',
              }}
            >
              <Target className="w-4 h-4 text-[#D1B46A]" />
            </div>
            <h3
              className={`text-sm font-bold transition-colors ${
                isHovered ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
              style={{
                transform: isHovered ? 'translateZ(14px)' : 'none',
              }}
            >
              Target Destination
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs text-[#A9B7D0] hover:text-[#F5EFE4] flex items-center gap-1 font-medium transition-colors"
            style={{
              transform: isHovered ? 'translateZ(10px)' : 'none',
            }}
          >
            <span>Change Goal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8798B7]" />
          </button>
        </div>

        <div className="pt-3 space-y-3">
          <div
            style={{
              transform: isHovered
                ? 'translate3d(calc(var(--px, 0) * 1.0px), calc(var(--py, 0) * 0.7px), 16px)'
                : 'none',
              transition: 'transform 0.2s ease-out',
            }}
          >
            <h4
              className={`font-bold text-sm transition-colors duration-200 ${
                isHovered ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
            >
              {goal.title}
            </h4>
            <p className="text-xs text-[#BDB5A7] mt-1 line-clamp-2 leading-relaxed">
              {goal.description}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#373832]">
            <div
              className="flex items-center justify-between text-xs"
              style={{
                transform: isHovered ? 'translateZ(10px)' : 'none',
              }}
            >
              <span className="text-[#A39F94]">Target Role:</span>
              <span className="font-semibold text-[#F5EFE4]">{goal.targetRoleOrSkill}</span>
            </div>

            <div
              className="flex items-center justify-between text-xs"
              style={{
                transform: isHovered ? 'translateZ(12px)' : 'none',
              }}
            >
              <span className="text-[#A39F94]">Target Competency:</span>
              <span
                className={`font-semibold transition-colors ${
                  isHovered ? 'text-[#E0C77F] font-bold' : 'text-[#D1B46A]'
                }`}
              >
                Level {goal.targetLevel} / 5
              </span>
            </div>
          </div>
        </div>
      </div>
    </AvenzaCardWrapper>
  );
};

