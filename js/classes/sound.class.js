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
    this.activeEffectAudios = [];
  }

  /**
   * Initializes all audio tracks once.
   * @returns {void}
   */
  init() {
    if (this.tracks.game) {
      return;
    }

    this.tracks.game = this.createTrack("./assets/audios/mixkit-game-level-music-689.wav", true,);
    this.tracks.gameOver = this.createTrack("./assets/audios/universfield-game-over-deep-male-voice-clip-352695.mp3",);
    this.tracks.win = this.createTrack("./assets/audios/we-ve-got-a-winner-carnival-speaker-voice-dan-barracuda-1-00-02.mp3",);
    this.tracks.noBottles = this.createTrack("./assets/audios/fail-male-taunt-wah-wah-wah-trumpet-gfx-sounds-1-00-04.mp3",);
    this.tracks.run = this.createTrack("./assets/audios/freesound_community-running-1-6846.mp3",true,0.10,);
    this.tracks.jump = this.createTrack("./assets/audios/freesound_community-cartoon-jump-6462.mp3",false, 0.10,);
    this.tracks.bottleCollect = this.createTrack("./assets/audios/u_6cbmmsst3z-bottle-205353.mp3",false,0.10,);
    this.tracks.coinCollect = this.createTrack("./assets/audios/chieuk-coin-257878.mp3",false, 0.10,);
    this.tracks.bottleBreak = this.createTrack("./assets/audios/freesound_community-breaking-glass-83809.mp3",false,0.10,);
    this.tracks.enemyKill = this.createTrack("./assets/audios/floraphonic-rubber-chicken-squeak-toy-1-181416.mp3",false,0.10,);
    this.tracks.characterHit = this.createTrack("./assets/audios/beetpro-ouch-sound-effect-30-11844.mp3",false,0.10,);
    this.tracks.endbossHit = this.createTrack("./assets/audios/chicken-wakwak.mp3",false,0.24,);
  }

  /**
   * @param {string} src Audio source path.
   * @param {boolean} [loop=false] Whether the audio should loop.
   * @param {number} [volume=0.10] Playback volume.
   * @returns {HTMLAudioElement}
   */
  createTrack(src, loop = false, volume = 0.15) {
    const track = new Audio(src);
    track.loop = loop;
    track.volume = volume;
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
    this.stopEffectSounds();
  }

  /**
   * Stops gameplay sound effects and character sounds.
   * @returns {void}
   */
  stopGameplaySounds() {
    this.stopTrack("run", false);
    this.stopEffectSounds();
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
   * Starts the looping run sound if it is not already playing.
   * @returns {void}
   */
  playRun() {
    this.playTrack("run", "Run audio playback blocked or failed:", false);
  }

  /**
   * Stops the looping run sound.
   * @returns {void}
   */
  stopRun() {
    this.stopTrack("run", false);
  }

  /**
   * Plays the jump sound once.
   * @returns {void}
   */
  playJump() {
    this.playEffectTrack("jump", "Jump audio playback blocked or failed:");
  }

  /**
   * Plays the bottle collect sound once.
   * @returns {void}
   */
  playBottleCollect() {
    this.playEffectTrack("bottleCollect", "Bottle collect audio playback blocked or failed:");
  }

  /**
   * Plays the coin collect sound once.
   * @returns {void}
   */
  playCoinCollect() {
    this.playEffectTrack("coinCollect", "Coin collect audio playback blocked or failed:");
  }

  /**
   * Plays the bottle breaking sound once.
   * @returns {void}
   */
  playBottleBreak() {
    this.playEffectTrack("bottleBreak", "Bottle break audio playback blocked or failed:");
  }

  /**
   * Plays the enemy kill sound once.
   * @returns {void}
   */
  playEnemyKill() {
    this.playEffectTrack("enemyKill", "Enemy kill audio playback blocked or failed:");
  }

  /**
   * Plays the character hit sound once.
   * @returns {void}
   */
  playCharacterHit() {
    this.playEffectTrack("characterHit", "Character hit audio playback blocked or failed:");
  }

  /**
   * Plays the endboss hit sound.
   * @returns {void}
   */
  playEndbossHit() {
    this.playTrack("endbossHit", "Endboss hit audio playback blocked or failed:");
  }

  /**
   * Stops endboss hit sound immediately.
   * @returns {void}
   */
  stopEndbossHit() {
    this.stopTrack("endbossHit", true);
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

    if (!reset && !track.paused) {
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
   * Plays a cloned one-shot effect track.
   * @param {string} name Track key.
   * @param {string} warningMessage Warning message prefix.
   * @returns {void}
   */
  playEffectTrack(name, warningMessage) {
    const track = this.tracks[name];
    if (!track || this.muted || !this.unlocked) {
      return;
    }

    const effectAudio = track.cloneNode();
    effectAudio.volume = track.volume;
    effectAudio.currentTime = 0;
    this.activeEffectAudios.push(effectAudio);
    effectAudio.addEventListener("ended", () => {
      this.removeActiveEffectAudio(effectAudio);
    }, { once: true });

    const playPromise = effectAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        this.removeActiveEffectAudio(effectAudio);
        this.handlePlayError(warningMessage, error);
      });
    }
  }

  /**
   * Removes a finished effect instance from the active list.
   * @param {HTMLAudioElement} audio Audio instance to remove.
   * @returns {void}
   */
  removeActiveEffectAudio(audio) {
    this.activeEffectAudios = this.activeEffectAudios.filter((item) => item !== audio);
  }

  /**
   * Stops all active one-shot effect sounds.
   * @returns {void}
   */
  stopEffectSounds() {
    this.activeEffectAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeEffectAudios = [];
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
