/**
 * Screen/UI manager for canvas-based menus and overlays.
 */
class GameScreen {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.fullscreenImage = null;
    this.impressumButton = { x: 20, y: 20, width: 130, height: 36 };
    this.startButton = { x: 260, y: 350, width: 200, height: 60 };
    this.restartButton = { x: 260, y: 350, width: 200, height: 60 };
    this.fullscreenIcon = { x: 0, y: 0, width: 40, height: 40 };
    this.speakerIcon = { x: 0, y: 0, width: 40, height: 40 };
  }

  /**
   * Binds canvas and drawing context.
   * @param {HTMLCanvasElement} canvas Game canvas.
   * @param {CanvasRenderingContext2D} ctx Rendering context.
   * @returns {void}
   */
  setCanvas(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.updateIconPositions();
  }

  updateIconPositions() {
    if (!this.canvas) {
      return;
    }

    this.fullscreenIcon.x = this.canvas.width - this.fullscreenIcon.width - 20;
    this.fullscreenIcon.y = 35;
    this.speakerIcon.x = this.fullscreenIcon.x - this.speakerIcon.width - 10;
    this.speakerIcon.y = this.fullscreenIcon.y;
  }

  /**
   * Handles click actions for menu and result screens.
   * @param {MouseEvent} event Browser click event.
   * @param {{gameStarted: boolean, gameOver: boolean}} state Current game state.
   * @param {{startGame: Function, restartGame: Function, toggleMusic: Function}} callbacks Action callbacks.
   * @returns {void}
   */
  handleCanvasClick(event, state, callbacks) {
    const clickPosition = this.getCanvasClickPosition(event);

    if (
      !state.gameStarted &&
      !state.gameOver &&
      this.isInsideRect(clickPosition, this.impressumButton)
    ) {
      window.location.href = "./impressum.html";
      return;
    }

    if (
      (state.gameOver || (!state.gameStarted && !state.gameOver)) &&
      this.isInsideRect(clickPosition, this.speakerIcon)
    ) {
      callbacks.toggleMusic();
      return;
    }

    if (
      !state.gameStarted &&
      !state.gameOver &&
      this.isInsideRect(clickPosition, this.fullscreenIcon)
    ) {
      this.toggleFullscreen();
      return;
    }

    if (
      !state.gameStarted &&
      !state.gameOver &&
      this.isInsideRect(clickPosition, this.startButton)
    ) {
      callbacks.startGame();
      return;
    }

    if (
      state.gameOver &&
      this.isInsideRect(clickPosition, this.restartButton)
    ) {
      callbacks.restartGame();
    }
  }

  /**
   * Updates canvas cursor based on hover state over interactive elements.
   * @param {MouseEvent} event Browser mouse move event.
   * @param {{gameStarted: boolean, gameOver: boolean}} state Current game state.
   * @returns {void}
   */
  handleCanvasMouseMove(event, state) {
    const mousePosition = this.getCanvasClickPosition(event);
    const isHoveringButton = this.isHoveringInteractiveElement(
      mousePosition,
      state,
    );
    this.canvas.style.cursor = isHoveringButton ? "pointer" : "default";
  }

  resetCanvasCursor() {
    if (!this.canvas) {
      return;
    }

    this.canvas.style.cursor = "default";
  }
  /**
   * button cursor based on hover state over interactive elements.
   * @param {{gameStarted: boolean, gameOver: boolean}} state Current game state.
   * @returns {void}
   */
  isHoveringInteractiveElement(position, state) {
    const isStartScreen = !state.gameStarted && !state.gameOver;
    const isResultScreen = state.gameOver;

    if (isStartScreen && this.isInsideRect(position, this.impressumButton)) {
      return true;
    }

    if (isStartScreen && this.isInsideRect(position, this.startButton)) {
      return true;
    }

    if (isResultScreen && this.isInsideRect(position, this.restartButton)) {
      return true;
    }

    if (
      (isStartScreen || isResultScreen) &&
      this.isInsideRect(position, this.speakerIcon)
    ) {
      return true;
    }

    if (isStartScreen && this.isInsideRect(position, this.fullscreenIcon)) {
      return true;
    }

    return false;
  }

  /**
   * Canvas Click
   * @param {*} event
   * @returns
   */
  getCanvasClickPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }
  /**
   * Canvas rec
   * @returns
   */
  isInsideRect(position, rect) {
    return (
      position.x >= rect.x &&
      position.x <= rect.x + rect.width &&
      position.y >= rect.y &&
      position.y <= rect.y + rect.height
    );
  }

  /**
   * Renders start screen and optional callback after image load.
   * @param {boolean} musicMuted Current music state.
   * @param {Function} [onLoaded] Optional callback after render.
   * @returns {void}
   */
  showStartScreen(musicMuted, onLoaded) {
    this.renderImageScreen(
      "./assets/img/9_intro_outro_screens/start/startscreen_1.png",
      () => {
        this.drawImpressumButton();
        this.drawStartButton();
        this.drawFullscreenIcon();
        this.drawSpeakerIcon(musicMuted);

        if (typeof onLoaded === "function") {
          onLoaded();
        }
      },
    );
  }

  /**
   * Renders win/lose screen with shared controls.
   * @param {string} imageSrc Screen image path.
   * @param {boolean} musicMuted Current music state.
   * @param {Function} [onLoaded] Optional callback after render.
   * @returns {void}
   */
  showResultScreen(imageSrc, musicMuted, onLoaded) {
    this.renderImageScreen(imageSrc, () => {
      this.drawRestartButton();
      this.drawSpeakerIcon(musicMuted);

      if (typeof onLoaded === "function") {
        onLoaded();
      }
    });
  }
  /**
   * Renders imgs
   * @param {Function}
   */
  renderImageScreen(imageSrc, afterDraw) {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
      afterDraw();
    };
  }
  /**
   * Render Button Start
   */
  drawStartButton() {
    this.ctx.fillStyle = "rgba(122, 122, 122, 0.6)";
    this.drawRoundedRect(
      this.startButton.x,
      this.startButton.y,
      this.startButton.width,
      this.startButton.height,
      8,
    );

    this.ctx.fillStyle = "#ffffef";
    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "START",
      this.startButton.x + this.startButton.width / 2,
      this.startButton.y + this.startButton.height / 2,
    );
  }
  /**
   * Render Button Impressum
   */
  drawImpressumButton() {
    this.ctx.fillStyle = "rgba(122, 122, 122, 0.6)";
    this.drawRoundedRect(
      this.impressumButton.x,
      this.impressumButton.y,
      this.impressumButton.width,
      this.impressumButton.height,
      8,
    );

    this.ctx.fillStyle = "#fff7ef";
    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Impressum",
      this.impressumButton.x + this.impressumButton.width / 2,
      this.impressumButton.y + this.impressumButton.height / 2,
    );
  }
  /**
   * Render Button Restart
   */
  drawRestartButton() {
    this.ctx.fillStyle = "rgba(122, 122, 122, 0.6)";
    this.drawRoundedRect( this.restartButton.x, this.restartButton.y, this.restartButton.width, this.restartButton.height,8,);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Zurück zum Start",
      this.restartButton.x + this.restartButton.width / 2,
      this.restartButton.y + this.restartButton.height / 2,
    );
  }
  /**
   * Render Button Speaker
   */
  drawSpeakerIcon(musicMuted) {
    const { x, y, width, height } = this.speakerIcon;
    const centerY = y + height / 2;

    this.ctx.save();
    this.ctx.fillStyle = "#E0F2F7";
    this.drawRoundedRect(x, y, width, height, 6);
    this.drawSpeakerBody(x, centerY);
    this.drawSpeakerState(x, y, width, height, centerY, musicMuted);
    this.ctx.restore();
  }
  /**
   * Render Button Speaker
   */
  drawSpeakerBody(x, centerY) {
    const speakerLeft = x + 8;
    const speakerBodyW = 7;
    const speakerBodyH = 12;

    this.ctx.fillStyle = "#7c7b7b";
    this.ctx.fillRect(
      speakerLeft,
      centerY - speakerBodyH / 2,
      speakerBodyW,
      speakerBodyH,
    );

    this.ctx.beginPath();
    this.ctx.moveTo(speakerLeft + speakerBodyW, centerY - 6);
    this.ctx.lineTo(speakerLeft + speakerBodyW + 8, centerY - 10);
    this.ctx.lineTo(speakerLeft + speakerBodyW + 8, centerY + 10);
    this.ctx.lineTo(speakerLeft + speakerBodyW, centerY + 6);
    this.ctx.closePath();
    this.ctx.fill();
  }
  /**
   * Render Button Speaker
   */
  drawSpeakerState(x, y, width, height, centerY, musicMuted) {
    if (musicMuted) {
      this.drawMutedSlash(x, y, width, height);
      return;
    }

    this.drawSoundWaves(x, width, centerY);
  }
  /**
   * Render Button Speaker
   */
  drawMutedSlash(x, y, width, height) {
    this.ctx.strokeStyle = "#d21f2b";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 9, y + height - 9);
    this.ctx.lineTo(x + width - 9, y + 9);
    this.ctx.stroke();
  }
  /**
   * Render Button Speaker
   */
  drawSoundWaves(x, width, centerY) {
    this.ctx.strokeStyle = "#2222228c";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x + width - 12, centerY, 4, -0.7, 0.7);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(x + width - 10, centerY, 7, -0.7, 0.7);
    this.ctx.stroke();
  }
  /**
   * Render Button Speaker
   */
  refreshSpeakerIcon(musicMuted) {
    if (!this.ctx) { return;}
    this.drawSpeakerIcon(musicMuted);
  }
  /**
   * Render Button Fullscreen
   */
  drawFullscreenIcon() {
    if (this.fullscreenImage) {
      this.renderFullscreenIconImage();
      return;
    }

    this.loadFullscreenIconImage();
  }
  /**
   * Render Button Speaker
   */
  loadFullscreenIconImage() {
    this.fullscreenImage = new Image();
    this.fullscreenImage.src = "./assets/img/9_intro_outro_screens/start/full-screen-icon-11806.png";
    this.fullscreenImage.onload = () => this.renderFullscreenIconImage();
  }
  /**
   * Render Button Fullscreen
   */
  renderFullscreenIconImage() {
    this.drawFullscreenIconBackground();
    this.ctx.drawImage( this.fullscreenImage, this.fullscreenIcon.x, this.fullscreenIcon.y,this.fullscreenIcon.width,this.fullscreenIcon.height,);
  }
  /**
   * Render Button Fullscreen
   */
  drawFullscreenIconBackground() {
    const { x, y, width, height } = this.fullscreenIcon; const radius = 6;
    this.ctx.fillStyle = "#E0F2F7"; this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y); this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width,y + height,x + width - radius,y + height,);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  }
  /**
   * Render Button border-radius
   */
  drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius,y + height,);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  }
  /**
   * Check mobile
   * @returns
   */
  checkOrientation() {
    const overlay = document.getElementById("orientationOverlay");
    const isTouchDevice = this.isTouchDevice();
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if (!overlay) {return;}

    overlay.style.display = isTouchDevice && !isLandscape ? "flex" : "none";

    if (isTouchDevice && isLandscape) {
      this.requestFullscreen();
    }
  }

  /**
   * Detects if the current device is touch-first.
   * @returns {boolean}
   */
  isTouchDevice() {
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0
    );
  }

  /**
   * Toggles fullscreen mode for the game container.
   * @returns {void}
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.requestFullscreen();
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  /**
   * Toggles fullscreen mode for the game container.
   * @returns {void}
   */
  requestFullscreen() {
    const elem = document.getElementById("gameContainer");
    if (!elem) { return;}

    if (document.fullscreenElement) {
      return;
    }

    let requestResult;

    if (elem.requestFullscreen) {
      requestResult = elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      requestResult = elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      requestResult = elem.msRequestFullscreen();
    }

    if (requestResult && typeof requestResult.catch === "function") {
      requestResult.catch(() => {});
    }
  }
}