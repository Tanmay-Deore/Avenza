import React, { useState } from 'react';
import { Button } from '../../design-system/Button';
import { calculateDirectionSuitability } from '../../services/discoveryEngine';
import { DiscoveryDirection } from '../../types';
import {
  Sparkles,
  Check,
  Compass,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const UnsureWizard: React.FC<{
  onSelectDirection: (dir: DiscoveryDirection) => void;
}> = ({ onSelectDirection }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Artificial Intelligence']);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(['Analytical Thinking']);
  const [workStyle, setWorkStyle] = useState<string>('building_visual');

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleStrength = (item: string) => {
    setSelectedStrengths((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const scoredDirections = calculateDirectionSuitability({
    interests: selectedInterests,
    strengths: selectedStrengths,
    curiosity: ['How systems work'],
    workStyle,
    enjoyedActivities: ['Building prototypes'],
  });

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/20 via-[#182234] to-[#121826] border border-purple-500/40 space-y-6 shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>“I Don't Know What I Want” Compass</span>
        </div>
        <h3 className="text-lg font-black text-gray-100">
          Discover Possibilities Tailored to Your Curiosity
        </h3>
        <p className="text-xs text-gray-300">
          No job titles or technical jargon required. Tell us what intrigues you, and we’ll match potential learning directions worth exploring.
        </p>
      </div>

      {/* 1. Interests */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
          1. What topics or activities spark your curiosity? (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'Artificial Intelligence & Smart Bots',
            'Building Websites & Interactive UIs',
            'Business Strategy & Finding Data Trends',
            'Puzzles, Privacy & Ethical Hacking',
            'Automating Tedious Tasks',
            'Designing Beautiful User Interfaces',
          ].map((item) => {
            const isSelected = selectedInterests.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleInterest(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-sm'
                    : 'bg-[#121826] border-[#26354D] text-gray-400 hover:text-gray-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Natural Strengths */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
          2. Which of these describe your natural thinking style?
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'Analytical Thinking & Math',
            'Visual & Aesthetic Intuition',
            'Systematic Investigation & Skepticism',
            'Logical Deduction & Clear Communication',
            'Curiosity & Fast Experimentation',
          ].map((item) => {
            const isSelected = selectedStrengths.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleStrength(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-950/80 border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-[#121826] border-[#26354D] text-gray-400 hover:text-gray-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results: Top Matched Directions */}
      <div className="space-y-3 pt-3 border-t border-[#26354D]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Matched Directions Worth Exploring
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoredDirections.slice(0, 2).map((dir) => (
            <div
              key={dir.id}
              className="p-4 rounded-xl bg-[#141C2B] border border-cyan-500/30 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    {dir.suitabilityScore}% Match
                  </span>
                  <span className="text-[11px] text-gray-400">{dir.difficulty}</span>
                </div>
                <h5 className="font-bold text-sm text-gray-100 mt-2">{dir.title}</h5>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {dir.tagline}
                </p>
              </div>

              <Button
                variant="glow"
                size="sm"
                className="w-full"
                onClick={() => onSelectDirection(dir)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Explore This Direction
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
