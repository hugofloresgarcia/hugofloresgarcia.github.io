function build_flower(center, theta, clr) {
    let shape;
    beginGeometry();
  
    // the petals
    let num_petals = 3;
    for (let i = 0; i < num_petals; i++) {
      push();
    //   translate(center.x, center.y, center.z);
      rotate(i * PI / (num_petals / 2) + theta);
      // fill(color);
      // each sphere should have slight variation in size and color
      fill(color_vary(clr, 5));
      stroke(color_vary(clr, 5));
      scale(1, 2, 1 + random(-0.1, 0.1));
      sphere(5);
      pop();
    }
  
    shape = endGeometry();
    return shape;
  }

  
class Flower {
    constructor(center, theta, clr) {
        this.center = center;
        this.theta = theta;
        this.clr = clr;
        this.geo = build_flower(center, theta, clr);
    }
}
