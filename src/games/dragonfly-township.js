import { playAudio, getAudioContext } from './audio.js';
import { getStorageNumber, setStorageNumber } from './storage.js';

export const LOGICAL_WIDTH = 640;
export const LOGICAL_HEIGHT = 640;

export class DragonflyTownshipEngine {
  constructor(canvas, ctx, onScoreUpdate, onGameOver, onAchievement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onAchievement = onAchievement;
    this.storageKey = 'dragonflyTownshipHighScore';

    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;

    // Dragonfly Flight State
    this.x = 320;
    this.y = 180;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0; // In radians (0 is pointing up)
    this.rotSpeed = 0;
    this.thrusting = false;
    this.braking = false;
    this.wingPhase = 0;
    this.legsExtended = 0; // 0 (tucked) to 1 (extended)

    // Resources & Stats
    this.fuel = 100;
    this.maxFuel = 100;
    this.deliveries = 0;
    this.targetStationId = null;
    this.isLanded = false;
    this.landedStation = null;
    this.landTimer = 0;
    this.lowFuelWarningTimer = 0;

    // Wind & Environment
    this.wind = 0;
    this.windTarget = 0;
    this.windChangeTimer = 0;
    this.particles = [];
    this.floatTexts = [];
    this.sunrayAngle = 0;
    this.windmillAngle = 0;
    this.waterwheelAngle = 0;

    // Controls
    this.steerInput = 0; // -1 (left), 1 (right)

    // Landing Stations
    this.stations = [
      {
        id: 'fuel',
        name: 'Nectar Fuel Depot',
        type: 'fuel',
        x: 80,
        y: 480,
        width: 80,
        height: 16,
        color: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.6)',
        icon: '⛽',
        dockY: 480
      },
      {
        id: 'townhall',
        name: 'Town Hall Helipad',
        type: 'delivery',
        x: 320,
        y: 440,
        width: 74,
        height: 14,
        color: '#00f2fe',
        glow: 'rgba(0, 242, 254, 0.6)',
        icon: '🏛️',
        dockY: 440
      },
      {
        id: 'windmill',
        name: 'Windmill Perch',
        type: 'delivery',
        x: 520,
        y: 380,
        width: 68,
        height: 14,
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.6)',
        icon: '🌾',
        dockY: 380
      },
      {
        id: 'watermill',
        name: 'River Boardwalk',
        type: 'delivery',
        x: 180,
        y: 530,
        width: 76,
        height: 14,
        color: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.6)',
        icon: '🌊',
        dockY: 530
      },
      {
        id: 'clocktower',
        name: 'Clocktower Spire',
        type: 'delivery',
        x: 430,
        y: 320,
        width: 60,
        height: 12,
        color: '#ff6bfd',
        glow: 'rgba(255, 107, 253, 0.6)',
        icon: '🕰️',
        dockY: 320
      }
    ];
  }

  init() {
    this.highScore = getStorageNumber(this.storageKey, 0);
    this.highScoreBroken = false;
  }

  reset() {
    this.score = 0;
    this.deliveries = 0;
    this.isRunning = false;
    this.isOver = false;
    this.highScoreBroken = false;

    this.x = 320;
    this.y = 200;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.rotSpeed = 0;
    this.thrusting = false;
    this.braking = false;
    this.steerInput = 0;
    this.fuel = 100;
    this.isLanded = false;
    this.landedStation = null;
    this.landTimer = 0;
    this.particles = [];
    this.floatTexts = [];
    this.wind = 0;

    // Pick first target station (not fuel)
    this.pickNextTarget();

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.highScore);
    }
    this.render();
  }

  start() {
    getAudioContext();
    this.reset();
    this.isRunning = true;
    this.isOver = false;
    this.addFloatText(320, 260, 'DELIVER TO TARGET PADS!', '#00f2fe', 22);
    playAudio('flutter');
  }

  pickNextTarget() {
    const deliveryStations = this.stations.filter(s => s.type === 'delivery' && s.id !== this.targetStationId);
    const chosen = deliveryStations[Math.floor(Math.random() * deliveryStations.length)];
    this.targetStationId = chosen ? chosen.id : 'townhall';
  }

  // --- Controls ---
  setSteer(dir) {
    if (!this.isRunning || this.isOver) {
      this.start();
      return;
    }
    this.steerInput = Math.max(-1, Math.min(1, dir));
  }

  setThrust(active) {
    if (!this.isRunning || this.isOver) {
      if (active) this.start();
      return;
    }
    this.thrusting = Boolean(active);
    if (this.thrusting && this.fuel > 0) {
      playAudio('flutter');
    }
  }

  setBrake(active) {
    this.braking = Boolean(active);
  }

  checkHighScore() {
    if (this.score > this.highScore) {
      const isFirstBreak = !this.highScoreBroken && this.highScore > 0;
      this.highScore = this.score;
      setStorageNumber(this.storageKey, this.highScore);
      if (isFirstBreak) {
        this.highScoreBroken = true;
        playAudio('highscore');
        if (this.onAchievement) {
          this.onAchievement('🏆', 'New Township Record Set!');
        }
      }
    }
  }

  gameOver(reason = 'CRASH!') {
    this.isRunning = false;
    this.isOver = true;
    this.thrusting = false;
    playAudio('crash');
    this.addFloatText(this.x, this.y - 20, reason, '#ef4444', 24);

    // Spawn explosion debris particles
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        size: 3 + Math.random() * 4,
        color: ['#00f2fe', '#f59e0b', '#ff6bfd', '#ffffff'][Math.floor(Math.random() * 4)]
      });
    }

    if (this.onGameOver) {
      this.onGameOver(this.score, this.highScore);
    }
  }

  addFloatText(x, y, text, color = '#00f2fe', size = 16) {
    this.floatTexts.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1.0,
      vy: -1.2
    });
  }

  update(delta) {
    if (!this.isRunning || this.isOver) return;

    const dt = delta / 1000;

    // Wing flapping animation
    const flapSpeed = this.thrusting ? 45 : (this.isLanded ? 6 : 22);
    this.wingPhase += flapSpeed * dt;

    // Town ambient animations
    this.windmillAngle += 0.02;
    this.waterwheelAngle += 0.03;
    this.sunrayAngle += 0.005;

    // Smoke particles from chimneys
    if (Math.random() < 0.25) {
      this.particles.push({
        x: 270 + (Math.random() - 0.5) * 6,
        y: 450,
        vx: (Math.random() - 0.5) * 0.4 + this.wind * 0.2,
        vy: -0.8 - Math.random() * 0.5,
        size: 3 + Math.random() * 3,
        life: 1.0,
        decay: 0.012,
        color: 'rgba(200, 210, 225, 0.4)'
      });
    }

    // Low fuel warning
    if (this.fuel <= 20 && this.fuel > 0) {
      this.lowFuelWarningTimer += dt;
      if (this.lowFuelWarningTimer > 1.2) {
        this.lowFuelWarningTimer = 0;
        playAudio('low_fuel');
        this.addFloatText(this.x, this.y - 30, 'LOW FUEL!', '#ef4444', 14);
      }
    }

    // --- LANDED STATE BEHAVIOR ---
    if (this.isLanded) {
      this.vx = 0;
      this.vy = 0;
      this.angle = 0;
      this.legsExtended = 1.0;

      // Station-specific logic
      if (this.landedStation) {
        // Refueling Depot
        if (this.landedStation.type === 'fuel') {
          if (this.fuel < this.maxFuel) {
            this.fuel = Math.min(this.maxFuel, this.fuel + 35 * dt);
            if (Math.random() < 0.3) {
              playAudio('refuel');
              // Fuel charge particles
              this.particles.push({
                x: this.landedStation.x + (Math.random() - 0.5) * 40,
                y: this.landedStation.dockY + 10,
                vx: (this.x - this.landedStation.x) * 0.05,
                vy: -1.5 - Math.random(),
                size: 3,
                life: 0.8,
                decay: 0.04,
                color: '#f59e0b'
              });
            }
          }
        }
      }

      // Lift off if thrust is applied
      if (this.thrusting && this.fuel > 0) {
        this.isLanded = false;
        this.landedStation = null;
        this.vy = -1.5;
        this.fuel -= 1.0;
        playAudio('flutter');
      }

      this.updateParticles(dt);
      return;
    }

    // --- AIRBORNE PHYSICS ---
    // Steering rotation
    const rotSpeedTarget = this.steerInput * 3.4;
    this.rotSpeed += (rotSpeedTarget - this.rotSpeed) * 0.2;
    this.angle += this.rotSpeed * dt;
    this.angle = Math.max(-1.3, Math.min(1.3, this.angle)); // Clamp tilt

    // Gravity
    const gravity = 140; // px/sec^2
    this.vy += gravity * dt;

    // Air resistance / aerodynamic drag
    this.vx *= 0.985;
    this.vy *= 0.988;

    // Thrust vector
    if (this.thrusting && this.fuel > 0) {
      const thrustPower = 280;
      this.vx += Math.sin(this.angle) * thrustPower * dt;
      this.vy -= Math.cos(this.angle) * thrustPower * dt;
      this.fuel = Math.max(0, this.fuel - 4.5 * dt);

      // Downwash wake particles
      if (Math.random() < 0.4) {
        this.particles.push({
          x: this.x + (Math.random() - 0.5) * 16,
          y: this.y + 16,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2 + Math.random() * 2,
          size: 2 + Math.random() * 2,
          life: 0.6,
          decay: 0.05,
          color: 'rgba(0, 242, 254, 0.4)'
        });
      }
    } else {
      // Passive hovering burn (mild)
      this.fuel = Math.max(0, this.fuel - 0.8 * dt);
    }

    // Air brake
    if (this.braking) {
      this.vx *= 0.93;
      this.vy *= 0.93;
      this.angle *= 0.92;
    }

    // Apply movement
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Legs extension when near pads or ground
    let nearestPadDist = 999;
    this.stations.forEach(st => {
      const d = Math.hypot(this.x - st.x, this.y - st.dockY);
      if (d < nearestPadDist) nearestPadDist = d;
    });
    const targetLegs = nearestPadDist < 50 ? 1.0 : 0.0;
    this.legsExtended += (targetLegs - this.legsExtended) * 0.15;

    // --- BOUNDARY CHECKS ---
    if (this.x < 24) {
      this.x = 24;
      this.vx = Math.abs(this.vx) * 0.5;
    } else if (this.x > LOGICAL_WIDTH - 24) {
      this.x = LOGICAL_WIDTH - 24;
      this.vx = -Math.abs(this.vx) * 0.5;
    }

    if (this.y < 35) {
      this.y = 35;
      this.vy = Math.max(0, this.vy);
    }

    // Crash at ground if not on a pad
    if (this.y > 605) {
      this.gameOver('GROUND COLLISION!');
      return;
    }

    // Check station pad landings
    this.checkLanding();

    this.updateParticles(dt);
  }

  checkLanding() {
    const dragonflyBottom = this.y + 14;
    const speed = Math.hypot(this.vx, this.vy);

    for (let st of this.stations) {
      const padLeft = st.x - st.width / 2;
      const padRight = st.x + st.width / 2;
      const padTop = st.dockY;

      // Contact window
      if (
        this.x >= padLeft - 6 &&
        this.x <= padRight + 6 &&
        dragonflyBottom >= padTop - 4 &&
        dragonflyBottom <= padTop + 14 &&
        this.vy > 0
      ) {
        // Evaluate Landing
        if (speed > 165) {
          // Hard Crash!
          this.gameOver('HARD TOUCHDOWN CRASH!');
          return;
        }

        // Successful Touchdown!
        this.isLanded = true;
        this.landedStation = st;
        this.y = padTop - 14;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;

        // Calculate Accuracy (0% to 100%)
        const distFromCenter = Math.abs(this.x - st.x);
        const maxOffset = st.width / 2;
        const accuracyDist = Math.max(0, 1 - distFromCenter / maxOffset);
        const accuracySpeed = Math.max(0, 1 - speed / 165);
        const totalAccuracy = Math.round((accuracyDist * 0.65 + accuracySpeed * 0.35) * 100);

        if (st.type === 'fuel') {
          playAudio('refuel');
          this.addFloatText(st.x, padTop - 30, 'FUEL DOCK CONNECTED!', '#f59e0b', 16);
          this.addFloatText(st.x, padTop - 50, `Docking Accuracy: ${totalAccuracy}%`, '#ffffff', 13);
          this.score += 50;
          this.checkHighScore();
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        } else if (st.id === this.targetStationId) {
          // Objective delivery completed!
          this.deliveries++;
          let points = 250;
          let accText = 'GOOD LANDING';
          let accColor = '#38bdf8';

          if (totalAccuracy >= 90) {
            points = 600;
            accText = '🎯 PERFECT BULLSEYE!';
            accColor = '#00f2fe';
            playAudio('land_perfect');
            if (this.onAchievement) {
              this.onAchievement('🎯', 'Bullseye Touchdown (90%+ Accuracy)!');
            }
          } else if (totalAccuracy >= 75) {
            points = 420;
            accText = '✨ SMOOTH APPROACH!';
            accColor = '#10b981';
            playAudio('pickup');
          } else {
            playAudio('pickup');
          }

          this.score += points;
          this.checkHighScore();
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);

          this.addFloatText(st.x, padTop - 30, `+${points} ${accText}`, accColor, 18);
          this.addFloatText(st.x, padTop - 52, `Touchdown Accuracy: ${totalAccuracy}%`, '#ffffff', 14);

          // Spawn celebration sparkles
          for (let p = 0; p < 18; p++) {
            this.particles.push({
              x: st.x + (Math.random() - 0.5) * st.width,
              y: padTop,
              vx: (Math.random() - 0.5) * 4,
              vy: -2 - Math.random() * 3,
              size: 3,
              life: 0.9,
              decay: 0.03,
              color: accColor
            });
          }

          this.pickNextTarget();
        } else {
          // Touched wrong delivery pad
          playAudio('turn');
          this.addFloatText(st.x, padTop - 30, 'WAYPOINT TRANSIT (+50)', '#9ca3af', 14);
          this.score += 50;
          this.checkHighScore();
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
        }

        break;
      }
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.016;
      if (ft.alpha <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }
  }

  // --- RENDERING PIPELINE ---
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // 1. Twilight / Golden Sunbeam Sky Background
    this.renderSky(ctx);

    // 2. Far Layer: Mountains & Distant Roof Silhouettes
    this.renderHillsAndTownParallax(ctx);

    // 3. Township Architecture (Buildings, Windmill, Clocktower, Watermill)
    this.renderTownship(ctx);

    // 4. Landing Stations & Target Pad Beacons
    this.renderStations(ctx);

    // 5. Ambient Particles & Chimney Smoke
    this.renderParticles(ctx);

    // 6. The Dragonfly Aircraft
    this.renderDragonfly(ctx);

    // 7. Floating Text Score Overlays
    this.renderFloatTexts(ctx);

    // 8. Flight HUD & Fuel Telemetry
    this.renderHUD(ctx);
  }

  renderSky(ctx) {
    // Gradient sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    skyGrad.addColorStop(0, '#091326');
    skyGrad.addColorStop(0.35, '#152b47');
    skyGrad.addColorStop(0.65, '#253f58');
    skyGrad.addColorStop(0.9, '#1a2335');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Luminous Sunbeams radiating from upper center
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const numRays = 7;
    for (let r = 0; r < numRays; r++) {
      const rayAngle = -0.6 + r * 0.2 + Math.sin(this.sunrayAngle + r) * 0.05;
      const rayWidth = 0.12;
      const rayGrad = ctx.createRadialGradient(320, 0, 10, 320, 0, 480);
      rayGrad.addColorStop(0, 'rgba(255, 230, 150, 0.28)');
      rayGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.08)');
      rayGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(320, 0);
      ctx.arc(320, 0, 520, rayAngle - rayWidth / 2, rayAngle + rayWidth / 2);
      ctx.closePath();
      ctx.fillStyle = rayGrad;
      ctx.fill();
    }
    ctx.restore();
  }

  renderHillsAndTownParallax(ctx) {
    // Distant Rolling Ridges
    ctx.fillStyle = '#0f1c2d';
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.bezierCurveTo(160, 390, 280, 430, 420, 395);
    ctx.bezierCurveTo(520, 370, 580, 410, 640, 400);
    ctx.lineTo(640, 640);
    ctx.lineTo(0, 640);
    ctx.closePath();
    ctx.fill();

    // Secondary Mid Ridge with Pine Trees
    ctx.fillStyle = '#142337';
    ctx.beginPath();
    ctx.moveTo(0, 460);
    ctx.bezierCurveTo(120, 440, 240, 470, 360, 445);
    ctx.bezierCurveTo(460, 425, 540, 455, 640, 450);
    ctx.lineTo(640, 640);
    ctx.lineTo(0, 640);
    ctx.closePath();
    ctx.fill();
  }

  renderTownship(ctx) {
    // River Stream in foreground
    const riverGrad = ctx.createLinearGradient(0, 550, 0, 640);
    riverGrad.addColorStop(0, '#0a2e47');
    riverGrad.addColorStop(1, '#061726');
    ctx.fillStyle = riverGrad;
    ctx.fillRect(0, 550, 260, 90);

    // River water waves
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, 575 + Math.sin(this.waterwheelAngle) * 3);
    ctx.lineTo(130, 575 - Math.sin(this.waterwheelAngle) * 3);
    ctx.moveTo(140, 600 + Math.cos(this.waterwheelAngle) * 3);
    ctx.lineTo(240, 600 - Math.cos(this.waterwheelAngle) * 3);
    ctx.stroke();

    // Ground Grass / Cobblestone Base
    ctx.fillStyle = '#1a222f';
    ctx.fillRect(250, 540, 390, 100);

    // --- 1. Watermill Structure (Left Riverbank) ---
    ctx.fillStyle = '#2d2218';
    ctx.fillRect(140, 500, 80, 55); // Timber millhouse
    // Roof
    ctx.fillStyle = '#6b3a2a';
    ctx.beginPath();
    ctx.moveTo(130, 500);
    ctx.lineTo(180, 465);
    ctx.lineTo(230, 500);
    ctx.closePath();
    ctx.fill();

    // Water Wheel
    ctx.save();
    ctx.translate(140, 540);
    ctx.rotate(this.waterwheelAngle);
    ctx.strokeStyle = '#855132';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
    for (let w = 0; w < 6; w++) {
      ctx.rotate((Math.PI * 2) / 6);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(24, 0);
      ctx.stroke();
    }
    ctx.restore();

    // --- 2. Fuel Depot Infrastructure (Far Left) ---
    ctx.fillStyle = '#1f2533';
    ctx.fillRect(50, 485, 60, 65);
    // Amber Neon Fuel Tank Cylinder
    const tankGrad = ctx.createLinearGradient(55, 490, 105, 490);
    tankGrad.addColorStop(0, '#78350f');
    tankGrad.addColorStop(0.5, '#f59e0b');
    tankGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = tankGrad;
    ctx.fillRect(58, 495, 44, 45);
    // Fuel Signboard
    ctx.fillStyle = '#0f131a';
    ctx.fillRect(52, 468, 56, 15);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('⚡ NECTAR', 56, 479);

    // --- 3. Town Hall (Centerpiece) ---
    ctx.fillStyle = '#2a354a';
    ctx.fillRect(270, 445, 100, 95);
    // Stone Columns
    ctx.fillStyle = '#3e4d68';
    ctx.fillRect(278, 460, 8, 80);
    ctx.fillRect(302, 460, 8, 80);
    ctx.fillRect(330, 460, 8, 80);
    ctx.fillRect(354, 460, 8, 80);
    // Pediment & Portico
    ctx.fillStyle = '#1e2636';
    ctx.beginPath();
    ctx.moveTo(260, 445);
    ctx.lineTo(320, 410);
    ctx.lineTo(380, 445);
    ctx.closePath();
    ctx.fill();

    // --- 4. Windmill (Right Side) ---
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.moveTo(495, 540);
    ctx.lineTo(512, 385);
    ctx.lineTo(538, 385);
    ctx.lineTo(555, 540);
    ctx.closePath();
    ctx.fill();
    // Windmill Dome
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(525, 385, 14, Math.PI, 0);
    ctx.fill();

    // Rotating Sails
    ctx.save();
    ctx.translate(525, 385);
    ctx.rotate(this.windmillAngle);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 4; s++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(58, 0);
      ctx.stroke();
      // Sail Canvas
      ctx.fillStyle = 'rgba(240, 240, 240, 0.65)';
      ctx.fillRect(10, -8, 42, 14);
    }
    ctx.restore();

    // --- 5. Clocktower Spire ---
    ctx.fillStyle = '#1e2330';
    ctx.fillRect(410, 325, 40, 215);
    // Spire Roof
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(402, 325);
    ctx.lineTo(430, 260);
    ctx.lineTo(458, 325);
    ctx.closePath();
    ctx.fill();

    // Clock Face
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(430, 305, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Clock hands
    ctx.beginPath();
    ctx.moveTo(430, 305);
    ctx.lineTo(430, 297);
    ctx.moveTo(430, 305);
    ctx.lineTo(436, 305);
    ctx.stroke();
  }

  renderStations(ctx) {
    this.stations.forEach(st => {
      const isTarget = st.id === this.targetStationId;
      const isFuel = st.type === 'fuel';

      // Landing Platform Deck
      ctx.save();
      ctx.fillStyle = '#111827';
      ctx.fillRect(st.x - st.width / 2, st.dockY, st.width, st.height);

      // Pad Frame / Border with Neon Glow
      ctx.strokeStyle = isTarget ? '#f59e0b' : st.color;
      ctx.lineWidth = isTarget ? 3 : 2;
      ctx.strokeRect(st.x - st.width / 2, st.dockY, st.width, st.height);

      // Warning Chevron stripes on pad surface
      ctx.strokeStyle = isTarget ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      const step = 8;
      for (let x = st.x - st.width / 2 + 4; x < st.x + st.width / 2 - 4; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, st.dockY);
        ctx.lineTo(x + 4, st.dockY + st.height);
        ctx.stroke();
      }

      // Center Bullseye Target Indicator
      ctx.fillStyle = isTarget ? '#f59e0b' : st.color;
      ctx.beginPath();
      ctx.arc(st.x, st.dockY + st.height / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing Objective Marker Ring if Active Mission Target
      if (isTarget) {
        const pulse = Math.sin(Date.now() / 150) * 4;
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(st.x, st.dockY - 18, 14 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Downward Arrow Beacon
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.moveTo(st.x, st.dockY - 6);
        ctx.lineTo(st.x - 7, st.dockY - 14);
        ctx.lineTo(st.x + 7, st.dockY - 14);
        ctx.closePath();
        ctx.fill();

        // Target Tag Name
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#00f2fe';
        ctx.textAlign = 'center';
        ctx.fillText(`TARGET: ${st.name.toUpperCase()}`, st.x, st.dockY - 34);
      }

      // Station Label
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';
      ctx.fillText(`${st.icon} ${st.id.toUpperCase()}`, st.x, st.dockY + st.height + 12);

      ctx.restore();
    });
  }

  renderParticles(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  renderDragonfly(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 1. Iridescent Transparent Wings (4 Wings Flapping Sinusoidally)
    const wingFlap = Math.sin(this.wingPhase);
    const foreWingAngle = wingFlap * 0.42;
    const hindWingAngle = -Math.cos(this.wingPhase) * 0.38;

    // Wing Gradient with Holographic Iridescence
    const wingGrad = ctx.createLinearGradient(0, 0, 45, -20);
    wingGrad.addColorStop(0, 'rgba(0, 242, 254, 0.7)');
    wingGrad.addColorStop(0.5, 'rgba(255, 107, 253, 0.5)');
    wingGrad.addColorStop(1, 'rgba(245, 158, 11, 0.4)');

    ctx.lineWidth = 1;

    // Draw Left Forewing
    ctx.save();
    ctx.translate(-4, -6);
    ctx.rotate(-0.35 + foreWingAngle);
    this.drawWing(ctx, -1, wingGrad);
    ctx.restore();

    // Draw Right Forewing
    ctx.save();
    ctx.translate(4, -6);
    ctx.rotate(0.35 - foreWingAngle);
    this.drawWing(ctx, 1, wingGrad);
    ctx.restore();

    // Draw Left Hindwing
    ctx.save();
    ctx.translate(-4, 0);
    ctx.rotate(-0.55 + hindWingAngle);
    this.drawWing(ctx, -0.85, wingGrad);
    ctx.restore();

    // Draw Right Hindwing
    ctx.save();
    ctx.translate(4, 0);
    ctx.rotate(0.55 - hindWingAngle);
    this.drawWing(ctx, 0.85, wingGrad);
    ctx.restore();

    // 2. Landing Gear (Legs extending dynamically on descent)
    if (this.legsExtended > 0.05) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      const legDrop = this.legsExtended * 10;

      // Front Legs
      ctx.beginPath();
      ctx.moveTo(-6, -2);
      ctx.lineTo(-11, 4 + legDrop);
      ctx.lineTo(-8, 6 + legDrop);
      ctx.moveTo(6, -2);
      ctx.lineTo(11, 4 + legDrop);
      ctx.lineTo(8, 6 + legDrop);
      // Rear Legs
      ctx.moveTo(-5, 6);
      ctx.lineTo(-12, 12 + legDrop);
      ctx.lineTo(-9, 14 + legDrop);
      ctx.moveTo(5, 6);
      ctx.lineTo(12, 12 + legDrop);
      ctx.lineTo(9, 14 + legDrop);
      ctx.stroke();
    }

    // 3. Biomechanical Body / Thorax
    // Jet/Thorax Shell
    const thoraxGrad = ctx.createLinearGradient(-8, 0, 8, 0);
    thoraxGrad.addColorStop(0, '#0e7490');
    thoraxGrad.addColorStop(0.5, '#00f2fe');
    thoraxGrad.addColorStop(1, '#0e7490');
    ctx.fillStyle = thoraxGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Long Segmented Abdomen Tail with Bioluminescent Rings
    const numSegments = 7;
    let segY = 12;
    for (let s = 0; s < numSegments; s++) {
      const segWidth = Math.max(2.5, 5 - s * 0.45);
      const segHeight = 6;
      ctx.fillStyle = s % 2 === 0 ? '#0f172a' : '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, segY, segWidth, segHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyan Glowing Segment Rings
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();

      segY += 5;
    }

    // Tail Tip Stinger / Exhaust Thruster
    ctx.fillStyle = this.thrusting ? '#f59e0b' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, segY + 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Thrust Flame Animation
    if (this.thrusting && this.fuel > 0) {
      const flameLen = 14 + Math.random() * 8;
      const flameGrad = ctx.createLinearGradient(0, segY + 2, 0, segY + 2 + flameLen);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.3, '#00f2fe');
      flameGrad.addColorStop(0.7, '#f59e0b');
      flameGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-3, segY + 2);
      ctx.lineTo(0, segY + 2 + flameLen);
      ctx.lineTo(3, segY + 2);
      ctx.closePath();
      ctx.fill();
    }

    // 5. Head & Emerald/Cyan Faceted Eyes
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.ellipse(0, -13, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Large Compound Eyes
    const eyeGrad = ctx.createRadialGradient(-4, -14, 1, -4, -14, 5);
    eyeGrad.addColorStop(0, '#a7f3d0');
    eyeGrad.addColorStop(0.6, '#10b981');
    eyeGrad.addColorStop(1, '#064e3b');
    ctx.fillStyle = eyeGrad;
    ctx.beginPath();
    ctx.arc(-4.5, -14, 4.5, 0, Math.PI * 2);
    ctx.fill();

    const eyeGradR = ctx.createRadialGradient(4, -14, 1, 4, -14, 5);
    eyeGradR.addColorStop(0, '#a7f3d0');
    eyeGradR.addColorStop(0.6, '#10b981');
    eyeGradR.addColorStop(1, '#064e3b');
    ctx.fillStyle = eyeGradR;
    ctx.beginPath();
    ctx.arc(4.5, -14, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye Specular Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5.5, -15.5, 1.2, 0, Math.PI * 2);
    ctx.arc(3.5, -15.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawWing(ctx, dir, fillStyle) {
    const w = 48 * dir;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(w * 0.35, -14, w * 0.75, -16, w, -4);
    ctx.bezierCurveTo(w * 0.85, 8, w * 0.45, 10, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Delicate wing veins
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.8, -2);
    ctx.moveTo(w * 0.3, -4);
    ctx.lineTo(w * 0.45, 6);
    ctx.moveTo(w * 0.6, -5);
    ctx.lineTo(w * 0.7, 4);
    ctx.stroke();

    ctx.restore();
  }

  renderFloatTexts(ctx) {
    ctx.save();
    this.floatTexts.forEach(ft => {
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = `bold ${ft.size}px 'Space Mono', monospace`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    });
    ctx.restore();
  }

  renderHUD(ctx) {
    ctx.save();

    // Top Modern Telemetry Dashboard Bar
    ctx.fillStyle = 'rgba(9, 14, 24, 0.82)';
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1;
    ctx.fillRect(16, 14, LOGICAL_WIDTH - 32, 42);
    ctx.strokeRect(16, 14, LOGICAL_WIDTH - 32, 42);

    // Fuel Gauge Bar
    const fuelWidth = 140;
    const fuelPct = Math.max(0, this.fuel / this.maxFuel);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(74, 27, fuelWidth, 14);

    const fuelColor = this.fuel > 40 ? '#00f2fe' : (this.fuel > 20 ? '#f59e0b' : '#ef4444');
    ctx.fillStyle = fuelColor;
    ctx.fillRect(74, 27, fuelWidth * fuelPct, 14);
    ctx.strokeStyle = fuelColor;
    ctx.strokeRect(74, 27, fuelWidth, 14);

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#f3f4f6';
    ctx.textAlign = 'left';
    ctx.fillText(`FUEL: ${Math.round(this.fuel)}%`, 24, 38);

    // Score & Deliveries
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`DELIVERIES: ${this.deliveries}`, 290, 38);

    // Current Mission Target Indicator
    const targetObj = this.stations.find(s => s.id === this.targetStationId);
    ctx.textAlign = 'right';
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText(`NEXT DROP: ${targetObj ? targetObj.name : 'ALL DONE'}`, LOGICAL_WIDTH - 28, 38);

    // Low Fuel Warning Banner in center viewport
    if (this.fuel <= 20 && this.fuel > 0) {
      const pulseAlpha = 0.5 + Math.sin(Date.now() / 120) * 0.4;
      ctx.fillStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ CRITICAL FUEL! DOCK AT NECTAR STATION (LEFT)', LOGICAL_WIDTH / 2, 78);
    } else if (this.fuel === 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ OUT OF FUEL! GLIDING TO EMERGENCY LANDING', LOGICAL_WIDTH / 2, 78);
    }

    ctx.restore();
  }
}
