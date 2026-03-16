import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createScene, createCamera, createRenderer, createLights, createStars, createGalaxy, createVortex, createHint } from "./three/sceneSetup";
import { createMaterials, createCube, createShards, createNovaParticles } from "./three/objects";
import { explode } from "./three/explode";
import { createMessageSprite } from "./three/message";

function Cube() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (mountRef.current) mountRef.current.innerHTML = "";

    const W = window.innerWidth, H = window.innerHeight;

    // Setup
    const renderer  = createRenderer(W, H);
    const scene     = createScene();
    const camera    = createCamera(W, H);
    const { pl, pl2 } = createLights(scene);
    const starPts   = createStars(scene);
    const galaxy    = createGalaxy(scene);
    const { vortexRings, accDisc } = createVortex(scene);
    const hint      = createHint();

    mountRef.current.appendChild(renderer.domElement);

    // Objects
    const materials     = createMaterials();
    const cube          = createCube(scene, materials);
    const shards        = createShards(materials);
    const novaParticles = createNovaParticles(scene);
    const msgSprite     = createMessageSprite(scene);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    let state = "idle", t = 0, launched = false;

    const onClick = (e) => {
      if (launched) return;
      mouse.x = (e.clientX / W) * 2 - 1;
      mouse.y = -(e.clientY / H) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      if (raycaster.intersectObject(cube).length > 0) {
        launched = true; state = "warp"; t = 0;
        hint.style.opacity = "0";
      }
    };
    window.addEventListener("click", onClick);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      t += dt;

      // ── IDLE ──────────────────────────────────────────────
      if (state === "idle") {
        cube.rotation.y += 0.007;
        cube.rotation.x += 0.003;
        pl.intensity = 3 + Math.sin(t*1.5)*0.4;
      }

      // ── WARP ──────────────────────────────────────────────
      if (state === "warp") {
        const warpX = 1 + Math.sin(t*14)*0.18*Math.min(1, t*0.8);
        const warpY = 1 + Math.cos(t*11)*0.18*Math.min(1, t*0.8);
        cube.scale.set(warpX, warpY, 1 + Math.sin(t*9)*0.1*Math.min(1, t));
        cube.rotation.y += 0.012 + t*0.05;
        cube.rotation.z += t*0.02;
        galaxy.material.opacity = Math.min(0.9, t*0.55);
        galaxy.rotation.y += 0.025 + t*0.01;
        galaxy.scale.setScalar(1 + t*0.2);
        starPts.rotation.y += 0.004 + t*0.002;
        pl.color.set(0xff44cc); pl.intensity = 3 + t*3; pl2.intensity = 2 + t*2;
        vortexRings.forEach((r, i) => {
          r.material.opacity = Math.min(0.7, t*0.4);
          r.rotation.z += 0.03 + i*0.02;
          r.rotation.x = Math.PI/2 + t*0.05;
        });
        accDisc.rotation.z += 0.05;
        accDisc.material.opacity = Math.min(0.4, t*0.25);
        if (t > 2.5) { state = "suck"; t = 0; }
      }

      // ── SUCK ──────────────────────────────────────────────
      if (state === "suck") {
        cube.rotation.y += 0.02 + t*0.2;
        cube.rotation.z += t*0.08;
        const sc = Math.max(0, 1 - t*0.45);
        cube.scale.setScalar(sc);
        cube.position.z = -t*0.4;
        vortexRings.forEach((r, i) => {
          r.rotation.z += 0.08 + i*0.04;
          r.material.opacity = Math.min(0.9, 0.7 + t*0.1);
        });
        accDisc.rotation.z += 0.1;
        accDisc.material.opacity = Math.min(0.6, 0.4 + t*0.2);
        galaxy.rotation.y += 0.04;
        pl.intensity = 5 + t*8;
        if (sc <= 0.01) {
          state = "nova"; t = 0;
          explode({ cube, shards, novaParticles, materials, scene, pl });
        }
      }

      // ── NOVA ──────────────────────────────────────────────
      if (state === "nova") {
        pl.intensity = Math.max(2, 25 - t*22);
        vortexRings.forEach((r, i) => {
          r.scale.setScalar(1 + t*(3+i));
          r.material.opacity = Math.max(0, 0.9 - t*1.8);
        });
        accDisc.scale.setScalar(1 + t*5);
        accDisc.material.opacity = Math.max(0, 0.6 - t*1.5);
        galaxy.rotation.y += 0.05;
        galaxy.scale.setScalar(2.5 + t*0.5);
        galaxy.material.opacity = Math.max(0, 0.9 - t*0.15);
        shards.forEach(s => {
          if (!s.mesh) return;
          s.mesh.position.add(s.vel); s.vel.y -= 0.003;
          s.mesh.rotation.x += s.rotVel.x;
          s.mesh.rotation.y += s.rotVel.y;
          s.mesh.rotation.z += s.rotVel.z;
          s.mesh.material.opacity = Math.max(0, 1 - t*0.4);
          s.mesh.material.transparent = true;
        });
        novaParticles.forEach(s => {
          if (s.mesh.visible) {
            s.mesh.position.add(s.vel);
            s.vel.multiplyScalar(0.96); s.vel.y -= 0.003;
            s.life -= dt*0.45;
            s.mesh.material.opacity = Math.max(0, s.life);
            if (s.life <= 0) s.mesh.visible = false;
          }
        });
        if (t > 0.6) msgSprite.material.opacity = Math.min(1, (t-0.6)*1.4);
        if (t > 6) state = "done";
      }

      // ── DONE ──────────────────────────────────────────────
      if (state === "done") {
        galaxy.rotation.y += 0.005;
        pl.intensity = 3 + Math.sin(t)*0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current) mountRef.current.innerHTML = "";
      renderer.dispose();
      hint.remove();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}

export default Cube;