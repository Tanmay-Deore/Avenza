import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import {
  DepthIntensityLevel,
  getEffectiveIntensityLevel,
} from './depthEngine.config';

interface DepthGridContextValue {
  activeHoverId: string | null;
  activeSelectedId: string | null;
  intensityLevel: DepthIntensityLevel;
  setCardHover: (id: string | null) => void;
  setCardFocus: (id: string | null) => void;
  setCardPress: (id: string | null, isPressed: boolean) => void;
  setCardSelect: (id: string, isSelected: boolean) => void;
}

const DepthGridContext = createContext<DepthGridContextValue | null>(null);

export function useDepthGridContext() {
  return useContext(DepthGridContext);
}

interface DepthGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  preferredIntensity?: DepthIntensityLevel;
}

/**
 * DepthGrid: Stable Grid Host
 *
 * Core rule:
 * THE GRID OWNS POSITION.
 * THE CARD MOTION OWNS VISUAL DEPTH.
 *
 * The grid container remains a pure CSS Grid layout without container-level
 * perspective or transform-style: preserve-3d (which caused keystoning and projection
 * distortion across different columns). Local perspective is owned by each card wrapper.
 */
export const DepthGrid: React.FC<DepthGridProps> = ({
  children,
  className = '',
  style = {},
  preferredIntensity = 2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intensityLevel, setIntensityLevel] = useState<DepthIntensityLevel>(() =>
    getEffectiveIntensityLevel(preferredIntensity)
  );

  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [activeSelectedId, setActiveSelectedId] = useState<string | null>(null);

  const setCardHover = useCallback((id: string | null) => {
    setActiveHoverId(id);
  }, []);

  const setCardFocus = useCallback((id: string | null) => {
    setActiveHoverId(id);
  }, []);

  const setCardPress = useCallback((_id: string | null, _isPressed: boolean) => {
    // Handled locally in card component
  }, []);

  const setCardSelect = useCallback((id: string, isSelected: boolean) => {
    setActiveSelectedId(isSelected ? id : null);
  }, []);

  // Sync with user's reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setIntensityLevel(getEffectiveIntensityLevel(preferredIntensity));
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferredIntensity]);

  return (
    <DepthGridContext.Provider
      value={{
        activeHoverId,
        activeSelectedId,
        intensityLevel,
        setCardHover,
        setCardFocus,
        setCardPress,
        setCardSelect,
      }}
    >
      <div
        ref={containerRef}
        className={`depth-grid-container relative w-full ${className}`}
        style={style}
      >
        {children}
      </div>
    </DepthGridContext.Provider>
  );
};
