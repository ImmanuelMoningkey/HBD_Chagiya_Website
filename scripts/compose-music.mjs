/**
 * Coquette Birthday Theme — original instrumental composition & offline synthesizer.
 *
 * Writes: public/assets/audio/coquette-birthday-theme.mp3
 *
 * Everything here (melodies, chord progression, arrangement and the instrument
 * synthesis) is written from scratch for this project. No samples, no existing songs,
 * and deliberately NOT the "Happy Birthday" melody.
 *
 * Key: F major · 84 BPM · 4/4 · 40 bars (~114 s) · seamless loop (tails wrap around).
 *
 *  Bars  0– 4  OPENING   "The Beginning of a Surprise"  music box + soft piano
 *  Bars  4–12  MEMORIES  "A Little Nostalgia"           piano melody + gentle strings
 *  Bars 12–20  SECRETS A "Sweet Discovery"              playful arpeggios + celesta
 *  Bars 20–28  SECRETS B  (variation)                   call & response, lighter
 *  Bars 28–36  FINAL GIFT "The Most Special Moment"     full piano/strings/music box
 *  Bars 36–40  CODA       music-box echo, leads back into the opening
 *
 * Run: node scripts/compose-music.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { Mp3Encoder } from '@breezystack/lamejs';

const SR = 44100;
const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 40;
const LOOP_SEC = BARS * BAR;
const N = Math.round(LOOP_SEC * SR);

const L = new Float32Array(N);
const R = new Float32Array(N);

// ---------- helpers ----------
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function midi(name) {
  const m = /^([A-G])(b|#)?(-?\d)$/.exec(name);
  if (!m) throw new Error('bad note ' + name);
  let n = NOTE[m[1]] + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0);
  return n + (parseInt(m[3], 10) + 1) * 12;
}
const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Fast sine via wavetable
const TBL = 8192;
const SIN = new Float32Array(TBL + 1);
for (let i = 0; i <= TBL; i++) SIN[i] = Math.sin((i / TBL) * Math.PI * 2);
function sinp(phase) {
  // phase in cycles
  let p = phase - Math.floor(phase);
  const x = p * TBL;
  const i = x | 0;
  const f = x - i;
  return SIN[i] + (SIN[i + 1] - SIN[i]) * f;
}

// deterministic random
let seed = 1234567;
function rnd() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function addSample(i, v, pan) {
  const idx = ((i % N) + N) % N; // wrap → seamless loop
  const pl = Math.cos((pan + 1) * Math.PI / 4);
  const pr = Math.sin((pan + 1) * Math.PI / 4);
  L[idx] += v * pl;
  R[idx] += v * pr;
}

// ---------- instruments ----------
/** Soft felt piano: detuned string pair, inharmonic partials, pitch dependent decay. */
function piano(t, m, durBeats, vel = 0.5, pan = 0) {
  const f0 = freq(m);
  const start = Math.round(t * SR);
  const hold = durBeats * BEAT;
  const decayBase = 2.6 * Math.pow(0.5, (m - 60) / 24); // lower notes ring longer
  const rel = 0.35;
  const total = Math.min(hold + rel, decayBase * 2.2 + rel);
  const len = Math.round(total * SR);
  const B = 0.00012; // inharmonicity
  const partials = [];
  for (let k = 1; k <= 9; k++) {
    if (f0 * k > 9000) break;
    const amp = Math.pow(k, -1.35) * (k === 1 ? 1 : 0.8) * (1 - 0.1 * (vel < 0.4 ? k : 0));
    partials.push({ r: k * Math.sqrt(1 + B * k * k), amp, d: decayBase / (1 + 0.55 * (k - 1)) });
  }
  const det = 1.0007;
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    let s = 0;
    for (const p of partials) {
      const env = Math.exp(-tt / p.d);
      s += p.amp * env * (sinp(f0 * p.r * tt) + 0.6 * sinp(f0 * p.r * det * tt + 0.13));
    }
    let a = tt < 0.004 ? tt / 0.004 : 1; // hammer
    if (tt > hold) a *= Math.max(0, 1 - (tt - hold) / rel);
    // short soft "thump" on attack
    const thump = tt < 0.03 ? (rnd() * 2 - 1) * 0.02 * (1 - tt / 0.03) : 0;
    addSample(start + n, (s * a * 0.16 + thump) * vel, pan);
  }
}

