/**
 * Base movable object with physics, health and collision helpers.
 */
class MovableObject extends DrawableObjekt {
  x = 780;
  y = 200;
  groundLevel = 180;
  currentImage = 0;
  speed = 0.015;
  speedY = 0;
  acceleratio = 1.6;
  otherDirection = false;
  energy = 100;
  lastHit = 0;

  /**
   * Plays a frame-based animation from a list of images.
   * @param {string[]} Images Animation frames.
   * @returns {void}
   */
  playAnimation(Images) {
    let i = this.currentImage % Images.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  };

  /**
   * Applies left/right movement based on keyboard input.
   * @returns {void}
   */
  isWork() {
    const soundManager = this.world?.soundManager;
    let isMoving = false;

    if (this.world.kayboard.LEFT && this.x > 100) {
      this.moveLeft();
      this.otherDirection = true;
      isMoving = true;
    };

    if (this.world.kayboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      isMoving = true;
    };

    if (isMoving) {
      soundManager?.playRun();
      return;
    }

    soundManager?.stopRun();
  };

  /**
   * Moves this object to the left based on current speed.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  };

  /**
   * Moves this object to the right based on current speed.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  };

  /**
   * Triggers an upward jump impulse.
   * @param {number} [jumpStrength=15] Initial vertical velocity.
   * @returns {void}
   */
  jump(jumpStrength = 16) {
    if (this.isAboveGound()) {
      return;
    }

    this.speedY = jumpStrength;
  };

  /**
   * Random jump helper for AI-driven entities.
   * @param {number} chance Random chance between 0 and 1.
   * @param {number} [jumpStrength=10] Initial vertical velocity.
   * @returns {void}
   */
  tryRandomJump(chance, jumpStrength = 10) {
    if (!this.isAboveGound() && Math.random() < chance) {
      this.jump(jumpStrength);
    }
  };

  /**
   * Applies default damage.
   * @returns {void}
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  };

  /**
   * @returns {boolean} True if energy reached zero.
   */
  isDead() {
    return this.energy == 0;
  };

  /**
   * @returns {boolean} True while hurt window is active.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  };

  /**
   * Starts gravity simulation loop.
   * @returns {void}
   */
  applayGravity() {
    setInterval(() => {
      if (this.isAboveGound() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleratio;

        if (this.y >= this.groundLevel && this.speedY <= 0) {
          this.y = this.groundLevel;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  };

  /**
   * @returns {boolean} True if object is above ground level.
   */
  isAboveGound() {
    return this.y < this.groundLevel;
  };

  /**
   * Plays idle animation frames.
   * @param {string[]} Images Idle frame list.
   * @returns {void}
   */
  playAnimationIdel(Images) {
    let i = this.currentImage % this.IDELIMAGE.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  };

  /**
   * Axis-aligned bounding-box collision with optional hitbox offsets.
   * @param {MovableObject} mo Other movable object.
   * @returns {boolean}
   */
  isColliding(mo) {
    const aLeft   = this.x      + (this.offset?.left  || 0);
    const aRight  = this.x      + this.widht  - (this.offset?.right  || 0);
    const aTop    = this.y      + (this.offset?.top   || 0);
    const aBottom = this.y      + this.height - (this.offset?.bottom || 0);

    const bLeft   = mo.x   + (mo.offset?.left  || 0);
    const bRight  = mo.x   + mo.widht  - (mo.offset?.right  || 0);
    const bTop    = mo.y   + (mo.offset?.top   || 0);
    const bBottom = mo.y   + mo.height - (mo.offset?.bottom || 0);

    return aRight > bLeft && aBottom > bTop && aLeft < bRight && aTop < bBottom;
  };
}
