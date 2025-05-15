
let PALETTE = ["ed254e","f9dc5c","c2eabd","011936","465362"];
// add a # to the palette
PALETTE = PALETTE.map(c => "#" + c);

let PALETTE2 = ["272727","2b50aa","ff9fe5","ffd4d4","ff858d"];
PALETTE2 = PALETTE2.map(c => "#" + c);

function random_color() {
  // return color(random(255), random(255), random(255));
  return color(random(PALETTE));
}

function createRock() {
  beginGeometry();
  // the rock
  let num_spheres = 10;
  // let rock_color = random_color_from_palette(PALETTE);
  let rock_color = color(255, 25, 255);
  for (let i = 0; i < num_spheres; i++) {
    push();
    translate(random(-20, 20), random(-20, 20), random(-20, 20));
    fill(random_color());
    stroke(rock_color);
    
    scale(1, 1, 1);
    sphere(random(20, 30));
    
    pop();

  }
  geo = endGeometry();
  return geo;
}

function drawRockPlanet(rock) {
    // spinny rock
    push();
    rotateY(frameCount * 0.01);
    rotateX(frameCount * 0.01);
    rotateZ(frameCount * 0.01);
    model(rock.geo);
    pop();
  
    // and a torus
    push();
    fill(rock.ring_color);
    rotateY((frameCount/100 ) * random(0.001));
    rotateX((frameCount/100 ) * random(0.001));
    rotateZ((frameCount/100 ) * random(0.001));
    torus(75, 2.5);
    pop();
}

class Rock {
  constructor() {
    this.geo = createRock();
    this.xyz = {x: 0, y: 0, z: 0};
    this.palette = PALETTE;
    this.color = random(color(this.palette));
    this.phase = round(random(100));
    this.ring_color = random_color();
  }

  draw() {
    push();
    translate(this.xyz.x, this.xyz.y, this.xyz.z);
    drawRockPlanet(this);
    pop();
  }
}

// a rock geometry
let rocks;

function setup() {
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // create a universe of rocks
  let center = {x: 0, y: 0, z: 0};
  let c = center;

  let span = 1000;

  rocks = [];
  for (let i = 0; i < 10; i++) {
    rocks.push(new Rock());
    rocks[i].xyz = {
      x: random(c-span, c+span),
      y: random(c-span, c+span),
      z: random(c-span, c+span)
    }
    rocks[i].palette = PALETTE;
  }

  // // do another one with a separate center and palette
  // let center2 = {x: span, y: 0, z: 0};
  // let c2 = center2;
  // let rocks2 = [];
  // for (let i = 0; i < 10; i++) {
  //   rocks2.push(new Rock());
  //   rocks2[i].xyz = {
  //     x: random(c2-span, c2+span),
  //     y: random(c2-span, c2+span),
  //     z: random(c2-span, c2+span)
  //   }
  //   rocks2[i].palette = PALETTE2;
  // }
  // rocks = rocks.concat(rocks2);


}

function draw() {
  background(10, 15, 2);
  orbitControl();
  lights();
  noStroke();
  
  // draw the rocks randomly spread (and slowly floating around)
  for (let i = 0; i < rocks.length; i++) {
    rocks[i].draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}