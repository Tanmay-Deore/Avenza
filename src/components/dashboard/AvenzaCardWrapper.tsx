import React, { useRef, useState, useEffect, useCallback } from 'react';

export type CardMotionPreset = 'primary' | 'secondary' | 'metric';
export type CardLightTint = 'default' | 'sage' | 'blue' | 'gold' | 'lavender' | 'clay';

export interface AvenzaCardWrapperProps {
  preset?: CardMotionPreset;
  tint?: CardLightTint;
  accentBorderColor?: string;
  isHighlighted?: boolean;
  highlightColor?: string;
  isPulsing?: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  onHoverChange?: (isHovered: boolean) => void;
}

const PRESET_CONFIGS = {
  primary: {
    maxTilt: 4.2,
    liftY: 6.5,
    liftZ: 10,
    pressScale: 0.988,
    perspective: '1000px',
    shadowResting: '0 4px 14px -2px rgba(18, 19, 15, 0.35), 0 2px 6px -1px rgba(18, 19, 15, 0.20)',
    shadowHover: '0 20px 40px -6px rgba(18, 19, 15, 0.55), 0 8px 16px -2px rgba(18, 19, 15, 0.35)',
  },
  secondary: {
    maxTilt: 3.2,
    liftY: 4.8,
    liftZ: 7,
    pressScale: 0.990,
    perspective: '900px',
    shadowResting: '0 3px 12px -2px rgba(18, 19, 15, 0.30), 0 2px 5px -1px rgba(18, 19, 15, 0.18)',
    shadowHover: '0 16px 32px -5px rgba(18, 19, 15, 0.48), 0 6px 12px -2px rgba(18, 19, 15, 0.28)',
  },
  metric: {
    maxTilt: 2.4,
    liftY: 3.4,
    liftZ: 5,
    pressScale: 0.992,
    perspective: '800px',
    shadowResting: '0 2px 8px -1px rgba(18, 19, 15, 0.25)',
    shadowHover: '0 10px 22px -3px rgba(18, 19, 15, 0.42), 0 4px 8px -1px rgba(18, 19, 15, 0.22)',
  },
};

const TINT_GRADIENTS: Record<CardLightTint, string> = {
  default: 'rgba(255, 245, 225, 0.075)',
  sage: 'rgba(155, 181, 159, 0.085)',
  blue: 'rgba(135, 152, 183, 0.085)',
  gold: 'rgba(209, 180, 106, 0.090)',
  lavender: 'rgba(167, 155, 196, 0.085)',
  clay: 'rgba(198, 146, 125, 0.090)',
};

/**
 * AvenzaCardWrapper: Master Card Physics System (Sections 05–14, 40, 41)
 * 
 * 3-Tier Architecture:
 * 1. LAYOUT HOST: Static position participant, 0 layout shifts.
 * 2. CARD WRAPPER: Isolated local perspective (800–1000px).
 * 3. CARD VISUAL: Center-center preserve-3d surface handling tilt, lift, press & foil gleam.
 */
