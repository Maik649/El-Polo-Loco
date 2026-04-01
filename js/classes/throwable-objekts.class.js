/**
 * Throwable bottle projectile with gravity and splash behavior.
 */
class ThrowableObjekts extends MovableObject {
  x = 360;
  groundLevel = 320;
  acceleratio = 3;
  broken = false;
  markedForRemoval = false;
  throwInterval = null;
  SPLASH_IMAGE = "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png";

  /**
   * @param {number} x Spawn x position.
   * @param {number} y Spawn y position.
   * @param {boolean} otherDirection If true, projectile moves left.
   */
  constructor(x, y, otherDirection) {
    super().loadImage("./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",);
    this.loadeImages([this.SPLASH_IMAGE]);
    this.widht = 60;
    this.height = 80;
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
    this.speedY = 33;
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
   * @returns {void}
   */
  breakBottle() {
    if (this.broken) {return;}
    this.broken = true;
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