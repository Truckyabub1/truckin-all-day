import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Flame } from 'lucide-react';
import { isSoundEnabled, toggleSound, playAudio, triggerHaptic } from '../services/audio.js';

export function TopAppBar({ onOpenHorn }) {
  const [muted, setMuted] = useState(!isSoundEnabled());

  const handleToggleSound = () => {
    triggerHaptic([15]);
    const newState = toggleSound();
    setMuted(!newState);
  };

  const handleHorn = () => {
    triggerHaptic([35, 25, 35]);
    playAudio('horn');
    if (onOpenHorn) onOpenHorn();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#10131d]/90 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top,0px)]">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-md mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#00f2fe]/20">
            <span className="text-base font-black text-black">🚚</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase text-white font-['Syne',sans-serif]">
              TRUCKIN ALL DAY
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                CH 19 • ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleHorn}
            className="p-2 rounded-full bg-white/5 active:bg-white/15 text-amber-400 transition"
            aria-label="Sound Horn"
            title="Air Horn"
          >
            <Flame className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-full transition ${
              muted ? 'bg-red-500/10 text-red-400' : 'bg-[#00f2fe]/10 text-[#00f2fe]'
            }`}
            aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
