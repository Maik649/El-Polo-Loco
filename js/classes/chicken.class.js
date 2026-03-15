class Chicken extends MovableObject {
  x;
  y = 330;
  widht = 70;
  height = 145;

  constructor() {
      super().loadImage("../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 200 + Math.random(this.x) * 500;
    //this.animation()
    }
}
