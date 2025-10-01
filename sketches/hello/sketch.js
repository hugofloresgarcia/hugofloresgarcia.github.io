let blobs = [];
let fruits = [
  "apple","banana","mango","watermelon","papaya","kiwi","peach","plum","grape","pear",
  "orange","lemon","lime","cherry","strawberry","blueberry","raspberry","blackberry","pomegranate","fig",
  "apricot","nectarine","dragonfruit","lychee","persimmon","coconut","cranberry","date","guava","jackfruit",
  "durian","passionfruit","tangerine","cantaloupe","honeydew","mulberry","olive","starfruit","kumquat","gooseberry",
  "quince","soursop","sapote","jabuticaba","rambutan","longan","breadfruit","currant","salak","elderberry"
];

let fruitColors = {
  apple: [0,90,100], banana: [55,90,100], mango: [35,90,100], watermelon: [350,90,100],
  papaya: [30,90,100], kiwi: [110,90,100], peach: [20,80,100], plum: [280,80,100],
  grape: [270,90,100], pear: [70,90,100], orange: [25,95,100], lemon: [55,95,100],
  lime: [100,95,100], cherry: [345,95,100], strawberry: [350,95,100], blueberry: [220,90,100],
  raspberry: [330,90,100], blackberry: [260,90,60], pomegranate: [350,95,100], fig: [280,60,80],
  apricot: [30,95,100], nectarine: [15,95,100], dragonfruit: [320,70,100], lychee: [350,70,100],
  persimmon: [25,95,100], coconut: [40,40,90], cranberry: [345,95,100], date: [25,70,60],
  guava: [340,70,95], jackfruit: [65,95,100], durian: [70,70,90], passionfruit: [270,70,95],
  tangerine: [30,95,100], cantaloupe: [25,70,95], honeydew: [90,70,95], mulberry: [260,80,70],
  olive: [85,50,70], starfruit: [55,95,100], kumquat: [35,95,100], gooseberry: [100,70,95],
  quince: [50,80,95], soursop: [100,50,95], sapote: [20,70,80], jabuticaba: [270,80,60],
  rambutan: [350,95,100], longan: [40,60,90], breadfruit: [95,80,95], currant: [340,95,80],
  salak: [15,80,70], elderberry: [260,70,80]
};

let specialBlob;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
  textSize(14);

  for (let i = 0; i < 128; i++) {
    blobs.push(new BlobCreature());
  }

  specialBlob = new SpecialBlob(width/2, height/2);
}

function draw() {
  background(0,0,0,40);

  let t = millis() * 0.0002;
  let globalVx = sin(t) * 0.2;
  let globalVy = cos(t * 0.8) * 0.2;

  for (let b of blobs) {
    b.update(blobs.concat([specialBlob]), globalVx, globalVy);
    b.display();
  }

  specialBlob.update(globalVx, globalVy);
  specialBlob.display();
}

class BlobCreature {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5,0.5);
    this.vy = random(-0.5,0.5);
    this.baseRadius = random(20,50);
    this.noiseSeed = random(1000);

    this.fruits = [];
    for (let i=0; i<3; i++) this.fruits.push(random(fruits));

    this.mainColor = fruitColors[this.fruits[0]] || [random(360),80,100];
    this.innerColors = [
      fruitColors[this.fruits[1]] || [random(360),80,100],
      fruitColors[this.fruits[2]] || [random(360),80,100]
    ];
  }

  update(others, gvx, gvy) {
    this.x += this.vx + gvx;
    this.y += this.vy + gvy;

    if (this.x < (this.baseRadius*2) || this.x > width-(this.baseRadius*2)) this.vx *= -1;
    if (this.y < (this.baseRadius*2) || this.y > height-(this.baseRadius*2)) this.vy *= -1;

    for (let other of others) {
      if (other===this) continue;
      let dx = other.x-this.x, dy = other.y-this.y;
      let distSq = dx*dx+dy*dy;
      let minDist = (this.baseRadius+other.baseRadius)*1.5; // margin
      if (distSq < minDist*minDist) {
        let dist = sqrt(distSq)||1;
        let overlap = (minDist-dist)*0.5;
        let nx = dx/dist, ny = dy/dist;
        this.x -= nx*overlap; this.y -= ny*overlap;
        other.x += nx*overlap; other.y += ny*overlap;
      }
    }
  }

  display() {
    push();
    translate(this.x,this.y);
    let time = millis()*0.001;
    let noiseScale = 0.8;

    // main blob
    fill(...this.mainColor);
    stroke(...this.mainColor);
    beginShape();
    for (let a=0; a<TWO_PI; a+=0.2) {
      let nx = cos(a)*noiseScale+this.noiseSeed;
      let ny = sin(a)*noiseScale+this.noiseSeed;
      let r = this.baseRadius + map(noise(nx+time,ny+time),0,1,-this.baseRadius*0.3,this.baseRadius*0.3);
      vertex(r*cos(a), r*sin(a));
    }
    endShape(CLOSE);

    // inner blobs
    for (let i=0; i<this.innerColors.length; i++) {
      let angle = millis()*0.001 + i*PI;
      let rx = cos(angle)*this.baseRadius*0.3;
      let ry = sin(angle)*this.baseRadius*0.3;
      fill(...this.innerColors[i]);
      noStroke();
      ellipse(rx, ry, this.baseRadius*0.6);
    }

    // fruit words in color around blob
    let radius = this.baseRadius+14;
    let words = this.fruits;
    let totalChars = words.join(" ").length + (words.length-1);
    let idx = 0;
    for (let w=0; w<words.length; w++) {
      let word = words[w];
      let col = fruitColors[word] || [0,0,100];
      for (let i=0; i<word.length; i++) {
        let theta = map(idx,0,totalChars,0,TWO_PI);
        let tx = cos(theta)*radius;
        let ty = sin(theta)*radius;
        push();
        translate(tx,ty);
        rotate(theta+HALF_PI);
        fill(...col);
        noStroke();
        text(word[i],0,0);
        pop();
        idx++;
      }
      idx++; // space
    }
    pop();
  }
}

class SpecialBlob {
  constructor(x,y) {
    this.x=x; this.y=y;
    this.vx=random(-0.3,0.3);
    this.vy=random(-0.3,0.3);
    this.baseRadius=120;
    this.noiseSeed=random(1000);
  }

  update(gvx,gvy) {
    this.x+=this.vx+gvx;
    this.y+=this.vy+gvy;
    if (this.x<this.baseRadius||this.x>width-this.baseRadius) this.vx*=-1;
    if (this.y<this.baseRadius||this.y>height-this.baseRadius) this.vy*=-1;
  }

  display() {
    push();
    translate(this.x,this.y);
    let time = millis()*0.001, noiseScale=0.8;
    fill(0); stroke(255);
    beginShape();
    for (let a=0;a<TWO_PI;a+=0.2){
      let nx=cos(a)*noiseScale+this.noiseSeed;
      let ny=sin(a)*noiseScale+this.noiseSeed;
      let r=this.baseRadius+map(noise(nx+time,ny+time),0,1,-this.baseRadius*0.2,this.baseRadius*0.2);
      vertex(r*cos(a), r*sin(a));
    }
    endShape(CLOSE);

    // message inside
    fill(255); noStroke();
    textSize(16);
    text("a round of suika game,\npartner?",0,0);
    pop();
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}
