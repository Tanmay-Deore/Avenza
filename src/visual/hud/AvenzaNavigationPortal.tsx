import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Compass,
  Layers,
  Map,
  Bot,
  Sparkles,
  Zap,
  Award,
  RotateCcw,
} from 'lucide-react';
import { useAvenza } from '../../state/AppContext';

interface PortalItemConfig {
  id: string;
  label: string;
  cue: string;
  defaultHint: string;
  color: string;
  accentBg: string;
  iconType: 'layers' | 'map' | 'bot' | 'sparkles' | 'zap' | 'award';
}

const PORTAL_ITEMS_CONFIG: PortalItemConfig[] = [
  {
    id: 'skills',
    label: '01. Skill Map',
    cue: 'STRUCTURE',
    defaultHint: 'MAP YOUR SKILLS',
    color: '#4F6288',
    accentBg: 'rgba(79, 98, 136, 0.12)',
    iconType: 'layers',
  },
  {
    id: 'journey',
    label: '02. Learning Route',
    cue: 'DIRECTION',
    defaultHint: 'BUILD YOUR PATH',
    color: '#4C6650',
    accentBg: 'rgba(76, 102, 80, 0.12)',
    iconType: 'map',
  },
  {
    id: 'mentor',
    label: '03. AI Mentor',
    cue: 'GUIDANCE',
    defaultHint: 'GET GUIDANCE',
    color: '#5E5277',
    accentBg: 'rgba(94, 82, 119, 0.12)',
    iconType: 'bot',
  },
  {
    id: 'discover',
    label: '04. Discovery Compass',
    cue: 'EXPLORE',
    defaultHint: 'EXPLORE CAREERS',
    color: '#8A5440',
    accentBg: 'rgba(138, 84, 64, 0.12)',
    iconType: 'sparkles',
  },
  {
    id: 'missions',
    label: '05. Practical Labs',
    cue: 'ACTION',
    defaultHint: 'PRACTICE SKILLS',
    color: '#4C6650',
    accentBg: 'rgba(76, 102, 80, 0.12)',
    iconType: 'zap',
  },
  {
    id: 'passport',
    label: '06. Skill Passport',
    cue: 'PROOF',
    defaultHint: 'VIEW PROOFS',
    color: '#4F6288',
    accentBg: 'rgba(79, 98, 136, 0.12)',
    iconType: 'award',
  },
];

const PORTAL_KEYFRAME_STYLES = `
@keyframes portalScannerSweep {
  0% {
    transform: translateX(-120%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(180%);
    opacity: 0;
  }
}
@keyframes launchVectorPulse {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.32;
    transform: scale(1.02);
  }
  100% {
    opacity: 0;
    transform: scale(1.06);
  }
}
@keyframes signalRippleWave {
  0% {
    transform: scale(0.85);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
@keyframes ringVerificationDraw {
  0% {
    stroke-dashoffset: 44;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .portal-reduced-motion,
  .portal-reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}
`;

interface AvenzaNavigationPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
  activeModuleId?: string | null;
}