export const AvenzaCardWrapper: React.FC<AvenzaCardWrapperProps> = ({
  preset = 'secondary',
  tint = 'default',
  accentBorderColor,
  isHighlighted = false,
  highlightColor,
  isPulsing = false,
  className = '',
  innerClassName = '',
  children,
  onClick,
  role,
  tabIndex,
  ariaLabel,
  onHoverChange,
}) => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isCoarseRef = useRef(false);
  const config = PRESET_CONFIGS[preset];

  useEffect(() => {
    isCoarseRef.current =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        'ontouchstart' in window);
  }, []);

  const isHot = isHovered || isFocused;

  // Pointer Enter
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    onHoverChange?.(true);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease';
    }
  }, [onHoverChange]);

  // Pointer Move (Calculates tilt, lift, foil light coordinates)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isCoarseRef.current || !visualRef.current) return;

      const rect = visualRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      const clampedX = Math.max(-0.5, Math.min(0.5, relX)) * 2;
      const clampedY = Math.max(-0.5, Math.min(0.5, relY)) * 2;

      const rotX = -clampedY * config.maxTilt;
      const rotY = clampedX * config.maxTilt;

      const liftY = isPressed ? -(config.liftY * 0.3) : -config.liftY;
      const liftZ = isPressed ? 2 : config.liftZ;
      const scale = isPressed ? config.pressScale : 1.006;

      // Direct CSS variables updates (0 React re-renders)
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

      visualRef.current.style.transform = `translate3d(0px, ${liftY.toFixed(
        1
      )}px, ${liftZ}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
        2
      )}deg) scale(${scale})`;
    },
    [config, isPressed]
  );

  // Pointer Leave
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    onHoverChange?.(false);

    if (visualRef.current) {
      visualRef.current.style.setProperty('--px', '0');
      visualRef.current.style.setProperty('--py', '0');
      visualRef.current.style.setProperty('--foil-x', '50%');
      visualRef.current.style.setProperty('--foil-y', '50%');

      visualRef.current.style.transition =
        'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease';
      visualRef.current.style.transform =
        'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, [onHoverChange]);

  // Pointer Down / Tactile Press
  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.12s ease-out, box-shadow 0.15s ease';
      visualRef.current.style.transform = `translate3d(0px, -2px, 2px) rotateX(0deg) rotateY(0deg) scale(${config.pressScale})`;
    }
  }, [config.pressScale]);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Keyboard navigation
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.25s ease-out, box-shadow 0.25s ease';
      visualRef.current.style.transform = `translate3d(0px, -${config.liftY}px, ${config.liftZ}px) rotateX(0deg) rotateY(0deg) scale(1.006)`;
    }
  }, [config.liftY, config.liftZ]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (visualRef.current) {
      visualRef.current.style.transition =
        'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
      visualRef.current.style.transform =
        'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick(e as any);
      }
    },
    [onClick]
  );

  return (
    /* Tier 1: Layout Host (stable document flow) */
    <div className={`avenza-card-host relative w-full ${className}`}>
      {/* Tier 2: Isolated Perspective Wrapper */}
      <div
        className="avenza-card-wrapper relative w-full h-full"
        style={{
          perspective: config.perspective,
        }}
      >
        {/* Tier 3: 3D Surface Visual */}
        <div
          ref={visualRef}
          role={role}
          tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
          aria-label={ariaLabel}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={onClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`avenza-card-visual relative w-full h-full rounded-2xl outline-none select-none ${
            onClick ? 'cursor-pointer' : ''
          } ${innerClassName}`}
          style={{
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            transform: 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)',
            willChange: isHot ? 'transform' : 'auto',
            zIndex: isHot ? 10 : 1,
          }}
        >
          {/* Subtle Elevation Shadow Plane */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            style={{
              transform: 'translateZ(-10px)',
              boxShadow: isHot ? config.shadowHover : config.shadowResting,
            }}
            aria-hidden="true"
          />

          {/* Directional Learning Lens Spotlight Layer */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 overflow-hidden"
            style={{
              opacity: isHot ? 1 : 0,
              background: `radial-gradient(circle 280px at var(--foil-x, 50%) var(--foil-y, 50%), ${TINT_GRADIENTS[tint]} 0%, transparent 75%)`,
            }}
            aria-hidden="true"
          />

          {/* Subtle Edge Catching Gleam */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHot ? 1 : 0,
              background: `radial-gradient(circle 320px at var(--foil-x, 50%) var(--foil-y, 50%), rgba(255, 245, 225, 0.16) 0%, transparent 65%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
            aria-hidden="true"
          />

          {/* Active Relationship / Journey Pulse Border Accent (Idea 11 & 15) */}
          {(isHighlighted || isPulsing || accentBorderColor) && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
              style={{
                border: `1.5px solid ${highlightColor || accentBorderColor || '#8798B7'}`,
                boxShadow: `0 0 14px -2px ${highlightColor || accentBorderColor || '#8798B7'}45`,
                opacity: isHighlighted || isPulsing ? 1 : 0.6,
              }}
              aria-hidden="true"
            />
          )}

          {/* Card Content Host */}
          {children}

          {/* Accessible Keyboard Focus Ring */}
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
