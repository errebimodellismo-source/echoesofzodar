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
    
    // SFX library — preload:false to avoid blocking app startup
    this.sounds = {
      // Dice and UI
      diceRoll: new Howl({ src: ['https://actions.google.com/sounds/v1/foley/rolling_dice.ogg'], volume: 0.8, preload: false }),
      click: new Howl({ src: ['https://actions.google.com/sounds/v1/ui/button_click.ogg'], volume: 0.5, preload: false }),
      success: new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'], volume: 0.4, preload: false }),
      levelUp: new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'], volume: 0.5, preload: false }),

      // Combat
      swordHit: new Howl({ src: ['https://actions.google.com/sounds/v1/weapons/blade_swish.ogg'], volume: 0.6, preload: false }),
      arrowHit: new Howl({ src: ['https://actions.google.com/sounds/v1/weapons/arrow_impact.ogg'], volume: 0.6, preload: false }),
      magicCast: new Howl({ src: ['https://actions.google.com/sounds/v1/science_fiction/laser_pew.ogg'], volume: 0.5, preload: false }),
      monsterRoar: new Howl({ src: ['https://actions.google.com/sounds/v1/animals/dinosaur_roar.ogg'], volume: 0.7, preload: false }),
      heal: new Howl({ src: ['https://actions.google.com/sounds/v1/water/water_drop.ogg'], volume: 0.8, preload: false }),
    };

    // Background music URLs by theme
    this.bgmUrls = {
      intro:   '/assets/audio/main.mp3',
      dungeon: '/assets/audio/main.mp3',
      town:    '/assets/audio/shop.mp3',
      combat:  '/assets/audio/combat.mp3',
      magic:   '/assets/audio/magic.mp3',
      tavern:  '/assets/audio/tavern.mp3',
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

  // Call once at app startup — tries immediate play, falls back to first user gesture
  autoplayOnStartup(theme = 'intro') {
    this._pendingTheme = theme;
    // Attempt immediate play (works if browser allows it)
    this._tryAutoplay(theme);
  }

  _tryAutoplay(theme) {
    this._startBGM(theme);
    // Howler/HTML5 audio play returns a Promise; check after a tick if it actually started
    const checkAndFallback = () => {
      if (this.bgm && !this.bgm.playing()) {
        // Browser blocked it — wait for first user gesture
        this._setupGestureFallback();
      }
    };
    setTimeout(checkAndFallback, 500);
  }

  _setupGestureFallback() {
    if (this._gestureBound) return;
    this._gestureBound = true;
    const resume = () => {
      // If BGM exists but isn't playing, resume it
      if (this.bgm && !this.bgm.playing() && this.musicEnabled) {
        this.bgm.play();
        this.bgm.fade(0, 0.4, 2000);
      }
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
      document.removeEventListener('touchstart', resume);
    };
    document.addEventListener('click', resume);
    document.addEventListener('keydown', resume);
    document.addEventListener('touchstart', resume);
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
