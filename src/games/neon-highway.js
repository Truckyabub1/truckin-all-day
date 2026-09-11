import { playAudio, getAudioContext } from './audio.js';

export const LOGICAL_WIDTH = 640;
export const LOGICAL_HEIGHT = 640;

export class NeonHighwayEngine {
  constructor(canvas, ctx, onScoreUpdate, onGameOver, onAchievement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onAchievement = onAchievement;
    this.storageKey = 'neonHighwayHighScore';
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;

    // 3 Cyber Highway Lanes (x = 180, 320, 460)
    this.lanes = [180, 320, 460];
    this.currentLane = 1;
    this.targetX = this.lanes[1];
    this.carX = this.lanes[1];
    this.carY = 530;

    this.traffic = []; // Cyber cars to dodge
    this.pulseGates = []; // Neon boost arches
    this.gridOffset = 0;
    this.speed = 6.2;
    this.boostTimer = 0;
    this.spawnTimer = 0;
    this.pulseParticles = [];
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
    this.carX = this.lanes[1];
    this.traffic = [];
    this.pulseGates = [];
    this.pulseParticles = [];
    this.gridOffset = 0;
    this.speed = 6.2;
    this.boostTimer = 0;
    this.spawnTimer = 0;
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
        if (this.onAchievement) this.onAchievement('🏆', 'New Synthwave Record Set!');
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

    // Smooth car lateral shifting
    this.carX += (this.targetX - this.carX) * 0.3;

    // Boost decay
    if (this.boostTimer > 0) {
      this.boostTimer -= delta;
      this.speed = 10.5;
    } else {
      this.speed = Math.min(8.5, 6.2 + Math.floor(this.score / 400) * 0.4);
    }

    this.gridOffset = (this.gridOffset + this.speed) % 40;

    // Spawn traffic & pulse gates
    this.spawnTimer += delta;
    if (this.spawnTimer > Math.max(500, 1050 - Math.floor(this.score / 250) * 45)) {
      this.spawnTimer = 0;
      const lane = Math.floor(Math.random() * 3);
      const isGate = Math.random() > 0.45;

      if (isGate) {
        this.pulseGates.push({
          lane,
          x: this.lanes[lane],
          y: -50,
          width: 76,
          height: 28
        });
      } else {
        this.traffic.push({
          lane,
          x: this.lanes[lane],
          y: -80,
          width: 50,
          height: 80,
          color: Math.random() > 0.5 ? '#e11d48' : '#7c3aed'
        });
      }
    }

    // Update traffic
    for (let t = this.traffic.length - 1; t >= 0; t--) {
      const car = this.traffic[t];
      car.y += this.speed * 0.85;

      // Hitbox
      const hitX = Math.abs(car.x - this.carX) < 40;
      const hitY = Math.abs(car.y - this.carY) < 55;

      if (hitX && hitY) {
        this.gameOver();
        return;
      }

      if (car.y > LOGICAL_HEIGHT + 80) {
        this.score += 30;
        this.checkHighScore();
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        this.traffic.splice(t, 1);
      }
    }

    // Update pulse energy gates
    for (let g = this.pulseGates.length - 1; g >= 0; g--) {
      const gate = this.pulseGates[g];
      gate.y += this.speed;

      const hitX = Math.abs(gate.x - this.carX) < 42;
      const hitY = Math.abs(gate.y - this.carY) < 36;

      if (hitX && hitY) {
        this.score += 200;
        this.boostTimer = 1800; // 1.8s nitro boost
        this.checkHighScore();
        playAudio('boost');

        // Spawn pulse wave burst
        for (let p = 0; p < 12; p++) {
          this.pulseParticles.push({
            x: this.carX,
            y: this.carY,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color: Math.random() > 0.5 ? '#00f2fe' : '#ff6bfd',
            alpha: 1.0,
            radius: Math.random() * 4 + 3
          });
        }

        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        this.pulseGates.splice(g, 1);
        continue;
      }

      if (gate.y > LOGICAL_HEIGHT + 50) {
        this.pulseGates.splice(g, 1);
      }
    }

    // Update pulse particles
    for (let p = this.pulseParticles.length - 1; p >= 0; p--) {
      const pt = this.pulseParticles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.04;
      if (pt.alpha <= 0) this.pulseParticles.splice(p, 1);
    }
  }

