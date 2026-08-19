class SoundManager {
  constructor() {
    this.isMuted = localStorage.getItem("mute") === "true";
    this.sounds = [];
    this.masterVolume = 1.0;
  }

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