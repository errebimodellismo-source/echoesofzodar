import { Howl, Howler } from 'howler';

// Singleton audio manager
class AudioManager {
  constructor() {
    this.bgm = null;
    this.currentTheme = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.volume = 0.5;
    
    // We will lazy-load sounds as needed to avoid downloading everything at once,
    // or configure a set of standard URLs.
    
    // SFX library
    this.sounds = {
      // Dice and UI
      diceRoll: new Howl({ src: ['https://actions.google.com/sounds/v1/foley/rolling_dice.ogg'], volume: 0.8 }),
      click: new Howl({ src: ['https://actions.google.com/sounds/v1/ui/button_click.ogg'], volume: 0.5 }),
      success: new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'], volume: 0.4 }),
      levelUp: new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'], volume: 0.5 }), // placeholder
      
      // Combat
      swordHit: new Howl({ src: ['https://actions.google.com/sounds/v1/weapons/blade_swish.ogg'], volume: 0.6 }),
      arrowHit: new Howl({ src: ['https://actions.google.com/sounds/v1/weapons/arrow_impact.ogg'], volume: 0.6 }),
      magicCast: new Howl({ src: ['https://actions.google.com/sounds/v1/science_fiction/laser_pew.ogg'], volume: 0.5 }),
      monsterRoar: new Howl({ src: ['https://actions.google.com/sounds/v1/animals/dinosaur_roar.ogg'], volume: 0.7 }),
      heal: new Howl({ src: ['https://actions.google.com/sounds/v1/water/water_drop.ogg'], volume: 0.8 }),
    };

    // Background music URLs by theme
    this.bgmUrls = {
      intro: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_24806a6aee.mp3?filename=fantasy-epic-adventure-123447.mp3', // Example Royaly Free from Pixabay
      town: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1db7998bc1.mp3?filename=medieval-village-110052.mp3',
      combat: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=battle-of-the-dragons-8037.mp3',
      dungeon: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_1cd710d065.mp3?filename=dark-ambient-126122.mp3',
    };
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Howler.volume(this.volume);
  }

  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    if (!enabled && this.bgm) {
      this.bgm.pause();
    } else if (enabled && this.bgm) {
      this.bgm.play();
    }
  }

  toggleSfx(enabled) {
    this.sfxEnabled = enabled;
  }

  playBGM(theme) {
    if (this.currentTheme === theme) return;
    
    if (this.bgm) {
      this.bgm.fade(this.bgm.volume(), 0, 1000);
      setTimeout(() => {
        if (this.bgm) this.bgm.stop();
        this._startBGM(theme);
      }, 1000);
    } else {
      this._startBGM(theme);
    }
  }

  _startBGM(theme) {
    const url = this.bgmUrls[theme];
    if (!url) return;
    
    this.currentTheme = theme;
    this.bgm = new Howl({
      src: [url],
      html5: true, // Force HTML5 Audio to stream rather than download full file
      loop: true,
      volume: 0,
    });
    
    if (this.musicEnabled) {
      this.bgm.play();
      this.bgm.fade(0, 0.4, 2000);
    }
  }

  playSFX(soundName) {
    if (!this.sfxEnabled) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    }
  }
}

const audioManager = new AudioManager();
export default audioManager;
