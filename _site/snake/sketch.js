// THIS IS THE MAIN FILE
// The following stuff happens here:
// setup() is called once
// draw() is called in a loop;
// keyPressed() is always checking for key presses and sends a keyCode variable

let game; // where we will store our game
// let block_size = (window.innerWidth>window.innerHeight ? window.innerHeight : window.innerWidth )/12; // size of the block (in pixels)
let block_size = 60;
const canvas_dim = {x: block_size*12, y: block_size*12} //canvas dimensions

let speed_slider;

function setup() {
  createCanvas(canvas_dim.x, canvas_dim.y); //create a canvas (where we draw on top)
  game = new Game(block_size, canvas_dim); // create a game object

  speed_slider = createSlider(1, 3000, 1);
  speed_slider.position(canvas_dim.x+150,canvas_dim.y/2 + 120 )
  createButton('speed').position(canvas_dim.x+10, canvas_dim.y/2+120)

  lrn_rate = createSlider(1, 100, 85);
  lrn_rate.position(canvas_dim.x+150,canvas_dim.y/2 + 150 )
  createButton('learning rate').position(canvas_dim.x+10, canvas_dim.y/2+150)

  randomization = createSlider(1, 100, 5);
  randomization.position(canvas_dim.x+150,canvas_dim.y/2 + 180 )
  createButton('randomization').position(canvas_dim.x+10, canvas_dim.y/2+180)
}



function draw() {
  // put drawing code here
  frameRate(10); // restrict game speed
  background(19); // black bg

  for(let i = 0 ; i < speed_slider.value(); i++) game.update(); // update everything in the game

  game.draw();
  if (game.player == 'q_learner') {
    game.q_learner.show_scoreboard(canvas_dim.x -canvas_dim.x/25*5, 10);
    game.q_learner.randomness = randomization.value()/100;
    game.q_learner.learning_rate = lrn_rate.value()/100;
  }
}


function keyPressed(){
  return game.set_keyboard_control(keyCode); // send keypresses so game is controlled
}
