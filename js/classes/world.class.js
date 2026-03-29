class World {
  character = new Character();
  level;
  canvas;
  ctx;
  kayboard;
  camara_x = 0;
  gameOver = false;
  statusBarCoins = new StatusBar("coins", 20, 20);
  statusBarHealt = new StatusBar("health", 20, 60);
  statusBarBottle = new StatusBar("bottle", 20, 100);
  statusBarEndboss = new StatusBar("endboss", 500, 20);

  throwableobjekts = [];

  bottle = [
    new CollectebillObjekts(300, 360),
    new CollectebillObjekts(600, 360),
    new CollectebillObjekts(900, 360),
    new CollectebillObjekts(1200, 360),
    new CollectebillObjekts(1500, 360),
  ];
  bottlesCollected = 0;

  constructor(canvas, kayboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.kayboard = kayboard;

    if (typeof createLevel1 === "function") {
      this.level = createLevel1();
    } else {
      this.level = level_1;
    }
    this.draw();
    this.setWorld();
    this.checkCollisons();
    this.run();
  }

  draw() {
    if (this.gameOver) {
      return;
    }
    this.setDraw();
    this.ctx.translate(-this.camara_x, 0);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarHealt);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    this.run();

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }

  setDraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camara_x, 0);
    this.addObjekts(this.level.backrounds);
    this.addObjekts(this.level.enemies);
    this.addObjekts(this.level.clouds);
    this.addObjekts(this.throwableobjekts);
    this.addObjekts(this.bottle);
    this.addToMap(this.character);
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    this.checkCollisons();
    this.checkThowableObjeks();
    this.updateThrowableObjekts();
    this.checkEndbossMovement();
    this.checkNoBottlesLose();
  }

  updateThrowableObjekts() {
    for (let i = this.throwableobjekts.length - 1; i >= 0; i--) {
      const bottle = this.throwableobjekts[i];

      if (!bottle.broken && bottle.hasHitGround()) {
        bottle.breakBottle();
      }

      if (bottle.markedForRemoval) {
        if (typeof bottle.dispose === "function") {
          bottle.dispose();
        }
        this.throwableobjekts.splice(i, 1);
      }
    }
  }

  checkThowableObjeks() {
    if (this.kayboard.D && this.bottlesCollected > 0) {
      const offsetX = this.character.otherDirection ? -50 : 50;
      const startX = this.character.x + offsetX;
      const startY = this.character.y + 50;

      const bottle = new ThrowableObjekts(
        startX, startY,
        this.character.otherDirection,
      );

      this.throwableobjekts.push(bottle);
      this.bottlesCollected--;
      const percentage = Math.min(this.bottlesCollected * 20, 100);
      this.statusBarBottle.setPercentageBottel(percentage);
      this.kayboard.D = false;
    }
  }

  checkCollisons() {
    this.handleEnemyCollisions();

    this.bottle.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.bottle.splice(index, 1);
        this.bottlesCollected++;
        const percentage = Math.min(this.bottlesCollected * 20, 100);
        this.statusBarBottle.setPercentageBottel(percentage);
      }
    });

    this.handleBottleHitsOnEndboss();
  }

  handleEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy)) {
        return;
      }

      this.handleCharacterEnemyCollision(enemy);
    });
  }

  handleCharacterEnemyCollision(enemy) {
    const chickenEnemy = this.isChickenEnemy(enemy);

    if (chickenEnemy && enemy.dead) {
      return;
    }

    if (chickenEnemy && this.isStompFromTop(enemy)) {
      enemy.die();
      return;
    }

    this.handleCharacterHitByEnemy();
  }

  isChickenEnemy(enemy) {
    return enemy instanceof Chicken || enemy instanceof ChickenSmall;
  }

  isStompFromTop(enemy) {
    const characterBottom = this.character.y + this.character.height;
    const enemyTop = enemy.y;

    return (
      this.character.speedY < 0 &&
      characterBottom <= enemyTop + enemy.height / 2
    );
  }

  handleCharacterHitByEnemy() {
    if (this.character.isHurt()) {
      return;
    }

    this.character.hit();
    this.statusBarHealt.setPercentage(this.character.energy);

    setTimeout(() => {
      if (
        this.character.isDead() &&
        !this.gameOver &&
        typeof showGameOverScreen === "function"
      ) {
        this.gameOver = true;
        showGameOverScreen();
      }
    }, 2000);
  }

  handleBottleHitsOnEndboss() {
    this.throwableobjekts.forEach((bottle, index) => {
      this.level.enemies.forEach((enemy) => {
        if (!(enemy instanceof Endboss) || !bottle.isColliding(enemy)) {
          return;
        }

        this.handleSingleBottleHit(enemy, bottle, index);
      });
    });
  }

  handleSingleBottleHit(enemy, bottle, index) {
    enemy.hit(10);

    if (typeof bottle.dispose === "function") {
      bottle.dispose();
    }

    this.throwableobjekts.splice(index, 1);
    this.statusBarEndboss.setPercentage(enemy.energy);
    this.triggerWinScreenIfNeeded(enemy);
  }

  triggerWinScreenIfNeeded(enemy) {
    if (
      !enemy.isDead() ||
      this.gameOver ||
      typeof showWinScreen !== "function"
    ) {
      return;
    }

    setTimeout(() => {
      if (this.gameOver) {
        return;
      }

      this.gameOver = true;
      showWinScreen();
    }, 2500);
  }

  checkEndbossMovement() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        const distance = Math.abs(this.character.x - enemy.x);
        if (distance < 450) {
          enemy.activated = true;
        }
        enemy.updateMovement();
      }
    });
  }

  checkNoBottlesLose() {
    if (
      this.bottlesCollected === 0 &&
      this.bottle.length === 0 &&
      typeof showNoBottlesScreen === "function"
    ) {
      setTimeout(() => {
        if (this.gameOver) {
          return;
        }

        let endbossStillAlive = false;
        this.level.enemies.forEach((enemy) => {
          if (enemy instanceof Endboss && !enemy.isDead()) {
            endbossStillAlive = true;
          }
        });

        if (endbossStillAlive) {
          this.gameOver = true;
          showNoBottlesScreen();
        }
      }, 2500);
    }
  }

  addObjekts(objekts) {
    objekts.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draws(this.ctx);
    mo.drawsFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.widht, 0, mo.x, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
