import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { DiscoveryDirection } from '../../types';
import { STANDARD_GOALS } from '../../services/skillTaxonomy';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Zap,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const DirectionDetailModal: React.FC<{
  direction: DiscoveryDirection | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ direction, isOpen, onClose }) => {
  const { setUserGoal, setActiveTab } = useAvenza();

  if (!direction) return null;

  const handleCommitToPath = () => {
    // Match corresponding standard goal or create tailored goal
    const matchedGoal =
      STANDARD_GOALS.find((g) => g.title.toLowerCase().includes(direction.category.toLowerCase())) ||
      STANDARD_GOALS[0];

    setUserGoal(matchedGoal);
    onClose();
    setActiveTab('journey');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-100">{direction.title}</h3>
            <span className="text-xs text-gray-400 font-normal">{direction.tagline}</span>
          </div>
        </div>
      }
      size="xl"
      className="border border-[#26354D] bg-[#121826]"
    >
      <div className="space-y-6">
        {/* Overview & Difficulty */}
        <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Difficulty & Prerequisites
            </span>
            <div className="text-xs text-cyan-300 font-semibold mt-1">
              {direction.learningDifficultyText}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Prerequisites: {direction.prerequisites.join(', ')}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Suggested Starting Sequence
            </span>
            <div className="text-xs text-gray-200 font-semibold mt-1">
              {direction.suggestedStartingPoint}
            </div>
          </div>
        </div>

        {/* What this direction involves */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            What This Direction Involves
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">{direction.description}</p>
        </div>

        {/* Common Skills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Core Skills Developed
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {direction.commonSkills.map((sk) => (
              <span
                key={sk}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#182234] text-gray-200 border border-[#26354D]"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Example Projects */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Real-World Projects You Will Build
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {direction.exampleProjects.map((p) => (
              <div
                key={p.title}
                className="p-3 rounded-lg bg-[#141C2B] border border-[#26354D] space-y-1"
              >
                <div className="text-xs font-bold text-gray-200">{p.title}</div>
                <div className="text-[11px] text-gray-400 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Exploration Activity */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{direction.starterChallenge.title}</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {direction.starterChallenge.scenario}
          </p>
          <div className="p-2.5 rounded-lg bg-[#0B0F17]/80 text-xs text-cyan-300 font-mono border border-[#26354D]">
            {direction.starterChallenge.sampleTask}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="glow"
            className="flex-1"
            onClick={handleCommitToPath}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Choose & Generate Path for this Direction
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Explore Other Directions
          </Button>
        </div>
      </div>
    </Modal>
  );
};
