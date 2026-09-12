import React, { useState, useEffect } from 'react';
import { Truck, Shield, Award, Wrench, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { getStorageNumber, getStorageJson, setStorageJson } from '../services/storage.js';
import { triggerHaptic } from '../services/audio.js';

const TRUCK_MODELS = [
  { id: 'classic', name: 'Peterbilt 379 Classic', type: 'Long Haul Diesel' },
  { id: 'cyber', name: 'Subzero Cyber Hauler', type: 'Twin-Motor EV' },
  { id: 'mining', name: 'Iron Stallion Heavy Dump', type: 'Subterranean Rig' },
  { id: 'steampunk', name: 'Clockwork Steam Rig', type: 'Brass Piston Hauler' },
];

const PAINT_COLORS = [
  { name: 'Midnight Onyx', hex: '#1e293b' },
  { name: 'Electric Cyan', hex: '#00f2fe' },
  { name: 'Hazard Amber', hex: '#f59e0b' },
  { name: 'Nitro Emerald', hex: '#10b981' },
  { name: 'Synth Pink', hex: '#ff6bfd' },
];

export function GarageTab() {
  const [callsign, setCallsign] = useState(() => {
    return localStorage.getItem('truckin_callsign') || 'RUBBER DUCK 77';
  });
  const [selectedTruck, setSelectedTruck] = useState('classic');
  const [paintColor, setPaintColor] = useState('#00f2fe');
  const [highScores, setHighScores] = useState({
    clockwork: 0,
    hauler: 0,
    drill: 0,
    timber: 0,
    neon: 0,
  });

  useEffect(() => {
    setHighScores({
      clockwork: getStorageNumber('clockworkHighScore', 0),
      hauler: getStorageNumber('dirtHaulerHighScore', 0),
      drill: getStorageNumber('oreDrillHighScore', 0),
      timber: getStorageNumber('timberTrailHighScore', 0),
      neon: getStorageNumber('neonHighwayHighScore', 0),
    });

    const savedGarage = getStorageJson('garageConfig', null);
    if (savedGarage) {
      if (savedGarage.truck) setSelectedTruck(savedGarage.truck);
      if (savedGarage.color) setPaintColor(savedGarage.color);
    }
  }, []);

  const handleSelectTruck = (truckId) => {
    triggerHaptic([15]);
    setSelectedTruck(truckId);
    setStorageJson('garageConfig', { truck: truckId, color: paintColor });
  };

  const handleSelectColor = (colorHex) => {
    triggerHaptic([15]);
    setPaintColor(colorHex);
    setStorageJson('garageConfig', { truck: selectedTruck, color: colorHex });
  };

  const handleSaveCallsign = (val) => {
    setCallsign(val);
    localStorage.setItem('truckin_callsign', val);
  };

  const totalScore = Object.values(highScores).reduce((a, b) => a + b, 0);
  const getRank = (score) => {
    if (score > 1500) return 'HIGHWAY LEGEND ★★★';
    if (score > 800) return 'ROAD MASTER ★★';
    if (score > 300) return 'DIESEL WARRIOR ★';
    return 'ROOKIE HAULER';
  };

  return (
    <div className="flex flex-col flex-1 pb-24 max-w-md mx-auto w-full px-4 py-4 space-y-4 select-none">
      {/* Driver Profile Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#181d2a] to-[#10131d] border border-white/10 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#10b981] flex items-center justify-center font-black text-black text-lg">
              🚚
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                DRIVER PROFILE
              </div>
              <input
                type="text"
                value={callsign}
                onChange={(e) => handleSaveCallsign(e.target.value)}
                className="text-sm font-black text-white bg-transparent border-b border-transparent focus:border-[#00f2fe] focus:outline-none tracking-wider"
              />
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-black font-mono">
            {getRank(totalScore)}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center font-mono">
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[9px] text-gray-400 uppercase">Miles Hauled</div>
            <div className="text-sm font-black text-white">{1420 + totalScore * 12}</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[9px] text-gray-400 uppercase">Combined Arcade</div>
            <div className="text-sm font-black text-[#00f2fe]">{totalScore}</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[9px] text-gray-400 uppercase">Runs Dispatched</div>
            <div className="text-sm font-black text-emerald-400">{24 + Math.floor(totalScore / 50)}</div>
          </div>
        </div>
      </div>

      {/* Interactive Truck Customizer */}
      <div className="rounded-2xl bg-[#10131d] border border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#00f2fe]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Syne',sans-serif]">
              RIG CUSTOMIZER
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400">GARAGE BAY 1</span>
        </div>

        {/* SVG Truck Visualizer */}
        <div className="w-full h-32 rounded-xl bg-[#080a0f] border border-white/5 flex items-center justify-center p-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 blur-xl transition-all duration-300"
            style={{ backgroundColor: paintColor }}
          />

          <svg viewBox="0 0 200 80" className="w-48 h-20 drop-shadow-2xl relative z-10">
            {/* Cab Body */}
            <path
              d="M 20,55 L 20,30 L 70,30 L 90,42 L 130,42 L 135,55 Z"
              fill={paintColor}
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Windshield */}
            <polygon points="72,33 87,42 72,42" fill="#090a0f" stroke="#ffffff" strokeWidth="1" />
            {/* Exhaust Stacks */}
            <rect x="25" y="15" width="4" height="20" fill="#cbd5e1" />
            <rect x="23" y="12" width="8" height="4" fill="#94a3b8" />
            {/* Wheels */}
            <circle cx="45" cy="58" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="115" cy="58" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            {/* Headlight */}
            <circle cx="133" cy="48" r="3" fill="#fef08a" />
          </svg>
        </div>

        {/* Truck Models Picker */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {TRUCK_MODELS.map((truck) => {
            const isSelected = selectedTruck === truck.id;
            return (
              <button
                key={truck.id}
                onClick={() => handleSelectTruck(truck.id)}
                className={`p-2.5 rounded-xl text-left border text-xs transition ${
                  isSelected
                    ? 'bg-white/10 border-white text-white font-bold shadow'
                    : 'bg-white/5 border-white/5 text-gray-400 active:bg-white/10'
                }`}
              >
                <div className="font-semibold">{truck.name}</div>
                <div className="text-[10px] text-gray-400">{truck.type}</div>
              </button>
            );
          })}
        </div>

        {/* Paint Swatches */}
        <div>
          <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase">Custom Paint Finish</div>
          <div className="flex gap-3">
            {PAINT_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleSelectColor(color.hex)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  paintColor === color.hex
                    ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#10131d]'
                    : 'active:scale-95'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arcade Career Leaderboard */}
      <div className="rounded-2xl bg-[#10131d] border border-white/10 p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Syne',sans-serif]">
            ARCADE HIGH RECORDS
          </h3>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Clockwork Hare: Gear Runner</span>
            <span className="text-[#00f2fe] font-black">{highScores.clockwork}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Keep on Truckin: Heavy Dirt Hauler</span>
            <span className="text-amber-400 font-black">{highScores.hauler}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Iron Stallion: Ore Drill Rush</span>
            <span className="text-orange-400 font-black">{highScores.drill}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Harlan Echo: Timber Hollow Trail</span>
            <span className="text-emerald-400 font-black">{highScores.timber}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-400">Subzero Pulsewavez: Neon Highway</span>
            <span className="text-[#ff6bfd] font-black">{highScores.neon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
