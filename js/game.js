let canvas;
let ctx;
let world;
let kayboard = new Kayboard();
let gameStarted = false;
let startButton = { x: 260, y: 410, width: 200, height: 60 };
let gameOver = false;
let restartButton = { x: 260, y: 410, width: 200, height: 60 };
let fullscreenIcon = { x: 0, y: 0, width: 40, height: 40 };
let fullscreenImage = null;
let speakerIcon = { x: 0, y: 0, width: 40, height: 40 };
let musicMuted = false;
let gameAudio = null;
let gameOverAudio = null;
let winAudio = null;
let gameWon = false;
let noBottlesLost = false;
let noBottlesAudio = null;

function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  initGameAudio();
  initGameOverAudio();
  initWinAudio();
  initNoBottlesAudio();

  // Position des Fullscreen-Icons relativ zum Canvas festlegen
  fullscreenIcon.x = canvas.width - fullscreenIcon.width - 20;
  fullscreenIcon.y = 35;

  // Speaker-Icon links neben dem Fullscreen-Icon
  speakerIcon.x = fullscreenIcon.x - speakerIcon.width - 10;
  speakerIcon.y = fullscreenIcon.y;

  showStartScreen();

  initMobileControls();

  canvas.addEventListener("click", handleCanvasClick);
}

function handleCanvasClick(event) {
  const clickPosition = getCanvasClickPosition(event);

  if (handleTopIconClick(clickPosition)) {
    return;
  }

  handleScreenButtonClick(clickPosition);
}

function getCanvasClickPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function isInsideRect(position, rect) {
  return (
    position.x >= rect.x &&
    position.x <= rect.x + rect.width &&
    position.y >= rect.y &&
    position.y <= rect.y + rect.height
  );
}

function handleTopIconClick(clickPosition) {
  if (isInsideRect(clickPosition, speakerIcon)) {
    toggleMusic();
    return true;
  }

  if (isInsideRect(clickPosition, fullscreenIcon)) {
    toggleFullscreen();
    return true;
  }

  return false;
}

function handleScreenButtonClick(clickPosition) {
  if (!gameStarted && !gameOver && isInsideRect(clickPosition, startButton)) {
    startGame();
    return;
  }

  if (gameOver && isInsideRect(clickPosition, restartButton)) {
    restartGame();
  }
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
  bindControlButton("btn-left",() => (kayboard.LEFT = true),() => (kayboard.LEFT = false),);
  bindControlButton("btn-right",() => (kayboard.RIGHT = true),() => (kayboard.RIGHT = false),);
  bindControlButton("btn-jump",() => (kayboard.SPACE = true),() => (kayboard.SPACE = false),);
  bindControlButton("btn-throw",() => (kayboard.D = true),() => (kayboard.D = false),);
}

function initGameAudio() {
  if (gameAudio) {
    return;
  }

  gameAudio = new Audio("./assets/audios/mixkit-game-level-music-689.wav");
  gameAudio.loop = true;
  gameAudio.volume = 0.25;
  gameAudio.preload = "auto";
}

function initGameOverAudio() {
  if (gameOverAudio) {
    return;
  }

  gameOverAudio = new Audio("./assets/audios/universfield-game-over-deep-male-voice-clip-352695.mp3");
  gameOverAudio.volume = 0.25;
  gameOverAudio.preload = "auto";
}

function initWinAudio() {
  if (winAudio) {
    return;
  }

  winAudio = new Audio("./assets/audios/we-ve-got-a-winner-carnival-speaker-voice-dan-barracuda-1-00-02.mp3");
  winAudio.volume = 0.25;
  winAudio.preload = "auto";
}

function initNoBottlesAudio() {
  if (noBottlesAudio) {
    return;
  }

  noBottlesAudio = new Audio("./assets/audios/fail-male-taunt-wah-wah-wah-trumpet-gfx-sounds-1-00-04.mp3");
  noBottlesAudio.volume = 0.25;
  noBottlesAudio.preload = "auto";
}

function tryPlayGameAudio() {
  if (!gameAudio || musicMuted) {
    return;
  }

  const playPromise = gameAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("Audio playback blocked or failed:", error);
    });
  }
}

function tryPlayGameOverAudio() {
  if (!gameOverAudio || musicMuted) {
    return;
  }

  gameOverAudio.currentTime = 0;
  const playPromise = gameOverAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("Game-over audio playback blocked or failed:", error);
    });
  }
}

function tryPlayWinAudio() {
  if (!winAudio || musicMuted) {
    return;
  }

  winAudio.currentTime = 0;
  const playPromise = winAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("Win audio playback blocked or failed:", error);
    });
  }
}

function tryPlayNoBottlesAudio() {
  if (!noBottlesAudio || musicMuted) {
    return;
  }

  noBottlesAudio.currentTime = 0;
  const playPromise = noBottlesAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("No-bottles audio playback blocked or failed:", error);
    });
  }
}

function stopAudio(audio) {
  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
}

function startGame() {
  gameStarted = true;
  gameOver = false;
  gameWon = false;
  noBottlesLost = false;
  world = new World(canvas, kayboard);
  stopAudio(gameOverAudio);
  stopAudio(winAudio);
  stopAudio(noBottlesAudio);
  tryPlayGameAudio();
}

