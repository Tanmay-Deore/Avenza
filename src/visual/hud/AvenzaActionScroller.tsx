import React, { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import {
  ActionItem,
  SCROLLER_CONFIG,
  wrapDist,
  getOpacity,
  getBlur,
  getTextColor,
  easeOutQuart,
} from './scrollerConfig';

export type { ActionItem };

// Subscribe to media query without calling setState inside an effect
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface AvenzaActionScrollerProps {
  actions: ActionItem[];
  onSelect: (moduleId: string) => void;
  activeModuleId?: string | null;
}

export const AvenzaActionScroller: React.FC<AvenzaActionScrollerProps> = ({
  actions,
  onSelect,
  activeModuleId,
}) => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const indicatorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef<number>(0);
  const targetPosRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  // Touch tracking for mobile swipe vs tap
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const isSwipingRef = useRef<boolean>(false);

  // Directly update DOM nodes without triggering React re-renders
  const updateDOM = useCallback((pos: number, isMoving: boolean) => {
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    const blurMultiplier = isMobileOrTablet ? 0.7 : 1.0;

    for (let i = 0; i < actions.length; i++) {
      const rowEl = rowRefs.current[i];
      const labelEl = labelRefs.current[i];
      const dotEl = dotRefs.current[i];
      const tagEl = tagRefs.current[i];
      const indicatorEl = indicatorRefs.current[i];

      if (!rowEl || !labelEl) continue;

      const d = wrapDist(i - pos, actions.length);
      const ad = Math.abs(d);
      const y = d * SCROLLER_CONFIG.ROW_PITCH;
      const angle = Math.max(-SCROLLER_CONFIG.MAX_ANGLE, Math.min(SCROLLER_CONFIG.MAX_ANGLE, d * SCROLLER_CONFIG.FAN_ANGLE));
      const scale = 1 - Math.min(ad, 3) * SCROLLER_CONFIG.SCALE_STEP;
      const opacity = getOpacity(ad);
      const blur = getBlur(ad) * blurMultiplier;
      const color = getTextColor(ad);
      const isRestingActive = !isMoving && ad < 0.001;

      // Row container translation and opacity
      rowEl.style.transform = `translate3d(0, calc(-50% + ${y.toFixed(2)}px), 0)`;
      rowEl.style.opacity = opacity.toFixed(3);

      // Resting active item has NO filter, NO rotation, NO scale, NO will-change (rendered 100% crisp)
      if (isRestingActive || blur < 0.04) {
        rowEl.style.filter = 'none';
      } else {
        rowEl.style.filter = `blur(${blur.toFixed(2)}px)`;
      }

      rowEl.style.willChange = isMoving ? 'transform, opacity, filter' : 'auto';
      rowEl.style.pointerEvents = opacity < 0.08 ? 'none' : 'auto';

      // Label: rotation and scale ONLY, with pivot at left edge
      if (isRestingActive) {
        labelEl.style.transform = 'none';
        labelEl.style.color = '#FFF8ED';
      } else {
        labelEl.style.transform = `rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        labelEl.style.color = color;
      }

      // Dot: scaled and dimmed with distance, glowing when active
      if (dotEl) {
        if (isRestingActive) {
          dotEl.style.transform = 'none';
          dotEl.style.opacity = '1';
          dotEl.style.boxShadow = `0 0 6px ${actions[i].accent}80`;
        } else {
          dotEl.style.transform = `scale(${scale.toFixed(3)})`;
          dotEl.style.opacity = (0.45 + (1 - Math.min(ad, 2) * 0.5) * 0.55).toFixed(2);
          dotEl.style.boxShadow = 'none';
        }
      }

      // Tag: NEVER rotated. Stays horizontal at its row's vertical position
      if (tagEl) {
        tagEl.style.color = isRestingActive ? '#C9BDAA' : '#777469';
        tagEl.style.opacity = Math.max(0.2, 1 - ad * 0.28).toFixed(2);
      }

      // Accent pill indicator at the far left edge of the row
      if (indicatorEl) {
        const indOpacity = isRestingActive ? 1 : Math.max(0, 1 - ad * 4);
        indicatorEl.style.opacity = indOpacity.toFixed(2);
      }
    }
  }, [actions]);

  const stopCurrentAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isMovingRef.current = false;
  }, []);

  // Time-based smooth animation driver using rAF with precision ease-out deceleration
  const animateTo = useCallback((
    targetPos: number,
    duration: number = SCROLLER_CONFIG.settleDuration
  ) => {
    stopCurrentAnimation();

    targetPosRef.current = targetPos;
    const startPos = posRef.current;
    const startTime = performance.now();
    isMovingRef.current = true;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);

      posRef.current = startPos + (targetPos - startPos) * eased;
      updateDOM(posRef.current, true);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
        isMovingRef.current = false;
        // Normalize pos into [0, actions.length)
        const N = actions.length;
        posRef.current = ((targetPos % N) + N) % N;
        targetPosRef.current = posRef.current;
        updateDOM(posRef.current, false);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [actions.length, stopCurrentAnimation, updateDOM]);

  // Retargeting step controller: handles direction reversal mid-flight and prevents queue overflow
  const triggerStep = useCallback((direction: 1 | -1) => {
    const N = actions.length;

    if (prefersReducedMotion) {
      posRef.current = (((posRef.current + direction) % N) + N) % N;
      targetPosRef.current = posRef.current;
      updateDOM(posRef.current, false);
      return;
    }

    let newTarget: number;

    if (isMovingRef.current) {
      const diff = targetPosRef.current - posRef.current;
      const currentMovingDirection = Math.sign(diff);

      if (direction === currentMovingDirection) {
        // Continuing scroll in same direction: only push 1 ahead if already well underway
        if (Math.abs(diff) < 0.65) {
          newTarget = targetPosRef.current + direction;
        } else {
          return; // Let current step complete smoothly
        }
      } else {
        // User reversed direction mid-transition (Section 28)
        newTarget = direction > 0 ? Math.ceil(posRef.current) : Math.floor(posRef.current);
        if (Math.abs(newTarget - posRef.current) < 0.2) {
          newTarget += direction;
        }
      }
    } else {
      const currentInt = Math.round(posRef.current);
      newTarget = currentInt + direction;
    }

    animateTo(newTarget);
  }, [actions.length, animateTo, prefersReducedMotion, updateDOM]);

  // Initial mount: display initial item at focus line, then WAIT. NO autoplay.
  useEffect(() => {
    posRef.current = 0;
    targetPosRef.current = 0;
    updateDOM(0, false);

    return () => {
      stopCurrentAnimation();
    };
  }, [updateDOM, stopCurrentAnimation]);

  // Manual wheel & touchpad scroll listener attached locally with { passive: false }
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulator = 0;
    let resetTimer: number | null = null;
    const THRESHOLD = 36;

    const handleWheel = (e: WheelEvent) => {
      // Local scroller intercepts wheel so page doesn't scroll while wheeling over the card
      e.preventDefault();
      e.stopPropagation();

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 28; // lines mode
      else if (e.deltaMode === 2) dy *= 280; // pages mode

      // Reset stale accumulation after inactivity
      if (resetTimer !== null) {
        window.clearTimeout(resetTimer);
      }
      resetTimer = window.setTimeout(() => {
        accumulator = 0;
      }, 160);

      // Quick direction change resets opposing accumulator immediately
      if ((dy > 0 && accumulator < 0) || (dy < 0 && accumulator > 0)) {
        accumulator = dy;
      } else {
        accumulator += dy;
      }

      if (accumulator >= THRESHOLD) {
        accumulator = 0;
        triggerStep(1); // Scroll Down -> Next Action
      } else if (accumulator <= -THRESHOLD) {
        accumulator = 0;
        triggerStep(-1); // Scroll Up -> Previous Action
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (resetTimer !== null) window.clearTimeout(resetTimer);
    };
  }, [triggerStep]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
      isSwipingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - touchStartYRef.current;
    const diffX = currentX - touchStartXRef.current;

    // Check if vertical motion is dominant and exceeds swipe threshold
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 30) {
      isSwipingRef.current = true;
      if (diffY < 0) {
        triggerStep(1); // Swiped UP -> Next action
      } else {
        triggerStep(-1); // Swiped DOWN -> Previous action
      }
      touchStartYRef.current = null;
      touchStartXRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
    touchStartXRef.current = null;
    window.setTimeout(() => {
      isSwipingRef.current = false;
    }, 50);
  };

  // Keyboard navigation support: ArrowDown / ArrowUp
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      triggerStep(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      triggerStep(-1);
    }
  };

  // Click handler - executes action immediately if not a swipe gesture
  const handleRowClick = (action: ActionItem) => {
    if (isSwipingRef.current) return;
    onSelect(action.moduleId);
  };

  // Static Fallback & Reduced Motion (Section 32 & 59)
  if (prefersReducedMotion) {
    return (
      <div
        className="p-1 rounded-[16px] space-y-0.5"
        style={{
          backgroundColor: 'rgba(248, 244, 236, 0.055)',
          border: '1px solid rgba(244, 237, 225, 0.10)',
          boxShadow: 'inset 0 2px 6px 0 rgba(12, 12, 10, 0.32)',
        }}
      >
        {actions.map((link) => {
          const isActive = activeModuleId === link.moduleId;
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => onSelect(link.moduleId)}
              className={`w-full text-left font-mono text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-between group relative ${
                isActive
                  ? 'bg-white/[0.055] text-[#FFF8ED]'
                  : 'text-[#E4DDD2] hover:bg-white/[0.04] hover:text-[#FFF8ED]'
              }`}
            >
              <span
                className={`absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{ backgroundColor: link.accent }}
              />
              <div className="flex items-center gap-2 pl-1.5 transition-transform duration-200 group-hover:translate-x-[3px]">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                  style={{ backgroundColor: link.accent }}
                />
                <span
                  className={`text-[12.5px] font-mono transition-colors duration-200 ${
                    isActive ? 'text-[#FFF8ED]' : 'text-[#A9A294] group-hover:text-[#F4EDE1]'
                  }`}
                >
                  -&gt;
                </span>
                <span className="tracking-wide text-[12.5px] select-none">{link.label}</span>
              </div>
              <span
                className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 select-none ${
                  isActive ? 'text-[#C9BDAA]' : 'text-[#A9A294]/60 group-hover:text-[#C9BDAA]'
                }`}
              >
                {link.cue}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Action Scroller. Use mouse wheel, touchpad, swipe, or arrow keys to navigate actions."
      className="relative rounded-[16px] h-[232px] overflow-hidden select-none outline-none focus-visible:ring-1 focus-visible:ring-[#8FA2C2]/50"
      style={{
        backgroundColor: 'rgba(248, 244, 236, 0.055)',
        border: '1px solid rgba(244, 237, 225, 0.10)',
        boxShadow:
          'inset 0 2px 6px 0 rgba(12, 12, 10, 0.32), inset 0 0 0 1px rgba(255, 245, 225, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Fixed Arrow Anchor at Vertical Focus Line */}
      <div
        className="absolute left-[30px] top-1/2 -translate-y-1/2 pointer-events-none z-10 text-[12.5px] font-mono text-[#FFF8ED] select-none"
        aria-hidden="true"
      >
        -&gt;
      </div>

      {/* Rows Layer with Soft Top and Bottom Gradient Edge Mask */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)',
        }}
      >
        {actions.map((action, i) => (
          <button
            key={action.label}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            type="button"
            onClick={() => handleRowClick(action)}
            aria-label={action.label}
            className="absolute left-1 right-1 h-9 rounded-lg flex items-center justify-between px-2.5 transition-colors duration-150 group outline-none focus-visible:ring-1 focus-visible:ring-[#8FA2C2]/60 hover:bg-white/[0.04]"
            style={{
              top: '50%',
              // transform, opacity, filter, willChange managed via updateDOM
            }}
          >
            {/* Active / Hover accent line indicator */}
            <span
              ref={(el) => {
                indicatorRefs.current[i] = el;
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full pointer-events-none transition-opacity duration-150"
              style={{ backgroundColor: action.accent }}
            />

            {/* Left group: Dot + spacer for fixed arrow + Label */}
            <div className="flex items-center gap-2 pl-1.5 pointer-events-none">
              {/* Dot */}
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-150"
                style={{ backgroundColor: action.accent }}
              />

              {/* Exact spacer matching the fixed arrow so label aligns pixel-perfect */}
              <span className="text-[12.5px] font-mono opacity-0 select-none pointer-events-none" aria-hidden="true">
                -&gt;
              </span>

              {/* Label: fanned rotation and scale pivot at left edge (12.5px font size = +13.6% larger) */}
              <span
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="font-mono text-[12.5px] font-semibold tracking-wide select-none inline-block whitespace-nowrap"
                style={{
                  transformOrigin: '0% 50%',
                }}
              >
                {action.label}
              </span>
            </div>

            {/* Right command cue / tag: NEVER rotated */}
            <span
              ref={(el) => {
                tagRefs.current[i] = el;
              }}
              className="text-[9px] font-mono tracking-widest uppercase select-none pointer-events-none font-semibold"
            >
              {action.cue}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
