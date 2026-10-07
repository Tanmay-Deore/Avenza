import React, { useState, useRef, useCallback } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Button } from '../../design-system/Button';
import {
  Award,
  ShieldCheck,
  Share2,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Fingerprint,
  Radio,
  FileCheck,
} from 'lucide-react';

interface PassportHeroCardProps {
  onShareClick: () => void;
  onExploreDNA?: () => void;
}

export const PassportHeroCard: React.FC<PassportHeroCardProps> = ({
  onShareClick,
  onExploreDNA,
}) => {
  const { passport, user } = useAvenza();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Physics State (Local, strictly scoped to this card)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Authentication scan moment state
  const [authStep, setAuthStep] = useState<'IDLE' | 'SCANNING' | 'VERIFYING' | 'CONFIRMED'>('IDLE');

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Strict 3-5 degrees maximum rotation as specified
    const rY = ((x - centerX) / centerX) * 4.5;
    const rX = -((y - centerY) / centerY) * 4.0;

    setRotateX(rX);
    setRotateY(rY);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    setRotateX(0);
    setRotateY(0);
  }, []);

  const triggerAuthScan = () => {
    if (authStep !== 'IDLE') return;
    setAuthStep('SCANNING');
    setTimeout(() => {
      setAuthStep('VERIFYING');
      setTimeout(() => {
        setAuthStep('CONFIRMED');
        setTimeout(() => setAuthStep('IDLE'), 2800);
      }, 700);
    }, 700);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full select-none"
    >
      {/* Physical Digital Passport Object with Layered Edge Depth */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onClick={triggerAuthScan}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${
            isPressed ? '2px' : isHovered ? '-5px' : '0px'
          }) scale(${isPressed ? 0.99 : 1})`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#2E302B] via-[#282923] to-[#20211E] border border-[#4A4A42] shadow-2xl transition-shadow duration-300 hover:shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
      >
        {/* Layer 1: Ambient Depth Edge Highlight */}
        <div
          style={{ transform: 'translateZ(1px)' }}
          className="absolute inset-0 rounded-2xl pointer-events-none border border-[#64625A]/25"
        />

        {/* Layer 2: Subtle Tactical Grid & Physical Fiber Texture */}
        <div
          style={{ transform: 'translateZ(2px)' }}
          className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#F5EFE4_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Layer 3: Dynamic Pointer-Following Soft Light on Material */}
        <div
          style={{
            transform: 'translateZ(6px)',
            background: isHovered
              ? `radial-gradient(circle 380px at ${50 + rotateY * 8}% ${
                  50 - rotateX * 8
                }%, rgba(245, 239, 228, 0.08), transparent 70%)`
              : 'none',
          }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        />

        {/* Layer 4: Verification Scan Line (Authentication Moment) */}
        {authStep !== 'IDLE' && (
          <div
            style={{ transform: 'translateZ(18px)' }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-30"
          >
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#9BB59F] to-transparent shadow-[0_0_16px_#9BB59F] animate-[passportScan_1.8s_ease-in-out_infinite]" />
            <div className="absolute top-3 right-4 px-2.5 py-1 rounded bg-[#20211E]/90 border border-[#9BB59F] text-[#B4CCB8] text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9BB59F] animate-ping" />
              <span>
                {authStep === 'SCANNING' && 'AUTHENTICATING LEDGER...'}
                {authStep === 'VERIFYING' && 'CRYPTOGRAPHIC SIGNATURE CONFIRMED'}
                {authStep === 'CONFIRMED' && 'OFFICIAL PASSPORT VERIFIED'}
              </span>
            </div>
          </div>
        )}

        {/* Content Layers with Subtle Parallax Separation */}
        <div className="relative z-10 space-y-6">
          {/* Header Row: Identity & Status */}
          <div
            style={{ transform: 'translateZ(12px)' }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#3A3B34]"
          >
            <div className="flex items-start gap-4">
              {/* Embossed Physical Credential Icon with Inner Glow */}
              <div
                style={{ transform: 'translateZ(14px)' }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#373832] to-[#282923] border border-[#57584E] flex items-center justify-center text-[#9BB59F] shadow-lg flex-shrink-0 relative overflow-hidden group-hover:border-[#9BB59F]/60 transition-colors"
              >
                <div className="absolute inset-0 bg-[#9BB59F]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Award className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-105" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[rgba(155,181,159,0.16)] text-[#B4CCB8] border border-[#9BB59F]/40 flex items-center gap-1">
                    <Fingerprint className="w-3 h-3 text-[#9BB59F]" />
                    Official Skill Passport
                  </span>
                  <span className="text-xs font-mono text-[#A39F94] bg-[#242520] px-2 py-0.5 rounded border border-[#3A3B34]">
                    {passport.passportId}
                  </span>
                  <span className="text-[10px] text-[#8798B7] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8798B7]" />
                    Living Ledger
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#F5EFE4] tracking-tight flex items-center gap-2">
                  <span>{user.name}</span>
                </h2>

                <p className="text-xs text-[#A9B7D0] font-medium flex items-center gap-1.5">
                  <span className="text-[#A39F94]">Target Specialization:</span>
                  <span className="text-[#F5EFE4] font-semibold">
                    {user.currentGoal?.targetRoleOrSkill || 'AI Engineer'}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions & Interactive Status */}
            <div
              style={{ transform: 'translateZ(15px)' }}
              className="flex items-center gap-3 self-start md:self-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="primary"
                onClick={onShareClick}
                leftIcon={<Share2 className="w-4 h-4" />}
                className="shadow-md hover:shadow-lg transition-all"
              >
                Share Verified Passport
              </Button>
            </div>
          </div>

          {/* Stats Summary Grid with Tactile Card Separation */}
          <div
            style={{ transform: 'translateZ(10px)' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {/* Stat 1: Verified Skills */}
            <div className="p-3.5 rounded-xl bg-[#242520]/90 backdrop-blur-sm border border-[#3A3B34] hover:border-[#9BB59F]/50 transition-colors">
              <span className="text-[11px] text-[#A39F94] uppercase font-semibold tracking-wider flex items-center justify-between">
                <span>Verified Skills</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#9BB59F]" />
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#B4CCB8] mt-1">
                {passport.verifiedSkillsCount}
              </div>
              <span className="text-[10px] text-[#A39F94] block mt-0.5">proven by assessment</span>
            </div>

            {/* Stat 2: Evidence Items */}
            <div className="p-3.5 rounded-xl bg-[#242520]/90 backdrop-blur-sm border border-[#3A3B34] hover:border-[#8798B7]/50 transition-colors">
              <span className="text-[11px] text-[#A39F94] uppercase font-semibold tracking-wider flex items-center justify-between">
                <span>Evidence Items</span>
                <FileCheck className="w-3.5 h-3.5 text-[#8798B7]" />
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#A9B7D0] mt-1">
                {passport.evidenceLedger.length}
              </div>
              <span className="text-[10px] text-[#A39F94] block mt-0.5">test runs & artifacts</span>
            </div>

            {/* Stat 3: Completed Missions */}
            <div className="p-3.5 rounded-xl bg-[#242520]/90 backdrop-blur-sm border border-[#3A3B34] hover:border-[#A79BC4]/50 transition-colors">
              <span className="text-[11px] text-[#A39F94] uppercase font-semibold tracking-wider flex items-center justify-between">
                <span>Completed Missions</span>
                <Sparkles className="w-3.5 h-3.5 text-[#BDB2D6]" />
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#BDB2D6] mt-1">
                {passport.completedMissionsCount}
              </div>
              <span className="text-[10px] text-[#A39F94] block mt-0.5">practical coding labs</span>
            </div>

            {/* Stat 4: Issued Date */}
            <div className="p-3.5 rounded-xl bg-[#242520]/90 backdrop-blur-sm border border-[#3A3B34] hover:border-[#D1B46A]/50 transition-colors">
              <span className="text-[11px] text-[#A39F94] uppercase font-semibold tracking-wider flex items-center justify-between">
                <span>Issued Date</span>
                <Calendar className="w-3.5 h-3.5 text-[#D1B46A]" />
              </span>
              <div className="text-xs sm:text-sm font-bold font-mono text-[#F5EFE4] mt-1.5">
                {new Date(passport.issuedDate).toLocaleDateString()}
              </div>
              <span className="text-[10px] text-[#A39F94] block mt-0.5">permanent ledger</span>
            </div>
          </div>
        </div>

        {/* Subtle click prompt hint */}
        <div className="pt-2 text-right">
          <span className="text-[9px] font-mono text-[#64625A] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            • Click credential to trigger cryptographic authentication scan •
          </span>
        </div>
      </div>
    </div>
  );
};
