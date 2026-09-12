import { playAudio, startHoverAudio, stopHoverAudio, getAudioContext } from './audio.js';
import { getStorageNumber, setStorageNumber } from './storage.js';

export const LOGICAL_WIDTH = 640;
export const LOGICAL_HEIGHT = 640;

export class ClockworkHareEngine {
  constructor(canvas, ctx, onScoreUpdate, onGameOver, onAchievement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onAchievement = onAchievement;
    this.storageKey = 'clockworkHighScore';
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isOver = false;

    this.bunny = {
      x: 90,
      y: 450,
      vy: 0,
      width: 48,
      height: 58,
      groundY: 450,
      gravity: 0.65,
      jumpPower: -13.5,
      isGrounded: true,
      isHolding: false,
      isHovering: false,
      earSpinAngle: 0,
      gearAngle: 0
    };

    this.gears = [];
    this.carrots = [];
    this.hoverParticles = [];
    this.spawnTimer = 0;
    this.highScoreBroken = false;
  }

  init() {
    this.highScore = getStorageNumber(this.storageKey, 0);
    this.highScoreBroken = false;
  }

  reset() {
    this.score = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;
    this.bunny.y = this.bunny.groundY;
    this.bunny.vy = 0;
    this.bunny.isGrounded = true;
    this.bunny.isHolding = false;
    this.bunny.isHovering = false;
    this.bunny.earSpinAngle = 0;
    this.bunny.gearAngle = 0;
    this.gears = [];
    this.carrots = [];
    this.hoverParticles = [];
    this.spawnTimer = 0;
    stopHoverAudio();
    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
    this.render();
  }

  start() {
    getAudioContext();
    this.reset();
    this.isRunning = true;
    this.isOver = false;
  }

  jump() {
    if (this.bunny.isGrounded) {
      this.bunny.vy = this.bunny.jumpPower;
      this.bunny.isGrounded = false;
      playAudio('jump');
    }
  }

  handlePressDown() {
    if (!this.isRunning || this.isOver) {
      this.start();
    } else {
      this.bunny.isHolding = true;
      this.jump();
    }
  }

  handlePressUp() {
    this.bunny.isHolding = false;
    this.bunny.isHovering = false;
    stopHoverAudio();
  }

  update(delta) {
    if (!this.isRunning || this.isOver) return;

    if (this.bunny.isHolding && !this.bunny.isGrounded) {
      this.bunny.isHovering = true;
      this.bunny.vy = Math.min(this.bunny.vy, 0.95);
      this.bunny.earSpinAngle += 0.55;
      startHoverAudio();

      if (Math.random() > 0.3) {
        this.hoverParticles.push({
          x: this.bunny.x + 24 + (Math.random() * 12 - 6),
          y: this.bunny.y + 54,
          vx: -3.5 - Math.random() * 2,
          vy: (Math.random() * 2 - 1),
          radius: 3 + Math.random() * 3,
          alpha: 0.8
        });
      }
    } else {
      this.bunny.isHovering = false;
      stopHoverAudio();
      this.bunny.vy += this.bunny.gravity;
    }

    this.bunny.y += this.bunny.vy;
    this.bunny.gearAngle += 0.08;

    if (this.bunny.y >= this.bunny.groundY) {
      this.bunny.y = this.bunny.groundY;
      this.bunny.vy = 0;
      this.bunny.isGrounded = true;
      this.bunny.isHovering = false;
      stopHoverAudio();
    }

    // Update hover particles
    for (let i = this.hoverParticles.length - 1; i >= 0; i--) {
      const p = this.hoverParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      if (p.alpha <= 0) this.hoverParticles.splice(i, 1);
    }

    // Spawn obstacles & collectibles
    this.spawnTimer += delta;
    if (this.spawnTimer > 1200) {
      this.spawnTimer = 0;
      const isCarrot = Math.random() > 0.45;
      if (isCarrot) {
        this.carrots.push({
          x: LOGICAL_WIDTH + 20,
          y: this.bunny.groundY - 30 - Math.random() * 90,
          size: 28
        });
      } else {
        this.gears.push({
          x: LOGICAL_WIDTH + 30,
          y: this.bunny.groundY + 12,
          radius: 26,
          speed: 5.0 + this.score * 0.002
        });
      }
    }

    // Update gears
    for (let i = this.gears.length - 1; i >= 0; i--) {
      const g = this.gears[i];
      g.x -= g.speed;

      const dx = (this.bunny.x + this.bunny.width / 2) - g.x;
      const dy = (this.bunny.y + this.bunny.height / 2) - g.y;
      if (Math.hypot(dx, dy) < g.radius + 18) {
        this.gameOver();
        return;
      }

      if (g.x < -50) {
        this.gears.splice(i, 1);
        this.score += 25;
        this.checkHighScore();
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
      }
    }

    // Update carrots
    for (let i = this.carrots.length - 1; i >= 0; i--) {
      const c = this.carrots[i];
      c.x -= 4.5;

      const dx = (this.bunny.x + this.bunny.width / 2) - c.x;
      const dy = (this.bunny.y + this.bunny.height / 2) - c.y;
      if (Math.hypot(dx, dy) < c.size + 16) {
        this.score += 100;
        playAudio('pickup');
        this.checkHighScore();
        this.carrots.splice(i, 1);
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
      } else if (c.x < -30) {
        this.carrots.splice(i, 1);
      }
    }
  }

