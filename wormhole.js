let sketch = function(p) {
    let numPoints = 25;
    p.setup = function() {
      let canvas = p.createCanvas(180, 180);
      p.angleMode(p.DEGREES);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.textFont('Courier New');
      p.frameRate(5);
    };
  
    p.draw = function() {
      p.background("#000000");
      let radius = p.min(p.width, p.height) / 2 - 50;
      let angle = 360 / numPoints;
      p.translate(p.width / 2, p.height / 2);
      for (let i = 0; i < numPoints; i++) {
        let randomAngle = 4 * p.random(-0.5, 0.5);
        let randomRadius = p.random(-radius * 0.1, radius * 0.1);
        let rradius = radius + randomRadius;
        let x = rradius * p.cos(i * angle + randomAngle);
        let y = rradius * p.sin(i * angle + randomAngle);
        let asciiChar = String.fromCharCode(p.random(33, 126));
        p.fill(p.random(255), p.random(255), p.random(255));
        p.text(asciiChar, x, y);
      }
      p.fill(0);
      let phrases = ['not', 'a', 'wormhole'];
      let phraseHeight = 12;
      for (let i = 0; i < phrases.length; i++) {
        p.text(phrases[i], 0, i * phraseHeight - phraseHeight);
      }
    };
  
    p.mousePressed = function() {
      let distance = p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2);
      if (distance <= p.min(p.width, p.height) / 2 - 50) {
        window.location.href = 'https://aldo-aguilar.github.io/';
      }
    };
  };
  
  new p5(sketch, 'wormhole');