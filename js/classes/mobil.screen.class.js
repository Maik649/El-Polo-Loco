/**
 * Mobile controller for touch buttons and orientation updates.
 */
class MobilScreen {
  /**
   * @param {Kayboard} kayboard Shared keyboard state.
   * @param {Function} onResetKeyboard Callback to release pressed inputs.
   */
  constructor(kayboard, onResetKeyboard) {
    this.kayboard = kayboard;
    this.onResetKeyboard = onResetKeyboard;
  }

  /**
   * Initializes mobile UI hooks.
   * @returns {void}
   */
  init() {
    const isTouchDevice = this.isTouchDevice();
    document.body.classList.toggle("touch-device", isTouchDevice);

    if (!isTouchDevice) {
      return;
    }

    this.bindControlButtons();
    window.addEventListener("blur", this.onResetKeyboard);
    window.addEventListener("orientationchange", () => this.checkOrientation());
  }

  /**
   * Connects all touch control buttons.
   * @returns {void}
   */
  bindControlButtons() {
    this.bindControlButton("btn-left", "LEFT");
    this.bindControlButton("btn-right", "RIGHT");
    this.bindControlButton("btn-jump", "SPACE");
    this.bindControlButton("btn-throw", "D");
  }

  /**
   * Binds one mobile button to a keyboard flag.
   * @param {string} buttonId Target button id.
   * @param {"LEFT"|"RIGHT"|"SPACE"|"D"} key Flag key.
   * @returns {void}
   */
  bindControlButton(buttonId, key) {
    const button = document.getElementById(buttonId);

    if (!button) {
      return;
    }

    const start = (event) => {
      event.preventDefault();
      this.kayboard[key] = true;
    };

    const end = (event) => {
      event.preventDefault();
      this.kayboard[key] = false;
    };

    const preventBrowserMenu = (event) => {
      event.preventDefault();
    };

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

    button.addEventListener("contextmenu", preventBrowserMenu);
    button.addEventListener("selectstart", preventBrowserMenu);
    button.addEventListener("dragstart", preventBrowserMenu);
  }

  /**
   * Shows or hides the rotate-device overlay on touch devices.
   * @returns {void}
   */
  checkOrientation() {
    const overlay = document.getElementById("orientationOverlay");
    const isTouchDevice = this.isTouchDevice();
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if (!overlay) {
      return;
    }

    overlay.style.display = isTouchDevice && !isLandscape ? "flex" : "none";
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
   * Requests fullscreen for the game container.
   * @returns {void}
   */
  requestFullscreen() {
    const element = document.getElementById("gameContainer");
    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      return;
    }

    let requestResult;

    if (element.requestFullscreen) {
      requestResult = element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      requestResult = element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      requestResult = element.msRequestFullscreen();
    }

    if (requestResult && typeof requestResult.catch === "function") {
      requestResult.catch(() => {});
    }
  }
}