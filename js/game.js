/**
 * Game runtime bootstrap and global state.
 */
let canvas;
let ctx;
let world;
let kayboard = new Kayboard();
let screenManager;
let backToStartButton;
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
  soundManager = new SoundManager(MUSIC_MUTED_STORAGE_KEY);
  screenManager = new GameScreen();
  screenManager.setCanvas(canvas, ctx);
  soundManager.init();
  musicMuted = soundManager.loadMutedState();
  soundManager.initUnlock(() => {
    if (!musicMuted) {
      playActiveSceneAudio();
    }
  });
  showStartScreen();
  screenManager.checkOrientation();
  initMobileControls();
  initBackToStartButton();

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
  const scene = gameWon
    ? "win"
    : noBottlesLost
      ? "noBottles"
      : gameOver
        ? "gameOver"
        : "game";

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
 * Toggles visibility for the back-to-start button depending on game state.
 * @returns {void}
 */
function updateBackToStartButtonVisibility() {
  if (!backToStartButton) { return;}
  backToStartButton.style.display = gameStarted && !gameOver ? "block" : "none";
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
  const start = (event) => { event.preventDefault(); onPress();};
  const end = (event) => { event.preventDefault(); onRelease();};
  button.addEventListener("touchstart", start);
  button.addEventListener("touchend", end);
  button.addEventListener("touchcancel", end);
  button.addEventListener("mousedown", start);
  button.addEventListener("mouseup", end);
  button.addEventListener("mouseleave", end);
}

/**
 * Initializes touch/mouse bindings for mobile control buttons.
 * @returns {void}
 */
function initMobileControls() {
  bindControlButton("btn-left",() => (kayboard.LEFT = true),() => (kayboard.LEFT = false),);
  bindControlButton("btn-right",() => (kayboard.RIGHT = true),() => (kayboard.RIGHT = false),);
  bindControlButton("btn-jump",() => (kayboard.SPACE = true),() => (kayboard.SPACE = false),);
  bindControlButton("btn-throw",() => (kayboard.D = true),() => (kayboard.D = false),);
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