  render() {
    const ctx = this.ctx;

    // Deep Cyber Synthwave Horizon Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    bgGrad.addColorStop(0, '#0a0014');
    bgGrad.addColorStop(0.35, '#2e0854');
    bgGrad.addColorStop(0.55, '#ff007f');
    bgGrad.addColorStop(0.56, '#0f051d');
    bgGrad.addColorStop(1, '#05020a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Giant Neon Synthwave Sun on Horizon
    const horizonY = 320;
    ctx.save();
    const sunGrad = ctx.createLinearGradient(0, horizonY - 140, 0, horizonY);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.5, '#f43f5e');
    sunGrad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = sunGrad;
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(320, horizonY, 110, Math.PI, 0);
    ctx.fill();

    // Horizontal Sun Slits
    ctx.fillStyle = '#0a0014';
    for (let s = 1; s <= 6; s++) {
      const slitY = horizonY - s * 14;
      ctx.fillRect(200, slitY, 240, s * 1.8);
    }
    ctx.restore();

    // Perspective Wireframe Grid Road
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    ctx.lineWidth = 1.5;

    // Horizon line
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(LOGICAL_WIDTH, horizonY);
    ctx.stroke();

    // Vanishing perspective rays from center horizon
    const rayAngles = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
    rayAngles.forEach((ang) => {
      ctx.beginPath();
      ctx.moveTo(320, horizonY);
      ctx.lineTo(320 + ang * 520, LOGICAL_HEIGHT);
      ctx.stroke();
    });

    // Horizontal receding grid rungs
    for (let gy = 0; gy < 320; gy += 28) {
      const yNorm = (gy + this.gridOffset) % 320;
      // Exponential perspective spacing
      const actualY = horizonY + Math.pow(yNorm / 320, 1.8) * 320;
      ctx.strokeStyle = `rgba(255, 107, 253, ${Math.min(0.7, (actualY - horizonY) / 320)})`;
      ctx.beginPath();
      ctx.moveTo(0, actualY);
      ctx.lineTo(LOGICAL_WIDTH, actualY);
      ctx.stroke();
    }
    ctx.restore();

    // 3 Highway Track Boundaries
    this.lanes.forEach((lx) => {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx - 44, horizonY + 40);
      ctx.lineTo(lx - 54, LOGICAL_HEIGHT);
      ctx.moveTo(lx + 44, horizonY + 40);
      ctx.lineTo(lx + 54, LOGICAL_HEIGHT);
      ctx.stroke();
    });

    // Render Pulse Gates (Neon Boost Arches)
    this.pulseGates.forEach((gate) => {
      ctx.save();
      ctx.translate(gate.x, gate.y);

      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-gate.width / 2, -gate.height / 2, gate.width, gate.height, 8);
      ctx.stroke();

      // Energy bar in center
      ctx.fillStyle = '#ff6bfd';
      ctx.shadowColor = '#ff6bfd';
      ctx.shadowBlur = 12;
      ctx.fillRect(-gate.width / 2 + 8, -3, gate.width - 16, 6);
      ctx.restore();
    });

    // Render Cyber Traffic
    this.traffic.forEach((car) => {
      ctx.save();
      ctx.translate(car.x, car.y);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 26, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Truck Body
      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.roundRect(-22, -38, 44, 76, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Neon roof light
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 10;
      ctx.fillRect(-14, -10, 28, 6);

      // Red Tail Neon Bar
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 14;
      ctx.fillRect(-18, 32, 36, 4);
      ctx.restore();
    });

    // Render Pulse Particles
    this.pulseParticles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Render Player Cyber Interceptor Supercar
    ctx.save();
    ctx.translate(this.carX, this.carY);

    // Nitro flame jets when boosting
    if (this.boostTimer > 0) {
      ctx.save();
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(-12, 38);
      ctx.lineTo(-6, 68 + Math.random() * 20);
      ctx.lineTo(0, 38);
      ctx.lineTo(6, 68 + Math.random() * 20);
      ctx.lineTo(12, 38);
      ctx.fill();
      ctx.restore();
    }

    // Ground Neon Underglow
    ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 34, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aerodynamic Cyber Wedge Body (Electric Cyan & Chrome)
    const carGrad = ctx.createLinearGradient(-24, 0, 24, 0);
    carGrad.addColorStop(0, '#0369a1');
    carGrad.addColorStop(0.5, '#00f2fe');
    carGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = carGrad;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(24, 28);
    ctx.lineTo(18, 38);
    ctx.lineTo(-18, 38);
    ctx.lineTo(-24, 28);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dark Cockpit Canopy
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(12, 14);
    ctx.lineTo(-12, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rear Neon Light Bar
    ctx.fillStyle = '#ff6bfd';
    ctx.shadowColor = '#ff6bfd';
    ctx.shadowBlur = 14;
    ctx.fillRect(-16, 34, 32, 4);

    // Front Neon Headlight Blades
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 12;
    ctx.fillRect(-18, -26, 6, 12);
    ctx.fillRect(12, -26, 6, 12);

    ctx.restore();
  }
}