/** Music box comb tine: bright, slightly inharmonic, fast-decaying sparkle. */
function musicBox(t, m, vel = 0.35, pan = 0.2) {
  const f0 = freq(m);
  const start = Math.round(t * SR);
  const len = Math.round(2.4 * SR);
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    const s =
      sinp(f0 * tt) * Math.exp(-tt / 0.9) +
      0.35 * sinp(f0 * 2.0 * tt) * Math.exp(-tt / 0.45) +
      0.22 * sinp(f0 * 5.4 * tt) * Math.exp(-tt / 0.09) +
      0.08 * sinp(f0 * 8.9 * tt) * Math.exp(-tt / 0.04);
    const a = tt < 0.002 ? tt / 0.002 : 1;
    addSample(start + n, s * a * vel * 0.22, pan);
  }
}

/** Celesta / glockenspiel accent. */
function celesta(t, m, vel = 0.3, pan = -0.3) {
  const f0 = freq(m);
  const start = Math.round(t * SR);
  const len = Math.round(1.8 * SR);
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    const s =
      sinp(f0 * tt) * Math.exp(-tt / 0.7) +
      0.25 * sinp(f0 * 2.76 * tt) * Math.exp(-tt / 0.2) +
      0.1 * sinp(f0 * 5.4 * tt) * Math.exp(-tt / 0.07);
    const a = tt < 0.003 ? tt / 0.003 : 1;
    addSample(start + n, s * a * vel * 0.2, pan);
  }
}

/** Gentle string ensemble: 3 detuned band-limited saw voices, vibrato, slow bow. */
function strings(t, m, durSec, vel = 0.3, pan = 0, attack = 0.7) {
  const f0 = freq(m);
  const start = Math.round(t * SR);
  const rel = 1.1;
  const len = Math.round((durSec + rel) * SR);
  const voices = [-7, 0, 6].map((c) => ({ f: f0 * Math.pow(2, c / 1200), ph: rnd() }));
  const H = Math.max(2, Math.min(10, Math.floor(6000 / f0)));
  const vibR = 4.6 + rnd() * 0.6;
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    const vib = 1 + 0.0028 * sinp(vibR * tt) * Math.min(1, tt / 1.2);
    let s = 0;
    for (const v of voices) {
      const ph = v.f * vib * tt + v.ph;
      for (let h = 1; h <= H; h++) s += sinp(ph * h) * (1 / h) * Math.exp(-h * 0.18);
    }
    let a = tt < attack ? Math.pow(tt / attack, 1.6) : 1;
    if (tt > durSec) a *= Math.max(0, 1 - (tt - durSec) / rel);
    addSample(start + n, s * a * vel * 0.045, pan);
  }
}

/** Warm ambient pad: soft triangle-ish tones, very slow swell. */
function pad(t, m, durSec, vel = 0.25, pan = 0) {
  const f0 = freq(m);
  const start = Math.round(t * SR);
  const rel = 1.6;
  const len = Math.round((durSec + rel) * SR);
  const ph2 = rnd();
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    const lfo = 1 + 0.15 * sinp(0.18 * tt + ph2);
    const s =
      sinp(f0 * tt) + 0.6 * sinp(f0 * 1.003 * tt + ph2) + 0.11 * sinp(f0 * 3 * tt) + 0.05 * sinp(f0 * 2 * tt);
    let a = tt < 1.4 ? tt / 1.4 : 1;
    if (tt > durSec) a *= Math.max(0, 1 - (tt - durSec) / rel);
    addSample(start + n, s * a * vel * 0.05 * lfo, pan);
  }
}

// ---------- harmony ----------
const CH = {
  'Fmaj7': ['F2', ['F', 'A', 'C', 'E']],
  'Dm9': ['D2', ['D', 'F', 'A', 'C', 'E']],
  'Bbmaj7': ['Bb1', ['Bb', 'D', 'F', 'A']],
  'Csus': ['C2', ['C', 'D', 'F', 'G']],
  'Am7': ['A1', ['A', 'C', 'E', 'G']],
  'C/Bb': ['Bb1', ['C', 'E', 'G', 'Bb']],
  'Dm7': ['D2', ['D', 'F', 'A', 'C']],
  'Gm7': ['G1', ['G', 'Bb', 'D', 'F']],
  'C7sus': ['C2', ['C', 'F', 'G', 'Bb']],
  'F': ['F2', ['F', 'A', 'C']],
  'C/E': ['E2', ['E', 'G', 'C']],
  'Bb': ['Bb1', ['Bb', 'D', 'F']],
  'F/A': ['A1', ['A', 'C', 'F']],
  'Bb/C': ['C2', ['Bb', 'D', 'F', 'C']],
  'Dm': ['D2', ['D', 'F', 'A']],
  'C': ['C2', ['C', 'E', 'G']],
};
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11, Bb: 10, Eb: 3 };
function voicing(chord, low = 55, high = 74) {
  const tones = CH[chord][1].map((n) => PC[n]);
  const out = [];
  for (let m = low; m < high; m++) if (tones.includes(m % 12)) out.push(m);
  return out;
}
const bassOf = (chord) => midi(CH[chord][0]);

