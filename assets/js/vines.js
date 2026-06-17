// generative flower + vine frame for the homepage.
// p5 instance mode (cf. wormhole.js). port of hugo's flowerbeds
// (github.com/hugofloresgarcia/flowerbeds): flower.cpp's noisy turtle spiral for
// blooms, plus its flowerVine (a green strand that drifts/grows) for vines, with
// ofApp.cpp's sparse, feedback-trailed composition. adapted for a white site:
// small, high-variance blooms and meandering vines ring the edges, behind text.

let vineSketch = function (p) {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BASE_TURN = 0.5 * (Math.PI / 180); // .5 * DEG_TO_RAD
  let t = 0;
  let els = [];
  let unit = 1;

  function rnd(a, b) { return p.random(a, b); }

  function buildElements() {
    els = [];
    const s = p.min(p.width, p.height);
    unit = s;
    const band = p.max(34, s * 0.08);
    const edgeMin = p.max(8, s * 0.012);

    function place(axis, baseCoord, sign) {
      const len = axis === 'h' ? p.width : p.height;
      const count = p.max(3, Math.floor(len / (s * 0.22)));
      for (let k = 0; k <= count; k++) {
        if (p.random() < 0.18) continue; // gaps -> less organized
        const u = p.constrain((k + rnd(-0.45, 0.45)) / count, 0.02, 0.98);
        const along = u * len;
        const inset = edgeMin + rnd(0, band);
        const x = axis === 'h' ? along : baseCoord + sign * inset;
        const y = axis === 'h' ? baseCoord + sign * inset : along;
        const alongHeading = axis === 'h' ? (p.random() < 0.5 ? 0 : Math.PI)
                                          : (p.random() < 0.5 ? p.HALF_PI : -p.HALF_PI);

        // weighted pick of creature: vine / coil flower / daisy / lily
        const r = p.random();
        const kind = r < 0.38 ? 'vine' : r < 0.60 ? 'flower' : r < 0.80 ? 'daisy' : 'lily';

        if (kind === 'vine') {
          // ---- vine: a drifting/growing green strand (flowerVine) ----
          els.push({
            kind: 'vine',
            x: x, y: y,
            niter: Math.floor(rnd(70, 220)),
            step: s * rnd(0.004, 0.009),
            wander: rnd(0.12, 0.55),          // heading random-walk amount
            noiseIndex: rnd(0, 3),
            seed: rnd(1000),
            heading: alongHeading + rnd(-0.6, 0.6),
            grow: reduceMotion ? 1 : 0,
            growSpeed: rnd(0.004, 0.013),
            hue: p.random() < 0.78 ? rnd(95, 150) : rnd(0, 360), // mostly green
            sat: rnd(60, 92),
            bri: rnd(42, 66),
            weight: p.max(0.8, s * rnd(0.0008, 0.0014)),
            tendrils: p.random() < 0.7,
          });
        } else if (kind === 'flower') {
          // ---- flower: an open noisy coil bloom (flower.cpp spiral) ----
          els.push({
            kind: 'flower',
            x: x, y: y,
            numPetals: 2 + Math.floor(rnd(0, 5)),  // fewer petals -> sparser
            niter: Math.floor(rnd(26, 56)),        // shorter coils
            step: s * rnd(0.003, 0.0065),          // more spread between samples
            coil: rnd(0.28, 0.5),                  // lower turn growth -> open, not dense
            timeScale: rnd(0.06, 0.18),            // slow internal morph
            noiseIndex: rnd(0, 3),
            seed: rnd(1000),
            baseRot: rnd(0, p.TWO_PI),
            spin: rnd(-0.04, 0.04),                // slow spin
            hue: p.random() < 0.35 ? rnd(95, 150) : rnd(0, 360),
            sat: rnd(78, 96),
            bri: rnd(70, 88),
            weight: p.max(1, s * rnd(0.0011, 0.0017)),
          });
        } else if (kind === 'daisy') {
          // ---- daisy: rounded ring(s) of circles (pure SinOsc / consonant) ----
          els.push({
            kind: 'daisy',
            x: x, y: y,
            dots: 5 + Math.floor(rnd(0, 8)),
            rings: 1 + Math.floor(rnd(0, 2)),
            ringR: s * rnd(0.01, 0.03),
            dotR: s * rnd(0.0018, 0.0045),
            seed: rnd(1000),
            baseRot: rnd(0, p.TWO_PI),
            spin: rnd(-0.1, 0.1),
            hue: p.random() < 0.3 ? rnd(95, 150) : rnd(0, 360),
            sat: rnd(70, 92),
            bri: rnd(72, 90),
            weight: p.max(1, s * rnd(0.001, 0.0015)),
          });
        } else {
          // ---- lily: jagged inharmonic spikes (FM, non-integer ratio) ----
          els.push({
            kind: 'lily',
            x: x, y: y,
            spikes: 5 + Math.floor(rnd(0, 5)),
            len: s * rnd(0.012, 0.04),
            jag: rnd(0.4, 1.1),               // angular jitter per segment
            seed: rnd(1000),
            baseRot: rnd(0, p.TWO_PI),
            spin: rnd(-0.14, 0.14),
            hue: p.random() < 0.25 ? rnd(95, 150) : rnd(0, 360),
            sat: rnd(80, 98),
            bri: rnd(66, 86),
            weight: p.max(0.9, s * rnd(0.001, 0.0015)),
          });
        }
      }
    }

    place('h', 0, +1);          // top
    place('h', p.height, -1);   // bottom
    place('v', 0, +1);          // left
    place('v', p.width, -1);    // right
  }

  p.setup = function () {
    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent('vines');
    p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.frameRate(30);
    p.clear(); // transparent — let the real page background show
    buildElements();
    if (reduceMotion) {
      p.noLoop();
      p.redraw();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.clear();
    buildElements();
    if (reduceMotion) p.redraw();
  };

  // flower petal: flowerbeds turtle spiral. a = heading, b = turn-rate;
  // b += base + high-freq noise per step -> noisy runaway coil.
  function spiral(f, seedOff, hue) {
    let a = 0, b = 0, x = 0, y = 0;
    p.noFill();
    p.stroke(hue % 360, f.sat, f.bri, 85);
    p.strokeWeight(f.weight);
    p.beginShape();
    p.vertex(0, 0);
    for (let i = 0; i < f.niter; i++) {
      a += b;
      b += BASE_TURN + f.coil * p.noise(i * 0.18 + t * f.timeScale + f.noiseIndex + f.seed + seedOff);
      x += f.step * Math.cos(a);
      y += f.step * Math.sin(a);
      p.vertex(x, y);
    }
    p.endShape();
  }

  function drawFlower(f) {
    p.push();
    p.translate(f.x, f.y);
    p.rotate(f.baseRot + (reduceMotion ? 0 : t * f.spin));
    for (let i = 0; i < f.numPetals; i++) {
      p.push();
      p.rotate(p.TWO_PI / (f.numPetals * (i + 1))); // 360/(numPetals*(i+1))
      spiral(f, i * 7.3, f.hue + i * 11);
      p.pop();
    }
    p.pop();
  }

  // vine: heading random-walk (meanders instead of coiling), grows over time,
  // with occasional little tendril coils budding off it.
  function drawVine(v) {
    if (!reduceMotion && v.grow < 1) v.grow = Math.min(1, v.grow + v.growSpeed);
    const n = Math.max(2, Math.floor(v.niter * v.grow));
    let a = v.heading, x = 0, y = 0;
    const pts = [[0, 0]];
    for (let i = 0; i < n; i++) {
      a += v.wander * (p.noise(i * 0.12 + t * 0.2 * (0.5 + v.noiseIndex) + v.seed) - 0.5);
      x += v.step * Math.cos(a);
      y += v.step * Math.sin(a);
      pts.push([x, y]);
    }
    p.push();
    p.translate(v.x, v.y);
    p.noFill();
    p.stroke(v.hue % 360, v.sat, v.bri, 88);
    p.strokeWeight(v.weight);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape();
    // tendril buds along the strand
    if (v.tendrils) {
      for (let i = 12; i < pts.length; i += 16) {
        p.push();
        p.translate(pts[i][0], pts[i][1]);
        p.rotate((reduceMotion ? 0 : t * 0.6) + v.seed + i);
        p.stroke(v.hue % 360, v.sat, v.bri + 10, 80);
        p.strokeWeight(v.weight * 0.8);
        p.beginShape();
        let aa = 0, bb = 0, xx = 0, yy = 0;
        const R = unit * 0.004;
        for (let j = 0; j < 14; j++) {
          aa += bb;
          bb += 0.18 + 0.5 * p.noise(j * 0.4 + v.seed + i);
          xx += R * Math.cos(aa);
          yy += R * Math.sin(aa);
          p.vertex(xx, yy);
        }
        p.endShape();
        p.pop();
      }
    }
    p.pop();
  }

  // daisy: rounded, consonant — concentric rings of small circles.
  function drawDaisy(d) {
    const pulse = reduceMotion ? 1 : 1 + 0.08 * Math.sin(t * 2 + d.seed);
    p.push();
    p.translate(d.x, d.y);
    p.rotate(d.baseRot + (reduceMotion ? 0 : t * d.spin));
    p.noFill();
    p.stroke(d.hue % 360, d.sat, d.bri, 85);
    p.strokeWeight(d.weight);
    for (let ring = 0; ring < d.rings; ring++) {
      const rr = d.ringR * (1 + ring * 0.6) * pulse;
      for (let i = 0; i < d.dots; i++) {
        const a = (p.TWO_PI / d.dots) * i + ring * 0.3;
        p.circle(rr * Math.cos(a), rr * Math.sin(a), d.dotR * 2);
      }
    }
    p.noStroke();
    p.fill(d.hue % 360, d.sat, d.bri, 85);
    p.circle(0, 0, d.dotR * 1.6);
    p.pop();
  }

  // lily: jagged, inharmonic — spikes of uneven length and noisy heading.
  function drawLily(l) {
    p.push();
    p.translate(l.x, l.y);
    p.rotate(l.baseRot + (reduceMotion ? 0 : t * l.spin));
    p.noFill();
    p.stroke(l.hue % 360, l.sat, l.bri, 88);
    p.strokeWeight(l.weight);
    const seg = 5;
    for (let i = 0; i < l.spikes; i++) {
      const len = l.len * (0.4 + p.noise(i * 1.3 + l.seed + t * 0.3)); // inharmonic lengths
      let a = (p.TWO_PI / l.spikes) * i;
      let x = 0, y = 0;
      p.beginShape();
      p.vertex(0, 0);
      for (let j = 0; j < seg; j++) {
        a += l.jag * (p.noise(i * 2.1 + j * 0.7 + l.seed + t * 0.2) - 0.5);
        x += (len / seg) * Math.cos(a);
        y += (len / seg) * Math.sin(a);
        p.vertex(x, y);
      }
      p.endShape();
    }
    p.pop();
  }

  p.draw = function () {
    if (reduceMotion) {
      p.clear();
    } else {
      t += 0.01;
      // fade existing pixels toward transparent -> feedback trails on a clear bg
      p.noStroke();
      p.erase(42);
      p.rect(0, 0, p.width, p.height);
      p.noErase();
    }
    for (const e of els) {
      if (e.kind === 'vine') drawVine(e);
      else if (e.kind === 'daisy') drawDaisy(e);
      else if (e.kind === 'lily') drawLily(e);
      else drawFlower(e);
    }
  };
};

new p5(vineSketch, 'vines');
