class Cloud extends MovableObject {
  x;
  y;
  widht = 720;
  height = 280;
  constructor(cloudImage) {
    super();
    this.loadImage(cloudImage);
    this.x = 0 + Math.random(this.x) * 300;
    this.y = 20;
    this.animation();
  }
}