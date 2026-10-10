import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { materialCanvas } from "../lib/materials";
import { makeMedalMaps } from "./logoTexture";

type Options = { mobile: boolean; reduced: boolean };

const INK = new THREE.Color("#171513");
/** El blanco cálido de Programas: al otro lado del último arco empieza la sección siguiente. */
const IVORY = new THREE.Color("#fffdf8");
/** La misma salida vista desde lejos: luz cálida, todavía no papel. */
const EXIT_FAR = new THREE.Color("#d9b294");
const WALL = new THREE.Color("#4a3d35");
const FLOOR_Y = -2.2;
const OPENING_HALF = 1.3;
const SPRING_Y = 1.4;
/** Cara frontal del muro del primer arco (extrusión de 0.8 terminada en z = 0, más el bisel). */
const WALL_FACE_Z = 0.03;

const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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
 * Tondo: una pieza de terracota casi plana, empotrada en el muro. Sólo asoma un canto
 * mínimo con un chaflán suave: lo justo para que la luz de la escena lo dibuje.
 */
function tondoGeometry(R: number) {
  const depth = 0.022, chamfer = 0.012;
  const pts = [new THREE.Vector2(R, 0), new THREE.Vector2(R, depth - chamfer), new THREE.Vector2(R - chamfer, depth)];
  const rim = new THREE.LatheGeometry(pts, 128);
  rim.rotateX(Math.PI / 2);
  rim.rotateX(Math.PI); // el canto crece hacia +z (hacia la cámara)
  const face = new THREE.CircleGeometry(R - chamfer, 128);
  face.translate(0, 0, depth);
  return { rim, face };
}

/**
 * Encuadre por proporción de pantalla. La cámara siempre está sobre el eje del túnel;
 * lo que cambia es dónde cae el punto de fuga en el cuadro (encuadre descentrado,
 * sin girar ni desplazar la cámara), así la galería nunca barre sobre el titular.
 */
type Frame = {
  fov: number;
  /** Distancia inicial de la cámara al muro del primer arco. */
  dist: number;
  /** Posición horizontal del eje en el cuadro (0 = borde izquierdo, 1 = derecho). */
  axisX: number;
  /** Posición vertical de la altura de la cámara en el cuadro (0 = arriba). */
  axisY: number;
  tondo: { x: number; y: number; r: number };
};

