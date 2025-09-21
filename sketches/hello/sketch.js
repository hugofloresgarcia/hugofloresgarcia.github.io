let environment = {};
let WIDTH, HEIGHT;
let numMsgs;

let bgColor;
let textColors = [];
let textColors2 = [];
var frameCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  colorMode(HSB);
  textAlign(CENTER, CENTER);
  textSize(12);

  numMsgs = int(HEIGHT / 40);
  // bgColor = color(random(360), 80, 120);
  bgColor = color(0, 0, 0);

  for (i = 0; i < numMsgs; i++) {
    textColors.push(color(random(360), 80, 120));
    textColors2.push(textColors[i]);
  }

  environment.flowers = [];
  environment.transforms = [];

  let num_pairs = 50;
  let spacing = 25; // more spacing between flowers

  for (let i = 0; i < num_pairs; i++) {
    let angle = i * TWO_PI / (num_pairs / 4);
    let radius = spacing * i;

    let center1 = {
      x: WIDTH / 2 + radius * cos(angle),
      y: HEIGHT / 2 + radius * sin(angle),
      z: i
    };
    let center2 = {
      x: WIDTH / 2 + radius * cos(angle + PI),
      y: HEIGHT / 2 + radius * sin(angle + PI),
      z: i
    };

    let clr = color(random(360), 80, 100);
    environment.flowers.push({ center: center1, clr });
    environment.flowers.push({ center: center2, clr });

    environment.transforms.push({ dir: random(-1, 1), freq: random(0.05, 0.1), rotSpeed: random(0.01, 0.03) });
    environment.transforms.push({ dir: random(-1, 1), freq: random(0.05, 0.1), rotSpeed: random(0.01, 0.03) });
  }
}

function draw() {
  background(bgColor);
  frameCount = (frameCount + 1) % 10000;

  // Update text colors periodically
  if (frameCount % 120 === 0) {
    for (let i = 0; i < numMsgs - 1; i++) {
      textColors[i] = textColors[i + 1];
    }
    textColors[numMsgs - 1] = color(random(360), 120, 80);
  }

  // 🌸 Draw animated flowers
  for (let i = 0; i < environment.flowers.length; i++) {
    let flower = environment.flowers[i];
    let tfm = environment.transforms[i];

    // Subtle bounce + side wobble
    let bounce = sin(frameCount * tfm.freq + i) * 5;
    let x = flower.center.x + tfm.dir * sin(frameCount * 0.01 + i) * 3;
    let y = flower.center.y + bounce;

    // Draw rotating flower
    push();
    translate(x, y);
    rotate(frameCount * tfm.rotSpeed * tfm.dir);
    noStroke();
    fill(flower.clr);
    ellipse(0, 0, 20, 20); // flower center
    pop();

    // Text label above flower
    fill(255);
    textSize(10);
    text("hello!", x, y - 16);
  }

  // 🌀 Spinning circular message
  textSize(24);
  let today = new Date();
  let dateStr = today.toDateString();
  let msg = `greetings from sf! - hugo and cami - ${dateStr}`;

  let cx = WIDTH / 2;
  let cy = HEIGHT / 2;
  let radius = 200;
  let baseAngle = frameCount * 0.01;

  for (let i = 0; i < msg.length; i++) {
    let theta = baseAngle + map(i, 0, msg.length, 0, TWO_PI);
    let x = cx + radius * cos(theta);
    let y = cy + radius * sin(theta);

    push();
    translate(x, y);
    rotate(theta + HALF_PI);
    fill(textColors[i % textColors.length]);
    text(msg[i], 0, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
