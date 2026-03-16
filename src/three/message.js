import * as THREE from "three";
import { makeMessageTex } from "./textures";

export function createMessageSprite(scene) {
  const msgSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeMessageTex(),
      transparent: true,
      opacity: 0,
      depthTest: false,
    })
  );
  msgSprite.scale.set(10, 5, 1);
  msgSprite.position.set(0, 1.5, 0);
  msgSprite.renderOrder = 999;
  scene.add(msgSprite);
  return msgSprite;
}