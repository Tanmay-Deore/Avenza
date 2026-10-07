import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Sliders, ShieldCheck, CheckCircle2, ChevronRight, Zap, Award } from 'lucide-react';

export const ProofEvolutionView: React.FC = () => {
  const { passport, skills } = useAvenza();
  const verifiedComps = passport.demonstratedCompetencies;
  const [selectedSkillName, setSelectedSkillName] = useState<string>(
    verifiedComps[0]?.skillName || 'Python Fundamentals'
  );
  const [scrubberIndex, setScrubberIndex] = useState<number>(4); // default to Verified (stage 4)

  const activeComp = verifiedComps.find((c) => c.skillName === selectedSkillName) || verifiedComps[0];

  const evolutionStages = [
    {
      stage: '01',
      title: 'Claimed / Diagnostic Start',
      status: 'Initial Knowledge Assessment',
      level: 0,
      description: 'Entered diagnostic evaluation to establish baseline competency.',
      evidence: 'Diagnostic entry question set',
      metric: 'Initial Confidence: 30%',
    },
    {
      stage: '02',
      title: 'Tested Syntax & Logic',
      status: 'Conceptual Diagnostic Passed',
      level: 1,
      description: 'Validated foundational syntax, loops, and conditional control flow.',
      evidence: 'Objective assessment scoring (75%+ score)',
      metric: 'Attained Level 1',
    },
    {
      stage: '03',
      title: 'Practiced in Interactive Lab',
      status: 'Practical Mission Completed',
      level: 2,
      description: 'Completed hands-on coding mission with automated assertion tests.',
      evidence: 'Executable unit tests passed (3/3 checks)',
      metric: 'Interactive lab validation',
    },
    {
      stage: '04',
      title: 'Built Working Implementation',
      status: 'Artifact Recorded in Ledger',
      level: 2,
      description: 'Constructed working script utility with standard I/O and error handling.',
      evidence: 'Artifact hash registered in Avenza task runner',
      metric: 'Proof artifact verified',
    },
    {
      stage: '05',
      title: 'Formally Verified',
      status: 'Attested on Permanent Ledger',
      level: activeComp?.level || 2,
      description: `Formal verification seal granted on ${activeComp?.verifiedDate || 'Recent'} with verified Level ${
        activeComp?.level || 2
      }.`,
      evidence: 'Permanent passport ledger record',
      metric: `Formal Seal: L${activeComp?.level || 2}`,
    },
  ];

  const currentStage = evolutionStages[scrubberIndex];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8798B7]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Proof Evolution Scrubber
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(135,152,183,0.16)] text-[#A9B7D0] border border-[#8798B7]/40">
              Claimed → Verified
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Scrub through the capability evolution timeline to observe how proof accumulated from initial baseline to formal attestation
          </p>
        </div>

        {/* Skill Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {verifiedComps.map((comp) => (
            <button
              key={comp.skillName}
              onClick={() => setSelectedSkillName(comp.skillName)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedSkillName === comp.skillName
                  ? 'bg-[#373832] text-[#F5EFE4] border-[#9BB59F]'
                  : 'bg-[#242520] text-[#A39F94] border-[#3A3B34] hover:text-[#F5EFE4]'
              }`}
            >
              {comp.skillName} (L{comp.level})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Evolution Scrubber Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#A39F94]">Timeline Progression</span>
          <span className="text-[#9BB59F] font-bold">
            STAGE {currentStage.stage} OF 05: {currentStage.title}
          </span>
        </div>

        {/* Scrub Track */}
        <div className="grid grid-cols-5 gap-2 relative">
          {evolutionStages.map((stg, idx) => (
            <button
              key={stg.stage}
              onClick={() => setScrubberIndex(idx)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                scrubberIndex === idx
                  ? 'bg-[#373832] border-[#9BB59F] text-[#F5EFE4] shadow-md ring-1 ring-[#9BB59F]/50'
                  : idx < scrubberIndex
                  ? 'bg-[#2E302B] border-[#4A4A42] text-[#B4CCB8]'
                  : 'bg-[#242520] border-[#3A3B34] text-[#64625A] hover:border-[#4A4A42]'
              }`}
            >
              <div className="text-[10px] font-mono opacity-80">Stage {stg.stage}</div>
              <div className="font-bold text-xs truncate mt-0.5">{stg.title.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber Detail State Display */}
      <div className="p-5 rounded-xl bg-[#20211E] border border-[#3A3B34] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A3B34] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#A39F94] block">
              Skill State at Stage {currentStage.stage}
            </span>
            <h4 className="font-bold text-sm text-[#F5EFE4] mt-0.5">{currentStage.title}</h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#2E302B] text-[#B4CCB8] border border-[#9BB59F]/40">
              {currentStage.metric}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#BDB5A7] leading-relaxed">
          {currentStage.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#242520] border border-[#3A3B34]">
            <span className="text-[10px] text-[#A39F94] block uppercase">Validation Status</span>
            <span className="text-[#F5EFE4] font-medium">{currentStage.status}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#242520] border border-[#3A3B34]">
            <span className="text-[10px] text-[#A39F94] block uppercase">Associated Proof Item</span>
            <span className="text-[#9BB59F] font-medium">{currentStage.evidence}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
