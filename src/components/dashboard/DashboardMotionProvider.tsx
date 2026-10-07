import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAvenza } from '../../state/AppContext';
import {
  DashboardMotionContext,
  JourneyPulsePhase,
} from './DashboardMotionContext';

export const DashboardMotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeStep } = useAvenza();
  const [pulsePhase, setPulsePhase] = useState<JourneyPulsePhase>('idle');
  const [hoveredGapId, setHoveredGapId] = useState<string | null>(null);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isRoutePreviewOpen, setIsRoutePreviewOpen] = useState(false);
  const [hasPulsedOnMount, setHasPulsedOnMount] = useState(false);

  const pulseTimeoutsRef = useRef<number[]>([]);

  const clearPulseTimeouts = useCallback(() => {
    pulseTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
    pulseTimeoutsRef.current = [];
  }, []);

  // Signature Journey Pulse (Idea 15 & 48)
  // Sequence: GOAL (0ms) -> GAP (420ms) -> CHECKPOINT (880ms) -> MISSION (1380ms) -> IDLE (1900ms)
  const triggerJourneyPulse = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPulsePhase('idle');
      return;
    }

    clearPulseTimeouts();
    setPulsePhase('goal');

    const t1 = window.setTimeout(() => setPulsePhase('gap'), 420);
    const t2 = window.setTimeout(() => setPulsePhase('checkpoint'), 880);
    const t3 = window.setTimeout(() => setPulsePhase('mission'), 1380);
    const t4 = window.setTimeout(() => setPulsePhase('idle'), 1900);

    pulseTimeoutsRef.current = [t1, t2, t3, t4];
  }, [clearPulseTimeouts]);

  // Trigger once on initial mount (Idea 49: only when dashboard genuinely loads)
  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setHasPulsedOnMount(true);
      triggerJourneyPulse();
    }, 650);

    return () => {
      window.clearTimeout(initialTimer);
      clearPulseTimeouts();
    };
  }, [triggerJourneyPulse, clearPulseTimeouts]);

  // Cross-section relationship linking (Idea 11 & 36)
  // Derived state without cascading renders
  const activeRelationship = useMemo(() => {
    if (!hoveredGapId) return null;
    const activeStepSkills = activeStep?.skills || [];
    const isStepLinked =
      activeStepSkills.includes(hoveredGapId) ||
      (activeStep?.title?.toLowerCase() || '').includes(hoveredGapId.toLowerCase());
    return isStepLinked ? hoveredGapId : hoveredGapId;
  }, [hoveredGapId, activeStep]);

  return (
    <DashboardMotionContext.Provider
      value={{
        pulsePhase,
        triggerJourneyPulse,
        activeRelationship,
        hoveredGapId,
        setHoveredGapId,
        isRadarOpen,
        setIsRadarOpen,
        isRoutePreviewOpen,
        setIsRoutePreviewOpen,
        hasPulsedOnMount,
      }}
    >
      {children}
    </DashboardMotionContext.Provider>
  );
};
