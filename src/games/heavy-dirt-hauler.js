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

    // Render rock objective
    if (this.haulRock) {
      const rx = this.haulRock.x * this.gridSize + this.gridSize / 2;
      const ry = this.haulRock.y * this.gridSize + this.gridSize / 2;

      ctx.save();
      // Target pulse circle
      ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.beginPath();
      ctx.arc(rx, ry, this.gridSize * 0.58, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${Math.floor(this.gridSize * 0.8)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.fillText('🪨', rx, ry);
      ctx.restore();
    }

    // Render convoy snake
    if (this.snake.length) {
      ctx.save();
      ctx.font = `${Math.floor(this.gridSize * 0.78)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Lead Truck
      const headX = this.snake[0].x * this.gridSize + this.gridSize / 2;
      const headY = this.snake[0].y * this.gridSize + this.gridSize / 2;
      const headEmoji = this.snakeDir.x < 0 ? '🚛' : '🚚';

      ctx.shadowColor = 'rgba(0, 242, 254, 0.7)';
      ctx.shadowBlur = 12;
      ctx.fillText(headEmoji, headX, headY);

      // Trailing Heavy Equipment
      ctx.shadowBlur = 0;
      for (let i = 1; i < this.snake.length; i++) {
        const segX = this.snake[i].x * this.gridSize + this.gridSize / 2;
        const segY = this.snake[i].y * this.gridSize + this.gridSize / 2;
        const equipmentEmoji =
          this.convoyMachinery[i - 1] ||
          this.equipmentRoster[(i - 1) % this.equipmentRoster.length].emoji;
        ctx.fillText(equipmentEmoji, segX, segY);
      }
      ctx.restore();
    }
  }
}
