class StatusBar extends DrawableObjekt {
  imageSet;
  constructor(type, x, y) {
    super();

    if (type === "coins") {
      this.imageSet = this.STATUSBARCOINSIMAGE;
    } else {
      this.imageSet = this.STATUSBARHEALTHIMAGE;
    }

    this.loadeImages(this.imageSet);

    this.x = x;
    this.y = y;
    this.widht = 200; 
    this.height = 50;

    this.setPercentage(100);
  }

  persenttage = 100;

  STATUSBARCOINSIMAGE = [
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  STATUSBARHEALTHIMAGE = [
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  setPercentage(persenttage) {
    this.persenttage = persenttage;
    let path = this.imageSet[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.persenttage == 100) {
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
}