const PROG = [
  // OPENING
  'Fmaj7', 'Dm9', 'Bbmaj7', 'Csus',
  // MEMORIES
  'Fmaj7', 'Am7', 'Bbmaj7', 'C/Bb', 'Dm7', 'Gm7', 'Bbmaj7', 'C7sus',
  // SECRETS A
  'F', 'C/E', 'Dm7', 'Bb', 'F/A', 'Gm7', 'Bb/C', 'C',
  // SECRETS B
  'Bbmaj7', 'C', 'Am7', 'Dm7', 'Gm7', 'C/E', 'Fmaj7', 'C7sus',
  // FINAL GIFT
  'Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm7', 'C7sus',
  // CODA
  'Bbmaj7', 'Am7', 'Gm7', 'C7sus',
];

// ---------- melodies (note:beats, r = rest) ----------
const MEL = {
  opening: // music box, bars 0–3
    'C6:1 A5:.5 F5:.5 E5:1 r:1 | F5:1 E5:.5 D5:.5 A5:2 | D6:1 C6:.5 A5:.5 F5:1 D5:1 | E5:1 G5:1 C6:2',
  memories: // piano, bars 4–11
    'r:.5 C5:.5 F5:1 E5:1 C5:1 | E5:1.5 D5:.5 C5:1 A4:1 | D5:1 F5:1 A5:1.5 G5:.5 | G5:2 E5:1 C5:1 |' +
    'A5:1 F5:.5 E5:.5 F5:1 A5:1 | Bb5:1.5 A5:.5 G5:1 F5:1 | D5:1 F5:1 E5:1 D5:1 | C5:2 r:.5 C5:.5 E5:.5 G5:.5',
  secretsA: // bars 12–19
    'A5:.5 G5:.5 A5:.5 C6:.5 A5:1 F5:1 | G5:.5 F5:.5 G5:.5 C6:.5 G5:1 E5:1 | F5:.5 E5:.5 F5:.5 A5:.5 D6:1 C6:.5 A5:.5 | Bb5:1.5 A5:.5 G5:1 D5:1 |' +
    'C5:.5 F5:.5 A5:.5 C6:.5 Bb5:.5 A5:.5 G5:1 | Bb5:.5 A5:.5 G5:.5 F5:.5 D5:1 G5:1 | F5:1 G5:.5 A5:.5 Bb5:1 D6:1 | C6:1.5 Bb5:.5 G5:1 E5:1',
  secretsB: // bars 20–27
    'D6:1 C6:1 A5:2 | G5:.5 A5:.5 G5:.5 E5:.5 C5:2 | E5:1 G5:1 C6:1 A5:1 | F5:1.5 E5:.5 D5:2 |' +
    'Bb4:.5 D5:.5 F5:.5 A5:.5 G5:2 | E5:.5 G5:.5 C6:.5 E6:.5 D6:1 C6:1 | A5:1 C6:1 E6:1.5 D6:.5 | C6:2 Bb5:1 G5:1',
  gift: // bars 28–35
    'A5:1.5 D6:.5 C6:1 A5:1 | Bb5:1.5 D6:.5 F6:1 D6:1 | C6:2 A5:1 C6:1 | G5:1.5 A5:.5 G5:1 E5:1 |' +
    'F5:1 A5:1 D6:1 F6:1 | F6:1.5 E6:.5 D6:1 Bb5:1 | Bb5:1 D6:1 C6:1 Bb5:.5 A5:.5 | G5:1 F5:1 E5:2',
  coda: // music box, bars 36–39
    'D6:1 C6:.5 A5:.5 F5:2 | E5:1 C6:1 A5:2 | Bb5:1 A5:.5 G5:.5 D5:2 | C5:1 F5:1 G5:2',
};
function parseMel(str, startBar) {
  const out = [];
  let beat = startBar * 4;
  for (const tok of str.replace(/\|/g, ' ').split(/\s+/).filter(Boolean)) {
    const [n, d] = tok.split(':');
    const dur = parseFloat(d);
    if (n !== 'r') out.push({ t: beat * BEAT, m: midi(n), d: dur });
    beat += dur;
  }
  return out;
}

