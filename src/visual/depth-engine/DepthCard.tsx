import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDepthGridContext } from './DepthGrid';
import { LevelLadder } from './LevelLadder';

export interface DepthCardProps {
  id: string;
  category?: string;
  title: string;
  description?: string;
  currentLevel?: number;
  targetLevel?: number;
  verifiedLevel?: number;
  status?:
    | 'VERIFIED'
    | 'IN_PROGRESS'
    | 'LEARNING'
    | 'CRITICAL_GAP'
    | 'WEAK'
    | 'RECOMMENDED'
    | 'NOT_STARTED'
    | 'UNVERIFIED'
    | string;
  badge?: React.ReactNode;
  footerMeta?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * DepthCard: 3D Tactile Digital Study Object
 *
 * Architecture:
 * GRID CELL (owned by CSS Grid, 100% stable layout flow)
 *   ↓
 * CARD WRAPPER (local perspective: 900px, isolation: isolate)
 *   ↓
 * CARD VISUAL (transform-origin: center center, 3D tilt 4-6deg, lift 6px, press 0.988)
 */
export const DepthCard: React.FC<DepthCardProps> = ({
  id,
  category,
  title,
  description,
  currentLevel,
  targetLevel,
  verifiedLevel,
  status = 'NOT_STARTED',
  badge,
  footerMeta,
  children,
  onClick,
  className = '',
  ariaLabel,
}) => {
  const visualRef = useRef<HTMLDivElement>(null);
  const gridContext = useDepthGridContext();

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isSignalActive, setIsSignalActive] = useState(false);
  const [isBadgePulsing, setIsBadgePulsing] = useState(false);

  const isCoarseRef = useRef(false);

  useEffect(() => {
    isCoarseRef.current =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
  }, []);

  const isSelected = gridContext?.activeSelectedId === id;
  const isHot = isHovered || isFocused;

  // Status accent mapping
  const isVerified = status === 'VERIFIED' || (verifiedLevel !== undefined && verifiedLevel > 0);
  const isCriticalGap = status === 'CRITICAL_GAP' || status === 'WEAK' || status === 'NEEDS_ATTENTION';
  const isRecommended = status === 'RECOMMENDED';
  const isInProgress = status === 'IN_PROGRESS' || status === 'LEARNING' || status === 'ACTIVE';

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

  // Handle pointer enter
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    setIsSignalActive(true);
    setIsBadgePulsing(true);
    gridContext?.setCardHover(id);

