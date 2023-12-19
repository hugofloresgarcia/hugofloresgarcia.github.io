// todo: cool thing that sloop said
// - backgroiund noises like bird
// and a low chord with a vibrato that is subtole
// and day / night thingies
// each note has a specific COLOR

p5.disableFriendlyErrors = true;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var jitter_trees = false;
var use_keyboard = true;
var use_midi = false;
var tree;
var trees = [];
var absolute_max_depth = 5;
var palettes = [];
var absolute_max_trees = 7;
var leaf_midi_list;
// function generate_branch(){
//   if (tree.maxDepth <= absolute_max_depth){
//   tree.grow(1);
//   }
// }




function random_insert(){
  for (let i = 0; i < 3 ; i++){
  idx = round(random(0, trees.length-1));
  let tree = trees[idx];
  tree.random_insert();
  let a = tree.get_depth();
  print(a);
  }
}


function setup() {
  function generate_branch(){
    idx = round(random(0, trees.length-1));
    let tree = trees[idx];
    tree.grow(1);
    let a = tree.get_depth();
    print(a);
  }



  function toggle_jitter(){
    if (this.checked()){
      jitter_trees = true;
    } else {
      jitter_trees = false;
    }
  }

  function toggle_keyboard(){
    if (this.checked()){
      use_keyboard = true;
    } else {
      use_keyboard = false;
    }
  }

  function toggle_midi(){
    if (this.checked()){
      use_midi = true;
    } else {
      use_midi = false;
    }
  }

  function spawn_tree(){
    if (trees.length < absolute_max_trees){
    let num_trees = trees.length + 1;

    for (let i = 0 ; i < trees.length ; i++){
      let x_pos = width/(num_trees+1)*(i+1)
      x_pos = x_pos + random(-x_pos/10, x_pos/10);
      let a = createVector(x_pos, height);
      let b = createVector(x_pos, height - random(100, 150))
      trees[i].root.begin = a;
      trees[i].root.end = b;
      trees[i].traverse_and_update();
    }
    let x_pos = width/(num_trees+1)*num_trees;
    x_pos = x_pos + random(-x_pos/10, x_pos/10);
    let a = createVector(x_pos, height);
    let b = createVector(x_pos, height - random(50, 150));
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
              [color("#5F6117"), color("#5F6117"), color("#FBED6B")],
              [color("#5F6117"), color("#5F6117"), color("#FA7557")],
              [color("#5F6117"), color("#5F6117"), color("#E67251")],
              [color("#8F7579"), color("#8F7579"), color("#60522A")],
              [color("#DFC692"), color("#DFC692"), color("#F1877E")],
              [color("#3F556E"), color("#3F556E"), color("#F1877E")],
              [color("#3F556E"), color("#3F556E"), color("#59484F")],
              [color("#3F556E"), color("#3F556E"), color("#CC5543")],
              [color("#3F556E"), color("#3F556E"), color("#DBE6AF")],
              [color("#3F556E"), color("#3F556E"), color("#CC5543")],
              [color("#3F556E"), color("#3F556E"), color("#455C4F")],
            ];

  let img_height = 218;
  var canvas_end = window.innerHeight  - img_height;

  createCanvas(window.innerWidth, canvas_end);

  let note_width, num_notes;
  note_width = 30;
  num_notes = width/note_width - 1;
  num_octaves = round(num_notes / 12);
  print(num_octaves);
  start_note = 72 - 12 * Math.floor(num_octaves / 2);

  if (start_note < 0) {start_note = 0;};
  if (num_notes > 127) {num_notes = 127;};

  var synth = new Synth();
  var keyboard = new MIDIKeyboard(start_note, start_note+num_notes, 0, window.innerHeight-img_height, 30, synth, random_insert);

  let button_size = 40;
  //button to generate branch
  var generate_branch_button = createButton('generate branches!');
  generate_branch_button.mousePressed(generate_branch);
  generate_branch_button.position(0, button_size * 0);

  //button to spawn a new tree
  var spawn_tree_button = createButton('spawn a new tree');
  spawn_tree_button.mousePressed(spawn_tree);
  spawn_tree_button.position(0, button_size * 1);

  //button to clear all trees
  var reset_forest_button = createButton('reset forest');
  reset_forest_button.mousePressed(reset_forest);
  reset_forest_button.position(0, button_size * 2);

  //checkbox to activate/deactive node jitter
  var jitter_box = createCheckbox('jitter', false);
  jitter_box.changed(toggle_jitter);
  jitter_box.position(0, button_size * 3);

  var use_keyboard_box = createCheckbox("use keyboard", true);
  use_keyboard_box.changed(toggle_keyboard);
  use_keyboard_box.position(0, button_size * 4);

  var use_midi_box = createCheckbox("use midi", false);
  use_midi_box.changed(toggle_midi);
  use_midi_box.position(0, button_size * 5);

  spawn_tree();
  spawn_tree();
  spawn_tree();
}

function draw() {
  background("#F3EDC5");
  // background("#6D7696")

  trees.forEach(showTrees);
  function showTrees(item, index){item.show()};

  function jitterTrees(item, index){item.jitter()};
  if (jitter_trees) {trees.forEach(jitterTrees);}

  if (use_midi) {setup_midi();}

}

function keyPressed(){
    if (use_keyboard){
      let midinote = 0;
      if      (key ==  "a"){midinote = 60;}
      else if (key ==  "w"){midinote = 61;}
      else if (key ==  "s"){midinote = 62;}
      else if (key ==  "e"){midinote = 63;}
      else if (key ==  "d"){midinote = 64;}
      else if (key ==  "f"){midinote = 65;}
      else if (key ==  "t"){midinote = 66;}
      else if (key ==  "g"){midinote = 67;}
      else if (key ==  "y"){midinote = 68;}
      else if (key ==  "h"){midinote = 69;}
      else if (key ==  "u"){midinote = 70;}
      else if (key ==  "j"){midinote = 71;}
      else if (key ==  "k"){midinote = 72;}
      else if (key ==  "o"){midinote = 73;}
      else if (key ==  "l"){midinote = 74;}
      else if (key ==  "p"){midinote = 75;}
      else if (key ==  ";"){midinote = 76;}
      else if (key == "\'"){midinote = 77;}
      else {return}
      let synth = new Synth();
      synth.play(midinote);
      random_insert();
  }

  return false;
}

function setup_midi(){
  navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);

  function onMIDIFailure() {
      console.log('Could not access your MIDI devices.');
  }

  function onMIDISuccess(midiAccess) {
      for (var input of midiAccess.inputs.values()) {
          input.onmidimessage = getMIDIMessage;
      }
  }

  function getMIDIMessage(message) {
      var command = message.data[0];
      var note = message.data[1];
      var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

      switch (command) {
          case 144: // noteOn
              if (velocity > 0) {

                  let synth = new Synth();
                  synth.play(note);
                  random_insert();
                  sleep(200);
              } else {
                  // noteOff(note);
                  break;
              }
              break;
          case 128: // noteOff
              // noteOff(note);
              break;
          // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
      }
  }
}