const human = () => (rnd() - 0.5) * 0.012; // tiny timing humanization

// ---------- arrangement ----------
console.log('Composing…');
PROG.forEach((ch, bar) => {
  const t0 = bar * BAR;
  const v = voicing(ch);
  const bass = bassOf(ch);
  const sec = bar < 4 ? 'open' : bar < 12 ? 'mem' : bar < 20 ? 'secA' : bar < 28 ? 'secB' : bar < 36 ? 'gift' : 'coda';

  // Pad — always there, swelling with the story
  const padVel = { open: 0.22, mem: 0.28, secA: 0.24, secB: 0.26, gift: 0.34, coda: 0.24 }[sec];
  v.slice(0, 4).forEach((m, i) => pad(t0, m, BAR, padVel, i % 2 ? 0.35 : -0.35));
  pad(t0, bass + 12, BAR, padVel * 0.7, 0);

  // Piano left hand
  if (sec === 'open' || sec === 'coda') {
    piano(t0 + human(), bass + 12, 4, 0.34, -0.15);
    v.slice(0, 3).forEach((m, i) => piano(t0 + 0.06 * (i + 1) + BEAT * 2, m, 2, 0.22, -0.05));
  } else if (sec === 'mem') {
    const pat = [bass + 12, v[0] + 0, v[1], v[2], bass + 19, v[1], v[2], v[3] ?? v[0] + 12];
    pat.forEach((m, i) => piano(t0 + i * BEAT * 0.5 + human(), m, i === 0 ? 4 : 1.2, i === 0 ? 0.36 : 0.2, -0.2));
  } else if (sec === 'secA' || sec === 'secB') {
    const pat = [bass + 12, v[0], v[2], v[1], bass + 19, v[2], v[1], v[0] + 12];
    pat.forEach((m, i) => piano(t0 + i * BEAT * 0.5 + human(), m, 0.9, i % 4 === 0 ? 0.32 : 0.18, -0.2));
  } else if (sec === 'gift') {
    piano(t0, bass, 4, 0.32, -0.25);
    const pat = [bass + 12, v[0], v[1], v[2], v[3] ?? v[0] + 12, v[2], v[1], v[0]];
    pat.forEach((m, i) => piano(t0 + i * BEAT * 0.5 + human(), m, 1.0, i % 4 === 0 ? 0.3 : 0.2, -0.15));
  }

  // Strings
  if (sec === 'mem') {
    const fade = Math.min(1, (bar - 4 + 1) / 4); // enter gently
    v.slice(1, 4).forEach((m, i) => strings(t0, m, BAR, 0.22 * fade, [-0.5, 0.1, 0.5][i], 1.0));
  } else if (sec === 'secA' || sec === 'secB') {
    strings(t0, v[1], BAR, 0.14, -0.4, 0.9);
    strings(t0, v[3] ?? v[2], BAR, 0.12, 0.4, 0.9);
  } else if (sec === 'gift') {
    v.slice(0, 4).forEach((m, i) => strings(t0, m, BAR, 0.26, [-0.6, -0.2, 0.2, 0.6][i], 0.6));
    strings(t0, bass + 12, BAR, 0.2, 0, 0.6);
  } else if (sec === 'coda') {
    strings(t0, v[1], BAR, 0.12, -0.3, 1.2);
  }

  // Music box sparkles in the discovery sections (beat 4, rising chord tones)
  if (sec === 'secA' || (sec === 'secB' && bar % 2 === 1)) {
    [v[0] + 24, v[1] + 24, v[2] + 24].forEach((m, i) => musicBox(t0 + BEAT * 3 + i * BEAT / 3, m, 0.22, 0.45));
  }
  // Music box counter-melody in the gift section (8th-note chord tones, every bar)
  if (sec === 'gift') {
    const tones = [v[2] + 24, v[1] + 24, v[0] + 24, v[1] + 24];
    tones.forEach((m, i) => musicBox(t0 + BEAT * (2 + i * 0.5), m, 0.2, 0.5));
  }
});

