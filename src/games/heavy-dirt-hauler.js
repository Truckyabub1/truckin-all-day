import { playAudio, getAudioContext } from './audio.js';

export const LOGICAL_WIDTH = 640;
export const LOGICAL_HEIGHT = 640;

export class HeavyDirtHaulerEngine {
  constructor(canvas, ctx, onScoreUpdate, onGameOver, onAchievement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onAchievement = onAchievement;
    this.storageKey = 'dirtHaulerHighScore';
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isOver = false;
    this.cellCount = 20;
    this.gridSize = LOGICAL_WIDTH / 20;

    this.equipmentRoster = [
      { name: 'Hydraulic Excavator', emoji: '🚜' },
      { name: 'Tower Crane', emoji: '🏗️' },
      { name: 'Road Roller Compactor', emoji: '🚧' },
      { name: 'Front Loader', emoji: '🚜' },
      { name: 'Cement Concrete Mixer', emoji: '🚛' },
      { name: 'Diesel Fuel Tanker', emoji: '⛽' },
      { name: 'Hydraulic Supply Carrier', emoji: '🛢️' },
      { name: 'Rock Drilling Rig', emoji: '⛏️' }
    ];

    this.snake = [];
    this.convoyMachinery = [];
    this.equipmentCycleIndex = 0;
    this.snakeDir = { x: 1, y: 0 };
    this.nextSnakeDir = null;
    this.haulRock = null;
    this.stepInterval = 150;
    this.timer = 0;
    this.highScoreBroken = false;
  }

  init() {
    this.highScore = Number(localStorage.getItem(this.storageKey)) || 0;
    this.highScoreBroken = false;
  }

