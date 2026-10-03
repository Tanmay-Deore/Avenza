import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { MissionPlayground } from './MissionPlayground';
import { ProjectShowcase } from './ProjectShowcase';
import { DepthGrid } from '../../visual/depth-engine/DepthGrid';
import { DepthCard } from '../../visual/depth-engine/DepthCard';
import {
  Zap,
  Clock,
  CheckCircle2,
  Play,
  Sparkles,
  FolderGit2,
  Code,
} from 'lucide-react';

export const MissionsView: React.FC = () => {
  const { missions, openMissionModal } = useAvenza();
  const [activeTab, setActiveTab] = useState<'missions' | 'capstones'>('missions');

  const missionList = Object.values(missions);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#242520] to-[#2E302B] border border-[#3A3B34] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42]">
              Hands-on Lab
            </span>
            <span className="text-xs text-[#A39F94]">Practical code output over passive watching</span>
          </div>
          <h2 className="text-xl font-black text-[#F5EFE4]">Practical Missions & Code Lab</h2>
          <p className="text-xs text-[#BDB5A7] mt-1 max-w-xl">
            Complete targeted missions to build real muscle memory. Each completed mission executes automated validation tests and adds proof to your passport.
          </p>
        </div>

        {/* View Switch */}
        <div className="flex items-center p-1 bg-[#1F201C] rounded-xl border border-[#3A3B34]">
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'missions'
                ? 'bg-[#30312C] text-[#F5EFE4] border border-[#8798B7]/50 shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#8798B7]" />
            <span>Missions ({missionList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('capstones')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'capstones'
                ? 'bg-[#30312C] text-[#F5EFE4] border border-[#8798B7]/50 shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-[#A79BC4]" />
            <span>Capstones</span>
          </button>
        </div>
      </div>

      {activeTab === 'capstones' ? (
        <ProjectShowcase />
      ) : (
        <DepthGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {missionList.map((mission) => {
            const isCompleted = mission.status === 'COMPLETED';

            return (
              <DepthCard
                key={mission.id}
                id={mission.id}
                category={mission.category}
                title={mission.title}
                description={mission.objective}
                status={isCompleted ? 'VERIFIED' : 'LEARNING'}
                badge={
                  isCompleted ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#9BB59F]/16 text-[#B4CCB8] border border-[#9BB59F]/50 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#9BB59F]" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs text-[#A39F94] font-mono">
                      ~{mission.estimatedMinutes} mins
                    </span>
                  )
                }
                onClick={() => openMissionModal(mission.id)}
                ariaLabel={`${mission.title}, ${mission.category}, ${mission.status}`}
                footerMeta={
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#A39F94]">
                      <span>{mission.steps.length} Guided Steps</span>
                      <span className="text-[#B4CCB8] font-medium">{mission.difficulty}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMissionModal(mission.id);
                      }}
                      className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 text-[#20211E] fill-current" />
                      <span>{isCompleted ? 'Review Code Solution' : 'Launch Mission Lab'}</span>
                    </button>
                  </div>
                }
              />
            );
          })}
        </DepthGrid>
      )}

      {/* Interactive Mission Playground Modal */}
      <MissionPlayground />
    </div>
  );
};
