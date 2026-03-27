let canvas;
let ctx;
let world;
let kayboard = new Kayboard();
let gameStarted = false;
let startButton = { x: 260, y: 320, width: 200, height: 60 };
let gameOver = false;
let restartButton = { x: 260, y: 320, width: 200, height: 60 };
let fullscreenIcon = { x: 0, y: 0, width: 40, height: 40 };
let fullscreenImage = null;

function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Position des Fullscreen-Icons relativ zum Canvas festlegen
  fullscreenIcon.x = canvas.width - fullscreenIcon.width - 20;
  fullscreenIcon.y = 20;

  showStartScreen();

  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Zuerst prüfen, ob auf das Fullscreen-Icon geklickt wurde
    if (
      clickX >= fullscreenIcon.x &&
      clickX <= fullscreenIcon.x + fullscreenIcon.width &&
      clickY >= fullscreenIcon.y &&
      clickY <= fullscreenIcon.y + fullscreenIcon.height
    ) {
      toggleFullscreen();
      return;
    }

    if (!gameStarted && !gameOver) {
      if (
        clickX >= startButton.x &&
        clickX <= startButton.x + startButton.width &&
        clickY >= startButton.y &&
        clickY <= startButton.y + startButton.height
      ) {
        startGame();
      }
    } else if (gameOver) {
      if (
        clickX >= restartButton.x &&
        clickX <= restartButton.x + restartButton.width &&
        clickY >= restartButton.y &&
        clickY <= restartButton.y + restartButton.height
      ) {
        restartGame();
      }
    }
  });
}

function startGame() {
  gameStarted = true;
  gameOver = false;
  world = new World(canvas, kayboard);
}

function restartGame() {
  gameStarted = false;
  gameOver = false;
  world = null;
  showStartScreen();
}

function showStartScreen() {
  const startImage = new Image();
  startImage.src = "./assets/img/9_intro_outro_screens/start/startscreen_1.png";
  startImage.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawFullscreenIcon();
  };
}

function drawStartButton() {
  ctx.fillStyle = "rgba(122, 122, 122, 0.6)";
  drawRoundedRect(startButton.x, startButton.y, startButton.width, startButton.height, 8);

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("START", startButton.x + startButton.width / 2, startButton.y + startButton.height / 2);
}

function drawRestartButton() {
  ctx.fillStyle = "rgba(196, 196, 196, 0.6)";
  drawRoundedRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height, 8);

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NOCHMAL", restartButton.x + restartButton.width / 2, restartButton.y + restartButton.height / 2);
}

function drawFullscreenIcon() {
  if (!fullscreenImage) {
    fullscreenImage = new Image();
    fullscreenImage.src = "./assets/img/9_intro_outro_screens/start/full-screen-icon-11806.png";
    fullscreenImage.onload = () => {
      ctx.drawImage(
        fullscreenImage,
        fullscreenIcon.x,
        fullscreenIcon.y,
        fullscreenIcon.width,
        fullscreenIcon.height,
      );
    };
  } else {
    ctx.drawImage(
      fullscreenImage,
      fullscreenIcon.x,
      fullscreenIcon.y,
      fullscreenIcon.width,
      fullscreenIcon.height,
    );
  }
}

function toggleFullscreen() {
  const elem = canvas;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function showWinScreen() {
  gameStarted = false;
  gameOver = true;
  const image = new Image();
  image.src = "./assets/img/You won, you lost/You Win A.png";
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawRestartButton();
  };
}

function showGameOverScreen() {
  gameStarted = false;
  gameOver = true;

  const image = new Image();
  image.src = "./assets/img/9_intro_outro_screens/game_over/game over.png";
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawRestartButton();
  };
}

function showNoBottlesScreen() {
  gameStarted = false;
  gameOver = true;

  const image = new Image();
  image.src = "./assets/img/You won, you lost/You lost.png";
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawRestartButton();
  };
}

window.addEventListener("keydown", (e) => {
  console.log(e.keyCode);
  
  if (e.keyCode === 37) {
    kayboard.LEFT = true;
  }
  if (e.keyCode === 39) {
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

  if (e.keyCode === 68) {
    kayboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 37) {
    kayboard.LEFT = false;
  }
  if (e.keyCode === 39) {
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
  if (e.keyCode === 68) {
    kayboard.D = false;
  }
});
