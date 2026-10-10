import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { materialCanvas } from "../lib/materials";
import { makeSealMaps } from "./logoTexture";

type Options = { mobile: boolean; reduced: boolean };

const INK = new THREE.Color("#171513");
const FLOOR_Y = -2.2;
const OPENING_HALF = 1.3;
const SPRING_Y = 1.4;
/** Grosor de cada muro con arco: el intradós profundo es lo que da escala a la galería. */
const WALL_DEPTH = 1.1;
/** Separación entre arcos y medidas de cada tramo (más ancho y alto que la abertura). */
const BAY = 4.6;
const BAY_HALF = 2.9;
const BAY_TOP = 4.4;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
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
  // la abertura baja por debajo del suelo: sin umbral que asome como un escalón
  hole.moveTo(-OPENING_HALF, FLOOR_Y - 0.6);
  hole.lineTo(-OPENING_HALF, SPRING_Y);
  hole.absarc(0, SPRING_Y, OPENING_HALF, Math.PI, 0, true);
  hole.lineTo(OPENING_HALF, FLOOR_Y - 0.6);
  hole.closePath();
  shape.holes.push(hole);

  return new THREE.ExtrudeGeometry(shape, {
    depth: WALL_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 64,
  });
}

function roundedSquare(half: number, radius: number) {
  const s = new THREE.Shape();
  s.moveTo(-half + radius, -half);
  s.lineTo(half - radius, -half);
  s.quadraticCurveTo(half, -half, half, -half + radius);
  s.lineTo(half, half - radius);
  s.quadraticCurveTo(half, half, half - radius, half);
  s.lineTo(-half + radius, half);
  s.quadraticCurveTo(-half, half, -half, half - radius);
  s.lineTo(-half, -half + radius);
  s.quadraticCurveTo(-half, -half, -half + radius, -half);
  return s;
}

/**
 * Sello cuadrado: una placa fina de esquinas suavemente redondeadas, con un chaflán
 * preciso. La cara es una pieza aparte (con la "E." grabada) apoyada sobre el cuerpo.
 */
function sealGeometry(half: number) {
  const depth = 0.05, bevel = 0.022;
  const body = new THREE.ExtrudeGeometry(roundedSquare(half - bevel, 0.16), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 16,
  });
  body.translate(0, 0, -depth / 2);
  const face = new THREE.ShapeGeometry(roundedSquare(half - bevel, 0.16), 16);
  // UV 0..1 sobre la cara
  const pos = face.attributes.position, uv = face.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + half) / (2 * half), (pos.getY(i) + half) / (2 * half));
  face.translate(0, 0, depth / 2 + bevel + 0.001);
  return { body, face };
}

function backdropTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(256, 300, 10, 256, 280, 360);
  g.addColorStop(0, "#F7EBDD");
  g.addColorStop(0.28, "#EBC9A8");
  g.addColorStop(0.62, "#B86A48");
  g.addColorStop(1, "#3a221a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Encuadre por proporción de pantalla. La cámara mira la galería apenas en oblicuo
 * (desde la izquierda del eje) y el punto de fuga se coloca en el cuadro con un
 * encuadre descentrado: el túnel ocupa el campo central-derecho sin moverse sobre
 * el titular, y el sello queda delante del arco, a su derecha.
 */
type Frame = {
  fov: number;
  dist: number;
  /** Posición del eje de la cámara en el cuadro (0..1). */
  axisX: number;
  axisY: number;
  /** Desplazamiento lateral de la cámara respecto del eje del túnel (vista oblicua). */
  camX: number;
  seal: { x: number; y: number; z: number; scale: number; ry: number };
};

function frameFor(aspect: number): Frame {
  if (aspect < 0.85) {
    // Retrato: galería arriba y centrada, sello pequeño a su derecha; el texto vive abajo
    return { fov: 44, dist: 15, axisX: 0.5, axisY: 0.3, camX: -0.2, seal: { x: 1.75, y: 1.55, z: 0.9, scale: 0.55, ry: -0.3 } };
  }
  if (aspect < 1.3) {
    return { fov: 34, dist: 12, axisX: 0.6, axisY: 0.45, camX: -0.4, seal: { x: 1.0, y: 0.6, z: 1.0, scale: 0.85, ry: -0.36 } };
  }
  return { fov: 30, dist: 10.6, axisX: aspect > 1.7 ? 0.6 : 0.62, axisY: 0.52, camX: -0.45, seal: { x: 1.0, y: 0.35, z: 1.0, scale: 1, ry: -0.58 } };
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private seal = new THREE.Group();
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
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 90);
    this.scene.background = INK;
    this.scene.fog = new THREE.Fog(INK, 12, 40);
  }

  async init() {
    const { scene, opts } = this;

    // Reflejos de estudio tenues: le dan lectura al bronce sin volverlo brillante
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.3;
    pmrem.dispose();

    // ---- Luz: clave cálida y suave desde arriba a la izquierda ----
    scene.add(new THREE.HemisphereLight("#f3e3d2", "#2a2521", 0.2));
    const key = new THREE.DirectionalLight("#ffe2c6", 1.5);
    key.position.set(-5, 6, 9);
    key.target.position.set(0.5, 0, 0);
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
      key.shadow.radius = 9;
    }

    // Un foco amplio y muy difuso baña el muro alrededor del arco: el resto cae en penumbra
    const wash = new THREE.SpotLight("#ffcfa8", 60, 26, 0.5, 1, 1.6);
    wash.position.set(-2.5, 5.5, 9);
    wash.target.position.set(0.8, 0.2, 0);
    scene.add(wash, wash.target);

    // ---- La galería: arcos de intradós profundo, con tramos cerrados entre ellos ----
    const plaster = new THREE.CanvasTexture(materialCanvas("plaster"));
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(0.22, 0.22);
    // Revoque marrón oscuro con un fondo terracota; relieve contenido, acabado mate
    const wallMat = new THREE.MeshStandardMaterial({ color: "#4a362c", roughness: 0.93, bumpMap: plaster, bumpScale: 0.8 });
    const bayMat = new THREE.MeshStandardMaterial({ color: "#523b2f", roughness: 0.95, bumpMap: plaster, bumpScale: 0.6, side: THREE.DoubleSide });
    const archGeo = archGeometry();
    const count = opts.mobile ? 4 : 5;
    const depths = Array.from({ length: count }, (_, i) => -i * BAY);
    const sideGeo = new THREE.PlaneGeometry(BAY - WALL_DEPTH, BAY_TOP - FLOOR_Y);
    const ceilGeo = new THREE.PlaneGeometry(BAY_HALF * 2, BAY - WALL_DEPTH);
    depths.forEach((z, i) => {
      const wall = new THREE.Mesh(archGeo, wallMat);
      wall.position.z = z - WALL_DEPTH;
      wall.receiveShadow = i === 0;
      scene.add(wall);
      if (i === depths.length - 1) return;
      // Tramo entre este arco y el siguiente: muros laterales y bóveda plana
      const mid = z - WALL_DEPTH - (BAY - WALL_DEPTH) / 2;
      for (const sx of [-1, 1]) {
        const side = new THREE.Mesh(sideGeo, bayMat);
        side.rotation.y = (sx * -Math.PI) / 2;
        side.position.set(sx * BAY_HALF, (BAY_TOP + FLOOR_Y) / 2, mid);
        scene.add(side);
      }
      const ceil = new THREE.Mesh(ceilGeo, bayMat);
      ceil.rotation.x = Math.PI / 2;
      ceil.position.set(0, BAY_TOP, mid);
      scene.add(ceil);
      // Luz cálida en cada tramo, cada vez más intensa hacia el fondo
      const p = new THREE.PointLight("#ffb48c", 7 + i * 3, 9, 2);
      p.position.set(0.4, 2.4, mid);
      scene.add(p);
    });

    // Suelo satinado: recoge charcos de luz bajo cada arco
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 70),
      new THREE.MeshStandardMaterial({ color: "#3a2a21", roughness: 0.55, metalness: 0.05 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, FLOOR_Y, -20);
    floor.receiveShadow = !opts.mobile;
    scene.add(floor);

    // Al fondo, la luz del último arco
    const lastZ = depths[depths.length - 1] - WALL_DEPTH;
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 30),
      new THREE.MeshBasicMaterial({ map: backdropTexture(), fog: false, toneMapped: false }),
    );
    backdrop.position.set(0, 2, lastZ - 9);
    scene.add(backdrop);
    const glow = new THREE.PointLight("#ffd2ae", 22, 14, 2);
    glow.position.set(0, 0.8, lastZ - 1.5);
    scene.add(glow);
    this.endZ = lastZ - 3;

    // ---- El sello: placa cuadrada de bronce, fina, con la "E." grabada ----
    const maps = await makeSealMaps(opts.mobile ? 512 : 1024);
    if (this.disposed) return;
    const map = new THREE.CanvasTexture(maps.color);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const normalMap = new THREE.CanvasTexture(maps.normal);
    const roughnessMap = new THREE.CanvasTexture(maps.rough);

    const { body, face } = sealGeometry(0.78);
    // Bronce satinado: algo de metal y rugosidad media; nada de laca ni brillo de plástico
    const bodyMat = new THREE.MeshStandardMaterial({ color: "#7a3f25", metalness: 0.6, roughness: 0.46, envMapIntensity: 0.9 });
    const faceMat = new THREE.MeshStandardMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(1, 1),
      roughnessMap,
      roughness: 1,
      metalness: 0.55,
      envMapIntensity: 0.8,
    });
    const bodyMesh = new THREE.Mesh(body, bodyMat);
    const faceMesh = new THREE.Mesh(face, faceMat);
    for (const m of [bodyMesh, faceMesh]) {
      m.castShadow = !opts.mobile;
      this.seal.add(m);
    }
    scene.add(this.seal);

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
    const s = this.frame.seal;
    this.seal.position.set(s.x, s.y, s.z);
    this.seal.scale.setScalar(s.scale);
    // Pantallas muy anchas (contenedor centrado): si el titular llega más lejos que el
    // encuadre previsto, el eje se aparta hasta liberar el arco, sin sacar el sello del cuadro
    const f = this.frame;
    this.axisX = f.axisX;
    if (f.axisX !== 0.5 && this.safeLeft > 0) {
      const tan = Math.tan(THREE.MathUtils.degToRad(f.fov / 2)) * (w / h);
      const archLeft = (OPENING_HALF + 0.1 + f.camX) / (2 * f.dist * tan);
      const sealRight = (s.x - f.camX + 0.86 * s.scale) / (2 * (f.dist - s.z) * tan);
      this.axisX = Math.min(Math.max(f.axisX, this.safeLeft + archLeft), 0.98 - sealRight);
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
    const { camera, seal, opts, frame } = this;
    const k = opts.reduced ? 1 : 0.075;
    this.progressSmooth += (this.progress - this.progressSmooth) * k;
    this.pointerSmooth.lerp(this.pointer, opts.reduced ? 1 : 0.04);
    const p = this.progressSmooth;
    const travel = easeInOut(p);

    // El cursor sólo inclina apenas el punto de vista (paralaje entre arcos); se apaga al avanzar
    const hold = 1 - smooth(0.04, 0.3, p);
    const px = this.pointerSmooth.x * 0.1 * hold, py = this.pointerSmooth.y * 0.06 * hold;

    // La cámara avanza por la galería. La vista oblicua y el encuadre descentrado se resuelven
    // hacia el eje cuando el texto ya salió: no hay barrido sobre el titular.
    const center = smooth(0.12, 0.5, p);
    const camX = lerp(frame.camX, 0, center);
    const z = lerp(frame.dist, this.endZ, travel);
    camera.position.set(camX + px, 0.25 + py, z);
    camera.lookAt(camX + px, 0.25 + py, z - 10);
    const ax = lerp(this.axisX, 0.5, center);
    const ay = lerp(frame.axisY, 0.5, center);
    const { w, h } = this.size;
    camera.setViewOffset(w, h, -(ax - 0.5) * w, -(ay - 0.5) * h, w, h);

    // El sello está quieto, como una pieza instalada; sólo acusa el cursor con un matiz
    seal.rotation.set(-py * 0.4 + 0.02, frame.seal.ry + px * 0.35, 0);

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
