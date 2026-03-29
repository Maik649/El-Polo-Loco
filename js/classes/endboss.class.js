class Endboss extends MovableObject {
  x;
  y = 140;
  widht = 170;
  height = 345;
  energy = 100;
  speed = 1;
  activated = false;
  patrolLeft;
  patrolRight;
  movingLeft = true;
  damage = 25;

  HURTIMAGE = [
    "./assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  DEADIMAGE = [
    "./assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  IDELIMAGE = [
    "./assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  WORKIMAGE = [
    "./assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  constructor() {
    super().loadImage(this.IDELIMAGE[0]);
    this.loadeImages(this.IDELIMAGE);
    this.loadeImages(this.WORKIMAGE);
    this.loadeImages(this.HURTIMAGE);
    this.loadeImages(this.DEADIMAGE);
    this.x = 1400 + Math.random(this.x) * 500;
    this.animation();
    this.patrolLeft = this.x - 200;
    this.patrolRight = this.x + 200;
  }

  animation() {
    setInterval(() => {
      if (this.isDead()) {
        this.updateMovement() == false
        this.playAnimation(this.DEADIMAGE);
      } else if (this.isHurt()) {
        this.playAnimation(this.HURTIMAGE);
      } else if (this.activated) {
        this.playAnimation(this.WORKIMAGE);
      } else {
        this.playAnimationIdel(this.IDELIMAGE);
      }
    }, 200);
  }

  updateMovement() {
    if (!this.activated) {
      return;
    }

    if (this.movingLeft) {
      this.moveLeft();
      this.otherDirection = false;
      if (this.x <= this.patrolLeft) {
        this.movingLeft = false;
      }
    } else {
      this.moveRight();
      this.otherDirection = true;
      if (this.x >= this.patrolRight) {
        this.movingLeft = true;
      }
    }
  }

  hit() {
    this.energy -= this.damage;
    if (this.energy < 0) {
      this.energy = 0;
    }
    if (this.energy > 0) {
      this.lastHit = new Date().getTime();
    }
  }
}