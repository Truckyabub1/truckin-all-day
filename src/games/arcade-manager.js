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

    // Contextual Virtual Controls Elements
    this.virtualControls = document.getElementById('virtualControls');
    this.dpadControls = document.getElementById('dpadControls');
    this.steerControls = document.getElementById('steerControls');
    this.actionControls = document.getElementById('actionControls');
    this.actionBtn = document.getElementById('actionBtn');

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
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.canvas.width = Math.round(LOGICAL_WIDTH * dpr);
    this.canvas.height = Math.round(LOGICAL_HEIGHT * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    if (this.activeEngine) {
      this.activeEngine.render();
    }
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
      this.overlayMessage.textContent = `Score: ${score} | Record: ${hi}. Tap anywhere to retry.`;
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
        hint: '🚁 Tap screen, hold Jump button, or press Space to hover.',
        controlType: 'action'
      },
      hauler: {
        engine: this.haulerEngine,
        title: "Keep on Truckin' • Heavy Dirt Hauler",
        desc: 'Classic heavy-equipment convoy snake! Swipe on screen, use virtual D-pad, or arrow keys to steer.',
        hint: '🚚 Swipe on screen, use D-pad, or arrow keys to steer.',
        controlType: 'dpad'
      },
      drill: {
        engine: this.drillEngine,
        title: 'Iron Stallion • Ore Drill Rush',
        desc: 'Shift rail tracks (tap left/right half, steer buttons, or A/D) to drill ore veins and dodge stalactites.',
        hint: '⛏️ Tap left/right half of screen or use steer buttons.',
        controlType: 'steer'
      },
      timber: {
        engine: this.timberEngine,
        title: 'Harlan Echo • Timber Hollow Trail',
        desc: 'Steer the vintage 1970s mountain pickup truck through night mist. Dodge fallen timber and collect vinyl records!',
        hint: '🌲 Hold left/right steer buttons, tap screen halves, or use A/D.',
        controlType: 'steer'
      },
      neon: {
        engine: this.neonEngine,
        title: 'Subzero Pulsewavez • Neon Highway 120',
        desc: '120 MPH synthwave speeder! Shift lanes to hit neon pulse boost arches and avoid cruising cyber-traffic.',
        hint: '⚡ Tap left/right half of screen, steer buttons, or Arrow keys.',
        controlType: 'steer'
      }
    };

    const config = configs[gameKey] || configs.clockwork;
    this.activeEngine = config.engine;
    if (this.cabinetTitle) this.cabinetTitle.textContent = config.title;
    if (this.cabinetDesc) this.cabinetDesc.textContent = config.desc;
    if (this.touchHint) this.touchHint.textContent = config.hint;

    // Show contextual virtual controls
    if (this.virtualControls) {
      this.virtualControls.style.display = 'flex';
      if (this.dpadControls) this.dpadControls.style.display = config.controlType === 'dpad' ? 'grid' : 'none';
      if (this.steerControls) this.steerControls.style.display = config.controlType === 'steer' ? 'flex' : 'none';
      if (this.actionControls) this.actionControls.style.display = config.controlType === 'action' ? 'flex' : 'none';
    }

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
      // Clamp delta time to max 64ms to prevent physics explosion on tab-switching
      const delta = Math.min(timestamp - this.lastTime, 64);
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
    window.addEventListener('orientationchange', () => setTimeout(() => this.setupHiDPI(), 100));

    // Handle tab visibility and blur cleanly
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.clockworkEngine) this.clockworkEngine.handlePressUp();
        if (this.timberEngine) this.timberEngine.setSteer(0);
      }
    });
    window.addEventListener('blur', () => {
      if (this.clockworkEngine) this.clockworkEngine.handlePressUp();
      if (this.timberEngine) this.timberEngine.setSteer(0);
    });

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
      this.overlay.addEventListener('pointerdown', restartAction);
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const soundOn = toggleSound();
        this.muteBtn.textContent = soundOn ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        this.muteBtn.setAttribute('aria-label', soundOn ? 'Mute arcade sound' : 'Unmute arcade sound');
      });
    }

    // ── CANVAS TOUCH & POINTER HANDLING ────────────────────────
    let touchStartX = 0;
    let touchStartY = 0;
    let hasSwipedInTouch = false;

    const onPointerDown = (clientX, clientY) => {
      if (!this.activeEngine) return;
      getAudioContext();

      if (!this.activeEngine.isRunning || this.activeEngine.isOver) {
        this.hideOverlay();
        this.activeEngine.start();
        return;
      }

      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressDown();
      } else {
        // Half-screen left/right tap control for 3-lane and steering games
        const rect = this.canvas.getBoundingClientRect();
        const relX = clientX - rect.left;
        const isLeft = relX < (rect.width / 2);

        if (this.activeEngine === this.drillEngine) {
          if (isLeft) this.drillEngine.moveLeft();
          else this.drillEngine.moveRight();
        } else if (this.activeEngine === this.neonEngine) {
          if (isLeft) this.neonEngine.moveLeft();
          else this.neonEngine.moveRight();
        } else if (this.activeEngine === this.timberEngine) {
          this.timberEngine.setSteer(isLeft ? -1 : 1);
        }
      }
    };

    const onPointerUp = () => {
      if (!this.activeEngine) return;
      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressUp();
      } else if (this.activeEngine === this.timberEngine) {
        this.timberEngine.setSteer(0);
      }
      hasSwipedInTouch = false;
    };

    // Touch events for mobile canvas gestures & swipe
    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.activeEngine) return;
      e.preventDefault();
      if (!e.touches.length) return;
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      hasSwipedInTouch = false;
      onPointerDown(t.clientX, t.clientY);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.activeEngine || !this.activeEngine.isRunning) return;
      e.preventDefault();
      if (!e.touches.length) return;

      const t = e.touches[0];
      const deltaX = t.clientX - touchStartX;
      const deltaY = t.clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Discrete single-swipe detection
      if (Math.max(absX, absY) >= 28 && !hasSwipedInTouch) {
        if (this.activeEngine === this.haulerEngine) {
          if (absX > absY) {
            this.haulerEngine.setDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
          } else {
            this.haulerEngine.setDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
          }
          hasSwipedInTouch = true;
        } else if (this.activeEngine === this.drillEngine) {
          if (deltaX > 0) this.drillEngine.moveRight();
          else this.drillEngine.moveLeft();
          hasSwipedInTouch = true;
        } else if (this.activeEngine === this.neonEngine) {
          if (deltaX > 0) this.neonEngine.moveRight();
          else this.neonEngine.moveLeft();
          hasSwipedInTouch = true;
        }
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      if (!this.activeEngine) return;
      e.preventDefault();
      onPointerUp();
    }, { passive: false });

    this.canvas.addEventListener('touchcancel', (e) => {
      if (!this.activeEngine) return;
      e.preventDefault();
      onPointerUp();
    }, { passive: false });

    // Mouse pointer fallback on canvas
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.pointerType !== 'touch') {
        onPointerDown(e.clientX, e.clientY);
      }
    });
    this.canvas.addEventListener('mouseup', () => onPointerUp());
    this.canvas.addEventListener('mouseleave', () => onPointerUp());

    // ── VIRTUAL CONTROLS BINDINGS (0ms Pointer Events) ─────────
    // 1. D-Pad for Heavy Dirt Hauler
    document.querySelectorAll('[data-dpad]').forEach((btn) => {
      const handleDpad = (dir) => {
        if (!this.activeEngine) return;
        getAudioContext();
        if (this.activeEngine === this.haulerEngine) {
          if (dir === 'up') this.haulerEngine.setDirection({ x: 0, y: -1 });
          else if (dir === 'down') this.haulerEngine.setDirection({ x: 0, y: 1 });
          else if (dir === 'left') this.haulerEngine.setDirection({ x: -1, y: 0 });
          else if (dir === 'right') this.haulerEngine.setDirection({ x: 1, y: 0 });
        }
      };

      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        btn.classList.add('active');
        handleDpad(btn.dataset.dpad);
      });
      const clearBtn = () => btn.classList.remove('active');
      btn.addEventListener('pointerup', clearBtn);
      btn.addEventListener('pointercancel', clearBtn);
      btn.addEventListener('pointerleave', clearBtn);
    });

    // 2. Dual Steer Buttons for Ore Drill, Timber Trail, & Neon Highway
    document.querySelectorAll('[data-steer]').forEach((btn) => {
      const isLeft = btn.dataset.steer === 'left';

      const startSteer = (e) => {
        e.preventDefault();
        btn.classList.add('active');
        if (!this.activeEngine) return;
        getAudioContext();

        if (this.activeEngine === this.timberEngine) {
          this.timberEngine.setSteer(isLeft ? -1 : 1);
        } else if (this.activeEngine === this.drillEngine) {
          if (isLeft) this.drillEngine.moveLeft();
          else this.drillEngine.moveRight();
        } else if (this.activeEngine === this.neonEngine) {
          if (isLeft) this.neonEngine.moveLeft();
          else this.neonEngine.moveRight();
        }
      };

      const stopSteer = () => {
        btn.classList.remove('active');
        if (this.activeEngine === this.timberEngine) {
          this.timberEngine.setSteer(0);
        }
      };

      btn.addEventListener('pointerdown', startSteer);
      btn.addEventListener('pointerup', stopSteer);
      btn.addEventListener('pointercancel', stopSteer);
      btn.addEventListener('pointerleave', stopSteer);
    });

    // 3. Jump/Hover Action Button for Clockwork Hare
    if (this.actionBtn) {
      const startAction = (e) => {
        e.preventDefault();
        this.actionBtn.classList.add('active');
        if (this.activeEngine === this.clockworkEngine) {
          this.clockworkEngine.handlePressDown();
        }
      };

      const stopAction = () => {
        this.actionBtn.classList.remove('active');
        if (this.activeEngine === this.clockworkEngine) {
          this.clockworkEngine.handlePressUp();
        }
      };

      this.actionBtn.addEventListener('pointerdown', startAction);
      this.actionBtn.addEventListener('pointerup', stopAction);
      this.actionBtn.addEventListener('pointercancel', stopAction);
      this.actionBtn.addEventListener('pointerleave', stopAction);
    }

    // ── KEYBOARD CONTROLS (With Scroll Lock) ───────────────────
    window.addEventListener('keydown', (e) => {
      if (!this.activeEngine) return;
      const key = e.key.toLowerCase();

      // Prevent page scrolling on gaming keys while cabinet is active
      if (['space', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.code.toLowerCase()) ||
          [' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
      }

      if (this.activeEngine === this.clockworkEngine) {
        if (e.code === 'Space' || key === 'arrowup' || key === 'w') {
          this.clockworkEngine.handlePressDown();
        }
      } else if (this.activeEngine === this.haulerEngine) {
        if (e.code === 'Space' || key === 'arrowup' || key === 'w') {
          if (!this.haulerEngine.isRunning || this.haulerEngine.isOver) {
            this.hideOverlay();
            this.haulerEngine.start();
          } else {
            this.haulerEngine.setDirection({ x: 0, y: -1 });
          }
        } else if (key === 'arrowdown' || key === 's') {
          this.haulerEngine.setDirection({ x: 0, y: 1 });
        } else if (key === 'arrowleft' || key === 'a') {
          this.haulerEngine.setDirection({ x: -1, y: 0 });
        } else if (key === 'arrowright' || key === 'd') {
          this.haulerEngine.setDirection({ x: 1, y: 0 });
        }
      } else if (this.activeEngine === this.drillEngine) {
        if (key === 'arrowleft' || key === 'a') {
          this.drillEngine.moveLeft();
        } else if (key === 'arrowright' || key === 'd') {
          this.drillEngine.moveRight();
        } else if (e.code === 'Space') {
          if (!this.drillEngine.isRunning || this.drillEngine.isOver) {
            this.hideOverlay();
            this.drillEngine.start();
          }
        }
      } else if (this.activeEngine === this.timberEngine) {
        if (key === 'arrowleft' || key === 'a') {
          this.timberEngine.setSteer(-1);
        } else if (key === 'arrowright' || key === 'd') {
          this.timberEngine.setSteer(1);
        } else if (e.code === 'Space') {
          if (!this.timberEngine.isRunning || this.timberEngine.isOver) {
            this.hideOverlay();
            this.timberEngine.start();
          }
        }
      } else if (this.activeEngine === this.neonEngine) {
        if (key === 'arrowleft' || key === 'a') {
          this.neonEngine.moveLeft();
        } else if (key === 'arrowright' || key === 'd') {
          this.neonEngine.moveRight();
        } else if (e.code === 'Space') {
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
      if (!this.activeEngine) return;
      const key = e.key.toLowerCase();

      if (this.activeEngine === this.clockworkEngine) {
        if (e.code === 'Space' || key === 'arrowup' || key === 'w') {
          this.clockworkEngine.handlePressUp();
        }
      } else if (this.activeEngine === this.timberEngine) {
        if (key === 'arrowleft' || key === 'a' || key === 'arrowright' || key === 'd') {
          this.timberEngine.setSteer(0);
        }
      }
    });
  }
}