  getRandomRock() {
    let pos;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * this.cellCount),
        y: Math.floor(Math.random() * this.cellCount)
      };
      attempts++;
    } while (this.snake.some((seg) => seg.x === pos.x && seg.y === pos.y) && attempts < 100);
    return pos;
  }

  reset() {
    this.score = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;
    this.snake = [
      { x: 6, y: 10 },
      { x: 5, y: 10 },
      { x: 4, y: 10 }
    ];
    this.convoyMachinery = [
      this.equipmentRoster[0].emoji,
      this.equipmentRoster[1].emoji
    ];
    this.equipmentCycleIndex = 2;
    this.snakeDir = { x: 1, y: 0 };
    this.nextSnakeDir = null;
    this.haulRock = this.getRandomRock();
    this.stepInterval = 150;
    this.timer = 0;
    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
    this.render();
  }

  start() {
    getAudioContext();
    this.reset();
    this.isRunning = true;
    this.isOver = false;
  }

  setDirection(newDir) {
    if (!newDir) return;
    if (this.snakeDir.x + newDir.x === 0 && this.snakeDir.y + newDir.y === 0) return;
    this.nextSnakeDir = newDir;
    playAudio('turn');
  }

  update(delta) {
    if (!this.isRunning || this.isOver) return;

    this.timer += delta;
    if (this.timer < this.stepInterval) return;
    this.timer = 0;

    if (this.nextSnakeDir) {
      this.snakeDir = this.nextSnakeDir;
      this.nextSnakeDir = null;
    }

    const nextHead = {
      x: this.snake[0].x + this.snakeDir.x,
      y: this.snake[0].y + this.snakeDir.y
    };

    // Wall collision
    if (
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= this.cellCount ||
      nextHead.y >= this.cellCount
    ) {
      this.gameOver();
      return;
    }

    // Body collision
    for (let i = 0; i < this.snake.length - 1; i++) {
      if (this.snake[i].x === nextHead.x && this.snake[i].y === nextHead.y) {
        this.gameOver();
        return;
      }
    }

    const ateRock =
      this.haulRock &&
      nextHead.x === this.haulRock.x &&
      nextHead.y === this.haulRock.y;

    this.snake.unshift(nextHead);

    if (ateRock) {
      this.score += 100;
      this.checkHighScore();
      playAudio('pickup');

      const piece =
        this.equipmentRoster[this.equipmentCycleIndex % this.equipmentRoster.length].emoji;
      this.convoyMachinery.unshift(piece);
      this.equipmentCycleIndex++;

      this.haulRock = this.getRandomRock();
      this.stepInterval = Math.max(80, 150 - Math.floor(this.score / 200) * 8);
      if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
    } else {
      this.snake.pop();
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
        if (this.onAchievement) this.onAchievement('🏆', 'New Haul Record Set!');
      }
    }
  }

  gameOver() {
    this.isRunning = false;
    this.isOver = true;
    playAudio('crash');
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  render() {
    const ctx = this.ctx;
    // Canvas background
    const bgGrad = ctx.createLinearGradient(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    bgGrad.addColorStop(0, '#0c0f16');
    bgGrad.addColorStop(1, '#05070a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Subtle construction grid pattern
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.cellCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.gridSize, 0);
      ctx.lineTo(i * this.gridSize, LOGICAL_HEIGHT);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * this.gridSize);
      ctx.lineTo(LOGICAL_WIDTH, i * this.gridSize);
      ctx.stroke();
    }
    ctx.restore();

    // Render rock objective (Pure Vector Faceted Gold/Quartz Boulder)
    if (this.haulRock) {
      const rx = this.haulRock.x * this.gridSize + this.gridSize / 2;
      const ry = this.haulRock.y * this.gridSize + this.gridSize / 2;
      const rSize = this.gridSize * 0.42;

      ctx.save();
      // Amber target pulse aura
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.beginPath();
      ctx.arc(rx, ry, this.gridSize * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Faceted boulder polygons
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(rx - rSize, ry);
      ctx.lineTo(rx - rSize * 0.5, ry - rSize * 0.9);
      ctx.lineTo(rx + rSize * 0.6, ry - rSize * 0.7);
      ctx.lineTo(rx + rSize, ry + rSize * 0.1);
      ctx.lineTo(rx + rSize * 0.4, ry + rSize * 0.9);
      ctx.lineTo(rx - rSize * 0.7, ry + rSize * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner facet facets
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(rx - rSize * 0.5, ry - rSize * 0.9);
      ctx.lineTo(rx, ry - rSize * 0.2);
      ctx.lineTo(rx + rSize * 0.6, ry - rSize * 0.7);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.moveTo(rx, ry - rSize * 0.2);
      ctx.lineTo(rx + rSize * 0.4, ry + rSize * 0.2);
      ctx.lineTo(rx + rSize, ry + rSize * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Render convoy snake (Pure Vector 18-Wheeler Cab & Cargo Trailers)
    if (this.snake.length) {
      // 1. Trailing Cargo Trailers (Back to Front)
      for (let i = this.snake.length - 1; i >= 1; i--) {
        const segX = this.snake[i].x * this.gridSize + this.gridSize / 2;
        const segY = this.snake[i].y * this.gridSize + this.gridSize / 2;
        const half = this.gridSize * 0.38;
        const trailerType = i % 4;

        ctx.save();
        ctx.translate(segX, segY);

        // Hitch connector line to previous segment
        const nextSeg = this.snake[i - 1];
        const dx = (nextSeg.x - this.snake[i].x) * this.gridSize;
        const dy = (nextSeg.y - this.snake[i].y) * this.gridSize;
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(dx * 0.5, dy * 0.5);
        ctx.stroke();

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, half * 0.8, half * 1.1, half * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (trailerType === 0) {
          // Yellow Excavator / Dump Bed
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.roundRect(-half, -half, half * 2, half * 2, 4);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Heaped dirt load
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(0, 0, half * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (trailerType === 1) {
          // Fuel Tanker (Cylindrical Silver)
          const tankGrad = ctx.createLinearGradient(-half, 0, half, 0);
          tankGrad.addColorStop(0, '#6b7280');
          tankGrad.addColorStop(0.5, '#e5e7eb');
          tankGrad.addColorStop(1, '#4b5563');
          ctx.fillStyle = tankGrad;
          ctx.beginPath();
          ctx.roundRect(-half, -half * 0.9, half * 2, half * 1.8, 8);
          ctx.fill();
          ctx.strokeStyle = '#9ca3af';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Hazard orange band
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-half * 0.25, -half * 0.9, half * 0.5, half * 1.8);
        } else if (trailerType === 2) {
          // Industrial Machinery Flatbed
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(-half, -half, half * 2, half * 2, 3);
          ctx.fill();
          ctx.strokeStyle = '#00f2fe';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Crane / cog cargo
          ctx.fillStyle = '#00f2fe';
          ctx.beginPath();
          ctx.arc(0, 0, half * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Heavy Ore Freight Box
          ctx.fillStyle = '#374151';
          ctx.beginPath();
          ctx.roundRect(-half, -half, half * 2, half * 2, 4);
          ctx.fill();
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Cross brace
          ctx.strokeStyle = '#9ca3af';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-half * 0.7, -half * 0.7);
          ctx.lineTo(half * 0.7, half * 0.7);
          ctx.moveTo(half * 0.7, -half * 0.7);
          ctx.lineTo(-half * 0.7, half * 0.7);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 2. Lead Semi-Truck Cab (Front)
      const headX = this.snake[0].x * this.gridSize + this.gridSize / 2;
      const headY = this.snake[0].y * this.gridSize + this.gridSize / 2;
      const half = this.gridSize * 0.44;

      ctx.save();
      ctx.translate(headX, headY);

      // Rotate cab to face movement direction
      let angle = 0;
      if (this.snakeDir.x === 1) angle = 0;
      else if (this.snakeDir.x === -1) angle = Math.PI;
      else if (this.snakeDir.y === 1) angle = Math.PI / 2;
      else if (this.snakeDir.y === -1) angle = -Math.PI / 2;
      ctx.rotate(angle);

      // Cab shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(0, 2, half * 1.15, half * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Cab Body (Electric Cyan Chrome Truck)
      const cabGrad = ctx.createLinearGradient(-half, 0, half, 0);
      cabGrad.addColorStop(0, '#0284c7');
      cabGrad.addColorStop(0.5, '#00f2fe');
      cabGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = cabGrad;
      ctx.beginPath();
      ctx.roundRect(-half, -half * 0.85, half * 2, half * 1.7, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Windshield
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(half * 0.15, -half * 0.65, half * 0.6, half * 1.3, 3);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Dual Chrome Exhaust Stacks
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-half * 0.6, -half * 0.95, 4, 3);
      ctx.fillRect(-half * 0.6, half * 0.8, 4, 3);

      // Headlights with beam glow
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(half * 0.9, -half * 0.5, 3, 0, Math.PI * 2);
      ctx.arc(half * 0.9, half * 0.5, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
