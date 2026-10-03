import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { SeverityBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import {
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export const GapAnalysisPanel: React.FC = () => {
  const { skillGaps, openVerificationModal, openMissionModal, user } = useAvenza();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A3B34] pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4]">
            Target Gap Analysis Matrix
          </h3>
          <p className="text-xs text-[#A39F94]">
            Comparing your current verified baseline against requirements for: <strong className="text-[#A9B7D0]">{user.currentGoal?.title}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {skillGaps.map((gap) => {
          const isSatisfied = gap.gapSeverity === 'SATISFIED';
          return (
            <div
              key={gap.skillId}
              className={`p-4 rounded-xl border transition-all ${
                isSatisfied
                  ? 'bg-[#9BB59F]/10 border-[#9BB59F]/40'
                  : gap.gapSeverity === 'CRITICAL'
                  ? 'bg-[#C6927D]/12 border-[#C6927D]/40'
                  : 'bg-[#282923] border-[#4A4A42]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-[#F5EFE4]">{gap.skillName}</span>
                    <SeverityBadge severity={gap.gapSeverity} />
                    <span className="text-[11px] font-mono text-[#A39F94]">
                      Level {gap.currentLevel} / {gap.targetLevel} Needed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#BDB5A7] pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-[#A39F94] uppercase block">What Is Missing:</span>
                      <p className="text-[#BDB5A7] text-[11px] leading-relaxed">{gap.whatIsMissing}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#A39F94] uppercase block">Why It Matters:</span>
                      <p className="text-[#BDB5A7] text-[11px] leading-relaxed">{gap.whyItMatters}</p>
                    </div>
                  </div>
                </div>

                {/* Next Action Trigger */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {gap.status === 'UNVERIFIED' ? (
                    <button
                      onClick={() => openVerificationModal(gap.skillId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#20211E]" />
                      <span>Verify Skill</span>
                    </button>
                  ) : !isSatisfied ? (
                    <button
                      onClick={() => openVerificationModal(gap.skillId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#30312C] hover:bg-[#373832] text-[#F5EFE4] border border-[#4A4A42] flex items-center gap-1.5 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#E0C77F]" />
                      <span>Bridge Gap</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B4CCB8] px-3 py-1.5 rounded-lg bg-[#9BB59F]/16 border border-[#9BB59F]/50">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9BB59F]" />
                      Demonstrated
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
