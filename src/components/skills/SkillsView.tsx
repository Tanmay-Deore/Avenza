import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { StatusBadge } from '../../design-system/StatusBadge';
import { ProgressBar } from '../../design-system/Progress';
import { Button } from '../../design-system/Button';
import { SkillDetailModal } from './SkillDetailModal';
import { GapAnalysisPanel } from './GapAnalysisPanel';
import { Skill, SkillStatus } from '../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';

import { DepthGrid } from '../../visual/depth-engine/DepthGrid';
import { SkillMatrixCard } from './SkillMatrixCard';

export const SkillsView: React.FC = () => {
  const { skills, openVerificationModal } = useAvenza();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'gaps'>('matrix');

  const skillsList = Object.values(skills);

  const filteredSkills = skillsList.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'ALL') return true;
    if (filter === 'VERIFIED') return skill.verifiedLevel > 0;
    if (filter === 'LEARNING') return skill.status === 'LEARNING';
    if (filter === 'WEAK') return skill.status === 'WEAK';
    if (filter === 'UNVERIFIED') return skill.status === 'UNVERIFIED';
    if (filter === 'RECOMMENDED') return skill.status === 'RECOMMENDED';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#242520] to-[#2E302B] border border-[#3A3B34] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42]">
              Skill Profile
            </span>
            <span className="text-xs text-[#A39F94]">
              {skillsList.filter((s) => s.verifiedLevel > 0).length} Verified of {skillsList.length} Tracked
            </span>
          </div>
          <h2 className="text-xl font-black text-[#F5EFE4]">Competency Matrix & Skill Diagnostic</h2>
          <p className="text-xs text-[#BDB5A7] mt-1 max-w-xl">
            Avenza distinguishes between what you claim to know and what you have practically verified with code and assessments.
          </p>
        </div>

        {/* View Switch Tabs */}
        <div className="flex items-center p-1 bg-[#1F201C] rounded-xl border border-[#3A3B34]">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-[#30312C] text-[#F5EFE4] border border-[#8798B7]/50 shadow-sm' : 'text-[#A39F94] hover:text-[#F5EFE4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#8798B7]" />
            <span>Skill Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'gaps' ? 'bg-[#30312C] text-[#F5EFE4] border border-[#8798B7]/50 shadow-sm' : 'text-[#A39F94] hover:text-[#F5EFE4]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#C6927D]" />
            <span>Gap Breakdown</span>
          </button>
        </div>
      </div>

      {activeTab === 'gaps' ? (
        <GapAnalysisPanel />
      ) : (
        <>
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input (Light Warm Surface) */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#5F5C53] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search skills or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#E9E1D5] border border-[#D4C8B8] rounded-lg pl-9 pr-3 py-2 text-xs text-[#34352F] placeholder-[#5F5C53] focus:outline-none focus:ring-2 focus:ring-[#8798B7] focus:border-[#8798B7] transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'ALL', label: 'All Skills' },
                { id: 'VERIFIED', label: 'Verified' },
                { id: 'LEARNING', label: 'Learning' },
                { id: 'WEAK', label: 'Needs Attention' },
                { id: 'RECOMMENDED', label: 'Recommended' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    filter === f.id
                      ? 'bg-[#282923] border-[#8798B7] text-[#F5EFE4] shadow-sm'
                      : 'bg-[#E8E0D4] border-[#D4C8B8] text-[#5F5D55] hover:text-[#282923] hover:border-[#B5AE9F]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Depth Engine 3D Skills Grid */}
          <DepthGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredSkills.map((skill) => (
              <SkillMatrixCard
                key={skill.id}
                skill={skill}
                onSelect={() => setSelectedSkill(skill)}
              />
            ))}
          </DepthGrid>
        </>
      )}

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
};
