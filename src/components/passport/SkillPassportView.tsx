import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { EvidenceItem } from '../../types';
import { PassportHeroCard } from './PassportHeroCard';
import { SharePassportModal } from './SharePassportModal';
import { VerificationSealBadge } from './VerificationSealBadge';
import { EvidenceFreshnessBadge } from './EvidenceFreshnessBadge';
import { ProofChainView } from './ProofChainView';
import { ProofVaultView } from './ProofVaultView';
import { SkillDNAView } from './SkillDNAView';
import { CapabilityMapView } from './CapabilityMapView';
import { WhatCanIBuildView } from './WhatCanIBuildView';
import { NextUnlockView } from './NextUnlockView';
import { SkillFamilyTreeView } from './SkillFamilyTreeView';
import { SkillFamilyTreeModule } from './tree/SkillFamilyTreeModule';
import { AIPassportSummary } from './AIPassportSummary';
import { PassportStoryView } from './PassportStoryView';
import { ProofEvolutionView } from './ProofEvolutionView';
import { SkillJourneyConnectionModal } from './SkillJourneyConnectionModal';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { Button } from '../../design-system/Button';
import {
  ShieldCheck,
  FileText,
  BadgeCheck,
  Compass,
  RefreshCw,
  Sparkles,
  Layers,
  Network,
  GitBranch,
  History,
  Search,
  ExternalLink,
} from 'lucide-react';

type PassportTab = 'OVERVIEW' | 'PROOF_CHAIN' | 'CAPABILITIES' | 'GROWTH';

