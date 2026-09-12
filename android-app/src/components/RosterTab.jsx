import React, { useState } from 'react';
import { Play, ExternalLink, Music, Disc3 } from 'lucide-react';
import { ARTISTS } from '../data/artists.js';
import { triggerHaptic } from '../services/audio.js';

export function RosterTab({ onLaunchGame }) {
  const [activeEmbedId, setActiveEmbedId] = useState(null);

  const toggleEmbed = (id) => {
    triggerHaptic([15]);
    setActiveEmbedId(activeEmbedId === id ? null : id);
  };

  return (
    <div className="flex flex-col flex-1 pb-24 max-w-md mx-auto w-full px-4 py-4 space-y-4 select-none">
      {/* Roster Header */}
      <div className="border-b border-white/10 pb-3">
        <span className="text-[11px] font-mono tracking-widest text-[#00f2fe] uppercase font-bold">
          OFFICIAL LABEL ROSTER
        </span>
        <h2 className="text-xl font-black text-white font-['Syne',sans-serif]">
          5 SIGNATURE ARTISTS
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          High-impact outlaw country, southern rock, steampunk & retrowave catalog.
        </p>
      </div>

      {/* Artists Cards */}
      <div className="space-y-4">
        {ARTISTS.map((artist) => {
          const isEmbedOpen = activeEmbedId === artist.id;
          return (
            <div
              key={artist.id}
              className="rounded-2xl bg-[#10131d] border border-white/10 p-4 shadow-lg flex flex-col space-y-3 transition-all"
            >
              {/* Card Top */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase mb-1"
                    style={{
                      backgroundColor: `${artist.accentColor}20`,
                      color: artist.accentColor,
                      border: `1px solid ${artist.accentColor}40`,
                    }}
                  >
                    {artist.badge}
                  </span>
                  <h3 className="text-base font-black text-white font-['Syne',sans-serif]">
                    {artist.name}
                  </h3>
                  <div className="text-xs font-medium text-gray-400">{artist.genre}</div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic([20]);
                    onLaunchGame(artist.gameKey);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 active:bg-white/20 text-xs font-bold text-white border border-white/15 transition"
                >
                  <Play className="w-3.5 h-3.5 text-[#00f2fe]" />
                  <span>Arcade</span>
                </button>
              </div>

              {/* Tagline & Bio */}
              <p className="text-xs italic text-gray-300 border-l-2 pl-2.5 py-0.5" style={{ borderColor: artist.accentColor }}>
                "{artist.tagline}"
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {artist.bio}
              </p>

              {/* Streaming Links */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                <button
                  onClick={() => toggleEmbed(artist.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    isEmbedOpen
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-white/5 text-gray-300 active:bg-white/10'
                  }`}
                >
                  <Disc3 className="w-3.5 h-3.5" />
                  <span>{isEmbedOpen ? 'Close Preview' : 'Spotify Preview'}</span>
                </button>

                {artist.links.spotify && (
                  <a
                    href={artist.links.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-xs hover:bg-white/10 active:bg-white/15 transition"
                  >
                    <span>Spotify</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}

                {artist.links.apple && (
                  <a
                    href={artist.links.apple}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-xs hover:bg-white/10 active:bg-white/15 transition"
                  >
                    <span>Apple</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}

                {artist.links.youtube && (
                  <a
                    href={artist.links.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-xs hover:bg-white/10 active:bg-white/15 transition"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}
              </div>

              {/* Spotify Embedded Player */}
              {isEmbedOpen && (
                <div className="mt-2 rounded-xl overflow-hidden shadow-inner border border-white/10">
                  <iframe
                    src={artist.spotifyEmbedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`${artist.name} Spotify Player`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
