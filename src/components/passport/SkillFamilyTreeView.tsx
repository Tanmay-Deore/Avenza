import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';
import { GitBranch, CheckCircle2, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export const SkillFamilyTreeView: React.FC = () => {
  const { skills, user, openVerificationModal } = useAvenza();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('python-core');

  // Hierarchy levels for AI Engineering / active goal
  const tiers = [
    {
      level: 1,
      name: 'Tier 1: Foundations',
      description: 'Core runtime syntax, control flow, and version control',
      skills: ['python-core', 'git-workflow'],
    },
    {
      level: 2,
      name: 'Tier 2: Mathematical & Data Mechanics',
      description: 'Dataframe manipulation, vectorized arrays, and probability',
      skills: ['numpy-pandas', 'statistics-prob', 'data-structures'],
    },
    {
      level: 3,
      name: 'Tier 3: Predictive Modeling & Intelligence',
      description: 'Supervised ML, deep neural nets, and contextual retrieval',
      skills: ['machine-learning-core', 'deep-learning', 'llm-rag'],
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#9BB59F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Skill Family Tree & Capability Hierarchy
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40">
              Taxonomy Hierarchy
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Structural relationship tree demonstrating how foundational skills branch into high-level engineering capabilities
          </p>
        </div>

        <div className="text-xs font-mono text-[#A39F94]">
          <span>Destination: </span>
          <span className="text-[#F5EFE4] font-bold">
            {user.currentGoal?.targetRoleOrSkill || 'AI Engineer'}
          </span>
        </div>
      </div>

      {/* Hierarchical Tiers with Connected Branches */}
      <div className="space-y-6 relative">
        {tiers.map((tier, tierIdx) => (
          <div key={tier.name} className="relative space-y-3">
            {/* Tier Header Line */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8798B7] bg-[#20211E] px-2.5 py-0.5 rounded border border-[#3A3B34]">
                {tier.name}
              </span>
              <div className="h-[1px] flex-1 bg-[#3A3B34]" />
              <span className="text-[10px] text-[#A39F94] hidden sm:inline">
                {tier.description}
              </span>
            </div>

            {/* Tier Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tier.skills.map((skillId) => {
                const skill = skills[skillId];
                const def = SKILL_TAXONOMY[skillId];
                const isVerified = (skill?.verifiedLevel || 0) > 0;
                const isSelected = selectedBranchId === skillId;

                return (
                  <div
                    key={skillId}
                    onClick={() => setSelectedBranchId(skillId)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'bg-[#373832] border-[#9BB59F] shadow-md ring-1 ring-[#9BB59F]/40'
                        : isVerified
                        ? 'bg-[#2E302B] border-[#4A4A42] hover:border-[#9BB59F]/60'
                        : 'bg-[#242520] border-[#3A3B34] hover:border-[#4A4A42] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-mono text-[#A39F94] uppercase tracking-wider">
                        {def?.category || 'Programming'}
                      </span>
                      {isVerified ? (
                        <span className="text-[10px] font-mono text-[#9BB59F] flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified L{skill.verifiedLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#A39F94] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Prerequisite
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs text-[#F5EFE4] mb-1">
                      {def?.name || skillId}
                    </h4>

                    <p className="text-[11px] text-[#A39F94] line-clamp-2">
                      {def?.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedBranchId && SKILL_TAXONOMY[selectedBranchId] && (
        <div className="p-4 rounded-xl bg-[#20211E] border border-[#3A3B34] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A3B34] pb-2">
            <div>
              <span className="text-[10px] font-mono text-[#8798B7] uppercase">Branch Details</span>
              <h4 className="text-xs font-bold text-[#F5EFE4]">
                {SKILL_TAXONOMY[selectedBranchId].name}
              </h4>
            </div>
            {skills[selectedBranchId]?.verifiedLevel ? (
              <span className="text-xs font-mono text-[#9BB59F] font-bold">
                ✓ VERIFIED ON IMMUTABLE LEDGER
              </span>
            ) : (
              <button
                onClick={() => openVerificationModal(selectedBranchId)}
                className="text-xs font-mono text-[#E0C77F] hover:underline"
              >
                Launch Verification Assessment →
              </button>
            )}
          </div>

          <p className="text-xs text-[#BDB5A7] leading-relaxed">
            {SKILL_TAXONOMY[selectedBranchId].whyItMatters}
          </p>
        </div>
      )}
    </div>
  );
};
