class Chicken extends MovableObject {
  x;
  y = 380;
  widht = 120;
  height = 80;
  
  speed = 0.10  + Math.random(this.x) * 0.45;
  WORKIMAGE = [
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  constructor() {
    super().loadImage(
      "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.loadeImages(this.WORKIMAGE);
    this.x = 1000 + Math.random(this.x) * 500;
    this.animation();
  }
  animation() {
    setInterval(() => {
      this.moveLeft(this.speed);
      this.otherDirection = false;
    }, 1000/60)
    setInterval(() => {
      this.playAniemation(this.WORKIMAGE);
    }, 200);
  }
}
