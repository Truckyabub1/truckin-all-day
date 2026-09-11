// Web Audio API Procedural Sound Synthesizer for Arcade Games
let audioCtx = null;
let hoverOsc = null;
let hoverGain = null;
let soundEnabled = true;

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  if (!soundEnabled) {
    stopHoverAudio();
  }
}

export function toggleSound() {
  setSoundEnabled(!soundEnabled);
  return soundEnabled;
}

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAudio(type) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'jump') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'pickup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'turn') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'crash') {
      stopHoverAudio();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.28);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'drill') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'boost') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.22);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'swerve') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(210, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'highscore') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.50, now + 0.24);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  } catch (e) {
    // Audio contexts might be blocked until user gesture
  }
}

export function startHoverAudio() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx || hoverOsc) return;

  try {
    hoverOsc = ctx.createOscillator();
    hoverGain = ctx.createGain();
    hoverOsc.type = 'sawtooth';
    hoverOsc.frequency.setValueAtTime(65, ctx.currentTime);
    hoverGain.gain.setValueAtTime(0.08, ctx.currentTime);
    hoverOsc.connect(hoverGain);
    hoverGain.connect(ctx.destination);
    hoverOsc.start();
  } catch (e) {
    hoverOsc = null;
  }
}

export function stopHoverAudio() {
  if (hoverGain && audioCtx) {
    try {
      hoverGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      setTimeout(() => {
        if (hoverOsc) {
          try {
            hoverOsc.stop();
            hoverOsc.disconnect();
          } catch (e) {}
          hoverOsc = null;
          hoverGain = null;
        }
      }, 60);
    } catch (e) {
      hoverOsc = null;
      hoverGain = null;
    }
  }
}
