class SoundManager {
  constructor() {
    this.isMuted = localStorage.getItem("mute") === "true";
    this.sounds = [];
    this.masterVolume = 1.0;
  }

  addSound(audio) {
    if (!audio) {
      console.warn('addSound called with null/undefined');
      return;
    }
    
    if (audio instanceof HTMLAudioElement || 
        (typeof audio === 'object' && audio.play)) {
      
      this.sounds.push(audio);
      
      if (this.isMuted && audio.muted !== undefined) {
        audio.muted = true;
      }
      
      if (audio.volume !== undefined) {
        audio.volume = this.masterVolume;
      }
      
      console.log('Sound added to manager');
    } else {
      console.warn('addSound called with invalid object:', audio);
    }
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