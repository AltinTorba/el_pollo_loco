class SoundManager {
  /** Restores the saved mute preference and sets up the sound registry. */
  constructor() {
    this.isMuted = localStorage.getItem("mute") === "true";
    this.sounds = [];
    this.masterVolume = 1.0;
  }

  /** Registers an audio element so it is affected by mute/stop-all.
   * @param {HTMLAudioElement} audio - The audio element to track. */
  addSound(audio) {
    if (!this.isValidAudio(audio)) return;
    this.sounds.push(audio);
    if (this.isMuted && audio.muted !== undefined) audio.muted = true;
    if (audio.volume !== undefined) audio.volume = this.masterVolume;
  }

  /**
   * Checks that an audio object is usable before registering it, warning
   * (not throwing) so a bad call doesn't crash the game.
   * @param {*} audio - The value passed to addSound().
   * @returns {boolean} Whether it looks like a playable audio element.
   */
  isValidAudio(audio) {
    if (!audio) {
      console.warn('addSound called with null/undefined');
      return false;
    }
    const looksLikeAudio = audio instanceof HTMLAudioElement || (typeof audio === 'object' && audio.play);
    if (!looksLikeAudio) {
      console.warn('addSound called with invalid object:', audio);
      return false;
    }
    return true;
  }

  /** Flips the global mute flag, applies it to every registered sound, and persists it. */
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("mute", this.isMuted.toString());
    
    this.sounds.forEach(sound => {
      if (sound && sound.muted !== undefined) {
        sound.muted = this.isMuted;
      }
    });
    
    this.updateButtonUI();
  }

  /** Syncs the mute button's icon/highlight with the current mute state. */
  updateButtonUI() {
    const muteButton = document.getElementById("mute-button");
    if (muteButton) {
      const img = muteButton.querySelector("img");
      if (img) {
        img.src = this.isMuted ? "./img/icons/muted.png" : "./img/icons/unmuted.png";
      }
      muteButton.style.background = this.isMuted ? 
        "rgba(255, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
    }
  }

  /** Pauses and rewinds every registered sound (used when a round ends). */
  stopAllSounds() {
    this.sounds.forEach(sound => {
      if (sound) {
        try {
          sound.pause();
          sound.currentTime = 0;
        } catch (e) {
          console.warn('Error stopping sound:', e);
        }
      }
    });
  }

  /** Plays a one-shot sound effect at the given volume, respecting mute.
   * @param {HTMLAudioElement} audio - The sound to play.
   * @param {number} [volume=0.5] - Playback volume between 0 and 1. */
  playSound(audio, volume = 0.5) {
    if (!audio || this.isMuted) return;
    
    try {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(e => {
        console.warn('Audio play failed:', e);
      });
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }
}

const soundManager = new SoundManager();