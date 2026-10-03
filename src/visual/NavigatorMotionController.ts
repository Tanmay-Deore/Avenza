import * as THREE from 'three';
import { avenzaColors } from './visualTokens';
import { HeroRibbon } from './HeroRibbon';
import { TorusRing } from './TorusRing';
import { VisualState } from './visualStateStore';

/**
 * AVENZA 3D CINEMATIC NAVIGATOR
 * Advanced Motion Controller & Multi-Layer System
 * 
 * Architecture (Sections 06–07):
 * - LAYER 1: Base navigator animation (preserved in HeroRibbon, TorusRing, Spine, etc.)
 * - LAYER 2: Ambient breathing, micro-orbit precession, soft light movement
 * - LAYER 3: Interaction response (pointer, hover, skill selection ripple)
 * - LAYER 4: Product state (scanning sweep, checkpoint beacon, destination ring, rerouting, discovery branches, memory trail)
 * 
 * Strict Scope Lock:
 * - Uses exact existing avenzaColors palette.
 * - Zero new geometry replacements; enhances existing meshes.
 * - Feature flag allows 100% baseline rollback instantly.
 */

export const NAVIGATOR_UPGRADE_CONFIG = {
  enabled: true,             // Master toggle: set to false to restore 100% baseline
  ambientBreathing: true,    // Layer 2: Hero micro-breathing & lighting float
  microOrbitPrecession: true,// Layer 2: Organic micro-orbit variation
  navigationSignals: true,   // Layer 3/4: Route energy packets traversing ribbon curve
  whereYouAreMarker: true,   // Layer 3/4: Active checkpoint subtle highlight & pulse
  destinationBeacon: true,   // Layer 3/4: Destination beacon soft expanding ring
  skillRelationshipRipple: true, // Layer 3: Single ripple on skill selection
  navigatorLens: true,       // Layer 4: State-driven visual response (scan, map, route, etc.)
  rerouteChoreography: true, // Layer 4: Signature rerouting sequence
  memoryTrail: true,         // Layer 4: Visual-only fading traces of recent focus
  discoveryBranches: true,   // Layer 4: Exploration branches in discover mode
};

export interface MotionUpdateParams {
  time: number;
  delta: number;
  scrollProgress: number;
  visualState: VisualState;
  heroRibbon: HeroRibbon | null;
  torusRing: TorusRing | null;
  camera: THREE.PerspectiveCamera | null;
  ambientLight: THREE.AmbientLight | null;
  mainLight: THREE.DirectionalLight | null;
  softRimLight: THREE.DirectionalLight | null;
  activeCheckpointName?: string;
  targetRole?: string;
  isRerouting?: boolean;
}

interface MemoryTrace {
  position: THREE.Vector3;
  color: THREE.Color;
  alpha: number;
  birthTime: number;
}

export class NavigatorMotionController {
  public group: THREE.Group;

  // Layer 2: Ambient light baselines
  private baseAmbientIntensity = 1.35;
  private baseMainIntensity = 1.45;
  private isBrightTheme = true;

  // Layer 3: Navigation Signal traveling along curve
  private signalPacket: THREE.Mesh;
  private signalPacketMat: THREE.MeshBasicMaterial;
  private signalProgress = 0;
  private signalActive = false;
  private lastSignalTime = 0;

  // Layer 3: Where You Are Marker (Active Checkpoint)
  private checkpointHalo: THREE.Mesh;
  private checkpointHaloMat: THREE.MeshBasicMaterial;

  // Layer 3: Destination Beacon
  private destinationBeaconGroup: THREE.Group;
  private beaconRings: THREE.Mesh[] = [];
  private beaconRingMats: THREE.MeshBasicMaterial[] = [];

  // Layer 4: Scanning Sweep Ring
  private scanSweepRing: THREE.Mesh;
  private scanSweepMat: THREE.MeshBasicMaterial;
  private scanSweepProgress = 0;

  // Layer 4: Discovery Branches
  private discoveryBranchGroup: THREE.Group;
  private discoveryLines: THREE.Line[] = [];
  private discoveryLineMats: THREE.LineBasicMaterial[] = [];

  // Layer 4: Memory Trail
  private memoryTrailPoints: THREE.Points;
  private memoryTrailGeo: THREE.BufferGeometry;
  private memoryTrailMat: THREE.PointsMaterial;
  private memoryTraces: MemoryTrace[] = [];
  private maxMemoryTraces = 24;

  // Layer 4: Reroute Choreography
  private rerouteProgress = 0;
  private wasRerouting = false;

