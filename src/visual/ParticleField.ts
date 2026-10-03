import * as THREE from 'three';
import { avenzaColors } from './visualTokens';

export class ParticleField {
  public points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private count: number;
  private initialPositions: Float32Array;
  private velocities: Float32Array;

  constructor(count: number = 140, isBrightTheme: boolean = true) {
    this.count = count;
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const highlightColors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    this.initialPositions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);

    // Distribution matching Section 07:
    // 25% Beige, 25% Dusty Blue, 20% Sage, 20% Clay, 10% Muted Gold
    const families = avenzaColors.orbFamilies;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 1.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 14.0;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius + (Math.random() - 0.5) * 2.0;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      this.initialPositions[i3] = x;
      this.initialPositions[i3 + 1] = y;
      this.initialPositions[i3 + 2] = z;

      this.velocities[i3] = (Math.random() - 0.5) * 0.005;
      this.velocities[i3 + 1] = 0.002 + Math.random() * 0.006;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

      const rand = Math.random();
      let chosenFamily: (typeof families)[number] = families[0];
      let accum = 0;
      for (const fam of families) {
        accum += fam.weight;
        if (rand <= accum) {
          chosenFamily = fam;
          break;
        }
      }

      const fillColor = new THREE.Color(chosenFamily.fill);
      const hlColor = new THREE.Color(chosenFamily.highlight);

      colors[i3] = fillColor.r;
      colors[i3 + 1] = fillColor.g;
      colors[i3 + 2] = fillColor.b;

      highlightColors[i3] = hlColor.r;
      highlightColors[i3 + 1] = hlColor.g;
      highlightColors[i3 + 2] = hlColor.b;

      sizes[i] = 16.0 + Math.random() * 26.0;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('highlightColor', new THREE.BufferAttribute(highlightColors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uOpacity: { value: isBrightTheme ? 0.65 : 0.60 },
        uPointer: { value: new THREE.Vector3(0, 0, 0) },
        uRepulsionRadius: { value: 1.8 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec3 uPointer;
        uniform float uRepulsionRadius;

        attribute float size;
        attribute vec3 color;
        attribute vec3 highlightColor;

        varying vec3 vColor;
        varying vec3 vHighlightColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vHighlightColor = highlightColor;
          vec3 pos = position;

          pos.x += sin(uTime * 0.5 + pos.y * 0.8) * 0.15;
          pos.z += cos(uTime * 0.4 + pos.x * 0.8) * 0.15;

          float dist = distance(pos.xy, uPointer.xy);
          if (dist < uRepulsionRadius && dist > 0.01) {
            vec2 dir = normalize(pos.xy - uPointer.xy);
            float force = (1.0 - dist / uRepulsionRadius) * 0.6;
            pos.xy += dir * force;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = size * uPixelRatio * (12.0 / -mvPosition.z);
          vAlpha = smoothstep(18.0, 3.0, -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying vec3 vHighlightColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float edgeAlpha = smoothstep(0.5, 0.2, dist);
          float highlightFactor = smoothstep(0.28, 0.0, length(coord - vec2(-0.14, -0.14))) * 0.45;

          vec3 finalColor = mix(vColor, vHighlightColor, highlightFactor);
          gl_FragColor = vec4(finalColor, edgeAlpha * uOpacity * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  public update(time: number, pointerWorld: THREE.Vector3, scrollOffset: number = 0) {
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uPointer.value.copy(pointerWorld);

    const positions = this.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += this.velocities[i3 + 1];

      if (positions[i3 + 1] > 7.0) {
        positions[i3 + 1] = -7.0;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  public setBrightTheme(isBright: boolean) {
    this.material.uniforms.uOpacity.value = isBright ? 0.65 : 0.60;
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
