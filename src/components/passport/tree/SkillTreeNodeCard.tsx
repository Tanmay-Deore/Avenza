import React, { useState, useRef, useCallback } from 'react';
import { TreeSkillNode } from './treeModel';
import {
  CheckCircle2,
  Lock,
  Target,
  FileText,
} from 'lucide-react';

interface SkillTreeNodeCardProps {
  skill: TreeSkillNode;
  isSelected: boolean;
  isPathActive: boolean;
  isRippling: boolean;
  isBlooming: boolean;
  revealReady: boolean;
  staggerIndex: number;
  prefersReducedMotion: boolean;
  onClick: () => void;
}

export const SkillTreeNodeCard: React.FC<SkillTreeNodeCardProps> = ({
  skill,
  isSelected,
  isPathActive,
  isRippling,
  isBlooming,
  revealReady,
  staggerIndex,
  prefersReducedMotion,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Local Pointer Tilt Physics State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Strict 3.5 degrees max rotation
      const rY = ((x - centerX) / centerX) * 3.5;
      const rX = -((y - centerY) / centerY) * 3.0;

      setRotateX(rX);
      setRotateY(rY);
      setLightPos({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100),
      });
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    setRotateX(0);
    setRotateY(0);
  }, []);

  // Determine visual styling by semantic status
  let borderClass = 'border-[#3A3B34]';
  let bgClass = 'bg-[#20211E]';
  let statusBadge = (
    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#282923] text-[#A39F94] border border-[#3A3B34]">
      Available
    </span>
  );

  if (skill.verified) {
    borderClass = 'border-[#9BB59F]/60';
    bgClass = 'bg-[#262822]';
    statusBadge = (
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 flex items-center gap-1 font-bold">
        <CheckCircle2 className="w-2.5 h-2.5 text-[#9BB59F]" />
        Verified L{skill.level}
      </span>
    );
  } else if (skill.status === 'NEXT_UNLOCK') {
    borderClass = 'border-[#D1B46A]/80 ring-1 ring-[#D1B46A]/40';
    bgClass = 'bg-[#292820]';
    statusBadge = (
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[rgba(209,180,106,0.2)] text-[#E0C77F] border border-[#D1B46A]/50 flex items-center gap-1 font-bold">
        <Target className="w-2.5 h-2.5 text-[#D1B46A]" />
        Next Unlock
      </span>
    );
  } else if (skill.status === 'LOCKED') {
    borderClass = 'border-[#3A3B34] opacity-60';
    bgClass = 'bg-[#1C1D1A]';
    statusBadge = (
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#242520] text-[#64625A] border border-[#30312C] flex items-center gap-1">
        <Lock className="w-2.5 h-2.5" />
        Locked
      </span>
    );
  } else if (skill.status === 'IN_PROGRESS') {
    borderClass = 'border-[#8798B7]/60';
    bgClass = 'bg-[#222421]';
    statusBadge = (
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[rgba(135,152,183,0.16)] text-[#A9B7D0] border border-[#8798B7]/40 font-bold">
        Level {skill.level}
      </span>
    );
  }

  // Active / Selected highlight overrides
  if (isSelected) {
    borderClass = 'border-[#9BB59F] ring-2 ring-[#9BB59F]/80 shadow-[0_8px_20px_rgba(0,0,0,0.55)]';
  } else if (isPathActive) {
    borderClass = 'border-[#8798B7]/80 ring-1 ring-[#8798B7]/50 shadow-md';
  }

  return (
    <div
      style={{ perspective: 800 }}
      className="relative select-none"
    >
      <div
        ref={cardRef}
        tabIndex={0}
        role="button"
        aria-label={`${skill.name}, Level ${skill.level} of ${skill.maxLevel}, ${skill.status}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : revealReady
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${
                isPressed ? '1px' : isHovered ? '-4px' : '0px'
              }) scale(${isPressed ? 0.988 : isSelected ? 1.025 : 1})`
            : 'scale(0.85) translateY(8px)',
          opacity: revealReady ? (isSelected || isPathActive ? 1 : 0.65) : 0,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.1s cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out',
          transitionDelay: `${staggerIndex * 50}ms`,
        }}
        className={`relative p-3.5 rounded-xl border cursor-pointer transition-colors duration-200 group overflow-hidden ${borderClass} ${bgClass} ${
          isRippling ? 'ring-2 ring-[#9BB59F] shadow-[0_0_14px_rgba(155,181,159,0.5)]' : ''
        }`}
      >
        {/* Pointer Specular Soft Light Sweep */}
        {isHovered && !prefersReducedMotion && (
          <div
            style={{
              background: `radial-gradient(circle 180px at ${lightPos.x}% ${lightPos.y}%, rgba(245, 239, 228, 0.08), transparent 70%)`,
            }}
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-10"
          />
        )}

        {/* Skill Bloom Outer Wave */}
        {isBlooming && !prefersReducedMotion && (
          <span className="absolute -inset-[3px] rounded-xl bg-[#9BB59F]/35 blur-sm pointer-events-none animate-ping" />
        )}

        {/* Relationship Ripple Ping */}
        {isRippling && !prefersReducedMotion && (
          <span className="absolute inset-0 rounded-xl bg-[#9BB59F]/15 pointer-events-none animate-pulse" />
        )}

        {/* Layer 1: Internal Parallax Header (Title & Status) */}
        <div
          style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(6px)' }}
          className="flex items-center justify-between gap-2 mb-2"
        >
          <h5 className="font-bold text-xs text-[#F5EFE4] group-hover:text-[#B4CCB8] transition-colors truncate">
            {skill.name}
          </h5>
          <div style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(8px)' }}>
            {statusBadge}
          </div>
        </div>

        {/* Layer 2: Level Progress Metric & ScaleX Bar */}
        <div
          style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(4px)' }}
          className="space-y-1.5 pt-0.5"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-[#A39F94]">
            <span>Level {skill.level} of {skill.maxLevel}</span>
            {skill.evidenceCount > 0 && (
              <span className="text-[#9BB59F] flex items-center gap-1 font-medium">
                <FileText className="w-2.5 h-2.5" />
                <span>{skill.evidenceCount} proof</span>
              </span>
            )}
          </div>

          {/* ScaleX Progress Fill (Transform-only, NO width animation) */}
          <div className="w-full h-1.5 bg-[#171815] rounded-full overflow-hidden">
            <div
              style={{
                transform: `scaleX(${Math.max(0.08, skill.level / skill.maxLevel)})`,
                transformOrigin: 'left center',
                transition: prefersReducedMotion ? 'none' : 'transform 0.4s ease-out',
              }}
              className={`h-full rounded-full ${
                skill.verified
                  ? 'bg-gradient-to-r from-[#8798B7] to-[#9BB59F]'
                  : skill.level > 0
                  ? 'bg-[#8798B7]'
                  : 'bg-[#4A4A42]'
              }`}
            />
          </div>
        </div>

        {/* Layer 3: Contextual Connector Cue */}
        <div
          style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(2px)' }}
          className="mt-2.5 pt-1.5 border-t border-[#3A3B34]/60 flex items-center justify-between text-[9px] font-mono text-[#64625A]"
        >
          <span className={isSelected ? 'text-[#9BB59F] font-bold' : ''}>
            {isSelected ? 'ACTIVE FOCUS' : isPathActive ? 'CONNECTED PATHWAY' : 'Click to inspect'}
          </span>
          <span className="group-hover:text-[#F5EFE4] group-hover:translate-x-0.5 transition-all">
            {isSelected ? '●' : '→'}
          </span>
        </div>
      </div>
    </div>
  );
};
