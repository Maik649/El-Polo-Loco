/**
 * Game runtime bootstrap and global state.
 */
let canvas;
let ctx;
let world;
let kayboard = new Kayboard();
let screenManager;
let backToStartButton;
let gameStarted = false;
let gameOver = false;
let musicMuted = false;
const MUSIC_MUTED_STORAGE_KEY = "elpolo.musicMuted";
let gameAudio = null;
let gameOverAudio = null;
let winAudio = null;
let gameWon = false;
let noBottlesLost = false;
let noBottlesAudio = null;

/**
 * Initializes canvas, screen manager, controls and event listeners.
 * @returns {void}
 */
function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  backToStartButton = document.getElementById("backToStartBtn");
  screenManager = new GameScreen();
  screenManager.setCanvas(canvas, ctx);
  initGameAudio();
  initGameOverAudio();
  initWinAudio();
  initNoBottlesAudio();
  loadMusicMutedState();
  showStartScreen();
  screenManager.checkOrientation();
  initMobileControls();
  initBackToStartButton();

  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("mousemove", handleCanvasMouseMove);
  canvas.addEventListener("mouseleave", handleCanvasMouseLeave);
  window.addEventListener("resize", handleResize);
}

function initBackToStartButton() {
  if (!backToStartButton) {return;}
  backToStartButton.addEventListener("click", returnToStartScreen);
}

function updateBackToStartButtonVisibility() {
  if (!backToStartButton) { return;}
  backToStartButton.style.display = gameStarted && !gameOver ? "block" : "none";
}

function stopWorldIfRunning() {
  if (!world) {return;}

  world.gameOver = true;
  world = null;
}

function resetKeyboardState() {
  kayboard.LEFT = false;
  kayboard.RIGHT = false;
  kayboard.UP = false;
  kayboard.DOWN = false;
  kayboard.SPACE = false;
  kayboard.D = false;
}

/**
 * Returns from an active run back to the start screen.
 * @returns {void}
 */
function returnToStartScreen() {
  gameStarted = false;
  gameOver = false;
  gameWon = false;
  noBottlesLost = false;
  stopWorldIfRunning();
  resetKeyboardState();
  stopAudio(gameOverAudio);
  stopAudio(winAudio);
  stopAudio(noBottlesAudio);
  showStartScreen();
}

/**
 * Delegates canvas click handling to the screen manager.
 * @param {MouseEvent} event Browser click event.
 * @returns {void}
 */
function handleCanvasClick(event) {
  screenManager.handleCanvasClick(
    event,
    { gameStarted, gameOver },
    { startGame, restartGame, toggleMusic },
  );
}

function handleCanvasMouseMove(event) {
  screenManager.handleCanvasMouseMove(event, { gameStarted, gameOver });
}

function handleCanvasMouseLeave() {
  screenManager.resetCanvasCursor();
}

function handleResize() {
  screenManager.updateIconPositions();
  screenManager.checkOrientation();
}

/**
 * Binds a control button to press/release callbacks.
 * @param {string} buttonId Target button id.
 * @param {Function} onPress Callback on press.
 * @param {Function} onRelease Callback on release.
 * @returns {void}
 */
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
  if (gameAudio) {return;}

  gameAudio = new Audio("./assets/audios/mixkit-game-level-music-689.wav");
  gameAudio.loop = true;
  gameAudio.volume = 0.25;
  gameAudio.preload = "auto";
}

function initGameOverAudio() {
  if (gameOverAudio) {return;}

  gameOverAudio = new Audio("./assets/audios/universfield-game-over-deep-male-voice-clip-352695.mp3");
  gameOverAudio.volume = 0.25;
  gameOverAudio.preload = "auto";
}

function initWinAudio() {
  if (winAudio) {return;}

  winAudio = new Audio("./assets/audios/we-ve-got-a-winner-carnival-speaker-voice-dan-barracuda-1-00-02.mp3");
  winAudio.volume = 0.25;
  winAudio.preload = "auto";
}

function initNoBottlesAudio() {
  if (noBottlesAudio) {return;}

  noBottlesAudio = new Audio("./assets/audios/fail-male-taunt-wah-wah-wah-trumpet-gfx-sounds-1-00-04.mp3");
  noBottlesAudio.volume = 0.25;
  noBottlesAudio.preload = "auto";
}

function tryPlayGameAudio() {
  if (!gameAudio || musicMuted) { return;}

  const playPromise = gameAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("Audio playback blocked or failed:", error);
    });
  }
}

function tryPlayGameOverAudio() {
  if (!gameOverAudio || musicMuted) { return;}

  gameOverAudio.currentTime = 0;
  const playPromise = gameOverAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("Game-over audio playback blocked or failed:", error);
    });
  }
}

function tryPlayWinAudio() {
  if (!winAudio || musicMuted) {return;}

  winAudio.currentTime = 0;
  const playPromise = winAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("Win audio playback blocked or failed:", error);
    });
  }
}

