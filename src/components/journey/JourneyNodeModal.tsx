import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Drawer } from '../../design-system/Drawer';
import { Button } from '../../design-system/Button';
import { StatusBadge } from '../../design-system/StatusBadge';
import {
  BookOpen,
  Clock,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
  ExternalLink,
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
          <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40">
            {step.type}
          </span>
          <span className="text-xs text-gray-400 font-mono">Step #{step.order}</span>
        </div>
      }
      description="Personalized Path Checkpoint Details"
      size="md"
    >
      <div className="space-y-6">
        {/* Step Title & Status */}
        <div>
          <h3 className="text-lg font-bold text-gray-100">{step.title}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                step.status === 'COMPLETED'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                  : step.status === 'IN_PROGRESS'
                  ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900 text-gray-400 border-slate-700/40'
              }`}
            >
              {step.status === 'COMPLETED'
                ? 'Completed'
                : step.status === 'IN_PROGRESS'
                ? 'Active Checkpoint'
                : 'Upcoming'}
            </span>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{step.estimatedMinutes} mins</span>
            </div>

            <span className="text-xs text-gray-400 font-medium">
              Difficulty: {step.difficulty}
            </span>
          </div>
        </div>

        {/* Objective & Description */}
        <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Checkpoint Objective
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Action Instruction */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Recommended Action</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{step.actionInstruction}</p>
        </div>

        {/* Reroute Info if applicable */}
        {step.isRerouted && (
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2.5 text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">Dynamically Adapted</span>
              <p className="text-gray-300 mt-0.5">{step.rerouteReason}</p>
            </div>
          </div>
        )}

        {/* Associated Skill context */}
        {stepSkill && (
          <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Associated Skill
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-100">{stepSkill.name}</div>
                <div className="text-[11px] text-gray-400">{stepSkill.category}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-cyan-400">
                  Lvl {stepSkill.currentLevel} / 5
                </div>
                <div className="text-[10px] text-gray-400">
                  {stepSkill.verifiedLevel > 0 ? 'Verified' : 'Unverified'}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed border-t border-[#26354D] pt-2">
              {stepSkill.whyItMatters}
            </p>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          {step.type === 'MISSION' ? (
            <Button
              variant="glow"
              size="lg"
              className="w-full"
              onClick={handleLaunchAssociatedAction}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Open Practical Mission Sandbox
            </Button>
          ) : step.type === 'VERIFICATION' ? (
            <Button
              variant="glow"
              size="lg"
              className="w-full"
              onClick={handleLaunchAssociatedAction}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Start Skill Verification
            </Button>
          ) : (
            <Button
              variant="glow"
              size="lg"
              className="w-full"
              onClick={closeStepDetail}
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Start Practicing Now
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};
