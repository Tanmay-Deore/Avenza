import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';
import { Compass, Sparkles, CheckCircle2, ArrowRight, Zap, Target } from 'lucide-react';

export const NextUnlockView: React.FC = () => {
  const { skills, user, openVerificationModal, openMissionModal, setActiveTab } = useAvenza();

  // Find next unverified skill required by active goal
  const requiredSkills = user.currentGoal?.requiredSkills || [];
  const nextTargetSkill = requiredSkills.find((req) => {
    const s = skills[req.skillId];
    return !s || s.verifiedLevel < req.requiredLevel;
  }) || {
    skillId: 'numpy-pandas',
    skillName: 'Data Manipulation (NumPy & Pandas)',
    requiredLevel: 2,
  };

  const skillDef = SKILL_TAXONOMY[nextTargetSkill.skillId];
  const currentSkill = skills[nextTargetSkill.skillId];
  const currentLevel = currentSkill?.verifiedLevel || currentSkill?.currentLevel || 0;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#2A2B25] via-[#242520] to-[#20211E] border border-[#57584E]/70 shadow-lg space-y-5 relative overflow-hidden">
      {/* Subtle Future Node Glow Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(209,180,106,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A3B34] pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E302B] border border-[#D1B46A]/50 flex items-center justify-center text-[#D1B46A] shadow-md flex-shrink-0">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[rgba(209,180,106,0.16)] text-[#E0C77F] border border-[#D1B46A]/30">
                Next Capability Unlock
              </span>
              <span className="text-xs font-mono text-[#A39F94]">Target: Level {nextTargetSkill.requiredLevel}</span>
            </div>
            <h3 className="text-base font-bold text-[#F5EFE4] mt-0.5">
              {nextTargetSkill.skillName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => openVerificationModal(nextTargetSkill.skillId)}
            className="px-3.5 py-1.5 rounded-xl bg-[#373832] hover:bg-[#40413A] border border-[#9BB59F]/60 text-xs font-mono font-bold text-[#B4CCB8] flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9BB59F]" />
            <span>Launch Verification</span>
          </button>
        </div>
      </div>

      {/* Description & Requirements Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
        <div className="md:col-span-7 space-y-3">
          <p className="text-xs text-[#BDB5A7] leading-relaxed">
            {skillDef?.description ||
              'Master dataframes, grouping aggregations, and feature transformation to advance toward full AI Engineering capability.'}
          </p>

          {/* Prerequisite & Path Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94] block">
              Prerequisites & Progress
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#20211E] border border-[#9BB59F]/40 text-[#B4CCB8] flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9BB59F]" />
                <span>Python Fundamentals (Verified L2)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#20211E] border border-[#D1B46A]/40 text-[#E0C77F] flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#D1B46A] animate-ping" />
                <span>1 Practical Mission Lab Required</span>
              </span>
            </div>
          </div>
        </div>

        {/* Future Node Spatial Indicator */}
        <div className="md:col-span-5 p-4 rounded-xl bg-[#20211E] border border-[#3A3B34] space-y-3 text-center">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#A39F94]">
            <span>Current Status</span>
            <span className="text-[#D1B46A]">
              {currentLevel > 0 ? `Level ${currentLevel} (Unverified)` : 'Not Yet Verified'}
            </span>
          </div>

          <div className="w-full bg-[#282923] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D1B46A] to-[#9BB59F] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(15, (currentLevel / nextTargetSkill.requiredLevel) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveTab('missions')}
              className="text-[11px] font-medium text-[#8798B7] hover:text-[#F5EFE4] flex items-center gap-1 transition-colors hover:underline"
            >
              <Zap className="w-3 h-3" />
              <span>Explore Practice Labs</span>
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className="text-[11px] font-medium text-[#A9B7D0] hover:text-[#F5EFE4] flex items-center gap-1 transition-colors hover:underline"
            >
              <span>View in Journey Path</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
