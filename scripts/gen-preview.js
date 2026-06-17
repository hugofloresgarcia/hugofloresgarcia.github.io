// regenerate assets/img/preview.png (the link-preview flower):
//   node scripts/gen-preview.js && magick /tmp/preview.svg assets/img/preview.png
const fs = require('fs');
const W = 1200, H = 630;

let s = 7 >>> 0;
function rnd() {
  s = (s + 0x6D2B79F5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function rand(a, b) { return a + rnd() * (b - a); }
const d2r = d => d * Math.PI / 180;

// vivid colors that pop on the cream background
function hsl(h, sat, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * sat, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
const baseHue = rand(0, 360);
function petalColor() {
  return hsl(baseHue + rand(-55, 85), rand(0.72, 0.95), rand(0.4, 0.56));
}

function makeSpiral(niter0, step0) {
  let angle = rand(100, 300), n = niter0, step = step0;
  const ex = Math.abs(angle - 180);
  if (ex > 30) { const sa = 1 - ex / 180, adj = 0.3 + sa; step *= adj; n = Math.floor(n * 3 / adj); }
  n = Math.max(5, n);
  const pts = []; let x = 0, y = 0, maxd = 0;
  for (let i = 0; i < n; i++) {
    const rad = d2r(i * (360 / n + angle)), st = (i / n) * step;
    x += Math.cos(rad) * 0.5 * st; y += Math.sin(rad) * 0.5 * st;
    pts.push([x, y]); const dd = Math.hypot(x, y); if (dd > maxd) maxd = dd;
  }
  return { pts, maxd };
}

const RING = 100, STEP = 120, nRings = 6;
const rings = []; let maxDist = 0;
for (let r = 0; r < nRings; r++) {
  const ringRadius = RING * (r + 1), numPetals = 7 + r * 2, spirals = []; let maxOff = 0;
  for (let i = 0; i < numPetals; i++) {
    const sp = makeSpiral(5 + (rand(0, 5) | 0), STEP * rand(0.8, 1.9));
    sp.color = petalColor(); if (sp.maxd > maxOff) maxOff = sp.maxd; spirals.push(sp);
  }
  rings.push({ radius: ringRadius, numPetals, spirals, rotOff: rand(0, Math.PI * 2) });
  maxDist = Math.max(maxDist, ringRadius + maxOff);
}
const center = makeSpiral(7, STEP * 1.4); center.color = petalColor();
maxDist = Math.max(maxDist, center.maxd) || 1;

const targetR = 290, sc = targetR / maxDist, cx = W / 2, cy = H / 2;
const weight = Math.max(1.8, targetR * 0.013), dotR = Math.max(2.2, targetR * 0.022);

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
svg += `<rect width="${W}" height="${H}" fill="#fcf9f0"/>`;
function draw(sp, ox, oy) {
  const col = `rgb(${sp.color[0]},${sp.color[1]},${sp.color[2]})`;
  const pts = sp.pts.map(p => `${(cx + (ox + p[0]) * sc).toFixed(1)},${(cy + (oy + p[1]) * sc).toFixed(1)}`).join(' ');
  svg += `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (const p of sp.pts) svg += `<circle cx="${(cx + (ox + p[0]) * sc).toFixed(1)}" cy="${(cy + (oy + p[1]) * sc).toFixed(1)}" r="${dotR}" fill="${col}"/>`;
}
for (const ring of rings)
  for (let i = 0; i < ring.numPetals; i++) {
    const a = (Math.PI * 2 / ring.numPetals) * i + ring.rotOff;
    draw(ring.spirals[i], ring.radius * Math.cos(a), ring.radius * Math.sin(a));
  }
draw(center, 0, 0);
svg += `</svg>`;
fs.writeFileSync('/tmp/preview.svg', svg);
console.log('wrote /tmp/preview.svg');
