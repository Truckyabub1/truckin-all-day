import React, { useState, useRef, useEffect } from 'react';
import { Send, Radio, AlertTriangle, CloudRain, DollarSign, BookOpen, Volume2 } from 'lucide-react';
import { playAudio, triggerHaptic } from '../services/audio.js';

const DISPATCH_PRESETS = [
  {
    id: 'hazard',
    label: 'Report Road Hazard',
    icon: AlertTriangle,
    prompt: 'Breaker 1-9, reporting road hazard on Interstate 80 westbound. Heavy debris in center lane.',
  },
  {
    id: 'weather',
    label: 'Mountain Pass Weather',
    icon: CloudRain,
    prompt: 'Dispatcher, what is the visibility and chain requirement over Donner Pass tonight?',
  },
  {
    id: 'freight',
    label: 'Request High-Payout Haul',
    icon: DollarSign,
    prompt: 'Looking for a hotshot expedited diesel run heading south. What heavy loads are open on the board?',
  },
  {
    id: 'lore',
    label: 'Midnight CB Lore',
    icon: BookOpen,
    prompt: 'Any old timers copy on 19? Tell us the legend of the phantom black Peterbilt on Route 66.',
  },
];

const INITIAL_MESSAGES = [
  {
    id: 'init-1',
    sender: 'DISPATCH HQ (GEMINI)',
    callsign: 'K-99 CENTRAL',
    text: 'Breaker 1-9, this is Central Dispatch. Highway conditions open. 5 artist freight convoys moving on schedule. Stand by for route updates.',
    time: '22:00',
    type: 'system',
  },
  {
    id: 'init-2',
    sender: 'ROAD WARRIOR',
    callsign: 'RUBBER DUCK 24/7',
    text: '10-4 Dispatch, heavy dirt hauler loaded down and rolling out of Salt Lake. Hammer down!',
    time: '22:02',
    type: 'driver',
  }
];

export function DispatcherTab() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const scrollBottomRef = useRef(null);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTransmitting]);

  const transmitMessage = async (userText) => {
    if (!userText.trim()) return;

    triggerHaptic([25]);
    playAudio('cb_squelch');

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'YOU (DRIVER)',
      callsign: 'UNIT 77',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTransmitting(true);

    // Call Gemini API if key is available, else use authentic trucker AI generator
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    setTimeout(async () => {
      let replyText = '';
      if (apiKey) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `You are an authentic grizzled CB radio trucker dispatcher for the country-rock label "Truckin all Day". Respond in authentic CB radio lingo with 10-codes (10-4, 10-20, 10-33, etc.), short, punchy, radio-chatter style. The driver says: "${userText}"`,
                      },
                    ],
                  },
                ],
              }),
            }
          );
          const data = await res.json();
          replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            '10-4 Driver, loud and clear on 19. Keep her between the ditches.';
        } catch (e) {
          replyText = getSimulatedDispatcherResponse(userText);
        }
      } else {
        replyText = getSimulatedDispatcherResponse(userText);
      }

      playAudio('cb_squelch');
      triggerHaptic([30, 20]);
      setIsTransmitting(false);

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'DISPATCH (GEMINI AI)',
          callsign: 'K-99 CENTRAL',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'dispatch',
        },
      ]);
    }, 1200);
  };

  const getSimulatedDispatcherResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('hazard') || q.includes('debris') || q.includes('accident')) {
      return '10-4 Unit 77, copy that 10-33 hazard. Highway patrol and road crew dispatched to mile marker 142. All westbound units drop speed to 45. Appreciate the heads up!';
    }
    if (q.includes('weather') || q.includes('pass') || q.includes('rain') || q.includes('snow')) {
      return 'Copy that, driver. Donner Pass has heavy mountain fog and sleet above 6,000 ft. Maximum traction advisory in effect. Keep your Jake brake primed and headlights on low beam.';
    }
    if (q.includes('freight') || q.includes('haul') || q.includes('load') || q.includes('run')) {
      return 'Big 10-4! We got a priority flatbed run: 44,000 lbs of mining drill heads for Iron Stallion out of Butte, paying $4.85 a mile straight cash on delivery. Load number 884 is yours!';
    }
    if (q.includes('lore') || q.includes('story') || q.includes('legend') || q.includes('phantom')) {
      return 'Ah, you want the midnight ghost tale? Back in 78, a black 379 vanished in the fog near Harlan County. Some say on stormy nights, you can hear that twin-turbo roar and banjo riff echoing in the pines.';
    }
    return '10-4 on the flip flop, driver! Signal is coming in 5-by-5 across the county line. Keep that diesel purring and let us know your 20 when you hit the weigh station.';
  };

  return (
    <div className="flex flex-col flex-1 pb-24 max-w-md mx-auto w-full h-[calc(100vh-120px)] select-none">
      {/* Radio Frequency Header */}
      <div className="px-4 py-2 bg-[#10131d] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <div className="text-xs font-black text-white font-mono tracking-wider">
              CB CHANNEL 19 • 27.185 MHz
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              AM SQUELCH: OPTIMAL • MOD: 98%
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic([20]);
            playAudio('cb_squelch');
          }}
          className="p-1.5 rounded-lg bg-white/5 active:bg-white/15 text-gray-300 transition text-[10px] font-mono flex items-center gap-1"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#00f2fe]" /> SQUELCH
        </button>
      </div>

      {/* Preset Action Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5 bg-[#090a0f] border-b border-white/5 no-scrollbar">
        {DISPATCH_PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              onClick={() => transmitMessage(preset.prompt)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] active:bg-[#00f2fe]/20 border border-white/10 text-xs font-semibold text-gray-200 transition"
            >
              <Icon className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-mono">
        {messages.map((msg) => {
          const isUser = msg.type === 'user';
          const isSystem = msg.type === 'system';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
                <span className="font-bold text-[#00f2fe]">{msg.callsign}</span>
                <span>•</span>
                <span>{msg.time}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#00f2fe] text-black font-semibold rounded-br-none'
                    : isSystem
                    ? 'bg-[#181d2a] text-amber-300 border border-amber-500/20'
                    : 'bg-[#10131d] text-gray-200 border border-white/10 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTransmitting && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono italic animate-pulse">
            <Radio className="w-4 h-4 animate-spin" /> Transmitting over airwaves...
          </div>
        )}
        <div ref={scrollBottomRef} />
      </div>

      {/* Mic Input Bar */}
      <div className="p-3 bg-[#10131d] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            transmitMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type CB transmission or 10-code..."
            className="flex-1 bg-[#181d2a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] font-sans"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#00f2fe] text-black active:scale-95 transition font-bold"
            aria-label="Transmit"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
