// flowerbeds flower(s) for the homepage center.
// p5 instance mode. port of hugo's EYESY flowerbeds mode (T - Flowerbeds/main.py):
// a flower is a ring (or several concentric rings) of rosette spirals; each
// spiral steps by an absolute heading i*(360/niter + angle), angle in [100,300]
// deg — that angle gives the wide palette of different-looking flowers.
//
// desktop: one big flower in the square container.
// mobile (garden mode): the container is a wide rectangle, filled with a patch
// of many smaller flowers, like a garden.

let bouquetSketch = function (p) {
  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const RING = 100;  // model-space ring spacing (fit normalizes to pixels)
  const STEP = 120;  // model-space spiral step

  let host, flowers = [];

  function rand(a, b) { return p.random(a, b); }
  function isGarden() {
    return window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  }

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

  function addSway(sp) {
    sp.swayPhase = rand(0, p.TWO_PI);
    sp.swaySpeed = 0.5 + rand(0, 0.9);
    sp.swayAmp = RING * (0.2 + rand(0, 0.25));
    return sp;
  }

  // build a flower fitted to targetRadius px, with 1..maxRings concentric rings
  function makeFlower(targetRadius, maxRings) {
    const base = colorRand();
    const nRings = 1 + Math.floor(rand(0, maxRings));
    const rings = [];
    let maxDist = 0;
    for (let r = 0; r < nRings; r++) {
      const ringRadius = RING * (r + 1);
      const numPetals = 5 + r * 2 + Math.floor(rand(0, 3));
      const spirals = [];
      let maxOff = 0;
      for (let i = 0; i < numPetals; i++) {
        const sp = addSway(makeSpiral(5 + Math.floor(rand(-2, 5)), STEP * rand(0.8, 1.9), colorNoise(base, 55)));
        if (sp.maxOffset > maxOff) maxOff = sp.maxOffset;
        spirals.push(sp);
      }
      rings.push({
        radius: ringRadius, numPetals: numPetals, spirals: spirals,
        rotDir: p.random([-1, 1]), rotSpeed: rand(0.03, 0.14),
      });
      maxDist = Math.max(maxDist, ringRadius + maxOff);
    }
    const center = addSway(makeSpiral(7, STEP * rand(1.1, 1.7), colorNoise(base, 55)));
    maxDist = Math.max(maxDist, center.maxOffset) || 1;
    const fitScale = targetRadius / maxDist;
    return {
      rings: rings, center: center, fitScale: fitScale,
      weight: Math.max(1, targetRadius * 0.014),
      dotR: Math.max(1.2, targetRadius * 0.028),
    };
  }

  function build() {
    flowers = [];
    const w = p.width, h = p.height, mn = Math.min(w, h);
    if (isGarden()) {
      const count = Math.round(p.constrain((w * h) / (115 * 115), 8, 22));
      for (let i = 0; i < count; i++) {
        const tr = mn * rand(0.12, 0.24);
        flowers.push({
          model: makeFlower(tr, 3),
          cx: rand(tr * 0.4, w - tr * 0.4),
          cy: rand(tr * 0.4, h - tr * 0.4),
          dots: false, // lighter on mobile
        });
      }
    } else {
      flowers.push({ model: makeFlower(mn * 0.5, 8), cx: w / 2, cy: h / 2, dots: true });
    }
  }

  function size() {
    const w = host && host.clientWidth ? host.clientWidth : 200;
    const h = host && host.clientHeight ? host.clientHeight : w;
    return [w, h];
  }

  p.setup = function () {
    host = document.getElementById('bouquet');
    const wh = size();
    const c = p.createCanvas(wh[0], wh[1]);
    c.parent('bouquet');
    p.frameRate(30);
    build();
    if (reduce) { p.noLoop(); p.redraw(); }
  };

  p.windowResized = function () {
    const wh = size();
    p.resizeCanvas(wh[0], wh[1]);
    build();
    if (reduce) p.redraw();
  };

  function drawSpiral(sp, ox, oy, f, cx, cy, dots) {
    const sc = f.fitScale;
    p.noFill();
    p.stroke(sp.color[0], sp.color[1], sp.color[2]);
    p.strokeWeight(f.weight);
    p.beginShape();
    for (const pt of sp.pts) p.vertex(cx + (ox + pt[0]) * sc, cy + (oy + pt[1]) * sc);
    p.endShape();
    if (dots) {
      p.noStroke();
      p.fill(sp.color[0], sp.color[1], sp.color[2]);
      for (const pt of sp.pts) p.circle(cx + (ox + pt[0]) * sc, cy + (oy + pt[1]) * sc, f.dotR);
    }
  }

  function drawFlower(fl, tm) {
    const f = fl.model;
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
        drawSpiral(sp, ox, oy, f, fl.cx, fl.cy, fl.dots);
      }
    }
    const c = f.center;
    const cox = reduce ? 0 : Math.sin(tm * c.swaySpeed + c.swayPhase) * c.swayAmp;
    drawSpiral(c, cox, 0, f, fl.cx, fl.cy, fl.dots);
  }

  p.draw = function () {
    p.clear();
    const tm = reduce ? 0 : p.millis() / 1000;
    for (const fl of flowers) drawFlower(fl, tm);
  };
};

new p5(bouquetSketch, 'bouquet');
