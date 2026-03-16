import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000005);
  return scene;
}

export function createCamera(W, H) {
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 300);
  camera.position.set(0, 1, 7);
  camera.lookAt(0, 0, 0);
  return camera;
}

export function createRenderer(W, H) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  return renderer;
}

export function createLights(scene) {
  scene.add(new THREE.AmbientLight(0x6633aa, 4));

  const pl = new THREE.PointLight(0x8844ff, 3, 30);
  pl.position.set(0, 4, 4);
  scene.add(pl);

  const pl2 = new THREE.PointLight(0x4400ff, 2, 25);
  pl2.position.set(-4, 0, -3);
  scene.add(pl2);

  return { pl, pl2 };
}

export function createStars(scene) {
  const sv = [];
  for (let i = 0; i < 3000; i++)
    sv.push((Math.random()-0.5)*200, (Math.random()-0.5)*200, (Math.random()-0.5)*200);
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.Float32BufferAttribute(sv, 3));
  const starPts = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }));
  scene.add(starPts);
  return starPts;
}

export function createGalaxy(scene) {
  const galVerts = [];
  for (let i = 0; i < 800; i++) {
    const a = i * 0.22, r = i * 0.022;
    const sp = (Math.random()-0.5)*0.25;
    galVerts.push(Math.cos(a)*r+sp, (Math.random()-0.5)*0.12, Math.sin(a)*r+sp);
    galVerts.push(Math.cos(a+Math.PI)*(r*0.85)+sp, (Math.random()-0.5)*0.1, Math.sin(a+Math.PI)*(r*0.85)+sp);
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute("position", new THREE.Float32BufferAttribute(galVerts, 3));
  const galaxy = new THREE.Points(gg, new THREE.PointsMaterial({
    color: 0xff44cc, size: 0.06, transparent: true, opacity: 0
  }));
  scene.add(galaxy);
  return galaxy;
}

export function createVortex(scene) {
  const vortexRings = [];
  [1.1, 1.6, 2.2, 2.9].forEach((r, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.04, 8, 100),
      new THREE.MeshBasicMaterial({ color: i < 2 ? 0x8844ff : 0xff44cc, transparent: true, opacity: 0 })
    );
    scene.add(ring);
    vortexRings.push(ring);
  });

  const accDisc = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 2.2, 64),
    new THREE.MeshBasicMaterial({ color: 0x6600ff, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  scene.add(accDisc);

  return { vortexRings, accDisc };
}

export function createHint() {
  const hint = document.createElement("div");
  hint.textContent = "✦ CLICK THE CUBE ✦";
  Object.assign(hint.style, {
    position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
    color: "#aa66ff", fontFamily: "Georgia,serif", fontSize: "15px",
    letterSpacing: "4px", zIndex: "10", transition: "opacity 0.8s",
    textShadow: "0 0 12px #8844ff",
  });
  document.body.appendChild(hint);
  return hint;
}