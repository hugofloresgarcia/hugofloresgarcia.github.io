function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var jitter_trees = false;
var tree;

function generate_branch(){
  tree.maxDepth += 1;
  while (tree.height() < tree.maxDepth){
      tree.grow(1);
  }
}

function toggle_jitter(){
  if (this.checked()){
    jitter_trees = true;
  } else {
    jitter_trees = false;
  }
}


function setup() {
  createCanvas(1920/2, 1080/2);

  //root for our tree
  var a = createVector(width/2, height);
  var b = createVector(width/2, height-100);
  var root = new Branch(a, b);

  tree = new Tree(root);

  //button to generate branch
  var generate_branch_button = createButton('generate branches!')
  generate_branch_button.mousePressed(generate_branch)

  //checkbox to activate/deactive node_jitter
  var jitter_box = createCheckbox('jitter', false);
  jitter_box.changed(toggle_jitter)
}


function draw() {
  background(51);

  tree.show();
  if (jitter_trees) {tree.jitter();}


  print(tree.root.force);

}