  checkHighScore() {
    if (this.score > this.highScore) {
      const isFirstBreak = !this.highScoreBroken && this.highScore > 0;
      this.highScore = this.score;
      setStorageNumber(this.storageKey, this.highScore);
      if (isFirstBreak) {
        this.highScoreBroken = true;
        playAudio('highscore');
        if (this.onAchievement) this.onAchievement('🏆', 'New Gear Record Broken!');
      }
    }
  }

  gameOver() {
    this.isRunning = false;
    this.isOver = true;
    stopHoverAudio();
    playAudio('crash');
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  render() {
    const ctx = this.ctx;
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    bgGrad.addColorStop(0, '#11121a');
    bgGrad.addColorStop(0.5, '#191c28');
    bgGrad.addColorStop(1, '#2c1e21');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Decorative background cogs
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(520, 160, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(140, 110, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Ground platform line with high-voltage glow
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.bunny.groundY + 54);
    ctx.lineTo(LOGICAL_WIDTH, this.bunny.groundY + 54);
    ctx.stroke();

    // Ground hash pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < LOGICAL_WIDTH; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, this.bunny.groundY + 54);
      ctx.lineTo(x + 12, LOGICAL_HEIGHT);
      ctx.stroke();
    }

    // Hover Particles
    this.hoverParticles.forEach((p) => {
      ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Obstacle Gears (Pure Vector 8-Tooth Mechanical Cogs)
    this.gears.forEach((g) => {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(-Date.now() * 0.004);

      // Outer teeth
      ctx.fillStyle = '#ff2a5f';
      ctx.strokeStyle = '#ffeef2';
      ctx.lineWidth = 1.5;
      const teeth = 8;
      for (let t = 0; t < teeth; t++) {
        ctx.save();
        ctx.rotate((t * Math.PI * 2) / teeth);
        ctx.beginPath();
        ctx.rect(-5, -g.radius - 6, 10, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Main Cog Body
      const cogGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, g.radius);
      cogGrad.addColorStop(0, '#ff6b8b');
      cogGrad.addColorStop(0.7, '#cc1240');
      cogGrad.addColorStop(1, '#800620');
      ctx.fillStyle = cogGrad;
      ctx.beginPath();
      ctx.arc(0, 0, g.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffa8be';
      ctx.stroke();

      // Inner Hub & Rivets
      ctx.fillStyle = '#1c0308';
      ctx.beginPath();
      ctx.arc(0, 0, g.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff99b0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center brass axle
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Collectible Carrots (Pure Vector Golden Brass Carrots)
    this.carrots.forEach((c) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      // Ambient glow
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;

      // Green leafy top
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.ellipse(-3, -c.size * 0.55, 4, 8, -0.3, 0, Math.PI * 2);
      ctx.ellipse(3, -c.size * 0.55, 4, 8, 0.3, 0, Math.PI * 2);
      ctx.ellipse(0, -c.size * 0.65, 3, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Carrot body
      const cGrad = ctx.createLinearGradient(-c.size * 0.3, 0, c.size * 0.3, c.size);
      cGrad.addColorStop(0, '#ffd166');
      cGrad.addColorStop(0.6, '#f59e0b');
      cGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.moveTo(-c.size * 0.35, -c.size * 0.3);
      ctx.lineTo(c.size * 0.35, -c.size * 0.3);
      ctx.lineTo(0, c.size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Horizontal carrot ribs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-c.size * 0.2, -c.size * 0.05);
      ctx.lineTo(c.size * 0.2, -c.size * 0.05);
      ctx.moveTo(-c.size * 0.15, c.size * 0.2);
      ctx.lineTo(c.size * 0.15, c.size * 0.2);
      ctx.stroke();
      ctx.restore();
    });

    // Draw Steampunk Bunny
    ctx.save();
    ctx.translate(this.bunny.x, this.bunny.y);

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(24, 56, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.bunny.isHovering) {
      // Helicopter Rotor Aura
      ctx.save();
      ctx.translate(24, 10);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, -22, 38, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spinning ears
      ctx.rotate(this.bunny.earSpinAngle);
      ctx.fillStyle = '#ffd166';
      ctx.strokeStyle = '#6b4f2c';
      ctx.lineWidth = 2;
      ctx.fillRect(-4, -36, 8, 36);
      ctx.strokeRect(-4, -36, 8, 36);
      ctx.fillRect(-4, 0, 8, 36);
      ctx.strokeRect(-4, 0, 8, 36);
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Resting / Twitching Ears
      const earTwitch = Math.sin(Date.now() * 0.008) * 0.15;
      ctx.save();
      ctx.translate(14, 12);
      ctx.rotate(-0.2 + earTwitch);
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(-4, -28, 8, 28);
      ctx.fillStyle = '#ff6bfd';
      ctx.fillRect(-2, -24, 4, 20);
      ctx.restore();

      ctx.save();
      ctx.translate(28, 12);
      ctx.rotate(0.2 - earTwitch);
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(-4, -28, 8, 28);
      ctx.fillStyle = '#ff6bfd';
      ctx.fillRect(-2, -24, 4, 20);
      ctx.restore();
    }

    // Bunny Torso
    ctx.fillStyle = '#e0a96d';
    ctx.beginPath();
    ctx.roundRect(4, 18, 40, 36, 12);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#6b4f2c';
    ctx.stroke();

    // Chest Gear
    ctx.save();
    ctx.translate(24, 36);
    ctx.rotate(this.bunny.gearAngle);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b07d2b';
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.fillRect(-2, -12, 4, 4);
    }
    ctx.restore();

    // Goggles / Visor
    ctx.fillStyle = '#111';
    ctx.fillRect(10, 16, 28, 10);
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(16, 21, 5, 0, Math.PI * 2);
    ctx.arc(32, 21, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
