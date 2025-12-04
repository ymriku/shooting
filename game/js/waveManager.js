let wave = 0;
let lastWaveAt = performance.now();

export function updateWave() {
  const now = performance.now();
  // increase wave every 12 seconds
  if (now - lastWaveAt > 12000) {
    wave += 1;
    lastWaveAt = now;
    console.log('Wave ->', wave);
  }
}

export function getSpawnLimit() {
  return 3 + Math.min(12, Math.floor(5 + wave * 0.8));
}

export function getCurrentWave() { return wave; }