function restartGame() {
  gameStarted = false;
  gameOver = false;
  gameWon = false;
  noBottlesLost = false;
  world = null;
  stopAudio(gameOverAudio);
  stopAudio(winAudio);
  stopAudio(noBottlesAudio);
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
    drawSpeakerIcon();
    tryPlayGameAudio();
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
  ctx.fillText("START",startButton.x + startButton.width / 2,startButton.y + startButton.height / 2,);
}

function drawRestartButton() {
  ctx.fillStyle = "rgba(196, 196, 196, 0.6)";
  drawRoundedRect(restartButton.x,restartButton.y,restartButton.width,restartButton.height,8,);

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NOCHMAL",restartButton.x + restartButton.width / 2,restartButton.y + restartButton.height / 2,);
}

function drawSpeakerIcon() {
  const { x, y, width, height } = speakerIcon;
  const centerY = y + height / 2;

  ctx.save();
  ctx.fillStyle = "#E0F2F7";
  drawRoundedRect(x, y, width, height, 6);
  drawSpeakerBody(x, centerY);
  drawSpeakerState(x, y, width, height, centerY);
  ctx.restore();
}

function drawSpeakerBody(x, centerY) {
  const speakerLeft = x + 8;
  const speakerBodyW = 7;
  const speakerBodyH = 12;
  // Speaker body
  ctx.fillStyle = "#7c7b7b";
  ctx.fillRect(speakerLeft, centerY - speakerBodyH / 2,speakerBodyW,speakerBodyH,);

  // Speaker cone
  ctx.beginPath();
  ctx.moveTo(speakerLeft + speakerBodyW, centerY - 6);
  ctx.lineTo(speakerLeft + speakerBodyW + 8, centerY - 10);
  ctx.lineTo(speakerLeft + speakerBodyW + 8, centerY + 10);
  ctx.lineTo(speakerLeft + speakerBodyW, centerY + 6);
  ctx.closePath();
  ctx.fill();
}

function drawSpeakerState(x, y, width, height, centerY) {
  if (musicMuted) {
    drawMutedSlash(x, y, width, height);
    return;
  }

  drawSoundWaves(x, width, centerY);
}

function drawMutedSlash(x, y, width, height) {
  ctx.strokeStyle = "#d21f2b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 9, y + height - 9);
  ctx.lineTo(x + width - 9, y + 9);
  ctx.stroke();
}

function drawSoundWaves(x, width, centerY) {
  ctx.strokeStyle = "#2222228c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + width - 12, centerY, 4, -0.7, 0.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + width - 10, centerY, 7, -0.7, 0.7);
  ctx.stroke();
}

function refreshSpeakerIcon() {
  if (!ctx) {
    return;
  }

  drawSpeakerIcon();
}

function toggleMusic() {
  musicMuted = !musicMuted;
  if (musicMuted) {
    if (gameAudio) {
      gameAudio.pause();
    }
    if (gameOverAudio) {
      gameOverAudio.pause();
    }
    if (winAudio) {
      winAudio.pause();
    }
    if (noBottlesAudio) {
      noBottlesAudio.pause();
    }
  } else {
    if (gameWon) {
      tryPlayWinAudio();
    } else if (noBottlesLost) {
      tryPlayNoBottlesAudio();
    } else if (gameOver) {
      tryPlayGameOverAudio();
    } else {
      tryPlayGameAudio();
    }
  }
  refreshSpeakerIcon();
}

function drawFullscreenIconBackground() {
  const { x, y, width, height, backround } = fullscreenIcon;
  const radius = 6;
  ctx.fillStyle = backround || "#E0F2F7";
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
  if (fullscreenImage) {
    renderFullscreenIconImage();
    return;
  }

  loadFullscreenIconImage();
}

function loadFullscreenIconImage() {
  fullscreenImage = new Image();
  fullscreenImage.src ="./assets/img/9_intro_outro_screens/start/full-screen-icon-11806.png";
  fullscreenImage.onload = renderFullscreenIconImage;
}

function renderFullscreenIconImage() {
  drawFullscreenIconBackground();
  ctx.drawImage(
    fullscreenImage,
    fullscreenIcon.x,
    fullscreenIcon.y,
    fullscreenIcon.width,
    fullscreenIcon.height,
  );
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
  gameWon = true;
  noBottlesLost = false;
  gameAudio.pause();
  stopAudio(gameOverAudio);
  stopAudio(noBottlesAudio);
  tryPlayWinAudio();
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
  gameWon = false;
  noBottlesLost = false;
  gameAudio.pause();
  stopAudio(noBottlesAudio);
  tryPlayGameOverAudio();

  const image = new Image();
  image.src = "./assets/img/9_intro_outro_screens/game_over/game over.png";
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawRestartButton();
    drawSpeakerIcon();
  };
}

function showNoBottlesScreen() {
  gameStarted = false;
  gameOver = true;
  gameWon = false;
  noBottlesLost = true;
  gameAudio.pause();
  stopAudio(gameOverAudio);
  stopAudio(winAudio);
  tryPlayNoBottlesAudio();

  const image = new Image();
  image.src = "./assets/img/You won, you lost/You lost.png";
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawRestartButton();
    drawSpeakerIcon();
  };
}

window.addEventListener("keydown", (e) => {

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
