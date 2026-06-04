import { Howl, Howler } from 'howler';

class AudioManager {
  constructor() {
    this.bgm = null;
    this.currentTheme = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.volume = 0.5;
    this._fadeTimer = null;

    this.sounds = {
      diceRoll:   new Howl({ src: ['https://actions.google.com/sounds/v1/foley/rolling_dice.ogg'],      volume: 0.8, preload: false }),
      click:      new Howl({ src: ['https://actions.google.com/sounds/v1/ui/button_click.ogg'],         volume: 0.5, preload: false }),
      success:    new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'],   volume: 0.4, preload: false }),
      levelUp:    new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'],      volume: 0.5, preload: false }),
      swordHit:   new Howl({ src: ['https://actions.google.com/sounds/v1/weapons/blade_swish.ogg'],     volume: 0.6, preload: false }),
      arrowHit:   new Howl({ src: ['https://actions.google.com/sounds/v1/weapons/arrow_impact.ogg'],    volume: 0.6, preload: false }),
      magicCast:  new Howl({ src: ['https://actions.google.com/sounds/v1/science_fiction/laser_pew.ogg'], volume: 0.5, preload: false }),
      monsterRoar:new Howl({ src: ['https://actions.google.com/sounds/v1/animals/dinosaur_roar.ogg'],   volume: 0.7, preload: false }),
      heal:       new Howl({ src: ['https://actions.google.com/sounds/v1/water/water_drop.ogg'],        volume: 0.8, preload: false }),
      turnAlert:  new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg'], volume: 0.9, preload: false }),
    };

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
    if (!enabled) {
      // Stoppa tutto — non solo pause, così non riparte da gesture fallback
      if (this.bgm) { this.bgm.stop(); }
    } else {
      // Riprende il tema corrente
      if (this.currentTheme) this._startBGM(this.currentTheme);
    }
  }

  toggleSfx(enabled) { this.sfxEnabled = enabled; }

  autoplayOnStartup(theme = 'intro') {
    this._pendingTheme = theme;
    this._tryAutoplay(theme);
  }

  _tryAutoplay(theme) {
    this._startBGM(theme);
    setTimeout(() => {
      if (this.bgm && !this.bgm.playing() && this.musicEnabled) {
        this._setupGestureFallback();
      }
    }, 500);
  }

  _setupGestureFallback() {
    if (this._gestureBound) return;
    this._gestureBound = true;
    const resume = () => {
      // Riprende SOLO se la musica è abilitata
      if (this.musicEnabled && this.bgm && !this.bgm.playing()) {
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
    this.currentTheme = theme;

    // Cancella timer precedente per evitare race condition
    if (this._fadeTimer) { clearTimeout(this._fadeTimer); this._fadeTimer = null; }

    if (this.bgm) {
      const oldBgm = this.bgm;
      this.bgm = null;
      oldBgm.fade(oldBgm.volume(), 0, 800);
      this._fadeTimer = setTimeout(() => {
        oldBgm.stop();
        this._fadeTimer = null;
        this._startBGM(theme);
      }, 850);
    } else {
      this._startBGM(theme);
    }
  }

  _startBGM(theme) {
    if (!this.musicEnabled) return;
    const url = this.bgmUrls[theme];
    if (!url) return;

    if (this.bgm) { this.bgm.stop(); }

    this.bgm = new Howl({ src: [url], html5: true, loop: true, volume: 0 });
    this.bgm.play();
    this.bgm.fade(0, 0.4, 2000);
  }

  playSFX(soundName) {
    if (!this.sfxEnabled) return;
    const sound = this.sounds[soundName];
    if (sound) sound.play();
  }
}

const audioManager = new AudioManager();
export default audioManager;
