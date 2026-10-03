import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { VisualThemeMode } from './visualTokens';

export type CoreState =
  | 'IDLE'
  | 'SCANNING'
  | 'VERIFYING'
  | 'MAPPING'
  | 'ROUTING'
  | 'MENTORING'
  | 'EXPLORING'
  | 'REROUTING'
  | 'VERIFIED'
  | 'DESTINATION';

export type QualityTier = 'high' | 'medium' | 'low';

export interface VisualState {
  coreState: CoreState;
  theme: VisualThemeMode;
  viewMode: 'cinematic' | 'workspace';
  scrollProgress: number;     // 0.0 to 1.0
  scrollVelocity: number;
  activePanelIndex: number;   // 0 to 5 for the 6 Avenza modules
  hoveredPanelIndex: number | null;
  selectedSkillId: string | null;
  hoveredSkillId: string | null;
  activeCheckpointIndex: number;
  routeProgress: number;      // 0 to 1
  isRerouting: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
  pointer: { x: number; y: number; targetX: number; targetY: number };
  activeModuleDrawer: string | null;
}

interface VisualContextType {
  state: VisualState;
  setCoreState: (state: CoreState) => void;
  setTheme: (theme: VisualThemeMode) => void;
  toggleTheme: () => void;
  setViewMode: (mode: 'cinematic' | 'workspace') => void;
  setScrollProgress: (progress: number, velocity?: number) => void;
  setActivePanelIndex: (index: number) => void;
  setHoveredPanelIndex: (index: number | null) => void;
  setSelectedSkillId: (skillId: string | null) => void;
  setHoveredSkillId: (skillId: string | null) => void;
  setRouteProgress: (progress: number) => void;
  triggerRerouteAnimation: () => void;
  setQuality: (quality: QualityTier) => void;
  setReducedMotion: (reduced: boolean) => void;
  setPointer: (x: number, y: number) => void;
  openModuleDrawer: (moduleId: string) => void;
  closeModuleDrawer: () => void;
  scrollToScene: (sceneTarget: number | string) => void;
}

const VisualContext = createContext<VisualContextType | null>(null);

export const VisualProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VisualState>(() => {
    const prefersReduced = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    return {
      coreState: 'IDLE',
      theme: 'bright',
      viewMode: 'cinematic',
      scrollProgress: 0,
      scrollVelocity: 0,
      activePanelIndex: 0,
      hoveredPanelIndex: null,
      selectedSkillId: null,
      hoveredSkillId: null,
      activeCheckpointIndex: 0,
      routeProgress: 0.35,
      isRerouting: false,
      quality: 'high',
      reducedMotion: prefersReduced,
      pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
      activeModuleDrawer: null,
    };
  });

  const scrollToTargetRef = useRef<((target: number | string) => void) | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const setCoreState = useCallback((coreState: CoreState) => {
    setState((prev) => ({ ...prev, coreState }));
  }, []);

  const setTheme = useCallback((theme: VisualThemeMode) => {
    setState((prev) => ({ ...prev, theme }));
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => {
      const nextTheme: VisualThemeMode = prev.theme === 'bright' ? 'dark' : 'bright';
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { ...prev, theme: nextTheme };
    });
  }, []);

  const setViewMode = useCallback((viewMode: 'cinematic' | 'workspace') => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const setScrollProgress = useCallback((scrollProgress: number, scrollVelocity: number = 0) => {
    setState((prev) => {
      let coreState = prev.coreState;
      if (scrollProgress < 0.12) {
        coreState = 'IDLE';
      } else if (scrollProgress < 0.30) {
        coreState = 'SCANNING';
      } else if (scrollProgress < 0.45) {
        coreState = 'MAPPING';
      } else if (scrollProgress < 0.65) {
        coreState = 'ROUTING';
      } else if (scrollProgress < 0.85) {
        coreState = 'VERIFYING';
      } else {
        coreState = 'DESTINATION';
      }

      let activePanelIndex = prev.activePanelIndex;
      if (scrollProgress >= 0.40 && scrollProgress <= 0.95) {
        const galleryRel = (scrollProgress - 0.40) / 0.55;
        activePanelIndex = Math.min(5, Math.max(0, Math.floor(galleryRel * 6)));
      }

      return {
        ...prev,
        scrollProgress,
        scrollVelocity,
        coreState,
        activePanelIndex,
      };
    });
  }, []);

  const setActivePanelIndex = useCallback((activePanelIndex: number) => {
    setState((prev) => ({ ...prev, activePanelIndex }));
  }, []);

  const setHoveredPanelIndex = useCallback((hoveredPanelIndex: number | null) => {
    setState((prev) => ({ ...prev, hoveredPanelIndex }));
  }, []);

  const setSelectedSkillId = useCallback((selectedSkillId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedSkillId,
      coreState: selectedSkillId ? 'MAPPING' : prev.coreState,
    }));
  }, []);

  const setHoveredSkillId = useCallback((hoveredSkillId: string | null) => {
    setState((prev) => ({ ...prev, hoveredSkillId }));
  }, []);

  const setRouteProgress = useCallback((routeProgress: number) => {
    setState((prev) => ({ ...prev, routeProgress }));
  }, []);

  const triggerRerouteAnimation = useCallback(() => {
    setState((prev) => ({ ...prev, isRerouting: true, coreState: 'REROUTING' }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, isRerouting: false, coreState: 'ROUTING' }));
    }, 2400);
  }, []);

  const setQuality = useCallback((quality: QualityTier) => {
    setState((prev) => ({ ...prev, quality }));
  }, []);

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setState((prev) => ({ ...prev, reducedMotion }));
  }, []);

  const setPointer = useCallback((x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      pointer: {
        ...prev.pointer,
        targetX: x,
        targetY: y,
      },
    }));
  }, []);

  const openModuleDrawer = useCallback((moduleId: string) => {
    setState((prev) => ({ ...prev, activeModuleDrawer: moduleId }));
  }, []);

  const closeModuleDrawer = useCallback(() => {
    setState((prev) => ({ ...prev, activeModuleDrawer: null }));
  }, []);

  const scrollToScene = useCallback((sceneTarget: number | string) => {
    if (scrollToTargetRef.current) {
      scrollToTargetRef.current(sceneTarget);
    }
  }, []);

  const contextValue: VisualContextType = {
    state,
    setCoreState,
    setTheme,
    toggleTheme,
    setViewMode,
    setScrollProgress,
    setActivePanelIndex,
    setHoveredPanelIndex,
    setSelectedSkillId,
    setHoveredSkillId,
    setRouteProgress,
    triggerRerouteAnimation,
    setQuality,
    setReducedMotion,
    setPointer,
    openModuleDrawer,
    closeModuleDrawer,
    scrollToScene,
  };

  return (
    <VisualContext.Provider value={contextValue}>
      {children}
    </VisualContext.Provider>
  );
};

export const useVisual = () => {
  const context = useContext(VisualContext);
  if (!context) {
    throw new Error('useVisual must be used within a VisualProvider');
  }
  return context;
};
