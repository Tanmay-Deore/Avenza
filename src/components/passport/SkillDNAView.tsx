import React, { useState, useRef } from 'react';
import { useAvenza } from '../../state/AppContext';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';
import { Fingerprint, Sparkles, ShieldCheck, Zap, Info } from 'lucide-react';

interface SkillDNAViewProps {
  onSkillSelect?: (skillId: string) => void;
}

export const SkillDNAView: React.FC<SkillDNAViewProps> = ({ onSkillSelect }) => {
  const { passport, skills, user } = useAvenza();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [pointerShift, setPointerShift] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Target core role
  const targetRole = user.currentGoal?.targetRoleOrSkill || 'AI Engineer';

  // Gather tracked skills from state & taxonomy
  const trackedSkillIds = Object.keys(skills);

  // Position nodes radially around the central capability core
  const radius = 130;
  const centerX = 200;
  const centerY = 170;

  const nodes = trackedSkillIds.map((id, index) => {
    const angle = (index / trackedSkillIds.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const skill = skills[id];
    const isVerified = (skill?.verifiedLevel || 0) > 0;
    const isRelated = selectedSkillId
      ? skill?.relatedSkills?.includes(selectedSkillId) ||
        skills[selectedSkillId]?.relatedSkills?.includes(id) ||
        id === selectedSkillId
      : true;

    return {
      id,
      name: skill?.name || SKILL_TAXONOMY[id]?.name || id,
      level: skill?.verifiedLevel || skill?.currentLevel || 0,
      isVerified,
      isRelated,
      x,
      y,
      category: skill?.category || 'General',
      confidence: skill?.confidence || 0,
    };
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const py = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setPointerShift({ x: px * 6, y: py * 6 });
  };

  const handlePointerLeave = () => {
    setPointerShift({ x: 0, y: 0 });
  };

  const selectedNode = nodes.find((n) => n.id === selectedSkillId);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#9BB59F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Skill DNA & Spatial Fingerprint
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40">
              Capability Fingerprint
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Spatial representation of verified competencies, active strands, and core engineering relationships
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#A39F94]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9BB59F] shadow-[0_0_8px_#9BB59F]" />
            <span className="text-[#F5EFE4]">Verified Node</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A4A42]" />
            <span>Unverified / Path Node</span>
          </span>
        </div>
      </div>

      {/* Interactive Spatial Fingerprint Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* DNA Canvas Area */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="lg:col-span-8 relative h-[360px] flex items-center justify-center rounded-xl bg-[#20211E] border border-[#3A3B34] overflow-hidden select-none"
        >
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,181,159,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* SVG Strand Network with Dynamic Perspective Shift */}
          <svg
            className="w-full h-full max-w-[440px] max-h-[350px] transition-transform duration-200 ease-out"
            viewBox="0 0 400 340"
            style={{
              transform: `translate3d(${pointerShift.x}px, ${pointerShift.y}px, 0px)`,
            }}
          >
            <defs>
              <linearGradient id="strandGradientVerified" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9BB59F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8798B7" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="strandGradientMuted" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A4A42" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3A3B34" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Concentric Guide Orbits */}
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#3A3B34" strokeDasharray="3 3" opacity="0.4" />
            <circle cx={centerX} cy={centerY} r={radius * 0.55} fill="none" stroke="#3A3B34" strokeDasharray="2 2" opacity="0.3" />

            {/* Radiating Strands from Central Core to Nodes */}
            {nodes.map((node) => {
              const isEmphasized = node.isRelated;
              return (
                <line
                  key={`line-core-${node.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={node.x}
                  y2={node.y}
                  stroke={
                    node.isVerified
                      ? 'url(#strandGradientVerified)'
                      : isEmphasized
                      ? '#57584E'
                      : '#30312C'
                  }
                  strokeWidth={node.isVerified ? 1.8 : 1}
                  strokeDasharray={node.isVerified ? 'none' : '4 3'}
                  opacity={isEmphasized ? 0.9 : 0.25}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Inter-Skill Relational Cross-Links */}
            {nodes.map((node, i) => {
              const nextNode = nodes[(i + 2) % nodes.length];
              return (
                <line
                  key={`link-${node.id}-${nextNode.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={nextNode.x}
                  y2={nextNode.y}
                  stroke="#4A4A42"
                  strokeWidth={0.75}
                  opacity={node.isRelated && nextNode.isRelated ? 0.4 : 0.1}
                />
              );
            })}

            {/* Central Capability Core */}
            <g
              transform={`translate(${centerX}, ${centerY})`}
              className="cursor-pointer"
              onClick={() => setSelectedSkillId(null)}
            >
              <circle r="36" fill="#242520" stroke="#57584E" strokeWidth="1.5" />
              <circle r="30" fill="#2E302B" stroke="#9BB59F" strokeWidth="1" strokeDasharray="4 2" />
              <text
                textAnchor="middle"
                dy="-6"
                fill="#9BB59F"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                CORE
              </text>
              <text
                textAnchor="middle"
                dy="8"
                fill="#F5EFE4"
                fontSize="10"
                fontWeight="bold"
              >
                {targetRole.slice(0, 11)}
              </text>
              <text
                textAnchor="middle"
                dy="20"
                fill="#A39F94"
                fontSize="8"
                fontFamily="monospace"
              >
                {passport.verifiedSkillsCount} Verified
              </text>
            </g>

            {/* Surrounding Skill Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedSkillId === node.id;
              const isEmphasized = node.isRelated;

              return (
                <g
                  key={`node-${node.id}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => {
                    setSelectedSkillId(node.id);
                    if (onSkillSelect) onSkillSelect(node.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Subtle Node Aura for Verified Skills */}
                  {node.isVerified && (
                    <circle
                      r="16"
                      fill="#9BB59F"
                      opacity="0.18"
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    r={node.isVerified ? 12 : 9}
                    fill={node.isVerified ? '#2E302B' : '#242520'}
                    stroke={
                      isSelected
                        ? '#F5EFE4'
                        : node.isVerified
                        ? '#9BB59F'
                        : isEmphasized
                        ? '#57584E'
                        : '#373832'
                    }
                    strokeWidth={isSelected ? 2.5 : node.isVerified ? 2 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Center Dot or Level */}
                  {node.isVerified ? (
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill="#B4CCB8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      L{node.level}
                    </text>
                  ) : (
                    <circle r="2.5" fill="#4A4A42" />
                  )}

                  {/* Node Label */}
                  <text
                    textAnchor="middle"
                    dy={node.y > centerY ? 22 : -18}
                    fill={node.isVerified ? '#F5EFE4' : isEmphasized ? '#BDB5A7' : '#64625A'}
                    fontSize="9"
                    fontWeight={node.isVerified ? 'bold' : 'normal'}
                    className="transition-all duration-200 pointer-events-none select-none"
                  >
                    {node.name.length > 15 ? `${node.name.slice(0, 13)}…` : node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom hint */}
          <div className="absolute bottom-2.5 inset-x-0 text-center">
            <span className="text-[10px] font-mono text-[#64625A]">
              • Select any node to illuminate capability strand •
            </span>
          </div>
        </div>

        {/* Selected Skill Strand Inspector Card */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-4">
          <div className="border-b border-[#3A3B34] pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94]">
                Strand Telemetry
              </span>
              {selectedNode?.isVerified ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#9BB59F]" />
                  Verified
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#30312C] text-[#A39F94] border border-[#4A4A42]">
                  Unverified
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-[#F5EFE4] mt-1.5">
              {selectedNode ? selectedNode.name : 'Target Capability Core'}
            </h4>
            <p className="text-[11px] text-[#A39F94] mt-0.5">
              {selectedNode ? selectedNode.category : targetRole}
            </p>
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#20211E] border border-[#3A3B34] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A39F94]">Attained Level:</span>
                  <span className="text-[#9BB59F] font-bold">Level {selectedNode.level}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A39F94]">Confidence Index:</span>
                  <span className="text-[#8798B7] font-bold">{selectedNode.confidence}%</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94] block mb-1.5">
                  Connected Taxonomy Strands
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills[selectedNode.id]?.relatedSkills?.map((relId) => (
                    <span
                      key={relId}
                      className="px-2 py-0.5 rounded bg-[#20211E] border border-[#3A3B34] text-[10px] font-mono text-[#BDB5A7]"
                    >
                      {SKILL_TAXONOMY[relId]?.name || relId}
                    </span>
                  )) || (
                    <span className="text-[11px] text-[#64625A]">Standard core foundation</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-[#BDB5A7] leading-relaxed">
              <p>
                The Skill DNA spatial fingerprint clusters your demonstrated competencies relative to your target role: <strong className="text-[#F5EFE4]">{targetRole}</strong>.
              </p>
              <p className="text-[11px] text-[#A39F94]">
                Click any surrounding node to view its verification status, confidence score, and prerequisite connections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
