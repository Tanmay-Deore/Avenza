import React, { useState } from 'react';
import { DISCOVERY_DIRECTIONS } from '../../services/discoveryEngine';
import { DirectionDetailModal } from './DirectionDetailModal';
import { UnsureWizard } from './UnsureWizard';
import { DiscoveryDirection } from '../../types';
import { DepthGrid } from '../../visual/depth-engine/DepthGrid';
import { DepthCard } from '../../visual/depth-engine/DepthCard';
import {
  Compass,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const DiscoverView: React.FC = () => {
  const [selectedDirection, setSelectedDirection] = useState<DiscoveryDirection | null>(null);
  const [showUnsureCompass, setShowUnsureCompass] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#242520] to-[#2E302B] border border-[#3A3B34] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#30312C] text-[#BDB2D6] border border-[#4A4A42]">
              Direction Discovery
            </span>
            <span className="text-xs text-[#A39F94]">Explore before committing</span>
          </div>
          <h2 className="text-xl font-black text-[#F5EFE4]">Explore Learning Pathways</h2>
          <p className="text-xs text-[#BDB5A7] mt-1 max-w-xl">
            Inspect what each domain involves, common projects, prerequisite difficulty, and starter challenges before setting your compass.
          </p>
        </div>

        <button
          onClick={() => setShowUnsureCompass(!showUnsureCompass)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-sm flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4 text-[#20211E]" />
          <span>{showUnsureCompass ? 'Show All Catalog' : '“I Don’t Know What I Want” Mode'}</span>
        </button>
      </div>

      {/* "I Don't Know What I Want" Wizard if toggled */}
      {showUnsureCompass && (
        <UnsureWizard
          onSelectDirection={(dir) => setSelectedDirection(dir)}
        />
      )}

      {/* Catalog of Directions */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39F94]">
          Featured Learning Directions
        </h3>

        <DepthGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {DISCOVERY_DIRECTIONS.map((dir) => (
            <DepthCard
              key={dir.id}
              id={dir.id}
              category={dir.category}
              title={dir.title}
              description={dir.tagline}
              status="RECOMMENDED"
              badge={
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8798B7]/16 text-[#A9B7D0] border border-[#8798B7]/50 font-mono">
                  {dir.difficulty.replace('_', ' ')}
                </span>
              }
              onClick={() => setSelectedDirection(dir)}
              ariaLabel={`${dir.title}, ${dir.category}, ${dir.difficulty}`}
              footerMeta={
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {dir.commonSkills.slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#30312C] text-[#A39F94] border border-[#4A4A42]"
                      >
                        {sk}
                      </span>
                    ))}
                    {dir.commonSkills.length > 4 && (
                      <span className="text-[10px] text-[#A39F94] self-center">
                        +{dir.commonSkills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#A9B7D0] font-semibold pt-1">
                    <span>Inspect Roadmap & Projects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              }
            />
          ))}
        </DepthGrid>
      </div>

      {/* Direction Detail Modal */}
      <DirectionDetailModal
        direction={selectedDirection}
        isOpen={!!selectedDirection}
        onClose={() => setSelectedDirection(null)}
      />
    </div>
  );
};
