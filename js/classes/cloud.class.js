class Cloud extends MovableObject {
  x;
  y = 0;
  widht = 720;
  height = 280;
  speed = 0.1 + Math.random(this.x) * 0.35;

  constructor(imagePath) {
    super().loadImage(imagePath);
    this.x = Math.random(this.x) * 500;
    this.animation();
  }
  animation() {
    this.moveLeft(this.speed);
  }
}