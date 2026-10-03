import * as THREE from 'three';
import { avenzaColors } from './visualTokens';

export class HeroRibbon {
  public group: THREE.Group;
  public ribbonMesh: THREE.Mesh;
  public ringMesh: THREE.Mesh;
  public innerCoreMesh: THREE.Mesh;
  public skillNodeGroup: THREE.Group;
  
  private ribbonMaterial: THREE.MeshPhysicalMaterial;
  private ringMaterial: THREE.MeshPhysicalMaterial;
  private glowMaterial: THREE.MeshBasicMaterial;

  constructor(isBrightTheme: boolean = true) {
    this.group = new THREE.Group();

    // 1. Figure-8 / Trefoil / Crossed Loop Ribbon Curve
    const curvePoints: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const scale = 1.35;
      const x = Math.sin(t) * scale;
      const y = Math.sin(t * 2.0) * 0.75 * scale;
      const z = Math.cos(t) * 0.45 * scale;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    const ribbonGeo = new THREE.TubeGeometry(curve, 100, 0.08, 16, true);

    // Translucent physical warm stone glass material matching Section 06:
    // Base #D8CDBA with attenuation #A48B6A and highlight #EEE6D8
    this.ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isBrightTheme ? '#D8CDBA' : '#292A26'),
      transmission: isBrightTheme ? 0.90 : 0.82,
      opacity: 0.95,
      transparent: true,
      roughness: 0.14,
      ior: 1.48,
      thickness: 0.8,
      specularIntensity: 0.85,
      specularColor: new THREE.Color(isBrightTheme ? '#EEE6D8' : '#F7F0E5'),
      attenuationColor: new THREE.Color(isBrightTheme ? '#A48B6A' : '#8495B8'),
      attenuationDistance: 2.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
    });

    this.ribbonMesh = new THREE.Mesh(ribbonGeo, this.ribbonMaterial);
    this.group.add(this.ribbonMesh);

    // 2. Circular Emblem Ring atop the ribbon:
    // Main ring #7E879D matching Section 06
    const ringGeo = new THREE.TorusGeometry(0.78, 0.038, 24, 64);
    this.ringMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isBrightTheme ? '#7E879D' : '#9FB0D3'),
      metalness: 0.18,
      roughness: 0.15,
      clearcoat: 1.0,
      transmission: 0.40,
      transparent: true,
      opacity: 0.95,
      emissive: new THREE.Color(isBrightTheme ? '#7E879D' : '#9FB0D3'),
      emissiveIntensity: 0.15,
    });

    this.ringMesh = new THREE.Mesh(ringGeo, this.ringMaterial);
    this.ringMesh.rotation.x = Math.PI * 0.35;
    this.ringMesh.position.set(0, 0.2, 0.1);
    this.group.add(this.ringMesh);

    // 3. Faint Internal Glow Core:
    // Secondary ring / warm stone tone #C8BDA9
    const coreGeo = new THREE.SphereGeometry(0.28, 32, 32);
    this.glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(isBrightTheme ? '#C8BDA9' : '#BDB5A6'),
      transparent: true,
      opacity: 0.25,
    });
    this.innerCoreMesh = new THREE.Mesh(coreGeo, this.glowMaterial);
    this.group.add(this.innerCoreMesh);

    // 4. Subtle orbital skill node anchors around Core:
    // Dusty Blue, Sage, Earth, Clay, Gold
    this.skillNodeGroup = new THREE.Group();
    const nodeColors = [
      avenzaColors.fill.blue,
      avenzaColors.fill.sage,
      avenzaColors.fill.earth,
      avenzaColors.fill.clay,
      avenzaColors.fill.gold,
    ];

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const rad = 1.75;
      const nodeGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(nodeColors[i]),
        emissive: new THREE.Color(nodeColors[i]),
        emissiveIntensity: 0.25,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(Math.cos(angle) * rad, Math.sin(angle) * 0.6, Math.sin(angle) * rad * 0.5);
      this.skillNodeGroup.add(nodeMesh);
    }
    this.group.add(this.skillNodeGroup);
  }

  public update(time: number, scrollProgress: number, coreState: string = 'IDLE') {
    const breath = Math.sin(time * 1.2) * 0.05;
    this.ribbonMesh.scale.set(1 + breath, 1 + breath, 1 + breath);
    this.ribbonMesh.rotation.y = Math.sin(time * 0.35) * 0.18;
    this.ribbonMesh.rotation.x = Math.cos(time * 0.25) * 0.12;

    this.ringMesh.rotation.z = time * 0.25;
    this.ringMesh.position.y = 0.2 + Math.sin(time * 1.5) * 0.04;

    const coreScale = 1.0 + Math.sin(time * 2.2) * 0.12;
    this.innerCoreMesh.scale.set(coreScale, coreScale, coreScale);

    this.skillNodeGroup.rotation.y = time * 0.15;

    if (coreState === 'SCANNING') {
      this.ringMaterial.emissiveIntensity = 0.40 + Math.sin(time * 5.0) * 0.20;
    } else if (coreState === 'MAPPING') {
      this.skillNodeGroup.scale.setScalar(1.2 + Math.sin(time * 2.0) * 0.1);
    } else {
      this.ringMaterial.emissiveIntensity = 0.15;
      this.skillNodeGroup.scale.setScalar(1.0);
    }

    if (scrollProgress > 0.12) {
      const fadeOut = Math.max(0, 1.0 - (scrollProgress - 0.12) * 6.0);
      this.group.scale.setScalar(Math.max(0.001, fadeOut));
      this.group.visible = fadeOut > 0.01;
    } else {
      this.group.scale.setScalar(1.0);
      this.group.visible = true;
    }
  }

  public setBrightTheme(isBright: boolean) {
    this.ribbonMaterial.color.set(isBright ? '#D8CDBA' : '#292A26');
    this.ribbonMaterial.specularColor.set(isBright ? '#EEE6D8' : '#F7F0E5');
    this.ribbonMaterial.attenuationColor.set(isBright ? '#A48B6A' : '#8495B8');
    this.ringMaterial.color.set(isBright ? '#7E879D' : '#9FB0D3');
    this.ringMaterial.emissive.set(isBright ? '#7E879D' : '#9FB0D3');
    this.glowMaterial.color.set(isBright ? '#C8BDA9' : '#BDB5A6');
  }

  public dispose() {
    this.ribbonMesh.geometry.dispose();
    this.ribbonMaterial.dispose();
    this.ringMesh.geometry.dispose();
    this.ringMaterial.dispose();
    this.innerCoreMesh.geometry.dispose();
    this.glowMaterial.dispose();
  }
}
