import { playAudio, getAudioContext } from './audio.js';

export const LOGICAL_WIDTH = 640;
export const LOGICAL_HEIGHT = 640;

export class TimberHollowTrailEngine {
  constructor(canvas, ctx, onScoreUpdate, onGameOver, onAchievement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onAchievement = onAchievement;
    this.storageKey = 'timberTrailHighScore';
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;

    // Road Bounds: Road is centered, width 380 (x: 130 to 510)
    this.roadLeft = 130;
    this.roadRight = 510;
    this.truckX = 320;
    this.truckY = 520;
    this.truckVx = 0;
    this.truckWidth = 56;
    this.truckHeight = 88;
    this.steerInput = 0; // -1, 0, 1

    this.obstacles = []; // Fallen timber logs, boulders
    this.pickups = []; // Vinyl record crates
    this.fogParticles = [];
    this.spawnTimer = 0;
    this.speed = 5.6;
    this.roadStripeOffset = 0;
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
    this.truckX = 320;
    this.truckVx = 0;
    this.steerInput = 0;
    this.obstacles = [];
    this.pickups = [];
    this.fogParticles = [];
    this.spawnTimer = 0;
    this.speed = 5.6;
    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
    this.render();
  }

  start() {
    getAudioContext();
    this.reset();
    this.isRunning = true;
    this.isOver = false;
  }

  setSteer(dir) {
    if (!this.isRunning || this.isOver) {
      this.start();
      return;
    }
    this.steerInput = dir;
    if (dir !== 0) playAudio('swerve');
  }

