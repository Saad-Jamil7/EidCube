import * as THREE from "three";

export function explode({ cube, shards, novaParticles, materials, scene, pl }) {
  cube.visible = false;

  shards.forEach((s, i) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({
        map: materials[i].map,
        side: THREE.DoubleSide,
        metalness: 0.5,
        roughness: 0.3,
      })
    );
    const lp = new THREE.Vector3(...s.fc.pos).applyEuler(cube.rotation);
    mesh.position.copy(lp);
    mesh.rotation.copy(cube.rotation);
    mesh.rotateX(s.fc.rx);
    mesh.rotateY(s.fc.ry);
    s.vel.applyEuler(cube.rotation);
    scene.add(mesh);
    s.mesh = mesh;
  });

  novaParticles.forEach(s => {
    s.mesh.visible = true;
    s.mesh.position.set(0, 0, 0);
    const a  = Math.random()*Math.PI*2;
    const p  = Math.random()*Math.PI - Math.PI/2;
    const sp = 0.18 + Math.random()*0.28;
    s.vel.set(Math.cos(p)*Math.cos(a)*sp, Math.sin(p)*sp, Math.cos(p)*Math.sin(a)*sp);
    s.life = 1;
  });

  pl.color.set(0xffffff);
  pl.intensity = 25;
}
