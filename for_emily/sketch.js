var garden;
var synth;
var pentaScale;
var masterFlower;

function rand_shade(base_color, depth){
  let new_color = color(0, 0, 0);
  let randomN = random(-depth, depth);
  new_color.setRed(red(base_color) + randomN);
  new_color.setGreen(green(base_color) + randomN);
  new_color.setBlue(blue(base_color)+  randomN);
  return new_color;
}

function noise(val){
  return val + random(-val/10, val/10);
}

function midicps(midinote){
  return Math.pow(2, (midinote-69)/12) * 440
}

function arraySelect(array){
  var r = array[Math.round(random(0, array.length - 1))];
  return r;
}

function drawText(){
  textSize(50);
  fill(255);
  textAlign(CENTER);
  text('happy mothers day, emily!', width/2 , height/2 - 80);

  textSize(32);
  text('you make us all bloom :)', width/2 , height/2 - 80 + 200);

  textSize(24);
  text('with love, ', width/2 , height/2 - 80 + 230);

  textSize(24);
  text('hugo, daniel, and margaret',  width/2 , height/2 - 80 + 260);

  textSize(20);
  text('play around with the keyboard!',  width/2 , height/2 - 80 + 290);

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let droneG = new Synth();
  let droneC = new Synth();

  droneG.releaseTime = 60*2;
  droneC.releaseTime = 60*2;

  droneG.attackTime = 1;
  droneC.attackTime = 1;

  droneG.play(43);
  droneC.play(36);

  masterFlower = new Flower(40, width/2, height/2, 12);

  garden = [];
  synth = new Synth();
  pentaScale = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81];
}

function draw() {
  background(color("#57A773"));
  garden.forEach(flower => flower.doSomething());

  masterFlower.spin();

  drawText();
}

class Flower{

  constructor(radius, x, y, petalNumber){
    this.idx = round(random(0, 2));
    this.rotatedir = round(random(-1, 1))
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.flowerColor = color(random(128, 230), random(128, 230),random(128, 230));
    this.petalColor = color(random(128, 230), random(128, 230),random(128, 230));
    this.petalNumber = petalNumber;


    // this.color = [color('#A1E8CC'),color('#FAC9B8'), color('#D6D9CE'),color('#F1B5CB'), color('#E4C1F9'),color('#7BDFF2'),color('#B2F7EF'), color('#FFA69E'),color('#FDF5BF'), color('#F2B5D4'),color('#A7CECB'),color('#FBF5F3'),color('#F3FFB6'),color('#91A6FF'),color('#B4D2E7'), color('#85FF9E'), color('#9684A1'),color('#D0F4DE'), color('#DBBBF5'),color('#D2FF96')];

    // this.flowerColor = arraySelect(this.color);
    // this.petalColor = arraySelect(this.color);
  }

  draw() {

    push();
    fill(this.petalColor);
    translate(this.x, this.y);
    //rotate(radians(frameCount / 2));
    for (var r1 = 0; r1 < this.petalNumber; r1++) {
      // fill(this.petalColors[r1]);
      ellipse(0, this.radius, this.radius * 0.625, this.radius*1.25)
      rotate(PI / (this.petalNumber/2));
  }
    pop();
    fill(this.flowerColor);
    ellipse(this.x, this.y , this.radius, this.radius);


  }
  spin(){

    push();
    fill(this.petalColor);
    translate(this.x, this.y);
    rotate(radians(frameCount / 2) * this.rotatedir);
    print(this.rotatedir);
    for (var r1 = 0; r1 < this.petalNumber; r1++) {
      ellipse(0, this.radius, this.radius * 0.625, this.radius*1.25)
      rotate(PI / (this.petalNumber/2));
  }
    pop();
    fill(this.flowerColor);
    ellipse(this.x, this.y , this.radius, this.radius);
  }

  grow(){

    push();
    fill(this.petalColor);
    translate(this.x, this.y);
    rotate(radians(frameCount / 2));
    for (var r1 = 0; r1 < this.petalNumber; r1++) {
      if (frameCount <= 600) {
        ellipse(0, (this.radius*0.25) + frameCount / (this.radius*0.5), (this.radius*0.25) + frameCount / (this.radius), (this.radius*0.5) + frameCount / (this.radius*0.5));
    }
      if (frameCount > 600) {
        ellipse(0, this.radius, this.radius * 0.625, this.radius*1.25);
    }
    rotate(PI / (this.petalNumber/2));
    }
    pop();
    fill(this.flowerColor);
    if (frameCount <= 600){
      ellipse(this.x, this.y , this.radius*0.625 + frameCount/ (this.radius), this.radius*0.625 + frameCount/(this.radius))

    }
    if (frameCount > 600){
      ellipse(this.x, this.y, this.radius, this.radius)
    }
  }

  doSomething(){
    let idx = this.idx;
    if(idx == 0){
      this.draw();
    }
    if(idx == 1){
      this.spin();
    }
    if(idx == 2){
      this.draw();
    }
  }

}

function keyPressed(){
  var flowerRadius;
  var flowerX, flowerY;
  var flowerNumPetals;
  var osc;

  flowerRadius = random(10, 30);
  flowerX = random(0, width);
  flowerY = random(0, height);
  flowerNumPetals = random(7, 12);

  garden.push(new Flower(flowerRadius, flowerX, flowerY, flowerNumPetals));

  // osc = new p5.Oscillator(midicps(arraySelect(pentaScale)));

  note = arraySelect(pentaScale);
  synth = new Synth();
  synth.play(note);

  return false;
}
