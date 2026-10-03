import * as THREE from 'three';
import { avenzaColors } from './visualTokens';

export class Spine {
  public group: THREE.Group;
  public segments: THREE.Mesh[] = [];
  public lights: THREE.PointLight[] = [];
  private material: THREE.MeshPhysicalMaterial;

  constructor(isBrightTheme: boolean = true) {
    this.group = new THREE.Group();

    this.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isBrightTheme ? '#EDE3D2' : '#242520'),
      roughness: 0.18,
      metalness: 0.08,
      transmission: 0.75,
      thickness: 0.85,
      ior: 1.42,
      iridescence: isBrightTheme ? 0.70 : 0.85,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [100, 350],
      sheen: 0.6,
      sheenColor: new THREE.Color(isBrightTheme ? '#C8BDA9' : '#8495B8'),
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    });

    const segmentCount = 18;
    const segmentHeight = 1.4;

    for (let i = 0; i < segmentCount; i++) {
      const y = -i * segmentHeight + 4.0;
      
      const points: THREE.Vector2[] = [];
      points.push(new THREE.Vector2(0.22, -0.45));
      points.push(new THREE.Vector2(0.38, -0.3));
      points.push(new THREE.Vector2(0.18, 0.0));
      points.push(new THREE.Vector2(0.42, 0.3));
      points.push(new THREE.Vector2(0.24, 0.45));

      const vertebraGeo = new THREE.LatheGeometry(points, 32);
      const vertebraMesh = new THREE.Mesh(vertebraGeo, this.material);
      
      vertebraMesh.position.set(0, y, 0);
      vertebraMesh.rotation.y = (i * Math.PI) / 6;

      this.segments.push(vertebraMesh);
      this.group.add(vertebraMesh);

      // Connecting mini connector discs in #7E879D
      const discGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
      const discMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(isBrightTheme ? '#7E879D' : '#9FB0D3'),
        roughness: 0.3,
        metalness: 0.2,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.set(0, y - segmentHeight * 0.5, 0);
      this.group.add(disc);
    }

    this.group.visible = false;
  }

  public update(time: number, scrollProgress: number) {
    if (scrollProgress >= 0.30) {
      this.group.visible = true;

      this.segments.forEach((seg, idx) => {
        const offset = idx * 0.35;
        seg.rotation.y = (idx * Math.PI) / 6 + Math.sin(time * 0.8 + offset) * 0.08;
        seg.position.x = Math.sin(time * 0.6 + offset) * 0.04;
      });

      const fadeIn = Math.min(1.0, (scrollProgress - 0.30) / 0.1);
      this.group.scale.setScalar(fadeIn);
    } else {
      this.group.visible = false;
    }
  }

  public setBrightTheme(isBright: boolean) {
    this.material.color.set(isBright ? '#EDE3D2' : '#242520');
    this.material.sheenColor.set(isBright ? '#C8BDA9' : '#8495B8');
  }

  public dispose() {
    this.material.dispose();
    this.segments.forEach((s) => s.geometry.dispose());
  }
}
