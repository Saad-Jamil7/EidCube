import * as THREE from "three";

export function makeFaceTex(bg, sym) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const ctx = c.getContext("2d");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);

  // Spiral pattern
  ctx.strokeStyle = "rgba(255,68,204,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 180; i++) {
    const a = i * 0.22, r = i * 0.55;
    ctx.lineTo(128 + Math.cos(a)*r, 128 + Math.sin(a)*r);
  }
  ctx.stroke();

  // Grid pattern
  ctx.strokeStyle = "rgba(136,68,255,0.4)";
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 28)
    for (let x = 0; x < 256; x += 28) {
      ctx.beginPath(); ctx.rect(x+6, y+6, 16, 16); ctx.stroke();
    }

  // Border
  ctx.strokeStyle = "#aa66ff";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 240);

  // Symbol
  ctx.font = "bold 110px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#8844ff";
  ctx.shadowBlur = 25;
  ctx.fillText(sym, 128, 128);

  return new THREE.CanvasTexture(c);
}

export function makeMessageTex() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 1024, 512);

  // Top decorative line
  ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
  ctx.beginPath(); ctx.moveTo(80, 80); ctx.lineTo(944, 80); ctx.stroke();
  ctx.globalAlpha = 1;
  [80, 944].forEach(x => {
    ctx.beginPath(); ctx.arc(x, 80, 8, 0, Math.PI*2);
    ctx.fillStyle = "#ffd700"; ctx.fill();
  });

  // Main text
  ctx.font = "bold 115px Georgia, serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.strokeStyle = "#ff8800"; ctx.lineWidth = 8;
  ctx.strokeText("Eid Mubarak!", 512, 200);
  ctx.fillStyle = "#ffd700"; ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 50;
  ctx.fillText("Eid Mubarak!", 512, 200);

  // Subtitle
  ctx.font = "italic 42px Georgia, serif";
  ctx.fillStyle = "#cc88ff"; ctx.shadowColor = "#8844ff"; ctx.shadowBlur = 20;
  ctx.fillText("May peace & blessings be upon you ✦", 512, 360);

  // Bottom decorative line
  ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
  ctx.beginPath(); ctx.moveTo(80, 450); ctx.lineTo(944, 450); ctx.stroke();
  ctx.globalAlpha = 1;
  [80, 944].forEach(x => {
    ctx.beginPath(); ctx.arc(x, 450, 8, 0, Math.PI*2);
    ctx.fillStyle = "#ffd700"; ctx.fill();
  });

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}