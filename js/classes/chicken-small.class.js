/**
 * Small chicken enemy variant with different size and jump behavior.
 */
class ChickenSmall extends MovableObject {
  x;
  y = 400;
  groundLevel = 400;
  widht = 60;
  height = 40;
  offset = { top: 3, bottom: 3, left: 5, right: 5 };
  dead = false;
  speed = 0.1 + Math.random(this.x) * 0.45;
  WORKIMAGE = [
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  DEADIMAGE = "./assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  /**
   * Loads sprites, randomizes spawn position and starts animation.
   */
  constructor() {
    super().loadImage(
      "./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    );
    this.loadeImages(this.WORKIMAGE);
    this.loadeImages([this.DEADIMAGE]);
    this.x = 500 + Math.random(this.x) * 500;
    this.applayGravity();
    this.animation();
  }

  /**
   * Starts movement and animation loops for the enemy.
   * @returns {void}
   */
  animation() {
    setInterval(() => {
      if (!this.dead) {
        this.moveLeft(this.speed);
        this.tryRandomJump(0.006, 10);
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.dead) {
        this.playAnimation(this.WORKIMAGE);
      }
    }, 200);
  }

  /**
   * Switches the small chicken into dead state.
   * @returns {void}
   */
  die() {
    this.dead = true;
    this.speed = 0;
    this.img = this.imageCache[this.DEADIMAGE];
  }
}
