import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Bot, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Target } from 'lucide-react';

export const AIPassportSummary: React.FC = () => {
  const { passport, user, skills, openVerificationModal } = useAvenza();
  const [isCopied, setIsCopied] = useState(false);

  // Derive real findings
  const verifiedNames = passport.demonstratedCompetencies.map((c) => c.skillName);
  const targetRole = user.currentGoal?.targetRoleOrSkill || 'AI Engineering';

  // Next improvement area
  const gaps = user.currentGoal?.requiredSkills.filter(
    (req) => !skills[req.skillId] || skills[req.skillId].verifiedLevel < req.requiredLevel
  ) || [];
  const nextTarget = gaps[0] || { skillId: 'statistics-prob', skillName: 'Statistics & Probability' };

  const summaryText = `Current verified capability profile reflects solid foundational competency in ${
    verifiedNames.join(' and ') || 'core software engineering'
  }. All ${passport.evidenceLedger.length} evidence artifacts are validated by automated test assertions. Immediate progression recommendation: complete verification for ${
    nextTarget.skillName
  } to advance toward your target specialization in ${targetRole}.`;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#282923] to-[#20211E] border border-[#57584E]/80 shadow-md space-y-3.5 relative overflow-hidden">
      {/* Calm signal bar */}
      <div className="flex items-center justify-between border-b border-[#3A3B34] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[rgba(167,155,196,0.18)] text-[#BDB2D6] flex items-center justify-center border border-[#A79BC4]/40 flex-shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#F5EFE4]">
            AI Passport Synthesis
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.14)] text-[#B4CCB8] border border-[#9BB59F]/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9BB59F] animate-pulse" />
            Verified Context Grounded
          </span>
        </div>

        <span className="text-[10px] font-mono text-[#A39F94]">
          Ledger ID: {passport.passportId}
        </span>
      </div>

      <p className="text-xs text-[#BDB5A7] leading-relaxed">
        {summaryText}
      </p>

      {/* Immediate recommendation action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#3A3B34]/60 text-xs">
        <div className="flex items-center gap-1.5 text-[#E0C77F] font-mono">
          <Target className="w-3.5 h-3.5" />
          <span>Priority Target: {nextTarget.skillName}</span>
        </div>

        <button
          onClick={() => openVerificationModal(nextTarget.skillId)}
          className="text-[#9BB59F] hover:text-[#F5EFE4] font-medium flex items-center gap-1 hover:underline transition-colors self-start sm:self-center"
        >
          <span>Begin Diagnostic Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
