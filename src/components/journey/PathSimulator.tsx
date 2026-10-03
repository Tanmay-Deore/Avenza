import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Button } from '../../design-system/Button';
import { STANDARD_GOALS } from '../../services/skillTaxonomy';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const PathSimulator: React.FC = () => {
  const { triggerManualReroute, setUserGoal, updateUserDailyTime } = useAvenza();

  return (
    <div className="p-5 rounded-2xl bg-[#121826] border border-[#26354D] space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26354D] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-100">Adaptive Rerouting Simulator</h4>
            <p className="text-xs text-gray-400">
              Test how Avenza instantly adapts when real-world circumstances change.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Scenario 1: Struggle */}
        <div className="p-3.5 rounded-xl bg-[#182234] border border-[#26354D] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Struggle</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Simulate diagnostic difficulty with Statistics & Probability.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerManualReroute('STRUGGLE', { struggledSkillId: 'statistics-prob' })}
            className="w-full text-xs text-rose-300 border-rose-500/40 hover:bg-rose-950/40"
          >
            Insert Remediation
          </Button>
        </div>

        {/* Scenario 2: Fast-Track */}
        <div className="p-3.5 rounded-xl bg-[#182234] border border-[#26354D] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Fast-Track</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Simulate high verification score on Python fundamentals.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerManualReroute('FAST_IMPROVEMENT', { verifiedSkillId: 'python-core' })}
            className="w-full text-xs text-emerald-300 border-emerald-500/40 hover:bg-emerald-950/40"
          >
            Skip Beginner Steps
          </Button>
        </div>

        {/* Scenario 3: Time Constraint */}
        <div className="p-3.5 rounded-xl bg-[#182234] border border-[#26354D] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Simulate Time Crunch</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              User only has 20 mins/day available for the next 2 weeks.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateUserDailyTime(20)}
            className="w-full text-xs text-cyan-300 border-cyan-500/40 hover:bg-cyan-950/40"
          >
            Calibrate to 20m Micro
          </Button>
        </div>

        {/* Scenario 4: Goal Pivot */}
        <div className="p-3.5 rounded-xl bg-[#182234] border border-[#26354D] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Pivot</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Switch career destination to Fullstack Web Development.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUserGoal(STANDARD_GOALS[1])}
            className="w-full text-xs text-purple-300 border-purple-500/40 hover:bg-purple-950/40"
          >
            Recalculate Path
          </Button>
        </div>
      </div>
    </div>
  );
};
