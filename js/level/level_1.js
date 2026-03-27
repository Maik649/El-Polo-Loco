 
function createLevel1() {
  return new Level(

    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Endboss(),
    ],

    [
      new Cloud("./assets/img/5_background/layers/4_clouds/1.png"),
      new Cloud("./assets/img/5_background/layers/4_clouds/1.png"),
      new Cloud("./assets/img/5_background/layers/4_clouds/2.png"),
    ],
    [
      new BackroundObjekt("./assets/img/5_background/layers/air.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/air.png", 719),
      new BackroundObjekt("./assets/img/5_background/layers/air.png", 719 * 2),
      new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/1.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/1.png", 719),
      new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/2.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/2.png", 719),
      new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/2.png", 719 * 2),
      new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/1.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/1.png", 719),
      new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/2.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/2.png", 720),
      new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/2.png", 719 * 2),
      new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/1.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/1.png", 719),
      new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/1.png", 719 * 2),
      new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/2.png", 0),
      new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/2.png", 720),
      new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/2.png", 719 * 2),
    ]
  );
}

// Optionale globale Instanz, falls irgendwo noch direkt "level_1" verwendet wird
const level_1 = createLevel1();