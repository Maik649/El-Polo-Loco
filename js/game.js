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
let speakerIcon = { x: 0, y: 0, width: 40, height: 40 };
let musicMuted = false;

function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Position des Fullscreen-Icons relativ zum Canvas festlegen
  fullscreenIcon.x = canvas.width - fullscreenIcon.width - 20;
  fullscreenIcon.y = 35;

  // Speaker-Icon links neben dem Fullscreen-Icon
  speakerIcon.x = fullscreenIcon.x - speakerIcon.width - 10;
  speakerIcon.y = fullscreenIcon.y;

  showStartScreen();

  initMobileControls();

  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    if (
      clickX >= speakerIcon.x &&
      clickX <= speakerIcon.x + speakerIcon.width &&
      clickY >= speakerIcon.y &&
      clickY <= speakerIcon.y + speakerIcon.height
    ) {
      toggleMusic();
      return;
    }
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

function bindControlButton(buttonId, onPress, onRelease) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  const start = (event) => {
    event.preventDefault();
    onPress();
  };

  const end = (event) => {
    event.preventDefault();
    onRelease();
  };

  button.addEventListener("touchstart", start);
  button.addEventListener("touchend", end);
  button.addEventListener("touchcancel", end);
  button.addEventListener("mousedown", start);
  button.addEventListener("mouseup", end);
  button.addEventListener("mouseleave", end);
}

function initMobileControls() {
  bindControlButton(
    "btn-left",
    () => (kayboard.LEFT = true),
    () => (kayboard.LEFT = false),
  );
  bindControlButton(
    "btn-right",
    () => (kayboard.RIGHT = true),
    () => (kayboard.RIGHT = false),
  );
  bindControlButton(
    "btn-jump",
    () => (kayboard.SPACE = true),
    () => (kayboard.SPACE = false),
  );
  bindControlButton(
    "btn-throw",
    () => (kayboard.D = true),
    () => (kayboard.D = false),
  );

  gameAudio = new Audio("./assets/audios/mixkit-game-level-music-689.wav");
  gameAudio.loop = true;
}

function startGame() {
  gameStarted = true;
  gameOver = false;
  world = new World(canvas, kayboard);
  if (!musicMuted) {
    gameAudio.play();
  }
}

function restartGame() {
  gameStarted = false;
  gameOver = false;
  world = null;
  showStartScreen();
}

gameAudio = new Audio("./assets/audios/mixkit-game-level-music-689.wav");
function showStartScreen() {
  const startImage = new Image();
  startImage.src = "./assets/img/9_intro_outro_screens/start/startscreen_1.png";
  startImage.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawFullscreenIcon();
     drawSpeakerIcon();
  };
}

function drawStartButton() {
  ctx.fillStyle = "rgba(122, 122, 122, 0.6)";
  drawRoundedRect(
    startButton.x,
    startButton.y,
    startButton.width,
    startButton.height,
    8,
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "START",
    startButton.x + startButton.width / 2,
    startButton.y + startButton.height / 2,
  );
}

function drawRestartButton() {
  ctx.fillStyle = "rgba(196, 196, 196, 0.6)";
  drawRoundedRect(
    restartButton.x,
    restartButton.y,
    restartButton.width,
    restartButton.height,
    8,
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "NOCHMAL",
    restartButton.x + restartButton.width / 2,
    restartButton.y + restartButton.height / 2,
  );
}

function drawSpeakerIcon() {
  const { x, y, width, height } = speakerIcon;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  drawRoundedRect(x, y, width, height, 6);
  ctx.font = `${Math.floor(height * 0.65)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#333333";
  ctx.fillText(musicMuted ? "🔇" : "🔊", x + width / 2, y + height / 2);
  ctx.restore();
}

function toggleMusic() {
  musicMuted = !musicMuted;
  if (musicMuted) {
    gameAudio.pause();
  } else if (gameStarted) {
    gameAudio.play();
  }
}


function drawFullscreenIconBackground() {
  const { x, y, width, height, backround } = fullscreenIcon;
  const radius = 6;
  ctx.fillStyle = backround || "#ffffff";
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

function drawFullscreenIcon() {
  if (!fullscreenImage) {
    fullscreenImage = new Image();
    fullscreenImage.src =
      "./assets/img/9_intro_outro_screens/start/full-screen-icon-11806.png";
    fullscreenImage.onload = () => {
      drawFullscreenIconBackground();
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

function checkOrientation() {
  const overlay = document.getElementById("orientationOverlay");
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  if (isLandscape) {
    console.log("Querformat (Landscape)");
    if (overlay) {
      overlay.style.display = "none";
    }
  } else {
    console.log("Hochformat (Portrait)");
    if (overlay) {
      overlay.style.display = "flex";
    }
  }
}

checkOrientation();
window.addEventListener("resize", checkOrientation);

function toggleFullscreen() {
  const elem = document.getElementById("gameContainer");

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
  gameAudio.pause();
  const image = new Image();
  image.src = "./assets/img/You won, you lost/You Win A.png";
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawRestartButton();
     drawSpeakerIcon();
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
