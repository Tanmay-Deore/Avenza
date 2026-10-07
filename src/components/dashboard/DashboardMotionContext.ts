import { createContext } from 'react';

export type JourneyPulsePhase = 'idle' | 'goal' | 'gap' | 'checkpoint' | 'mission';

export interface DashboardMotionContextType {
  pulsePhase: JourneyPulsePhase;
  triggerJourneyPulse: () => void;
  activeRelationship: string | null;
  hoveredGapId: string | null;
  setHoveredGapId: (id: string | null) => void;
  isRadarOpen: boolean;
  setIsRadarOpen: (open: boolean) => void;
  isRoutePreviewOpen: boolean;
  setIsRoutePreviewOpen: (open: boolean) => void;
  hasPulsedOnMount: boolean;
}

export const DashboardMotionContext = createContext<DashboardMotionContextType | null>(null);
