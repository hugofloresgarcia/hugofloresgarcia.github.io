function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var jitter_trees = false;
var tree;
var absolute_max_depth = 5;

function generate_branch(){
  if (tree.maxDepth <= absolute_max_depth){
  tree.grow(1);
  }
}

function random_insert(){
    tree.random_insert();
}

function toggle_jitter(){
  if (this.checked()){
    jitter_trees = true;
  } else {
    jitter_trees = false;
  }
}


function setup() {
  createCanvas(screen.width, screen.height-20);

  //root for our tree
  var a = createVector(width/2, height);
  var b = createVector(width/2, height-200);
  var root = new Branch(a, b);
//brown: color(179, 89, 0)
  tree = new Tree(root);
  springPalette = [color(72, 191, 132), color(72, 191, 132), color(255, 186, 215)];
  tree.setPalette(springPalette);

  //button to generate branch
  var generate_branch_button = createButton('generate branches!')
  generate_branch_button.mousePressed(generate_branch)

  //button to random insert
  var random_insert_button = createButton('random insert!')
  random_insert_button.mousePressed(random_insert)

  //checkbox to activate/deactive node_jitter
  var jitter_box = createCheckbox('jitter', false);
  jitter_box.changed(toggle_jitter)
}


function draw() {
  background(100);

  tree.show();
  if (jitter_trees) {tree.jitter();}

}
