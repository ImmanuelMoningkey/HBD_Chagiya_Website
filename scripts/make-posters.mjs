/**
 * Generates poster images (first-second frame) + metadata for the videos using headless Chrome/Edge.
 * Run: node scripts/make-posters.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const exe = browsers.find((b) => fs.existsSync(b));
if (!exe) throw new Error('Chrome/Edge not found');

const vidDir = path.resolve('public/assets/videos');
const outDir = path.join(vidDir, 'posters');
fs.mkdirSync(outDir, { recursive: true });
const vids = fs.readdirSync(vidDir).filter((f) => /\.(mp4|webm|mov)$/i.test(f)).sort();
const urls = vids.map((v) => pathToFileURL(path.join(vidDir, v)).href);
const page = pathToFileURL(path.resolve('scripts/poster-extractor.html')).href + '?t=1.2&v=' + encodeURIComponent(urls.join(','));

const dom = execFileSync(exe, [
  '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required',
  '--virtual-time-budget=20000', '--dump-dom', page,
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const m = /<pre id="out">RESULT(.*?)END<\/pre>/s.exec(dom);
if (!m) throw new Error('Extraction failed: ' + dom.slice(0, 500));
const res = JSON.parse(m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
res.forEach((r, i) => {
  const name = vids[i].replace(/\.\w+$/, '.jpg');
  fs.writeFileSync(path.join(outDir, name), Buffer.from(r.poster.split(',')[1], 'base64'));
  console.log(`${vids[i]}: ${r.width}x${r.height}, ${r.duration.toFixed(2)}s -> posters/${name}`);
});
