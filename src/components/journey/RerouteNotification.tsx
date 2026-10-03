import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Sparkles, X, ArrowRight, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

export const RerouteNotification: React.FC = () => {
  const { latestReroute, isRerouteToastOpen, dismissRerouteToast } = useAvenza();

  if (!isRerouteToastOpen || !latestReroute) return null;

  const triggerIcons = {
    STRUGGLE: <AlertTriangle className="w-4 h-4 text-rose-400" />,
    FAST_IMPROVEMENT: <Sparkles className="w-4 h-4 text-emerald-400" />,
    TIME_CHANGE: <Clock className="w-4 h-4 text-cyan-400" />,
    GOAL_CHANGE: <RefreshCw className="w-4 h-4 text-purple-400" />,
    VERIFICATION_CHANGE: <Sparkles className="w-4 h-4 text-blue-400" />,
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-[#182234] via-[#1A263B] to-[#142033] border border-cyan-500/40 shadow-xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            {triggerIcons[latestReroute.trigger] || <Sparkles className="w-4 h-4" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Path Adapted Automatically
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {new Date(latestReroute.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-100">{latestReroute.reason}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300 pt-1">
              <div className="p-2 rounded-lg bg-[#121826] border border-[#26354D]">
                <span className="text-[10px] font-bold text-cyan-400 uppercase block">What Changed:</span>
                <span>{latestReroute.whatChanged}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#121826] border border-[#26354D]">
                <span className="text-[10px] font-bold text-purple-400 uppercase block">Why:</span>
                <span>{latestReroute.whyItChanged}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Next recommended step: {latestReroute.nextActionRecommendation}</span>
            </div>
          </div>
        </div>

        <button
          onClick={dismissRerouteToast}
          className="p-1 rounded-md text-gray-400 hover:text-gray-100 hover:bg-[#26354D] transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
