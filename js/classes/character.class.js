class Character extends MovableObject {
  x = 100;
  y = 170;
  widht = 100;
  height = 250;
  workingAudio = new Audio(
    "./assets/audios/freesound_community-running-1-6846.mp3",
  );

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

  LONGIDELIMAGE = [
    "./assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  DEATIMAGE = [
    "./assets/img/2_character_pepe/5_dead/D-51.png",
    "./assets/img/2_character_pepe/5_dead/D-52.png",
    "./assets/img/2_character_pepe/5_dead/D-53.png",
    "./assets/img/2_character_pepe/5_dead/D-54.png",
    "./assets/img/2_character_pepe/5_dead/D-55.png",
    "./assets/img/2_character_pepe/5_dead/D-56.png",
    "./assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  HURTIMAGE = [
    "./assets/img/2_character_pepe/4_hurt/H-41.png",
    "./assets/img/2_character_pepe/4_hurt/H-42.png",
    "./assets/img/2_character_pepe/4_hurt/H-43.png",
  ];
  currentClock = 0;
  world;
  speed = 10;

  constructor() {
    super().loadImage("./assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadeImages(this.IDELIMAGE);
    this.loadeImages(this.LONGIDELIMAGE);
    this.loadeImages(this.WORKIMAGE);
    this.loadeImages(this.JUMPIMAGE);
    this.loadeImages(this.DEATIMAGE);
    this.loadeImages(this.HURTIMAGE);
    this.animation();
    this.applayGravity();
  }

  animation() {
    setInterval(() => {
      this.workingAudio.pause();
      this.isWork();

      if (this.world.kayboard.UP && !this.isAboveGound()) {
        this.jump();
      }
      this.world.camara_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.currentClock < 30) {
        this.playAnimation(this.IDELIMAGE);
        this.currentClock++;
      } else {
        if (
          this.world.kayboard.LEFT ||
          this.world.kayboard.RIGHT ||
          this.world.kayboard.UP
        ) {
          this.playAnimation(this.WORKIMAGE);
          this.currentClock = 0;
        }
        this.playAnimation(this.LONGIDELIMAGE);
      }
    }, 250);

    setInterval(() => {


      if (this.isDead()) {
        this.playAnimation(this.DEATIMAGE);
      } else if (this.isHurt()) {
        this.playAnimation(this.HURTIMAGE);
      }else if (this.isAboveGound()) {
        this.playAnimation(this.JUMPIMAGE);
      } else {
        if (this.world.kayboard.LEFT || this.world.kayboard.RIGHT) {
          this.playAnimation(this.WORKIMAGE);
        }
      }
    }, 150);
  }
}