function frameFor(aspect: number): Frame {
  if (aspect < 0.85) {
    // Retrato: el túnel arriba y centrado, el tondo a su derecha; el texto vive abajo
    return { fov: 44, dist: 18, axisX: 0.5, axisY: 0.3, tondo: { x: 2.05, y: SPRING_Y, r: 0.42 } };
  }
  if (aspect < 1.3) {
    // Tablet / ventanas casi cuadradas
    return { fov: 34, dist: 14, axisX: 0.66, axisY: 0.46, tondo: { x: 2.35, y: SPRING_Y, r: 0.56 } };
  }
  if (aspect < 1.5) {
    // Portátiles chicos y tablets apaisadas: el mismo encuadre, la galería un poco más lejos
    return { fov: 30, dist: 14.5, axisX: 0.66, axisY: 0.5, tondo: { x: 2.3, y: SPRING_Y, r: 0.52 } };
  }
  // Escritorio: titular a la izquierda, galería en el campo central-derecho, tondo a su derecha
  return { fov: 30, dist: 12.5, axisX: aspect > 1.7 ? 0.62 : 0.64, axisY: 0.5, tondo: { x: 2.4, y: SPRING_Y, r: 0.58 } };
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private tondo = new THREE.Group();
  private wallMat!: THREE.MeshStandardMaterial;
  private exitMat!: THREE.MeshBasicMaterial;
  private exitLight!: THREE.PointLight;
  /** Profundidad del último arco (el umbral). */
  private lastArchZ = -21;
  private raf = 0;
  private running = false;
  private disposed = false;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private progress = 0;
  private progressSmooth = 0;
  private frame: Frame = frameFor(1.6);
  private size = { w: 1, h: 1 };
  /** Borde derecho del titular (fracción del ancho): la galería nunca se dibuja a su izquierda. */
  private safeLeft = 0;
  private axisX = 0.62;

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

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 90);
    this.scene.background = INK.clone();
    this.scene.fog = new THREE.Fog(INK.clone(), 12, 40);
  }

  async init() {
    const { scene, opts } = this;

    // Reflejos de estudio muy tenues: sólo para que la materia no se vea plana
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.18;
    pmrem.dispose();

    // ---- Luz: una clave cálida y suave desde arriba a la izquierda, la misma para muro y tondo ----
    scene.add(new THREE.HemisphereLight("#f3e3d2", "#2a2521", 0.22));
    const key = new THREE.DirectionalLight("#ffe6cf", 2.5);
    key.position.set(-5.5, 6, 9);
    key.target.position.set(1, 0, 0);
    scene.add(key, key.target);
    if (!opts.mobile) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      const sc = key.shadow.camera;
      sc.left = -6;
      sc.right = 6;
      sc.top = 6;
      sc.bottom = -6;
      sc.near = 1;
      sc.far = 30;
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
      key.shadow.radius = 6;
    }

    // ---- Arcos en profundidad: una galería por la que se entra ----
    const plaster = new THREE.CanvasTexture(materialCanvas("plaster"));
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(0.22, 0.22);
    // Revoque con relieve muy contenido: se lee la materia, no el ruido
    this.wallMat = new THREE.MeshStandardMaterial({ color: WALL.clone(), roughness: 0.95, bumpMap: plaster, bumpScale: 0.7 });
    const archGeo = archGeometry();
    const depths = opts.mobile ? [0, -7, -14] : [0, -7, -14, -21];
    this.lastArchZ = depths[depths.length - 1];
    depths.forEach((z, i) => {
      const wall = new THREE.Mesh(archGeo, this.wallMat);
      wall.position.z = z - 0.8;
      wall.receiveShadow = i === 0;
      scene.add(wall);
      // Luz cálida dentro de cada tramo: la luz llama hacia adentro
      if (i < depths.length - 1) {
        const p = new THREE.PointLight("#ffb48c", 10 + i * 4, 0, 2);
        p.position.set(0, 1.2, z - 3.5);
        scene.add(p);
      }
    });

    // El suelo termina en el último umbral: más allá sólo existe la luz de la salida
    const floorLen = 16 - (this.lastArchZ - 0.8);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, floorLen),
      new THREE.MeshStandardMaterial({ color: "#2e2621", roughness: 0.88 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, FLOOR_Y, 16 - floorLen / 2);
    floor.receiveShadow = !opts.mobile;
    scene.add(floor);

    // Al otro lado del último arco: un plano de luz que termina siendo el blanco de Programas.
    // Sin niebla ni tone mapping, para que su color final sea exactamente el de la sección.
    this.exitMat = new THREE.MeshBasicMaterial({ color: EXIT_FAR.clone(), fog: false, toneMapped: false });
    const exit = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), this.exitMat);
    exit.position.set(0, 2, this.lastArchZ - 4);
    scene.add(exit);
    // La luz de la salida entra al túnel y baña el último tramo
    this.exitLight = new THREE.PointLight("#ffd9bd", 0, 0, 2);
    this.exitLight.position.set(0, 0.8, this.lastArchZ - 1.2);
    scene.add(this.exitLight);

    // ---- El tondo: terracota mate empotrada en el muro del primer arco ----
    const maps = await makeMedalMaps(opts.mobile ? 512 : 1024);
    if (this.disposed) return;
    const map = new THREE.CanvasTexture(maps.color);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const normalMap = new THREE.CanvasTexture(maps.normal);

    const { rim, face } = tondoGeometry(1);
    const rimMat = new THREE.MeshStandardMaterial({ color: "#8f4535", roughness: 0.92 });
    const faceMat = new THREE.MeshStandardMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.9,
      envMapIntensity: 0.25,
    });
    for (const m of [new THREE.Mesh(rim, rimMat), new THREE.Mesh(face, faceMat)]) {
      m.receiveShadow = !opts.mobile;
      this.tondo.add(m);
    }
    // Junta de sombra: el muro está rebajado alrededor de la pieza, como una incrustación
    const reveal = new THREE.Mesh(new THREE.CircleGeometry(1.02, 128), new THREE.MeshBasicMaterial({ color: "#1c1714", transparent: true, opacity: 0.3 }));
    reveal.position.z = -0.001;
    this.tondo.add(reveal);
    scene.add(this.tondo);

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

  /** El Hero informa dónde termina el titular; el punto de fuga se aparta lo necesario. */
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
    // El tondo vive en el muro del primer arco, a ras de su cara
    const { x, y, r } = this.frame.tondo;
    this.tondo.position.set(x, y, WALL_FACE_Z + 0.002);
    this.tondo.scale.setScalar(r);
    // Si el titular es más ancho que el encuadre previsto (pantallas muy anchas, contenedor
    // centrado), el eje se desplaza hasta que el muro del arco quede libre, sin salir el tondo
    this.axisX = this.frame.axisX;
    if (this.frame.axisX !== 0.5 && this.safeLeft > 0) {
      const visibleW = 2 * this.frame.dist * Math.tan(THREE.MathUtils.degToRad(this.frame.fov / 2)) * (w / h);
      const archHalf = (OPENING_HALF + 0.2) / visibleW;
      const tondoEdge = (x + r * 1.1) / visibleW;
      this.axisX = Math.min(Math.max(this.frame.axisX, this.safeLeft + archHalf), 0.97 - tondoEdge);
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
    const k = opts.reduced ? 1 : 0.07;
    this.progressSmooth += (this.progress - this.progressSmooth) * k;
    this.pointerSmooth.lerp(this.pointer, opts.reduced ? 1 : 0.035);
    const p = this.progressSmooth;

    // A · La cámara avanza por el eje de la galería a paso constante y cruza el último umbral
    const camY = 0.25;
    const startZ = frame.dist;
    const endZ = this.lastArchZ - 1.6;
    const z = lerp(startZ, endZ, p);
    // El cursor sólo inclina apenas el punto de vista (paralaje entre arcos), y se apaga al avanzar
    const hold = 1 - smooth(0.05, 0.3, p);
    const px = this.pointerSmooth.x * 0.09 * hold, py = this.pointerSmooth.y * 0.05 * hold;
    camera.position.set(px, camY + py, z);
    camera.lookAt(px, camY + py, z - 10);

    // El punto de fuga empieza a la derecha del titular y vuelve al centro cuando el texto ya salió:
    // al cruzar, el eje de la galería es el eje central de Programas.
    const center = smooth(0.12, 0.55, p);
    const ax = lerp(this.axisX, 0.5, center);
    const ay = lerp(frame.axisY, 0.5, center);
    const { w, h } = this.size;
    camera.setViewOffset(w, h, -(ax - 0.5) * w, -(ay - 0.5) * h, w, h);

    // B · La salida se revela: la luz del otro lado pasa de cálida a marfil
    this.exitMat.color.copy(EXIT_FAR).lerp(IVORY, smooth(0.4, 0.88, p));
    this.exitLight.intensity = 30 * smooth(0.35, 0.85, p);
    // C · La galería se disuelve en la luz: la niebla toma el color de la salida y se acerca,
    // los muros aclaran; al cruzar el umbral todo el cuadro es el blanco de la sección
    const open = smooth(0.72, 0.98, p);
    const bg = this.scene.background as THREE.Color;
    bg.copy(INK).lerp(IVORY, open);
    const fog = this.scene.fog as THREE.Fog;
    fog.color.copy(bg);
    fog.near = lerp(12, 0.5, open);
    fog.far = lerp(40, 9, open);
    this.wallMat.color.copy(WALL).lerp(IVORY, open * 0.6);

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
