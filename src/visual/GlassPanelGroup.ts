import * as THREE from 'three';
import { GlitchShader } from './glitchShader';
import { avenzaColors } from './visualTokens';

export interface ModulePanelData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  rimColor: string;
  metricLabel: string;
  metricValue: string;
  highlights: string[];
}

export const MODULE_PANELS: ModulePanelData[] = [
  {
    id: 'skills',
    number: '01',
    title: 'SKILL MAP',
    subtitle: 'Competency Matrix & Skill Diagnostic',
    badge: 'DIAGNOSTIC MATRIX',
    rimColor: avenzaColors.fill.blue,
    metricLabel: 'VERIFIED SKILLS',
    metricValue: '8 / 15',
    highlights: ['Multi-level depth rating (L1-L5)', 'Gap severity calculation', 'Verified vs. claimed proof'],
  },
  {
    id: 'journey',
    number: '02',
    title: 'LEARNING ROUTE',
    subtitle: 'Adaptive Roadmap & Milestones',
    badge: 'DYNAMIC NAVIGATION',
    rimColor: avenzaColors.fill.sage,
    metricLabel: 'ACTIVE CHECKPOINT',
    metricValue: 'STEP 03',
    highlights: ['Micro-paced to daily schedule', 'Auto-recalibrates on struggle', 'Connected mission checkpoints'],
  },
  {
    id: 'mentor',
    number: '03',
    title: 'AI MENTOR',
    subtitle: 'Grounded Contextual Tutor',
    badge: 'CONTEXT AWARE',
    rimColor: avenzaColors.fill.earth,
    metricLabel: 'CONFIDENCE BOOST',
    metricValue: '+28%',
    highlights: ['Tied to active checkpoint', 'Instant code hints & analogies', 'Zero generic hallucinations'],
  },
  {
    id: 'discover',
    number: '04',
    title: 'DISCOVERY ENGINE',
    subtitle: '“I Don’t Know What I Want” Compass',
    badge: 'CAREER EXPLORATION',
    rimColor: avenzaColors.fill.clay,
    metricLabel: 'DIRECTIONS',
    metricValue: '7 DOMAINS',
    highlights: ['Interactive career branches', 'Prerequisite inspectability', 'Starter mini-challenges'],
  },
  {
    id: 'verification',
    number: '05',
    title: 'VERIFICATION LAB',
    subtitle: 'Executable Proof & Code Diagnostics',
    badge: 'SKILL EVIDENCE',
    rimColor: avenzaColors.fill.sage,
    metricLabel: 'PASS THRESHOLD',
    metricValue: '75%',
    highlights: ['Code assertion testing', 'Automated rubric grading', 'Generates passport proof'],
  },
  {
    id: 'passport',
    number: '06',
    title: 'SKILL PASSPORT',
    subtitle: 'Cryptographic Proof & Capability Ledger',
    badge: 'VERIFIABLE LEDGER',
    rimColor: avenzaColors.fill.blue,
    metricLabel: 'CREDENTIALS',
    metricValue: 'IMMUTABLE',
    highlights: ['Cryptographic verification IDs', 'Live portfolio of artifacts', 'Direct recruiter sharing'],
  },
];

export class GlassPanelGroup {
  public group: THREE.Group;
  public panelMeshes: THREE.Mesh[] = [];
  public materials: THREE.ShaderMaterial[] = [];
  public canvasTextures: THREE.CanvasTexture[] = [];
  private raycaster = new THREE.Raycaster();
  private isBrightTheme: boolean;

  constructor(isBrightTheme: boolean = true) {
    this.isBrightTheme = isBrightTheme;
    this.group = new THREE.Group();

    const panelWidth = 3.6;
    const panelHeight = 2.25;
    const panelGeo = new THREE.PlaneGeometry(panelWidth, panelHeight, 32, 32);

    MODULE_PANELS.forEach((panelData, i) => {
      const texture = this.createPanelCanvasTexture(panelData, isBrightTheme);
      this.canvasTextures.push(texture);

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: texture },
          uTime: { value: 0 },
          uGlitch: { value: 0 },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(1024, 640) },
          uRimColor: { value: new THREE.Color(panelData.rimColor) },
          uBorderWidth: { value: 0.025 },
        },
        vertexShader: GlitchShader.vertexShader,
        fragmentShader: GlitchShader.fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      this.materials.push(mat);

      const mesh = new THREE.Mesh(panelGeo, mat);
      mesh.userData = { index: i, id: panelData.id };

      const isLeft = i % 2 === 0;
      const x = isLeft ? -1.85 : 1.85;
      const y = -i * 3.4 + 2.0;
      const z = (Math.random() - 0.5) * 0.3;
      const yaw = isLeft ? 0.28 : -0.28;

