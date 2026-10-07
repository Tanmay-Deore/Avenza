import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { useDashboardMotion } from './useDashboardMotion';
import { AvenzaCardWrapper } from './AvenzaCardWrapper';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export const ActiveMissionCard: React.FC = () => {
  const { missions, openMissionModal, setActiveTab } = useAvenza();
  const { pulsePhase, activeRelationship } = useDashboardMotion();
  const [isHovered, setIsHovered] = useState(false);

  const availableMissions = Object.values(missions);
  const activeMission =
    availableMissions.find((m) => m.status === 'AVAILABLE' || m.status === 'IN_PROGRESS') ||
    availableMissions[0];

  if (!activeMission) return null;

  const isMissionActiveInPulse = pulsePhase === 'mission';
  const isLinkedToMission = Boolean(
    activeRelationship &&
      (activeMission.title.toLowerCase().includes(activeRelationship.toLowerCase()) ||
        activeMission.objective.toLowerCase().includes(activeRelationship.toLowerCase()))
  );

  return (
    <AvenzaCardWrapper
      preset="secondary"
      tint="blue"
      isHighlighted={isLinkedToMission}
      highlightColor="#8798B7"
      isPulsing={isMissionActiveInPulse}
      onHoverChange={setIsHovered}
      className="w-full"
    >
      <div className="bg-[#282923] border border-[#4A4A42] rounded-2xl w-full p-5 sm:p-6 flex flex-col shadow-sm relative overflow-hidden">
        {/* Top Header: Title & Preserved Action */}
        <div className="flex flex-row items-center justify-between pb-3 border-b border-[#373832]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg bg-[#30312C] text-[#8798B7] border border-[#4A4A42] transition-transform duration-300 ${
                isMissionActiveInPulse ? 'scale-110 shadow-sm shadow-[#8798B7]/40' : ''
              }`}
              style={{
                transform: isHovered ? 'translateZ(14px) scale(1.08)' : 'none',
              }}
            >
              <Zap className="w-4 h-4 text-[#8798B7]" />
            </div>

            <h3
              className={`text-sm font-bold transition-colors ${
                isHovered || isMissionActiveInPulse ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
              style={{
                transform: isHovered ? 'translateZ(14px)' : 'none',
              }}
            >
              Today’s Practical Mission
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Launchpad Status Telemetry (Idea 08) */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-[#8798B7]/16 text-[#A9B7D0] border border-[#8798B7]/40 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8798B7] animate-pulse" />
              Ready
            </span>

            <button
              onClick={() => setActiveTab('missions')}
              className="text-xs text-[#A9B7D0] hover:text-[#F5EFE4] flex items-center gap-1 font-medium transition-colors"
              style={{
                transform: isHovered ? 'translateZ(10px)' : 'none',
              }}
            >
              <span>All Missions</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8798B7]" />
            </button>
          </div>
        </div>

        {/* Mission Content */}
        <div className="pt-3 space-y-3">
          <div
            style={{
              transform: isHovered
                ? 'translate3d(calc(var(--px, 0) * 1.0px), calc(var(--py, 0) * 0.7px), 16px)'
                : 'none',
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A9B7D0] bg-[#8798B7]/16 px-2 py-0.5 rounded border border-[#8798B7]/50 font-mono">
                Hands-on Output
              </span>

              {/* Cross-section connection telemetry badge */}
              {isLinkedToMission && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#C6927D]/20 text-[#E3A28E] border border-[#C6927D]/50 animate-pulse">
                  Linked Practical Lab
                </span>
              )}
            </div>

            <h4
              className={`font-bold text-sm mt-1.5 transition-colors duration-200 ${
                isHovered || isMissionActiveInPulse ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
              }`}
            >
              {activeMission.title}
            </h4>

            <p className="text-xs text-[#BDB5A7] mt-1 line-clamp-2 leading-relaxed">
              {activeMission.objective}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#373832]">
            <div
              className="flex items-center justify-between text-xs"
              style={{
                transform: isHovered ? 'translateZ(8px)' : 'none',
              }}
            >
              <div className="flex items-center gap-1.5 text-[#A39F94]">
                <Clock className="w-3.5 h-3.5 text-[#8798B7]" />
                <span>~{activeMission.estimatedMinutes} mins effort</span>
              </div>
              <span className="text-[11px] font-semibold text-[#B4CCB8]">
                {activeMission.steps.length} validation checks
              </span>
            </div>

            {/* Launch Action Button with tactile compression (Idea 08 & 30) */}
            <button
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-sm shadow-[#8798B7]/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.988] group"
              style={{
                transform: isHovered ? 'translateZ(14px)' : 'none',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => openMissionModal(activeMission.id)}
            >
              <Zap className="w-3.5 h-3.5 text-[#20211E] transition-transform duration-200 group-hover:scale-115" />
              <span>
                {activeMission.status === 'COMPLETED' ? 'Review Solution' : 'Launch Interactive Lab'}
              </span>
              <ArrowRight className="w-3 h-3 text-[#20211E] opacity-70 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </AvenzaCardWrapper>
  );
};
