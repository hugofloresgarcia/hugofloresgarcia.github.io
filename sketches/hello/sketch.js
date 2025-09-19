let environment = {};
let WIDTH, HEIGHT;

function setup() {
  createCanvas(windowWidth, windowHeight);
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  colorMode(HSB);
  textAlign(CENTER, CENTER);
  textSize(12);

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

var frameCount = 0;
function draw() {
  background(120, 20, 95); // pale green
  frameCount++;

  for (let i = 0; i < environment.flowers.length; i++) {
    let flower = environment.flowers[i];
    let tfm = environment.transforms[i];

    // Subtle animation
    let bounce = sin(frameCount * tfm.freq + i) * 5;
    let x = flower.center.x + tfm.dir * sin(frameCount * 0.01 + i) * 3;
    let y = flower.center.y + bounce;

    // Draw rotating flower
    push();
    translate(x, y);
    rotate(frameCount * tfm.rotSpeed * tfm.dir);
    noStroke();

    //swap flower color every 2 seconds
    if (frameCount % 120 === 0 ) {
      flower.clr = color(random(360), 80, 100);
    }
    fill(flower.clr);
    ellipse(0, 0, 40, 40); // center ellipse
    pop();

    // Draw label text slightly above
    fill(0);
    text("hello cami!", x, y - 18); // slightly above flower
  }

  // Main header message
  fill(0);
  textSize(24);
  let today = new Date();
  let dateStr = today.toDateString();
  text(`hello cami! :) today is ${dateStr}`, WIDTH / 2, 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
