import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { materialCanvas } from "../lib/materials";
import { makeLogoCanvases } from "./logoTexture";

type Options = { mobile: boolean; reduced: boolean };

const INK = new THREE.Color("#171513");
const FLOOR_Y = -2.2;
const OPENING_HALF = 1.3;
const SPRING_Y = 1.4;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** Muro con un arco de medio punto, extruido: la "puerta" por la que se entra. */
function archGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-18, FLOOR_Y - 1);
  shape.lineTo(18, FLOOR_Y - 1);
  shape.lineTo(18, 16);
  shape.lineTo(-18, 16);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-OPENING_HALF, FLOOR_Y);
  hole.lineTo(-OPENING_HALF, SPRING_Y);
  hole.absarc(0, SPRING_Y, OPENING_HALF, Math.PI, 0, true);
  hole.lineTo(OPENING_HALF, FLOOR_Y);
  hole.closePath();
  shape.holes.push(hole);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.8,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 64,
  });
}

/** Moneda/sello con canto redondeado (torno) y dos caras con el logo. */
function coinGeometry(R: number, h: number) {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = -Math.PI / 2 + (i / 20) * Math.PI;
    pts.push(new THREE.Vector2(R - h + h * Math.cos(a), h * Math.sin(a)));
  }
  const rim = new THREE.LatheGeometry(pts, 128);
  rim.rotateX(Math.PI / 2);
  const face = new THREE.CircleGeometry(R - h, 128);
  return { rim, face };
}

function backdropTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(256, 300, 10, 256, 280, 360);
  g.addColorStop(0, "#F7EBDD");
  g.addColorStop(0.28, "#E9C9AE");
  g.addColorStop(0.62, "#B7664F");
  g.addColorStop(1, "#3a221a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private coin = new THREE.Group();
  private t0 = 0;
  private raf = 0;
  private running = false;
  private disposed = false;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private progress = 0;
  private progressSmooth = 0;
  private lookY = 0.3;
  private baseZ = 8.5;
  /** Desplazamiento lateral: en pantallas anchas el sello vive a la derecha y el texto a la izquierda. */
  private side = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: Options,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.mobile, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = !opts.mobile;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 90);
    this.scene.background = INK;
    this.scene.fog = new THREE.Fog(INK, 9, 36);
  }

  async init() {
    const { scene, opts } = this;

    // Reflejos suaves de estudio en la cerámica
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.22;
    pmrem.dispose();

    // ---- Luz ----
    scene.add(new THREE.HemisphereLight("#f3e3d2", "#2a2521", 0.16));
    const key = new THREE.DirectionalLight("#ffe6cf", 2.4);
    key.position.set(-4.5, 5, 8);
    key.target.position.set(0, 0, 0);
    scene.add(key, key.target);
    if (!opts.mobile) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      const sc = key.shadow.camera;
      sc.left = -5;
      sc.right = 5;
      sc.top = 5;
      sc.bottom = -5;
      sc.near = 1;
      sc.far = 26;
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
      key.shadow.radius = 6;
    }

    // ---- Arcos en profundidad: una galería por la que se entra ----
    const plaster = new THREE.CanvasTexture(materialCanvas("plaster"));
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(0.22, 0.22);
    const wallMat = new THREE.MeshStandardMaterial({ color: "#3a2f28", roughness: 0.94, bumpMap: plaster, bumpScale: 2.2 });
    const archGeo = archGeometry();
    const depths = opts.mobile ? [0, -7, -14] : [0, -7, -14, -21];
    depths.forEach((z, i) => {
      const wall = new THREE.Mesh(archGeo, wallMat);
      wall.position.z = z - 0.8;
      wall.receiveShadow = i === 0;
      scene.add(wall);
      // Luz cálida dentro de cada tramo: la luz llama hacia adentro
      const p = new THREE.PointLight("#ffb48c", 14 + i * 4, 0, 2);
      p.position.set(0, 1.2, z - 3.5);
      scene.add(p);
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 70),
      new THREE.MeshStandardMaterial({ color: "#221d19", roughness: 0.82 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, FLOOR_Y, -20);
    floor.receiveShadow = !opts.mobile;
    scene.add(floor);

    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 30),
      new THREE.MeshBasicMaterial({ map: backdropTexture(), fog: false, toneMapped: false }),
    );
    backdrop.position.set(0, 2, -32);
    scene.add(backdrop);

    // ---- El sello: el logo como objeto físico de terracota ----
    const { color, relief } = await makeLogoCanvases();
    if (this.disposed) return;
    const map = new THREE.CanvasTexture(color);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const bump = new THREE.CanvasTexture(relief);

    const R = 1.05, h = 0.1;
    const { rim, face } = coinGeometry(R, h);
    const rimMat = new THREE.MeshPhysicalMaterial({ color: "#9c4c39", roughness: 0.8, side: THREE.DoubleSide });
    const faceMat = new THREE.MeshPhysicalMaterial({
      map,
      bumpMap: bump,
      bumpScale: 3,
      roughness: 0.86,
      roughnessMap: bump,
      clearcoat: 0.05,
    });
    const rimMesh = new THREE.Mesh(rim, rimMat);
    const front = new THREE.Mesh(face, faceMat);
    front.position.z = h;
    const back = new THREE.Mesh(face, faceMat);
    back.position.z = -h;
    back.rotation.y = Math.PI;
    for (const m of [rimMesh, front, back]) {
      m.castShadow = !opts.mobile;
      this.coin.add(m);
    }
    this.coin.position.set(0, 0.35, 1.4);
    scene.add(this.coin);

    this.resize();
    this.renderer.compile(scene, this.camera);
    this.render(0);
  }

  setProgress(p: number) {
    this.progress = p;
    if (this.opts.reduced) {
      this.progressSmooth = p;
      this.render(0);
    }
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth, h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    // Retrato: lente más abierta y sello en la mitad superior (el texto vive abajo)
    const portrait = aspect < 0.85;
    this.camera.fov = portrait ? 46 : aspect < 1.3 ? 38 : 30;
    this.lookY = portrait ? -1.25 : 0.15;
    this.baseZ = portrait ? 9.5 : 8.5;
    this.coin.scale.setScalar(portrait ? 0.9 : 0.8);
    this.side = portrait ? 0 : aspect > 1.45 ? 1.55 : 0.9;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render(0);
  }

  start() {
    if (this.running || this.opts.reduced) return;
    this.running = true;
    if (!this.t0) this.t0 = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.render((performance.now() - this.t0) / 1000);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private render(t: number) {
    const { camera, coin, opts } = this;
    const k = opts.reduced ? 1 : 0.075;
    this.progressSmooth += (this.progress - this.progressSmooth) * k;
    this.pointerSmooth.lerp(this.pointer, opts.reduced ? 1 : 0.05);
    const p = this.progressSmooth;
    const travel = easeInOut(p);
    const px = this.pointerSmooth.x, py = this.pointerSmooth.y;

    // Cámara: avanza a través de los arcos hacia la luz
    const side = this.side * (1 - smooth(0, 0.3, p));
    camera.position.set(-side + px * 0.35 * (1 - travel), 0.25 + py * 0.18 * (1 - travel), this.baseZ - travel * 36);
    camera.lookAt(-side + px * 0.15, this.lookY + (0.2 - this.lookY) * travel, camera.position.z - 8.5);

    // Sello: respira, sigue al cursor y se eleva al entrar
    const lift = smooth(0.02, 0.32, p);
    const idle = opts.reduced ? 0 : 1;
    coin.position.y = 0.35 + Math.sin(t * 0.8) * 0.04 * idle + lift * 3.4;
    coin.rotation.y = px * 0.5 + Math.sin(t * 0.35) * 0.2 * idle + lift * 1.2;
    coin.rotation.x = -py * 0.32 - lift * 0.9;
    coin.rotation.z = Math.sin(t * 0.27) * 0.03 * idle;

    this.renderer.render(this.scene, camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => {
        Object.values(mat).forEach((v) => v instanceof THREE.Texture && v.dispose());
        mat.dispose();
      });
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }
}
