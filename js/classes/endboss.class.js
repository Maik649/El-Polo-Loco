class Endboss extends MovableObject {
  x;
  y = 140;
  widht = 170;
  height = 345;

  // speed = 0.1 + Math.random(this.x) * 0.25;
  WORKIMAGE = [
    "./assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  constructor() {
    super().loadImage(this.WORKIMAGE[0]);
    this.loadeImages(this.WORKIMAGE);
    this.x = 1650 + Math.random(this.x) * 500;
    this.animation();
    // this.moveLeft(this.speed);
  }

  animation() {
    setInterval(() => {
      this.playAniemation(this.WORKIMAGE);
    }, 200);
  }
}