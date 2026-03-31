/**
 * Game runtime bootstrap and global state.
 */
let canvas;
let ctx;
let world;
let kayboard = new Kayboard();
let screenManager;
let backToStartButton;
let nochmalButton;
let soundManager;
let gameStarted = false;
let gameOver = false;
let musicMuted = false;
const MUSIC_MUTED_STORAGE_KEY = "elpolo.musicMuted";
let gameWon = false;
let noBottlesLost = false;

/**
 * Initializes canvas, screen manager, controls and event listeners.
 * @returns {void}
 */
function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  backToStartButton = document.getElementById("backToStartBtn");
  nochmalButton = document.getElementById("nochmalBtn");
  initManagers();
  initSound();
  showStartScreen();
  screenManager.checkOrientation();
  initMobileControls();
  initBackToStartButton();
  initNochmalButton();
  initEventListeners();
}
/**
 * Creates and wires up screen and sound manager instances.
 * @returns {void}
 */
function initManagers() {
  soundManager = new SoundManager(MUSIC_MUTED_STORAGE_KEY);
  screenManager = new GameScreen();
  screenManager.setCanvas(canvas, ctx);
}
/**
 * Initializes audio, loads mute state and registers unlock callback.
 * @returns {void}
 */
function initSound() {
  soundManager.init();
  musicMuted = soundManager.loadMutedState();
  soundManager.initUnlock(() => {
    if (!musicMuted) {playActiveSceneAudio();}
  });
}
/**
 * Registers canvas and window event listeners.
 * @returns {void}
 */
function initEventListeners() {
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("mousemove", handleCanvasMouseMove);
  canvas.addEventListener("mouseleave", handleCanvasMouseLeave);
  window.addEventListener("resize", handleResize);
}
/**
 * Plays the matching audio for the currently visible game scene.
 * @returns {void}
 */
function playActiveSceneAudio() {
  const scene = gameWon ? "win": noBottlesLost? "noBottles": gameOver ? "gameOver" : "game";

  soundManager.playScene(scene);
}
/**
 * Wires the back-to-start button click handler.
 * @returns {void}
 */
function initBackToStartButton() {
  if (!backToStartButton) {return;}
  backToStartButton.addEventListener("click", returnToStartScreen);
}
/**
 * Wires the nochmal button click handler.
 * @returns {void}
 */
function initNochmalButton() {
  if (!nochmalButton) {return;}
  nochmalButton.addEventListener("click", quickRestartGame);
}
/**
 * Toggles visibility for the back-to-start button depending on game state.
 * @returns {void}
 */
function updateBackToStartButtonVisibility() {
  if (backToStartButton) {
    backToStartButton.style.display = gameStarted && !gameOver ? "block" : "none";
  }
  if (nochmalButton) {
    nochmalButton.style.display = gameOver ? "block" : "none";
  }
}
/**
 * Stops the current world loop and clears the world reference.
 * @returns {void}
 */
function stopWorldIfRunning() {
  if (!world) {return;}

  world.gameOver = true;
  world = null;
}
/**
 * Resets all keyboard flags to their default unpressed state.
 * @returns {void}
 */
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
  soundManager.stopTracks(["gameOver", "win", "noBottles"]);
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
/**
 * Delegates canvas hover handling to the screen manager.
 * @param {MouseEvent} event Browser mouse move event.
 * @returns {void}
 */
function handleCanvasMouseMove(event) {
  screenManager.handleCanvasMouseMove(event, { gameStarted, gameOver });
}
/**
 * Restores default cursor when the pointer leaves the canvas.
 * @returns {void}
 */
function handleCanvasMouseLeave() {
  screenManager.resetCanvasCursor();
}
/**
 * Updates responsive canvas UI state on window resize.
 * @returns {void}
 */
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

  // Prefer pointer events to support modern mobile browsers consistently.
  if (window.PointerEvent) {
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("pointerleave", end);
  } else {
    button.addEventListener("touchstart", start, { passive: false });
    button.addEventListener("touchend", end, { passive: false });
    button.addEventListener("touchcancel", end, { passive: false });
    button.addEventListener("mousedown", start);
    button.addEventListener("mouseup", end);
    button.addEventListener("mouseleave", end);
  }

  button.addEventListener("contextmenu", (event) => event.preventDefault());
}
/**
 * Initializes touch/mouse bindings for mobile control buttons.
 * @returns {void}
 */
