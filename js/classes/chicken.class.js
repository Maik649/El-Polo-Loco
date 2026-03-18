class Chicken extends MovableObject {
  x;
  y = 330;
  widht = 70;
  height = 145;
  
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
    this.x = 500 + Math.random(this.x) * 500;
    this.animation();
    this.moveLeft(this.speed);
  }
  animation() {
    setInterval(() => {
      let i = this.currentImage % this.WORKIMAGE.length;
      let path = this.WORKIMAGE[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 200);
  }
}
