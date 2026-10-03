import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { RerouteNotification } from './RerouteNotification';
import { JourneyNodeModal } from './JourneyNodeModal';
import { PathSimulator } from './PathSimulator';
import { JourneyStep, JourneyStepType } from '../../types';
import { cn } from '../../design-system/utils';
import {
  CheckCircle2,
  Clock,
  Play,
  Zap,
  ShieldCheck,
  Flag,
  Sparkles,
  BookOpen,
  Filter,
  Lock,
} from 'lucide-react';

export const JourneyView: React.FC = () => {
  const {
    journey,
    user,
    openStepDetail,
    openMissionModal,
    openVerificationModal,
  } = useAvenza();

  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredSteps = journey.filter((step) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'ACTIVE') return step.status === 'IN_PROGRESS';
    if (filterType === 'MISSIONS') return step.type === 'MISSION';
    if (filterType === 'VERIFICATIONS') return step.type === 'VERIFICATION';
    if (filterType === 'COMPLETED') return step.status === 'COMPLETED';
    return true;
  });

  const getStepIcon = (type: JourneyStepType, status: JourneyStep['status']) => {
    if (status === 'COMPLETED') return <CheckCircle2 className="w-5 h-5 text-[#9BB59F]" />;
    if (type === 'MISSION') return <Zap className="w-5 h-5 text-[#8798B7]" />;
    if (type === 'VERIFICATION') return <ShieldCheck className="w-5 h-5 text-[#A79BC4]" />;
    if (type === 'PROJECT') return <Flag className="w-5 h-5 text-[#D1B46A]" />;
    return <BookOpen className="w-5 h-5 text-[#8798B7]" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* 1. Reroute Notification Banner if recently adapted */}
      <RerouteNotification />

      {/* 2. Header & Destination Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#242520] via-[#2E302B] to-[#242520] border border-[#3A3B34] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42]">
              Personalized Path
            </span>
            <span className="text-xs text-[#A39F94]">
              Paced at {user.availableMinutesPerDay} min/day
            </span>
          </div>
          <h2 className="text-xl font-black text-[#F5EFE4]">{user.currentGoal?.title}</h2>
          <p className="text-xs text-[#BDB5A7] mt-1 max-w-2xl leading-relaxed">
            {user.currentGoal?.description}
          </p>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1F201C] rounded-xl border border-[#3A3B34] self-start sm:self-center">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'MISSIONS', label: 'Missions' },
            { id: 'VERIFICATIONS', label: 'Verify' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors',
                filterType === f.id
                  ? 'bg-[#30312C] text-[#F5EFE4] border border-[#8798B7]/50 shadow-sm'
                  : 'text-[#A39F94] hover:text-[#F5EFE4]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Journey Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#8798B7] before:via-[#9BB59F] before:to-[#4A4A42]">
        {filteredSteps.map((step, idx) => {
          const isActive = step.status === 'IN_PROGRESS';
          const isCompleted = step.status === 'COMPLETED';

          return (
            <div
              key={step.id}
              onClick={() => openStepDetail(step)}
              className={cn(
                'relative p-5 rounded-xl border transition-all cursor-pointer group shadow-sm',
                isActive
                  ? 'bg-[#30312C] border-[#8798B7] shadow-md shadow-[#8798B7]/15 ring-1 ring-[#8798B7]/40'
                  : isCompleted
                  ? 'bg-[#282923] border-[#9BB59F]/40 hover:border-[#9BB59F]/70'
                  : 'bg-[#282923] border-[#4A4A42] hover:border-[#8798B7]/50 hover:bg-[#2E302B]'
              )}
            >
              {/* Node Marker on Timeline */}
              <div
                className={cn(
                  'absolute -left-[31px] sm:-left-[39px] top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 shadow-md',
                  isActive
                    ? 'bg-[#242520] border-[#8798B7] text-[#A9B7D0] animate-pulse'
                    : isCompleted
                    ? 'bg-[#242520] border-[#9BB59F] text-[#B4CCB8]'
                    : 'bg-[#242520] border-[#4A4A42] text-[#A39F94]'
                )}
              >
                {getStepIcon(step.type, step.status)}
              </div>

              {/* Main Content */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'text-[10px] uppercase font-bold px-2 py-0.5 rounded border',
                        isActive
                          ? 'bg-[#8798B7]/16 text-[#A9B7D0] border-[#8798B7]/50'
                          : isCompleted
                          ? 'bg-[#9BB59F]/16 text-[#B4CCB8] border-[#9BB59F]/50'
                          : 'bg-[#1F201C] text-[#A39F94] border-[#4A4A42]'
                      )}
                    >
                      {isActive ? 'Current Focus' : isCompleted ? 'Completed' : step.type}
                    </span>

                    {step.isRerouted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#A79BC4]/16 text-[#BDB2D6] border border-[#A79BC4]/50">
                        <Sparkles className="w-2.5 h-2.5 text-[#A79BC4]" />
                        Adapted
                      </span>
                    )}

                    <span className="text-xs text-[#A39F94] font-mono">Step #{step.order}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#F5EFE4] group-hover:text-[#A9B7D0] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#BDB5A7] leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>

                {/* Right Metadata & Action */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="flex items-center gap-1 text-xs text-[#A39F94] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#8798B7]" />
                    <span>{step.estimatedMinutes}m</span>
                  </div>

                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (step.type === 'MISSION' && step.missionId) {
                          openMissionModal(step.missionId);
                        } else if (step.type === 'VERIFICATION' && step.skills[0]) {
                          openVerificationModal(step.skills[0]);
                        } else {
                          openStepDetail(step);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#8798B7]/20 transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Adaptive Path Simulator Component */}
      <PathSimulator />

      {/* Step Detail Drawer */}
      <JourneyNodeModal />
    </div>
  );
};
