import React from 'react';
import { EvidenceItem } from '../../types';
import { ShieldCheck, Award, Zap, Code } from 'lucide-react';

export const EvidenceCard: React.FC<{ evidence: EvidenceItem }> = ({ evidence }) => {
  const getIcon = () => {
    if (evidence.type === 'ASSESSMENT') return <ShieldCheck className="w-4 h-4 text-[#B4CCB8]" />;
    if (evidence.type === 'MISSION') return <Zap className="w-4 h-4 text-[#A9B7D0]" />;
    if (evidence.type === 'PROJECT') return <Award className="w-4 h-4 text-[#BDB2D6]" />;
    return <Code className="w-4 h-4 text-[#E0C77F]" />;
  };

  return (
    <div className="p-4 rounded-xl bg-[#282923] border border-[#4A4A42] space-y-2 hover:border-[#8798B7] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#242520] border border-[#3A3B34]">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#F5EFE4]">{evidence.title}</h4>
            <span className="text-[10px] text-[#A39F94]">{evidence.verifiedBy}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[#B4CCB8]">
            Level {evidence.levelEarned} Earned
          </span>
          <div className="text-[10px] text-[#A39F94] font-mono">
            {new Date(evidence.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#BDB5A7] leading-relaxed bg-[#242520] p-2.5 rounded-lg border border-[#3A3B34]">
        {evidence.proofSummary}
      </p>
    </div>
  );
};
