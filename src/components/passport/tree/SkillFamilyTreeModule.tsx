import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAvenza } from '../../../state/AppContext';
import { EvidenceItem } from '../../../types';
import { buildSkillTreeData, TreeSkillNode } from './treeModel';
import { SkillTreeNodeCard } from './SkillTreeNodeCard';
import {
  GitBranch,
  CheckCircle2,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Zap,
  RefreshCw,
  Award,
} from 'lucide-react';

interface SkillFamilyTreeModuleProps {
  onOpenEvidenceDetail?: (evidence: EvidenceItem) => void;
}

export const SkillFamilyTreeModule: React.FC<SkillFamilyTreeModuleProps> = ({
  onOpenEvidenceDetail,
}) => {
  const { user, passport, skills, openVerificationModal, setActiveTab } = useAvenza();

  // Dynamic tree model derived from genuine state
  const treeData = useMemo(
    () => buildSkillTreeData(user, passport, skills),
    [user, passport, skills]
  );

  // Interaction State
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>('python-core');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({
    'fam-prog': true,
    'fam-data': true,
    'fam-ai': true,
  });

  // Level-up bloom feedback state
  const [bloomingSkillId, setBloomingSkillId] = useState<string | null>(null);

  // Relationship Ripple state (node IDs participating in current ripple)
  const [ripplingNodeIds, setRipplingNodeIds] = useState<string[]>([]);

  // Check for reduced motion preference directly
  const [prefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Controlled Intro Animation Sequence State
  const [revealStep, setRevealStep] = useState<number>(() => (prefersReducedMotion ? 7 : 0));
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered intro sequence on viewport entry
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer1 = setTimeout(() => setRevealStep(1), 100);  // Destination appears
    const timer2 = setTimeout(() => setRevealStep(2), 260);  // Connectors emerge (scaleY / scaleX)
    const timer3 = setTimeout(() => setRevealStep(3), 420);  // Families appear
    const timer4 = setTimeout(() => setRevealStep(4), 580);  // Skills emerge
    const timer5 = setTimeout(() => setRevealStep(5), 740);  // Verified nodes activate
    const timer6 = setTimeout(() => setRevealStep(6), 900);  // User position visible
    const timer7 = setTimeout(() => setRevealStep(7), 1060); // Next unlock illuminates

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, [prefersReducedMotion]);

  // Find currently selected node
  const selectedNode = useMemo(() => {
    if (!selectedSkillId) return null;
    for (const fam of treeData.families) {
      const found = fam.skills.find((s) => s.id === selectedSkillId);
      if (found) return found;
    }
    return null;
  }, [selectedSkillId, treeData]);

  // Active pathway node IDs (prerequisites + selected + enables)
  const activePathwayNodeIds = useMemo(() => {
    if (!selectedNode) return [];
    return [
      selectedNode.id,
      ...selectedNode.prerequisites,
      ...selectedNode.enablesSkills.map((e) => e.id),
      ...selectedNode.relatedSkills,
    ];
  }, [selectedNode]);

  // Trigger Relationship Ripple through connected pathway
  const triggerRelationshipRipple = useCallback((node: TreeSkillNode) => {
    if (prefersReducedMotion) return;
    const targets = [node.id, ...node.prerequisites, ...node.enablesSkills.map((e) => e.id)];
    setRipplingNodeIds(targets);
    setTimeout(() => {
      setRipplingNodeIds([]);
    }, 950);
  }, [prefersReducedMotion]);

  const handleSelectSkill = (skill: TreeSkillNode) => {
    setSelectedSkillId(skill.id);
    triggerRelationshipRipple(skill);
  };

  // Toggle family expansion
  const toggleFamily = (famId: string) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [famId]: !prev[famId],
    }));
  };

  const expandAll = () => {
    setExpandedFamilies({
      'fam-prog': true,
      'fam-data': true,
      'fam-ai': true,
    });
  };

  const collapseAll = () => {
    setExpandedFamilies({
      'fam-prog': false,
      'fam-data': false,
      'fam-ai': false,
    });
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.25, Math.max(0.85, Number((prev + delta).toFixed(2)))));
  };

  const resetView = () => {
    setZoomLevel(1);
    setSelectedSkillId('python-core');
    expandAll();
  };

  const focusNextUnlock = () => {
    if (treeData.nextUnlockNode) {
      setSelectedSkillId(treeData.nextUnlockNode.id);
      // Ensure family is expanded
      setExpandedFamilies((prev) => ({
        ...prev,
        [treeData.nextUnlockNode!.familyId]: true,
      }));
      triggerRelationshipRipple(treeData.nextUnlockNode);
    }
  };

  // Trigger verify / level-up flow
  const handleLevelUpAction = (skillId: string) => {
    setBloomingSkillId(skillId);
    setTimeout(() => {
      setBloomingSkillId(null);
      openVerificationModal(skillId);
    }, 550);
  };

  return (
    <div
      ref={containerRef}
      className="p-5 sm:p-7 rounded-2xl bg-[#282923] border border-[#4A4A42] space-y-6 shadow-xl relative overflow-hidden select-none"
    >
      {/* Background Spatial Grid Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#F5EFE4_1px,transparent_1px)] opacity-[0.025] [background-size:24px_24px] pointer-events-none" />

      {/* Screen reader only representation for full accessibility */}
      <div className="sr-only" aria-label="Skill Family Tree Hierarchy">
        <h3>Target Specialization: {treeData.destinationTitle}</h3>
        {treeData.families.map((fam) => (
          <div key={fam.id}>
            <h4>{fam.title}</h4>
            <ul>
              {fam.skills.map((s) => (
                <li key={s.id}>
                  {s.name} — Level {s.level} of {s.maxLevel} — {s.status} — {s.evidenceCount} evidence artifacts
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 01 — TREE HEADER & LIVE STATUS BAR                                    */}
      {/* ===================================================================== */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#3A3B34] pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1.5 rounded-lg bg-[#20211E] border border-[#4A4A42] text-[#9BB59F]">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5EFE4]">
              Skill Family Tree
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 font-bold">
              IMPROVE & LEVEL UP
            </span>
            <span className="text-[10px] font-mono text-[#A39F94] bg-[#20211E] px-2 py-0.5 rounded border border-[#3A3B34]">
              Living Capability Map
            </span>
          </div>
          <p className="text-xs text-[#A39F94] mt-1">
            See how your verified skills connect, unlock adjacent branches, and advance toward your target architecture
          </p>
        </div>

        {/* Live Metrics & Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap self-start lg:self-center">
          {/* Quick Metrics */}
          <div className="flex items-center gap-2 bg-[#20211E] px-3 py-1.5 rounded-xl border border-[#3A3B34] text-xs font-mono">
            <span className="text-[#A39F94]">Verified:</span>
            <span className="text-[#9BB59F] font-bold">
              {treeData.totalVerifiedCount}/{treeData.totalSkillsCount}
            </span>
            <span className="text-[#3A3B34]">•</span>
            <span className="text-[#A39F94]">Next Unlock:</span>
            <span className="text-[#E0C77F] font-bold">
              {treeData.nextUnlockNode ? treeData.nextUnlockNode.name.split(' ')[0] : 'None'}
            </span>
          </div>

          {/* Mini Toolbar */}
          <div className="flex items-center gap-1 bg-[#20211E] p-1 rounded-xl border border-[#3A3B34]">
            <button
              onClick={() => handleZoom(0.08)}
              title="Zoom In (+)"
              className="p-1.5 rounded-lg text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25] transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.08)}
              title="Zoom Out (-)"
              className="p-1.5 rounded-lg text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25] transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              title="Reset View (100%)"
              className="p-1.5 rounded-lg text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-[#3A3B34] mx-0.5" />
            <button
              onClick={expandAll}
              title="Expand All Families"
              className="px-2 py-1 rounded text-[10px] font-mono text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25] transition-colors"
            >
              Expand
            </button>
            <button
              onClick={collapseAll}
              title="Collapse All Families"
              className="px-2 py-1 rounded text-[10px] font-mono text-[#A39F94] hover:text-[#F5EFE4] hover:bg-[#2A2B25] transition-colors"
            >
              Fold
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 02 — NEXT UNLOCK SPOTLIGHT CALLOUT                                    */}
      {/* ===================================================================== */}
      {treeData.nextUnlockNode && (
        <div
          onClick={focusNextUnlock}
          className="relative z-10 p-3.5 rounded-xl bg-gradient-to-r from-[rgba(209,180,106,0.12)] via-[#242520] to-[#20211E] border border-[#D1B46A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-[#D1B46A] transition-all group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2E302B] border border-[#D1B46A] flex items-center justify-center text-[#D1B46A] flex-shrink-0 group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E0C77F]">
                  RECOMMENDED NEXT UNLOCK
                </span>
                <span className="text-[10px] font-mono text-[#A39F94]">
                  Prerequisites Met (Python L2 ✓)
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#F5EFE4] group-hover:text-[#E0C77F] transition-colors">
                {treeData.nextUnlockNode.name} — Target Level 2
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[11px] font-mono text-[#B4CCB8] flex items-center gap-1">
              <span>Focus in Tree</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 03 — INTERACTIVE TREE CANVAS VIEWPORT                                 */}
      {/* ===================================================================== */}
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: prefersReducedMotion ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative z-10 py-4 px-2 select-none"
      >
        {/* Level 01: Central Destination Root Node */}
        <div className="flex flex-col items-center">
          <div
            tabIndex={0}
            role="button"
            aria-label={`Root Destination: ${treeData.destinationTitle}`}
            style={{
              opacity: revealStep >= 1 ? 1 : 0,
              transform: revealStep >= 1 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-10px)',
              transition: prefersReducedMotion ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="group relative cursor-pointer px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#2E302B] via-[#32342E] to-[#2E302B] border-2 border-[#9BB59F]/60 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-[#9BB59F] hover:scale-[1.02] transition-all"
          >
            {/* Subtle glow aura */}
            <span className="absolute -inset-[1px] rounded-2xl bg-[#9BB59F]/20 blur-sm pointer-events-none group-hover:bg-[#9BB59F]/35 transition-all" />

            <div className="w-8 h-8 rounded-xl bg-[#20211E] border border-[#9BB59F]/50 flex items-center justify-center text-[#9BB59F] font-bold text-xs flex-shrink-0">
              <Award className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#B4CCB8]">
                  ROOT DESTINATION
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#20211E] text-[#F5EFE4] border border-[#4A4A42]">
                  {treeData.overallProgressPercent}% Formed
                </span>
              </div>
              <h2 className="text-sm font-black text-[#F5EFE4] tracking-tight">
                {treeData.destinationTitle}
              </h2>
            </div>
          </div>

          {/* Root Stem Line (grows down from root via scaleY) */}
          <div
            style={{
              opacity: revealStep >= 2 ? 1 : 0,
              transform: revealStep >= 2 ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top center',
              transition: prefersReducedMotion ? 'none' : 'all 0.4s ease-out',
            }}
            className="w-[2px] h-8 bg-gradient-to-b from-[#9BB59F] to-[#57584E]"
          />
        </div>

        {/* Tree Branch Splitter Crossbar (scales outward via scaleX) */}
        <div
          style={{
            opacity: revealStep >= 2 ? 1 : 0,
            transform: revealStep >= 2 ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center center',
            transition: prefersReducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
          className="relative max-w-4xl mx-auto hidden md:block"
        >
          {/* Horizontal crossbar connecting the three family branches */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#9BB59F]/80 via-[#8798B7]/80 to-[#D1B46A]/80 rounded-full" />
        </div>

        {/* Level 02: Skill Families Grid (Vertical on mobile, 3 Columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 max-w-5xl mx-auto items-start">
          {treeData.families.map((fam, famIdx) => {
            const isExpanded = expandedFamilies[fam.id] ?? true;
            const isFamilyFocused = selectedNode?.familyId === fam.id;

            return (
              <div
                key={fam.id}
                style={{
                  opacity: revealStep >= 3 ? 1 : 0,
                  transform: revealStep >= 3 ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(12px)',
                  transition: prefersReducedMotion
                    ? 'none'
                    : `all 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${famIdx * 80}ms`,
                }}
                className={`relative rounded-2xl p-4 border transition-all duration-300 ${
                  isFamilyFocused
                    ? 'bg-[#2E302B] border-[#9BB59F]/80 shadow-lg ring-1 ring-[#9BB59F]/40'
                    : 'bg-[#242520] border-[#3A3B34] hover:border-[#4A4A42]'
                }`}
              >
                {/* Branch Drop-Connector Line from Crossbar */}
                <div
                  style={{
                    opacity: revealStep >= 2 ? 1 : 0,
                    transform: revealStep >= 2 ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top center',
                    transition: prefersReducedMotion ? 'none' : 'all 0.35s ease-out',
                  }}
                  className={`hidden md:block absolute -top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 transition-colors ${
                    isFamilyFocused ? 'bg-[#9BB59F]' : 'bg-[#57584E]'
                  }`}
                />

                {/* Family Header Card with Accordion Toggle & Branch Wake-Up */}
                <div
                  onClick={() => toggleFamily(fam.id)}
                  className="flex items-center justify-between pb-3 border-b border-[#3A3B34] cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: fam.accentColor }}
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#F5EFE4] group-hover:text-[#B4CCB8] transition-colors">
                        {fam.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#A39F94]">
                        {fam.verifiedCount}/{fam.totalCount} Verified Competencies
                      </span>
                    </div>
                  </div>

                  <button
                    className="p-1 rounded-lg text-[#A39F94] group-hover:text-[#F5EFE4] transition-colors"
                    aria-label={`Toggle ${fam.title}`}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Staggered Skill Nodes in Family using SkillTreeNodeCard */}
                {isExpanded && (
                  <div className="space-y-3 pt-3">
                    {fam.skills.map((skill, sIdx) => {
                      const isSelected = selectedSkillId === skill.id;
                      const isBlooming = bloomingSkillId === skill.id;
                      const isPathActive = activePathwayNodeIds.includes(skill.id);
                      const isRippling = ripplingNodeIds.includes(skill.id);

                      return (
                        <SkillTreeNodeCard
                          key={skill.id}
                          skill={skill}
                          isSelected={isSelected}
                          isPathActive={isPathActive}
                          isRippling={isRippling}
                          isBlooming={isBlooming}
                          revealReady={revealStep >= 4}
                          staggerIndex={sIdx}
                          prefersReducedMotion={prefersReducedMotion}
                          onClick={() => handleSelectSkill(skill)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 04 — SELECTED NODE DETAILS DOCKED PANEL                               */}
      {/* ===================================================================== */}
      {selectedNode && (
        <div className="relative z-10 p-5 rounded-2xl bg-[#20211E] border border-[#3A3B34] space-y-4 shadow-inner animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A3B34] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#282923] border border-[#4A4A42] flex items-center justify-center font-bold text-xs text-[#9BB59F] flex-shrink-0">
                L{selectedNode.level}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A39F94]">
                    {selectedNode.category}
                  </span>
                  {selectedNode.verified ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-[#9BB59F]" />
                      VERIFIED ON IMMUTABLE LEDGER
                    </span>
                  ) : selectedNode.status === 'NEXT_UNLOCK' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(209,180,106,0.16)] text-[#E0C77F] border border-[#D1B46A]/40 font-bold">
                      AVAILABLE NEXT UNLOCK
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2E302B] text-[#A39F94] border border-[#4A4A42]">
                      {selectedNode.status}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#F5EFE4] mt-0.5">{selectedNode.name}</h4>
              </div>
            </div>

            {/* Contextual Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Level Up / Verify Again */}
              <button
                onClick={() => handleLevelUpAction(selectedNode.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#2E302B] hover:bg-[#373832] border border-[#9BB59F]/60 text-xs font-mono font-bold text-[#B4CCB8] flex items-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{selectedNode.verified ? 'Level Up / Verify Again' : 'Begin Assessment'}</span>
              </button>

              {/* View Attached Evidence if verified */}
              {selectedNode.evidenceItems.length > 0 && onOpenEvidenceDetail && (
                <button
                  onClick={() => onOpenEvidenceDetail(selectedNode.evidenceItems[0])}
                  className="px-3 py-1.5 rounded-xl bg-[#242520] hover:bg-[#2A2B25] border border-[#3A3B34] text-xs font-mono text-[#8798B7] hover:text-[#F5EFE4] flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Proof Artifact ({selectedNode.evidenceCount})</span>
                </button>
              )}

              {/* Practice in Lab */}
              <button
                onClick={() => setActiveTab('missions')}
                className="px-3 py-1.5 rounded-xl bg-[#242520] hover:bg-[#2A2B25] border border-[#3A3B34] text-xs font-mono text-[#A39F94] hover:text-[#F5EFE4] flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Practice in Lab</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[#BDB5A7] leading-relaxed">
            {selectedNode.description || selectedNode.whyItMatters}
          </p>

          {/* Dependency & Relational Pathway Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            {/* Box 1: Verified Timeline / Status */}
            <div className="p-3 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-1">
              <span className="text-[10px] text-[#A39F94] block uppercase">Ledger Verification</span>
              <span className="text-[#F5EFE4] font-medium">
                {selectedNode.verifiedDate ? `Verified on ${selectedNode.verifiedDate}` : 'Pending Assessment'}
              </span>
            </div>

            {/* Box 2: Prerequisites */}
            <div className="p-3 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-1">
              <span className="text-[10px] text-[#A39F94] block uppercase">Prerequisite Requirements</span>
              <span className={selectedNode.prerequisitesMet ? 'text-[#9BB59F]' : 'text-[#D1B46A]'}>
                {selectedNode.prerequisites.length > 0
                  ? selectedNode.prerequisites.join(', ')
                  : 'Foundational Root (None Required)'}
              </span>
            </div>

            {/* Box 3: What This Skill Enables */}
            <div className="p-3 rounded-xl bg-[#242520] border border-[#3A3B34] space-y-1">
              <span className="text-[10px] text-[#A39F94] block uppercase">Enables / Unlocks Next</span>
              <span className="text-[#8798B7]">
                {selectedNode.enablesSkills.length > 0
                  ? selectedNode.enablesSkills.map((e) => e.name).join(', ')
                  : selectedNode.relatedSkills.length > 0
                  ? `Branches to ${selectedNode.relatedSkills[0]}`
                  : 'Specialization Core'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
