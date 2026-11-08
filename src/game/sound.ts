// Tiny Web Audio sound engine – no audio files needed.
let ctx: AudioContext | null = null;
let muted = false;
let musicTimer: number | null = null;

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", when = 0, vol = 0.15) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  click: () => tone(660, 0.08, "square", 0, 0.08),
  check: () => {
    tone(880, 0.1, "triangle");
    tone(1320, 0.15, "triangle", 0.08);
  },
  uncheck: () => tone(330, 0.12, "triangle"),
  tick: () => tone(1000, 0.05, "square", 0, 0.06),
  alarm: () => {
    for (let i = 0; i < 6; i++) tone(i % 2 ? 520 : 780, 0.18, "sawtooth", i * 0.2, 0.12);
  },
  fail: () => {
    tone(300, 0.2, "sawtooth", 0, 0.12);
    tone(200, 0.35, "sawtooth", 0.18, 0.12);
  },
  whoosh: () => {
    for (let i = 0; i < 8; i++) tone(300 + i * 90, 0.06, "sine", i * 0.025, 0.08);
  },
  success: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, "triangle", i * 0.11, 0.18));
  },
  xp: () => {
    for (let i = 0; i < 10; i++) tone(900 + i * 80, 0.06, "square", i * 0.045, 0.06);
  },
  countdown: () => tone(440, 0.3, "square", 0, 0.12),
  go: () => {
    tone(880, 0.5, "square", 0, 0.14);
    tone(1320, 0.5, "triangle", 0, 0.1);
  },
  fanfare: () => {
    const notes = [523, 523, 523, 698, 880, 784, 698, 880, 1047];
    const times = [0, 0.15, 0.3, 0.45, 0.9, 1.1, 1.25, 1.4, 1.7];
    notes.forEach((f, i) => tone(f, i === notes.length - 1 ? 0.9 : 0.25, "triangle", times[i], 0.18));
  },
  banana: () => {
    tone(500, 0.1, "sine", 0, 0.12);
    tone(250, 0.2, "sine", 0.08, 0.12);
  },
};

export function setMuted(m: boolean) {
  muted = m;
  if (m) stopMusic();
}
export function isMuted() {
  return muted;
}

// Simple cheerful looping background melody
const melody = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
const bass = [131, 131, 175, 175, 147, 147, 196, 196];
export function startMusic() {
  if (musicTimer !== null) return;
  let step = 0;
  musicTimer = window.setInterval(() => {
    if (muted) return;
    tone(melody[step % melody.length], 0.22, "triangle", 0, 0.04);
    if (step % 2 === 0) tone(bass[(step / 2) % bass.length], 0.4, "sine", 0, 0.05);
    step++;
  }, 280);
}
export function stopMusic() {
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}
export function isMusicOn() {
  return musicTimer !== null;
}