export const SkillPassportView: React.FC = () => {
  const { passport, user, skills, openVerificationModal } = useAvenza();

  // Navigation & Progressive Disclosure State
  const [activeTab, setActiveTab] = useState<PassportTab>('OVERVIEW');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inspectingEvidence, setInspectingEvidence] = useState<EvidenceItem | null>(null);

  // Journey origin preview modal state
  const [journeySkillModal, setJourneySkillModal] = useState<{
    isOpen: boolean;
    skillName: string;
    skillLevel: number;
  }>({
    isOpen: false,
    skillName: '',
    skillLevel: 2,
  });

  // Competency search & filter
  const [searchQuery, setSearchQuery] = useState('');

  // Re-verification active scan pulse state
  const [scanningSkillId, setScanningSkillId] = useState<string | null>(null);

  const handleTriggerReverification = (skillName: string) => {
    // Find skill ID in taxonomy
    const matchedEntry = Object.entries(skills).find(
      ([id, s]) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    const skillId = matchedEntry ? matchedEntry[0] : 'python-core';

    setScanningSkillId(skillId);
    setTimeout(() => {
      setScanningSkillId(null);
      openVerificationModal(skillId);
    }, 600);
  };

  const handleOpenJourneyOrigin = (skillName: string, level: number) => {
    setJourneySkillModal({
      isOpen: true,
      skillName,
      skillLevel: level,
    });
  };

  // Filter competencies based on query
  const filteredCompetencies = passport.demonstratedCompetencies.filter((comp) =>
    comp.skillName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 select-text max-w-7xl mx-auto">
      {/* 01 — Top Physical Digital Passport Hero (Local 3D Object with Layered Depth & Tilt Physics) */}
      <PassportHeroCard
        onShareClick={() => setIsShareModalOpen(true)}
      />

      {/* 02 — Section Navigation / Progressive Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#242520] p-1.5 rounded-2xl border border-[#3A3B34] shadow-md">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#373832] text-[#F5EFE4] border border-[#9BB59F]/60 shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#9BB59F]" />
            <span>Overview & Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('PROOF_CHAIN')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'PROOF_CHAIN'
                ? 'bg-[#373832] text-[#F5EFE4] border border-[#8798B7]/60 shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#8798B7]" />
            <span>Proof Chain & Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('CAPABILITIES')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'CAPABILITIES'
                ? 'bg-[#373832] text-[#F5EFE4] border border-[#D1B46A]/60 shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25]'
            }`}
          >
            <Network className="w-4 h-4 text-[#D1B46A]" />
            <span>Capability Map & DNA</span>
          </button>

          <button
            onClick={() => setActiveTab('GROWTH')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'GROWTH'
                ? 'bg-[#373832] text-[#F5EFE4] border border-[#A79BC4]/60 shadow-sm'
                : 'text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25]'
            }`}
          >
            <GitBranch className="w-4 h-4 text-[#BDB2D6]" />
            <span>Hierarchy & Journey Story</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#A39F94] px-3 hidden lg:block">
          Passport Status: <span className="text-[#9BB59F] font-bold">VERIFIED LEDGER</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: OVERVIEW & LEDGER                                                */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* AI Passport Summary & Next Unlock Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7">
              <AIPassportSummary />
            </div>
            <div className="lg:col-span-5">
              <NextUnlockView />
            </div>
          </div>

          {/* Demonstrated Competencies Matrix (Enhanced Foundation) */}
          <div className="p-6 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A3B34] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#20211E] border border-[#3A3B34]">
                  <ShieldCheck className="w-5 h-5 text-[#9BB59F]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4]">
                    Demonstrated Competencies Matrix
                  </h3>
                  <span className="text-xs text-[#A39F94]">
                    What this user has actually proven with executable proof
                  </span>
                </div>
              </div>

              {/* Live search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A39F94] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter verified competencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#20211E] border border-[#3A3B34] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F5EFE4] placeholder-[#64625A] focus:outline-none focus:border-[#9BB59F] font-mono transition-colors"
                />
              </div>
            </div>

            {/* List of Verified Competency Cards with 3D Physics */}
            <div className="space-y-3">
              {filteredCompetencies.map((comp, idx) => {
                const matchedSkillEntry = Object.entries(skills).find(
                  ([id, s]) => s.name.toLowerCase() === comp.skillName.toLowerCase()
                );
                const skillId = matchedSkillEntry ? matchedSkillEntry[0] : 'python-core';
                const isScanning = scanningSkillId === skillId;

                return (
                  <div
                    key={idx}
                    className={`relative overflow-hidden p-4 rounded-xl bg-[#242520] border border-[#3A3B34] hover:border-[#9BB59F]/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                      isScanning ? 'ring-2 ring-[#9BB59F] bg-[#2E302B]' : ''
                    }`}
                  >
                    {/* Local verification scan pulse */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9BB59F]/20 to-transparent pointer-events-none animate-[passportScan_0.8s_ease-in-out_infinite]" />
                    )}

                    {/* Skill Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#20211E] text-[#B4CCB8] flex items-center justify-center font-bold text-xs border border-[#4A4A42] flex-shrink-0 group-hover:border-[#9BB59F] transition-colors">
                        L{comp.level}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#F5EFE4] group-hover:text-[#B4CCB8] transition-colors">
                            {comp.skillName}
                          </h4>
                          <VerificationSealBadge
                            level={comp.level}
                            evidenceCount={comp.evidenceCount}
                            size="sm"
                          />
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-[#A39F94] flex-wrap">
                          <span>
                            Verified on <strong className="text-[#F5EFE4] font-mono">{comp.verifiedDate}</strong>
                          </span>
                          <span>•</span>
                          <span>{comp.evidenceCount} proof artifact attached</span>
                          <span>•</span>
                          <EvidenceFreshnessBadge timestamp={comp.verifiedDate} />
                        </div>
                      </div>
                    </div>

                    {/* Quick Contextual Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                      {/* See Where This Skill Came From */}
                      <button
                        onClick={() => handleOpenJourneyOrigin(comp.skillName, comp.level)}
                        className="px-2.5 py-1 rounded-lg bg-[#20211E] hover:bg-[#2E302B] border border-[#3A3B34] hover:border-[#8798B7] text-[11px] font-mono text-[#A9B7D0] hover:text-[#F5EFE4] flex items-center gap-1.5 transition-all"
                        title="See where this skill came from on your journey"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#8798B7]" />
                        <span>Journey Origin</span>
                      </button>

                      {/* Verify Again */}
                      <button
                        onClick={() => handleTriggerReverification(comp.skillName)}
                        className="px-3 py-1 rounded-lg bg-[#2E302B] hover:bg-[#373832] border border-[#4A4A42] hover:border-[#9BB59F] text-[11px] font-mono text-[#B4CCB8] flex items-center gap-1.5 transition-all shadow-sm"
                        title="Refresh this evidence by retaking the diagnostic assessment"
                      >
                        <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                        <span>Verify Again</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 03 — NEW: SKILL FAMILY TREE (LIVING SKILL MAP — IMPROVE & LEVEL UP) */}
          <SkillFamilyTreeModule
            onOpenEvidenceDetail={(ev) => setInspectingEvidence(ev)}
          />

          {/* Verifiable Evidence Ledger (Foundation Preserved & Upgraded) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A3B34] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8798B7]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EFE4]">
                  Verifiable Evidence Ledger ({passport.evidenceLedger.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#A39F94] font-mono">
                Cryptographically verifiable test outputs & benchmarks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passport.evidenceLedger.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setInspectingEvidence(ev)}
                  className="p-4 rounded-xl bg-[#282923] border border-[#4A4A42] hover:border-[#8798B7] space-y-3 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#20211E] border border-[#3A3B34]">
                        <ShieldCheck className="w-4 h-4 text-[#9BB59F]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#F5EFE4] group-hover:text-[#B4CCB8] transition-colors">
                          {ev.title}
                        </h4>
                        <span className="text-[10px] text-[#A39F94]">{ev.verifiedBy}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#B4CCB8]">
                        Level {ev.levelEarned} Earned
                      </span>
                      <div className="text-[10px] text-[#A39F94] font-mono">
                        {new Date(ev.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#BDB5A7] leading-relaxed bg-[#242520] p-3 rounded-lg border border-[#3A3B34] group-hover:border-[#4A4A42] transition-colors">
                    {ev.proofSummary}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#A39F94]">
                    <EvidenceFreshnessBadge timestamp={ev.timestamp} />
                    <span className="text-[#8798B7] font-mono group-hover:underline flex items-center gap-1">
                      <span>Inspect raw proof</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: PROOF CHAIN & PROOF VAULT                                        */}
      {/* ========================================================================= */}
      {activeTab === 'PROOF_CHAIN' && (
        <div className="space-y-6">
          {/* Interactive Proof Chain */}
          <ProofChainView
            onOpenEvidenceDetail={(ev) => setInspectingEvidence(ev)}
          />

          {/* Layered Proof of Work Archive */}
          <ProofVaultView
            onSelectEvidence={(ev) => setInspectingEvidence(ev)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: CAPABILITY MAP & SKILL DNA                                       */}
      {/* ========================================================================= */}
      {activeTab === 'CAPABILITIES' && (
        <div className="space-y-6">
          {/* Spatial Compound Capability Network */}
          <CapabilityMapView />

          {/* Concrete Production Blueprints ("What Can I Actually Build?") */}
          <WhatCanIBuildView />

          {/* Spatial Skill DNA Fingerprint */}
          <SkillDNAView />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: GROWTH, HIERARCHY & JOURNEY STORY                                */}
      {/* ========================================================================= */}
      {activeTab === 'GROWTH' && (
        <div className="space-y-6">
          {/* Skill Family Tree (Living Skill Map) */}
          <SkillFamilyTreeModule
            onOpenEvidenceDetail={(ev) => setInspectingEvidence(ev)}
          />

          {/* Interactive Proof Evolution Scrubber */}
          <ProofEvolutionView />

          {/* Passport Story ("Your Avenza Journey") */}
          <PassportStoryView />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS & DRAWERS (Preserving existing sharing & lineage)                   */}
      {/* ========================================================================= */}
      <SharePassportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <SkillJourneyConnectionModal
        isOpen={journeySkillModal.isOpen}
        onClose={() => setJourneySkillModal((prev) => ({ ...prev, isOpen: false }))}
        skillName={journeySkillModal.skillName}
        skillLevel={journeySkillModal.skillLevel}
      />

      <EvidenceDetailModal
        evidence={inspectingEvidence}
        isOpen={inspectingEvidence !== null}
        onClose={() => setInspectingEvidence(null)}
        passportId={passport.passportId}
      />
    </div>
  );
};
