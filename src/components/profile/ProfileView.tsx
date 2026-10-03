import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Button } from '../../design-system/Button';
import { STANDARD_GOALS } from '../../services/skillTaxonomy';
import {
  User,
  Clock,
  Target,
  RotateCcw,
  Download,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUserGoal,
    updateUserDailyTime,
    resetAllData,
  } = useAvenza();

  const [name, setName] = useState(user.name);
  const [minutes, setMinutes] = useState(user.availableMinutesPerDay);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    updateUserDailyTime(minutes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `avenza_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2E302B] to-[#242520] border border-[#4A4A42] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42] flex items-center justify-center font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#F5EFE4]">{user.name}</h2>
            <p className="text-xs text-[#A39F94]">{user.email || 'alex.morgan@example.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-[#242520] text-[#BDB5A7] border border-[#3A3B34] font-mono">
            {user.level.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 1. Daily Learning Pace & Adaptive Schedule */}
      <div className="p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#3A3B34] pb-3">
          <Clock className="w-4 h-4 text-[#A9B7D0]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4]">
            Adaptive Daily Pace & Time Budget
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#BDB5A7] font-semibold">Available Learning Time:</span>
            <span className="font-mono font-bold text-[#A9B7D0] text-sm">{minutes} Minutes / Day</span>
          </div>

          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full h-2 bg-[#242520] rounded-lg appearance-none cursor-pointer accent-[#8798B7]"
          />

          <div className="flex justify-between text-[11px] text-[#A39F94] font-mono">
            <span>15m (Micro)</span>
            <span>30m (Balanced)</span>
            <span>60m (Standard)</span>
            <span>120m (Intensive)</span>
          </div>

          <p className="text-xs text-[#A39F94] leading-relaxed pt-2">
            Changing your daily time budget automatically recalibrates your upcoming journey checkpoints into appropriately sized micro-actions.
          </p>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSavePreferences}
            leftIcon={savedSuccess ? <CheckCircle2 className="w-4 h-4 text-[#B4CCB8]" /> : <Sliders className="w-4 h-4" />}
          >
            {savedSuccess ? 'Pace Saved & Path Recalibrated!' : 'Apply Schedule Change'}
          </Button>
        </div>
      </div>

      {/* 2. Destination Goal Switcher */}
      <div className="p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#3A3B34] pb-3">
          <Target className="w-4 h-4 text-[#E0C77F]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4]">
            Target Destination Goal
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STANDARD_GOALS.map((g) => {
            const isSelected = user.currentGoal?.id === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setUserGoal(g)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#30312C] border-[#8798B7] text-[#F5EFE4] ring-1 ring-[#8798B7]/40'
                    : 'bg-[#242520] border-[#3A3B34] text-[#BDB5A7] hover:border-[#4A4A42]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#A39F94] mb-1">
                    <span>{g.type}</span>
                    <span>~{g.estimatedWeeks} weeks</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#F5EFE4]">{g.title}</h4>
                  <p className="text-xs text-[#A39F94] mt-1 line-clamp-2">{g.description}</p>
                </div>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-[#A9B7D0] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B4CCB8]" />
                    <span>Active Route Destination</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. System & Data Operations */}
      <div className="p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4] border-b border-[#3A3B34] pb-3">
          Data Management & State Control
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export All Learning Data (JSON)
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all progress, tests, and journey steps?')) {
                resetAllData();
              }
            }}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset All Application State
          </Button>
        </div>
      </div>
    </div>
  );
};
