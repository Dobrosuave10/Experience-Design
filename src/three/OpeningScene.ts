import * as THREE from "three";
import { gsap } from "gsap";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SEAL, createSealMaterials, plateGeometry, roundedRect, sealShape } from "./seal";
import type { SealTarget } from "../lib/events";

/** Debe coincidir con el fondo de la apertura (Loader.css): los fragmentos salen de esta penumbra. */
const DARK = new THREE.Color("#171513");
/** Cortes de la placa (fracción del lado): piezas de tamaños distintos, como una taracea. */
const CUTS_X = [0, 0.27, 0.58, 0.8, 1];
const CUTS_Y = [0, 0.34, 0.71, 1];
/** Chaflán de cada fragmento: deja una junta fina hasta que la placa se cierra. */
const TILE_BEVEL = 0.007;

type Tile = { mesh: THREE.Mesh; home: THREE.Vector3 };

/**
 * Apertura: la placa del sello se arma con fragmentos que salen de la penumbra,
 * giran, se alinean y se cierran; las juntas desaparecen, una luz rasante recorre
 * el bronce y el sello viaja hasta donde lo espera el Hero.
 * Escena propia, liviana (12 piezas), con su propio bucle que se detiene al terminar.
 */
export class OpeningScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  private seal = new THREE.Group();
  private tiles: Tile[] = [];
  private solid!: THREE.Mesh;
  private solidMats: THREE.MeshStandardMaterial[] = [];
  private sweep!: THREE.PointLight;
  private raf = 0;
  private running = false;
  private disposed = false;
  private size = { w: 1, h: 1 };
  /** Distancia de cámara: la placa terminada mide `platePx` en pantalla. */
  private dist = 8;

  constructor(
    canvas: HTMLCanvasElement,
    private opts: { mobile: boolean },
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.scene.fog = new THREE.Fog(DARK, 7, 15);
  }

  async init() {
    const { scene } = this;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.3;
    pmrem.dispose();

    // Luz de taller: clave cálida arriba a la izquierda, un relleno tenue y la luz rasante
    scene.add(new THREE.HemisphereLight("#f3e3d2", "#1d1814", 0.25));
    const key = new THREE.DirectionalLight("#ffe0c2", 1.9);
    key.position.set(-3, 4, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight("#c98a66", 0.35);
    fill.position.set(4, -2, 3);
    scene.add(fill);
    this.sweep = new THREE.PointLight("#ffe6cf", 0, 4, 2);
    scene.add(this.sweep);

    const { face, edge } = await createSealMaterials(this.renderer, this.opts.mobile ? 512 : 1024);
    if (this.disposed) return;

    // Fragmentos: la placa cortada en una retícula irregular. Las esquinas exteriores
    // conservan el redondeo; los bordes interiores se retraen para dejar la junta.
    const h = SEAL.half - SEAL.bevel;
    const X = CUTS_X.map((t) => -h + t * 2 * h);
    const Y = CUTS_Y.map((t) => -h + t * 2 * h);
    for (let j = 0; j < Y.length - 1; j++) {
      for (let i = 0; i < X.length - 1; i++) {
        const left = i === 0, right = i === X.length - 2, bottom = j === 0, top = j === Y.length - 2;
        const x0 = X[i] + (left ? 0 : TILE_BEVEL), x1 = X[i + 1] - (right ? 0 : TILE_BEVEL);
        const y0 = Y[j] + (bottom ? 0 : TILE_BEVEL), y1 = Y[j + 1] - (top ? 0 : TILE_BEVEL);
        const shape = roundedRect(x0, y0, x1, y1, SEAL.radius, { bl: left && bottom, br: right && bottom, tr: right && top, tl: left && top });
        const geo = plateGeometry(shape, TILE_BEVEL);
        // cada pieza gira sobre su propio centro (las UV quedan en coordenadas de la placa)
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        geo.translate(-cx, -cy, 0);
        const mesh = new THREE.Mesh(geo, [face, edge]);
        mesh.position.set(cx, cy, 0);
        this.seal.add(mesh);
        this.tiles.push({ mesh, home: new THREE.Vector3(cx, cy, 0) });
      }
    }
    // La placa entera: aparece sobre los fragmentos cuando ya encajaron (se cierran las juntas)
    this.solidMats = [face, edge].map((m) => {
      const c = m.clone();
      c.transparent = true;
      c.opacity = 0;
      return c;
    });
    this.solid = new THREE.Mesh(plateGeometry(sealShape()), this.solidMats);
    this.solid.position.z = 0.0008;
    this.solid.visible = false;
    this.seal.add(this.solid);
    scene.add(this.seal);

    this.resize();
    this.renderer.compile(scene, this.camera);
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.size = { w, h };
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // La placa terminada ocupa lo mismo que el sello de la apertura anterior
    const platePx = Math.min(w * (w < 768 ? 0.5 : 0.36), 280);
    const tan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    this.dist = (2 * SEAL.half * h) / (2 * platePx * tan);
    this.camera.position.set(0, 0, this.dist);
    // La penumbra empieza justo detrás de la placa: sólo los fragmentos lejanos salen de ella
    const fog = this.scene.fog as THREE.Fog;
    fog.near = this.dist + 0.6;
    fog.far = this.dist + 8;
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  /** Unidades de escena por px de pantalla en el plano z = 0. */
  private unitsPerPx() {
    return (2 * this.dist * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) / this.size.h;
  }

  private loop = () => {
    if (!this.running) return;
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  };

  /**
   * Arma el sello. `release` se llama cuando el sitio puede empezar a mostrarse
   * (antes del viaje final), `done` cuando la apertura terminó del todo.
   */
  play({ target, release, onHandoff, done }: { target: () => SealTarget | null; release: () => void; onHandoff: (fadeOut: number) => void; done: () => void }) {
    this.running = true;
    this.raf = requestAnimationFrame(this.loop);
    const rand = gsap.utils.random;
    const tl = gsap.timeline({ onComplete: done });

    // 1–3 · Los fragmentos salen de la penumbra (lejos, girados) y se encajan, de afuera hacia adentro
    this.tiles.forEach(({ mesh, home }, i) => {
      const dir = new THREE.Vector2(home.x || rand(-0.5, 0.5), home.y || rand(-0.5, 0.5)).normalize();
      const reach = rand(2.2, 3.6);
      mesh.position.set(home.x + dir.x * reach, home.y + dir.y * reach * 0.8, rand(-7, -3.5));
      mesh.rotation.set(rand(-1.2, 1.2), rand(-1.5, 1.5), rand(-0.6, 0.6));
      const outer = Math.hypot(home.x, home.y);
      const at = 0.15 + (0.9 - outer) * 0.32 + (i % 3) * 0.04;
      tl.to(mesh.position, { x: home.x, y: home.y, z: 0, duration: 1.25, ease: "expo.inOut" }, at);
      tl.to(mesh.rotation, { x: 0, y: 0, z: 0, duration: 1.25, ease: "power3.inOut" }, at);
    });
    // todo el conjunto gira apenas mientras se arma, y se endereza al cerrar
    this.seal.rotation.set(0.22, -0.4, 0);
    tl.to(this.seal.rotation, { x: 0, y: 0, duration: 1.7, ease: "power2.inOut" }, 0.15);

    // 4 · Las juntas se cierran: la placa entera toma el lugar de las piezas
    tl.addLabel("closed", 1.75);
    tl.call(() => {
      this.solid.visible = true;
    }, [], "closed");
    tl.to(this.solidMats, { opacity: 1, duration: 0.3, ease: "power1.out" }, "closed");
    tl.call(() => {
      this.tiles.forEach((t) => (t.mesh.visible = false));
      this.solidMats.forEach((m) => {
        m.transparent = false;
        m.needsUpdate = true;
      });
    }, [], "closed+=0.32");

    // 5 · Una luz rasante recorre la superficie, de izquierda a derecha
    this.sweep.position.set(-1.5, 0.6, 0.75);
    tl.to(this.sweep, { intensity: 1.6, duration: 0.25, ease: "power1.out" }, "closed+=0.05");
    tl.to(this.sweep.position, { x: 1.4, y: -0.3, duration: 0.85, ease: "power1.inOut" }, "closed+=0.05");
    tl.to(this.sweep, { intensity: 0, duration: 0.3, ease: "power1.in" }, "closed+=0.6");

    // 6 · Pausa breve y viaje hasta el sello del Hero (o fundido si no hay destino)
    tl.addLabel("handoff", "closed+=1.05");
    tl.call(() => {
      release();
      const t = target();
      const k = this.unitsPerPx();
      const fade = t ? 0.45 : 0.6;
      if (t) {
        const s = t.size / (2 * SEAL.half) * k;
        gsap
          .timeline()
          .to(this.seal.position, { x: (t.x - this.size.w / 2) * k, y: -(t.y - this.size.h / 2) * k, duration: 1.05, ease: "expo.inOut" }, 0)
          .to(this.seal.scale, { x: s, y: s, z: s, duration: 1.05, ease: "expo.inOut" }, 0)
          .to(this.seal.rotation, { y: t.rotY, duration: 1.05, ease: "expo.inOut" }, 0)
          .call(() => onHandoff(fade), [], 0.8)
          .call(done, [], 0.8 + 0.6 + fade);
        tl.eventCallback("onComplete", null);
      } else {
        onHandoff(fade);
      }
    }, [], "handoff");
    tl.to({}, { duration: 0.6 }, "handoff");
    return tl;
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    gsap.killTweensOf([this.seal.position, this.seal.scale, this.seal.rotation, this.sweep, this.sweep?.position]);
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
