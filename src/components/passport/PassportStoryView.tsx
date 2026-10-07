import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { generatePassportStory, PassportMilestone } from './passportData';
import { History, ShieldCheck, Zap, Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const PassportStoryView: React.FC = () => {
  const { passport, user, skills, missions } = useAvenza();
  const milestones = generatePassportStory(passport, user, skills, missions);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(milestones[0]?.id || '');

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'PASSPORT_ISSUED':
        return <Award className="w-4 h-4 text-[#D1B46A]" />;
      case 'VERIFICATION':
        return <ShieldCheck className="w-4 h-4 text-[#9BB59F]" />;
      case 'MISSION':
        return <Zap className="w-4 h-4 text-[#8798B7]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#BDB2D6]" />;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#9BB59F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Passport Story & Evidence Timeline
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40">
              Your Avenza Journey
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Chronological ledger of capability formation, diagnostic benchmarks, and verified milestones
          </p>
        </div>

        <div className="text-xs font-mono text-[#B4CCB8] bg-[#242520] px-3 py-1 rounded-lg border border-[#3A3B34]">
          {milestones.length} Recorded Milestones
        </div>
      </div>

      {/* Vertical Timeline Progression */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#9BB59F] via-[#8798B7] to-[#D1B46A]">
        {milestones.map((m, idx) => {
          const isSelected = activeMilestoneId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setActiveMilestoneId(m.id)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#373832] border-[#9BB59F] shadow-lg ring-1 ring-[#9BB59F]/40'
                  : 'bg-[#242520] border-[#3A3B34] hover:border-[#4A4A42]'
              }`}
            >
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[30px] sm:-left-[38px] top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#9BB59F] border-[#F5EFE4] text-[#20211E]'
                    : 'bg-[#20211E] border-[#9BB59F] text-[#9BB59F]'
                }`}
              >
                <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getMilestoneIcon(m.type)}
                  <h4 className="font-bold text-xs text-[#F5EFE4]">{m.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  {m.proofBadge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20211E] text-[#B4CCB8] border border-[#3A3B34]">
                      {m.proofBadge}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#A39F94]">{m.date}</span>
                </div>
              </div>

              <p className="text-xs text-[#BDB5A7] leading-relaxed">
                {m.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quiet Closure Standard */}
      <div className="pt-4 border-t border-[#3A3B34] flex items-center justify-between text-xs text-[#A39F94] font-mono">
        <span className="flex items-center gap-2 text-[#9BB59F]">
          <ShieldCheck className="w-4 h-4" />
          <span>THIS IS WHAT YOU HAVE PROVEN.</span>
        </span>
        <span>Passport ID: {passport.passportId}</span>
      </div>
    </div>
  );
};
