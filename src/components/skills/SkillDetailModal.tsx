import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { StatusBadge } from '../../design-system/StatusBadge';
import { Skill } from '../../types';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';
import {
  ShieldCheck,
  Award,
  Zap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export const SkillDetailModal: React.FC<{
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ skill, isOpen, onClose }) => {
  const { openVerificationModal, openMissionModal } = useAvenza();

  if (!skill) return null;

  const taxonomyDef = SKILL_TAXONOMY[skill.id];
  const levelDescriptions = taxonomyDef?.levelDescriptions || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-[#F5EFE4]">{skill.name}</span>
          <StatusBadge status={skill.status} size="sm" />
        </div>
      }
      description={`${skill.category} Competency Specification`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Level & Verification Status Bar */}
        <div className="p-4 rounded-xl bg-[#282923] border border-[#4A4A42] grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Current Level</span>
            <div className="text-lg font-bold text-[#F5EFE4] font-mono mt-0.5">
              Level {skill.currentLevel} / 5
            </div>
            <span className="text-[11px] text-[#A39F94]">Self-assessed</span>
          </div>

          <div>
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Verified Level</span>
            <div className="text-lg font-bold text-[#B4CCB8] font-mono mt-0.5">
              Level {skill.verifiedLevel} / 5
            </div>
            <span className="text-[11px] text-[#B4CCB8]/80">
              {skill.verifiedLevel > 0 ? 'Verified proof recorded' : 'Unverified'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Required for Goal</span>
            <div className="text-lg font-bold text-[#E0C77F] font-mono mt-0.5">
              Level {skill.requiredLevel} / 5
            </div>
            <span className="text-[11px] text-[#A39F94]">Target role expectation</span>
          </div>
        </div>

        {/* Why it Matters */}
        <div className="p-4 rounded-xl bg-[#30312C] border border-[#4A4A42] space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A9B7D0]">
            Why This Skill Matters
          </div>
          <p className="text-xs text-[#BDB5A7] leading-relaxed">{skill.whyItMatters}</p>
        </div>

        {/* Level Mastery Breakdown (1-5) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A39F94]">
            Proficiency Levels & Mastery Milestones
          </h4>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isVerified = lvl <= skill.verifiedLevel;
              const isClaimed = lvl <= skill.currentLevel;
              const isTarget = lvl === skill.requiredLevel;

              return (
                <div
                  key={lvl}
                  className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs transition-colors ${
                    isVerified
                      ? 'bg-[#9BB59F]/16 border-[#9BB59F]/50 text-[#F5EFE4]'
                      : isClaimed
                      ? 'bg-[#8798B7]/16 border-[#8798B7]/50 text-[#F5EFE4]'
                      : 'bg-[#282923] border-[#4A4A42] text-[#A39F94]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-bold w-12 flex-shrink-0 text-[#F5EFE4]">
                      Lvl {lvl}:
                    </span>
                    <span className="leading-snug">{levelDescriptions[lvl] || `Level ${lvl} concepts`}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isVerified ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#9BB59F]/20 text-[#B4CCB8] border border-[#9BB59F]/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#9BB59F]" />
                        Verified
                      </span>
                    ) : isTarget ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D1B46A]/20 text-[#E0C77F] border border-[#D1B46A]/50">
                        Target
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence Ledger attached */}
        {skill.evidence.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#4A4A42]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A39F94] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#A79BC4]" />
              <span>Verifiable Evidence Ledger ({skill.evidence.length})</span>
            </h4>
            <div className="space-y-2">
              {skill.evidence.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-lg bg-[#282923] border border-[#4A4A42] text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#F5EFE4]">{ev.title}</span>
                    <span className="text-[10px] text-[#A39F94] font-mono">
                      {new Date(ev.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#BDB5A7] text-[11px] leading-relaxed">{ev.proofSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Action CTA */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-sm flex items-center justify-center gap-2 transition-all"
            onClick={() => {
              onClose();
              openVerificationModal(skill.id);
            }}
          >
            <ShieldCheck className="w-4 h-4 text-[#20211E]" />
            <span>Take Skill Verification Assessment (8 min)</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl font-semibold text-xs bg-[#30312C] hover:bg-[#373832] text-[#F5EFE4] border border-[#4A4A42] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
