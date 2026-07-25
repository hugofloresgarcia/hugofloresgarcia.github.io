// self-similarity map for "aguante tacuazín — at the lake".
// ssm.png is an MFCC self-similarity matrix (4s per pixel, precomputed
// offline — see the release notes). here it gets tinted with the garden's
// palette: paper -> pale green -> green -> yellow -> hot orange, so the
// structure of the set reads like a little sun-baked quilt.
//
// while you listen, the played square [0..t] x [0..t] stays in full color
// and the future is veiled; a crosshair + pulsing daisy-yellow dot ride
// the diagonal. tap (or drag) anywhere to travel to that part of the set.

(function () {
  const cv = document.getElementById('ssm');
  const audio = document.getElementById('audio');
  if (!cv || !audio) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = cv.getContext('2d');
  let base = null;  // offscreen canvas holding the tinted matrix
  let W = 0;        // css pixel size of the display canvas

  // garden colormap: piecewise-linear between stops (v in 0..1 -> rgb)
  const STOPS = [
    [0.00, [255, 255, 255]],  // paper
    [0.30, [214, 238, 214]],  // pale green
    [0.55, [72, 168, 90]],    // vine green
    [0.75, [188, 214, 50]],   // yellow-green
    [0.88, [255, 213, 0]],    // sun yellow
    [1.00, [235, 92, 32]],    // hot orange
  ];

  function buildLUT() {
    const lut = new Uint8ClampedArray(256 * 3);
    for (let v = 0; v < 256; v++) {
      const x = v / 255;
      let i = 0;
      while (i < STOPS.length - 2 && x > STOPS[i + 1][0]) i++;
      const [x0, c0] = STOPS[i];
      const [x1, c1] = STOPS[i + 1];
      const u = Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
      for (let ch = 0; ch < 3; ch++) {
        lut[v * 3 + ch] = c0[ch] + (c1[ch] - c0[ch]) * u;
      }
    }
    return lut;
  }

  const img = new Image();
  img.src = 'ssm.png';
  img.onload = function () {
    const n = img.width;
    const off = document.createElement('canvas');
    off.width = n; off.height = n;
    const octx = off.getContext('2d');
    octx.drawImage(img, 0, 0);
    const id = octx.getImageData(0, 0, n, n);
    const px = id.data;
    const lut = buildLUT();
    for (let i = 0; i < px.length; i += 4) {
      const v = px[i]; // grayscale: r = similarity
      px[i] = lut[v * 3];
      px[i + 1] = lut[v * 3 + 1];
      px[i + 2] = lut[v * 3 + 2];
    }
    octx.putImageData(id, 0, 0);
    base = off;
    size();
  };

  function size() {
    const rect = cv.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = rect.width;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(W * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
  }
  window.addEventListener('resize', size);

  function draw() {
    requestAnimationFrame(draw);
    if (!base || !W) return;
    const lvl = window.__gardenLevel || 0;
    const progress = (audio.currentTime || 0) / (audio.duration || 1);
    const p = progress * W;

    ctx.clearRect(0, 0, W, W);
    // coarse matrix upscaled -> keep the cells crisp, like quilt squares
    ctx.imageSmoothingEnabled = base.width >= cv.width;
    ctx.drawImage(base, 0, 0, W, W);

    // veil the future: only the played square keeps its full color
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.fillRect(p, 0, W - p, W);
    ctx.fillRect(0, p, p, W - p);

    // crosshair at now
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p, 0); ctx.lineTo(p, W);
    ctx.moveTo(0, p); ctx.lineTo(W, p);
    ctx.stroke();

    // now-dot on the diagonal, pulsing with the music
    const r = 3 + (reduceMotion ? 0 : 2.5 * lvl);
    ctx.beginPath();
    ctx.arc(p, p, r, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
  draw();

  // tap or drag to travel (x axis = time). seeks are coalesced to one
  // currentTime write per frame, and clamped shy of the end (player.js's
  // __safeSeek) so a far-right tap can't fire `ended` and stop playback.
  let down = false;
  let pendingFrac = null;
  function commitSeek() {
    if (pendingFrac === null) return;
    if (isFinite(audio.duration)) {
      const t = pendingFrac * audio.duration;
      if (window.__safeSeek) window.__safeSeek(t);
      else audio.currentTime = Math.min(t, audio.duration - 0.25);
    }
    pendingFrac = null;
  }
  function seekTo(e) {
    const rect = cv.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    pendingFrac = x / rect.width;
    requestAnimationFrame(commitSeek);
  }
  cv.addEventListener('pointerdown', function (e) {
    down = true;
    cv.setPointerCapture(e.pointerId);
    seekTo(e);
  });
  cv.addEventListener('pointermove', function (e) { if (down) seekTo(e); });
  cv.addEventListener('pointerup', function () { down = false; commitSeek(); });
  cv.addEventListener('pointercancel', function () { down = false; pendingFrac = null; });
})();
