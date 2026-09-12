import React from 'react';
import { Gamepad2, Music2, Radio, Truck } from 'lucide-react';
import { triggerHaptic } from '../services/audio.js';

export function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'arcade', label: 'Arcade', icon: Gamepad2, color: 'text-[#00f2fe]' },
    { id: 'roster', label: 'Roster', icon: Music2, color: 'text-[#f59e0b]' },
    { id: 'dispatcher', label: 'Dispatcher', icon: Radio, color: 'text-[#10b981]' },
    { id: 'garage', label: 'Garage', icon: Truck, color: 'text-[#ff6bfd]' },
  ];

  const handleTabClick = (tabId) => {
    triggerHaptic([15]);
    onSelectTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#10131d]/95 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-4 max-w-md mx-auto py-1 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center py-1.5 px-1 relative group focus:outline-none"
            >
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 scale-105 shadow-inner'
                    : 'group-active:scale-95'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? tab.color : 'text-gray-400'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-medium mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
