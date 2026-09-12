import { playAudio, getAudioContext } from './audio.js';
import { getStorageNumber, setStorageNumber } from './storage.js';

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
      { name: 'Road Grader', emoji: '🚜' },
      { name: 'Tower Boom Crane', emoji: '🏗️' },
      { name: 'Hydraulic Rock Breaker', emoji: '⛏️' },
      { name: 'Heavy Haul Truck', emoji: '🚚' },
      { name: 'Rock Dump Truck', emoji: '🚛' },
      { name: 'Fuel Jerry Cans', emoji: '⛽' },
      { name: 'Hydraulic Oil Drum', emoji: '🛢️' },
      { name: 'Mine Support 4x4 Rig', emoji: '🛻' },
      { name: 'Construction Barrier', emoji: '🚧' },
      { name: 'Tool Maintenance Station', emoji: '🧰' },
      { name: 'Power Generator', emoji: '⚡' },
      { name: 'Mining Hardhat Unit', emoji: '🪖' }
    ];

    this.snake = [];
    this.convoyMachinery = [];
    this.equipmentCycleIndex = 0;
    this.snakeDir = { x: 1, y: 0 };
    this.dirQueue = [];
    this.haulRock = null;
    this.stepInterval = 150;
    this.timer = 0;
    this.highScoreBroken = false;
  }

  init() {
    this.highScore = getStorageNumber(this.storageKey, 0);
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
    } while (this.snake.some((seg) => seg.x === pos.x && seg.y === pos.y) && attempts < 200);
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
    this.dirQueue = [];
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
    const lastDir = this.dirQueue.length > 0 ? this.dirQueue[this.dirQueue.length - 1] : this.snakeDir;
    // Reject immediate 180-degree turn
    if (lastDir.x + newDir.x === 0 && lastDir.y + newDir.y === 0) return;
    // Don't queue identical direction
    if (lastDir.x === newDir.x && lastDir.y === newDir.y) return;
    if (this.dirQueue.length < 2) {
      this.dirQueue.push(newDir);
      playAudio('turn');
    }
  }

  update(delta) {
    if (!this.isRunning || this.isOver) return;

    this.timer += delta;
    if (this.timer < this.stepInterval) return;
    this.timer = 0;

    if (this.dirQueue.length > 0) {
      this.snakeDir = this.dirQueue.shift();
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
      setStorageNumber(this.storageKey, this.highScore);
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

    // Render rock objective (Clean Glowing Target Beacon with High-Contrast Rock Emoji)
    if (this.haulRock) {
      const rx = this.haulRock.x * this.gridSize + this.gridSize / 2;
      const ry = this.haulRock.y * this.gridSize + this.gridSize / 2;

      ctx.save();
      // Glowing amber pulse aura
      const auraGrad = ctx.createRadialGradient(rx, ry, 2, rx, ry, this.gridSize * 0.68);
      auraGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
      auraGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.15)');
      auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(rx, ry, this.gridSize * 0.68, 0, Math.PI * 2);
      ctx.fill();

      // Golden targeting beacon ring
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(rx, ry, this.gridSize * 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Clean Gold/Quartz Boulder Emoji centered
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.font = `${Math.round(this.gridSize * 0.72)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🪨', rx, ry);
      ctx.restore();
    }

    // Render convoy snake (Lead Haul Truck Cab + Mining Equipment Trailers)
    if (this.snake.length) {
      // 1. Trailing Real-Life Mining Equipment Trailers (Back to Front)
      for (let i = this.snake.length - 1; i >= 1; i--) {
        const segX = this.snake[i].x * this.gridSize + this.gridSize / 2;
        const segY = this.snake[i].y * this.gridSize + this.gridSize / 2;
        const half = this.gridSize * 0.44;
        const emoji = this.convoyMachinery[i - 1] || this.equipmentRoster[(i - 1) % this.equipmentRoster.length].emoji;

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

        // Trailer drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.beginPath();
        ctx.ellipse(0, half * 0.85, half * 1.15, half * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Industrial Flatbed Pad (Charcoal with Amber Border)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(-half, -half, half * 2, half * 2, 7);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Authentic Real-Life Mining Equipment Emoji Icon
        ctx.font = `${Math.round(this.gridSize * 0.74)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 0, 1);

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
