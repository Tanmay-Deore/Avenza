import React from 'react';
import { calculateFreshness } from './passportData';
import { Clock, CheckCircle2, RefreshCw } from 'lucide-react';

interface EvidenceFreshnessBadgeProps {
  timestamp: string;
  onRefreshClick?: () => void;
  showRefreshButton?: boolean;
}

export const EvidenceFreshnessBadge: React.FC<EvidenceFreshnessBadgeProps> = ({
  timestamp,
  onRefreshClick,
  showRefreshButton = false,
}) => {
  const { status, label, percent, daysAgo } = calculateFreshness(timestamp);

  const getStatusColor = () => {
    switch (status) {
      case 'FRESH':
        return {
          stroke: '#9BB59F', // Sage
          text: 'text-[#B4CCB8]',
          bg: 'bg-[#9BB59F]/10',
          border: 'border-[#9BB59F]/30',
          tag: 'Fresh',
        };
      case 'CURRENT':
        return {
          stroke: '#8798B7', // Blue
          text: 'text-[#A9B7D0]',
          bg: 'bg-[#8798B7]/10',
          border: 'border-[#8798B7]/30',
          tag: 'Active',
        };
      case 'REFRESH_RECOMMENDED':
        return {
          stroke: '#D1B46A', // Gold
          text: 'text-[#E0C77F]',
          bg: 'bg-[#D1B46A]/10',
          border: 'border-[#D1B46A]/30',
          tag: 'Refreshable',
        };
    }
  };

  const colors = getStatusColor();
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border ${colors.border} ${colors.bg} text-[11px]`}
      title={`Evidence demonstrated ${daysAgo} days ago (${new Date(timestamp).toLocaleDateString()})`}
    >
      {/* Micro circular freshness progress ring */}
      <div className="relative w-4 h-4 flex-shrink-0 flex items-center justify-center">
        <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="#4A4A42"
            strokeWidth="2.5"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
      </div>

      <div className="flex items-center gap-1.5 font-medium">
        <span className={colors.text}>{label}</span>
      </div>

      {showRefreshButton && onRefreshClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefreshClick();
          }}
          className="ml-1 text-[10px] font-mono text-[#A9B7D0] hover:text-[#F5EFE4] hover:underline flex items-center gap-1 transition-colors"
          title="Verify again to refresh evidence timestamp"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Verify Again</span>
        </button>
      )}
    </div>
  );
};
