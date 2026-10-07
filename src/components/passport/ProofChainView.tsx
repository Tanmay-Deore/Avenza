import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { EvidenceItem } from '../../types';
import { VerificationSealBadge } from './VerificationSealBadge';
import {
  ShieldCheck,
  Zap,
  Code,
  CheckCircle2,
  FileText,
  Terminal,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ProofChainViewProps {
  selectedSkillId?: string;
  onOpenEvidenceDetail?: (evidence: EvidenceItem) => void;
  onOpenMission?: (missionId: string) => void;
}

export const ProofChainView: React.FC<ProofChainViewProps> = ({
  selectedSkillId,
  onOpenEvidenceDetail,
  onOpenMission,
}) => {
  const { passport, skills, missions } = useAvenza();

  // Find verified skills available in passport
  const verifiedComps = passport.demonstratedCompetencies;
  const [activeCompSkill, setActiveCompSkill] = useState<string>(
    selectedSkillId || (verifiedComps[0]?.skillName ? 'Python Fundamentals' : '')
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Match the selected competency
  const currentComp = verifiedComps.find(
    (c) => c.skillName.toLowerCase() === activeCompSkill.toLowerCase()
  ) || verifiedComps[0];

  // Match corresponding skill definition
  const matchedSkillEntry = Object.entries(skills).find(
    ([id, s]) => s.name.toLowerCase() === (currentComp?.skillName || '').toLowerCase()
  );
  const skillKey = matchedSkillEntry ? matchedSkillEntry[0] : 'python-core';
  const skillObj = matchedSkillEntry ? matchedSkillEntry[1] : skills['python-core'];

  // Match evidence from passport evidenceLedger
  const matchedEvidence = passport.evidenceLedger.filter(
    (e) => e.skillId === skillKey || e.skillName.toLowerCase() === (currentComp?.skillName || '').toLowerCase()
  );

  const primaryEvidence = matchedEvidence[0] || passport.evidenceLedger[0];

  // Build the 5-node proof chain steps
  const chainSteps = [
    {
      id: 'step-skill',
      type: 'SKILL',
      label: 'Verified Skill',
      title: currentComp?.skillName || 'Skill Competency',
      subtitle: `Target Level ${currentComp?.level || 2}`,
      icon: <Code className="w-4 h-4 text-[#8798B7]" />,
      badge: `L${currentComp?.level || 2}`,
      details: {
        description: skillObj?.description || 'Foundational programming competency and syntax.',
        metric: `Confidence: ${skillObj?.confidence || 85}%`,
        status: 'VERIFIED IN LEDGER',
      },
    },
    {
      id: 'step-assessment',
      type: 'ASSESSMENT',
      label: 'Diagnostic Test',
      title: primaryEvidence?.title || 'Diagnostic Assessment',
      subtitle: primaryEvidence?.verifiedBy || 'Avenza Diagnostic Verification Suite',
      icon: <ShieldCheck className="w-4 h-4 text-[#9BB59F]" />,
      badge: 'Score 85%+',
      details: {
        description: 'Multi-part diagnostic evaluation measuring conceptual syntax, execution mechanics, and error handling.',
        metric: `Timestamp: ${new Date(primaryEvidence?.timestamp || Date.now()).toLocaleDateString()}`,
        status: 'PASSED (FIRST RUN)',
      },
    },
    {
      id: 'step-mission',
      type: 'MISSION',
      label: 'Practical Lab Lab',
      title: 'Practical Implementation Lab',
      subtitle: 'Executable Task Runner',
      icon: <Zap className="w-4 h-4 text-[#BDB2D6]" />,
      badge: 'Lab Passed',
      details: {
        description: 'Interactive execution environment testing hands-on file manipulation, edge conditions, and module structure.',
        metric: 'Automated test suite (3/3 unit checks passed)',
        status: 'CODE EXECUTED CLEANLY',
      },
    },
    {
      id: 'step-artifact',
      type: 'ARTIFACT',
      label: 'Executable Artifact',
      title: 'Verifiable Proof Artifact',
      subtitle: 'Standard Output & Assertions',
      icon: <FileText className="w-4 h-4 text-[#E0C77F]" />,
      badge: 'Artifact Recorded',
      details: {
        description: primaryEvidence?.proofSummary || 'Test run output and validated execution telemetry stored in passport ledger.',
        metric: `Ref: ${passport.passportId}#${primaryEvidence?.id || 'ev-01'}`,
        status: 'CRYPTOGRAPHICALLY LINKED',
      },
    },
    {
      id: 'step-seal',
      type: 'SEAL',
      label: 'Official Verification',
      title: `Verified Level ${currentComp?.level || 2} Seal`,
      subtitle: `Issued on ${currentComp?.verifiedDate || 'Recent'}`,
      icon: <CheckCircle2 className="w-4 h-4 text-[#9BB59F]" />,
      badge: 'PERMANENT',
      details: {
        description: 'Formally recorded on immutable capability ledger. Eligible for export and public verification.',
        metric: `Ledger Status: ACTIVE (Fresh)`,
        status: 'OFFICIALLY ATTESTED',
      },
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header with Skill Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8798B7]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Interactive Proof Chain
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40">
              Building a Case
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Trace the chain of evidence supporting each verified competency
          </p>
        </div>

        {/* Skill Selector Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {verifiedComps.map((comp) => {
            const isSelected = (comp.skillName.toLowerCase() === activeCompSkill.toLowerCase());
            return (
              <button
                key={comp.skillName}
                onClick={() => {
                  setActiveCompSkill(comp.skillName);
                  setActiveStepIndex(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#373832] text-[#F5EFE4] border-[#9BB59F] shadow-sm'
                    : 'bg-[#242520] text-[#A39F94] border-[#3A3B34] hover:text-[#F5EFE4] hover:border-[#4A4A42]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#9BB59F]" />
                <span>{comp.skillName}</span>
                <span className="text-[10px] font-mono opacity-80">L{comp.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Proof Chain Sequence Flow */}
      <div className="relative pt-2 pb-4">
        {/* Connection Trail Track (Horizontal on desktop, vertical on mobile) */}
        <div className="hidden lg:block absolute top-[44px] left-12 right-12 h-[2px] bg-gradient-to-r from-[#9BB59F]/40 via-[#8798B7]/40 to-[#9BB59F]/80 -z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
          {chainSteps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStepIndex(isSelected ? null : idx)}
                style={{
                  animationDelay: `${idx * 120}ms`,
                }}
                className={`group relative p-3.5 rounded-xl border cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  isSelected
                    ? 'bg-[#373832] border-[#9BB59F] shadow-lg ring-1 ring-[#9BB59F]/50 scale-[1.02]'
                    : 'bg-[#242520] border-[#3A3B34] hover:border-[#8798B7]/60 hover:bg-[#2A2B25]'
                }`}
              >
                {/* Step Order Badge */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[10px] font-mono text-[#A39F94] uppercase tracking-wider">
                    0{idx + 1} • {step.label}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#20211E] text-[#B4CCB8] border border-[#3A3B34]">
                    {step.badge}
                  </span>
                </div>

                {/* Node Icon & Titles */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2E302B] border border-[#4A4A42] flex items-center justify-center flex-shrink-0 group-hover:border-[#9BB59F] transition-colors">
                    {step.icon}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#F5EFE4] truncate">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[#A39F94] truncate mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Mobile step connector indicator */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-[#64625A] pt-2 border-t border-[#3A3B34]/60">
                  <span className="group-hover:text-[#F5EFE4] transition-colors">
                    {isSelected ? 'Click to collapse' : 'Click to inspect'}
                  </span>
                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${
                      isSelected ? 'rotate-90 text-[#9BB59F]' : 'group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Detail Drawer/Expansion */}
      {activeStepIndex !== null && (
        <div className="p-4 rounded-xl bg-[#242520] border border-[#9BB59F]/40 shadow-inner space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A3B34] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#9BB59F]">
                [STAGE 0{activeStepIndex + 1}]
              </span>
              <h4 className="text-xs font-bold text-[#F5EFE4]">
                {chainSteps[activeStepIndex].title} — Detail & Proof Inspection
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#30312C] text-[#B4CCB8] border border-[#4A4A42]">
              {chainSteps[activeStepIndex].details.status}
            </span>
          </div>

          <p className="text-xs text-[#BDB5A7] leading-relaxed">
            {chainSteps[activeStepIndex].details.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]">
            <span className="font-mono text-[#A9B7D0]">
              {chainSteps[activeStepIndex].details.metric}
            </span>

            {primaryEvidence && onOpenEvidenceDetail && (
              <button
                onClick={() => onOpenEvidenceDetail(primaryEvidence)}
                className="text-[#9BB59F] hover:text-[#F5EFE4] font-medium flex items-center gap-1 hover:underline transition-colors"
              >
                <span>Inspect full ledger artifact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
