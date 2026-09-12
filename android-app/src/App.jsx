import React, { useState } from 'react';
import { TopAppBar } from './components/TopAppBar.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { ArcadeTab } from './components/ArcadeTab.jsx';
import { RosterTab } from './components/RosterTab.jsx';
import { DispatcherTab } from './components/DispatcherTab.jsx';
import { GarageTab } from './components/GarageTab.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('arcade');
  const [arcadeInitialGame, setArcadeInitialGame] = useState(null);

  const handleLaunchGame = (gameKey) => {
    setArcadeInitialGame(gameKey);
    setActiveTab('arcade');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090a0f] text-white font-sans overflow-x-hidden selection:bg-[#00f2fe] selection:text-black">
      {/* Android Top App Bar */}
      <TopAppBar />

      {/* Dynamic Tab Body */}
      <main className="flex-1 flex flex-col w-full">
        {activeTab === 'arcade' && (
          <ArcadeTab
            initialGameKey={arcadeInitialGame}
            onClearInitialGame={() => setArcadeInitialGame(null)}
          />
        )}
        {activeTab === 'roster' && (
          <RosterTab onLaunchGame={handleLaunchGame} />
        )}
        {activeTab === 'dispatcher' && (
          <DispatcherTab />
        )}
        {activeTab === 'garage' && (
          <GarageTab />
        )}
      </main>

      {/* Android Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