  checkHighScore() {
    if (this.score > this.highScore) {
      const isFirstBreak = !this.highScoreBroken && this.highScore > 0;
      this.highScore = this.score;
      localStorage.setItem(this.storageKey, String(this.highScore));
      if (isFirstBreak) {
        this.highScoreBroken = true;
        playAudio('highscore');
        if (this.onAchievement) this.onAchievement('🏆', 'New Mountain Record Set!');
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

    // Smooth physics steering
    const targetVx = this.steerInput * 6.5;
    this.truckVx += (targetVx - this.truckVx) * 0.22;
    this.truckX += this.truckVx;

    // Road boundaries
    const minX = this.roadLeft + this.truckWidth / 2 + 10;
    const maxX = this.roadRight - this.truckWidth / 2 - 10;
    if (this.truckX < minX) {
      this.truckX = minX;
      this.truckVx = 0;
    } else if (this.truckX > maxX) {
      this.truckX = maxX;
      this.truckVx = 0;
    }

    this.roadStripeOffset = (this.roadStripeOffset + this.speed) % 50;
    this.speed = Math.min(10.0, 5.6 + Math.floor(this.score / 350) * 0.45);

    // Spawning hazards & vinyl crates
    this.spawnTimer += delta;
    if (this.spawnTimer > Math.max(600, 1150 - Math.floor(this.score / 200) * 45)) {
      this.spawnTimer = 0;
      const spawnX = this.roadLeft + 35 + Math.random() * (this.roadRight - this.roadLeft - 70);
      const isHazard = Math.random() > 0.38;

      if (isHazard) {
        this.obstacles.push({
          x: spawnX,
          y: -50,
          width: 64,
          height: 26,
          type: Math.random() > 0.4 ? 'log' : 'rock'
        });
      } else {
        this.pickups.push({
          x: spawnX,
          y: -40,
          size: 26,
          spinAngle: 0
        });
      }
    }

    // Update obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.y += this.speed;

      // Hitbox
      const hitX = Math.abs(obs.x - this.truckX) < (obs.width / 2 + this.truckWidth / 2 - 8);
      const hitY = Math.abs(obs.y - this.truckY) < (obs.height / 2 + this.truckHeight / 2 - 12);

      if (hitX && hitY) {
        this.gameOver();
        return;
      }

      if (obs.y > LOGICAL_HEIGHT + 50) {
        this.score += 25;
        this.checkHighScore();
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        this.obstacles.splice(i, 1);
      }
    }

    // Update vinyl crate pickups
    for (let p = this.pickups.length - 1; p >= 0; p--) {
      const crate = this.pickups[p];
      crate.y += this.speed;
      crate.spinAngle += 0.05;

      const hitX = Math.abs(crate.x - this.truckX) < (crate.size + this.truckWidth / 2 - 6);
      const hitY = Math.abs(crate.y - this.truckY) < (crate.size + this.truckHeight / 2 - 6);

      if (hitX && hitY) {
        this.score += 150;
        this.checkHighScore();
        playAudio('pickup');
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        this.pickups.splice(p, 1);
        continue;
      }

      if (crate.y > LOGICAL_HEIGHT + 50) {
        this.pickups.splice(p, 1);
      }
    }

    // Drift ambient fog
    if (Math.random() > 0.5) {
      this.fogParticles.push({
        x: Math.random() * LOGICAL_WIDTH,
        y: -20,
        vy: this.speed * 0.4 + Math.random(),
        radius: 30 + Math.random() * 40,
        alpha: 0.18
      });
    }

    for (let f = this.fogParticles.length - 1; f >= 0; f--) {
      const fog = this.fogParticles[f];
      fog.y += fog.vy;
      fog.alpha -= 0.001;
      if (fog.y > LOGICAL_HEIGHT + 50 || fog.alpha <= 0) {
        this.fogParticles.splice(f, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;

    // Night sky background with Appalachian misty gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    skyGrad.addColorStop(0, '#04070c');
    skyGrad.addColorStop(0.4, '#09131d');
    skyGrad.addColorStop(1, '#050c12');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Pine Forest Silhouettes on sides
    ctx.fillStyle = '#061017';
    for (let y = 0; y < LOGICAL_HEIGHT; y += 70) {
      // Left pines
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(80, y + 35);
      ctx.lineTo(0, y + 70);
      ctx.fill();
      // Right pines
      ctx.beginPath();
      ctx.moveTo(LOGICAL_WIDTH, y);
      ctx.lineTo(LOGICAL_WIDTH - 80, y + 35);
      ctx.lineTo(LOGICAL_WIDTH, y + 70);
      ctx.fill();
    }

    // Asphalt Mountain Road
    const roadGrad = ctx.createLinearGradient(this.roadLeft, 0, this.roadRight, 0);
    roadGrad.addColorStop(0, '#1c1f24');
    roadGrad.addColorStop(0.5, '#2b3038');
    roadGrad.addColorStop(1, '#1c1f24');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(this.roadLeft, 0, this.roadRight - this.roadLeft, LOGICAL_HEIGHT);

    // Road Verge / Guardrail line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.roadLeft, 0);
    ctx.lineTo(this.roadLeft, LOGICAL_HEIGHT);
    ctx.moveTo(this.roadRight, 0);
    ctx.lineTo(this.roadRight, LOGICAL_HEIGHT);
    ctx.stroke();

    // Center Yellow Dashed Line
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.setLineDash([28, 22]);
    ctx.lineDashOffset = -this.roadStripeOffset;
    ctx.beginPath();
    ctx.moveTo(320, 0);
    ctx.lineTo(320, LOGICAL_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Dynamic Headlight Beam Projections
    ctx.save();
    ctx.translate(this.truckX, this.truckY - 35);
    const lightGrad = ctx.createLinearGradient(0, 0, 0, -280);
    lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    lightGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.12)');
    lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-75, -280);
    ctx.lineTo(75, -280);
    ctx.lineTo(16, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Render Obstacles (Fallen Timber Logs / Boulders)
    this.obstacles.forEach((obs) => {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      if (obs.type === 'log') {
        // Bark brown timber log
        ctx.fillStyle = '#5c2c10';
        ctx.beginPath();
        ctx.roundRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height, 6);
        ctx.fill();
        ctx.strokeStyle = '#7c3f1d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tree ring end cap
        ctx.fillStyle = '#d4a373';
        ctx.beginPath();
        ctx.ellipse(obs.width / 2 - 4, 0, 4, obs.height / 2 - 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8c532b';
        ctx.stroke();

        // Bark grooves
        ctx.strokeStyle = '#381704';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-obs.width * 0.35, -2);
        ctx.lineTo(obs.width * 0.25, -2);
        ctx.moveTo(-obs.width * 0.2, 5);
        ctx.lineTo(obs.width * 0.15, 5);
        ctx.stroke();
      } else {
        // Mountain Crag Rock
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(-20, 10);
        ctx.lineTo(-12, -14);
        ctx.lineTo(14, -12);
        ctx.lineTo(22, 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    });

    // Render Vinyl Record Pickups
    this.pickups.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spinAngle);

      // Vinyl Record Shadow
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;

      // Vinyl Outer Groove (Black grooved disc)
      ctx.fillStyle = '#090a0f';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sound grooves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
      ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
      ctx.stroke();

      // Center Label (Vintage Cyan)
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Center spindle hole
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render 1970s Mountain Vintage Pickup Truck
    ctx.save();
    ctx.translate(this.truckX, this.truckY);
    // Truck body roll when turning
    ctx.rotate(this.truckVx * 0.035);

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 30, 44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Truck Cab & Bed (Classic Maroon / Rust Red)
    const truckGrad = ctx.createLinearGradient(-26, 0, 26, 0);
    truckGrad.addColorStop(0, '#7f1d1d');
    truckGrad.addColorStop(0.5, '#b91c1c');
    truckGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = truckGrad;
    ctx.beginPath();
    ctx.roundRect(-24, -40, 48, 80, 8);
    ctx.fill();
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Truck Bed (Rear open cargo tray)
    ctx.fillStyle = '#1e1010';
    ctx.fillRect(-20, 0, 40, 34);
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, 0, 40, 34);

    // Front Windshield
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-18, -26, 36, 18, 4);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chrome Bumper (Front)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-22, -42, 44, 4);

    // Twin Headlights
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-16, -40, 3.5, 0, Math.PI * 2);
    ctx.arc(16, -40, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Red Tail lights
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.fillRect(-22, 38, 6, 3);
    ctx.fillRect(16, 38, 6, 3);
    ctx.restore();

    // Misty Mountain Fog Overlay
    this.fogParticles.forEach((fog) => {
      ctx.fillStyle = `rgba(186, 230, 253, ${fog.alpha})`;
      ctx.beginPath();
      ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
