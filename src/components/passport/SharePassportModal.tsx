import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import {
  Share2,
  Copy,
  Check,
  Award,
} from 'lucide-react';

export const SharePassportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { passport, user } = useAvenza();
  const [copied, setCopied] = useState(false);

  const publicUrl = `https://avenza.nav/verify/${passport.passportId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#A9B7D0]" />
          <span className="text-sm font-bold text-[#F5EFE4]">Shareable Skill Passport</span>
        </div>
      }
      size="md"
      className="border border-[#4A4A42] bg-[#282923]"
    >
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] flex items-center justify-center border border-[#9BB59F]/40">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-[#F5EFE4]">{user.name}’s Verified Passport</h4>
          <p className="text-xs text-[#BDB5A7]">
            {passport.verifiedSkillsCount} verified competencies • {passport.evidenceLedger.length} proof items recorded
          </p>
          <div className="text-[11px] font-mono text-[#A9B7D0] pt-1">
            Passport ID: {passport.passportId}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#BDB5A7]">
            Verifiable Public Link
          </label>
          <div className="flex gap-2">
            <Input value={publicUrl} readOnly className="font-mono text-xs" />
            <Button
              variant="primary"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-[11px] text-[#A39F94]">
            Anyone with this link can independently verify your assessment test scores and practical code outputs.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#3A3B34]">
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
