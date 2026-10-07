import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { EvidenceItem } from '../../types';
import { EvidenceFreshnessBadge } from './EvidenceFreshnessBadge';
import {
  FileText,
  ShieldCheck,
  Zap,
  Code,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Terminal,
  Hash,
} from 'lucide-react';

interface ProofVaultViewProps {
  onSelectEvidence?: (evidence: EvidenceItem) => void;
}

export const ProofVaultView: React.FC<ProofVaultViewProps> = ({ onSelectEvidence }) => {
  const { passport, openVerificationModal } = useAvenza();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeStackIndex, setActiveStackIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'STACK' | 'GRID'>('STACK');

  const evidenceItems = passport.evidenceLedger;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return <ShieldCheck className="w-4 h-4 text-[#9BB59F]" />;
      case 'MISSION':
        return <Zap className="w-4 h-4 text-[#8798B7]" />;
      case 'PROJECT':
        return <Award className="w-4 h-4 text-[#BDB2D6]" />;
      default:
        return <Code className="w-4 h-4 text-[#D1B46A]" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3B34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D1B46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
              Proof of Work Vault ({evidenceItems.length})
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(209,180,106,0.15)] text-[#E0C77F] border border-[#D1B46A]/30">
              Layered Physical Archive
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            Physical proof ledger of all completed diagnostic runs, practical code tasks, and benchmarks
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[#242520] p-1 rounded-xl border border-[#3A3B34] self-start sm:self-center">
          <button
            onClick={() => setViewMode('STACK')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'STACK'
                ? 'bg-[#373832] text-[#F5EFE4] shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4]'
            }`}
          >
            Physical Archive Stack
          </button>
          <button
            onClick={() => setViewMode('GRID')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'GRID'
                ? 'bg-[#373832] text-[#F5EFE4] shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4]'
            }`}
          >
            Ledger Table
          </button>
        </div>
      </div>

      {/* Mode 1: Physical Layered Archive Stack */}
      {viewMode === 'STACK' && (
        <div className="space-y-4">
          {/* Stack Navigation Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {evidenceItems.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => {
                  setActiveStackIndex(idx);
                  setExpandedId(ev.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all flex-shrink-0 ${
                  activeStackIndex === idx
                    ? 'bg-[#373832] text-[#F5EFE4] border-[#D1B46A]'
                    : 'bg-[#242520] text-[#A39F94] border-[#3A3B34] hover:border-[#4A4A42]'
                }`}
              >
                {getIcon(ev.type)}
                <span className="truncate max-w-[150px]">{ev.title}</span>
                <span className="text-[10px] font-mono text-[#9BB59F]">L{ev.levelEarned}</span>
              </button>
            ))}
          </div>

          {/* Layered Document Stack Presentation */}
          <div className="relative pt-2" style={{ perspective: 1000 }}>
            {evidenceItems.map((ev, idx) => {
              const offset = idx - activeStackIndex;
              const isFront = offset === 0;
              const isBehind = offset > 0;
              const isPast = offset < 0;

              // Only show active and nearby cards for visual layering
              if (Math.abs(offset) > 2) return null;

              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    setActiveStackIndex(idx);
                    toggleExpand(ev.id);
                  }}
                  style={{
                    transform: isFront
                      ? 'translateZ(20px) translateY(0px)'
                      : isBehind
                      ? `translateZ(${-offset * 25}px) translateY(${offset * 12}px) scale(${1 - offset * 0.04})`
                      : `translateZ(${offset * 25}px) translateY(${offset * 12}px) scale(${1 + offset * 0.04})`,
                    opacity: isFront ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.3),
                    zIndex: 20 - Math.abs(offset),
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className={`rounded-2xl p-5 border cursor-pointer select-none ${
                    isFront
                      ? 'bg-gradient-to-br from-[#2E302B] to-[#242520] border-[#D1B46A]/60 shadow-xl'
                      : 'bg-[#242520] border-[#3A3B34] shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3A3B34]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#20211E] border border-[#4A4A42] flex items-center justify-center flex-shrink-0">
                        {getIcon(ev.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A39F94]">
                            {ev.type} ARTIFACT
                          </span>
                          <span className="text-[10px] font-mono text-[#D1B46A]">
                            Level {ev.levelEarned} Earned
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#F5EFE4]">{ev.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <EvidenceFreshnessBadge
                        timestamp={ev.timestamp}
                        showRefreshButton={true}
                        onRefreshClick={() => openVerificationModal(ev.skillId)}
                      />
                    </div>
                  </div>

                  {/* Summary & Proof description */}
                  <p className="text-xs text-[#BDB5A7] leading-relaxed pt-3">
                    {ev.proofSummary}
                  </p>

                  {/* Expanded Proof Details */}
                  {(isFront || expandedId === ev.id) && (
                    <div className="mt-4 pt-3 border-t border-[#3A3B34] space-y-3 bg-[#20211E]/80 p-3.5 rounded-xl border border-[#3A3B34]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-[#A39F94] block uppercase">Related Skill</span>
                          <span className="text-[#F5EFE4] font-bold">{ev.skillName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A39F94] block uppercase">Verified By</span>
                          <span className="text-[#B4CCB8]">{ev.verifiedBy}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A39F94] block uppercase">Date Recorded</span>
                          <span className="text-[#A9B7D0]">{new Date(ev.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A39F94] block uppercase">Ledger Hash ID</span>
                          <span className="text-[#D1B46A] truncate block">{passport.passportId}#{ev.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#3A3B34]/60 text-[11px]">
                        <span className="text-[#9BB59F] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cryptographic assertions validated by Avenza Task Runner</span>
                        </span>
                        {onSelectEvidence && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvidence(ev);
                            }}
                            className="text-[#A9B7D0] hover:text-[#F5EFE4] flex items-center gap-1 hover:underline"
                          >
                            <span>Inspect raw telemetry</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Grid Table Ledger */}
      {viewMode === 'GRID' && (
        <div className="space-y-3">
          {evidenceItems.map((ev) => {
            const isExpanded = expandedId === ev.id;
            return (
              <div
                key={ev.id}
                onClick={() => toggleExpand(ev.id)}
                className="p-4 rounded-xl bg-[#242520] border border-[#3A3B34] hover:border-[#8798B7]/60 transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#20211E] border border-[#4A4A42]">
                      {getIcon(ev.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#A39F94]">{ev.type}</span>
                        <span className="text-[10px] font-mono text-[#9BB59F]">Level {ev.levelEarned} Earned</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#F5EFE4]">{ev.title}</h4>
                      <span className="text-[10px] text-[#A39F94]">{ev.verifiedBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <EvidenceFreshnessBadge timestamp={ev.timestamp} />
                    <button className="text-[#A39F94] hover:text-[#F5EFE4] p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#BDB5A7] leading-relaxed">
                  {ev.proofSummary}
                </p>

                {isExpanded && (
                  <div className="pt-3 border-t border-[#3A3B34] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-[#20211E] p-3 rounded-lg">
                    <div>
                      <span className="text-[10px] text-[#A39F94] block">SKILL ID</span>
                      <span className="text-[#F5EFE4]">{ev.skillId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A39F94] block">DATE</span>
                      <span className="text-[#F5EFE4]">{new Date(ev.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A39F94] block">LEVEL</span>
                      <span className="text-[#B4CCB8]">Level {ev.levelEarned}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A39F94] block">PASSPORT LEDGER ID</span>
                      <span className="text-[#D1B46A] truncate block">{passport.passportId}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