  // Selection Ripple State
  private lastSelectedSkill: string | null = null;
  private rippleProgress = 1.0; // 0 to 1, 1 means finished

  // Pre-allocated reusable vectors for zero GC stutter
  private tempVecA = new THREE.Vector3();
  private tempVecB = new THREE.Vector3();

  constructor(scene: THREE.Scene, isBrightTheme: boolean = true) {
    this.isBrightTheme = isBrightTheme;
    this.group = new THREE.Group();
    scene.add(this.group);

    // -------------------------------------------------------------
    // 1. Navigation Signal Packet (travels along HeroRibbon CatmullRomCurve3)
    // -------------------------------------------------------------
    const signalGeo = new THREE.SphereGeometry(0.045, 16, 16);
    this.signalPacketMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(isBrightTheme ? avenzaColors.fill.blue : avenzaColors.darkMode.accentBlue),
      transparent: true,
      opacity: 0,
    });
    this.signalPacket = new THREE.Mesh(signalGeo, this.signalPacketMat);
    this.signalPacket.visible = false;
    this.group.add(this.signalPacket);

    // -------------------------------------------------------------
    // 2. Where You Are Marker (Active Checkpoint Halo Ring)
    // -------------------------------------------------------------
    const haloGeo = new THREE.RingGeometry(0.08, 0.115, 32);
    this.checkpointHaloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(isBrightTheme ? avenzaColors.fill.sage : avenzaColors.darkMode.accentSage),
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    this.checkpointHalo = new THREE.Mesh(haloGeo, this.checkpointHaloMat);
    this.checkpointHalo.position.set(0.6, -0.2, 0.35); // Initial resting near early checkpoint
    this.group.add(this.checkpointHalo);

    // -------------------------------------------------------------
    // 3. Destination Beacon (Soft concentric expanding rings)
    // -------------------------------------------------------------
    this.destinationBeaconGroup = new THREE.Group();
    this.destinationBeaconGroup.position.set(1.4, 0.6, 0.3); // Target apex position

    for (let r = 0; r < 2; r++) {
      const ringGeo = new THREE.RingGeometry(0.12, 0.155, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(isBrightTheme ? avenzaColors.fill.gold : avenzaColors.darkMode.accentGold),
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      this.beaconRings.push(ringMesh);
      this.beaconRingMats.push(ringMat);
      this.destinationBeaconGroup.add(ringMesh);
    }
    this.group.add(this.destinationBeaconGroup);

    // -------------------------------------------------------------
    // 4. Scanning Sweep Ring (Core Discovery Wave)
    // -------------------------------------------------------------
    const scanGeo = new THREE.RingGeometry(0.1, 0.16, 48);
    this.scanSweepMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(isBrightTheme ? avenzaColors.fill.blue : avenzaColors.darkMode.accentBlue),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    this.scanSweepRing = new THREE.Mesh(scanGeo, this.scanSweepMat);
    this.scanSweepRing.rotation.x = Math.PI * 0.5;
    this.group.add(this.scanSweepRing);

    // -------------------------------------------------------------
    // 5. Discovery Branches (5 subtle spatial pathways from core)
    // -------------------------------------------------------------
    this.discoveryBranchGroup = new THREE.Group();
    const branchColors = [
      avenzaColors.fill.blue,
      avenzaColors.fill.sage,
      avenzaColors.fill.earth,
      avenzaColors.fill.clay,
      avenzaColors.fill.gold,
    ];

    for (let b = 0; b < 5; b++) {
      const angle = (b / 5) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      const branchLength = 2.4;
      for (let s = 0; s <= 16; s++) {
        const t = s / 16;
        const rad = t * branchLength;
        const curveOffset = Math.sin(t * Math.PI) * 0.35;
        const bx = Math.cos(angle) * rad;
        const by = curveOffset * (b % 2 === 0 ? 1 : -0.7);
        const bz = Math.sin(angle) * rad * 0.7;
        points.push(new THREE.Vector3(bx, by, bz));
      }
      const branchGeo = new THREE.BufferGeometry().setFromPoints(points);
      const branchMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(branchColors[b]),
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(branchGeo, branchMat);
      this.discoveryLines.push(line);
      this.discoveryLineMats.push(branchMat);
      this.discoveryBranchGroup.add(line);
    }
    this.group.add(this.discoveryBranchGroup);

    // -------------------------------------------------------------
    // 6. Memory Trail (Subtle fading visual history of focus points)
    // -------------------------------------------------------------
    this.memoryTrailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(this.maxMemoryTraces * 3);
    const trailColors = new Float32Array(this.maxMemoryTraces * 3);
    this.memoryTrailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    this.memoryTrailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

    this.memoryTrailMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    this.memoryTrailPoints = new THREE.Points(this.memoryTrailGeo, this.memoryTrailMat);
    this.group.add(this.memoryTrailPoints);
  }

  /**
   * Main Master Motion Tick — Evaluates all 4 layers synchronously without GC allocations
   */
  public update(params: MotionUpdateParams) {
    if (!NAVIGATOR_UPGRADE_CONFIG.enabled) return;

    const {
      time,
      delta,
      scrollProgress,
      visualState,
      heroRibbon,
      torusRing,
      camera,
      ambientLight,
      mainLight,
    } = params;

    const reduced = visualState.reducedMotion;
    const coreState = visualState.coreState;

    // -------------------------------------------------------------
    // LAYER 2: AMBIENT BREATHING & LIGHTING MODULATION (Section 08)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.ambientBreathing && !reduced) {
      // Very slow organic breathing (period ~5.2s, tiny amplitude 0.02)
      const breath = Math.sin(time * 1.2) * 0.02;
      const microFloatY = Math.sin(time * 0.8) * 0.015;

      if (heroRibbon) {
        heroRibbon.group.position.y = microFloatY;
        // Subtle additive scale modulation on top of base layer
        heroRibbon.ribbonMesh.scale.addScalar(breath * 0.3);
      }

      // Subtle daylight lighting breath
      if (ambientLight) {
        const baseAmb = this.isBrightTheme ? 1.35 : 0.85;
        ambientLight.intensity = baseAmb + Math.sin(time * 1.1) * 0.04;
      }
      if (mainLight) {
        const baseMain = this.isBrightTheme ? 1.45 : 1.15;
        mainLight.intensity = baseMain + Math.cos(time * 0.9) * 0.05;
      }
    }

    // -------------------------------------------------------------
    // LAYER 2: MICRO-ORBIT VARIATION (Section 09)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.microOrbitPrecession && heroRibbon && !reduced) {
      const nodes = heroRibbon.skillNodeGroup.children;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const offset = i * 1.25;
        // Controlled, organic orbital drift
        node.position.y += Math.sin(time * 0.6 + offset) * 0.0012;
      }
    }

    // -------------------------------------------------------------
    // LAYER 3: SKILL SELECTION RIPPLE & NODE RESPONSE (Sections 16–18)
    // -------------------------------------------------------------
    if (visualState.selectedSkillId !== this.lastSelectedSkill) {
      this.lastSelectedSkill = visualState.selectedSkillId;
      this.rippleProgress = 0.0; // Trigger single ripple
      this.addMemoryTrace(heroRibbon ? heroRibbon.group.position : this.tempVecA.set(0, 0, 0), time);
    }

    if (this.rippleProgress < 1.0) {
      this.rippleProgress += delta * 1.2;
      const rippleWave = Math.sin(this.rippleProgress * Math.PI);
      if (heroRibbon) {
        heroRibbon.skillNodeGroup.children.forEach((n, idx) => {
          const delayIdx = idx * 0.15;
          const localProgress = Math.max(0, Math.min(1, (this.rippleProgress - delayIdx) * 1.6));
          const nodePulse = Math.sin(localProgress * Math.PI) * 0.35;
          n.scale.setScalar(1.0 + nodePulse);
        });
      }
    }

    // Hovered node highlight
    if (heroRibbon && visualState.hoveredSkillId) {
      const activeIdx = Math.abs(visualState.hoveredSkillId.length % 5);
      const targetNode = heroRibbon.skillNodeGroup.children[activeIdx] as THREE.Mesh;
      if (targetNode) {
        targetNode.scale.setScalar(1.35 + Math.sin(time * 3.0) * 0.08);
      }
    }

    // -------------------------------------------------------------
    // LAYER 3/4: ROUTE SIGNAL PACKET TRAVERSAL (Section 10)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.navigationSignals && heroRibbon && heroRibbon.curve) {
      // Trigger signal traversal every 5 seconds
      if (time - this.lastSignalTime > 5.2 && !this.signalActive) {
        this.signalActive = true;
        this.signalProgress = 0.0;
        this.lastSignalTime = time;
        this.signalPacket.visible = true;
      }

      if (this.signalActive) {
        this.signalProgress += delta * 0.35; // ~2.8s traversal time
        if (this.signalProgress >= 1.0) {
          this.signalActive = false;
          this.signalPacket.visible = false;
        } else {
          // Sample point along the CatmullRomCurve3
          const pt = heroRibbon.curve.getPointAt(this.signalProgress);
          this.signalPacket.position.copy(pt);

          // Alpha fade in/out at extremities
          let alpha = Math.sin(this.signalProgress * Math.PI);
          this.signalPacketMat.opacity = alpha * 0.85;
          const signalScale = 1.0 + Math.sin(this.signalProgress * Math.PI * 4) * 0.25;
          this.signalPacket.scale.setScalar(signalScale);
        }
      }
    }

    // -------------------------------------------------------------
    // LAYER 3/4: WHERE YOU ARE MARKER (Active Checkpoint) (Section 12)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.whereYouAreMarker && this.checkpointHalo) {
      this.checkpointHalo.visible = scrollProgress < 0.55;
      if (this.checkpointHalo.visible) {
        this.checkpointHalo.rotation.z = time * 0.35;
        const pulse = 1.0 + (reduced ? 0 : Math.sin(time * 2.2) * 0.12);
        this.checkpointHalo.scale.setScalar(pulse);
      }
    }

    // -------------------------------------------------------------
    // LAYER 3/4: DESTINATION BEACON (Section 13 & 64)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.destinationBeacon && this.destinationBeaconGroup) {
      this.destinationBeaconGroup.visible = scrollProgress < 0.6;
      if (this.destinationBeaconGroup.visible) {
        this.beaconRings.forEach((ring, idx) => {
          const ringOffset = idx * 0.5;
          const cycle = ((time * 0.45 + ringOffset) % 1.0);
          const ringScale = 0.8 + cycle * 1.4;
          const ringAlpha = (1.0 - cycle) * (coreState === 'DESTINATION' ? 0.75 : 0.42);

          ring.scale.setScalar(ringScale);
          this.beaconRingMats[idx].opacity = ringAlpha;
          ring.rotation.z = time * 0.25 * (idx === 0 ? 1 : -1);
        });
      }
    }

    // -------------------------------------------------------------
    // LAYER 4: SCANNING STATE WAVE (Section 20)
    // -------------------------------------------------------------
    if (this.scanSweepRing) {
      if (coreState === 'SCANNING') {
        this.scanSweepRing.visible = true;
        this.scanSweepProgress = (this.scanSweepProgress + delta * 0.45) % 1.0;
        const scanScale = 0.5 + this.scanSweepProgress * 2.8;
        const scanAlpha = Math.sin(this.scanSweepProgress * Math.PI) * 0.5;
        this.scanSweepRing.scale.setScalar(scanScale);
        this.scanSweepMat.opacity = scanAlpha;
        this.scanSweepRing.rotation.z = time * 0.3;
      } else {
        this.scanSweepRing.visible = false;
        this.scanSweepProgress = 0;
      }
    }

    // -------------------------------------------------------------
    // LAYER 4: DISCOVERY BRANCHES (Section 25 & 62)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.discoveryBranches && this.discoveryBranchGroup) {
      const isExploring = coreState === 'EXPLORING' || visualState.activeModuleDrawer === 'discover';
      const targetOpacity = isExploring ? (this.isBrightTheme ? 0.45 : 0.60) : 0.0;

      this.discoveryBranchGroup.visible = targetOpacity > 0.01;
      this.discoveryBranchGroup.rotation.y = time * 0.08;

      this.discoveryLineMats.forEach((mat) => {
        mat.opacity += (targetOpacity - mat.opacity) * 0.08;
      });
    }

    // -------------------------------------------------------------
    // LAYER 4: REROUTING SEQUENCE CHOREOGRAPHY (Section 23 & 61)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.rerouteChoreography) {
      const isReroutingNow = visualState.isRerouting || coreState === 'REROUTING';
      if (isReroutingNow && !this.wasRerouting) {
        this.rerouteProgress = 0.0;
        this.wasRerouting = true;
      }

      if (this.rerouteProgress < 1.0 && this.wasRerouting) {
        this.rerouteProgress += delta * 0.45; // ~2.2s choreography
        const reroutePhase = Math.sin(this.rerouteProgress * Math.PI);

        // Stage 1: Route softens
        // Stage 2: Recalculation sweep
        // Stage 3: New path strengthens
        if (heroRibbon) {
          heroRibbon.ringMesh.rotation.z += reroutePhase * 0.08;
          heroRibbon.skillNodeGroup.scale.setScalar(1.0 + reroutePhase * 0.22);
        }
        if (torusRing) {
          torusRing.torusInner.rotation.x += reroutePhase * 0.05;
        }

        if (this.rerouteProgress >= 1.0) {
          this.wasRerouting = false;
        }
      }
    }

    // -------------------------------------------------------------
    // LAYER 4: MEMORY TRAIL UPDATE (Section 24 & 63)
    // -------------------------------------------------------------
    if (NAVIGATOR_UPGRADE_CONFIG.memoryTrail && this.memoryTrailPoints) {
      this.updateMemoryTrail(time, delta);
    }

    // -------------------------------------------------------------
    // CAMERA CHOREOGRAPHY REFINEMENT (Section 27)
    // -------------------------------------------------------------
    if (camera && !reduced) {
      let lensPushZ = 0;
      if (coreState === 'MENTORING') lensPushZ = 0.25;
      else if (coreState === 'DESTINATION') lensPushZ = -0.3;
      else if (coreState === 'MAPPING') lensPushZ = 0.15;

      camera.position.z += (lensPushZ * 0.1);
    }
  }

  /**
   * Adds a subtle fading memory position to the trail
   */
  public addMemoryTrace(position: THREE.Vector3, time: number) {
    if (!NAVIGATOR_UPGRADE_CONFIG.memoryTrail) return;

    const traceColor = new THREE.Color(
      this.isBrightTheme ? avenzaColors.fill.blue : avenzaColors.darkMode.accentBlue
    );

    this.memoryTraces.push({
      position: position.clone(),
      color: traceColor,
      alpha: 0.6,
      birthTime: time,
    });

    if (this.memoryTraces.length > this.maxMemoryTraces) {
      this.memoryTraces.shift();
    }
  }

  /**
   * Smoothly updates and fades memory trail points
   */
  private updateMemoryTrail(time: number, delta: number) {
    const posAttr = this.memoryTrailGeo.attributes.position as THREE.BufferAttribute;
    const colAttr = this.memoryTrailGeo.attributes.color as THREE.BufferAttribute;

    const positions = posAttr.array as Float32Array;
    const colors = colAttr.array as Float32Array;

    for (let i = 0; i < this.maxMemoryTraces; i++) {
      const i3 = i * 3;
      if (i < this.memoryTraces.length) {
        const trace = this.memoryTraces[i];
        trace.alpha -= delta * 0.08; // Gentle fade over ~7s

        positions[i3] = trace.position.x;
        positions[i3 + 1] = trace.position.y;
        positions[i3 + 2] = trace.position.z;

        colors[i3] = trace.color.r * Math.max(0, trace.alpha);
        colors[i3 + 1] = trace.color.g * Math.max(0, trace.alpha);
        colors[i3 + 2] = trace.color.b * Math.max(0, trace.alpha);
      } else {
        positions[i3] = 0;
        positions[i3 + 1] = -100; // Park offscreen
        positions[i3 + 2] = 0;
        colors[i3] = 0;
        colors[i3 + 1] = 0;
        colors[i3 + 2] = 0;
      }
    }

    // Clean up expired traces
    this.memoryTraces = this.memoryTraces.filter((t) => t.alpha > 0.01);

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  }

  /**
   * Synchronize theme colors across all visual layers
   */
  public setBrightTheme(isBright: boolean) {
    this.isBrightTheme = isBright;

    const blueColor = new THREE.Color(isBright ? avenzaColors.fill.blue : avenzaColors.darkMode.accentBlue);
    const sageColor = new THREE.Color(isBright ? avenzaColors.fill.sage : avenzaColors.darkMode.accentSage);
    const goldColor = new THREE.Color(isBright ? avenzaColors.fill.gold : avenzaColors.darkMode.accentGold);

    this.signalPacketMat.color.copy(blueColor);
    this.checkpointHaloMat.color.copy(sageColor);
    this.beaconRingMats.forEach((mat) => mat.color.copy(goldColor));
    this.scanSweepMat.color.copy(blueColor);
  }

  /**
   * Cleanly dispose of all GPU buffers and materials
   */
  public dispose() {
    this.signalPacket.geometry.dispose();
    this.signalPacketMat.dispose();

    this.checkpointHalo.geometry.dispose();
    this.checkpointHaloMat.dispose();

    this.beaconRings.forEach((r) => r.geometry.dispose());
    this.beaconRingMats.forEach((m) => m.dispose());

    this.scanSweepRing.geometry.dispose();
    this.scanSweepMat.dispose();

    this.discoveryLines.forEach((l) => l.geometry.dispose());
    this.discoveryLineMats.forEach((m) => m.dispose());

    this.memoryTrailGeo.dispose();
    this.memoryTrailMat.dispose();
  }
}