// Melodies
parseMel(MEL.opening, 0).forEach((n) => { musicBox(n.t, n.m, 0.42, 0.15); });
parseMel(MEL.memories, 4).forEach((n) => piano(n.t + human(), n.m, n.d, 0.5, 0.12));
parseMel(MEL.secretsA, 12).forEach((n, i) => {
  piano(n.t + human(), n.m, n.d, 0.46, 0.12);
  if (n.d >= 1) celesta(n.t, n.m + 12, 0.26, -0.35);
});
parseMel(MEL.secretsB, 20).forEach((n) => {
  piano(n.t + human(), n.m, n.d, 0.44, 0.12);
  if (n.d >= 1.5) celesta(n.t, n.m + 12, 0.22, -0.35);
});
parseMel(MEL.gift, 28).forEach((n) => {
  piano(n.t + human(), n.m, n.d, 0.52, 0.1);
  piano(n.t + 0.004, n.m - 12, n.d, 0.32, 0.05); // octave doubling
  strings(n.t, n.m, n.d * BEAT, 0.12, 0.2, 0.18); // violins on the melody
});
parseMel(MEL.coda, 36).forEach((n) => { musicBox(n.t, n.m, 0.4, 0.15); piano(n.t, n.m - 12, n.d, 0.18, 0); });

// ---------- reverb (Freeverb-style), run over two loop passes so the tail wraps ----------
console.log('Reverb…');
function makeReverb(offset) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({
    buf: new Float32Array(Math.round((d + offset) * SR / 44100) + 1), i: 0, store: 0,
  }));
  const aps = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(Math.round((d + offset) * SR / 44100) + 1), i: 0 }));
  const fb = 0.86, damp = 0.32;
  return (x) => {
    let out = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.store = y * (1 - damp) + c.store * damp;
      c.buf[c.i] = x + c.store * fb;
      c.i = (c.i + 1) % c.buf.length;
      out += y;
    }
    for (const a of aps) {
      const b = a.buf[a.i];
      const y = -out + b;
      a.buf[a.i] = out + b * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      out = y;
    }
    return out;
  };
}
const revL = makeReverb(0), revR = makeReverb(23);
const WL = new Float32Array(N), WR = new Float32Array(N);
for (let pass = 0; pass < 2; pass++) {
  for (let i = 0; i < N; i++) {
    const inp = (L[i] + R[i]) * 0.5 * 0.03;
    const a = revL(inp), b = revR(inp);
    if (pass === 1) { WL[i] = a; WR[i] = b; }
  }
}
const OUTL = new Float32Array(N), OUTR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  OUTL[i] = L[i] * 0.82 + WL[i];
  OUTR[i] = R[i] * 0.82 + WR[i];
}
// gentle one-pole lowpass for warmth (also circular: two passes)
for (const ch of [OUTL, OUTR]) {
  let y = 0;
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < N; i++) { y += (ch[i] - y) * 0.55; if (pass) ch[i] = y; }
}
// normalize to -1.5 dBFS with soft saturation safety
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(OUTL[i]), Math.abs(OUTR[i]));
const g = Math.pow(10, -1.5 / 20) / peak;
console.log('peak', peak.toFixed(3), 'gain', g.toFixed(3));

// File = full loop + 1.5 s of continuation (the loop start) so the player has
// clean audio to loop over even if the decoder adds a few ms of priming.
const PAD = Math.round(1.5 * SR);
const total = N + PAD;
const toI16 = (x) => Math.max(-32767, Math.min(32767, Math.round(Math.tanh(x * g * 1.05) / Math.tanh(1.05) * 32767)));
const l16 = new Int16Array(total), r16 = new Int16Array(total);
for (let i = 0; i < total; i++) { l16[i] = toI16(OUTL[i % N]); r16[i] = toI16(OUTR[i % N]); }

console.log('Encoding MP3…');
const enc = new Mp3Encoder(2, SR, 160);
const chunks = [];
const BLOCK = 1152;
for (let i = 0; i < total; i += BLOCK) {
  const buf = enc.encodeBuffer(l16.subarray(i, i + BLOCK), r16.subarray(i, i + BLOCK));
  if (buf.length) chunks.push(Buffer.from(buf));
}
const end = enc.flush();
if (end.length) chunks.push(Buffer.from(end));
const outPath = path.resolve('public/assets/audio/coquette-birthday-theme.mp3');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.concat(chunks));
console.log(`Saved ${outPath} — loop ${LOOP_SEC.toFixed(3)} s (${N} samples), bar ${BAR.toFixed(4)} s`);

