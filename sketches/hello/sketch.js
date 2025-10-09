let centerBlob;
let message = "hello bugy bugy bug bug bugy! te amo mucho mucho mucho! ";

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
  textSize(20);
  centerBlob = new FloatingBlob(width / 2, height / 2, 200);
}

function draw() {
  background(0, 0, 0, 40);
  centerBlob.update();
  centerBlob.display();
}

class FloatingBlob {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.noiseSeed = random(1000);
    this.angleOffset = 0;
  }

  update() {
    // gentle floating motion
    this.x = width / 2 + sin(millis() * 0.001) * 20;
    this.y = height / 2 + cos(millis() * 0.0012) * 20;
    this.angleOffset += 0.002; // slow text rotation
  }

  display() {
    push();
    translate(this.x, this.y);
    let t = millis() * 0.001;
    let noiseScale = 0.8;

    // blob shape
    fill(300, 80, 100);
    stroke(300, 80, 100);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      let nx = cos(a) * noiseScale + this.noiseSeed;
      let ny = sin(a) * noiseScale + this.noiseSeed;
      let r = this.baseRadius + map(noise(nx + t, ny + t), 0, 1, -this.baseRadius * 0.2, this.baseRadius * 0.2);
      vertex(r * cos(a), r * sin(a));
    }
    endShape(CLOSE);

    // text around blob
    let textRadius = this.baseRadius + 30;
    let totalChars = message.length;
    for (let i = 0; i < totalChars; i++) {
      let theta = map(i, 0, totalChars, 0, TWO_PI) + this.angleOffset;
      let tx = cos(theta) * textRadius;
      let ty = sin(theta) * textRadius;
      push();
      translate(tx, ty);
      rotate(theta + HALF_PI);
      fill(0, 0, 100);
      noStroke();
      text(message[i], 0, 0);
      pop();
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
