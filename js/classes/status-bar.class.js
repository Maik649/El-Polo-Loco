/**
 * Generic status bar class for health, bottles, coins and endboss health.
 */
class StatusBar extends DrawableObjekt {
  imageSet;
  /**
   * @param {"health"|"endboss"|"bottle"|"coins"} type Status bar type.
   * @param {number} x Horizontal canvas position.
   * @param {number} y Vertical canvas position.
   */
  constructor(type, x, y) {
    super();
    if (type === "health") {
      this.initHealthBar(x, y);
    } else if (type === "endboss") {
      this.initEndbossBar(x, y);
    } else if (type === "bottle") {
      this.initBottleBar(x, y);
    } else {
      this.initCoinsBar(x, y);
    }
  }

  persenttage = 100;

  STATUSBARCOINSIMAGE = [
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
  ];

  STATUSBARENDBOSSIMAGE = [
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  STATUSBARHEALTHIMAGE = [
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  STATUSBARBOTTLKEIMAGE = [
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
  ];

  initHealthBar(x, y) {
    this.imageSet = this.STATUSBARHEALTHIMAGE;
    this.loadeImages(this.imageSet);
    this.x = x;
    this.y = y;
    this.widht = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  initEndbossBar(x, y) {
    this.imageSet = this.STATUSBARENDBOSSIMAGE;
    this.loadeImages(this.imageSet);
    this.x = x;
    this.y = y;
    this.widht = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  initBottleBar(x, y) {
    this.imageSet = this.STATUSBARBOTTLKEIMAGE;
    this.loadeImages(this.imageSet);
    this.x = x;
    this.y = y;
    this.widht = 200;
    this.height = 50;
    this.setPercentageBottel(0);
  }

  initCoinsBar(x, y) {
    this.imageSet = this.STATUSBARCOINSIMAGE;
    this.loadeImages(this.imageSet);
    this.x = x;
    this.y = y;
    this.widht = 200;
    this.height = 50;
    this.setPercentageBottel(0);
  }

  /**
   * Sets percentage with standard fill direction.
   * @param {number} persenttage Value between 0 and 100.
   * @returns {void}
   */
  setPercentage(persenttage) {
    this.persenttage = persenttage;
    let path = this.imageSet[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Sets percentage with reversed fill direction.
   * @param {number} persenttage Value between 0 and 100.
   * @returns {void}
   */
  setPercentageBottel(persenttage) {
    this.persenttage = persenttage;
    let path = this.imageSet[this.resolveImageIndex_1()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.persenttage == 100 ) {
      return 5;
    } else if (this.persenttage > 80) {
      return 4;
    } else if (this.persenttage > 60) {
      return 3;
    } else if (this.persenttage > 40) {
      return 2;
    } else if (this.persenttage > 20) {
      return 1;
    } else {
      return 0;
    }
  }

  resolveImageIndex_1() {
   
    if (this.persenttage == 0) {
      return 5; 
    } else if (this.persenttage <= 20) {
      return 4; 
    } else if (this.persenttage <= 40) {
      return 3; 
    } else if (this.persenttage <= 60) {
      return 2; 
    } else if (this.persenttage <= 80) {
      return 1;
    } else {
      return 0;
    }
  }
}