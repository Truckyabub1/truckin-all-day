import { isSoundEnabled, toggleSound, getAudioContext } from './audio.js';
import { ClockworkHareEngine, LOGICAL_WIDTH, LOGICAL_HEIGHT } from './clockwork-hare.js';
import { HeavyDirtHaulerEngine } from './heavy-dirt-hauler.js';
import { OreDrillRushEngine } from './ore-drill-rush.js';
import { TimberHollowTrailEngine } from './timber-hollow-trail.js';
import { NeonHighwayEngine } from './neon-highway.js';

export class ArcadeManager {
  constructor() {
    this.canvas = document.getElementById('arcadeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.lobbyView = document.getElementById('arcadeLobby');
    this.cabinetView = document.getElementById('arcadeCabinet');
    this.cabinetTitle = document.getElementById('cabinetTitle');
    this.cabinetDesc = document.getElementById('cabinetDesc');
    this.touchHint = document.getElementById('touchHint');
    this.backToLobbyBtn = document.getElementById('backToLobbyBtn');

    this.scoreLabel = document.getElementById('arcadeScore');
    this.highScoreLabel = document.getElementById('arcadeHighScore');
    this.startBtn = document.getElementById('arcadeStartBtn');
    this.restartBtn = document.getElementById('arcadeRestartBtn');
    this.muteBtn = document.getElementById('arcadeMuteBtn');
    this.overlay = document.getElementById('arcadeOverlay');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlayMessage = document.getElementById('overlayMessage');

    this.clockworkCardHighScore = document.getElementById('clockworkCardHighScore');
    this.haulerCardHighScore = document.getElementById('haulerCardHighScore');
    this.drillCardHighScore = document.getElementById('drillCardHighScore');
    this.timberCardHighScore = document.getElementById('timberCardHighScore');
    this.neonCardHighScore = document.getElementById('neonCardHighScore');
    this.virtualControls = document.getElementById('virtualControls');

    this.activeEngine = null;
    this.activeKey = null;
    this.frameReq = null;
    this.lastTime = 0;
    this._toastTimer = null;

    // Instantiate all 5 signature artist engines
    this.clockworkEngine = new ClockworkHareEngine(
      this.canvas,
      this.ctx,
      (score, hi) => this.handleScoreUpdate(score, hi),
      (score, hi) => this.handleGameOver(score, hi),
      (icon, msg) => this.showAchievement(icon, msg)
    );

    this.haulerEngine = new HeavyDirtHaulerEngine(
      this.canvas,
      this.ctx,
      (score, hi) => this.handleScoreUpdate(score, hi),
      (score, hi) => this.handleGameOver(score, hi),
      (icon, msg) => this.showAchievement(icon, msg)
    );

    this.drillEngine = new OreDrillRushEngine(
      this.canvas,
      this.ctx,
      (score, hi) => this.handleScoreUpdate(score, hi),
      (score, hi) => this.handleGameOver(score, hi),
      (icon, msg) => this.showAchievement(icon, msg)
    );

    this.timberEngine = new TimberHollowTrailEngine(
      this.canvas,
      this.ctx,
      (score, hi) => this.handleScoreUpdate(score, hi),
      (score, hi) => this.handleGameOver(score, hi),
      (icon, msg) => this.showAchievement(icon, msg)
    );

    this.neonEngine = new NeonHighwayEngine(
      this.canvas,
      this.ctx,
      (score, hi) => this.handleScoreUpdate(score, hi),
      (score, hi) => this.handleGameOver(score, hi),
      (icon, msg) => this.showAchievement(icon, msg)
    );

    this.engines = {
      clockwork: this.clockworkEngine,
      hauler: this.haulerEngine,
      drill: this.drillEngine,
      timber: this.timberEngine,
      neon: this.neonEngine
    };

    this.setupHiDPI();
    this.bindEvents();
    this.refreshScores();
  }

  setupHiDPI() {
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = LOGICAL_WIDTH * dpr;
    this.canvas.height = LOGICAL_HEIGHT * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  refreshScores() {
    Object.values(this.engines).forEach(e => e.init());
    if (this.clockworkCardHighScore) this.clockworkCardHighScore.textContent = this.clockworkEngine.highScore;
    if (this.haulerCardHighScore) this.haulerCardHighScore.textContent = this.haulerEngine.highScore;
    if (this.drillCardHighScore) this.drillCardHighScore.textContent = this.drillEngine.highScore;
    if (this.timberCardHighScore) this.timberCardHighScore.textContent = this.timberEngine.highScore;
    if (this.neonCardHighScore) this.neonCardHighScore.textContent = this.neonEngine.highScore;
  }

  handleScoreUpdate(score, hi) {
    if (this.scoreLabel) this.scoreLabel.textContent = score;
    if (this.highScoreLabel) this.highScoreLabel.textContent = hi;
    this.refreshScores();
  }

  handleGameOver(score, hi) {
    const titles = {
      clockwork: 'GEAR COLLISION!',
      hauler: 'HAUL COMPLETE!',
      drill: 'DRILL SHAFT COLLAPSE!',
      timber: 'TIMBER IMPACT!',
      neon: 'SYSTEM GRID OVERLOAD!'
    };
    if (this.overlayTitle) {
      this.overlayTitle.textContent = titles[this.activeKey] || 'GAME OVER';
    }
    if (this.overlayMessage) {
      this.overlayMessage.textContent = `Score: ${score} | Record: ${hi}. Tap or press Space to retry.`;
    }
    this.showOverlay();
  }

  showOverlay() {
    if (!this.overlay) return;
    this.overlay.hidden = false;
    this.overlay.classList.remove('hidden');
    this.overlay.style.display = 'grid';
  }

  hideOverlay() {
    if (!this.overlay) return;
    this.overlay.hidden = true;
    this.overlay.classList.add('hidden');
    this.overlay.style.display = 'none';
  }

  showAchievement(icon, text) {
    const toast = document.getElementById('achievementToast');
    const iconEl = document.getElementById('toastIcon');
    const textEl = document.getElementById('toastText');
    if (!toast || !iconEl || !textEl) return;

    iconEl.textContent = icon;
    textEl.textContent = text;
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.5rem';

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }

  launchCabinet(gameKey) {
    if (this.frameReq) cancelAnimationFrame(this.frameReq);

    document.body.classList.add('arcade-active');
    this.activeKey = gameKey;
    Object.values(this.engines).forEach(e => e.reset());

    const configs = {
      clockwork: {
        engine: this.clockworkEngine,
        title: 'CLOCKWORK HARE • Gear Runner',
        desc: 'Tap screen or press Space to jump. Hold mid-air to deploy spinning helicopter ears and glide!',
        hint: '🚁 Tap & hold screen or press Space to hover.',
        virtualControls: false
      },
      hauler: {
        engine: this.haulerEngine,
        title: "Keep on Truckin' • Heavy Dirt Hauler",
        desc: 'Classic heavy-equipment convoy snake! Swipe, use virtual D-pad, or arrow keys to steer the 18-wheeler.',
        hint: '🚚 Swipe on screen, use D-pad, or arrow keys to steer.',
        virtualControls: true
      },
      drill: {
        engine: this.drillEngine,
        title: 'Iron Stallion • Ore Drill Rush',
        desc: 'Shift rail tracks (A/D, Left/Right, Swipe) to drill gold and iron ore veins while dodging sharp stalactites.',
        hint: '⛏️ Tap left/right or swipe to change rail tracks.',
        virtualControls: true
      },
      timber: {
        engine: this.timberEngine,
        title: 'Harlan Echo • Timber Hollow Trail',
        desc: 'Steer the vintage 1970s mountain pickup truck through night mist. Dodge fallen timber and collect vinyl records!',
        hint: '🌲 Steer left/right (A/D, Arrow keys, or touch buttons).',
        virtualControls: true
      },
      neon: {
        engine: this.neonEngine,
        title: 'Subzero Pulsewavez • Neon Highway 120',
        desc: '120 MPH synthwave speeder! Shift lanes to hit neon pulse boost arches and avoid cruising cyber-traffic.',
        hint: '⚡ Shift lanes (Left/Right or Swipe) to hit boost gates.',
        virtualControls: true
      }
    };

    const config = configs[gameKey] || configs.clockwork;
    this.activeEngine = config.engine;
    if (this.cabinetTitle) this.cabinetTitle.textContent = config.title;
    if (this.cabinetDesc) this.cabinetDesc.textContent = config.desc;
    if (this.touchHint) this.touchHint.textContent = config.hint;
    if (this.virtualControls) this.virtualControls.style.display = config.virtualControls ? 'flex' : 'none';

    if (this.lobbyView) this.lobbyView.style.display = 'none';
    if (this.cabinetView) this.cabinetView.style.display = 'grid';

    this.hideOverlay();
    this.setupHiDPI();
    this.activeEngine.init();
    this.handleScoreUpdate(this.activeEngine.score, this.activeEngine.highScore);
    this.activeEngine.start();
    this.lastTime = 0;
    this.startLoop();

    this.cabinetView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  returnToLobby() {
    if (this.frameReq) cancelAnimationFrame(this.frameReq);
    if (this.activeEngine) {
      this.activeEngine.reset();
      this.activeEngine = null;
    }
    this.activeKey = null;
    document.body.classList.remove('arcade-active');

    if (this.cabinetView) this.cabinetView.style.display = 'none';
    if (this.lobbyView) this.lobbyView.style.display = 'grid';
    if (this.virtualControls) this.virtualControls.style.display = 'none';
    this.refreshScores();

    const arcadeSection = document.getElementById('arcade');
    if (arcadeSection) arcadeSection.scrollIntoView({ behavior: 'smooth' });
  }

  startLoop() {
    const loop = (timestamp) => {
      if (!this.lastTime) this.lastTime = timestamp;
      const delta = timestamp - this.lastTime;
      this.lastTime = timestamp;

      if (this.activeEngine && this.activeEngine.isRunning) {
        this.activeEngine.update(delta);
        this.activeEngine.render();
      }

      this.frameReq = requestAnimationFrame(loop);
    };

    this.frameReq = requestAnimationFrame(loop);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.setupHiDPI());

    // Launch buttons
    document.querySelectorAll('[data-launch]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.launchCabinet(btn.dataset.launch);
      });
    });

