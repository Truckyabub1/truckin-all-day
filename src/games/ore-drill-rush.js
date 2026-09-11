import { playAudio, getAudioContext } from './audio.js';

export const LOGICAL_WIDTH = 640;
export const LOGICAL_HEIGHT = 640;

export class OreDrillRushEngine {
  constructor(canvas, ctx, onScoreUpdate, onGameOver, onAchievement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onAchievement = onAchievement;
    this.storageKey = 'oreDrillHighScore';
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;

    // 3 Subterranean Rail Tracks: x = 140, 320, 500
    this.lanes = [140, 320, 500];
    this.currentLane = 1; // Center lane
    this.targetX = this.lanes[1];
    this.cartX = this.lanes[1];
    this.cartY = 520;
    this.cartWidth = 72;
    this.cartHeight = 84;
    this.drillSpinAngle = 0;

    this.items = []; // Ore chunks, stalactites, dynamite
    this.sparks = [];
    this.spawnTimer = 0;
    this.scrollSpeed = 5.2;
    this.bgOffset = 0;
  }

  init() {
    this.highScore = Number(localStorage.getItem(this.storageKey)) || 0;
    this.highScoreBroken = false;
  }

  reset() {
    this.score = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;
    this.currentLane = 1;
    this.targetX = this.lanes[1];
    this.cartX = this.lanes[1];
    this.items = [];
    this.sparks = [];
    this.spawnTimer = 0;
    this.scrollSpeed = 5.2;
    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
    this.render();
  }

  start() {
    getAudioContext();
    this.reset();
    this.isRunning = true;
    this.isOver = false;
  }

  moveLeft() {
    if (!this.isRunning || this.isOver) {
      this.start();
      return;
    }
    if (this.currentLane > 0) {
      this.currentLane--;
      this.targetX = this.lanes[this.currentLane];
      playAudio('turn');
    }
  }

  moveRight() {
    if (!this.isRunning || this.isOver) {
      this.start();
      return;
    }
    if (this.currentLane < this.lanes.length - 1) {
      this.currentLane++;
      this.targetX = this.lanes[this.currentLane];
      playAudio('turn');
    }
  }

  checkHighScore() {
    if (this.score > this.highScore) {
      const isFirstBreak = !this.highScoreBroken && this.highScore > 0;
      this.highScore = this.score;
      localStorage.setItem(this.storageKey, String(this.highScore));
      if (isFirstBreak) {
        this.highScoreBroken = true;
        playAudio('highscore');
        if (this.onAchievement) this.onAchievement('🏆', 'New Mining Record Set!');
      }
    }
  }

  gameOver() {
    this.isRunning = false;
    this.isOver = true;
    playAudio('crash');
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  update(delta) {
    if (!this.isRunning || this.isOver) return;

    // Smooth cart lateral movement
    this.cartX += (this.targetX - this.cartX) * 0.28;
    this.drillSpinAngle += 0.45;
    this.bgOffset = (this.bgOffset + this.scrollSpeed) % 40;

    // Difficulty scaling
    this.scrollSpeed = Math.min(10.5, 5.2 + Math.floor(this.score / 300) * 0.4);

    // Spawn items
    this.spawnTimer += delta;
    if (this.spawnTimer > Math.max(550, 1100 - Math.floor(this.score / 250) * 50)) {
      this.spawnTimer = 0;
      const lane = Math.floor(Math.random() * 3);
      const isHazard = Math.random() > 0.42;

      this.items.push({
        lane,
        x: this.lanes[lane],
        y: -60,
        type: isHazard ? 'stalactite' : (Math.random() > 0.3 ? 'gold' : 'iron'),
        size: 32
      });
    }

    // Update items & collision detection
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += this.scrollSpeed;

      // Hitbox check
      const hitX = Math.abs(item.x - this.cartX) < 38;
      const hitY = Math.abs(item.y - this.cartY) < 46;

      if (hitX && hitY) {
        if (item.type === 'stalactite') {
          this.gameOver();
          return;
        } else {
          // Drill collected ore!
          const pts = item.type === 'gold' ? 150 : 75;
          this.score += pts;
          this.checkHighScore();
          playAudio('drill');

          // Spawn drill sparks
          for (let s = 0; s < 10; s++) {
            this.sparks.push({
              x: this.cartX,
              y: this.cartY - 30,
              vx: (Math.random() - 0.5) * 8,
              vy: -Math.random() * 6 - 2,
              color: item.type === 'gold' ? '#f59e0b' : '#38bdf8',
              alpha: 1.0,
              size: Math.random() * 3 + 2
            });
          }

          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
          this.items.splice(i, 1);
          continue;
        }
      }

      if (item.y > LOGICAL_HEIGHT + 60) {
        if (item.type === 'stalactite') {
          this.score += 20;
          this.checkHighScore();
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        }
        this.items.splice(i, 1);
      }
    }

    // Update sparks
    for (let s = this.sparks.length - 1; s >= 0; s--) {
      const sp = this.sparks[s];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.3;
      sp.alpha -= 0.05;
      if (sp.alpha <= 0) this.sparks.splice(s, 1);
    }
  }

