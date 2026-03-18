class Character extends MovableObject {
  x = 100;
  y = 180;
  widht = 100;
  height = 300;

  IDELIMAGE = [
    "./assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  WORKIMAGE = [
    "./assets/img/2_character_pepe/2_walk/W-21.png",
    "./assets/img/2_character_pepe/2_walk/W-22.png",
    "./assets/img/2_character_pepe/2_walk/W-23.png",
    "./assets/img/2_character_pepe/2_walk/W-24.png",
    "./assets/img/2_character_pepe/2_walk/W-25.png",
    "./assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  world;
  otherDirection = false;
  speed = 1;
  
  constructor() {
    super().loadImage("./assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadeImages(this.IDELIMAGE);
    this.loadeImages(this.WORKIMAGE);
    this.animation();
  }

  animation() {
    setInterval(() => {
      if (this.world.kayboard.RIGHT) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if (this.world.kayboard.LEFT) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      ((this.world.camara_x = -this.x), 0);
    }, 1000 / 60);

    setInterval(() => {
      let i = this.currentImage % this.IDELIMAGE.length;
      let path = this.IDELIMAGE[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 200);

    setInterval(() => {
      if (this.world.kayboard.RIGHT || this.world.kayboard.LEFT) {
        let i = this.currentImage % this.WORKIMAGE.length;
        let path = this.WORKIMAGE[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
  }
}
