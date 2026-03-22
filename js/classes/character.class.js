class Character extends MovableObject {
  x = 100;
  y = 170;
  widht = 100;
  height = 250;

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

  JUMPIMAGE = [
    "./assets/img/2_character_pepe/3_jump/J-31.png",
    "./assets/img/2_character_pepe/3_jump/J-32.png",
    "./assets/img/2_character_pepe/3_jump/J-33.png",
    "./assets/img/2_character_pepe/3_jump/J-34.png",
    "./assets/img/2_character_pepe/3_jump/J-35.png",
    "./assets/img/2_character_pepe/3_jump/J-36.png",
    "./assets/img/2_character_pepe/3_jump/J-37.png",
    "./assets/img/2_character_pepe/3_jump/J-38.png",
    "./assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  // LONGIDELIMAGE = [
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
  //   "./assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  // ];
  
  //m;
  world;
  speed = 10;
  today;

  constructor() {
    super().loadImage("./assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadeImages(this.IDELIMAGE);
    this.loadeImages(this.WORKIMAGE);
    this.loadeImages(this.JUMPIMAGE);
    this.animation();
    this.applayGravity();

    //this.loadeImages(this.LONGIDELIMAGE);
    //this.clockUpdate();
  }

  animation() {

    setInterval(() => {
    if (this.world.kayboard.LEFT && this.x > 100) {
      this.x -= this.speed;
      //this.moveLeft();
      this.otherDirection = true;
    }

    if (this.world.kayboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.x += this.speed;
      //this.moveRight();
      this.otherDirection = false;
    }
     
      if (this.world.kayboard.UP && !this.isAboveGound()) {
        this.jump();
      };

      this.world.camara_x = -this.x + 100;
    
    }, 1000 / 60);

    setInterval(() => {
     this.playAnimation(this.IDELIMAGE);
    }, 250);

    setInterval(() => {
      
      if (this.isAboveGound()) {
        this.playAnimation(this.JUMPIMAGE);
      } else {
        if (this.world.kayboard.LEFT || this.world.kayboard.RIGHT) {
           this.playAnimation(this.WORKIMAGE);
        }
      }
    }, 150);
  }

  // setInterval(() => {
  //   if (!this.startTime) {
  //     let i = this.currentImage % this.LONGIDELIMAGE.length;
  //     let path = this.LONGIDELIMAGE[i];
  //     this.img = this.imageCache[path];
  //     this.currentImage++;
  //   }
  // }, 150);

  // clockUpdate() {
  //   setInterval(() => {
  //     this.today = new Date();
  //     this.startTime();
  //     this.s = this.today.getSeconds();
  //   }, 1000);
  // }

  // startTime() {
  //   if (this.s > this.currentClock) {
  //     //clearInterval(this.idelAnimaione);
  //     this.playAniemation(this.LONGIDELIMAGE);
  //     if (this.world.kayboard.RIGHT || this.world.kayboard.LEFT) {
  //     this.playAniemation(this.LONGIDELIMAGE);

  //      // clearInterval(this.logIdelAnimaione);
  //     }
  //   }
  //   console.log(this.s);
  // }

  // checkTime(i) {
  //   if (this.i < 60) {
  //     this.i = 0 + this.i;
  //   } // add zero in front of numbers < 10
  //   return i;
  // }
}