function initMobileControls() {
  const isTouchDevice = screenManager.isTouchDevice();
  document.body.classList.toggle("touch-device", isTouchDevice);

  if (!isTouchDevice) {return;}

  bindControlButton("btn-left",() => (kayboard.LEFT = true),() => (kayboard.LEFT = false),);
  bindControlButton("btn-right",() => (kayboard.RIGHT = true),() => (kayboard.RIGHT = false),);
  bindControlButton("btn-jump",() => (kayboard.SPACE = true),() => (kayboard.SPACE = false),);
  bindControlButton("btn-throw",() => (kayboard.D = true),() => (kayboard.D = false),);

  // Ensure controls are released if the app loses focus while a button is held.
  window.addEventListener("blur", resetKeyboardState);
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
  world = new World(canvas, kayboard, soundManager);
  screenManager.checkOrientation();
  soundManager.stopTracks(["gameOver", "win", "noBottles"]);
  soundManager.playGame();
  updateBackToStartButtonVisibility();
}

/**
 * Restarts the flow by returning to the start screen.
 * @returns {void}
 */
function restartGame() {
  returnToStartScreen();
}

/**
 * Restarts the game directly without going to the start screen.
 * @returns {void}
 */
function quickRestartGame() {
  stopWorldIfRunning();
  resetKeyboardState();
  startGame();
}

/**
 * Renders the start screen and applies current mute state.
 * @returns {void}
 */
function showStartScreen() {
  updateBackToStartButtonVisibility();
  screenManager.showStartScreen(musicMuted, () => {soundManager.playGame();});
}

/**
 * Redraws the speaker icon with the current mute state.
 * @returns {void}
 */
function refreshSpeakerIcon() {
  if (!screenManager) {return;}

  screenManager.refreshSpeakerIcon(musicMuted);
}
/**
 * Toggles mute state and refreshes currently active audio.
 * @returns {void}
 */
function toggleMusic() {
  musicMuted = soundManager.toggleMute();
  if (musicMuted) {
    soundManager.pauseAll();
    if (world?.character?.workingAudio) {
      world.character.workingAudio.pause();
    }
  } else {
    playActiveSceneAudio();
  }
  refreshSpeakerIcon();
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
  resetKeyboardState();
  if (world) {world.gameOver = true;}
  soundManager.stopTrack("game", false);
  soundManager.stopTracks(["gameOver", "noBottles"]);
  soundManager.playWin();
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
  resetKeyboardState();
  if (world) {world.gameOver = true;}
  soundManager.stopTrack("game", false);
  soundManager.stopTracks(["noBottles"]);
  soundManager.playGameOver();
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
  resetKeyboardState();
  if (world) {world.gameOver = true;}
  soundManager.stopTrack("game", false);
  soundManager.stopTracks(["gameOver", "win"]);
  soundManager.playNoBottles();
  updateBackToStartButtonVisibility();
  screenManager.showResultScreen( "./assets/img/You won, you lost/You lost.png", musicMuted,);
}

/**
 * Updates keyboard state on keydown input.
 * @param {KeyboardEvent} e Keyboard event.
 * @returns {void}
 */
window.addEventListener("keydown", (e) => {

  if (e.keyCode === 37) {kayboard.LEFT = true;}
  if (e.keyCode === 39) {kayboard.RIGHT = true;}
  if (e.keyCode === 38) {kayboard.DOWN = true;}
  if (e.keyCode === 40) {kayboard.UP = true;}
  if (e.keyCode === 32) {kayboard.SPACE = true;}
  if (e.keyCode === 68) {kayboard.D = true;}
});

/**
 * Updates keyboard state on keyup input.
 * @param {KeyboardEvent} e Keyboard event.
 * @returns {void}
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode === 37) {kayboard.LEFT = false;}
  if (e.keyCode === 39) {kayboard.RIGHT = false;}
  if (e.keyCode === 38) {kayboard.DOWN = false;}
  if (e.keyCode === 40) {kayboard.UP = false;}
  if (e.keyCode === 32) {kayboard.SPACE = false;}
  if (e.keyCode === 68) {kayboard.D = false;}
});
