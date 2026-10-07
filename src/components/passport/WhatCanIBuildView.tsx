import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { COMPOUND_CAPABILITIES, calculateCapabilityStatus } from './passportData';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';
import { Wrench, Terminal, CheckCircle2, ArrowRight, ShieldCheck, Box, ExternalLink } from 'lucide-react';

export const WhatCanIBuildView: React.FC = () => {
  const { skills, passport } = useAvenza();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const capabilitiesWithStatus = COMPOUND_CAPABILITIES.map((cap) => ({
    ...cap,
    status: calculateCapabilityStatus(cap, skills),
  }));

  const activeCap = capabilitiesWithStatus[selectedIdx] || capabilitiesWithStatus[0];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#D1B46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              What Can I Actually Build?
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(209,180,106,0.16)] text-[#E0C77F] border border-[#D1B46A]/30">
              Verified Production Output
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Concrete engineering deliverables and architectures unlocked by your verified capabilities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Capability Selectors Column */}
        <div className="lg:col-span-5 space-y-3">
          {capabilitiesWithStatus.map((cap, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={cap.id}
                onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#373832] border-[#D1B46A] shadow-md ring-1 ring-[#D1B46A]/40'
                    : 'bg-[#242520] border-[#3A3B34] hover:border-[#4A4A42]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94]">
                    {cap.category}
                  </span>
                  {cap.status.isFullyUnlocked ? (
                    <span className="text-[10px] font-mono text-[#9BB59F] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Ready to Build
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#A39F94]">
                      {cap.status.verifiedCount}/{cap.status.totalCount} Verified
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-[#F5EFE4] mb-1">
                  {cap.deliverableExample.title}
                </h4>

                <p className="text-[11px] text-[#A39F94] line-clamp-2">
                  {cap.deliverableExample.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Deliverable Assembly Blueprint View */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#20211E] border border-[#3A3B34] space-y-5">
          <div className="flex items-center justify-between border-b border-[#3A3B34] pb-3">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-[#D1B46A]" />
              <h4 className="font-bold text-sm text-[#F5EFE4]">
                Deliverable Blueprint: {activeCap.deliverableExample.title}
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2E302B] text-[#E0C77F] border border-[#4A4A42]">
              {activeCap.status.isFullyUnlocked ? 'VERIFIED CAPABLE' : 'PARTIALLY UNLOCKED'}
            </span>
          </div>

          <p className="text-xs text-[#BDB5A7] leading-relaxed">
            {activeCap.deliverableExample.description}
          </p>

          {/* Component Skills Assembly Flow */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94] block">
              Required Competency Stack
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeCap.requiredSkillIds.map((skillId) => {
                const skill = skills[skillId];
                const isVerified = (skill?.verifiedLevel || 0) > 0;
                const name = skill?.name || SKILL_TAXONOMY[skillId]?.name || skillId;

                return (
                  <div
                    key={skillId}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                      isVerified
                        ? 'bg-[#282923] border-[#9BB59F]/60 text-[#F5EFE4]'
                        : 'bg-[#242520] border-[#3A3B34] text-[#A39F94]'
                    }`}
                  >
                    <span className="font-medium truncate mr-2">{name}</span>
                    {isVerified ? (
                      <span className="text-[10px] font-mono text-[#9BB59F] flex items-center gap-1 font-bold flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        L{skill.verifiedLevel}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#D1B46A] flex-shrink-0">
                        In Progress
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deliverable Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {activeCap.deliverableExample.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-[#2E302B] border border-[#4A4A42] text-[10px] font-mono text-[#A9B7D0]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Ledger Proof Connection */}
          <div className="pt-3 border-t border-[#3A3B34] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#9BB59F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Backed by {passport.evidenceLedger.length} executable proof artifacts in ledger</span>
            </div>
            <span className="text-[10px] font-mono text-[#A39F94]">
              {passport.passportId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
