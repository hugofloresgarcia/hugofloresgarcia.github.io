// a single flowerbeds flower for the homepage center.
// p5 instance mode. port of hugo's EYESY flowerbeds mode (T - Flowerbeds/main.py):
// a flower is a rotating ring of rosette "spirals". each spiral steps by an
// absolute heading i*(360/niter + angle), where angle = uniform(100,300) deg —
// that angle is what gives the wide palette of different-looking flowers.
// the whole thing is auto-scaled to fit the canvas. transparent background.

let bouquetSketch = function (p) {
  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let host, flower;

  function rand(a, b) { return p.random(a, b); }

  function colorRand() {
    let c;
    do {
      c = [p.random(128, 255), p.random(128, 255), p.random(128, 255)];
    } while (c[0] + c[1] + c[2] > 660); // skip near-white (low contrast on cream)
    return c;
  }
  function colorNoise(c, amt) {
    return c.map(function (v) { return p.constrain(v + p.random(-amt, amt), 0, 255); });
  }

  // build one rosette spiral: precompute its points (offsets from its own center)
  function makeSpiral(niter0, stepLength, color) {
    let angle = rand(100, 300); // degrees — the key shape parameter
    let n = niter0;
    let step = stepLength;
    const expansiveness = Math.abs(angle - 180);
    if (expansiveness > 30) {
      const stepAdj = 1 - expansiveness / 180;
      const adj = 0.3 + stepAdj;
      step *= adj;
      n = Math.floor(n * 3 / adj);
    }
    n = Math.max(5, n);
    const pts = [];
    let x = 0, y = 0, maxOffset = 0;
    for (let i = 0; i < n; i++) {
      const rad = p.radians(i * (360 / n + angle));
      const st = (i / n) * step;
      x += Math.cos(rad) * 0.5 * st;
      y += Math.sin(rad) * 0.5 * st;
      pts.push([x, y]);
      const d = Math.hypot(x, y);
      if (d > maxOffset) maxOffset = d;
    }
    return { color: color, pts: pts, maxOffset: maxOffset };
  }

  function addSway(sp, baseRadius) {
    sp.swayPhase = rand(0, p.TWO_PI);
    sp.swaySpeed = 0.5 + rand(0, 0.9);          // gentle, like the navbar links
    sp.swayAmp = baseRadius * (0.06 + rand(0, 0.1));
    return sp;
  }

  // a flower = several concentric rings of rosette spirals (fuller outer rings)
  function makeFlower(s) {
    const base = colorRand();
    const baseRadius = s * 0.085;
    const petalStep = s * 0.1;
    const nRings = 4 + Math.floor(rand(0, 5)); // 4-8 rings
    const rings = [];
    let maxDist = 0;
    for (let r = 0; r < nRings; r++) {
      const ringRadius = baseRadius * (r + 1);
      const numPetals = 5 + r * 2 + Math.floor(rand(0, 3)); // fuller toward the edge
      const spirals = [];
      let maxOff = 0;
      for (let i = 0; i < numPetals; i++) {
        // vary each spiral's size so some blooms are noticeably bigger
        const sp = addSway(makeSpiral(5 + Math.floor(rand(-2, 5)), petalStep * rand(0.8, 1.9), colorNoise(base, 55)), baseRadius);
        if (sp.maxOffset > maxOff) maxOff = sp.maxOffset;
        spirals.push(sp);
      }
      rings.push({
        radius: ringRadius,
        numPetals: numPetals,
        spirals: spirals,
        rotDir: p.random([-1, 1]),
        rotSpeed: rand(0.03, 0.14),
      });
      maxDist = Math.max(maxDist, ringRadius + maxOff);
    }
    const center = addSway(makeSpiral(7, petalStep * rand(1.1, 1.7), colorNoise(base, 55)), baseRadius);
    maxDist = Math.max(maxDist, center.maxOffset) || 1;
    return {
      rings: rings,
      center: center,
      fitScale: (s * 0.5) / maxDist,
      weight: Math.max(1.2, s * 0.0055),
      dotR: Math.max(1.4, s * 0.011),
    };
  }

  p.setup = function () {
    host = document.getElementById('bouquet');
    const s0 = host && host.clientWidth ? host.clientWidth : 200;
    const c = p.createCanvas(s0, s0);
    c.parent('bouquet');
    p.frameRate(30);
    flower = makeFlower(s0);
    if (reduce) { p.noLoop(); p.redraw(); }
  };

  p.windowResized = function () {
    const s0 = host && host.clientWidth ? host.clientWidth : 200;
    p.resizeCanvas(s0, s0);
    flower = makeFlower(s0);
    if (reduce) p.redraw();
  };

  function drawSpiral(sp, ox, oy, f) {
    const cx = p.width / 2, cy = p.height / 2, sc = f.fitScale;
    p.noFill();
    p.stroke(sp.color[0], sp.color[1], sp.color[2]);
    p.strokeWeight(f.weight);
    p.beginShape();
    for (const pt of sp.pts) p.vertex(cx + (ox + pt[0]) * sc, cy + (oy + pt[1]) * sc);
    p.endShape();
    p.noStroke();
    p.fill(sp.color[0], sp.color[1], sp.color[2]);
    for (const pt of sp.pts) p.circle(cx + (ox + pt[0]) * sc, cy + (oy + pt[1]) * sc, f.dotR);
  }

  p.draw = function () {
    p.clear();
    const f = flower;
    const tm = reduce ? 0 : p.millis() / 1000;
    for (const ring of f.rings) {
      for (let i = 0; i < ring.numPetals; i++) {
        const sp = ring.spirals[i];
        const a = (p.TWO_PI / ring.numPetals) * i +
          (p.TWO_PI * tm * ring.rotDir * ring.rotSpeed) / ring.numPetals;
        let ox = ring.radius * Math.cos(a);
        let oy = ring.radius * Math.sin(a);
        if (!reduce) {
          ox += Math.sin(tm * sp.swaySpeed + sp.swayPhase) * sp.swayAmp;
          oy += Math.sin(tm * sp.swaySpeed * 0.7 + sp.swayPhase) * sp.swayAmp * 0.6;
        }
        drawSpiral(sp, ox, oy, f);
      }
    }
    const c = f.center;
    const cox = reduce ? 0 : Math.sin(tm * c.swaySpeed + c.swayPhase) * c.swayAmp;
    drawSpiral(c, cox, 0, f);
  };
};

new p5(bouquetSketch, 'bouquet');
