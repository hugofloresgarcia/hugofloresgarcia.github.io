var startTime = new Date();


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

    this.maxChildren = round(random(5, 7));
    this.children = new Array(this.maxChildren).fill(null);
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
    }
    else {
      line(this.begin.x, this.begin.y, this.end.x, this.end.y);
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
    this.maxDepth = 5;
    this.palette = new TreePalette([color(255, 255, 255),
                                    color(255, 255, 255),
                                    color(255, 255, 255)]);

    this.angle_deviation = PI/8;
    this.node_amp_factor = 0.8;
    this.node_width_factor = 0.8;

  }

  setPalette(paletteArray){
    this.palette = new TreePalette(paletteArray);
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
    else {node.force += 1 / this.maxDepth*0.1;}
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

  // random_node_insert(node){
  //   if (node == null){return}
  //   if (node.is_leaf() && node.depth <= this.maxDepth){
  //     if (node.depth >= this.maxDepth) {
  //       return
  //     }
  //
  //    let temp_color = color(255, 0, 0);
  //
  //    let new_color = color(0, 0, 0);
  //    new_color.setRed(red(node.color));
  //    new_color.setGreen(green(node.color));
  //    new_color.setBlue(blue(node.color));
  //
  //     node.color = temp_color;
  //     node.show();
  //
  //     this.set_params(node, node.depth);
  //     for (let i = 0; i < node.maxChildren; i++){
  //       let angle = PI/2/node.maxChildren * ((i+1)-Math.ceil(node.maxChildren)/2) - PI/2/2/node.maxChildren + random(-this.angle_deviation, this.angle_deviation);
  //       node.children[i] = node.branch(angle);
  //       this.set_color(node.children[i]);
  //     }
  //     print("node depth: " + node.depth);
  //   }
  //
  //   let i = round(random(0, node.maxChildren));
  //   this.random_node_insert(node.children[i]);
  //   this.set_color(node);
  // }

 random_node_insert(node){
    // access a random node
    //debug
    if (node == null){
      return
    }
    else {
      // let temp_color = color(255, 0, 0);
      //
      // let new_color = color(0, 0, 0);
      // new_color.setRed(red(node.color));
      // new_color.setGreen(green(node.color));
      // new_color.setBlue(blue(node.color));
      //
      // node.color = temp_color;
      // node.show();
      //access a random child
      let i = round(random(0, node.maxChildren)); //index for a randomly picked child

      //if the random child is empty, create a leaf
      if (node.children[i] == null){
        let angle = PI/2/node.maxChildren * ((i+1)-Math.ceil(node.maxChildren)/2) - PI/2/2/node.maxChildren + random(-this.angle_deviation, this.angle_deviation);
        node.children[i] = node.branch(angle);
        node.children[i].parent = node;
        this.set_params(node);
        this.set_params(node.children[i]);
        this.set_color(node);
        this.set_color(node.children[i]);


      }
      else {
        node.children[i].show();
        if (node.children[i].depth <= this.maxDepth){
          this.random_node_insert(node.children[i]);
        }
        else {
          this.random_node_insert(this.root);
        }
      }

    }
  }

  random_insert(){
    this.random_node_insert(this.root);
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
    node.jitter();
    for (var i = 0; i < node.maxChildren; i++){
      this.node_jitter(node.children[i]);
    }
  }

  jitter(){
    this.node_jitter(this.root);
  }

}
