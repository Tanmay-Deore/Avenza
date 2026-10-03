import * as THREE from 'three';
import { avenzaColors } from './visualTokens';

export class TorusRing {
  public group: THREE.Group;
  public torusOuter: THREE.Mesh;
  public torusInner: THREE.Mesh;
  public networkGroup: THREE.Group;

  private outerMaterial: THREE.MeshPhysicalMaterial;
  private innerMaterial: THREE.MeshPhysicalMaterial;

  constructor(isBrightTheme: boolean = true) {
    this.group = new THREE.Group();

    // 1. Large Double Glass Torus Ring
    const outerGeo = new THREE.TorusGeometry(1.65, 0.12, 32, 100);
    this.outerMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isBrightTheme ? '#D8CDBA' : '#292A26'),
      transmission: 0.92,
      roughness: 0.12,
      ior: 1.50,
      thickness: 1.0,
      specularIntensity: 0.85,
      specularColor: new THREE.Color(isBrightTheme ? '#EEE6D8' : '#F7F0E5'),
      attenuationColor: new THREE.Color(isBrightTheme ? '#A48B6A' : '#8495B8'),
      attenuationDistance: 2.0,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    });
    this.torusOuter = new THREE.Mesh(outerGeo, this.outerMaterial);
    this.group.add(this.torusOuter);

    // Inner Torus Ring nested at an offset tilt
    const innerGeo = new THREE.TorusGeometry(1.22, 0.065, 24, 80);
    this.innerMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isBrightTheme ? '#7E879D' : '#9FB0D3'),
      transmission: 0.70,
      roughness: 0.15,
      ior: 1.45,
      thickness: 0.6,
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color(isBrightTheme ? '#7E879D' : '#9FB0D3'),
      emissiveIntensity: 0.18,
    });
    this.torusInner = new THREE.Mesh(innerGeo, this.innerMaterial);
    this.torusInner.rotation.x = Math.PI * 0.25;
    this.group.add(this.torusInner);

    // 2. Emerging Skill Network Nodes attached to Torus Ring
    this.networkGroup = new THREE.Group();
    const nodeCoords = [
      { x: 1.6, y: 0.4, z: 0.2, label: 'PYTHON' },
      { x: -1.4, y: 0.8, z: -0.3, label: 'DATA' },
      { x: 0.6, y: -1.5, z: 0.4, label: 'AI & ML' },
      { x: -1.2, y: -0.9, z: -0.2, label: 'SYSTEMS' },
      { x: 0.0, y: 1.65, z: 0.1, label: 'ROADMAP' },
    ];

    const linePositions: number[] = [];

    nodeCoords.forEach((n, idx) => {
      const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? avenzaColors.fill.blue : avenzaColors.fill.sage,
        emissive: idx % 2 === 0 ? avenzaColors.fill.blue : avenzaColors.fill.sage,
        emissiveIntensity: 0.25,
        roughness: 0.2,
      });
      const node = new THREE.Mesh(sphereGeo, sphereMat);
      node.position.set(n.x, n.y, n.z);
      this.networkGroup.add(node);

      if (idx > 0) {
        linePositions.push(nodeCoords[idx - 1].x, nodeCoords[idx - 1].y, nodeCoords[idx - 1].z);
        linePositions.push(n.x, n.y, n.z);
      }
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: isBrightTheme ? 0x8495b8 : 0x9fb0d3,
      transparent: true,
      opacity: 0.5,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    this.networkGroup.add(lines);

    this.group.add(this.networkGroup);
    this.group.visible = false;
  }

  public update(time: number, scrollProgress: number) {
    if (scrollProgress >= 0.08 && scrollProgress <= 0.45) {
      this.group.visible = true;

      const progressInScene = (scrollProgress - 0.08) / 0.35;
      
      const posX = 1.8 - progressInScene * 2.8;
      const posY = 0.5 - Math.sin(progressInScene * Math.PI) * 0.6;
      const posZ = -0.5 + Math.sin(progressInScene * Math.PI) * 1.2;

      this.group.position.set(posX, posY, posZ);

      this.torusOuter.rotation.x = Math.PI * 0.25 + time * 0.15;
      this.torusOuter.rotation.y = time * 0.22;

      this.torusInner.rotation.y = -time * 0.3;
      this.torusInner.rotation.z = Math.sin(time * 0.5) * 0.4;

      const networkVisibility = Math.min(1.0, Math.max(0, (progressInScene - 0.4) * 2.0));
      this.networkGroup.scale.setScalar(networkVisibility);
      this.networkGroup.visible = networkVisibility > 0.05;

      let opacity = 1.0;
      if (progressInScene < 0.2) opacity = progressInScene / 0.2;
      if (progressInScene > 0.8) opacity = (1.0 - progressInScene) / 0.2;

      this.outerMaterial.opacity = Math.max(0.01, opacity * 0.95);
      this.innerMaterial.opacity = Math.max(0.01, opacity * 0.9);
    } else {
      this.group.visible = false;
    }
  }

  public setBrightTheme(isBright: boolean) {
    this.outerMaterial.color.set(isBright ? '#D8CDBA' : '#292A26');
    this.outerMaterial.specularColor.set(isBright ? '#EEE6D8' : '#F7F0E5');
    this.outerMaterial.attenuationColor.set(isBright ? '#A48B6A' : '#8495B8');
    this.innerMaterial.color.set(isBright ? '#7E879D' : '#9FB0D3');
    this.innerMaterial.emissive.set(isBright ? '#7E879D' : '#9FB0D3');
  }

  public dispose() {
    this.torusOuter.geometry.dispose();
    this.outerMaterial.dispose();
    this.torusInner.geometry.dispose();
    this.innerMaterial.dispose();
  }
}
