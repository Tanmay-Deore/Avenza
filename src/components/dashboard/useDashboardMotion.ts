import { useContext } from 'react';
import { DashboardMotionContext, type DashboardMotionContextType } from './DashboardMotionContext';

export const useDashboardMotion = (): DashboardMotionContextType => {
  const context = useContext(DashboardMotionContext);
  if (!context) {
    throw new Error('useDashboardMotion must be used within a DashboardMotionProvider');
  }
  return context;
};
