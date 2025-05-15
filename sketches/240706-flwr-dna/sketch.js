
environment = {}



function build_stem(center1, center2, clr) {
  let stem;
  beginGeometry();
  // stroke(clr);
  // strokeWeight(1);
  // noFill();

  fill(clr);
  // Draw a cylinder representing the stem between the two flower centers
  // cylinder(radius, height, detailX, detailY, capTop, capBottom)
  // translate and rotate so that the stem is oriented between the two centers
  let x1 = center1.x;
  let y1 = center1.y;
  let z1 = center1.z;
  let x2 = center2.x;
  let y2 = center2.y;
  let z2 = center2.z;
  let dx = x2 - x1;
  let dy = y2 - y1;
  let dz = z2 - z1;
  let angle = atan2(dy, dx);
  let length = sqrt(dx*dx + dy*dy + dz*dz);
  translate(0, 0, z1);
  rotateZ(angle);
  rotateZ(PI / 2);
  rotateY(atan2(dz, sqrt(dx*dx + dy*dy)));
  
  rotateY(PI);
  
  // the code above makes a stem PERPENDICULAR to the line we actually want to draw
  // so we need to rotate it by 90 degrees

  cylinder(2, length, 10, 1, 1);

  stem = endGeometry();
  return stem;
}

let WIDTH = 600;
let HEIGHT = 600;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  colorMode(HSB);
  // debugMode();
  camera(0, 0, 500, 0, 0, 0, 0, 1, 0);

  // Build flowers and stems in helix pattern
  environment.flowers = [];
  environment.stems = [];

  for (let i = 0; i < 8; i++) {
    let theta = TWO_PI * i / 8;
    let offset = {
      x: 100 * cos(theta),
      y: 100 * sin(theta),
      z: 0
    };
    stem(environment, offset);
  }
  
  environment.transforms = [];
  for (let i = 0; i < environment.flowers.length; i++) {
    let tfm = {};
    tfm.zdir = random(-1, 1);
    // tfm.zdir = 0;
    // tfm.bouncefreq = random(0.1, 2.0);
    // tfm.bouncefreq = 2;
    tfm.stemsstrokeweight = random(0.5, 2.0);

    environment.transforms.push(tfm);
  }

}

function stem(environment, offset) {
  let num_pairs = 25;
  for (let i = 0; i < num_pairs; i++) {
    let angle = 4 * i * TWO_PI / (num_pairs);
    // let radius = 10 * pow(1.05,  i);
    let radius = 1 * i  +  random(5, 10) ; // helix-like
    // let radius = random(0, num_pairs * 5)

    // Calculate centers for each flower in a pair
    let center1 = {
      x: radius * cos(angle) + offset.x,
      y: radius * sin(angle) + offset.y,
      z: 10  * i
      // z: radius * sin(angle)
    };
    
    let center2 = {
      x: radius * cos(angle + PI),
      y: radius * sin(angle + PI),
      z: 10 * i
      // z: radius * sin(angle + PI)
    };

    
    let theta = random(TWO_PI);
    let clr = random_color_from_palette(PALETTE);
    
    let flower1 = new Flower(center1, theta, clr);
    let flower2 = new Flower(center2, theta, clr);
    let stem = build_stem(center1, center2, color("#556b2fff")); // Dark olive green for stems
    
    environment.flowers.push(flower1);
    environment.flowers.push(flower2);
    environment.stems.push(stem);
    console.log("flower number " + i + " created");
  }
}

// function to draw a perlin noise background
// with varying hues of green


function draw() {
  // background(100, 255, 80);
  background(0);
  lights();
  orbitControl();



  // noStroke();
  // translate(0, 0, -200); // Move the whole scene back a bit

  // rotateZ(frameCount * PI / 1000); // Slow rotation for visualization
  
  // Draw all stems
  // for (let stem of environment.stems) {
  //   model(stem);
  // }
  
  // Draw all flowers
  // noStroke();
  // stroke("#ff32b3");
  
  // make an array of random (-1, 1) directions for the flowers to rotate
  // let dirs = [];
  // for (let i = 0; i < environment.flowers.length; i++) {
  //   dirs.push(random() < 0.5 ? -1 : 1);
  // }



  for (let i = 0; i < environment.flowers.length; i++) {
    let flower = environment.flowers[i];
    let tfm = environment.transforms[i];
    // let dir = dirs[i];
    // move slightly outward
    
    // push();

    // draw a bezier curve from the center of the flower
    // to the previous flower (if it exists)
    // stroke("#556b2fff")
    push();

    rotateZ(frameCount * PI / 1000); // Slow rotation for visualization

    // translate(0, 1 + 1 * cos(frameCount*0.1), 0);

    // translate(
    //   0, 0,  
    //   10 * tfm.zdir * sin(frameCount / 10 * tfm.bouncefreq)
    // ); 
    
    // stems
    if (i > 0) {
      let prev_flower = environment.flowers[i - 1];
      let center1 = flower.center;
      let center2 = prev_flower.center;
      let clr = color("#556b2fff");
      stroke(clr);
      strokeWeight(tfm.stemsstrokeweight);
      noFill();
      
      bezier(
        center1.x, center1.y, center1.z,
        0, 0,  center1.z - 30,
        0, 0,  center2.z + 30,
        0, 0, - 50, center2.z
      );
    }
    
    
    noStroke();
    translate(flower.center.x, flower.center.y, flower.center.z);
    rotate(tfm.zdir * (1 + abs(flower.center.z)) * frameCount * PI / 100000);

    // rotateX(tfm.zdir * abs(flower.center.z) * frameCount * PI / 10000);
    // rotateY(tfm.zdir * abs(flower.center.z) * frameCount * PI / 10000);

    // scale(
    //   1 + 0.001 * abs(flower.center.z), 
    //   1 + 0.001 * abs(flower.center.z), 
    //   1 + 0.001 * abs(flower.center.z)
    // );
    fill(flower.clr);
    model(flower.geo);
    pop();
  }

    // bottom text that says "flowers are in my dna"
    loadFont('https://cdn.glitch.com/1e2d5f0c-2c6e-4b3f-8b5b-9b5a6e1d4d4f%2FInconsolata%2FInconsolata-Bold.ttf?v=1619473521723', (font) => {
      textFont
    });
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("flowers are in my dna", 0, HEIGHT / 2 - 50, 0);
    
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}