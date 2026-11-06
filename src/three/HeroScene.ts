import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { materialCanvas } from "../lib/materials";

type Options = { mobile: boolean; reduced: boolean };

const INK = new THREE.Color("#171513");
/** Centro y radio del túnel: una galería circular, más ancha que alta la vista. */
const CENTER_Y = 0.35;
const RADIUS = 2.75;
/** Suelo plano dentro del círculo (una cuerda baja). */
const FLOOR_Y = CENTER_Y - RADIUS * 0.82;
/** Grosor de cada anillo y separación entre anillos. */
const RING_DEPTH = 0.55;
const BAY = 3.6;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Muro con una abertura circular, extruido: cada anillo del túnel. */
function ringWallGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-18, -12);
  shape.lineTo(18, -12);
  shape.lineTo(18, 16);
  shape.lineTo(-18, 16);
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, CENTER_Y, RADIUS, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape, {
    depth: RING_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 96,
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Fin del túnel: la "E." negra dentro de un círculo de trazo fino, sobre transparente. */
async function endMarkTexture(markSrc: string) {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.strokeStyle = "#0e0c0b";
  ctx.lineWidth = size * 0.0045;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
  ctx.stroke();
  const mark = await loadImage(markSrc);
  if (mark) {
    // misma proporción que en el DOM (.logo--ring): la "E." mide el 44 % del círculo
    const h = size * 0.92 * 0.44, w = h * (441 / 484);
    ctx.drawImage(mark, size / 2 - w / 2 + w * 0.03, size / 2 - h / 2, w, h);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/**
 * Encuadre por proporción de pantalla. La cámara mira el túnel apenas en oblicuo
 * y el centro del círculo se coloca a la derecha del titular, sin pasarle por encima.
 */
type Frame = {
  fov: number;
  dist: number;
  /** Posición del eje de la cámara en el cuadro (0..1). */
  axisX: number;
  axisY: number;
  /** Desplazamiento lateral de la cámara respecto del eje del túnel (vista oblicua). */
  camX: number;
};

function frameFor(aspect: number): Frame {
  if (aspect < 0.85) return { fov: 46, dist: 15, axisX: 0.5, axisY: 0.32, camX: -0.15 };
  if (aspect < 1.3) return { fov: 36, dist: 14, axisX: 0.62, axisY: 0.46, camX: -0.3 };
  return { fov: 32, dist: 13.5, axisX: aspect > 1.7 ? 0.64 : 0.66, axisY: 0.5, camX: -0.35 };
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private raf = 0;
  private running = false;
  private disposed = false;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private progress = 0;
  private progressSmooth = 0;
  private frame: Frame = frameFor(1.6);
  private size = { w: 1, h: 1 };
  private endZ = -24;
  /** Borde derecho del titular (fracción del ancho): el túnel nunca se dibuja a su izquierda. */
  private safeLeft = 0;
  private axisX = 0.64;

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
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 90);
    this.scene.background = INK;
    this.scene.fog = new THREE.Fog(INK, 14, 42);
  }

  async init() {
    const { scene, opts } = this;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.22;
    pmrem.dispose();

    // ---- Luz ----
    // 1 · Ambiente mínimo
    scene.add(new THREE.HemisphereLight("#e9cdb6", "#1c1511", 0.08));
    // 2 · Clave cálida y rasante desde arriba a la izquierda: dibuja el muro frontal y el canto del primer anillo
    const key = new THREE.DirectionalLight("#ffdcbc", 1.25);
    key.position.set(-6.5, 5.5, 8);
    key.target.position.set(0.6, -0.2, -3);
    scene.add(key, key.target);
    if (!opts.mobile) {
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      const sc = key.shadow.camera;
      sc.left = -11;
      sc.right = 11;
      sc.top = 11;
      sc.bottom = -11;
      sc.near = 1;
      sc.far = 48;
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
      key.shadow.radius = 8;
    }
    // 3 · Foco amplio y difuso sobre el muro, alrededor de la abertura
    const wash = new THREE.SpotLight("#ffc9a0", 40, 26, 0.5, 1, 1.6);
    wash.position.set(-2.5, 5.5, 10);
    wash.target.position.set(0.8, 0.2, 0);
    scene.add(wash, wash.target);

    // ---- El túnel: anillos de muro con abertura circular y una bóveda cilíndrica entre ellos ----
    const plaster = new THREE.CanvasTexture(materialCanvas("plaster"));
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(0.22, 0.22);
    const wallMat = new THREE.MeshStandardMaterial({ color: "#4e372b", roughness: 0.93, bumpMap: plaster, bumpScale: 0.8, envMapIntensity: 0.5 });
    const vaultMat = new THREE.MeshStandardMaterial({ color: "#4a3328", roughness: 0.95, bumpMap: plaster, bumpScale: 0.6, side: THREE.BackSide, envMapIntensity: 0.4 });
    // canto de cada anillo: un toro fino, más claro, que dibuja el círculo
    const lipMat = new THREE.MeshStandardMaterial({ color: "#6a4a39", roughness: 0.8, envMapIntensity: 0.6 });
    const wallGeo = ringWallGeometry();
    const vaultGeo = new THREE.CylinderGeometry(RADIUS + 0.02, RADIUS + 0.02, BAY - RING_DEPTH, 96, 1, true);
    vaultGeo.rotateX(Math.PI / 2);
    const lipGeo = new THREE.TorusGeometry(RADIUS - 0.02, 0.05, 12, 128);
    const count = opts.mobile ? 4 : 6;
    const depths = Array.from({ length: count }, (_, i) => -i * BAY);
    depths.forEach((z, i) => {
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.z = z - RING_DEPTH;
      wall.castShadow = !opts.mobile;
      wall.receiveShadow = !opts.mobile;
      scene.add(wall);
      for (const lz of [z + 0.03, z - RING_DEPTH - 0.03]) {
        const lip = new THREE.Mesh(lipGeo, lipMat);
        lip.position.set(0, CENTER_Y, lz);
        scene.add(lip);
      }
      if (i === depths.length - 1) return;
      const mid = z - RING_DEPTH - (BAY - RING_DEPTH) / 2;
      const vault = new THREE.Mesh(vaultGeo, vaultMat);
      vault.position.set(0, CENTER_Y, mid);
      vault.receiveShadow = !opts.mobile;
      scene.add(vault);
      // Rebote tenue en cada tramo: crece hacia la luz del fondo
      const bounce = new THREE.PointLight("#e9b48f", 1 + i * 1.4, 5.5, 2);
      bounce.position.set(0, FLOOR_Y + 0.7, mid - 0.6);
      scene.add(bounce);
    });

    // Suelo de piedra apenas satinada, plano dentro del círculo
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(RADIUS * 2, 70),
      new THREE.MeshStandardMaterial({ color: "#3a261b", roughness: 0.72, metalness: 0.02, envMapIntensity: 0.35, fog: false }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, FLOOR_Y + 0.01, -20);
    floor.receiveShadow = !opts.mobile;
    scene.add(floor);

    // Al fondo, la luz blanca: el espacio al que lleva el túnel
    const lastZ = depths[depths.length - 1] - RING_DEPTH;
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 30),
      new THREE.MeshBasicMaterial({ color: "#ffffff", fog: false, toneMapped: false }),
    );
    backdrop.position.set(0, 2, lastZ - 9);
    scene.add(backdrop);
    // y en ella, la "E." en su círculo fino, a la altura de la cámara. Su tamaño coincide con
    // la del cierre en blanco del Hero (≈ 21 % del alto de pantalla al final del recorrido)
    const markTex = await endMarkTexture("/brand/mark-dark.svg");
    if (this.disposed) return;
    const mark = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({ map: markTex, transparent: true, fog: false, toneMapped: false }),
    );
    mark.position.set(0, 0.25, lastZ - 8.98);
    scene.add(mark);
    // La luz de la abertura: entra blanca desde el otro espacio hacia la cámara
    const opening = new THREE.SpotLight("#fff1e2", 64, 36, 0.5, 0.8, 1.35);
    opening.position.set(0.15, 1.1, lastZ - 3.2);
    opening.target.position.set(-0.3, 1.2, 6);
    scene.add(opening, opening.target);
    if (!opts.mobile) {
      opening.castShadow = true;
      opening.shadow.mapSize.set(1024, 1024);
      opening.shadow.camera.near = 0.5;
      opening.shadow.camera.far = 36;
      opening.shadow.bias = -0.0006;
      opening.shadow.normalBias = 0.03;
      opening.shadow.radius = 4;
    }
    const glow = new THREE.PointLight("#fff3e6", 14, 8, 2);
    glow.position.set(0, -0.4, lastZ - 1.2);
    scene.add(glow);
    const beyond = new THREE.PointLight("#fff6ee", 12, 9, 2);
    beyond.position.set(0, -1, lastZ - 5.5);
    scene.add(beyond);
    this.endZ = lastZ - 4.5;

    this.resize();
    this.renderer.compile(scene, this.camera);
    this.render();
  }

  setProgress(p: number) {
    this.progress = p;
    if (this.opts.reduced) {
      this.progressSmooth = p;
      this.render();
    }
  }

  /** El Hero informa dónde termina el titular; el centro del túnel se aparta lo necesario. */
  setSafeLeft(fraction: number) {
    this.safeLeft = fraction;
    this.resize();
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth, h = parent.clientHeight;
    this.size = { w, h };
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.frame = frameFor(w / h);
    this.camera.fov = this.frame.fov;
    // Pantallas anchas: si el titular llega más lejos que el encuadre previsto, el eje se
    // aparta hasta liberar el borde izquierdo del círculo (sin pasar del 78 % del ancho)
    const f = this.frame;
    this.axisX = f.axisX;
    if (f.axisX !== 0.5 && this.safeLeft > 0) {
      const tan = Math.tan(THREE.MathUtils.degToRad(f.fov / 2)) * (w / h);
      const ringLeft = (RADIUS * 0.55 + f.camX) / (2 * f.dist * tan);
      this.axisX = Math.min(Math.max(f.axisX, this.safeLeft + ringLeft), 0.78);
    }
    if (!this.running) this.render();
  }

  start() {
    if (this.running || this.opts.reduced) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private render() {
    const { camera, opts, frame } = this;
    const k = opts.reduced ? 1 : 0.075;
    this.progressSmooth += (this.progress - this.progressSmooth) * k;
    this.pointerSmooth.lerp(this.pointer, opts.reduced ? 1 : 0.04);
    const p = this.progressSmooth;
    const travel = easeInOut(p);

    // El cursor sólo inclina apenas el punto de vista; se apaga al avanzar
    const hold = 1 - smooth(0.04, 0.3, p);
    const px = this.pointerSmooth.x * 0.1 * hold, py = this.pointerSmooth.y * 0.06 * hold;

    // La cámara avanza por el túnel; el encuadre descentrado se resuelve hacia el eje
    // cuando el texto ya salió, y al final la "E." queda centrada en la luz blanca
    const center = smooth(0.12, 0.5, p);
    const camX = lerp(frame.camX, 0, center);
    const z = lerp(frame.dist, this.endZ, travel);
    camera.position.set(camX + px, 0.25 + py, z);
    camera.lookAt(camX + px, 0.25 + py, z - 10);
    const ax = lerp(this.axisX, 0.5, center);
    const ay = lerp(frame.axisY, 0.5, center);
    const { w, h } = this.size;
    camera.setViewOffset(w, h, -(ax - 0.5) * w, -(ay - 0.5) * h, w, h);

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
