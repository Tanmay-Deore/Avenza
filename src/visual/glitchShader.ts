import * as THREE from 'three';

export const GlitchShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0.0 },
    uGlitch: { value: 0.0 },       // 0.0 (rest) to 1.0 (burst)
    uProgress: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uRimColor: { value: new THREE.Color('#7DB8FF') },
    uBorderWidth: { value: 0.02 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGlitch;
    uniform float uProgress;
    uniform vec3 uRimColor;
    uniform float uBorderWidth;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Pseudo-random helper
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;

      // Slice displacement on glitch burst
      if (uGlitch > 0.01) {
        float sliceY = floor(uv.y * 24.0);
        float sliceNoise = random(vec2(sliceY, floor(uTime * 14.0)));
        if (sliceNoise > 0.65) {
          float displacement = (sliceNoise - 0.5) * 0.08 * uGlitch;
          uv.x += displacement;
        }
      }

      // Chromatic RGB separation on glitch
      float split = 0.015 * uGlitch;
      vec4 colR = texture2D(tDiffuse, uv + vec2(split, 0.0));
      vec4 colG = texture2D(tDiffuse, uv);
      vec4 colB = texture2D(tDiffuse, uv - vec2(split, 0.0));

      vec4 texColor = vec4(colR.r, colG.g, colB.b, colG.a);

      // Soft paper/film grain (subtle 3-5%)
      float grain = (random(uv * uTime) - 0.5) * 0.05;
      texColor.rgb += grain;

      // Soft rounded rect card border highlight
      float edgeDistX = min(vUv.x, 1.0 - vUv.x);
      float edgeDistY = min(vUv.y, 1.0 - vUv.y);
      float edgeDist = min(edgeDistX, edgeDistY);

      if (edgeDist < uBorderWidth) {
        float rimFactor = smoothstep(0.0, uBorderWidth, edgeDist);
        texColor.rgb = mix(uRimColor * 1.2, texColor.rgb, rimFactor);
      }

      // Fresnel rim highlight
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
      texColor.rgb += uRimColor * fresnel * 0.35;

      gl_FragColor = texColor;
    }
  `
};
