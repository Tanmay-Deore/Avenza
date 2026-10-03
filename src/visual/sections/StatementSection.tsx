import React from 'react';
import { useVisual } from '../visualStateStore';
import { GlitchText } from '../GlitchText';
import { ArrowRight } from 'lucide-react';

export const StatementSection: React.FC = () => {
  const { openModuleDrawer, setSelectedSkillId } = useVisual();

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkillId(skillId);
    openModuleDrawer('skills');
  };

  return (
    <section className="min-h-screen relative flex flex-col justify-center p-6 sm:p-16 z-20 pointer-events-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Column (8 cols): Large Techno-Monospace Headline distorted by Torus */}
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ECE7F4] dark:bg-[#252230] border border-[#DDD5EA] dark:border-[#3E384D] text-[10px] font-mono font-bold tracking-widest text-[#5E5277] dark:text-[#D4CBE5] pointer-events-auto">
            02 // THE NAVIGATIONAL METAPHOR
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-tighter text-[#20211E] dark:text-[#F4EDE1] uppercase leading-[1.1]">
            WE DO NOT TEACH COURSES. <br />
            <span className="text-[#4F6288] dark:text-[#9FB0D3]">
              <GlitchText text="WE MAP YOUR REALITY" triggerKey="map-reality" />
            </span> <br />
            AND RECALIBRATE YOUR PATH.
          </h2>

          {/* Interactive Skill Network Nodes Chips */}
          <div className="pt-2 flex flex-wrap gap-2 pointer-events-auto">
            {[
              { id: 'python-core', name: 'PYTHON CORE', level: 'L3 / L5', color: '#8495B8' },
              { id: 'machine-learning', name: 'AI & ML', level: 'L2 / L4', color: '#A48B6A' },
              { id: 'data-structures', name: 'DATA STRUCTURES', level: 'L2 / L4', color: '#9EAD97' },
              { id: 'web-foundations', name: 'FULL-STACK SYSTEMS', level: 'L3 / L4', color: '#C58F78' },
            ].map((node) => (
              <button
                key={node.id}
                onClick={() => handleSkillSelect(node.id)}
                className="px-3 py-1.5 rounded-lg bg-[#F8F4EC] dark:bg-[#242520] hover:bg-[#EDE3D2] dark:hover:bg-[#2E302B] border border-[#D8CCB9] dark:border-[#3B3E36] text-xs font-mono font-bold text-[#20211E] dark:text-[#F4EDE1] flex items-center gap-2 transition-all shadow-sm hover:shadow-md group"
              >
                <span className="w-2 h-2 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: node.color }} />
                <span>{node.name}</span>
                <span className="text-[10px] text-[#64625A] dark:text-[#BDB5A6] font-normal">[{node.level}]</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Two-column Caption Block matching reference video */}
        <div className="lg:col-span-4 space-y-6 pointer-events-auto">
          <div className="p-6 rounded-2xl bg-[#F8F4EC] dark:bg-[#242520] border border-[#D8CCB9] dark:border-[#3B3E36] shadow-lg space-y-4">
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#64625A] dark:text-[#BDB5A6] uppercase">
              FOUNDING PRINCIPLE // 01
            </div>

            <p className="text-xs sm:text-sm text-[#5A5B53] dark:text-[#D2C9BB] leading-relaxed">
              Standard curricula assume everyone starts from zero and learns at the exact same speed. Avenza calculates the exact distance between your proven competencies and target role, eliminating redundant busywork.
            </p>

            <button
              onClick={() => openModuleDrawer('skills')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#20211E] hover:bg-[#32332E] text-[#F8F4EC] font-mono text-xs font-bold transition-colors flex items-center justify-between"
            >
              <span>INSPECT SKILL DIAGNOSTIC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
