var startTime = new Date();


class Branch
{
  constructor(begin, end) {
    this.begin = begin;
    this.end = end;
    this.amp = 1;
    this.force = 0.1;

    this.color = color(255, 255, 255);

    this.parent = null;
    this.left = null;
    this.right = null;
  }

  is_root(node){
    if (this.parent == null){
      return true;
    } else  { return false; }
  }

  is_leaf(node){
    if(this.left == null && this.right == null){
      return true;
    }
    else {return false;}
  }

  branch(angle, amp) {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(angle);
    dir.mult(this.amp);

    var newEnd = p5.Vector.add(this.end, dir);
    var right = new Branch(this.end, newEnd);
    return right;
  }

  // use a force between 0 and 1
  jitter(){
    // print(this.force);s
    var endTime = new Date();
    var timeElapsed = endTime - startTime;
    var xNoise = noise(timeElapsed * this.force/10) * round(random(-1, 1));
    var yNoise = noise(timeElapsed * this.force/10) * round(random(-1, 1));
    this.end.x += xNoise / 2;
    this.end.y += 0.11 * yNoise;
  }

  show() {
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
    this.maxDepth = 0;
    this.palette = new TreePalette([color(255, 255, 255),
                                    color(255, 255, 255),
                                    color(255, 255, 255)])
  }

  setPalette(paletteArray){
    this.palette = new TreePalette(paletteArray);
    print("root color");
    print(this.palette.root);
    print("branch color");
    print(this.palette.branch);
    print("leaf color");
    print(this.palette.leaf);
  }

  sayhi() {
    print("HI")
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

  height() {
    return this.node_height(this.root);
  }

  node_grow(node, depth){
    if (node.is_leaf()){
      if (depth == 0) {
        return
      }

      // parameters specific to level / depth
      node.amp = node.amp / sqrt(2);
      node.force += 1 / this.maxDepth*0.1;

      //color setting
      if (node.is_root()){node.color = this.palette.root}
      else if (node.is_leaf()) {node.color = this.palette.leaf}
      else {node.color = this.palette.branch}

      // print(node.force);

      node.left = node.branch(-PI/4);
      node.right= node.branch(PI/4);
      node.left.parent = node;
      node.right.parent = node;

      depth -= 1;
    }
    this.node_grow(node.left, depth);
    this.node_grow(node.right, depth);
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
    this.node_show(node.left);
    this.node_show(node.right);
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
    this.node_jitter(node.left);
    this.node_jitter(node.right);
  }

  jitter(){
    this.node_jitter(this.root);
  }

}
