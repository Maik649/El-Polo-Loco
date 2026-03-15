class Character extends MovableObject {
  x = 20;
  y = 190;
  widht = 80;
  height = 290;
  // idelImages = [
  //   "../assets/img/2_character_pepe/1_idle/idle/I-1.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-2.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-3.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-6.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-7.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-8.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-9.png",
  //   "../assets/img/2_character_pepe/1_idle/idle/I-10.png",
  // ];
  constructor(idelImage) {
    super().loadImage("../assets/img/2_character_pepe/1_idle/idle/I-1.png");
  }
  // idel() {
  //   for (let i = 0; i < idelImages.length; i++) {
  //    idelImage = idelImages[i];
  //     idelImage;
  //   }
  // }
  jump() {}
}