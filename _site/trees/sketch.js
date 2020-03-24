function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var jitter_trees = false;
var tree;
var trees = [];
var absolute_max_depth = 5;
var palettes = [];
var absolute_max_trees = 7;
// function generate_branch(){
//   if (tree.maxDepth <= absolute_max_depth){
//   tree.grow(1);
//   }
// }


function setup() {
  function generate_branch(){
    idx = round(random(0, trees.length-1));
    print(idx);
    let tree = trees[idx];
    tree.grow(1);
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

  function spawn_tree(){
    if (trees.length < absolute_max_trees){
    let num_trees = trees.length + 1;

    for (let i = 0 ; i < trees.length ; i++){
      let a = createVector(width/(num_trees+1)*(i+1), height);
      let b = createVector(width/(num_trees+1)*(i+1), height - random(100, 200))
      trees[i].root.begin = a;
      trees[i].root.end = b;
      trees[i].traverse_and_update();
    }
    let a = createVector(width/(num_trees+1)*num_trees, height);
    let b = createVector(width/(num_trees+1)*num_trees, height - random(100, 200));
    let temp_root = new Branch(a, b);
    let temp_tree = new Tree(temp_root);
    print(round(random(0, palettes.length-1)))
    let rand_palette = palettes[round(random(0, palettes.length-1))]
    temp_tree.setPalette(rand_palette)

    trees.push(temp_tree);
    print(trees.length);
  }
  }

  palettes = [[color(72, 191, 132), color(72, 191, 132), color(255, 186, 215)],
              [color(122, 132, 80), color(122, 132, 80), color(203, 243, 210)],
              [color(76, 46, 5)   , color(76, 46, 5), color(183, 192, 238)]
            ];

  createCanvas(screen.width, screen.height-20);

//   //root for our tree
//   var a = createVector(width/2, height);
//   var b = createVector(width/2, height-200);
//   var root = new Branch(a, b);
// //brown: color(179, 89, 0)
//   tree = new Tree(root);
//   tree.setPalette(palettes[0]);

  //button to generate branch
  var generate_branch_button = createButton('generate branches!');
  generate_branch_button.mousePressed(generate_branch);

  //button to random insert
  var random_insert_button = createButton('random insert!');
  random_insert_button.mousePressed(random_insert);

  //checkbox to activate/deactive node_jitter
  var jitter_box = createCheckbox('jitter', false);
  jitter_box.changed(toggle_jitter);

  var spawn_tree_button = createButton('spawn a new tree');
  spawn_tree_button.mousePressed(spawn_tree);

  spawn_tree();
}


function draw() {
  background(100);

  trees.forEach(showTrees);
  function showTrees(item, index){item.show()};

  function jitterTrees(item, index){item.jitter()};
  if (jitter_trees) {trees.forEach(jitterTrees);}

}