export const AvenzaNavigationPortal: React.FC<AvenzaNavigationPortalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  activeModuleId,
}) => {
  const { user, skills, journey, missions, passport, activeTab, resetAllData } = useAvenza();
  const [phase, setPhase] = useState<'entering' | 'ready' | 'launching' | 'closing'>('entering');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Compute live contextual data hints (Idea 08 & 17)
  const itemsWithLiveHints = useMemo(() => {
    const skillsCount = Object.keys(skills || {}).length;
    const journeyCount = (journey || []).length;
    const missionsCount = Object.keys(missions || {}).length;
    const verifiedCount = passport?.verifiedSkillsCount ?? passport?.evidenceLedger?.length ?? 3;

    return PORTAL_ITEMS_CONFIG.map((item) => {
      let hint = item.defaultHint;
      if (item.id === 'skills' && skillsCount > 0) {
        hint = `${skillsCount} SKILLS TRACKED`;
      } else if (item.id === 'journey' && journeyCount > 0) {
        hint = `${journeyCount} PATH MILESTONES`;
      } else if (item.id === 'missions' && missionsCount > 0) {
        hint = `${missionsCount} PRACTICAL LABS`;
      } else if (item.id === 'passport') {
        hint = `${verifiedCount} VERIFIED PROOFS`;
      }
      return { ...item, hint };
    });
  }, [skills, journey, missions, passport]);

  // Transition from entering to ready after assembly sequence (Idea 01 & 42)
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      setPhase('ready');
    }, 640);
    return () => {
      window.clearTimeout(timer);
      setPhase('entering');
      setSelectedId(null);
      setHoveredId(null);
    };
  }, [isOpen]);

  // Safe Close Handler with reverse transition (Idea 13 & 27)
  const handleSafeClose = useCallback(() => {
    if (phase === 'closing') return;
    setPhase('closing');
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose, phase]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard accessibility: Escape key to close (Idea 52)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSafeClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSafeClose]);

  // Launch Destination Animation (Idea 06 & 14)
  const handleCardClick = (id: string) => {
    if (phase === 'launching' || phase === 'closing') return;
    setSelectedId(id);
    setPhase('launching');

    // 240ms visual launch vector feedback before portal closes and destination opens
    window.setTimeout(() => {
      onClose();
      onSelectModule(id);
    }, 240);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Avenza Navigation Portal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none outline-none portal-reduced-motion"
    >
      <style>{PORTAL_KEYFRAME_STYLES}</style>

      {/* 1. Backdrop with Smooth Local Darkening (Idea 01) */}
      <div
        onClick={handleSafeClose}
        aria-hidden="true"
        className="absolute inset-0 bg-[#1A1B18]/65 backdrop-blur-md transition-opacity duration-300"
        style={{
          opacity: phase === 'entering' ? 0.3 : phase === 'closing' ? 0 : 1,
        }}
      />

      {/* 2. Portal Modal Container (Idea 01 & 09) */}
      <div
        ref={modalRef}
        className="relative max-w-md w-full rounded-2xl bg-[#F8F4EC] dark:bg-[#242520] border border-[#D8CCB9] dark:border-[#3B3E36] p-6 shadow-2xl space-y-4.5 transition-all duration-300"
        style={{
          boxShadow:
            '0 28px 64px -12px rgba(18, 16, 12, 0.55), 0 12px 28px -6px rgba(18, 16, 12, 0.35), inset 0 1px 1px 0 rgba(255, 250, 240, 0.16)',
          transform:
            phase === 'entering'
              ? 'scale(0.965) translateY(8px)'
              : phase === 'closing'
              ? 'scale(0.97) translateY(4px)'
              : phase === 'launching'
              ? 'scale(0.995)'
              : 'scale(1) translateY(0)',
          opacity: phase === 'entering' ? 0.4 : phase === 'closing' ? 0 : 1,
          transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out',
        }}
      >
        {/* Subtle optical reflection sheen on smoked glass surface */}
        <div
          aria-hidden="true"
          className="absolute -top-[40%] -left-[40%] w-[180%] h-[180%] pointer-events-none rounded-2xl overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 60% 30% at 30% 25%, rgba(255, 248, 235, 0.05) 0%, transparent 60%)',
          }}
        />

        {/* 3. Header: Appears first with subtle slide & settle (Idea 01 & 12) */}
        <div
          className="flex items-center justify-between border-b border-[#D8CCB9] dark:border-[#3B3E36] pb-3.5 transition-all duration-300"
          style={{
            transform: phase === 'entering' ? 'translateY(-6px)' : 'translateY(0)',
            opacity: phase === 'entering' ? 0.4 : 1,
          }}
        >
          <div className="flex items-center gap-2.5">
            {/* Compass Beacon Icon */}
            <div className="w-6 h-6 rounded-lg bg-[#20211E]/5 dark:bg-white/5 flex items-center justify-center border border-[#D8CCB9]/60 dark:border-[#3B3E36]/60">
              <Compass className="w-4 h-4 text-[#20211E] dark:text-[#F4EDE1]" />
            </div>

            <h3 className="font-bold text-xs sm:text-sm font-mono tracking-wider text-[#20211E] dark:text-[#F4EDE1]">
              AVENZA NAVIGATION PORTAL
            </h3>

            {/* Subtle Command System Status (Idea 12 & 15) */}
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1.5 px-2 py-0.5 rounded-full bg-[#20211E]/5 dark:bg-white/5 border border-[#D8CCB9]/40 dark:border-[#3B3E36]/50 text-[9px] font-mono text-[#64625A] dark:text-[#9FB0D3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4C6650] dark:bg-[#78A480]" />
              SYS // READY
            </span>
          </div>

          {/* Close Control (Idea 13 & 28) */}
          <button
            type="button"
            onClick={handleSafeClose}
            aria-label="Close portal modal"
            className="text-[11px] font-mono text-[#64625A] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-white px-2 py-1 rounded transition-colors focus-visible:ring-1 focus-visible:ring-[#8FA2C2]/60 outline-none"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* 4. 2-Column Module Card Grid with Staggered Entrance (Idea 02 & 03) */}
        <div className="grid grid-cols-2 gap-2.5 perspective-[1000px]">
          {itemsWithLiveHints.map((item, index) => {
            const isSelected = selectedId === item.id;
            const isHovered = hoveredId === item.id;
            const isAnyHovered = hoveredId !== null;
            // Active destination detection from activeModuleId or activeTab (Idea 10)
            const isActiveDestination = activeModuleId
              ? activeModuleId === item.id
              : activeTab === item.id;
            const staggerDelay = 180 + index * 55; // 55ms stagger (Idea 09)

            return (
              <PortalCard
                key={item.id}
                item={item}
                index={index}
                staggerDelay={staggerDelay}
                isSelected={isSelected}
                isHovered={isHovered}
                isAnyHovered={isAnyHovered}
                isActiveDestination={isActiveDestination}
                isPortalEntering={phase === 'entering'}
                isPortalLaunching={phase === 'launching'}
                onClick={() => handleCardClick(item.id)}
                onHoverChange={(hovering) => setHoveredId(hovering ? item.id : null)}
              />
            );
          })}
        </div>

        {/* 5. Footer: Settles last (Idea 01, 12, 24, 26) */}
        <div
          className="pt-2.5 border-t border-[#D8CCB9] dark:border-[#3B3E36] flex items-center justify-between text-xs text-[#64625A] dark:text-[#BDB5A6] transition-all duration-300"
          style={{
            transform: phase === 'entering' ? 'translateY(6px)' : 'translateY(0)',
            opacity: phase === 'entering' ? 0.3 : 1,
            transitionDelay: '480ms',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-tight">
              User: {user?.name || 'Alex Morgan'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset demo state to initial fresh status?')) {
                  resetAllData();
                  handleSafeClose();
                }
              }}
              className="text-[#8A5440] hover:text-[#B16F55] flex items-center gap-1.5 font-medium transition-colors text-xs group outline-none focus-visible:ring-1 focus-visible:ring-[#8A5440]/60 rounded px-1"
            >
              <RotateCcw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-rotate-180" />
              <span>Reset Demo</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A877E] dark:text-[#787A6E] pt-1.5 border-t border-[#D8CCB9]/40 dark:border-[#3B3E36]/40">
            <span>AVENZA // LEGAL</span>
            <div className="flex items-center gap-3">
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  handleSafeClose();
                  window.history.pushState({}, '', '/privacy');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="hover:text-[#20211E] dark:hover:text-[#F4EDE1] underline underline-offset-2"
              >
                Privacy
              </a>
              <span>•</span>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  handleSafeClose();
                  window.history.pushState({}, '', '/terms');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="hover:text-[#20211E] dark:hover:text-[#F4EDE1] underline underline-offset-2"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// INDIVIDUAL PORTAL MODULE CARD (Local 3D Tilt, Scanner, Network Trace)
// =====================================================================

interface PortalCardProps {
  item: PortalItemConfig & { hint: string };
  index: number;
  staggerDelay: number;
  isSelected: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  isActiveDestination: boolean;
  isPortalEntering: boolean;
  isPortalLaunching: boolean;
  onClick: () => void;
  onHoverChange: (hovering: boolean) => void;
}

const PortalCard: React.FC<PortalCardProps> = ({
  item,
  staggerDelay,
  isSelected,
  isHovered,
  isAnyHovered,
  isActiveDestination,
  isPortalEntering,
  isPortalLaunching,
  onClick,
  onHoverChange,
}) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; tx: number; ty: number }>({
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
  });
  const [isScanning, setIsScanning] = useState(false);
  const scanTimerRef = useRef<number | null>(null);

  // Mouse Move: Calculate Local Normalized 3D Coordinates (Idea 09 & 36)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current || isPortalLaunching) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized [-1, 1]
    const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

    // Idea 19: Max 3.8 degrees rotation, 4px lift, 1.2px magnetic micro-motion
    setTilt({
      rx: -normY * 3.8,
      ry: normX * 3.8,
      tx: normX * 1.2,
      ty: normY * 1.2 - 4, // 4px lift
    });
  };

  // Mouse Enter: Trigger 3D Hover & One-Shot Portal Scanner Sweep (Idea 03 & 10)
  const handleMouseEnter = () => {
    onHoverChange(true);
    setIsScanning(true);
    if (scanTimerRef.current !== null) {
      window.clearTimeout(scanTimerRef.current);
    }
    // Scanner sweep takes 380ms and runs once per hover enter (Idea 10 & 41)
    scanTimerRef.current = window.setTimeout(() => {
      setIsScanning(false);
    }, 400);
  };

  // Mouse Leave: Smoothly spring back to rest state (Idea 34)
  const handleMouseLeave = () => {
    onHoverChange(false);
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
    setIsScanning(false);
  };

  // Clean up scanner timer
  useEffect(() => {
    return () => {
      if (scanTimerRef.current !== null) {
        window.clearTimeout(scanTimerRef.current);
      }
    };
  }, []);

  // Compute Card Opacity based on focus state (Idea 05 & 38: 96% emphasis for non-hovered)
  let cardOpacity = 1;
  if (isPortalEntering) {
    cardOpacity = 0;
  } else if (isPortalLaunching) {
    cardOpacity = isSelected ? 1 : 0.35;
  } else if (isAnyHovered && !isHovered) {
    cardOpacity = 0.96; // Idea 05: Non-hovered cards retain ~96% emphasis
  }

  // Transform calculation
  let transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)';
  if (isPortalEntering) {
    transform = 'perspective(600px) translateY(10px) scale(0.97)';
  } else if (isSelected) {
    transform = 'perspective(600px) scale(1.025) translate3d(0, -2px, 0)';
  } else if (isHovered) {
    transform = `perspective(600px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(
      2
    )}deg) translate3d(${tilt.tx.toFixed(2)}px, ${tilt.ty.toFixed(2)}px, 0) scale(1.012)`;
  }

  return (
    <div className="relative">
      <button
        ref={cardRef}
        type="button"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={item.label}
        className="w-full h-[76px] relative p-3 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] border border-[#D8CCB9] dark:border-[#3B3E36] text-left outline-none group overflow-hidden select-none focus-visible:ring-2 focus-visible:ring-[#8FA2C2]/60 flex flex-col justify-between"
        style={{
          transform,
          opacity: cardOpacity,
          willChange: 'transform, opacity',
          transition: isPortalEntering
            ? `transform 320ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms, opacity 280ms ease-out ${staggerDelay}ms`
            : isSelected
            ? 'transform 180ms ease-out, opacity 180ms ease-out'
            : isHovered
            ? 'transform 80ms ease-out, opacity 180ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out'
            : 'transform 260ms cubic-bezier(0.25, 1, 0.5, 1), opacity 240ms ease-out, box-shadow 240ms ease-out, border-color 240ms ease-out',
          boxShadow: isSelected
            ? `0 12px 28px -4px ${item.color}40, 0 0 0 1.5px ${item.color}`
            : isHovered
            ? `0 10px 24px -4px rgba(18, 16, 12, 0.38), 0 0 0 1px ${item.color}60`
            : isActiveDestination
            ? `0 4px 12px -2px rgba(18, 16, 12, 0.22), 0 0 0 1px ${item.color}50`
            : '0 2px 6px -2px rgba(18, 16, 12, 0.12)',
          borderColor: isSelected
            ? item.color
            : isHovered
            ? `${item.color}80`
            : isActiveDestination
            ? `${item.color}70`
            : undefined,
        }}
      >
        {/* Signature Feature: Portal Scanner Light Sweep (Idea 03 & 10) */}
        {isScanning && (
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(105deg, transparent 20%, rgba(255, 250, 240, 0.22) 50%, transparent 80%)',
              animation: 'portalScannerSweep 380ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
            }}
          />
        )}

        {/* Launch Vector Signal Burst (Idea 06 & 14) */}
        {isSelected && (
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              backgroundColor: item.color,
              opacity: 0.18,
              animation: 'launchVectorPulse 240ms ease-out forwards',
            }}
          />
        )}

        {/* Active Destination Indicator Pill (Idea 10 & 22) */}
        {isActiveDestination && (
          <span
            className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 0 6px ${item.color}`,
            }}
            title="Current Active Destination"
          />
        )}

        {/* Top Row: Icon + Local Network Signal Trace (Idea 04) + Cue */}
        <div className="flex items-center justify-between pointer-events-none w-full">
          <div
            className="relative transition-transform duration-200"
            style={{
              transform: isHovered ? 'scale(1.12) translateZ(6px)' : 'scale(1)',
              color: item.color,
            }}
          >
            <ModuleIcon
              iconType={item.iconType}
              isHovered={isHovered}
              isSelected={isSelected}
              color={item.color}
            />
          </div>

          {/* Portal Network Effect: CARD •────→ DESTINATION (Idea 04) */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div
              className="flex items-center transition-all duration-300"
              style={{
                opacity: isHovered ? 0.9 : 0.25,
                transform: isHovered ? 'translateX(0)' : 'translateX(-3px)',
              }}
            >
              {/* Dot */}
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {/* Short Line */}
              <span
                className="h-[1px] transition-all duration-300"
                style={{
                  width: isHovered ? '14px' : '7px',
                  backgroundColor: item.color,
                }}
              />
              {/* Destination Point Arrowhead */}
              <span
                className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[4px] transition-transform duration-300"
                style={{
                  borderLeftColor: item.color,
                  transform: isHovered ? 'scale(1.1)' : 'scale(0.8)',
                }}
              />
            </div>

            {/* Monospace Telemetry Cue */}
            <span
              className="text-[8px] font-mono tracking-widest uppercase transition-colors duration-200"
              style={{
                color: isHovered ? item.color : '#8A857A',
              }}
            >
              {item.cue}
            </span>
          </div>
        </div>

        {/* Bottom Area: Exact Module Title + Reserved Destination Hint (Idea 08 & 17) */}
        <div className="pointer-events-none w-full">
          <div className="text-xs font-bold text-[#20211E] dark:text-[#F4EDE1] leading-tight">
            {item.label}
          </div>

          {/* Contextual Data-Driven Destination Hint (Idea 08 & 17: zero layout shift) */}
          <div
            className="text-[8.5px] font-mono tracking-wider uppercase h-3.5 flex items-center transition-all duration-200 overflow-hidden whitespace-nowrap text-ellipsis"
            style={{
              color: item.color,
              opacity: isHovered ? 0.95 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
            }}
          >
            {item.hint}
          </div>
        </div>
      </button>
    </div>
  );
};

// =====================================================================
// MODULE-SPECIFIC SIGNATURE MICRO-ANIMATIONS (Idea 07 & 11)
// =====================================================================

interface ModuleIconProps {
  iconType: PortalItemConfig['iconType'];
  isHovered: boolean;
  isSelected: boolean;
  color: string;
}

const ModuleIcon: React.FC<ModuleIconProps> = ({
  iconType,
  isHovered,
  isSelected,
  color,
}) => {
  switch (iconType) {
    case 'layers':
      // 01. Skill Map (Structure): Stack subtly separates + 2 connection micro-nodes illuminate
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Layers
            className="w-4 h-4 transition-transform duration-300"
            style={{
              transform: isHovered || isSelected ? 'translateY(-1.5px)' : 'translateY(0)',
            }}
          />
          {isHovered && (
            <>
              <span
                className="absolute -top-0.5 right-0 w-1 h-1 rounded-full animate-ping"
                style={{ backgroundColor: color }}
              />
              <span
                className="absolute bottom-0 -left-0.5 w-1 h-1 rounded-full animate-ping"
                style={{ backgroundColor: color, animationDelay: '100ms' }}
              />
            </>
          )}
        </div>
      );

    case 'map':
      // 02. Learning Route (Direction): Route line activates with waypoint beacon pulse
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Map
            className="w-4 h-4 transition-transform duration-300"
            style={{
              transform: isHovered || isSelected ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {isHovered && (
            <span
              className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
      );

    case 'bot':
      // 03. AI Mentor (Guidance): Concentric signal wave radiates from antenna
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Bot
            className="w-4 h-4 transition-transform duration-300"
            style={{
              transform: isHovered || isSelected ? 'rotate(5deg)' : 'rotate(0deg)',
            }}
          />
          {isHovered && (
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-current opacity-70 pointer-events-none"
              style={{
                borderColor: color,
                animation: 'signalRippleWave 400ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
              }}
            />
          )}
        </div>
      );

    case 'sparkles':
      // 04. Discovery Compass (Exploration): Directional needle alignment oscillation
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Sparkles
            className="w-4 h-4 transition-transform duration-400"
            style={{
              transform:
                isSelected
                  ? 'rotate(45deg) scale(1.15)'
                  : isHovered
                  ? 'rotate(18deg) scale(1.08)'
                  : 'rotate(0deg) scale(1)',
            }}
          />
        </div>
      );

    case 'zap':
      // 05. Practical Labs (Action): Energy surge activation pulse
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Zap
            className="w-4 h-4 transition-all duration-200"
            style={{
              transform:
                isSelected
                  ? 'scale(1.22)'
                  : isHovered
                  ? 'scale(1.14)'
                  : 'scale(1)',
              filter: isHovered
                ? `drop-shadow(0 0 3px ${color}90)`
                : 'none',
            }}
          />
        </div>
      );

    case 'award':
      // 06. Skill Passport (Proof): Circular verification seal ring forms around medal badge
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Award
            className="w-4 h-4 transition-transform duration-300"
            style={{
              transform: isHovered || isSelected ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {isHovered && (
            <svg
              className="absolute inset-0 -m-1 w-6 h-6 pointer-events-none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="7"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeDasharray="44"
                strokeDashoffset="0"
                style={{
                  animation: 'ringVerificationDraw 350ms ease-out forwards',
                }}
              />
            </svg>
          )}
        </div>
      );

    default:
      return <Layers className="w-4 h-4" />;
  }
};