      mesh.position.set(x, y, z);
      mesh.rotation.y = yaw;
      mesh.rotation.x = 0.05;

      this.panelMeshes.push(mesh);
      this.group.add(mesh);
    });

    this.group.visible = false;
  }

  private createPanelCanvasTexture(data: ModulePanelData, isBright: boolean): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    // Background base - warm paper cream in daylight
    ctx.fillStyle = isBright ? 'rgba(248, 244, 236, 0.94)' : 'rgba(36, 37, 32, 0.92)';
    ctx.roundRect(0, 0, 1024, 640, 24);
    ctx.fill();

    // Top border accent line
    ctx.fillStyle = data.rimColor;
    ctx.fillRect(0, 0, 1024, 8);

    // Header badge & number
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = isBright ? '#4F6288' : '#9FB0D3';
    ctx.fillText(`${data.number}  //  ${data.badge}`, 50, 60);

    // Large Monospace Editorial Title
    ctx.font = '900 54px "JetBrains Mono", "Space Mono", monospace';
    ctx.fillStyle = isBright ? '#20211E' : '#F4EDE1';
    ctx.fillText(data.title, 50, 135);

    // Subtitle
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillStyle = isBright ? '#5A5B53' : '#BDB5A6';
    ctx.fillText(data.subtitle, 50, 180);

    // Divider
    ctx.strokeStyle = isBright ? '#D8CCB9' : '#3B3E36';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 215);
    ctx.lineTo(974, 215);
    ctx.stroke();

    // Key Highlights
    ctx.font = '500 22px "Inter", sans-serif';
    data.highlights.forEach((hl, idx) => {
      ctx.fillStyle = data.rimColor;
      ctx.beginPath();
      ctx.arc(60, 270 + idx * 55, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isBright ? '#20211E' : '#D2C9BB';
      ctx.fillText(hl, 85, 278 + idx * 55);
    });

    // Metric block in bottom right
    ctx.fillStyle = isBright ? 'rgba(237, 227, 210, 0.75)' : 'rgba(46, 48, 43, 0.8)';
    ctx.roundRect(680, 460, 290, 130, 16);
    ctx.fill();

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = isBright ? '#5A5B53' : '#BDB5A6';
    ctx.fillText(data.metricLabel, 705, 500);

    ctx.font = '900 36px "JetBrains Mono", monospace';
    ctx.fillStyle = isBright ? '#20211E' : '#F4EDE1';
    ctx.fillText(data.metricValue, 705, 550);

    // Bottom CTA Pill
    ctx.fillStyle = '#20211E';
    ctx.roundRect(50, 520, 240, 56, 14);
    ctx.fill();

    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillStyle = '#F8F4EC';
    ctx.fillText('EXPLORE MODULE →', 78, 556);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  public update(
    time: number,
    scrollProgress: number,
    activePanelIdx: number,
    hoveredPanelIdx: number | null,
    glitchIntensity: number = 0.0
  ) {
    if (scrollProgress >= 0.32) {
      this.group.visible = true;

      this.panelMeshes.forEach((mesh, idx) => {
        const mat = this.materials[idx];
        mat.uniforms.uTime.value = time;

        const isCurrent = idx === activePanelIdx;
        const isHovered = idx === hoveredPanelIdx;

        const glitchVal = isCurrent ? Math.max(glitchIntensity, 0.0) : (isHovered ? 0.25 : 0.0);
        mat.uniforms.uGlitch.value = THREE.MathUtils.lerp(mat.uniforms.uGlitch.value, glitchVal, 0.2);

        const targetScale = isHovered ? 1.08 : isCurrent ? 1.03 : 0.94;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const targetZ = isHovered ? 0.6 : isCurrent ? 0.2 : -0.1;
        mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 0.1);
      });
    } else {
      this.group.visible = false;
    }
  }

  public setBrightTheme(isBright: boolean) {
    this.isBrightTheme = isBright;
    MODULE_PANELS.forEach((data, i) => {
      const newTex = this.createPanelCanvasTexture(data, isBright);
      this.materials[i].uniforms.tDiffuse.value = newTex;
    });
  }

  public checkIntersection(
    pointerNormalized: THREE.Vector2,
    camera: THREE.Camera
  ): { index: number; id: string } | null {
    if (!this.group.visible) return null;
    this.raycaster.setFromCamera(pointerNormalized, camera);
    const intersects = this.raycaster.intersectObjects(this.panelMeshes);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      return { index: hit.userData.index, id: hit.userData.id };
    }
    return null;
  }

  public dispose() {
    this.panelMeshes.forEach((m) => m.geometry.dispose());
    this.materials.forEach((m) => m.dispose());
    this.canvasTextures.forEach((t) => t.dispose());
  }
}
