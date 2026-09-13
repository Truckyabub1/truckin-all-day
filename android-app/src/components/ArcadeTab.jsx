import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { ARTISTS } from '../data/artists.js';
import { ClockworkHareEngine } from '../games/clockwork-hare.js';
import { HeavyDirtHaulerEngine } from '../games/heavy-dirt-hauler.js';
import { OreDrillRushEngine } from '../games/ore-drill-rush.js';
import { TimberHollowTrailEngine } from '../games/timber-hollow-trail.js';
import { NeonHighwayEngine } from '../games/neon-highway.js';
import { DragonflyTownshipEngine } from '../games/dragonfly-township.js';
import { playAudio, triggerHaptic } from '../services/audio.js';
import { getStorageNumber } from '../services/storage.js';

export const ARCADE_GAMES = [
  ...ARTISTS.map(a => ({
    gameKey: a.gameKey,
    name: a.name,
    gameTitle: a.gameTitle,
    gameDesc: a.gameDesc,
    accentColor: a.accentColor
  })),
  {
    gameKey: 'dragonfly',
    name: 'Arcade Feature',
    gameTitle: 'Dragonfly Township',
    gameDesc: 'Lakeside Sky Courier',
    accentColor: '#00f2fe'
  }
];

export function ArcadeTab({ initialGameKey = null, onClearInitialGame }) {
  const [activeGameKey, setActiveGameKey] = useState(initialGameKey || 'clockwork');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScoreBeaten, setHighScoreBeaten] = useState(false);

  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Sync if selected from outside (e.g. from Roster tab)
  useEffect(() => {
    if (initialGameKey) {
      setActiveGameKey(initialGameKey);
      if (onClearInitialGame) onClearInitialGame();
    }
  }, [initialGameKey]);

  // Read current high score on game switch
  useEffect(() => {
    const keyMap = {
      clockwork: 'clockworkHighScore',
      hauler: 'dirtHaulerHighScore',
      drill: 'oreDrillHighScore',
      timber: 'timberTrailHighScore',
      neon: 'neonHighwayHighScore',
      dragonfly: 'dragonflyTownshipHighScore',
    };
    setHighScore(getStorageNumber(keyMap[activeGameKey] || 'clockworkHighScore', 0));
    setScore(0);
    setGameOver(false);
    setHighScoreBeaten(false);
  }, [activeGameKey]);

  // Clean up on unmount or game switch
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (engineRef.current && typeof engineRef.current.destroy === 'function') {
        engineRef.current.destroy();
      }
    };
  }, [activeGameKey]);

  const startGame = () => {
    triggerHaptic([20]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 640;

    let engine = null;
    const handleScore = (s, hi) => {
      setScore(s);
      setHighScore(hi);
    };

    const handleGameOver = (finalScore, _hi) => {
      setGameOver(true);
      setIsPlaying(false);
      triggerHaptic([50, 40, 90]);
      if (finalScore > highScore && finalScore > 0) {
        setHighScoreBeaten(true);
        playAudio('highscore');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };

    const handleAchievement = (_icon, _msg) => {
      triggerHaptic([15, 20, 15]);
    };

    if (activeGameKey === 'clockwork') {
      engine = new ClockworkHareEngine(canvas, ctx, handleScore, handleGameOver, handleAchievement);
    } else if (activeGameKey === 'hauler') {
      engine = new HeavyDirtHaulerEngine(canvas, ctx, handleScore, handleGameOver, handleAchievement);
    } else if (activeGameKey === 'drill') {
      engine = new OreDrillRushEngine(canvas, ctx, handleScore, handleGameOver, handleAchievement);
    } else if (activeGameKey === 'timber') {
      engine = new TimberHollowTrailEngine(canvas, ctx, handleScore, handleGameOver, handleAchievement);
    } else if (activeGameKey === 'neon') {
      engine = new NeonHighwayEngine(canvas, ctx, handleScore, handleGameOver, handleAchievement);
    } else if (activeGameKey === 'dragonfly') {
      engine = new DragonflyTownshipEngine(canvas, ctx, handleScore, handleGameOver, handleAchievement);
    }

    if (!engine) return;

    engineRef.current = engine;
    engine.init();
    engine.reset();
    engine.start();

    setIsPlaying(true);
    setGameOver(false);
    setHighScoreBeaten(false);
    lastTimeRef.current = performance.now();

    const loop = (timestamp) => {
      const delta = Math.min(timestamp - lastTimeRef.current, 100);
      lastTimeRef.current = timestamp;

      if (engineRef.current && engineRef.current.isRunning && !engineRef.current.isOver) {
        engineRef.current.update(delta);
      }
      if (engineRef.current) {
        engineRef.current.render();
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(loop);
  };

  const handleRestart = () => {
    triggerHaptic([20]);
    startGame();
  };

  const currentGame = ARCADE_GAMES.find(a => a.gameKey === activeGameKey) || ARCADE_GAMES[0];

  return (
    <div className="flex flex-col flex-1 pb-24 max-w-md mx-auto w-full select-none">
      {/* Game Selector Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar border-b border-white/5">
        {ARCADE_GAMES.map((game) => {
          const isSelected = game.gameKey === activeGameKey;
          return (
            <button
              key={game.gameKey}
              onClick={() => {
                triggerHaptic([15]);
                setActiveGameKey(game.gameKey);
                setIsPlaying(false);
                setGameOver(false);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-[#181d2a] text-gray-400 border border-white/10'
              }`}
            >
              {game.gameTitle}
            </button>
          );
        })}
      </div>

      {/* Arcade Header & HUD */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#10131d]/60">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
            {currentGame.name}
          </span>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            {currentGame.gameTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-gray-400">Score</div>
            <div className="text-base font-black text-[#00f2fe]">{score}</div>
          </div>
          <div className="text-right pl-2 border-l border-white/10">
            <div className="text-[9px] uppercase tracking-wider text-gray-400 flex items-center justify-end gap-0.5">
              <Trophy className="w-2.5 h-2.5 text-amber-400" /> HI
            </div>
            <div className="text-base font-black text-amber-400">{highScore}</div>
          </div>
        </div>
      </div>

      {/* Canvas Game Container */}
      <div className="relative w-full aspect-square bg-[#06070a] overflow-hidden border-y border-white/10 shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={640}
          className="w-full h-full object-contain touch-none"
          style={{ touchAction: 'none' }}
        />

        {/* Start / Intro Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-[#090a0f]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-xl"
              style={{ backgroundColor: `${currentGame.accentColor}20`, border: `1px solid ${currentGame.accentColor}` }}
            >
              <Play className="w-7 h-7" style={{ color: currentGame.accentColor }} />
            </div>
            <h3 className="text-xl font-black text-white font-['Syne',sans-serif] uppercase mb-1">
              {currentGame.gameTitle}
            </h3>
            <p className="text-xs text-gray-300 max-w-[260px] mb-5">
              {currentGame.gameDesc} • Official soundtrack track by {currentGame.name}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-[#00f2fe] to-[#10b981] text-black shadow-lg shadow-[#00f2fe]/20 active:scale-95 transition"
            >
              START ENGINE
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#090a0f]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="text-3xl font-black text-red-500 mb-1 font-['Syne',sans-serif] tracking-wider">
              {highScoreBeaten ? 'NEW HIGH SCORE!' : 'HAUL TERMINATED'}
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              FINAL SCORE: <span className="font-bold text-white">{score}</span>
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wider uppercase bg-[#00f2fe] text-black shadow-lg shadow-[#00f2fe]/25 active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Contextual Virtual Touch Controls HUD */}
      <div className="px-4 py-3 bg-[#10131d]/90 flex-1 flex flex-col justify-center">
        {activeGameKey === 'clockwork' && (
          <div className="flex items-center justify-center py-2">
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                triggerHaptic([20]);
                if (engineRef.current) engineRef.current.handlePressDown();
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                if (engineRef.current) engineRef.current.handlePressUp();
              }}
              className="w-full max-w-xs py-5 rounded-2xl bg-gradient-to-r from-[#00f2fe]/20 to-[#00f2fe]/40 border-2 border-[#00f2fe] text-[#00f2fe] font-black text-lg tracking-widest uppercase active:scale-95 transition shadow-lg shadow-[#00f2fe]/20"
              style={{ touchAction: 'none' }}
            >
              JUMP / HOVER (HOLD)
            </button>
          </div>
        )}

        {activeGameKey === 'hauler' && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                triggerHaptic([15]);
                if (engineRef.current) engineRef.current.setDirection({ x: 0, y: -1 });
              }}
              className="w-16 h-12 rounded-xl bg-white/10 border border-white/20 active:bg-[#f59e0b] active:text-black font-bold text-lg flex items-center justify-center transition"
              style={{ touchAction: 'none' }}
            >
              ▲
            </button>
            <div className="flex items-center gap-3">
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([15]);
                  if (engineRef.current) engineRef.current.setDirection({ x: -1, y: 0 });
                }}
                className="w-16 h-12 rounded-xl bg-white/10 border border-white/20 active:bg-[#f59e0b] active:text-black font-bold text-lg flex items-center justify-center transition"
                style={{ touchAction: 'none' }}
              >
                ◀
              </button>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([15]);
                  if (engineRef.current) engineRef.current.setDirection({ x: 0, y: 1 });
                }}
                className="w-16 h-12 rounded-xl bg-white/10 border border-white/20 active:bg-[#f59e0b] active:text-black font-bold text-lg flex items-center justify-center transition"
                style={{ touchAction: 'none' }}
              >
                ▼
              </button>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([15]);
                  if (engineRef.current) engineRef.current.setDirection({ x: 1, y: 0 });
                }}
                className="w-16 h-12 rounded-xl bg-white/10 border border-white/20 active:bg-[#f59e0b] active:text-black font-bold text-lg flex items-center justify-center transition"
                style={{ touchAction: 'none' }}
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {(activeGameKey === 'drill' || activeGameKey === 'neon') && (
          <div className="grid grid-cols-2 gap-4 py-2">
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                triggerHaptic([15]);
                if (engineRef.current) engineRef.current.moveLeft();
              }}
              className="py-5 rounded-2xl bg-white/10 border border-white/20 active:bg-[#00f2fe] active:text-black font-black text-xl tracking-wider uppercase transition shadow-md"
              style={{ touchAction: 'none' }}
            >
              ◀ LEFT LANE
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                triggerHaptic([15]);
                if (engineRef.current) engineRef.current.moveRight();
              }}
              className="py-5 rounded-2xl bg-white/10 border border-white/20 active:bg-[#00f2fe] active:text-black font-black text-xl tracking-wider uppercase transition shadow-md"
              style={{ touchAction: 'none' }}
            >
              RIGHT LANE ▶
            </button>
          </div>
        )}

        {activeGameKey === 'timber' && (
          <div className="grid grid-cols-2 gap-4 py-2">
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                triggerHaptic([15]);
                if (engineRef.current) engineRef.current.setSteer(-1);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                if (engineRef.current) engineRef.current.setSteer(0);
              }}
              className="py-5 rounded-2xl bg-white/10 border border-white/20 active:bg-[#10b981] active:text-black font-black text-xl tracking-wider uppercase transition shadow-md"
              style={{ touchAction: 'none' }}
            >
              ◀ STEER LEFT
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                triggerHaptic([15]);
                if (engineRef.current) engineRef.current.setSteer(1);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                if (engineRef.current) engineRef.current.setSteer(0);
              }}
              className="py-5 rounded-2xl bg-white/10 border border-white/20 active:bg-[#10b981] active:text-black font-black text-xl tracking-wider uppercase transition shadow-md"
              style={{ touchAction: 'none' }}
            >
              STEER RIGHT ▶
            </button>
          </div>
        )}

        {activeGameKey === 'dragonfly' && (
          <div className="flex flex-col gap-2 py-1">
            <div className="grid grid-cols-2 gap-3">
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([15]);
                  if (engineRef.current) engineRef.current.setSteer(-1);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  if (engineRef.current) engineRef.current.setSteer(0);
                }}
                className="py-4 rounded-xl bg-white/10 border border-white/20 active:bg-[#00f2fe] active:text-black font-black text-sm tracking-wider uppercase transition shadow-md"
                style={{ touchAction: 'none' }}
              >
                🔄 ROTATE LEFT
              </button>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([15]);
                  if (engineRef.current) engineRef.current.setSteer(1);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  if (engineRef.current) engineRef.current.setSteer(0);
                }}
                className="py-4 rounded-xl bg-white/10 border border-white/20 active:bg-[#00f2fe] active:text-black font-black text-sm tracking-wider uppercase transition shadow-md"
                style={{ touchAction: 'none' }}
              >
                ROTATE RIGHT 🔄
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([20]);
                  if (engineRef.current) engineRef.current.setThrust(true);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  if (engineRef.current) engineRef.current.setThrust(false);
                }}
                className="py-4 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#0284c7] text-black font-black text-sm tracking-wider uppercase active:scale-95 transition shadow-lg shadow-[#00f2fe]/20"
                style={{ touchAction: 'none' }}
              >
                ⚡ THRUST / LIFT
              </button>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  triggerHaptic([15]);
                  if (engineRef.current) engineRef.current.setBrake(true);
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  if (engineRef.current) engineRef.current.setBrake(false);
                }}
                className="py-4 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f59e0b] font-black text-sm tracking-wider uppercase active:scale-95 transition"
                style={{ touchAction: 'none' }}
              >
                🛑 AIR-BRAKE / LAND
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
