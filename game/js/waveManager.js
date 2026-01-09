let wave = 0;
let enemiesDefeated = 0; // 倒した敵の数をカウント

export function updateWave() {
  // updateWaveは時間ベースではなく、敵撃破ベースに変更
}

export function incrementEnemyCount() {
  enemiesDefeated += 1;
  // 10体倒すごとにウェーブを1増やす
  if (enemiesDefeated % 10 === 0) {
    wave += 1;
    console.log('Wave ->', wave, '(Enemies Defeated:', enemiesDefeated, ')');
    return true; // ウェーブが増えたことを返す
  }
  return false;
}

export function shouldSpawnBoss() {
  // ウェーブ5と10の時にボスを出現させる
  return wave === 5 || wave === 10;
}


export function getSpawnLimit() {
  // ウェーブごとに敵を1体ずつ増やす（初期値3体 + ウェーブ×1）
  return 3 + wave;
}

export function getCurrentWave() { return wave; }

export function getEnemiesDefeated() { return enemiesDefeated; }

export function resetWave() {
  wave = 0;
  enemiesDefeated = 0;
}
