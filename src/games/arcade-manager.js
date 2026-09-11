import { isSoundEnabled, toggleSound, getAudioContext } from './audio.js';
import { ClockworkHareEngine, LOGICAL_WIDTH, LOGICAL_HEIGHT } from './clockwork-hare.js';
import { HeavyDirtHaulerEngine } from './heavy-dirt-hauler.js';

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
    this.virtualControls = document.getElementById('virtualControls');

    this.activeEngine = null;
    this.activeKey = null;
    this.frameReq = null;
    this.lastTime = 0;
    this._toastTimer = null;

    // Initialize engines
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
    this.clockworkEngine.init();
    this.haulerEngine.init();
    if (this.clockworkCardHighScore) {
      this.clockworkCardHighScore.textContent = this.clockworkEngine.highScore;
    }
    if (this.haulerCardHighScore) {
      this.haulerCardHighScore.textContent = this.haulerEngine.highScore;
    }
  }

  handleScoreUpdate(score, hi) {
    if (this.scoreLabel) this.scoreLabel.textContent = score;
    if (this.highScoreLabel) this.highScoreLabel.textContent = hi;
    this.refreshScores();
  }

  handleGameOver(score, hi) {
    if (this.overlayTitle) {
      this.overlayTitle.textContent = this.activeKey === 'clockwork' ? 'GEAR COLLISION!' : 'HAUL COMPLETE!';
    }
    if (this.overlayMessage) {
      this.overlayMessage.textContent = `Score: ${score} | Best: ${hi}. Tap or press Space to play again.`;
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

    this.clockworkEngine.reset();
    this.haulerEngine.reset();

    if (gameKey === 'clockwork') {
      this.activeEngine = this.clockworkEngine;
      if (this.cabinetTitle) this.cabinetTitle.textContent = 'CLOCKWORK HARE • Gear Runner';
      if (this.cabinetDesc) {
        this.cabinetDesc.textContent =
          'Tap or press Space to jump. Hold mid-air to deploy spinning helicopter ears and float over gears!';
      }
      if (this.touchHint) this.touchHint.textContent = '🚁 Tap & hold screen or press Space to hover.';
      if (this.virtualControls) this.virtualControls.style.display = 'none';
    } else {
      this.activeEngine = this.haulerEngine;
      if (this.cabinetTitle) this.cabinetTitle.textContent = "Keep on Truckin' • Heavy Dirt Hauler";
      if (this.cabinetDesc) {
        this.cabinetDesc.textContent =
          'Classic heavy-machinery snake: swipe, tap virtual D-pad, or use arrow keys to navigate the haul convoy.';
      }
      if (this.touchHint) this.touchHint.textContent = '🚚 Swipe on screen, use D-pad, or arrow keys to steer.';
      if (this.virtualControls) this.virtualControls.style.display = 'flex';
    }

    if (this.lobbyView) this.lobbyView.style.display = 'none';
    if (this.cabinetView) this.cabinetView.style.display = 'grid';

    this.hideOverlay();
    this.activeEngine.init();
    this.handleScoreUpdate(this.activeEngine.score, this.activeEngine.highScore);
    this.activeEngine.start();
    this.lastTime = 0;
    this.startLoop();

    // Scroll smoothly to cabinet view
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

    // Scroll back to arcade lobby
    const arcadeSection = document.getElementById('arcade');
    if (arcadeSection) arcadeSection.scrollIntoView({ behavior: 'smooth' });
  }

  startLoop() {
    const loop = (timestamp) => {
      if (!this.lastTime) this.lastTime = timestamp;
      const delta = timestamp - this.lastTime;
      this.lastTime = timestamp;

      if (this.activeEngine && this.activeEngine.isRunning) {
        this.pollGamepad();
        this.activeEngine.update(delta);
        this.activeEngine.render();
      }

      this.frameReq = requestAnimationFrame(loop);
    };

    this.frameReq = requestAnimationFrame(loop);
  }

  pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (!gp || !this.activeEngine) return;

    if (this.activeEngine === this.clockworkEngine) {
      if (gp.buttons[0] && gp.buttons[0].pressed) {
        this.clockworkEngine.handlePressDown();
      } else {
        this.clockworkEngine.handlePressUp();
      }
      return;
    }

    if (this.activeEngine === this.haulerEngine && this.haulerEngine.isRunning && !this.haulerEngine.isOver) {
      const ax = gp.axes[0] || 0;
      const ay = gp.axes[1] || 0;
      let dir = null;
      if (Math.abs(ax) > 0.25 || Math.abs(ay) > 0.25) {
        if (Math.abs(ax) > Math.abs(ay)) {
          dir = ax > 0 ? 'right' : 'left';
        } else {
          dir = ay > 0 ? 'down' : 'up';
        }
      }
      if (!dir) {
        if (gp.buttons[12] && gp.buttons[12].pressed) dir = 'up';
        else if (gp.buttons[13] && gp.buttons[13].pressed) dir = 'down';
        else if (gp.buttons[14] && gp.buttons[14].pressed) dir = 'left';
        else if (gp.buttons[15] && gp.buttons[15].pressed) dir = 'right';
      }
      if (dir && dir !== this._lastGpDir) {
        this._lastGpDir = dir;
        if (dir === 'up') this.haulerEngine.setDirection({ x: 0, y: -1 });
        else if (dir === 'down') this.haulerEngine.setDirection({ x: 0, y: 1 });
        else if (dir === 'left') this.haulerEngine.setDirection({ x: -1, y: 0 });
        else if (dir === 'right') this.haulerEngine.setDirection({ x: 1, y: 0 });
      } else if (!dir) {
        this._lastGpDir = null;
      }
    }
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

    // Touch & Mouse Gesture Engine
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 14;

    const handleTouchStart = (e) => {
      if (!this.activeEngine) return;
      e.preventDefault();
      getAudioContext();
      if (!e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressDown();
      } else if (this.activeEngine === this.haulerEngine && (!this.haulerEngine.isRunning || this.haulerEngine.isOver)) {
        this.hideOverlay();
        this.haulerEngine.start();
      }
    };

    const handleTouchMove = (e) => {
      if (!this.activeEngine || this.activeEngine !== this.haulerEngine || !this.haulerEngine.isRunning) return;
      e.preventDefault();
      if (!e.touches.length) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) >= SWIPE_THRESHOLD) {
        if (absX > absY) {
          this.haulerEngine.setDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
        } else {
          this.haulerEngine.setDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
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
        return;
      }

      if (this.activeEngine === this.haulerEngine && e.changedTouches.length) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) >= SWIPE_THRESHOLD) {
          if (absX > absY) {
            this.haulerEngine.setDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
          } else {
            this.haulerEngine.setDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
          }
        }
      }
    };

    this.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    this.canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Mouse drag support
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseStartY = 0;

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.activeEngine) return;
      getAudioContext();
      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressDown();
      } else if (this.activeEngine === this.haulerEngine) {
        if (!this.haulerEngine.isRunning || this.haulerEngine.isOver) {
          this.hideOverlay();
          this.haulerEngine.start();
        } else {
          isMouseDown = true;
          mouseStartX = e.clientX;
          mouseStartY = e.clientY;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown || !this.activeEngine || this.activeEngine !== this.haulerEngine) return;
      const deltaX = e.clientX - mouseStartX;
      const deltaY = e.clientY - mouseStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) >= SWIPE_THRESHOLD) {
        if (absX > absY) {
          this.haulerEngine.setDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
        } else {
          this.haulerEngine.setDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
        }
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      if (this.activeEngine === this.clockworkEngine) {
        this.clockworkEngine.handlePressUp();
      }
    });

    // Virtual D-pad for mobile
    document.querySelectorAll('[data-dpad]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.activeEngine || this.activeEngine !== this.haulerEngine) return;
        const dir = btn.dataset.dpad;
        if (dir === 'up') this.haulerEngine.setDirection({ x: 0, y: -1 });
        else if (dir === 'down') this.haulerEngine.setDirection({ x: 0, y: 1 });
        else if (dir === 'left') this.haulerEngine.setDirection({ x: -1, y: 0 });
        else if (dir === 'right') this.haulerEngine.setDirection({ x: 1, y: 0 });
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
      }
    });
  }
}
