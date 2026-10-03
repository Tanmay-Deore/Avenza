import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Target, MapPin, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export const ContextInspector: React.FC = () => {
  const { user, activeStep, skillGaps, passport } = useAvenza();
  const criticalGaps = skillGaps.filter((g) => g.gapSeverity === 'CRITICAL');

  return (
    <div className="p-4 rounded-xl bg-[#121826] border border-[#26354D] space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-[#26354D] pb-2">
        <span className="font-bold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span>AI Context Snapshot</span>
        </span>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
          Connected
        </span>
      </div>

      <div className="space-y-2 text-gray-300">
        <div className="flex items-start gap-2">
          <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-400 block text-[10px]">Target Goal:</span>
            <span className="font-semibold text-gray-100">{user.currentGoal?.title}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-400 block text-[10px]">Active Checkpoint:</span>
            <span className="font-semibold text-gray-100">{activeStep?.title || 'None active'}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-400 block text-[10px]">Daily Pace:</span>
            <span className="font-semibold text-gray-100">{user.availableMinutesPerDay} min/day</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-400 block text-[10px]">Critical Gaps:</span>
            <span className="font-semibold text-gray-100">
              {criticalGaps.length} areas requiring focus
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-400 block text-[10px]">Verified Skills:</span>
            <span className="font-semibold text-gray-100">
              {passport.verifiedSkillsCount} proof items in passport
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
