/**
 * Central audio controller for game music and result sounds.
 */
class SoundManager {
  /**
   * @param {string} storageKey LocalStorage key used for mute persistence.
   */
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.muted = false;
    this.unlocked = false;
    this.tracks = {};
  }

  /**
   * Initializes all audio tracks once.
   * @returns {void}
   */
  init() {
    if (this.tracks.game) {
      return;
    }

    this.tracks.game = this.createTrack(
      "./assets/audios/mixkit-game-level-music-689.wav",
      true,
    );
    this.tracks.gameOver = this.createTrack(
      "./assets/audios/universfield-game-over-deep-male-voice-clip-352695.mp3",
    );
    this.tracks.win = this.createTrack(
      "./assets/audios/we-ve-got-a-winner-carnival-speaker-voice-dan-barracuda-1-00-02.mp3",
    );
    this.tracks.noBottles = this.createTrack(
      "./assets/audios/fail-male-taunt-wah-wah-wah-trumpet-gfx-sounds-1-00-04.mp3",
    );
  }

  /**
   * @param {string} src Audio source path.
   * @param {boolean} [loop=false] Whether the audio should loop.
   * @returns {HTMLAudioElement}
   */
  createTrack(src, loop = false) {
    const track = new Audio(src);
    track.loop = loop;
    track.volume = 0.25;
    track.preload = "auto";
    return track;
  }

  /**
   * Restores mute state from localStorage.
   * @returns {boolean} Current mute state.
   */
  loadMutedState() {
    try {
      const storedValue = localStorage.getItem(this.storageKey);
      if (storedValue !== null) {
        this.muted = storedValue === "true";
      }
    } catch (error) {
      console.warn("Unable to read music state from localStorage:", error);
    }

    return this.muted;
  }

  /**
   * Persists mute state in localStorage.
   * @returns {void}
   */
  saveMutedState() {
    try {
      localStorage.setItem(this.storageKey, String(this.muted));
    } catch (error) {
      console.warn("Unable to save music state in localStorage:", error);
    }
  }

  /**
   * Initializes user-interaction unlock for browser audio playback.
   * @param {Function} [onUnlock] Optional callback after unlock.
   * @returns {void}
   */
  initUnlock(onUnlock) {
    const unlockAudio = () => {
      this.unlocked = true;
      if (typeof onUnlock === "function") {
        onUnlock();
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
  }

  /**
   * Toggles mute mode and persists it.
   * @returns {boolean} Updated mute state.
   */
  toggleMute() {
    this.muted = !this.muted;
    this.saveMutedState();
    return this.muted;
  }

  /**
   * @returns {boolean} True when muted.
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Pauses all known tracks.
   * @returns {void}
   */
  pauseAll() {
    Object.keys(this.tracks).forEach((name) => {
      this.stopTrack(name, false);
    });
  }

  /**
   * Stops selected tracks.
   * @param {string[]} names Track names to stop.
   * @param {boolean} [reset=true] Whether to reset playback position.
   * @returns {void}
   */
  stopTracks(names, reset = true) {
    names.forEach((name) => this.stopTrack(name, reset));
  }

  /**
   * Stops a single track.
   * @param {string} name Track name.
   * @param {boolean} [reset=true] Whether to reset playback position.
   * @returns {void}
   */
  stopTrack(name, reset = true) {
    const track = this.tracks[name];
    if (!track) {
      return;
    }

    track.pause();
    if (reset) {
      track.currentTime = 0;
    }
  }

  /**
   * Plays background music.
   * @returns {void}
   */
  playGame() {
    this.playTrack("game", "Audio playback blocked or failed:", false);
  }

  /**
   * Plays game-over audio from start.
   * @returns {void}
   */
  playGameOver() {
    this.playTrack("gameOver", "Game-over audio playback blocked or failed:");
  }

  /**
   * Plays win audio from start.
   * @returns {void}
   */
  playWin() {
    this.playTrack("win", "Win audio playback blocked or failed:");
  }

  /**
   * Plays no-bottles lose audio from start.
   * @returns {void}
   */
  playNoBottles() {
    this.playTrack("noBottles", "No-bottles audio playback blocked or failed:");
  }

  /**
   * Plays the track for the current game scene.
   * @param {"game"|"gameOver"|"win"|"noBottles"} scene Current scene.
   * @returns {void}
   */
  playScene(scene) {
    if (scene === "win") {
      this.playWin();
      return;
    }

    if (scene === "noBottles") {
      this.playNoBottles();
      return;
    }

    if (scene === "gameOver") {
      this.playGameOver();
      return;
    }

    this.playGame();
  }

  /**
   * @param {string} name Track key.
   * @param {string} warningMessage Warning message prefix.
   * @param {boolean} [reset=true] Whether to reset before playing.
   * @returns {void}
   */
  playTrack(name, warningMessage, reset = true) {
    const track = this.tracks[name];
    if (!track || this.muted || !this.unlocked) {
      return;
    }

    if (reset) {
      track.currentTime = 0;
    }

    const playPromise = track.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        this.handlePlayError(warningMessage, error);
      });
    }
  }

  /**
   * Logs playback errors except expected autoplay blocks.
   * @param {string} warningMessage Warning message prefix.
   * @param {Error} error Playback error.
   * @returns {void}
   */
  handlePlayError(warningMessage, error) {
    if (error && error.name === "NotAllowedError") {
      return;
    }
    console.warn(warningMessage, error);
  }
}