    if (visualRef.current) {
      visualRef.current.style.transition = 'transform 0.18s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';
    }
  }, [gridContext, id]);

  // Handle pointer move: smooth normalized tilt around center
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isCoarseRef.current || !visualRef.current) return;

    const rect = visualRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Relative coordinates (-0.5 to +0.5) from center
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    const clampedX = Math.max(-0.5, Math.min(0.5, relX)) * 2; // -1 to +1
    const clampedY = Math.max(-0.5, Math.min(0.5, relY)) * 2; // -1 to +1

    // Maximum 5 degrees rotation (controlled, physical, no flying cards)
    const maxTilt = 5;
    const rotX = -clampedY * maxTilt;
    const rotY = clampedX * maxTilt;

    const liftY = isPressed ? -2 : -6;
    const liftZ = isPressed ? 2 : 8;
    const scale = isPressed ? 0.988 : 1.01;

    visualRef.current.style.setProperty('--pointer-x', clampedX.toFixed(3));
    visualRef.current.style.setProperty('--pointer-y', clampedY.toFixed(3));
    visualRef.current.style.setProperty('--foil-x', `${Math.round((clampedX * 0.5 + 0.5) * 100)}%`);
    visualRef.current.style.setProperty('--foil-y', `${Math.round((clampedY * 0.5 + 0.5) * 100)}%`);

    visualRef.current.style.transform = `translate3d(0px, ${liftY}px, ${liftZ}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale})`;
  }, [isPressed]);

  // Handle pointer leave: smooth reset to exact neutral position (0, 0, 0, 0, 0, 1)
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    setIsSignalActive(false);
    setIsBadgePulsing(false);
    gridContext?.setCardHover(null);

    if (visualRef.current) {
      visualRef.current.style.setProperty('--pointer-x', '0');
      visualRef.current.style.setProperty('--pointer-y', '0');
      visualRef.current.style.setProperty('--foil-x', '50%');
      visualRef.current.style.setProperty('--foil-y', '50%');

      // Smooth reset transition
      visualRef.current.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease';

      visualRef.current.style.transform = isSelected
        ? 'translate3d(0px, -4px, 6px) rotateX(0deg) rotateY(0deg) scale(1.012)'
        : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, [gridContext, isSelected]);

  // Handle pointer down (press)
  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
    if (visualRef.current) {
      visualRef.current.style.transition = 'transform 0.12s ease-out, box-shadow 0.15s ease';
      visualRef.current.style.transform = 'translate3d(0px, -2px, 2px) rotateX(0deg) rotateY(0deg) scale(0.988)';
    }
  }, []);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Handle click / select
  const handleClick = useCallback(() => {
    gridContext?.setCardSelect(id, !isSelected);
    if (onClick) onClick();
  }, [gridContext, id, isSelected, onClick]);

  // Handle keyboard focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    gridContext?.setCardFocus(id);
    if (visualRef.current) {
      visualRef.current.style.transition = 'transform 0.25s ease-out, box-shadow 0.25s ease';
      visualRef.current.style.transform = 'translate3d(0px, -6px, 8px) rotateX(0deg) rotateY(0deg) scale(1.01)';
    }
  }, [gridContext, id]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    gridContext?.setCardFocus(null);
    if (visualRef.current) {
      visualRef.current.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
      visualRef.current.style.transform = isSelected
        ? 'translate3d(0px, -4px, 6px) rotateX(0deg) rotateY(0deg) scale(1.012)'
        : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, [gridContext, isSelected]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      gridContext?.setCardSelect(id, !isSelected);
      if (onClick) onClick();
    }
  }, [gridContext, id, isSelected, onClick]);

  const defaultAria =
    ariaLabel || `${title}, ${category || 'Skill'}, ${status}, Level ${currentLevel ?? 0} of target ${targetLevel ?? 5}`;

  return (
    /* 
      1. GRID CELL / WRAPPER:
      Owns grid cell positioning, baseline alignment, and local perspective.
      This element NEVER transforms or moves, ensuring the CSS Grid layout stays 100% rock-solid.
    */
    <div
      className={`depth-card-wrapper relative w-full h-full ${className}`}
      style={{
        perspective: '900px',
      }}
    >
      {/* 
        2. CARD VISUAL / CONTENT:
        Owns 3D tilt, lift, press compression, foil highlight, and shadow.
        Rotates strictly around center center.
      */}
      <div
        ref={visualRef}
        role="button"
        tabIndex={0}
        aria-label={defaultAria}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="depth-card-visual relative w-full h-full rounded-2xl cursor-pointer outline-none select-none transition-shadow duration-300 flex flex-col justify-between"
        style={{
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          transform: isSelected
            ? 'translate3d(0px, -4px, 6px) rotateX(0deg) rotateY(0deg) scale(1.012)'
            : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)',
          willChange: isHot ? 'transform' : 'auto',
          zIndex: isHot || isSelected ? 10 : 1,
        }}
      >
        {/* Soft Elevation Shadow Plane */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            transform: 'translateZ(-12px)',
            boxShadow: isHot
              ? '0 18px 36px -6px rgba(18, 19, 15, 0.5), 0 6px 14px -2px rgba(18, 19, 15, 0.3)'
              : isSelected
              ? '0 14px 28px -4px rgba(18, 19, 15, 0.45)'
              : '0 4px 14px -2px rgba(18, 19, 15, 0.35), 0 2px 6px -1px rgba(18, 19, 15, 0.2)',
          }}
          aria-hidden="true"
        />

        {/* Card Charcoal Surface */}
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
          {/* Subtle Directional Spotlight (Foil Lens following pointer) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHot ? 1 : 0,
              background: `radial-gradient(circle 220px at var(--foil-x, 50%) var(--foil-y, 50%), rgba(255, 245, 225, 0.08), rgba(135, 152, 183, 0.03) 40%, transparent 75%)`,
            }}
            aria-hidden="true"
          />

          {/* Critical Gap Subtle Ambient Clay Heartbeat (slow edge-light, pauses on hover) */}
          {isCriticalGap && (
            <div
              className="absolute inset-0 rounded-2xl border border-[#C6927D] pointer-events-none transition-opacity duration-1000"
              style={{
                animation: isHot ? 'none' : 'clayPulse 4.6s ease-in-out infinite',
                opacity: isHot ? 0.7 : 0.35,
              }}
              aria-hidden="true"
            />
          )}

          {/* Top Layer: Category, Skill Signal, and Status Badge */}
          <div
            className="relative z-10 flex items-start justify-between gap-3 pb-3"
            style={{
              transform: isHot ? 'translateZ(18px)' : 'translateZ(0px)',
              transition: 'transform 0.25s ease',
            }}
          >
            <div className="flex flex-col gap-1">
              {category && (
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#A39F94]">
                  {category}
                </span>
              )}

              {/* 
                SKILL SIGNAL (Signature Avenza interaction):
                When the pointer enters, a tiny signal point appears and travels through
                a small internal route line, reaching the skill title, then disappears.
                Runs subtly, once per hover, never loops continuously.
              */}
              <div className="relative w-24 h-1.5 overflow-hidden pointer-events-none" aria-hidden="true">
                {/* Subtle static track */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#4A4A42]/40 -translate-y-1/2" />
                {/* Animated signal node */}
                {isSignalActive && (
                  <div
                    className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full -translate-y-1/2 shadow-sm"
                    style={{
                      backgroundColor: statusAccent,
                      boxShadow: `0 0 6px ${statusAccent}`,
                      animation: 'skillSignalGlide 0.7s ease-out forwards',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Status Badge with subtle one-time pulse on hover */}
            {badge && (
              <div
                className="transition-transform duration-300"
                style={{
                  animation: isBadgePulsing ? 'statusPulse 0.6s ease-out 1' : 'none',
                  // @ts-ignore
                  '--pulse-color': statusPulseColor,
                }}
              >
                {badge}
              </div>
            )}
          </div>

          {/* Main Content: Title & Description */}
          <div
            className="relative z-10 space-y-1.5 flex-1 py-1"
            style={{
              transform: isHot
                ? 'translate3d(calc(var(--pointer-x, 0) * 2px), calc(var(--pointer-y, 0) * 1.5px), 14px)'
                : 'translate3d(0, 0, 0)',
              transition: 'transform 0.2s ease-out',
            }}
          >
            <h3
              className={`font-bold text-base leading-snug tracking-tight transition-colors duration-200 ${
                isHot ? 'text-[#FFF8ED]' : 'text-[#F5EFE4]'
              }`}
            >
              {title}
            </h3>

            {description && (
              <p className="text-xs text-[#BDB5A7] line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {children}
          </div>

          {/* Footer Progress & Meta Layer */}
          <div
            className="relative z-10 pt-3 border-t border-[#4A4A42] space-y-2 mt-3"
            style={{
              transform: isHot ? 'translateZ(10px)' : 'translateZ(0px)',
              transition: 'transform 0.25s ease',
            }}
          >
            {footerMeta ? (
              footerMeta
            ) : (
              currentLevel !== undefined && targetLevel !== undefined && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#A39F94] text-[11px]">
                      {isVerified ? 'Verified Level:' : 'Current Level:'}
                    </span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        isVerified ? 'text-[#B4CCB8]' : 'text-[#A9B7D0]'
                      }`}
                    >
                      Level {isVerified ? verifiedLevel : currentLevel} / {targetLevel}
                    </span>
                  </div>

                  {/* Progress bar track with animated light runner on hover */}
                  <div className="w-full bg-[#45463F] h-1.5 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isVerified ? 'bg-[#9BB59F]' : 'bg-[#8798B7]'
                      }`}
                      style={{
                        width: `${Math.min(100, ((isVerified ? verifiedLevel || 0 : currentLevel) / targetLevel) * 100)}%`,
                      }}
                    />
                    {isHot && (
                      <div
                        className="absolute top-0 bottom-0 w-10 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                        style={{
                          animation: 'runnerGlide 0.8s ease-out forwards',
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Subtle Level Ladder (optional 3D step cue, placed cleanly without obscuring text) */}
          {currentLevel !== undefined && targetLevel !== undefined && !footerMeta && (
            <LevelLadder
              currentLevel={currentLevel}
              targetLevel={targetLevel}
              verifiedLevel={verifiedLevel}
              isHot={isHot}
            />
          )}
        </div>

        {/* Visible Focus Ring for Keyboard Accessibility (2px #AFC0E0, 3px offset) */}
        {isFocused && (
          <div
            className="absolute -inset-1 rounded-[18px] border-2 border-[#AFC0E0] pointer-events-none shadow-sm shadow-[#AFC0E0]/30"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};
