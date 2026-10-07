import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import {
  Compass,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Flag,
  Sparkles,
} from 'lucide-react';

interface SkillJourneyConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  skillLevel: number;
}

export const SkillJourneyConnectionModal: React.FC<SkillJourneyConnectionModalProps> = ({
  isOpen,
  onClose,
  skillName,
  skillLevel,
}) => {
  const { user, journey, setActiveTab } = useAvenza();

  // Find journey steps related to this skill
  const relatedSteps = journey.filter((step) =>
    step.skills.some(
      (s) =>
        s.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(s.toLowerCase())
    )
  );

  const targetRole = user.currentGoal?.targetRoleOrSkill || 'AI Engineering';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#8798B7]" />
          <span className="text-sm font-bold text-[#F5EFE4]">
            Journey Origin: {skillName} (Level {skillLevel})
          </span>
        </div>
      }
      size="lg"
      className="border border-[#4A4A42] bg-[#282923]"
    >
      <div className="space-y-5">
        {/* Banner Notice */}
        <div className="p-4 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B4CCB8]">
            <Sparkles className="w-3.5 h-3.5 text-[#9BB59F]" />
            <span>THIS CAPABILITY WAS BUILT THROUGH YOUR JOURNEY</span>
          </div>
          <p className="text-xs text-[#BDB5A7] leading-relaxed">
            Every verified credential in your passport originated from a calibrated mission and diagnostic checkpoint on your personalized path.
          </p>
        </div>

        {/* Visual Lineage Connection Flow */}
        <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#9BB59F] via-[#8798B7] to-[#D1B46A]">
          {/* Node 1: Origin Skill */}
          <div className="relative p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="absolute -left-[27px] top-3.5 w-4 h-4 rounded-full bg-[#9BB59F] border-2 border-[#20211E]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#A39F94] uppercase">01 • Skill Competency</span>
              <span className="font-mono text-[#9BB59F]">Level {skillLevel} Verified</span>
            </div>
            <h4 className="font-bold text-sm text-[#F5EFE4] mt-0.5">{skillName}</h4>
          </div>

          {/* Node 2: Mission Checkpoint */}
          <div className="relative p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="absolute -left-[27px] top-3.5 w-4 h-4 rounded-full bg-[#8798B7] border-2 border-[#20211E]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#A39F94] uppercase">02 • Practice & Task Runner</span>
              <span className="font-mono text-[#8798B7]">Unit Checks Passed</span>
            </div>
            <h4 className="font-bold text-sm text-[#F5EFE4] mt-0.5">
              Hands-On Syntax & Execution Lab
            </h4>
            <p className="text-xs text-[#BDB5A7] mt-1">
              Passed interactive test assertions and runtime benchmarks.
            </p>
          </div>

          {/* Node 3: Checkpoint Unlocked */}
          <div className="relative p-3.5 rounded-xl bg-[#242520] border border-[#3A3B34]">
            <span className="absolute -left-[27px] top-3.5 w-4 h-4 rounded-full bg-[#A79BC4] border-2 border-[#20211E]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#A39F94] uppercase">03 • Checkpoint Unlocked</span>
              <span className="font-mono text-[#BDB2D6]">Path Progression</span>
            </div>
            <h4 className="font-bold text-sm text-[#F5EFE4] mt-0.5">
              Unlocked Next Milestone on Path
            </h4>
          </div>

          {/* Node 4: Route Destination */}
          <div className="relative p-3.5 rounded-xl bg-[#242520] border border-[#D1B46A]/50">
            <span className="absolute -left-[27px] top-3.5 w-4 h-4 rounded-full bg-[#D1B46A] border-2 border-[#20211E]" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#A39F94] uppercase">04 • Route Destination</span>
              <span className="font-mono text-[#E0C77F]">Specialization Target</span>
            </div>
            <h4 className="font-bold text-sm text-[#F5EFE4] mt-0.5">{targetRole}</h4>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-[#3A3B34]">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setActiveTab('journey');
            }}
            leftIcon={<Compass className="w-4 h-4" />}
          >
            Open Full Journey
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
