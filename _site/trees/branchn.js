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



    this.parent = null;
    // this.left = null;
    // this.right = null;

    this.maxChildren = round(random(3, 7));
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

  branch(angle) {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(angle + random(-angle/10, angle/10));
    dir.mult(this.amp + random(-this.amp/20, this.amp/20));

    var newEnd = p5.Vector.add(this.end, dir);
    var child = new Branch(this.end, newEnd);
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
    if (this.is_root()){this.width = this.maxWidth;}
    strokeWeight(this.width);
    stroke(this.color);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
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
    this.maxDepth = 0;
    this.palette = new TreePalette([color(255, 255, 255),
                                    color(255, 255, 255),
                                    color(255, 255, 255)]);
    this.node_amp_factor = 1.1;
    this.node_width_factor = 1.81;

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
  //   for (int i = 0; i < node.children.length() ; i++){
  //
  //   }
  // }

  height() {
    return this.node_height(this.root);
  }

  set_color(node){
    //color setting
    if (node.is_root()){node.color = this.palette.root}
    else if (node.is_leaf()) {node.color = this.palette.leaf; print(this.palette.leaf);}

    else {node.color = this.palette.branch}
  }

  set_params(node, depth){
    // parameters specific to level / depth
    node.amp = node.maxAmp / ((this.maxDepth-(depth-1))/this.maxDepth) /  this.node_amp_factor;
    node.width = node.maxWidth / ((this.maxDepth-(depth-1))/ this.maxDepth)/    this.node_width_factor;


    if (node.is_root()) {node.force = 0;}
    else {node.force += 1 / this.maxDepth*0.1;}
  }

  node_grow(node, depth){
    if (node.is_leaf(node)){
      this.set_params(node, depth);
      if (depth == 0) {
        return
      }
      // node.left = node.branch(-PI/4);
      // node.right= node.branch(PI/4);
      // node.left.parent = node;
      // node.right.parent = node;
      for (var i = 0; i < node.children.length; i++){
        let angle = PI/2/node.children.length * ((i+1)-Math.ceil(node.children.length)/2) - PI/2/2/node.children.length + random(-PI/8, PI/8);
        print(angle);
        node.children[i] = node.branch(angle);
        node.children[i].parent = node;

        this.set_color(node.children[i]);
      }
      depth -= 1;
      this.set_color(node);

    }

    for (var i = 0; i < node.children.length; i++){
      this.node_grow(node.children[i], depth);
    }

  }

  grow(depth){
    this.root.force = 0.1;
    this.node_grow(this.root, depth);
  }

  node_show(node){
    if (node == null){
      return
    } else {
      node.show();
      for (var i = 0; i < node.children.length; i++){
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
    // print(this.force);
    node.jitter();
    for (var i = 0; i < node.children.length; i++){
      this.node_jitter(node.children[i]);
    }
  }

  jitter(){
    this.node_jitter(this.root);
  }

}
