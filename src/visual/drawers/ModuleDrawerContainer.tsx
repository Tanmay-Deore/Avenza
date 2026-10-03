import React from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { SkillsView } from '../../components/skills/SkillsView';
import { JourneyView } from '../../components/journey/JourneyView';
import { MentorView } from '../../components/mentor/MentorView';
import { DiscoverView } from '../../components/discovery/DiscoverView';
import { SkillPassportView } from '../../components/passport/SkillPassportView';
import { MissionsView } from '../../components/missions/MissionsView';
import { X, Maximize2 } from 'lucide-react';

export const ModuleDrawerContainer: React.FC = () => {
  const { state, closeModuleDrawer, setViewMode } = useVisual();
  const { setActiveTab } = useAvenza();

  if (!state.activeModuleDrawer) return null;

  const getModuleTitle = () => {
    switch (state.activeModuleDrawer) {
      case 'skills':
        return { num: '01', name: 'SKILL MAP & DIAGNOSTIC MATRIX' };
      case 'journey':
        return { num: '02', name: 'DYNAMIC LEARNING ROUTE' };
      case 'mentor':
        return { num: '03', name: 'CONTEXTUAL AI MENTOR' };
      case 'discover':
        return { num: '04', name: 'DIRECTION DISCOVERY COMPASS' };
      case 'missions':
      case 'verification':
        return { num: '05', name: 'PRACTICAL LAB & CODE VERIFICATION' };
      case 'passport':
        return { num: '06', name: 'OFFICIAL SKILL PASSPORT LEDGER' };
      default:
        return { num: '00', name: 'AVENZA MODULE' };
    }
  };

  const renderModuleContent = () => {
    switch (state.activeModuleDrawer) {
      case 'skills':
        return <SkillsView />;
      case 'journey':
        return <JourneyView />;
      case 'mentor':
        return <MentorView />;
      case 'discover':
        return <DiscoverView />;
      case 'missions':
      case 'verification':
        return <MissionsView />;
      case 'passport':
        return <SkillPassportView />;
      default:
        return <SkillsView />;
    }
  };

  const { num, name } = getModuleTitle();

  const handleOpenInWorkspace = () => {
    const tabMap: Record<string, any> = {
      skills: 'skills',
      journey: 'journey',
      mentor: 'mentor',
      discover: 'discover',
      missions: 'missions',
      verification: 'skills',
      passport: 'passport',
    };
    setActiveTab(tabMap[state.activeModuleDrawer || 'skills'] || 'home');
    setViewMode('workspace');
    closeModuleDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#20211E]/40 backdrop-blur-sm flex items-center justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl h-full bg-[#F8F4EC] dark:bg-[#1B1C19] text-[#20211E] dark:text-[#F4EDE1] flex flex-col shadow-2xl border-l border-[#D8CCB9] dark:border-[#57584E] animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label={name}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#D8CCB9] dark:border-[#57584E] flex items-center justify-between bg-[#F8F4EC]/90 dark:bg-[#242520]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#E6EDF5] dark:bg-[#2E302B] text-[#46597A] dark:text-[#AFC0E0] border border-[#D5E0EC] dark:border-[#57584E]">
              MODULE {num}
            </span>
            <h2 className="font-mono font-bold text-sm tracking-tight text-[#20211E] dark:text-[#F4EDE1]">
              {name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInWorkspace}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-[#46597A] dark:text-[#AFC0E0] hover:bg-[#E6EDF5] dark:hover:bg-[#2E302B] border border-[#D5E0EC] dark:border-[#57584E] flex items-center gap-1.5 transition-colors"
              title="Open in full workspace view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Workspace</span>
            </button>

            <button
              onClick={closeModuleDrawer}
              aria-label="Close module drawer"
              className="p-1.5 rounded-lg text-[#64625A] hover:text-[#20211E] dark:text-[#BDB5A6] dark:hover:text-[#F4EDE1] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {renderModuleContent()}
        </div>
      </div>
    </div>
  );
};