    if (this.backToLobbyBtn) {
      this.backToLobbyBtn.addEventListener('click', () => this.returnToLobby());
    }

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        if (this.activeEngine) this.activeEngine.start();
        this.hideOverlay();
      });
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        if (this.activeEngine) this.activeEngine.start();
        this.hideOverlay();
      });
    }

    if (this.overlay) {
      const restartAction = (e) => {
        e.preventDefault();
        if (this.activeEngine) {
          this.hideOverlay();
          this.activeEngine.start();
        }
      };
      this.overlay.addEventListener('click', restartAction);
      this.overlay.addEventListener('touchstart', restartAction, { passive: false });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const soundOn = toggleSound();
        this.muteBtn.textContent = soundOn ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        this.muteBtn.setAttribute('aria-label', soundOn ? 'Mute arcade sound' : 'Unmute arcade sound');
      });
    }

    // Touch & Mouse Gesture Handling
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 16;

    const handleTouchStart = (e) => {
      if (!this.activeEngine) return;
      e.preventDefault();
      getAudioContext();
      if (!e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressDown();
      } else if (!this.activeEngine.isRunning || this.activeEngine.isOver) {
        this.hideOverlay();
        this.activeEngine.start();
      }
    };

    const handleTouchMove = (e) => {
      if (!this.activeEngine || !this.activeEngine.isRunning) return;
      e.preventDefault();
      if (!e.touches.length) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) >= SWIPE_THRESHOLD) {
        if (this.activeEngine === this.haulerEngine) {
          if (absX > absY) {
            this.haulerEngine.setDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
          } else {
            this.haulerEngine.setDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
          }
        } else if (this.activeEngine === this.drillEngine) {
          if (deltaX > 0) this.drillEngine.moveRight();
          else this.drillEngine.moveLeft();
        } else if (this.activeEngine === this.timberEngine) {
          this.timberEngine.setSteer(deltaX > 0 ? 1 : -1);
        } else if (this.activeEngine === this.neonEngine) {
          if (deltaX > 0) this.neonEngine.moveRight();
          else this.neonEngine.moveLeft();
        }
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (!this.activeEngine) return;
      e.preventDefault();
      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressUp();
      } else if (this.activeEngine === this.timberEngine) {
        this.timberEngine.setSteer(0);
      }
    };

    this.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    this.canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Virtual D-pad for mobile
    document.querySelectorAll('[data-dpad]').forEach((btn) => {
      const handleDpad = (dir) => {
        if (!this.activeEngine) return;
        if (this.activeEngine === this.haulerEngine) {
          if (dir === 'up') this.haulerEngine.setDirection({ x: 0, y: -1 });
          else if (dir === 'down') this.haulerEngine.setDirection({ x: 0, y: 1 });
          else if (dir === 'left') this.haulerEngine.setDirection({ x: -1, y: 0 });
          else if (dir === 'right') this.haulerEngine.setDirection({ x: 1, y: 0 });
        } else if (this.activeEngine === this.drillEngine) {
          if (dir === 'left') this.drillEngine.moveLeft();
          else if (dir === 'right') this.drillEngine.moveRight();
        } else if (this.activeEngine === this.timberEngine) {
          if (dir === 'left') this.timberEngine.setSteer(-1);
          else if (dir === 'right') this.timberEngine.setSteer(1);
        } else if (this.activeEngine === this.neonEngine) {
          if (dir === 'left') this.neonEngine.moveLeft();
          else if (dir === 'right') this.neonEngine.moveRight();
        }
      };

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleDpad(btn.dataset.dpad);
      });
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (!this.activeEngine) return;
      const key = e.key.toLowerCase();

      if (this.activeEngine === this.clockworkEngine) {
        if (e.code === 'Space' || key === 'arrowup' || key === 'w') {
          e.preventDefault();
          this.clockworkEngine.handlePressDown();
        }
      } else if (this.activeEngine === this.haulerEngine) {
        if (e.code === 'Space' || key === 'arrowup' || key === 'w') {
          e.preventDefault();
          if (!this.haulerEngine.isRunning || this.haulerEngine.isOver) {
            this.hideOverlay();
            this.haulerEngine.start();
          } else {
            this.haulerEngine.setDirection({ x: 0, y: -1 });
          }
        } else if (key === 'arrowdown' || key === 's') {
          e.preventDefault();
          this.haulerEngine.setDirection({ x: 0, y: 1 });
        } else if (key === 'arrowleft' || key === 'a') {
          e.preventDefault();
          this.haulerEngine.setDirection({ x: -1, y: 0 });
        } else if (key === 'arrowright' || key === 'd') {
          e.preventDefault();
          this.haulerEngine.setDirection({ x: 1, y: 0 });
        }
      } else if (this.activeEngine === this.drillEngine) {
        if (key === 'arrowleft' || key === 'a') {
          e.preventDefault();
          this.drillEngine.moveLeft();
        } else if (key === 'arrowright' || key === 'd') {
          e.preventDefault();
          this.drillEngine.moveRight();
        } else if (e.code === 'Space') {
          e.preventDefault();
          if (!this.drillEngine.isRunning || this.drillEngine.isOver) {
            this.hideOverlay();
            this.drillEngine.start();
          }
        }
      } else if (this.activeEngine === this.timberEngine) {
        if (key === 'arrowleft' || key === 'a') {
          e.preventDefault();
          this.timberEngine.setSteer(-1);
        } else if (key === 'arrowright' || key === 'd') {
          e.preventDefault();
          this.timberEngine.setSteer(1);
        } else if (e.code === 'Space') {
          e.preventDefault();
          if (!this.timberEngine.isRunning || this.timberEngine.isOver) {
            this.hideOverlay();
            this.timberEngine.start();
          }
        }
      } else if (this.activeEngine === this.neonEngine) {
        if (key === 'arrowleft' || key === 'a') {
          e.preventDefault();
          this.neonEngine.moveLeft();
        } else if (key === 'arrowright' || key === 'd') {
          e.preventDefault();
          this.neonEngine.moveRight();
        } else if (e.code === 'Space') {
          e.preventDefault();
          if (!this.neonEngine.isRunning || this.neonEngine.isOver) {
            this.hideOverlay();
            this.neonEngine.start();
          }
        }
      }

      if (key === 'escape') {
        this.returnToLobby();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.activeEngine === this.clockworkEngine) {
        const key = e.key.toLowerCase();
        if (e.code === 'Space' || key === 'arrowup' || key === 'w') {
          this.clockworkEngine.handlePressUp();
        }
      } else if (this.activeEngine === this.timberEngine) {
        const key = e.key.toLowerCase();
        if (key === 'arrowleft' || key === 'a' || key === 'arrowright' || key === 'd') {
          this.timberEngine.setSteer(0);
        }
      }
    });
  }
}
