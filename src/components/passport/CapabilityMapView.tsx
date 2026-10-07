import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { COMPOUND_CAPABILITIES, calculateCapabilityStatus, CompoundCapability } from './passportData';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';
import { Network, CheckCircle2, Lock, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface CapabilityMapViewProps {
  onSelectCapability?: (capability: CompoundCapability) => void;
}

export const CapabilityMapView: React.FC<CapabilityMapViewProps> = ({ onSelectCapability }) => {
  const { skills } = useAvenza();
  const [selectedCapId, setSelectedCapId] = useState<string>(COMPOUND_CAPABILITIES[0].id);

  const selectedCapability =
    COMPOUND_CAPABILITIES.find((c) => c.id === selectedCapId) || COMPOUND_CAPABILITIES[0];

  const selectedStatus = calculateCapabilityStatus(selectedCapability, skills);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#8798B7]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Compound Capability Network
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(135,152,183,0.16)] text-[#A9B7D0] border border-[#8798B7]/40">
              Skills → Capabilities
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Visualizing how your individual verified competencies synthesize into production-grade capabilities
          </p>
        </div>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {COMPOUND_CAPABILITIES.map((cap) => {
          const { isFullyUnlocked, verifiedCount, totalCount, percentage } = calculateCapabilityStatus(
            cap,
            skills
          );
          const isSelected = selectedCapId === cap.id;

          return (
            <div
              key={cap.id}
              onClick={() => {
                setSelectedCapId(cap.id);
                if (onSelectCapability) onSelectCapability(cap);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 select-none flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#373832] border-[#8798B7] shadow-lg ring-1 ring-[#8798B7]/40 scale-[1.02]'
                  : 'bg-[#242520] border-[#3A3B34] hover:border-[#8798B7]/50 hover:bg-[#2A2B25]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94]">
                    {cap.category}
                  </span>
                  {isFullyUnlocked ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#9BB59F]" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#30312C] text-[#A39F94] border border-[#4A4A42] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {verifiedCount}/{totalCount}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-[#F5EFE4] leading-snug">
                  {cap.name}
                </h4>

                <p className="text-[11px] text-[#A39F94] line-clamp-2">
                  {cap.description}
                </p>
              </div>

              {/* Progress Bar of Component Skills */}
              <div className="space-y-1.5 pt-2 border-t border-[#3A3B34]/60">
                <div className="flex justify-between text-[10px] font-mono text-[#A39F94]">
                  <span>Synthesis</span>
                  <span className={isFullyUnlocked ? 'text-[#9BB59F] font-bold' : 'text-[#8798B7]'}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#20211E] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFullyUnlocked ? 'bg-[#9BB59F]' : 'bg-[#8798B7]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spatial Network Synthesis Detail Inspector */}
      <div className="p-5 rounded-xl bg-[#20211E] border border-[#3A3B34] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A3B34] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#8798B7]">[CAPABILITY SYNTHESIS]</span>
              <h4 className="font-bold text-sm text-[#F5EFE4]">{selectedCapability.name}</h4>
            </div>
            <p className="text-xs text-[#A39F94] mt-0.5">{selectedCapability.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#2E302B] text-[#F5EFE4] border border-[#4A4A42]">
              {selectedStatus.isFullyUnlocked ? 'STATUS: PRODUCTION-READY' : 'STATUS: PARTIALLY SYNTHESIZED'}
            </span>
          </div>
        </div>

        {/* Spatial Component Skills Map */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94] block">
            Constituent Verified Components ({selectedStatus.verifiedCount}/{selectedStatus.totalCount})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {selectedCapability.requiredSkillIds.map((skillId) => {
              const skill = skills[skillId];
              const isVerified = (skill?.verifiedLevel || 0) > 0;
              const skillName = skill?.name || SKILL_TAXONOMY[skillId]?.name || skillId;

              return (
                <div
                  key={skillId}
                  className={`p-3 rounded-lg border transition-all ${
                    isVerified
                      ? 'bg-[#2E302B] border-[#9BB59F]/60 text-[#F5EFE4] shadow-sm'
                      : 'bg-[#242520]/60 border-[#3A3B34] text-[#64625A] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#A39F94]">
                      {skill?.category || 'Foundation'}
                    </span>
                    {isVerified ? (
                      <span className="text-[9px] font-mono text-[#9BB59F] font-bold">
                        VERIFIED L{skill.verifiedLevel}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-[#D1B46A]">
                        PENDING
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-xs truncate">{skillName}</h5>
                </div>
              );
            })}
          </div>
        </div>

        {/* What You Can Build Under This Capability */}
        <div className="pt-2 border-t border-[#3A3B34]/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94] block mb-2">
            Enabled Systems & Workflows
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {selectedCapability.whatYouCanBuild.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#242520] border border-[#3A3B34] flex items-start gap-2 text-xs text-[#BDB5A7]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8798B7] mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