function tryPlayNoBottlesAudio() {
  if (!noBottlesAudio || musicMuted) { return;}

  noBottlesAudio.currentTime = 0;
  const playPromise = noBottlesAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      console.warn("No-bottles audio playback blocked or failed:", error);
    });
  }
}

/**
 * Stops and resets an audio instance.
 * @param {HTMLAudioElement|null} audio Audio element.
 * @returns {void}
 */
function stopAudio(audio) {
  if (!audio) {return;}
  audio.pause();
  audio.currentTime = 0;
}

function loadMusicMutedState() {
  try {
    const savedMusicMutedState = localStorage.getItem(MUSIC_MUTED_STORAGE_KEY);
    if (savedMusicMutedState === null) {return;}
    musicMuted = savedMusicMutedState === "true";
  } catch (error) {
    console.warn("Unable to read music state from localStorage:", error);
  }
}

function saveMusicMutedState() {
  try {
    localStorage.setItem(MUSIC_MUTED_STORAGE_KEY, String(musicMuted));
  } catch (error) {
    console.warn("Unable to save music state in localStorage:", error);
  }
}

/**
 * Starts a new game world and updates UI/audio state.
 * @returns {void}
 */
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
  updateBackToStartButtonVisibility();
}

function restartGame() {
  returnToStartScreen();
}

function showStartScreen() {
  updateBackToStartButtonVisibility();
  screenManager.showStartScreen(musicMuted, () => {tryPlayGameAudio();});
}

function refreshSpeakerIcon() {
  if (!screenManager) {return;}

  screenManager.refreshSpeakerIcon(musicMuted);
}

/**
 * Toggles mute state and refreshes currently active audio.
 * @returns {void}
 */
function toggleMusic() {
  musicMuted = !musicMuted;
  saveMusicMutedState();
  if (musicMuted) {
   setSounds();
  } else {
    if (gameWon) {
      tryPlayWinAudio();
    } else if (noBottlesLost) {
      tryPlayNoBottlesAudio();
    } else if (gameOver) {
      tryPlayGameOverAudio();
    } else { tryPlayGameAudio();}
  }
  refreshSpeakerIcon();
}

function setSounds() {
   
   if (gameAudio) {gameAudio.pause();}
    if (gameOverAudio) {gameOverAudio.pause();}
    if (winAudio) {winAudio.pause();}
    if (noBottlesAudio) { noBottlesAudio.pause();}
}

/**
 * Shows win result screen.
 * @returns {void}
 */
function showWinScreen() {
  gameStarted = false;
  gameOver = true;
  gameWon = true;
  noBottlesLost = false;
  gameAudio.pause();
  stopAudio(gameOverAudio);
  stopAudio(noBottlesAudio);
  tryPlayWinAudio();
  updateBackToStartButtonVisibility();
  screenManager.showResultScreen( "./assets/img/You won, you lost/You Win A.png",musicMuted,);
}

/**
 * Shows game-over result screen.
 * @returns {void}
 */
function showGameOverScreen() {
  gameStarted = false;
  gameOver = true;
  gameWon = false;
  noBottlesLost = false;
  gameAudio.pause();
  stopAudio(noBottlesAudio);
  tryPlayGameOverAudio();
  updateBackToStartButtonVisibility();
  screenManager.showResultScreen( "./assets/img/9_intro_outro_screens/game_over/game over.png", musicMuted,);
}

/**
 * Shows lose screen when no bottles are left and endboss survives.
 * @returns {void}
 */
function showNoBottlesScreen() {
  gameStarted = false;
  gameOver = true;
  gameWon = false;
  noBottlesLost = true;
  gameAudio.pause();
  stopAudio(gameOverAudio);
  stopAudio(winAudio);
  tryPlayNoBottlesAudio();
  updateBackToStartButtonVisibility();
  screenManager.showResultScreen( "./assets/img/You won, you lost/You lost.png", musicMuted,);
}
/**
 * Kay Code from input 
 * @returns {boolean}
 */
window.addEventListener("keydown", (e) => {

  if (e.keyCode === 37) {kayboard.LEFT = true;}
  if (e.keyCode === 39) {kayboard.RIGHT = true;}
  if (e.keyCode === 38) {kayboard.DOWN = true;}
  if (e.keyCode === 40) {kayboard.UP = true;}
  if (e.keyCode === 32) {kayboard.SPACE = true;}
  if (e.keyCode === 68) {kayboard.D = true;}
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 37) {kayboard.LEFT = false;}
  if (e.keyCode === 39) {kayboard.RIGHT = false;}
  if (e.keyCode === 38) {kayboard.DOWN = false;}
  if (e.keyCode === 40) {kayboard.UP = false;}
  if (e.keyCode === 32) {kayboard.SPACE = false;}
  if (e.keyCode === 68) {kayboard.D = false;}
});