  render() {
    const ctx = this.ctx;

    // Deep subterranean rock gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    bgGrad.addColorStop(0, '#100c08');
    bgGrad.addColorStop(0.5, '#1e140d');
    bgGrad.addColorStop(1, '#0c0805');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Subterranean Rock Wall Veins
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.lineWidth = 2;
    for (let y = -40; y < LOGICAL_HEIGHT + 40; y += 80) {
      const actualY = y + this.bgOffset;
      ctx.beginPath();
      ctx.moveTo(0, actualY);
      ctx.lineTo(60, actualY + 20);
      ctx.moveTo(LOGICAL_WIDTH, actualY);
      ctx.lineTo(LOGICAL_WIDTH - 60, actualY + 20);
      ctx.stroke();
    }

    // 3 Industrial Mine Tracks
    this.lanes.forEach((lx) => {
      // Wood ties
      ctx.fillStyle = '#451a03';
      for (let ty = -40; ty < LOGICAL_HEIGHT + 40; ty += 40) {
        ctx.fillRect(lx - 34, ty + this.bgOffset, 68, 10);
      }

      // Dual Steel rails
      ctx.fillStyle = '#78716c';
      ctx.fillRect(lx - 24, 0, 6, LOGICAL_HEIGHT);
      ctx.fillRect(lx + 18, 0, 6, LOGICAL_HEIGHT);
      ctx.fillStyle = '#d6d3d1';
      ctx.fillRect(lx - 23, 0, 2, LOGICAL_HEIGHT);
      ctx.fillRect(lx + 19, 0, 2, LOGICAL_HEIGHT);
    });

    // Render Falling Items (Ore or Stalactites)
    this.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);

      if (item.type === 'stalactite') {
        // Razor-sharp rock stalactite hazard
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.moveTo(-18, -25);
        ctx.lineTo(18, -25);
        ctx.lineTo(0, 30);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Craggy rock cracks
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(-4, 0);
        ctx.lineTo(2, 16);
        ctx.stroke();
      } else {
        // Glowing Ore Chunk (Gold or Iron)
        const isGold = item.type === 'gold';
        ctx.shadowColor = isGold ? '#f59e0b' : '#38bdf8';
        ctx.shadowBlur = 14;

        ctx.fillStyle = isGold ? '#d97706' : '#0284c7';
        ctx.beginPath();
        ctx.moveTo(-14, -6);
        ctx.lineTo(-4, -18);
        ctx.lineTo(12, -14);
        ctx.lineTo(18, 4);
        ctx.lineTo(8, 16);
        ctx.lineTo(-10, 14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = isGold ? '#fde68a' : '#bae6fd';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shimmer facet
        ctx.fillStyle = isGold ? '#fef08a' : '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(-4, -18);
        ctx.lineTo(4, -4);
        ctx.lineTo(-14, -6);
        ctx.fill();
      }
      ctx.restore();
    });

    // Render Drill Cart Sparks
    this.sparks.forEach((sp) => {
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = sp.alpha;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Render Heavy Armored Mining Rail Cart
    ctx.save();
    ctx.translate(this.cartX, this.cartY);

    // Cart Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Steel Cart Body
    const cartGrad = ctx.createLinearGradient(-30, 0, 30, 0);
    cartGrad.addColorStop(0, '#3f3f46');
    cartGrad.addColorStop(0.5, '#71717a');
    cartGrad.addColorStop(1, '#27272a');
    ctx.fillStyle = cartGrad;
    ctx.beginPath();
    ctx.roundRect(-30, -22, 60, 48, 6);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rivets
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-22, -14, 2.5, 0, Math.PI * 2);
    ctx.arc(22, -14, 2.5, 0, Math.PI * 2);
    ctx.arc(-22, 18, 2.5, 0, Math.PI * 2);
    ctx.arc(22, 18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Spinning Heavy Front Drill Cone
    ctx.save();
    ctx.translate(0, -24);
    const drillGrad = ctx.createLinearGradient(-16, 0, 16, 0);
    drillGrad.addColorStop(0, '#94a3b8');
    drillGrad.addColorStop(0.5, '#f1f5f9');
    drillGrad.addColorStop(1, '#475569');
    ctx.fillStyle = drillGrad;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(0, -32);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spiral flute lines on drill
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    const fluteY = Math.sin(this.drillSpinAngle) * 6;
    ctx.beginPath();
    ctx.moveTo(-10, -8 + fluteY);
    ctx.lineTo(10, -18 + fluteY);
    ctx.stroke();
    ctx.restore();

    // Headlight Lantern on Cart
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
