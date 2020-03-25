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
    let tree = trees[idx];
    tree.grow(1);
    let a = tree.get_depth();
    print(a);
  }

  function random_insert(){
    for (let i = 0; i < 3 ; i++){
    idx = round(random(0, trees.length-1));
    let tree = trees[idx];
    tree.random_insert();
    let a = tree.get_depth();
    print(a);
    }
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
      let x_pos = width/(num_trees+1)*(i+1)
      x_pos = x_pos + random(-x_pos/10, x_pos/10);
      let a = createVector(x_pos, height);
      let b = createVector(x_pos, height - random(100, 200))
      trees[i].root.begin = a;
      trees[i].root.end = b;
      trees[i].traverse_and_update();
    }
    let x_pos = width/(num_trees+1)*num_trees;
    x_pos = x_pos + random(-x_pos/10, x_pos/10);
    let a = createVector(x_pos, height);
    let b = createVector(x_pos, height - random(100, 200));
    let temp_root = new Branch(a, b);
    let temp_tree = new Tree(temp_root);
    print(round(random(0, palettes.length-1)))
    let rand_palette = palettes[round(random(0, palettes.length-1))]
    temp_tree.setPalette(rand_palette)

    temp_tree.grow(1);

    trees.push(temp_tree);
    print(trees.length);
  }
  }

  function reset_forest(){
    trees = [];
    spawn_tree();
    spawn_tree();
    spawn_tree();
  }

  palettes = [[color(72, 191, 132), color(72, 191, 132), color(255, 186, 215)],
              [color(122, 132, 80), color(122, 132, 80), color(203, 243, 210)],
              [color(76, 46, 5)   , color(76, 46, 5), color(183, 192, 238)],
              [color("#99A58D"), color("#99A58D"), color("#5A2D3C")],
              [color("#F0E8BD"), color("#F0E8BD"), color("#FBED6B")],
              [color("#F0E8BD"), color("#F0E8BD"), color("#FA7557")],
              [color("#5F6117"), color("#5F6117"), color("#E67251")],
              [color("#8F7579"), color("#8F7579"), color("#60522A")],
              [color("#DFC692"), color("#DFC692"), color("#F1877E")],
            ];

  let img_height = 218;
  var canvas_end = screen.height - 180 - img_height;

  createCanvas(screen.width, canvas_end);

  let note_width, num_notes;
  note_width = 30;
  num_notes = width/note_width;
  num_octaves = round(num_notes / 12);
  print(num_octaves);
  start_note = 72 - 12 * Math.floor(num_octaves / 2)

  var synth = new Synth();
  var keyboard = new MIDIKeyboard(start_note, start_note+num_notes, 0, screen.height-180-img_height, 30, synth, random_insert);

  //button to generate branch
  var generate_branch_button = createButton('generate branches!');
  generate_branch_button.mousePressed(generate_branch);
  generate_branch_button.position(0, 0);

  //button to spawn a new tree
  var spawn_tree_button = createButton('spawn a new tree');
  spawn_tree_button.mousePressed(spawn_tree);
  spawn_tree_button.position(0, 40);

  //button to clear all trees
  var reset_forest_button = createButton('reset forest');
  reset_forest_button.mousePressed(reset_forest);
  reset_forest_button.position(0, 20);

  //checkbox to activate/deactive node jitter
  var jitter_box = createCheckbox('jitter', false);
  jitter_box.changed(toggle_jitter);
  jitter_box.position(0, 60);


  spawn_tree();
  spawn_tree();
  spawn_tree();
}




function draw() {
  background(100);



  trees.forEach(showTrees);
  function showTrees(item, index){item.show()};

  function jitterTrees(item, index){item.jitter()};
  if (jitter_trees) {trees.forEach(jitterTrees);}

}
