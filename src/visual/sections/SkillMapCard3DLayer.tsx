import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ModulePanelData } from '../GlassPanelGroup';
import { GlitchText } from '../GlitchText';
import { ArrowRight, RotateCw } from 'lucide-react';

// =====================================================================
// 13 — CONFIGURATION
// =====================================================================
const CFG = {
  maxX: 12,
  maxY: 14,
  tilt: 1, // 0.6 subtle, 1 balanced, 1.4 bold
  lift: 6,
  slabDepth: 24,
  slabLayers: 6,
  zPop: 1,
  smoothMs: 150,
  enterMs: 220,
  leaveMs: 170,
  boxMs: 170,
  rowMs: 120,
  btnMs: 140,
  idle: false,
  parallaxPx: 6,
};

// Critically Damped Spring State
interface SpringVal {
  pos: number;
  vel: number;
  target: number;
}

const createSpring = (initial = 0): SpringVal => ({
  pos: initial,
  vel: 0,
  target: initial,
});

const stepSpring = (s: SpringVal, omega: number, dt: number) => {
  const h = Math.min(1 / 240, dt);
  let remaining = dt;
  while (remaining > 0) {
    const step = Math.min(h, remaining);
    remaining -= step;
    const accel = omega * omega * (s.target - s.pos) - 2 * omega * s.vel;
    s.vel += accel * step;
    s.pos += s.vel * step;
  }
};

const getModuleTheme = (id: string) => {
  switch (id) {
    case 'journey':
    case 'verification':
      return {
        rim: '#b0bfa9',
        border: 'border-[#9EAD97]',
        disc1: 'radial-gradient(circle, rgba(157,176,155,0.18) 0%, rgba(111,130,115,0.08) 100%)',
        disc2: 'radial-gradient(circle, rgba(157,176,155,0.28) 0%, rgba(111,130,115,0.12) 100%)',
        disc3: 'radial-gradient(circle, rgba(157,176,155,0.40) 0%, rgba(111,130,115,0.18) 100%)',
        disc4: 'radial-gradient(circle, rgba(185,205,180,0.55) 0%, rgba(157,176,155,0.25) 100%)',
        dotAuraRgb: '176,191,169',
      };
    case 'mentor':
      return {
        rim: '#c4b7d7',
        border: 'border-[#B4A4C8]',
        disc1: 'radial-gradient(circle, rgba(180,164,200,0.18) 0%, rgba(135,120,155,0.08) 100%)',
        disc2: 'radial-gradient(circle, rgba(180,164,200,0.28) 0%, rgba(135,120,155,0.12) 100%)',
        disc3: 'radial-gradient(circle, rgba(180,164,200,0.40) 0%, rgba(135,120,155,0.18) 100%)',
        disc4: 'radial-gradient(circle, rgba(205,190,225,0.55) 0%, rgba(180,164,200,0.25) 100%)',
        dotAuraRgb: '180,164,200',
      };
    case 'discover':
      return {
        rim: '#d4a390',
        border: 'border-[#C58F78]',
        disc1: 'radial-gradient(circle, rgba(197,143,120,0.18) 0%, rgba(150,100,80,0.08) 100%)',
        disc2: 'radial-gradient(circle, rgba(197,143,120,0.28) 0%, rgba(150,100,80,0.12) 100%)',
        disc3: 'radial-gradient(circle, rgba(197,143,120,0.40) 0%, rgba(150,100,80,0.18) 100%)',
        disc4: 'radial-gradient(circle, rgba(220,165,145,0.55) 0%, rgba(197,143,120,0.25) 100%)',
        dotAuraRgb: '197,143,120',
      };
    case 'skills':
    case 'passport':
    default:
      return {
        rim: '#aab6d8',
        border: 'border-[#9aa7cb]',
        disc1: 'radial-gradient(circle, rgba(143,157,194,0.18) 0%, rgba(111,123,141,0.08) 100%)',
        disc2: 'radial-gradient(circle, rgba(143,157,194,0.28) 0%, rgba(111,123,141,0.12) 100%)',
        disc3: 'radial-gradient(circle, rgba(143,157,194,0.40) 0%, rgba(111,123,141,0.18) 100%)',
        disc4: 'radial-gradient(circle, rgba(175,190,225,0.55) 0%, rgba(143,157,194,0.25) 100%)',
        dotAuraRgb: '143,157,194',
      };
  }
};

interface SkillMapCard3DLayerProps {
  panel: ModulePanelData;
  idx: number;
  isActive: boolean;
  getModuleIcon: (id: string) => React.ReactNode;
  openModuleDrawer: (id: string) => void;
  verifiedSkillsCount: number;
  metricValue?: string;
  triggerRerouteAnimation?: () => void;
}

