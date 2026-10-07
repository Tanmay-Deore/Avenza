import React from 'react';
import { EvidenceItem } from '../../types';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { EvidenceFreshnessBadge } from './EvidenceFreshnessBadge';
import {
  ShieldCheck,
  Zap,
  Award,
  Code,
  Calendar,
  Terminal,
  FileCheck,
  CheckCircle2,
  Hash,
} from 'lucide-react';

interface EvidenceDetailModalProps {
  evidence: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
  passportId: string;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({
  evidence,
  isOpen,
  onClose,
  passportId,
}) => {
  if (!evidence) return null;

  const getIcon = () => {
    if (evidence.type === 'ASSESSMENT') return <ShieldCheck className="w-5 h-5 text-[#9BB59F]" />;
    if (evidence.type === 'MISSION') return <Zap className="w-5 h-5 text-[#8798B7]" />;
    if (evidence.type === 'PROJECT') return <Award className="w-5 h-5 text-[#BDB2D6]" />;
    return <Code className="w-5 h-5 text-[#D1B46A]" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-bold text-[#F5EFE4]">{evidence.title}</span>
        </div>
      }
      size="lg"
      className="border border-[#4A4A42] bg-[#282923]"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94]">
                EVIDENCE TYPE: {evidence.type}
              </span>
              <h3 className="font-bold text-base text-[#F5EFE4] mt-0.5">{evidence.title}</h3>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40">
                Level {evidence.levelEarned} Earned
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-[#3A3B34] text-xs font-mono">
            <span className="text-[#A39F94]">Timestamp:</span>
            <span className="text-[#F5EFE4]">{new Date(evidence.timestamp).toLocaleString()}</span>
            <span className="text-[#3A3B34]">•</span>
            <EvidenceFreshnessBadge timestamp={evidence.timestamp} />
          </div>
        </div>

        {/* Verifiable Output Summary */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#BDB5A7] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#8798B7]" />
            <span>Cryptographic Execution Assertions & Proof Summary</span>
          </label>
          <div className="p-4 rounded-xl bg-[#20211E] border border-[#3A3B34] font-mono text-xs text-[#BDB5A7] leading-relaxed whitespace-pre-wrap">
            {evidence.proofSummary}
          </div>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#242520] p-3.5 rounded-xl border border-[#3A3B34]">
          <div>
            <span className="text-[10px] text-[#A39F94] block uppercase">Related Skill</span>
            <span className="text-[#F5EFE4] font-bold">{evidence.skillName}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A39F94] block uppercase">Verified By</span>
            <span className="text-[#9BB59F]">{evidence.verifiedBy}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A39F94] block uppercase">Audit Protocol</span>
            <span className="text-[#A9B7D0]">AVZ-RUNNER-V2</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A39F94] block uppercase">Passport Reference</span>
            <span className="text-[#D1B46A] truncate block">{passportId}</span>
          </div>
        </div>

        {/* Attestation Seal */}
        <div className="p-3 rounded-lg bg-[rgba(155,181,159,0.1)] border border-[#9BB59F]/30 flex items-center justify-between text-xs font-mono text-[#B4CCB8]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#9BB59F]" />
            <span>IMMUTABLE RECORD — VERIFIED BY LOCAL RUNTIME SUITE</span>
          </span>
          <span className="text-[10px] text-[#A39F94]">HASH #AVZ{evidence.id.slice(0, 8)}</span>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#3A3B34]">
          <Button variant="secondary" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </Modal>
  );
};
