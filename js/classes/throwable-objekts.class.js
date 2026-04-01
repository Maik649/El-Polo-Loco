/**
 * Throwable bottle projectile with gravity and splash behavior.
 */
class ThrowableObjekts extends MovableObject {
  x = 365;
  groundLevel = 365;
  acceleratio = 2.5;
  broken = false;
  markedForRemoval = false;
  throwInterval = null;
  onBreak = null;
  SPLASH_IMAGE = "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png";

  /**
   * @param {number} x Spawn x position.
   * @param {number} y Spawn y position.
   * @param {boolean} otherDirection If true, projectile moves left.
   * @param {Function|null} [onBreak=null] Optional callback triggered when the bottle breaks.
   */
  constructor(x, y, otherDirection, onBreak = null) {
    super().loadImage("./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",);
    this.loadeImages([this.SPLASH_IMAGE]);
    this.widht = 60;
    this.height = 80;
    this.onBreak = onBreak;
    this.trow(x, y, otherDirection);
  }

  /**
   * Starts projectile movement and gravity.
   * @param {number} x Spawn x position.
   * @param {number} y Spawn y position.
   * @param {boolean} otherDirection If true, projectile moves left.
   * @returns {void}
   */
  trow(x, y, otherDirection) {
    this.x = x;
    this.y = y;
    this.speedY = 25;
    this.otherDirection = otherDirection;
    this.applayGravity();
    this.throwInterval = setInterval(() => {
      if (this.broken) { return;}
      this.x += this.otherDirection ? -8 : 8;
      if (this.hasHitGround()) {this.breakBottle();}
    }, 1000 / 60);
  }

  /**
   * @returns {boolean} True when the bottle reached ground after the throw.
   */
  hasHitGround() {
    return this.y >= this.groundLevel && this.speedY <= 0;
  }

  /**
   * Switches bottle into splash state and schedules removal.
   * @param {boolean} [playBreakSound=true] Whether break callback sound should be played.
   * @returns {void}
   */
  breakBottle(playBreakSound = true) {
    if (this.broken) {return;}
    this.broken = true;
    if (playBreakSound && typeof this.onBreak === "function") {
      this.onBreak();
    }
    this.speedY = 0;
    this.y = this.groundLevel;
    this.img = this.imageCache[this.SPLASH_IMAGE];
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
      this.throwInterval = null;
    }
    setTimeout(() => {this.markedForRemoval = true;}, 180);
  }

  /**
   * Clears active throw interval if present.
   * @returns {void}
   */
  dispose() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
      this.throwInterval = null;
    }
  }
}