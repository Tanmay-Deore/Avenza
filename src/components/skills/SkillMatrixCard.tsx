import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Skill } from '../../types';
import { useDepthGridContext } from '../../visual/depth-engine/DepthGrid';
import {
  CheckCircle2,
  CircleDashed,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export interface SkillMatrixCardProps {
  skill: Skill;
  onSelect?: () => void;
  className?: string;
}

/**
 * SkillMatrixCard: Tactile 3D Digital Learning Object
 * 
 * Architecture (Section 32):
 * GRID CELL (owned by CSS Grid, 100% frozen layout flow)
 *   ↓
 * CARD WRAPPER (local perspective: 950px, isolation: isolate)
 *   ↓
 * CARD VISUAL (transform-origin: center center, transform-style: preserve-3d)
 * 
 * Strict Scope Lock:
 * Applies ONLY to Skill Matrix cards.
 * Typography: Manrope (primary/content) + IBM Plex Mono (technical metadata).
 * Motion: Learning Lens 3D, max ±4° tilt (clamped to 6°), 5.5px lift, tactile press 0.988.
 */
export const SkillMatrixCard: React.FC<SkillMatrixCardProps> = ({
  skill,
  onSelect,
  className = '',
}) => {
  const visualRef = useRef<HTMLDivElement>(null);
  const gridContext = useDepthGridContext();

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isSignalActive, setIsSignalActive] = useState(false);
  const [isBadgePulsing, setIsBadgePulsing] = useState(false);

  const signalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const badgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCoarseRef = useRef(false);

  useEffect(() => {
    isCoarseRef.current =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

    return () => {
      if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
    };
  }, []);

  const isSelected = gridContext?.activeSelectedId === skill.id;
  const isHot = isHovered || isFocused;

  // Status mapping
  const isVerified = skill.verifiedLevel > 0 || skill.status === 'VERIFIED';
  const isCriticalGap = skill.status === 'WEAK';
  const isRecommended = skill.status === 'RECOMMENDED';
  const isInProgress = skill.status === 'LEARNING';

  // Palette accents (Section 25)
  const statusAccent = isVerified
    ? '#9BB59F' // sage
    : isInProgress
    ? '#8798B7' // dusty blue
    : isRecommended
    ? '#A79BC4' // lavender
    : isCriticalGap
    ? '#C6927D' // clay
    : '#A8A498'; // warm neutral

  const statusPulseColor = isVerified
    ? 'rgba(155, 181, 159, 0.45)'
    : isInProgress
    ? 'rgba(135, 152, 183, 0.45)'
    : isRecommended
    ? 'rgba(167, 155, 196, 0.45)'
    : isCriticalGap
    ? 'rgba(198, 146, 125, 0.45)'
    : 'rgba(168, 164, 152, 0.3)';

  // Status badge config with Manrope typography
  const getBadgeConfig = () => {
    if (isVerified) {
      return {
        label: 'Verified Skill',
        bg: 'bg-[#9BB59F]/16',
        border: 'border-[#9BB59F]/50',
        text: 'text-[#B4CCB8]',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#9BB59F]" />,
      };
    }
    if (isInProgress) {
      return {
        label: 'In Progress',
        bg: 'bg-[#8798B7]/16',
        border: 'border-[#8798B7]/50',
        text: 'text-[#A9B7D0]',
        icon: <BookOpen className="w-3.5 h-3.5 text-[#8798B7]" />,
      };
    }
    if (isCriticalGap) {
      return {
        label: 'Critical Gap',
        bg: 'bg-[#C6927D]/16',
        border: 'border-[#C6927D]/50',
        text: 'text-[#E3A28E]',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-[#C6927D]" />,
      };
    }
    if (isRecommended) {
      return {
        label: 'Recommended Next',
        bg: 'bg-[#A79BC4]/16',
        border: 'border-[#A79BC4]/50',
        text: 'text-[#BDB2D6]',
        icon: <Sparkles className="w-3.5 h-3.5 text-[#A79BC4]" />,
      };
    }
    return {
      label: 'Not Started',
      bg: 'bg-[#77776E]/18',
      border: 'border-[#77776E]/50',
      text: 'text-[#A8A498]',
      icon: <CircleDashed className="w-3.5 h-3.5 text-[#77776E]" />,
    };
  };

  const badgeConfig = getBadgeConfig();

  // Pointer Enter
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    setIsSignalActive(true);
    setIsBadgePulsing(true);
    gridContext?.setCardHover(skill.id);

    // Auto-reset single-run animations after completion
    if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
    signalTimerRef.current = setTimeout(() => {
      setIsSignalActive(false);
    }, 850);

    if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
    badgeTimerRef.current = setTimeout(() => {
      setIsBadgePulsing(false);
    }, 700);

    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease';
    }
  }, [gridContext, skill.id]);

  // Pointer Move (Learning Lens 3D tilt + directional light)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isCoarseRef.current || !visualRef.current) return;

      const rect = visualRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Normalized coordinates (-1 to +1 from center)
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      const clampedX = Math.max(-0.5, Math.min(0.5, relX)) * 2;
      const clampedY = Math.max(-0.5, Math.min(0.5, relY)) * 2;

      // Section 10: Maximum tilt approx ±4° (absolute max 6°)
      const maxTilt = 4.0;
      const rotX = -clampedY * maxTilt;
      const rotY = clampedX * maxTilt;

      // Section 11: 4-7px visual lift
      const liftY = isPressed ? -2 : -5.5;
      const liftZ = isPressed ? 2 : 8;
      const scale = isPressed ? 0.988 : 1.008;

      // Direct CSS property updates (NO React re-renders)
      visualRef.current.style.setProperty('--px', clampedX.toFixed(3));
      visualRef.current.style.setProperty('--py', clampedY.toFixed(3));
      visualRef.current.style.setProperty(
        '--foil-x',
        `${Math.round((clampedX * 0.5 + 0.5) * 100)}%`
      );
      visualRef.current.style.setProperty(
        '--foil-y',
        `${Math.round((clampedY * 0.5 + 0.5) * 100)}%`
      );

      visualRef.current.style.transform = `translate3d(0px, ${liftY}px, ${liftZ}px) rotateX(${rotX.toFixed(
        2
      )}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale})`;
    },
    [isPressed]
  );

  // Pointer Leave: smooth reset to exact neutral position (Section 23)
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    setIsSignalActive(false);
    setIsBadgePulsing(false);
    gridContext?.setCardHover(null);

    if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
    if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);

    if (visualRef.current) {
      visualRef.current.style.setProperty('--px', '0');
      visualRef.current.style.setProperty('--py', '0');
      visualRef.current.style.setProperty('--foil-x', '50%');
      visualRef.current.style.setProperty('--foil-y', '50%');

      // Calibrated easing curve for smooth return (Section 23 & 29)
      visualRef.current.style.transition =
        'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease';

      visualRef.current.style.transform = isSelected
        ? 'translate3d(0px, -4px, 6px) rotateX(0deg) rotateY(0deg) scale(1.012)'
        : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, [gridContext, isSelected]);

  // Pointer Down (Section 21: Tactile compression 0.985–0.99)
  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.12s ease-out, box-shadow 0.15s ease';
      visualRef.current.style.transform =
        'translate3d(0px, -2px, 2px) rotateX(0deg) rotateY(0deg) scale(0.988)';
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Card Click / Selection
  const handleClick = useCallback(() => {
    gridContext?.setCardSelect(skill.id, !isSelected);
    if (onSelect) onSelect();
  }, [gridContext, skill.id, isSelected, onSelect]);

  // Keyboard navigation
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    gridContext?.setCardFocus(skill.id);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.25s ease-out, box-shadow 0.25s ease';
      visualRef.current.style.transform =
        'translate3d(0px, -5.5px, 8px) rotateX(0deg) rotateY(0deg) scale(1.008)';
    }
  }, [gridContext, skill.id]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    gridContext?.setCardFocus(null);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
      visualRef.current.style.transform = isSelected
        ? 'translate3d(0px, -4px, 6px) rotateX(0deg) rotateY(0deg) scale(1.012)'
        : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, [gridContext, isSelected]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // Dynamic progress segments matching target level (Section 03 & 19)
  const targetLevel = Math.max(1, skill.requiredLevel || 3);
  const activeLevel = isVerified ? skill.verifiedLevel : skill.currentLevel;
  const segments = Array.from({ length: targetLevel }, (_, i) => i + 1);

  return (
    /* 
      1. GRID CELL:
      Stable layout participant in CSS Grid.
      NEVER changes size, margin, padding or position.
    */
    <div
      className={`depth-card-cell relative w-full h-full min-h-[220px] ${className}`}
      data-skill-id={skill.id}
    >
      {/* 
        2. CARD WRAPPER:
        Isolates 3D space with local perspective: 950px.
        Protects the layout from any perspective distortion.
      */}
      <div
        className="depth-card-wrapper relative w-full h-full"
        style={{
          perspective: '950px',
        }}
      >
        {/* 
          3. CARD VISUAL:
          Pure 3D surface. Transforms, tilts, lifts, compresses.
        */}
        <div
          ref={visualRef}
          role="button"
          tabIndex={0}
          aria-label={`${skill.name}, ${skill.category}, ${badgeConfig.label}, Level ${activeLevel} of required ${targetLevel}`}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="depth-card-visual relative w-full h-full rounded-2xl cursor-pointer outline-none select-none flex flex-col justify-between"
          style={{
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            transform: isSelected
              ? 'translate3d(0px, -4px, 6px) rotateX(0deg) rotateY(0deg) scale(1.012)'
              : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)',
            willChange: isHot ? 'transform' : 'auto',
            zIndex: isHot || isSelected ? 10 : 1,
            // @ts-ignore
            '--signal-glow': statusAccent,
          }}
        >
          {/* Subtle Elevation Shadow Plane (Section 28) */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            style={{
              transform: 'translateZ(-12px)',
              boxShadow: isHot
                ? '0 18px 36px -6px rgba(18, 19, 15, 0.52), 0 6px 14px -2px rgba(18, 19, 15, 0.32)'
                : isSelected
                ? '0 14px 28px -4px rgba(18, 19, 15, 0.45)'
                : '0 4px 14px -2px rgba(18, 19, 15, 0.35), 0 2px 6px -1px rgba(18, 19, 15, 0.20)',
            }}
            aria-hidden="true"
          />

          {/* Charcoal Surface & Edge Highlight (Section 16, 26, 27) */}
          <div
            className={`relative w-full h-full rounded-2xl p-5 sm:p-6 transition-colors duration-300 overflow-hidden border flex flex-col justify-between ${
              isSelected
                ? 'bg-[#30312C] border-[#8798B7]'
                : isHot
                ? 'bg-[#2E302B] border-[#5E6056]'
                : 'bg-[#282923] border-[#4A4A42]'
            }`}
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255, 245, 225, 0.08)',
            }}
          >
            {/* Directional Learning Lens Spotlight (Section 14 & 15) */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHot ? 1 : 0,
                background: `radial-gradient(circle 240px at var(--foil-x, 50%) var(--foil-y, 50%), rgba(255, 245, 225, 0.075) 0%, rgba(135, 152, 183, 0.035) 45%, transparent 75%)`,
              }}
              aria-hidden="true"
            />

            {/* Edge Catching Gleam (Section 16) */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHot ? 1 : 0,
                background: `radial-gradient(circle 320px at var(--foil-x, 50%) var(--foil-y, 50%), rgba(255, 245, 225, 0.14) 0%, transparent 65%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '1px',
              }}
              aria-hidden="true"
            />

            {/* Critical Gap Subtle Ambient Edge-Light (pauses on hover) */}
            {isCriticalGap && (
              <div
                className="absolute inset-0 rounded-2xl border border-[#C6927D] pointer-events-none transition-opacity duration-700"
                style={{
                  animation: isHot ? 'none' : 'clayPulse 4.6s ease-in-out infinite',
                  opacity: isHot ? 0.7 : 0.35,
                }}
                aria-hidden="true"
              />
            )}

            {/* 
              TOP LAYER:
              - Category (IBM Plex Mono 500)
              - Skill Signal (Section 17: Signature micro-interaction)
              - Status Badge (Manrope 600, Section 18: single subtle pulse)
            */}
            <div
              className="relative z-10 flex items-start justify-between gap-3 pb-2.5"
              style={{
                transform: isHot ? 'translateZ(14px)' : 'translateZ(0px)',
                transition: 'transform 0.25s ease',
              }}
            >
              <div className="flex flex-col gap-1.5">
                {/* Category in IBM Plex Mono 500, small uppercase (Section 04) */}
                <span
                  className="font-skill-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#A39F94]"
                  style={{
                    transform: isHot
                      ? 'translate3d(calc(var(--px, 0) * 0.8px), calc(var(--py, 0) * 0.6px), 0)'
                      : 'none',
                    transition: 'transform 0.2s ease-out',
                  }}
                >
                  {skill.category}
                </span>

                {/* 
                  SIGNATURE SKILL SIGNAL (Section 17):
                  • ─────────→
                  Appears on pointer enter, travels once along internal track,
                  reaches title direction, and gracefully fades out.
                */}
                <div
                  className="relative w-24 h-2 overflow-hidden pointer-events-none"
                  aria-hidden="true"
                >
                  {/* Subtle resting track */}
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#4A4A42]/45 -translate-y-1/2" />

                  {/* Signal node (one-shot per hover) */}
                  {isSignalActive && (
                    <div
                      className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                      style={{
                        backgroundColor: statusAccent,
                        animation: 'skillSignalGlide 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* 
                Status Badge (Section 18 & 04):
                Manrope 600 font, subtle one-shot pulse on hover
              */}
              <div
                className="transition-transform duration-300"
                style={{
                  animation: isBadgePulsing ? 'statusPulse 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) 1' : 'none',
                  // @ts-ignore
                  '--pulse-color': statusPulseColor,
                  transform: isHot
                    ? 'translate3d(calc(var(--px, 0) * 0.7px), calc(var(--py, 0) * 0.5px), 0)'
                    : 'none',
                }}
              >
                <span
                  className={`inline-flex items-center font-skill-primary font-semibold text-[11px] rounded-full border backdrop-blur-sm tracking-wide px-2.5 py-0.5 gap-1.5 ${badgeConfig.bg} ${badgeConfig.border} ${badgeConfig.text}`}
                >
                  {badgeConfig.icon}
                  <span>{badgeConfig.label}</span>
                </span>
              </div>
            </div>

            {/* 
              MIDDLE LAYER:
              - Skill Title (Manrope 700, dominant content, Section 04, 05, 20)
              - Description (Manrope 450-500, readable, Section 04, 05)
            */}
            <div className="relative z-10 space-y-1.5 flex-1 py-1">
              <h3
                className={`font-skill-primary font-bold text-base leading-snug tracking-tight transition-colors duration-200 ${
                  isHot ? 'text-[#FFF9EE]' : 'text-[#F5EFE4]'
                }`}
                style={{
                  transform: isHot
                    ? 'translate3d(calc(var(--px, 0) * 1.3px), calc(var(--py, 0) * 1.0px - 1px), 18px)'
                    : 'translate3d(0, 0, 0)',
                  transition: 'transform 0.2s ease-out, color 0.2s ease',
                }}
              >
                {skill.name}
              </h3>

              {skill.description && (
                <p
                  className="font-skill-primary font-normal text-xs text-[#BDB5A7] line-clamp-2 leading-relaxed"
                  style={{
                    transform: isHot
                      ? 'translate3d(calc(var(--px, 0) * 0.7px), calc(var(--py, 0) * 0.5px), 12px)'
                      : 'translate3d(0, 0, 0)',
                    transition: 'transform 0.2s ease-out',
                  }}
                >
                  {skill.description}
                </p>
              )}
            </div>

            {/* 
              BOTTOM LAYER:
              - Level Metadata & Progress Track (Section 03, 04, 19)
              - Target & View Level Specs Action Link (Section 04)
            */}
            <div
              className="relative z-10 pt-3.5 border-t border-[#4A4A42] space-y-2 mt-3"
              style={{
                transform: isHot ? 'translateZ(10px)' : 'translateZ(0px)',
                transition: 'transform 0.25s ease',
              }}
            >
              {/* Level Information Row */}
              <div
                className="flex justify-between items-center text-xs"
                style={{
                  transform: isHot
                    ? 'translate3d(calc(var(--px, 0) * 0.5px), calc(var(--py, 0) * 0.4px), 0)'
                    : 'none',
                }}
              >
                <span className="font-skill-mono text-[10.5px] font-medium text-[#A39F94]">
                  {isVerified ? 'Verified Level:' : 'Current Level:'}
                </span>
                <span
                  className={`font-skill-primary font-bold text-xs ${
                    isVerified
                      ? 'text-[#B4CCB8]'
                      : isInProgress
                      ? 'text-[#A9B7D0]'
                      : 'text-[#A8A498]'
                  }`}
                >
                  Level {activeLevel} / {targetLevel}
                </span>
              </div>

              {/* 
                Segmented Progress Indicator:
                Number of segments dynamically matches required target level.
                Hover effect (Section 19): subtle gleam sweeps through completed segments.
              */}
              <div className="flex gap-1.5 pt-0.5 w-full">
                {segments.map((lvl) => {
                  const isCompleted = lvl <= activeLevel;
                  const isFilledVerified = lvl <= skill.verifiedLevel;

                  return (
                    <div
                      key={lvl}
                      className={`h-1.5 rounded-full flex-1 relative overflow-hidden transition-colors ${
                        isCompleted
                          ? isFilledVerified
                            ? 'bg-[#9BB59F]'
                            : 'bg-[#8798B7]'
                          : 'bg-[#45463F]'
                      }`}
                    >
                      {/* Section 19: Subtle highlight sweeps across already completed segments */}
                      {isHot && isCompleted && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                          style={{
                            animation:
                              'progressSegmentGleam 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Target & Action Link */}
              <div
                className="flex justify-between items-center text-[11px] pt-1"
                style={{
                  transform: isHot
                    ? 'translate3d(calc(var(--px, 0) * 0.4px), calc(var(--py, 0) * 0.3px), 0)'
                    : 'none',
                }}
              >
                <span className="font-skill-primary text-[11px] font-medium text-[#A39F94]">
                  Target: Lvl {targetLevel}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelect) onSelect();
                  }}
                  className="font-skill-primary font-semibold text-[11px] text-[#A9B7D0] hover:text-[#C5D5F0] hover:underline transition-colors focus:outline-none"
                >
                  View Level Specs →
                </button>
              </div>
            </div>
          </div>

          {/* Visible Focus Ring for Keyboard Accessibility (Section 37) */}
          {isFocused && (
            <div
              className="absolute -inset-1 rounded-[18px] border-2 border-[#AFC0E0] pointer-events-none shadow-sm shadow-[#AFC0E0]/30"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
