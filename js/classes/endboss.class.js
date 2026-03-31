/**
 * Endboss enemy with patrol movement, hurt/dead states and activation logic.
 */
class Endboss extends MovableObject {
  x;
  y = 140;
  widht = 170;
  height = 315;
  offset = { top: 60, bottom: 10, left: 25, right: 25 };
  energy = 100;
  speed = 1;
  defaultSpeed = 1;
  attackSpeed = 2.5;
  attackModeDuration = 2500;
  attackModeTimeout = null;
  activated = false;
  chasingCharacter = false;
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
  ATTACKIMAGE = [
    "./assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /**
   * Loads all endboss sprites and initializes patrol area.
   */
  constructor() {
    super().loadImage(this.IDELIMAGE[0]);
    this.loadeImages(this.IDELIMAGE);
    this.loadeImages(this.WORKIMAGE);
    this.loadeImages(this.ATTACKIMAGE);
    this.loadeImages(this.HURTIMAGE);
    this.loadeImages(this.DEADIMAGE);
    this.x = 1400 + Math.random(this.x) * 500;
    this.animation();
    this.patrolLeft = this.x - 200;
    this.patrolRight = this.x + 200;
  }

  /**
   * Handles visual state animation for dead, hurt, active and idle states.
   * @returns {void}
   */
  animation() {
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.DEADIMAGE);
      } else if (this.isHurt()) {
        this.playAnimation(this.HURTIMAGE);
      } else if (this.chasingCharacter) {
        this.playAnimation(this.ATTACKIMAGE);
      } else if (this.activated) {
        this.playAnimation(this.WORKIMAGE);
      } else {
        this.playAnimationIdel(this.IDELIMAGE);
      }
    }, 200);
  }

  /**
   * Updates horizontal patrol movement while the boss is alive and activated.
   * @returns {void}
   */
  updateMovement(characterX) {
    if (this.isDead() || !this.activated) {return;}

    if (this.chasingCharacter && typeof characterX === "number") {
      this.speed = this.attackSpeed;
      if (this.x > characterX) {
        this.moveLeft();
        this.otherDirection = false;
      } else {
        this.moveRight();
        this.otherDirection = true;
      }
      return;
    }
    this.setAttakMove();
  }

  /**
   *  Set Attak Move
   * @returns 
   */
  setAttakMove() {
    this.speed = this.defaultSpeed;
    if (this.movingLeft) {
      this.moveLeft();
      this.otherDirection = false;
      if (this.x <= this.patrolLeft) {this.movingLeft = false;}
    } else {
      this.moveRight();
      this.otherDirection = true;
      if (this.x >= this.patrolRight) {this.movingLeft = true;}
    }}

  /**
   *  Start Attak Mode
   * @returns 
   */
  startAttackMode() {
    if (this.isDead()) {return;}
    this.activated = true;
    this.chasingCharacter = true;

    if (this.attackModeTimeout) {
      clearTimeout(this.attackModeTimeout);
    }

    this.attackModeTimeout = setTimeout(() => {
      this.chasingCharacter = false;
      this.attackModeTimeout = null;
    }, this.attackModeDuration);
  }

  /**
   * Applies damage to the endboss.
   * @returns {void}
   */
  hit() {
    this.energy -= this.damage;
    if (this.energy < 0) {this.energy = 0;}
    if (this.energy > 0) {this.lastHit = new Date().getTime();}
  }
}