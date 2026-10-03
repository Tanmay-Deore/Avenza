import React from 'react';
import { VerificationResult } from '../../types';
import { Button } from '../../design-system/Button';
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VerificationResultView: React.FC<{
  result: VerificationResult;
  onClose: () => void;
}> = ({ result, onClose }) => {
  React.useEffect(() => {
    if (result.passed) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [result.passed]);

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-200">
      {/* Result Hero */}
      <div
        className={`p-6 rounded-2xl border text-center space-y-3 ${
          result.passed
            ? 'bg-gradient-to-b from-emerald-950/50 to-[#121826] border-emerald-500/50'
            : 'bg-gradient-to-b from-amber-950/50 to-[#121826] border-amber-500/50'
        }`}
      >
        <div
          className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${
            result.passed
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}
        >
          {result.passed ? <Award className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-400">
            Assessment Completed
          </span>
          <h3 className="text-xl font-black text-gray-100 mt-0.5">{result.skillName}</h3>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          <div>
            <div className="text-2xl font-black font-mono text-gray-100">{result.score}%</div>
            <div className="text-[11px] text-gray-400">Score Achieved</div>
          </div>

          <div className="w-px h-8 bg-[#26354D]" />

          <div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              Level {result.awardedLevel}
            </div>
            <div className="text-[11px] text-gray-400">Awarded Competency</div>
          </div>
        </div>

        <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed pt-2">
          {result.feedback}
        </p>
      </div>

      {/* Breakdown: Strong Areas vs Areas to Improve */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Strong Areas */}
        <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Areas Demonstrated</span>
          </div>
          {result.strongAreas.length === 0 ? (
            <p className="text-gray-400">Foundational concepts need additional review.</p>
          ) : (
            <ul className="space-y-1 text-gray-200">
              {result.strongAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Areas to Improve */}
        <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Areas to Improve Next</span>
          </div>
          {result.areasToImprove.length === 0 ? (
            <p className="text-gray-400">No weaknesses detected at this assessment tier.</p>
          ) : (
            <ul className="space-y-1 text-gray-200">
              {result.areasToImprove.map((area, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Passport Evidence Notice */}
      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-gray-200">Evidence item recorded in your Skill Passport</span>
        </div>
        <span className="font-mono text-purple-300 font-bold">Ledger Updated</span>
      </div>

      {/* Close & Continue Action */}
      <Button variant="glow" size="lg" className="w-full" onClick={onClose}>
        Continue Learning Journey
      </Button>
    </div>
  );
};
