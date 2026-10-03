import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useVisual } from './visualStateStore';
import { HeroRibbon } from './HeroRibbon';
import { TorusRing } from './TorusRing';
import { Spine } from './Spine';
import { GlassPanelGroup } from './GlassPanelGroup';
import { ParticleField } from './ParticleField';

export const SceneRoot: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    state,
    setHoveredPanelIndex,
    openModuleDrawer,
  } = useVisual();

  const [webglSupported, setWebglSupported] = useState(true);

  // References to 3D instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const heroRibbonRef = useRef<HeroRibbon | null>(null);
  const torusRingRef = useRef<TorusRing | null>(null);
  const spineRef = useRef<Spine | null>(null);
  const glassPanelsRef = useRef<GlassPanelGroup | null>(null);
  const particlesRef = useRef<ParticleField | null>(null);

  // Animation & Camera targets
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 5.0));
  const currentCamPos = useRef(new THREE.Vector3(0, 0, 5.0));
  const targetCamLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentCamLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const pointerParallax = useRef(new THREE.Vector2(0, 0));

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isBright = stateRef.current.theme === 'bright';
    scene.background = null; // Transparent to blend seamlessly with CSS atmosphere gradient

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // 4. Soft Daylight Lighting
    const ambientLight = new THREE.AmbientLight(isBright ? 0xffffff : 0x242a3e, isBright ? 1.35 : 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, isBright ? 1.45 : 1.15);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const softRimLight = new THREE.DirectionalLight(isBright ? 0xcfe3ff : 0x7db8ff, isBright ? 0.75 : 0.6);
    softRimLight.position.set(-5, -4, -3);
    scene.add(softRimLight);

    // 5. Instantiate 3D Elements
    const heroRibbon = new HeroRibbon(isBright);
    heroRibbonRef.current = heroRibbon;
    scene.add(heroRibbon.group);

    const torusRing = new TorusRing(isBright);
    torusRingRef.current = torusRing;
    scene.add(torusRing.group);

    const spine = new Spine(isBright);
    spineRef.current = spine;
    scene.add(spine.group);

    const glassPanels = new GlassPanelGroup(isBright);
    glassPanelsRef.current = glassPanels;
    scene.add(glassPanels.group);

    const particleCount = width < 768 ? 35 : width < 1024 ? 70 : 140;
    const particles = new ParticleField(particleCount, isBright);
    particlesRef.current = particles;
    scene.add(particles.points);

    // 6. Pointer & Parallax handlers
    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerParallax.current.set(nx * 0.35, ny * 0.25);

      // Check panel hover in gallery
      if (glassPanelsRef.current && cameraRef.current) {
        const hit = glassPanelsRef.current.checkIntersection(new THREE.Vector2(nx, ny), cameraRef.current);
        setHoveredPanelIndex(hit ? hit.index : null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (glassPanelsRef.current && cameraRef.current) {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        const hit = glassPanelsRef.current.checkIntersection(new THREE.Vector2(nx, ny), cameraRef.current);
        if (hit) {
          openModuleDrawer(hit.id);
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    // 7. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Master Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      if (!isTabVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const s = stateRef.current;
      const p = s.scrollProgress; // 0.0 to 1.0

      // Calculate master camera trajectory across scenes
      if (p < 0.12) {
        // SCENE 1: Hero Ribbon - Slow push-in
        const heroProgress = p / 0.12;
        targetCamPos.current.set(
          pointerParallax.current.x * 0.6,
          pointerParallax.current.y * 0.4,
          5.0 - heroProgress * 1.2
        );
        targetCamLookAt.current.set(0, 0, 0);
      } else if (p < 0.35) {
        // SCENE 2: Statement + Torus Orbit
        const s2Prog = (p - 0.12) / 0.23;
        targetCamPos.current.set(
          -0.5 + pointerParallax.current.x * 0.8,
          0.3 + pointerParallax.current.y * 0.5,
          4.2 - s2Prog * 0.4
        );
        targetCamLookAt.current.set(0.5, 0, 0);
      } else {
        // SCENE 3: Spine & Gallery Descent
        // Move camera down from y=2 to y=-18 along the 6 panels
        const galleryProg = (p - 0.35) / 0.65;
        const targetY = 2.0 - galleryProg * 18.0;

        // Camera alternates slightly left/right based on active panel
        const panelIdx = s.activePanelIndex;
        const isLeftPanel = panelIdx % 2 === 0;
        const targetX = isLeftPanel ? -0.4 : 0.4;

        targetCamPos.current.set(
          targetX + pointerParallax.current.x * 0.5,
          targetY + pointerParallax.current.y * 0.3,
          4.8
        );
        targetCamLookAt.current.set(0, targetY - 0.2, 0);
      }

      // Smooth camera damping
      currentCamPos.current.lerp(targetCamPos.current, 0.065);
      currentCamLookAt.current.lerp(targetCamLookAt.current, 0.065);

      if (cameraRef.current) {
        cameraRef.current.position.copy(currentCamPos.current);
        cameraRef.current.lookAt(currentCamLookAt.current);
      }

      // Update 3D Elements
      const pointer3D = new THREE.Vector3(pointerParallax.current.x * 3.0, pointerParallax.current.y * 2.0, 0);

      if (heroRibbonRef.current) {
        heroRibbonRef.current.update(time, p, s.coreState);
      }
      if (torusRingRef.current) {
        torusRingRef.current.update(time, p);
      }
      if (spineRef.current) {
        spineRef.current.update(time, p);
      }
      if (glassPanelsRef.current) {
        const glitchFactor = Math.abs(s.scrollVelocity) * 0.04;
        glassPanelsRef.current.update(time, p, s.activePanelIndex, s.hoveredPanelIndex, glitchFactor);
      }
      if (particlesRef.current) {
        particlesRef.current.update(time, pointer3D, p);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (heroRibbonRef.current) heroRibbonRef.current.dispose();
      if (torusRingRef.current) torusRingRef.current.dispose();
      if (spineRef.current) spineRef.current.dispose();
      if (glassPanelsRef.current) glassPanelsRef.current.dispose();
      if (particlesRef.current) particlesRef.current.dispose();

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // Synchronize theme changes
  useEffect(() => {
    const isBright = state.theme === 'bright';
    if (heroRibbonRef.current) heroRibbonRef.current.setBrightTheme(isBright);
    if (torusRingRef.current) torusRingRef.current.setBrightTheme(isBright);
    if (spineRef.current) spineRef.current.setBrightTheme(isBright);
    if (glassPanelsRef.current) glassPanelsRef.current.setBrightTheme(isBright);
    if (particlesRef.current) particlesRef.current.setBrightTheme(isBright);
  }, [state.theme]);

  if (!webglSupported) {
    return (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="p-4 rounded-xl bg-white/80 backdrop-blur border text-xs text-gray-600">
          Hardware WebGL fallback active. Full interface available below.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto z-10 overflow-hidden"
      aria-hidden="true"
      style={{ touchAction: 'pan-y' }}
    />
  );
};