export const SkillMapCard3DLayer: React.FC<SkillMapCard3DLayerProps> = ({
  panel,
  idx,
  isActive,
  getModuleIcon,
  openModuleDrawer,
  verifiedSkillsCount,
  metricValue,
  triggerRerouteAnimation,
}) => {
  const isJourney = panel.id === 'journey';
  const moduleTheme = getModuleTheme(panel.id);

  // DOM element refs
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const glassPaneRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);

  // Slabs & rings
  const slabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringsContainerRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Content layers
  const headerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Box & rows
  const boxRef = useRef<HTMLDivElement>(null);
  const boxPillRef = useRef<HTMLSpanElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rowTextRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Button
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnLabelRef = useRef<HTMLSpanElement>(null);
  const btnArrowRef = useRef<HTMLSpanElement>(null);
  const rerouteBtnRef = useRef<HTMLButtonElement>(null);

  // Cached layout rect
  const rectRef = useRef<DOMRect | null>(null);

  // Normalized pointer coordinates: -1 to +1
  const pointerPosRef = useRef({ cx: 0, cy: 0, px: 50, py: 50 });

  // Interactive hover flags
  const isCardHoveredRef = useRef(false);
  const isBoxHoveredRef = useRef(false);
  const hoveredRowIdxRef = useRef<number | null>(null);
  const isBtnHoveredRef = useRef(false);
  const isBtnPressedRef = useRef(false);

  // Animation loop management
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef(false);
  const lastTimeRef = useRef<number>(0);

  // Reduced motion & mobile detection
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640 || window.matchMedia('(pointer: coarse)').matches;
  });

  // Performance monitor (Section 21: auto-throttle if < 50 fps for 1s)
  const perfFramesRef = useRef(0);
  const perfStartTimeRef = useRef(0);
  const lowPerfRef = useRef(false);

  // Springs
  const springsRef = useRef({
    h: createSpring(0),
    rx: createSpring(0),
    ry: createSpring(0),
    box: createSpring(0),
    rows: [createSpring(0), createSpring(0), createSpring(0)],
    btn: createSpring(0),
    press: createSpring(0),
  });

  // Check reduced motion & viewport changes
  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mqMotion.addEventListener('change', handleMotionChange);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640 || window.matchMedia('(pointer: coarse)').matches);
    };
    window.addEventListener('resize', checkMobile);

    return () => {
      mqMotion.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Update cached bounding rect
  const updateRect = useCallback(() => {
    if (sceneRef.current) {
      rectRef.current = sceneRef.current.getBoundingClientRect();
    }
  }, []);

  useEffect(() => {
    updateRect();
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [updateRect]);

  // Clean Rest State function (Section 12: Clear all inline transforms and will-change)
  const clearRestState = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.willChange = '';
    }

    // Hide slabs
    slabRefs.current.forEach((slab) => {
      if (slab) {
        slab.style.transform = '';
        slab.style.opacity = '0';
        slab.style.display = 'none';
      }
    });

    // Hide rings
    if (ringsContainerRef.current) {
      ringsContainerRef.current.style.transform = '';
      ringsContainerRef.current.style.opacity = '0';
      ringsContainerRef.current.style.display = 'none';
    }
    ringRefs.current.forEach((ring) => {
      if (ring) ring.style.transform = '';
    });

    // Hide face effects
    if (glassPaneRef.current) {
      glassPaneRef.current.style.opacity = '0';
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
    if (rimRef.current) {
      rimRef.current.style.opacity = '0';
    }

    // Clear content transforms
    if (headerRef.current) headerRef.current.style.transform = '';
    if (iconRef.current) iconRef.current.style.transform = '';
    if (eyebrowRef.current) eyebrowRef.current.style.transform = '';
    if (badgeRef.current) badgeRef.current.style.transform = '';
    if (titleRef.current) titleRef.current.style.transform = '';
    if (subtitleRef.current) subtitleRef.current.style.transform = '';

    // Clear box & rows
    if (boxRef.current) {
      boxRef.current.style.transform = '';
      boxRef.current.style.boxShadow = '';
      boxRef.current.style.backgroundColor = '';
    }
    if (boxPillRef.current) boxPillRef.current.style.transform = '';

    rowRefs.current.forEach((row, i) => {
      if (row) {
        row.style.transform = '';
      }
      const dot = dotRefs.current[i];
      if (dot) {
        dot.style.transform = '';
        dot.style.backgroundColor = '';
        dot.style.boxShadow = '';
      }
      const txt = rowTextRefs.current[i];
      if (txt) {
        txt.style.color = '';
      }
    });

    // Clear button
    if (btnRef.current) {
      btnRef.current.style.transform = '';
      btnRef.current.style.boxShadow = '';
      btnRef.current.style.backgroundColor = '';
      btnRef.current.style.color = '';
    }
    if (btnArrowRef.current) {
      btnArrowRef.current.style.transform = '';
    }
    if (rerouteBtnRef.current) {
      rerouteBtnRef.current.style.transform = '';
      rerouteBtnRef.current.style.boxShadow = '';
    }
  }, []);

  // Main Render Frame
  const renderFrame = useCallback(() => {
    const s = springsRef.current;
    const h = s.h.pos;
    const rx = s.rx.pos;
    const ry = s.ry.pos;
    const boxH = s.box.pos;
    const btnH = s.btn.pos;
    const pressH = s.press.pos;
    const { px, py, cx, cy } = pointerPosRef.current;

    if (h <= 0.01 && !isCardHoveredRef.current) {
      clearRestState();
      return;
    }

    // 1. Whole Card Tilt & Lift (Section 05, 06)
    if (cardRef.current) {
      cardRef.current.style.willChange = 'transform';
      const translateY = -CFG.lift * h;
      const translateZ = 40 * h;
      cardRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    }

    // 2. Extrusion Slabs (Section 06.3: 6 slabs, 4px apart, total 24px)
    const slabOpacity = Math.min(1, Math.max(0, h));
    slabRefs.current.forEach((slab, i) => {
      if (slab) {
        if (slabOpacity > 0.01) {
          slab.style.display = 'block';
          slab.style.opacity = slabOpacity.toFixed(3);
          const zDepth = -(i + 1) * 4 * h;
          slab.style.transform = `translate3d(0, 0, ${zDepth.toFixed(2)}px)`;
        } else {
          slab.style.display = 'none';
          slab.style.opacity = '0';
        }
      }
    });

    // 3. Face Glass Pane, Sheen, and Rim (Section 06.4, 06.5)
    if (glassPaneRef.current) {
      glassPaneRef.current.style.opacity = h.toFixed(3);
    }
    const isJourney = panel.id === 'journey';
    if (sheenRef.current) {
      sheenRef.current.style.opacity = (0.35 * h).toFixed(3);
      sheenRef.current.style.background = `radial-gradient(circle 280px at ${px}% ${py}%, rgba(255,255,255,0.7), transparent 70%)`;
    }
    if (rimRef.current) {
      rimRef.current.style.opacity = (0.65 * h).toFixed(3);
      const rimHighlightColor = moduleTheme.rim;
      rimRef.current.style.background = `radial-gradient(circle 260px at ${px}% ${py}%, ${rimHighlightColor}, transparent 65%)`;
    }

    // 4. Concentric Rings (Section 07: 4 discs, top-right; Section 21: auto-hidden on low perf)
    if (ringsContainerRef.current) {
      const ringsOpacity = lowPerfRef.current ? 0 : Math.min(1, Math.max(0, h * 1.2));
      if (ringsOpacity > 0.01) {
        ringsContainerRef.current.style.display = 'block';
        ringsContainerRef.current.style.opacity = ringsOpacity.toFixed(3);
        const shiftX = -cx * CFG.parallaxPx * h;
        const shiftY = -cy * CFG.parallaxPx * h;
        ringsContainerRef.current.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;

        const ringDepths = [3, 7, 11, 15];
        ringRefs.current.forEach((ring, i) => {
          if (ring) {
            const z = ringDepths[i] * h;
            const scale = 1 + 0.03 * i * h;
            ring.style.transform = `translate3d(0, 0, ${z.toFixed(2)}px) scale(${scale.toFixed(3)})`;
          }
        });
      } else {
        ringsContainerRef.current.style.display = 'none';
        ringsContainerRef.current.style.opacity = '0';
      }
    }

    // 5. Header Row (Section 05, 10: icon Z +12, eyebrow/badge Z +30)
    if (iconRef.current) {
      iconRef.current.style.transform = `translate3d(0, 0, ${(12 * h).toFixed(2)}px)`;
    }
    if (eyebrowRef.current) {
      eyebrowRef.current.style.transform = `translate3d(0, 0, ${(30 * h).toFixed(2)}px)`;
    }
    if (badgeRef.current) {
      badgeRef.current.style.transform = `translate3d(0, 0, ${(30 * h).toFixed(2)}px)`;
    }

    // 6. Title (Z +46) & Subtitle (Z +38)
    if (titleRef.current) {
      titleRef.current.style.transform = `translate3d(0, 0, ${(46 * h).toFixed(2)}px)`;
    }
    if (subtitleRef.current) {
      subtitleRef.current.style.transform = `translate3d(0, 0, ${(38 * h).toFixed(2)}px)`;
    }

    // 7. VERIFIED SKILLS Box (Section 08: Z +24, +16 on box hover = +40; shadow + background)
    if (boxRef.current) {
      const boxZ = (24 + 16 * boxH) * h;
      const boxShiftX = -cx * 0.5 * boxH;
      const boxShiftY = -cy * 0.5 * boxH;
      boxRef.current.style.transform = `translate3d(${boxShiftX.toFixed(2)}px, ${boxShiftY.toFixed(2)}px, ${boxZ.toFixed(2)}px)`;

      // Dynamic shadow
      const sY = (10 + 16 * boxH) * h;
      const sBlur = (22 + 22 * boxH) * h;
      boxRef.current.style.boxShadow = `0 ${sY.toFixed(1)}px ${sBlur.toFixed(1)}px -8px rgba(0,0,0,${(0.5 * h).toFixed(2)})`;

      // Background brightening
      // Dark mode base: rgb(46, 48, 43) -> rgb(56, 58, 53)
      // Light mode base: rgb(237, 227, 210) -> rgb(246, 236, 219)
      if (boxH > 0.01) {
        const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        if (isDark) {
          const bgR = Math.round(46 + 10 * boxH);
          const bgG = Math.round(48 + 10 * boxH);
          const bgB = Math.round(43 + 10 * boxH);
          boxRef.current.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`;
        } else {
          const bgR = Math.round(237 + 9 * boxH);
          const bgG = Math.round(227 + 9 * boxH);
          const bgB = Math.round(210 + 9 * boxH);
          boxRef.current.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`;
        }
      } else {
        boxRef.current.style.backgroundColor = '';
      }
    }

    // Box Pill ("2 Verified"): Z +8, +10 on box hover, scale 1.06
    if (boxPillRef.current) {
      const pillZ = (8 + 10 * boxH) * h;
      const pillScale = 1 + 0.06 * boxH;
      boxPillRef.current.style.transform = `translate3d(0, 0, ${pillZ.toFixed(2)}px) scale(${pillScale.toFixed(3)})`;
    }

    // 3 Rows (Section 08: stagger +6, +10, +14; row hover: +10 Z & 4px right)
    const rowBaseDepths = [6, 10, 14];
    s.rows.forEach((rowSpring, rIdx) => {
      const rowElem = rowRefs.current[rIdx];
      const dotElem = dotRefs.current[rIdx];
      const textElem = rowTextRefs.current[rIdx];
      const rH = rowSpring.pos;

      if (rowElem) {
        const rowZ = (rowBaseDepths[rIdx] + 10 * rH) * h;
        const rowX = 4 * rH;
        rowElem.style.transform = `translate3d(${rowX.toFixed(2)}px, 0, ${rowZ.toFixed(2)}px)`;
      }

      if (dotElem) {
        const dotScale = 1 + 0.55 * rH;
        dotElem.style.transform = `scale(${dotScale.toFixed(3)})`;
        if (rH > 0.01) {
          // Dot inverts from panel rimColor to cream #efe8da
          dotElem.style.backgroundColor = `rgb(239, 232, 218)`;
          const dotAura = `rgba(${moduleTheme.dotAuraRgb},${(0.28 * rH).toFixed(2)})`;
          dotElem.style.boxShadow = `0 0 0 ${(3 * rH).toFixed(1)}px ${dotAura}`;
        } else {
          dotElem.style.backgroundColor = '';
          dotElem.style.boxShadow = '';
        }
      }

      if (textElem) {
        if (rH > 0.01) {
          const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
          textElem.style.color = isDark ? '#fffaf0' : '#1b1c18';
        } else {
          textElem.style.color = '';
        }
      }
    });

    // 8. LAUNCH Button (Section 09: Z +40, +16 on button hover, -8 on press)
    if (btnRef.current) {
      const btnZ = (40 + 16 * btnH - 8 * pressH) * h;
      btnRef.current.style.transform = `translate3d(0, 0, ${btnZ.toFixed(2)}px)`;

      // Button Shadow
      const bY = (8 + 14 * btnH - 4 * pressH) * h;
      const bBlur = (16 + 18 * btnH - 6 * pressH) * h;
      btnRef.current.style.boxShadow = `0 ${bY.toFixed(1)}px ${bBlur.toFixed(1)}px -4px rgba(0,0,0,${(0.55 * h).toFixed(2)})`;

      // Invert button colors on hover (from near-black #20211E to cream #efe8da)
      if (btnH > 0.01) {
        // Base #20211E (32, 33, 30) -> Cream #efe8da (239, 232, 218)
        const bgR = Math.round(32 + (239 - 32) * btnH);
        const bgG = Math.round(33 + (232 - 33) * btnH);
        const bgB = Math.round(30 + (218 - 30) * btnH);
        btnRef.current.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

        // Text #F8F4EC (248, 244, 236) -> Dark #1b1c18 (27, 28, 24)
        const txtR = Math.round(248 + (27 - 248) * btnH);
        const txtG = Math.round(244 + (28 - 244) * btnH);
        const txtB = Math.round(236 + (24 - 236) * btnH);
        btnRef.current.style.color = `rgb(${txtR}, ${txtG}, ${txtB})`;
      } else {
        btnRef.current.style.backgroundColor = '';
        btnRef.current.style.color = '';
      }
    }

    if (btnArrowRef.current) {
      btnArrowRef.current.style.transform = `translateX(${(5 * btnH).toFixed(2)}px)`;
    }

    if (rerouteBtnRef.current) {
      const rerouteZ = (40 + 16 * btnH - 8 * pressH) * h;
      rerouteBtnRef.current.style.transform = `translate3d(0, 0, ${rerouteZ.toFixed(2)}px)`;
      const bY = (8 + 14 * btnH - 4 * pressH) * h;
      const bBlur = (16 + 18 * btnH - 6 * pressH) * h;
      rerouteBtnRef.current.style.boxShadow = `0 ${bY.toFixed(1)}px ${bBlur.toFixed(1)}px -4px rgba(0,0,0,${(0.55 * h).toFixed(2)})`;
    }
  }, [clearRestState]);

  // Spring Simulation Step Loop (Section 11)
  const tickLoopRef = useRef<(now: number) => void>(() => {});
  const tickLoop = useCallback((now: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = now;
    const dt = Math.min(0.064, (now - lastTimeRef.current) / 1000);
    lastTimeRef.current = now;

    // Section 21: Auto-throttle if < 50 fps for 1 second
    if (!perfStartTimeRef.current) perfStartTimeRef.current = now;
    perfFramesRef.current++;
    if (now - perfStartTimeRef.current >= 1000) {
      const fps = (perfFramesRef.current * 1000) / (now - perfStartTimeRef.current);
      if (fps < 50 && !lowPerfRef.current) {
        lowPerfRef.current = true;
      }
      perfFramesRef.current = 0;
      perfStartTimeRef.current = now;
    }

    const s = springsRef.current;

    // Omega constants per element
    const omegaCard = 1300 / (isCardHoveredRef.current ? CFG.smoothMs : CFG.leaveMs);
    const omegaH = 1300 / (isCardHoveredRef.current ? CFG.enterMs : CFG.leaveMs);
    const omegaBox = 1300 / CFG.boxMs;
    const omegaRow = 1300 / CFG.rowMs;
    const omegaBtn = 1300 / CFG.btnMs;
    const omegaPress = 1300 / 80;

    // Step springs
    stepSpring(s.h, omegaH, dt);
    stepSpring(s.rx, omegaCard, dt);
    stepSpring(s.ry, omegaCard, dt);
    stepSpring(s.box, omegaBox, dt);
    s.rows.forEach((rowSpring) => stepSpring(rowSpring, omegaRow, dt));
    stepSpring(s.btn, omegaBtn, dt);
    stepSpring(s.press, omegaPress, dt);

    renderFrame();

    // Check Sleep Condition (Section 11, 12, 24.5: settles cleanly within ~0.8s)
    const isSleeping =
      !isCardHoveredRef.current &&
      Math.abs(s.h.pos) < 0.05 &&
      Math.abs(s.h.vel) < 0.1 &&
      Math.abs(s.rx.pos) < 0.1 &&
      Math.abs(s.rx.vel) < 0.1 &&
      Math.abs(s.ry.pos) < 0.1 &&
      Math.abs(s.ry.vel) < 0.1 &&
      Math.abs(s.box.pos) < 0.05 &&
      Math.abs(s.btn.pos) < 0.05 &&
      s.rows.every((r) => Math.abs(r.pos) < 0.05);

    if (isSleeping) {
      // Snap to rest and clean up
      s.h.pos = 0; s.h.vel = 0;
      s.rx.pos = 0; s.rx.vel = 0;
      s.ry.pos = 0; s.ry.vel = 0;
      s.box.pos = 0; s.box.vel = 0;
      s.btn.pos = 0; s.btn.vel = 0;
      s.press.pos = 0; s.press.vel = 0;
      s.rows.forEach((r) => { r.pos = 0; r.vel = 0; });

      clearRestState();
      isLoopRunningRef.current = false;
      rafIdRef.current = null;
      lastTimeRef.current = 0;
      return;
    }

    rafIdRef.current = requestAnimationFrame((t) => tickLoopRef.current(t));
  }, [clearRestState, renderFrame]);

  useEffect(() => {
    tickLoopRef.current = tickLoop;
  }, [tickLoop]);

  // Wake up animation loop
  const wakeUpLoop = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame((t) => tickLoopRef.current(t));
    }
  }, []);

  // Pointer event handlers on Scene Wrapper
  const handlePointerEnter = useCallback((e: React.PointerEvent) => {
    if (reducedMotion || isMobile || e.pointerType === 'touch') return;
    updateRect();
    isCardHoveredRef.current = true;
    springsRef.current.h.target = 1;
    wakeUpLoop();
  }, [reducedMotion, isMobile, updateRect, wakeUpLoop]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (reducedMotion || isMobile || e.pointerType === 'touch' || !isCardHoveredRef.current) return;
    const rect = rectRef.current;
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    // Normalised pointer position: -1 to +1
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const cy = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));

    pointerPosRef.current = { cx, cy, px, py };

    // Targets (Section 06.1): rotateY = cx * 14deg, rotateX = -cy * 12deg (scaled by tilt / low-perf mode)
    const effectiveTilt = lowPerfRef.current ? 0.6 : CFG.tilt;
    springsRef.current.ry.target = cx * CFG.maxY * effectiveTilt;
    springsRef.current.rx.target = -cy * CFG.maxX * effectiveTilt;

    wakeUpLoop();
  }, [reducedMotion, isMobile, wakeUpLoop]);

  const handlePointerLeave = useCallback(() => {
    isCardHoveredRef.current = false;
    isBoxHoveredRef.current = false;
    hoveredRowIdxRef.current = null;
    isBtnHoveredRef.current = false;
    isBtnPressedRef.current = false;

    // Reset all spring targets to 0
    const s = springsRef.current;
    s.h.target = 0;
    s.rx.target = 0;
    s.ry.target = 0;
    s.box.target = 0;
    s.btn.target = 0;
    s.press.target = 0;
    s.rows.forEach((r) => { r.target = 0; });

    wakeUpLoop();
  }, [wakeUpLoop]);

  // Box Hover handlers
  const handleBoxPointerEnter = useCallback(() => {
    if (reducedMotion || isMobile) return;
    isBoxHoveredRef.current = true;
    springsRef.current.box.target = 1;
    wakeUpLoop();
  }, [reducedMotion, isMobile, wakeUpLoop]);

  const handleBoxPointerLeave = useCallback(() => {
    isBoxHoveredRef.current = false;
    springsRef.current.box.target = 0;
    wakeUpLoop();
  }, [wakeUpLoop]);

  // Row Hover handlers
  const handleRowPointerEnter = useCallback((rowIdx: number) => {
    if (reducedMotion || isMobile) return;
    hoveredRowIdxRef.current = rowIdx;
    springsRef.current.rows[rowIdx].target = 1;
    wakeUpLoop();
  }, [reducedMotion, isMobile, wakeUpLoop]);

  const handleRowPointerLeave = useCallback((rowIdx: number) => {
    if (hoveredRowIdxRef.current === rowIdx) {
      hoveredRowIdxRef.current = null;
    }
    springsRef.current.rows[rowIdx].target = 0;
    wakeUpLoop();
  }, [wakeUpLoop]);

  // Button Hover & Press handlers
  const handleBtnPointerEnter = useCallback(() => {
    if (reducedMotion) return;
    isBtnHoveredRef.current = true;
    springsRef.current.btn.target = 1;
    wakeUpLoop();
  }, [reducedMotion, wakeUpLoop]);

  const handleBtnPointerLeave = useCallback(() => {
    isBtnHoveredRef.current = false;
    isBtnPressedRef.current = false;
    springsRef.current.btn.target = 0;
    springsRef.current.press.target = 0;
    wakeUpLoop();
  }, [wakeUpLoop]);

  const handleBtnPointerDown = useCallback(() => {
    isBtnPressedRef.current = true;
    springsRef.current.press.target = 1;
    wakeUpLoop();
  }, [wakeUpLoop]);

  const handleBtnPointerUp = useCallback(() => {
    isBtnPressedRef.current = false;
    springsRef.current.press.target = 0;
    wakeUpLoop();
  }, [wakeUpLoop]);

  // Accessibility Focus Handlers
  const handleCardFocus = useCallback(() => {
    if (reducedMotion) return;
    springsRef.current.h.target = 0.5;
    springsRef.current.rx.target = 0;
    springsRef.current.ry.target = 0;
    wakeUpLoop();
  }, [reducedMotion, wakeUpLoop]);

  const handleCardBlur = useCallback(() => {
    springsRef.current.h.target = 0;
    wakeUpLoop();
  }, [wakeUpLoop]);

  // Visibility & Intersection Observers (Section 19)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isLoopRunningRef.current) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        isLoopRunningRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (sceneRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isLoopRunningRef.current) {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            isLoopRunningRef.current = false;
          }
        });
      });
      observer.observe(sceneRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleCardFocus}
      onBlur={handleCardBlur}
      className="sm-scene max-w-md w-full pointer-events-auto select-none"
      style={{
        perspective: '1100px',
        perspectiveOrigin: '50% 45%',
      }}
    >
      <div
        ref={cardRef}
        className={`sm-card relative w-full rounded-3xl transition-shadow duration-300 ${
          isActive ? 'ring-2 ring-[#8495B8]/60 dark:ring-[#9FB0D3]/60' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* =================================================================== */}
        {/* 6 EXTRUSION SLAB LAYERS (Section 04, 06.3: Thick 3D Bevel Edge)     */}
        {/* =================================================================== */}
        {[0, 1, 2, 3, 4, 5].map((slabIndex) => (
          <div
            key={slabIndex}
            ref={(el) => { slabRefs.current[slabIndex] = el; }}
            className="sm-slab absolute inset-0 rounded-3xl bg-[#262833] border border-[#4a4f61] pointer-events-none"
            aria-hidden="true"
            style={{
              display: 'none',
              opacity: 0,
              transformStyle: 'preserve-3d',
            }}
          />
        ))}

        {/* =================================================================== */}
        {/* CARD FACE: Background, Inset Glass Pane, Sheen & Rim Highlight      */}
        {/* =================================================================== */}
        <div
          ref={faceRef}
          className="sm-face absolute inset-0 rounded-3xl bg-[#F8F4EC] dark:bg-[#242520] border border-[#D8CCB9] dark:border-[#3B3E36] shadow-xl overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {/* 06.4 Inset Glass Pane */}
          <div
            ref={glassPaneRef}
            className="sm-glass-pane absolute inset-[10px] rounded-[24px] pointer-events-none"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.08), transparent 55%)',
              opacity: 0,
              transition: 'opacity 0.15s ease',
            }}
          />

          {/* 06.5 Soft Sheen Highlight following pointer */}
          <div
            ref={sheenRef}
            className="sm-sheen absolute inset-0 pointer-events-none"
            style={{
              mixBlendMode: 'soft-light',
              opacity: 0,
            }}
          />

          {/* 06.5 1px Rim Light following pointer on border */}
          <div
            ref={rimRef}
            className="sm-rim absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              padding: '1px',
              opacity: 0,
              boxSizing: 'border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }}
          />
        </div>

        {/* =================================================================== */}
        {/* 07 CONCENTRIC TRANSLUCENT DISCS (Signature Shape in Top-Right Corner)*/}
        {/* =================================================================== */}
        <div
          ref={ringsContainerRef}
          className="sm-rings absolute -top-[34px] -right-[34px] w-[150px] h-[150px] pointer-events-none"
          aria-hidden="true"
          style={{
            display: 'none',
            opacity: 0,
            transformStyle: 'preserve-3d',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        >
          {/* Disc 1: inset 0% (Z +3) */}
          <div
            ref={(el) => { ringRefs.current[0] = el; }}
            className={`absolute inset-0 rounded-full border ${moduleTheme.border}/20`}
            style={{
              background: moduleTheme.disc1,
              transformStyle: 'preserve-3d',
            }}
          />
          {/* Disc 2: inset 17% (Z +7) */}
          <div
            ref={(el) => { ringRefs.current[1] = el; }}
            className={`absolute inset-[17%] rounded-full border ${moduleTheme.border}/25`}
            style={{
              background: moduleTheme.disc2,
              transformStyle: 'preserve-3d',
            }}
          />
          {/* Disc 3: inset 34% (Z +11) */}
          <div
            ref={(el) => { ringRefs.current[2] = el; }}
            className={`absolute inset-[34%] rounded-full border ${moduleTheme.border}/30`}
            style={{
              background: moduleTheme.disc3,
              transformStyle: 'preserve-3d',
            }}
          />
          {/* Disc 4: inset 50% (Z +15, Innermost Brighter Disc) */}
          <div
            ref={(el) => { ringRefs.current[3] = el; }}
            className={`absolute inset-[50%] rounded-full border ${moduleTheme.border}/40`}
            style={{
              background: moduleTheme.disc4,
              transformStyle: 'preserve-3d',
            }}
          />
        </div>

        {/* =================================================================== */}
        {/* CARD CONTENT (Real Z Layers with preserve-3d)                       */}
        {/* =================================================================== */}
        <div
          className="sm-content relative p-6 sm:p-8 space-y-5"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Header Row: Icon Tile (Z +12), Eyebrow (Z +30), Badge (Z +30) */}
          <div
            ref={headerRef}
            className="flex items-center justify-between"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center gap-2" style={{ transformStyle: 'preserve-3d' }}>
              <div
                ref={iconRef}
                className="p-2 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] border border-[#D8CCB9] dark:border-[#3B3E36]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {getModuleIcon(panel.id)}
              </div>
              <span
                ref={eyebrowRef}
                className="font-mono text-xs font-bold tracking-widest text-[#4F6288] dark:text-[#9FB0D3]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {panel.number} // {panel.badge}
              </span>
            </div>

            {/* INTERACTIVE Badge: Stands in front of rings at Z +30 */}
            <span
              ref={badgeRef}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDE3D2] dark:bg-[#2E302B] text-[#64625A] dark:text-[#BDB5A6] border border-[#D8CCB9] dark:border-[#3B3E36]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              INTERACTIVE
            </span>
          </div>

          {/* Title (Z +46) with letter-doubling glitch & Subtitle (Z +38) */}
          <div style={{ transformStyle: 'preserve-3d' }}>
            <h3
              ref={titleRef}
              className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#20211E] dark:text-[#F4EDE1] uppercase"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <GlitchText text={panel.title} triggerKey={isActive ? idx : panel.id} />
            </h3>
            <p
              ref={subtitleRef}
              className="text-xs text-[#5A5B53] dark:text-[#D2C9BB] mt-1 font-medium"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {panel.subtitle}
            </p>
          </div>

          {/* ================================================================= */}
          {/* 08 INTERACTIVE "VERIFIED SKILLS" BOX (Floating Raised Panel)      */}
          {/* ================================================================= */}
          <div
            ref={boxRef}
            onPointerEnter={handleBoxPointerEnter}
            onPointerLeave={handleBoxPointerLeave}
            className="sm-box p-3.5 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] border border-[#D8CCB9] dark:border-[#3B3E36] space-y-2 cursor-default select-none transition-colors duration-150"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Box Header: Metric Label + Pill */}
            <div
              className="flex justify-between items-center text-xs font-mono"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="text-[#64625A] dark:text-[#BDB5A6]">{panel.metricLabel}</span>
              <span
                ref={boxPillRef}
                className="font-bold text-[#20211E] dark:text-[#F4EDE1] inline-block px-1 rounded transition-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {metricValue || (panel.id === 'skills' ? `${verifiedSkillsCount} Verified` : panel.metricValue)}
              </span>
            </div>

            {/* 3 Bullet Rows (Staggered Z depths, Dot Inversion on Row Hover) */}
            <div
              className="space-y-1 pt-1 border-t border-[#D8CCB9] dark:border-[#3B3E36]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {panel.highlights.map((hl, hIdx) => (
                <div
                  key={hIdx}
                  ref={(el) => { rowRefs.current[hIdx] = el; }}
                  onPointerEnter={() => handleRowPointerEnter(hIdx)}
                  onPointerLeave={() => handleRowPointerLeave(hIdx)}
                  className="flex items-center gap-2 text-xs py-0.5 rounded cursor-default"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Dot: Inverts and scales on hover with 3px soft ring */}
                  <span
                    ref={(el) => { dotRefs.current[hIdx] = el; }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-120"
                    style={{
                      backgroundColor: panel.rimColor,
                    }}
                  />
                  {/* Text: Brightens on hover */}
                  <span
                    ref={(el) => { rowTextRefs.current[hIdx] = el; }}
                    className="text-[#5A5B53] dark:text-[#D2C9BB] transition-colors duration-120"
                  >
                    {hl}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 09 INTERACTIVE LAUNCH BUTTON (Inverting Floating Action Button)    */}
          {/* ================================================================= */}
          <div className="flex items-center gap-3 pt-1" style={{ transformStyle: 'preserve-3d' }}>
            <button
              ref={btnRef}
              onClick={() => openModuleDrawer(panel.id)}
              onPointerEnter={handleBtnPointerEnter}
              onPointerLeave={handleBtnPointerLeave}
              onPointerDown={handleBtnPointerDown}
              onPointerUp={handleBtnPointerUp}
              onFocus={handleBtnPointerEnter}
              onBlur={handleBtnPointerLeave}
              className="sm-btn flex-1 py-3 px-4 rounded-xl bg-[#20211E] text-[#F8F4EC] font-mono font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors duration-140 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8495B8]"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <span ref={btnLabelRef} className="sm-btn-label">
                LAUNCH {panel.title}
              </span>
              <span ref={btnArrowRef} className="sm-btn-arrow inline-flex items-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {triggerRerouteAnimation && (
              <button
                ref={rerouteBtnRef}
                onClick={triggerRerouteAnimation}
                className="p-3 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] hover:bg-[#E8DDCB] dark:hover:bg-[#383A35] border border-[#D8CCB9] dark:border-[#3B3E36] text-[#20211E] dark:text-[#F4EDE1] transition-colors"
                title="Simulate Real-time Path Recalculation"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
