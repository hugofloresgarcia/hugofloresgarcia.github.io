var startTime = new Date();

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

///
/// #todo:
/// @Daniel: right now, the lines (branches) are drawing immediately,
/// so the growth process looks unnatural. Help me fix that.
/// This function, (draw_line_slowly) receives two inputs: a start point and an
/// end point. Fix the code inside so the line draws bit by bit, instead of all at once.
function draw_line_slowly(start_point, end_point){
  //Bonus: I'll give u weed when u get here if you figure out a way to add a third input to the function: a speed parameter
  //Good luck!

  //HINT: point variables can unpack into x and y like This.
  let x_coordinate = start_point.x;
  let y_coordinate = start_point.y;

  // step_size = 5;
  // num_steps = round((end_point.y - start_point.y) / step_size);
  //
  // for (let i = 0; i < num_steps ; i++){
  //   line(start_point.x + step_size * (i),
  //        start_point.y + step_size * (i),
  //        start_point.x + step_size * (i + 1),
  //        start_point.y + step_size * (i + 1));
  // }

  //this is too fast. maybe you can draw tiny lines and sleep(milliseconds) in between?
  line(start_point.x, start_point.y, end_point.x, end_point.y);
}


/// lifes comes, life goes

class Branch
{
  constructor(begin, end) {
    this.begin = begin;
    this.end = end;
    this.amp = 0.8;
    this.maxAmp = this.amp;
    this.force = 0.1;
    this.width = 20;
    this.maxWidth = this.width;
    this.color = color(255, 255, 255);

    this.ellipseHeight = 0;

    this.parent = null;

    this.depth = 0;

    this.maxChildren = round(random(9,11));
    this.children = [];
    this.children_full = false;
  }



  is_root(){
    if (this.parent == null){
      return true;
    } else  { return false; }
  }

  // is_leaf(node){
  //   if(this.left == null && this.right == null ){
  //     return true;
  //   }
  //   else {return false;}
  // }
  update(){
    //update position
    if (!this.is_root()){
      let parent = this.parent;
      let translation = p5.Vector.sub(parent.end, this.begin);

      this.begin = parent.end;
      this.end = p5.Vector.add(this.end, translation);
    }
  }

  is_leaf(){
    var result = true;
    for (var i = 0; i < this.children.length; i++){
      if (this.children[i] == null)
      {result = result && true}
      else
      {result = result && false;}
    }
    return result;
  }

  has_empty_spots(){
    var result = true;
    for (var i = 0; i < this.children.length; i++){
      if (this.children[i] == null)
      {result = result || true}
      else
      {result = result || false;}
    }
    return result;
  }

  branch(angle) {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(angle + random(-angle/10, angle/10));
    dir.mult(this.amp + random(-this.amp/4, this.amp/4));

    var newEnd = p5.Vector.add(this.end, dir);
    var child = new Branch(this.end, newEnd);
    child.depth = this.depth + 1;
    child.parent = this;

    //the child will only have child vector, temporarily
    //the parent, however, unlocks its full potential
    this.children.push(child);

    if (this.children.length == this.maxChildren){
      this.children_full = true;
    }

    child.children = [null];

    return child;
  }


  // use a force between 0 and 1
  jitter(){
    var endTime = new Date();
    var timeElapsed = endTime - startTime;
    var xNoise = noise(timeElapsed * this.force/10) * round(random(-4, 4)) * this.force;
    var yNoise = noise(timeElapsed * this.force/10) * round(random(-4, 4)) * this.force;
    this.end.x += xNoise ;
    this.end.y += yNoise;
  }

  show() {
    strokeWeight(this.width);
    stroke(this.color);
    fill(this.color);
    if (this.is_root()){
      this.width = this.maxWidth;
      line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    }
    else if (this.is_leaf()){
      stroke(this.parent.color);
      // strokeWeight(this.width * 0.95);
      line(this.begin.x, this.begin.y, this.end.x, this.end.y);

      stroke(this.color);
      strokeWeight(this.maxWidth);
      ellipse(this.end.x, this.end.y, this.ellipseHeight, this.ellipseHeight);
      ellipse(this.begin.x, this.begin.y, this.ellipseHeight, this.ellipseHeight);
    }
    else {
      draw_line_slowly(this.begin, this.end);
    }
  }

};

class TreePalette {
  constructor(paletteArray){
    this.root = paletteArray[0];
    this.branch = paletteArray[1];
    this.leaf = paletteArray[2];
  }
}

class Tree {
  constructor(root){
    this.root = root;
    this.left_height = 0;
    this.right_height = 0;
    this.height = 0;
    this.maxDepth = 2;
    this.palette = new TreePalette([color(255, 255, 255),
                                    color(255, 255, 255),
                                    color(255, 255, 255)]);

    this.angle_deviation = PI/8;
    this.node_amp_factor = 0.8;
    this.node_width_factor = 0.8;

  }

  setPalette(paletteArray){
    this.palette = new TreePalette(paletteArray);
    this.root.color = this.palette.root;
  }


