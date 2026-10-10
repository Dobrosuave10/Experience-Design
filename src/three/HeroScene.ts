import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { materialCanvas } from "../lib/materials";
import { makeMedalMaps } from "./logoTexture";

type Options = { mobile: boolean; reduced: boolean };

const INK = new THREE.Color("#171513");
/** El papel de la página (--paper): al otro lado del último arco está la web. */
const PAPER = new THREE.Color("#f5f1ea");
/** La misma salida vista desde lejos: luz cálida, todavía no papel. */
const EXIT_FAR = new THREE.Color("#d9b294");
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

/**
 * Medalla escultórica: un disco fino (canto visible pero delgado) con un bisel
 * discreto hacia la cara. Se monta contra el muro: no tiene cara trasera.
 */
function medalGeometry(R: number, depth: number, bevel: number) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(R - 0.02, 0), new THREE.Vector2(R, 0.012), new THREE.Vector2(R, depth - bevel)];
  for (let i = 1; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - bevel + bevel * Math.cos(a), depth - bevel + bevel * Math.sin(a)));
  }
  const rim = new THREE.LatheGeometry(pts, 160);
  rim.rotateX(Math.PI / 2);
  rim.rotateX(Math.PI); // el canto crece hacia +z (hacia la cámara)
  const face = new THREE.CircleGeometry(R - bevel, 160);
  face.translate(0, 0, depth);
  return { rim, face };
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private medal = new THREE.Group();
  private exitMat!: THREE.MeshBasicMaterial;
  private exitLight!: THREE.PointLight;
  private grazeLight!: THREE.PointLight;
  /** Profundidad del último arco (el umbral) y de la posición final de la cámara. */
  private lastArchZ = -21;
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
    this.scene.background = INK.clone();
    this.scene.fog = new THREE.Fog(INK.clone(), 9, 36);
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
    this.lastArchZ = depths[depths.length - 1];
    depths.forEach((z, i) => {
      const wall = new THREE.Mesh(archGeo, wallMat);
      wall.position.z = z - 0.8;
      wall.receiveShadow = i === 0;
      scene.add(wall);
      // Luz cálida dentro de cada tramo: la luz llama hacia adentro
      if (i < depths.length - 1) {
        const p = new THREE.PointLight("#ffb48c", 12 + i * 4, 0, 2);
        p.position.set(0, 1.2, z - 3.5);
        scene.add(p);
      }
    });

    // El suelo termina en el último umbral: más allá sólo existe la luz de la salida
    const floorLen = 12 - (this.lastArchZ - 0.8);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, floorLen),
      new THREE.MeshStandardMaterial({ color: "#221d19", roughness: 0.82 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, FLOOR_Y, 12 - floorLen / 2);
    floor.receiveShadow = !opts.mobile;
    scene.add(floor);

    // Al otro lado del último arco: un plano de luz que termina siendo el papel de la página.
    // Sin niebla ni tone mapping, para que su color final sea exactamente --paper.
    this.exitMat = new THREE.MeshBasicMaterial({ color: EXIT_FAR.clone(), fog: false, toneMapped: false });
    const exit = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), this.exitMat);
    exit.position.set(0, 2, this.lastArchZ - 4);
    scene.add(exit);
    // La luz de la salida entra al túnel y baña el último tramo
    this.exitLight = new THREE.PointLight("#ffd2b0", 0, 0, 2);
    this.exitLight.position.set(0, 0.8, this.lastArchZ - 1.2);
    scene.add(this.exitLight);

    // ---- La medalla: terracota grabada, montada sobre el muro del primer arco ----
    const maps = await makeMedalMaps(opts.mobile ? 512 : 1024);
    if (this.disposed) return;
    const map = new THREE.CanvasTexture(maps.color);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const normalMap = new THREE.CanvasTexture(maps.normal);
    const roughnessMap = new THREE.CanvasTexture(maps.rough);

    const R = 1.1;
    const { rim, face } = medalGeometry(R, 0.075, 0.028);
    const rimMat = new THREE.MeshStandardMaterial({ color: "#94473a", roughness: 0.9 });
    const faceMat = new THREE.MeshStandardMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(1.15, 1.15),
      roughness: 1,
      roughnessMap,
      envMapIntensity: 0.6,
    });
    const rimMesh = new THREE.Mesh(rim, rimMat);
    const faceMesh = new THREE.Mesh(face, faceMat);
    for (const m of [rimMesh, faceMesh]) {
      m.castShadow = !opts.mobile;
      this.medal.add(m);
    }
    scene.add(this.medal);

    // Luz rasante que acompaña al cursor y revela el grabado
    this.grazeLight = new THREE.PointLight("#ffe2c8", 6, 5, 2);
    scene.add(this.grazeLight);

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
    this.lookY = portrait ? 0.95 : 0.15;
    this.baseZ = portrait ? 9.5 : 8.5;
    // La medalla vive en el muro del primer arco (cara del muro en z = 0)
    if (portrait) {
      this.medal.position.set(0, 3.7, 0.005);
      this.medal.scale.setScalar(0.62);
    } else {
      this.medal.position.set(aspect > 1.45 ? 2.75 : 2.55, 0.55, 0.005);
      this.medal.scale.setScalar(aspect > 1.45 ? 1 : 0.88);
    }
    // El encuadre deja el arco y el titular a la izquierda y la medalla en el tercio derecho
    this.side = portrait ? 0 : aspect > 1.45 ? -0.55 : -0.35;
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
    const { camera, medal, opts } = this;
    const k = opts.reduced ? 1 : 0.06;
    this.progressSmooth += (this.progress - this.progressSmooth) * k;
    this.pointerSmooth.lerp(this.pointer, opts.reduced ? 1 : 0.04);
    const p = this.progressSmooth;
    const px = this.pointerSmooth.x, py = this.pointerSmooth.y;

    // A · Aproximación: la cámara avanza por la galería hasta cruzar el último umbral
    // avance casi lineal (paso humano): sale despacio y cruza el último arco al final del tramo
    const travel = 0.82 * p + 0.18 * easeInOut(p);
    const endZ = this.lastArchZ - 1.6;
    const z = this.baseZ + (endZ - this.baseZ) * travel;
    const settle = 1 - smooth(0, 0.3, p);
    const side = -this.side * settle;
    camera.position.set(side + px * 0.12 * settle, 0.25 + py * 0.06 * settle, z);
    const lookY = this.lookY + (0.35 - this.lookY) * smooth(0, 0.45, p);
    camera.lookAt(side * 0.6 + px * 0.06 * settle, lookY, z - 8.5);

    // B · La salida se revela: la luz del otro lado pasa de cálida a papel
    const reveal = smooth(0.45, 0.92, p);
    this.exitMat.color.copy(EXIT_FAR).lerp(PAPER, reveal);
    this.exitLight.intensity = 34 * smooth(0.35, 0.88, p);
    // C · Al cruzar el umbral todo lo que queda en cuadro es papel (sin líneas ni cortes)
    const crossed = smooth(0.9, 0.99, p);
    (this.scene.background as THREE.Color).copy(INK).lerp(PAPER, crossed);
    (this.scene.fog as THREE.Fog).color.copy(this.scene.background as THREE.Color);

    // Medalla: montada en el muro, sólo la luz y una mínima perspectiva responden al cursor
    const idle = opts.reduced ? 0 : 1;
    medal.rotation.y = px * 0.035 * idle;
    medal.rotation.x = -py * 0.025 * idle;
    // la luz rasante recorre el relieve
    this.grazeLight.position.set(
      medal.position.x + (opts.reduced ? -1.2 : -1.4 + px * 1.6 + Math.sin(t * 0.25) * 0.15),
      medal.position.y + (opts.reduced ? 1 : 0.9 + py * 0.8),
      medal.position.z + 0.9,
    );
    this.grazeLight.intensity = 6 * (1 - smooth(0.15, 0.4, p));

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
