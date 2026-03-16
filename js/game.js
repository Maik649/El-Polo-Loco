let canvas;
let world;
let kayboard = new Kayboard();
function init() {
  canvas = document.getElementById("gameCanvas");
  world = new World(canvas, kayboard);
}

window.addEventListener("keydown", (e) => {
  console.log(e.keyCode);

  if (e.keyCode === 39) {
    kayboard.LEFT = true;
  }
  if (e.keyCode === 37) {
    kayboard.RIGHT = true;
  }
  if (e.keyCode === 38) {
    kayboard.DOWN = true;
  }
  if (e.keyCode === 40) {
    kayboard.UP = true;
  }
  if (e.keyCode === 32) {
    kayboard.SPACE = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 39) {
    kayboard.LEFT = false;
  }
  if (e.keyCode === 37) {
    kayboard.RIGHT = false;
  }
  if (e.keyCode === 38) {
    kayboard.DOWN = false;
  }
  if (e.keyCode === 40) {
    kayboard.UP = false;
  }
  if (e.keyCode === 32) {
    kayboard.SPACE = false;
  }
});
