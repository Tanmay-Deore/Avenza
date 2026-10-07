import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Drawer } from '../../design-system/Drawer';
import { Button } from '../../design-system/Button';
import {
  BookOpen,
  Clock,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';

export const JourneyNodeModal: React.FC = () => {
  const {
    selectedJourneyStep,
    closeStepDetail,
    openMissionModal,
    openVerificationModal,
    skills,
  } = useAvenza();

  if (!selectedJourneyStep) return null;

  const step = selectedJourneyStep;
  const stepSkill = step.skills[0] ? skills[step.skills[0]] : null;

  const handleLaunchAssociatedAction = () => {
    closeStepDetail();
    if (step.type === 'MISSION' && step.missionId) {
      openMissionModal(step.missionId);
    } else if (step.type === 'VERIFICATION' && step.skills[0]) {
      openVerificationModal(step.skills[0]);
    }
  };

  return (
    <Drawer
      isOpen={!!selectedJourneyStep}
      onClose={closeStepDetail}
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-[#E7EDF5] text-[#5F7397] border border-[#8798B7]">
            {step.type}
          </span>
          <span className="text-xs text-[#B7AE9E] font-mono">Step #{step.order}</span>
        </div>
      }
      description="Personalized Path Checkpoint Details"
      size="md"
    >
      <div className="space-y-6">
        {/* Step Title & Status */}
        <div>
          <h3 className="text-lg font-bold text-[#F4EDE1]">{step.title}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                step.status === 'COMPLETED'
                  ? 'bg-[#29342F] text-[#9BB59F] border-[#718D7B]'
                  : step.status === 'IN_PROGRESS'
                  ? 'bg-[#26343A] text-[#9CB4D8] border-[#7188A7]'
                  : 'bg-[#30312C] text-[#B7B0A4] border-[#484941]'
              }`}
            >
              {step.status === 'COMPLETED'
                ? 'Completed'
                : step.status === 'IN_PROGRESS'
                ? 'Active Checkpoint'
                : 'Upcoming'}
            </span>

            <div className="flex items-center gap-1 text-xs text-[#C2BAAD]">
              <Clock className="w-3.5 h-3.5 text-[#A9B19F]" />
              <span>{step.estimatedMinutes} mins</span>
            </div>

            <span className="text-xs text-[#B8B0A2] font-medium">
              Difficulty: {step.difficulty}
            </span>
          </div>
        </div>

        {/* Objective & Description */}
        <div className="p-4 rounded-xl bg-[#30312C] border border-[#484941] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#DED6C8]">
            Checkpoint Objective
          </h4>
          <p className="text-xs text-[#B7B0A4] leading-relaxed">{step.description}</p>
        </div>

        {/* Action Instruction */}
        <div className="p-4 rounded-xl bg-[#2D3435] border border-[#61778C] space-y-2">
          <div className="flex items-center gap-1.5 text-[#93AACC] text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4 text-[#91A6C4]" />
            <span>Recommended Action</span>
          </div>
          <p className="text-xs text-[#D0C8BA] leading-relaxed">{step.actionInstruction}</p>
        </div>

        {/* Reroute Info if applicable */}
        {step.isRerouted && (
          <div className="p-3.5 rounded-xl bg-[#29342F] border border-[#718D7B] flex items-start gap-2.5 text-xs">
            <Sparkles className="w-4 h-4 text-[#9BB59F] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#A8BEA9]">Dynamically Adapted</span>
              <p className="text-[#C8C3B8] mt-0.5">{step.rerouteReason}</p>
            </div>
          </div>
        )}

        {/* Associated Skill context */}
        {stepSkill && (
          <div className="p-4 rounded-xl bg-[#30312C] border border-[#484941] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6DED0]">
              Associated Skill
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F4EDE1]">{stepSkill.name}</div>
                <div className="text-[11px] text-[#B7B0A3]">{stepSkill.category}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[#A9B9D2]">
                  Lvl {stepSkill.currentLevel} / 5
                </div>
                <div className="text-[10px] font-medium mt-0.5">
                  {stepSkill.verifiedLevel > 0 ? (
                    <span className="px-1.5 py-0.5 rounded bg-[#29342F] text-[#9BB59F] border border-[#718D7B]/40 font-mono">
                      Verified
                    </span>
                  ) : (
                    <span className="text-[#B7B0A3]">Unverified</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#B7B0A4] leading-relaxed border-t border-[#484941] pt-2">
              {stepSkill.whyItMatters}
            </p>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          {step.type === 'MISSION' ? (
            <Button
              size="lg"
              className="w-full !bg-[#C9B99D] hover:!bg-[#D8C9AE] !text-[#24251F] border border-[#C9B99D]/40 font-bold shadow-md shadow-[#C9B99D]/15 transition-all"
              onClick={handleLaunchAssociatedAction}
              leftIcon={<Zap className="w-4 h-4 text-[#24251F]" />}
            >
              Open Practical Mission Sandbox
            </Button>
          ) : step.type === 'VERIFICATION' ? (
            <Button
              size="lg"
              className="w-full !bg-[#C9B99D] hover:!bg-[#D8C9AE] !text-[#24251F] border border-[#C9B99D]/40 font-bold shadow-md shadow-[#C9B99D]/15 transition-all"
              onClick={handleLaunchAssociatedAction}
              leftIcon={<ShieldCheck className="w-4 h-4 text-[#24251F]" />}
            >
              Start Skill Verification
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full !bg-[#C9B99D] hover:!bg-[#D8C9AE] !text-[#24251F] border border-[#C9B99D]/40 font-bold shadow-md shadow-[#C9B99D]/15 transition-all"
              onClick={closeStepDetail}
              leftIcon={<BookOpen className="w-4 h-4 text-[#24251F]" />}
            >
              Start Practicing Now
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};