  node_height(node) {
    if (node == null){
      return -1;
    }

    this.left_height = this.node_height(node.left);
    this.right_height = this.node_height(node.right);

    if (this.left_height > this.right_height){return this.left_height + 1;}
    else {return this.right_height + 1;}
  }

  // node_height(node){
  //   if (node == null){
  //     return -1;
  //   }
  //   for (int i = 0; i < node.maxChildren() ; i++){
  //
  //   }
  // }

  height() {
    return this.node_height(this.root);
  }

  set_color(node){
    //color setting
    //create a random shade based on the base color, to a certain depth
    function rand_shade(base_color, depth){
      let new_color = color(0, 0, 0);
      let randomN = random(-depth, depth);
      new_color.setRed(red(base_color) + randomN);
      new_color.setGreen(green(base_color) + randomN);
      new_color.setBlue(blue(base_color)+  randomN);
      return new_color;
    }

    if (node == null){ return}
    else if (node.is_root()){node.color = rand_shade(this.palette.root, 30);}
    else if (node.is_leaf()) {node.color = rand_shade(this.palette.leaf, 30);}
    else { node.color = rand_shade(this.palette.branch, 15);}
  }

  set_params(node){
    // parameters specific to level / depth
    node.amp = node.maxAmp /
               (node.depth+1)/
               this.node_amp_factor;

    node.width = node.maxWidth / (node.depth+1) /  this.node_width_factor;

    if (node.is_leaf()){
      node.ellipseHeight = random(3, 12);
    }
    else {
      node.ellipseHeight = 0;
    }

    if (node.is_root()) {node.force = 0;}
    else {node.force += 1 / this.maxDepth * 1;}
  }

  node_grow(node, depth){
    if (node == null){return}
    if (node.is_leaf() && node.depth <= this.maxDepth){
      if (depth == 0) {
        return
      }
      this.set_params(node);
      for (var i = 0; i < node.maxChildren; i++){
        let angle = PI/2/node.maxChildren * ((i+1)-Math.ceil(node.maxChildren)/2) - PI/2/2/node.maxChildren + random(-this.angle_deviation, this.angle_deviation);
        node.children[i] = node.branch(angle);
        node.children[i].parent = node;
        this.set_color(node.children[i]);
        this.set_params(node.children[i]);
      }
      depth -= 1;
      print("node depth: " + node.depth);
    }

    for (var i = 0; i < node.maxChildren; i++){
      this.node_grow(node.children[i], depth);
    }
    this.set_color(node);
  }

  grow(depth){
    this.root.force = 0.1;
    this.set_color(this.root);
    this.node_grow(this.root, depth);
  }


 random_node_insert(node){
    // access a random node
    //debug
    if (node == null){
      return
    }
    else {
      // if the node is not a leaf, check to see if all of its children are full
        // if it has available children spots, create a new child
        if (!node.children_full){
          let i = round(random(0, node.maxChildren)); //index for a randomly picked child
          let angle = PI/2/node.maxChildren * ((i+1)-Math.ceil(node.maxChildren)/2) - PI/2/2/node.maxChildren + random(-this.angle_deviation, this.angle_deviation);
          node.children[i] = node.branch(angle);
          node.children[i].parent = node;
          this.set_params(node);
          this.set_params(node.children[i]);
          this.set_color(node);
          this.set_color(node.children[i]);
        }
        else { //, just access a random child
          let i = round(random(0, node.maxChildren)); //index for a randomly picked child
          this.random_node_insert(node.children[i]);
        }

    }
  }

  random_insert(){
    this.random_node_insert(this.root);
  }

  node_traverse_and_update(node){
    if (node != null) {
      node.update();
      if (!node.is_leaf()){
        for (let i = 0; i < node.maxChildren ; i++){
            this.node_traverse_and_update(node.children[i]);
        }
      }
    }
    else {
      return;
    }
  }

  traverse_and_update(){
    this.node_traverse_and_update(this.root);
  }

  node_get_depth(node){
    if (node == null){
      return -1;
    }
    else{
      for (let i = 0; i < node.maxChildren ; i++){
          return 1 + this.node_get_depth(node.children[i]);
      }
    }
  }

  get_depth(){
    let depth = this.node_get_depth(this.root);
    return depth;
  }

  node_show(node){
    if (node == null){
      return
    } else {
      node.show();
      for (var i = 0; i < node.maxChildren; i++){
        this.node_show(node.children[i]);
      }
    }
  }

  show() {
    this.node_show(this.root);
  }

  node_jitter(node){
    if (node == null){
      return
    }
    if (node.is_leaf()){
        node.jitter();
    }
    for (var i = 0; i < node.maxChildren; i++){
      this.node_jitter(node.children[i]);
    }
  }

  jitter(){
    this.node_jitter(this.root);
  }

}

// class tallTree extends Tree {
//
//   constructor(root){
//     super.constructor(root);
//     root.amp = 0.8;
//     root.maxAmp = this.amp;
//     root.force = 0.1;
//     root.width = 20;
//     root.maxWidth = this.width;
//     root.color = color(255, 255, 255);
//
//     this.angle_deviation = PI/8;
//     this.node_amp_factor = 0.8;
//     this.node_width_factor = 0.8;
//   }
// }
