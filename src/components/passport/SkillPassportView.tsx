import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { EvidenceCard } from './EvidenceCard';
import { SharePassportModal } from './SharePassportModal';
import { Button } from '../../design-system/Button';
import {
  Award,
  ShieldCheck,
  Share2,
  Sparkles,
  CheckCircle2,
  Calendar,
  FileText,
  BadgeCheck,
} from 'lucide-react';

export const SkillPassportView: React.FC = () => {
  const { passport, user } = useAvenza();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Passport Header Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#2E302B] via-[#282923] to-[#20211E] border border-[#4A4A42] shadow-xl space-y-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#3A3B34]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#30312C] border border-[#4A4A42] flex items-center justify-center text-[#9BB59F] shadow-lg flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40">
                  Official Skill Passport
                </span>
                <span className="text-xs font-mono text-[#A39F94]">{passport.passportId}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F5EFE4]">{user.name}</h2>
              <p className="text-xs text-[#A9B7D0] font-medium">
                Target Specialization: {user.currentGoal?.targetRoleOrSkill || 'AI Engineering'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => setIsShareModalOpen(true)}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Share Verified Passport
            </Button>
          </div>
        </div>

        {/* Passport Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Verified Skills</span>
            <div className="text-xl font-bold font-mono text-[#B4CCB8] mt-0.5">
              {passport.verifiedSkillsCount}
            </div>
            <span className="text-[10px] text-[#A39F94]">proven by assessment</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Evidence Items</span>
            <div className="text-xl font-bold font-mono text-[#A9B7D0] mt-0.5">
              {passport.evidenceLedger.length}
            </div>
            <span className="text-[10px] text-[#A39F94]">test runs & artifacts</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Completed Missions</span>
            <div className="text-xl font-bold font-mono text-[#BDB2D6] mt-0.5">
              {passport.completedMissionsCount}
            </div>
            <span className="text-[10px] text-[#A39F94]">practical coding labs</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="text-[11px] text-[#A39F94] uppercase font-semibold">Issued Date</span>
            <div className="text-xs font-bold font-mono text-[#F5EFE4] mt-1">
              {new Date(passport.issuedDate).toLocaleDateString()}
            </div>
            <span className="text-[10px] text-[#A39F94]">permanent ledger</span>
          </div>
        </div>
      </div>

      {/* Verified Competencies Table */}
      <div className="p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-4">
        <div className="flex items-center justify-between border-b border-[#3A3B34] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B4CCB8]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4]">
              Demonstrated Competencies Matrix
            </h3>
          </div>
          <span className="text-xs text-[#A39F94]">
            What this user has actually proven with executable proof
          </span>
        </div>

        <div className="space-y-2.5">
          {passport.demonstratedCompetencies.map((comp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] flex items-center justify-center font-bold text-xs border border-[#9BB59F]/40">
                  L{comp.level}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#F5EFE4]">{comp.skillName}</h4>
                  <span className="text-[11px] text-[#A39F94]">
                    Verified on {comp.verifiedDate} • {comp.evidenceCount} proof artifact attached
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Level {comp.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verifiable Evidence Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#BDB5A7] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#A9B7D0]" />
            <span>Verifiable Evidence Ledger ({passport.evidenceLedger.length})</span>
          </h3>
          <span className="text-[11px] text-[#A39F94]">Cryptographically verifiable test outputs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {passport.evidenceLedger.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      </div>

      {/* Share Modal */}
      <SharePassportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
