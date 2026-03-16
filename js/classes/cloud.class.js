class Cloud extends MovableObject {
  y = 50;
  widht = 500;
  height = 280;
  speed = 0.25;
  constructor() {
    super().loadImage(
      "../assets/img/5_background/layers/4_clouds/1.png",
      "../assets/img/5_background/layers/4_clouds/2.png",
    );
    this.x = Math.random(this.x) * 500;
    this.animation();
  }
  animation() {
    this.moveLeft(this.speed);
  }
}