import * as THREE from "three";
import { makeFaceTex } from "./textures";

export const SYMS = ["☪","★","❀","✦","✿","◈"];
export const BGS  = ["#6a1aff","#aa2288","#1a44ff","#ff6600","#00aa44","#ff2255"];

export const FACE_CONFIGS = [
  { pos:[1,0,0],  rx:0,          ry:Math.PI/2  },
  { pos:[-1,0,0], rx:0,          ry:-Math.PI/2 },
  { pos:[0,1,0],  rx:-Math.PI/2, ry:0          },
  { pos:[0,-1,0], rx:Math.PI/2,  ry:0          },
  { pos:[0,0,1],  rx:0,          ry:0          },
  { pos:[0,0,-1], rx:0,          ry:Math.PI    },
];

export function createMaterials() {
  return BGS.map((b, i) =>
    new THREE.MeshStandardMaterial({
      map: makeFaceTex(b, SYMS[i]),
      metalness: 0.5,
      roughness: 0.3,
    })
  );
}

export function createCube(scene, materials) {
  const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials);
  scene.add(cube);
  return cube;
}

export function createShards(materials) {
  return FACE_CONFIGS.map((fc, i) => {
    const vel = new THREE.Vector3(...fc.pos).normalize().multiplyScalar(0.15);
    vel.x += (Math.random()-0.5)*0.08;
    vel.y += (Math.random()-0.5)*0.08 + 0.05;
    vel.z += (Math.random()-0.5)*0.08;
    return {
      fc,
      matIndex: i,
      mesh: null,
      vel,
      rotVel: new THREE.Vector3(
        (Math.random()-0.5)*0.08,
        (Math.random()-0.5)*0.08,
        (Math.random()-0.5)*0.08
      ),
    };
  });
}

export function createNovaParticles(scene) {
  return Array.from({ length: 200 }, (_, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 4, 4),
      new THREE.MeshBasicMaterial({
        color: [0xffd700,0xff8800,0xff44cc,0xffffff,0xaa66ff][i%5],
        transparent: true,
      })
    );
    m.visible = false;
    scene.add(m);
    return { mesh: m, vel: new THREE.Vector3(), life: 0 };
  });
}