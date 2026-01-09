import { player } from "./player.js";
import { enemies, enemyBullets, releaseEnemy } from "./enemies.js";
import { bullets, releaseBullet, setGameOver } from "./main.js";
import { spawnParticles } from "./particles.js";
import { incrementEnemyCount } from "./waveManager.js";

export function handleCollisions() {
  // 弾 × 敵
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    const e = enemies[ei];
    let hit = false;

    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      if (rectsIntersect(
        { x: b.x, y: b.y, width: b.width, height: b.height },
        { x: e.x, y: e.y, width: e.width, height: e.height }
      )) {
        // 命中：弾と敵を削除、スコア加算
        // エフェクト
        spawnParticles(e.x + e.width / 2, e.y + e.height / 2, 'gold', 14);
        // audio removed — visual particles are spawned above
        // release bullet back to the pool
        releaseBullet(b);
        bullets.splice(bi, 1);
        // return enemy to pool before removing from active list
        releaseEnemy(e);
        enemies.splice(ei, 1);
        player.score += 1;
        incrementEnemyCount(); // ウェーブ進行をチェック
        console.log("Score:", player.score);
        hit = true;
        break; // この敵は消えたので次の敵へ
      }
    }

    if (hit) continue;
  }

  // 自機 × 敵（ゲームオーバー）
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    const e = enemies[ei];
    if (rectsIntersect(
      { x: player.x, y: player.y, width: player.width, height: player.height },
      { x: e.x, y: e.y, width: e.width, height: e.height }
    )) {
      // 無敵状態ならダメージを受けない
      if (player.invincible) {
        releaseEnemy(e);
        enemies.splice(ei, 1);
        spawnParticles(player.x + player.width/2, player.y + player.height/2, 'gold', 8);
        break;
      }
      player.life -= 1;
      // audio removed
      spawnParticles(player.x + player.width/2, player.y + player.height/2, 'crimson', 12);
      if (player.life <= 0) {
        console.log("Game Over");
        setGameOver();
      }
      // return enemy to pool
      releaseEnemy(e);
      enemies.splice(ei, 1);
      console.log("Player Life:", player.life);
    //   isGameOver = true;
      break;
    }
  }

  // 敵の弾 × 自機
  for (let bi = enemyBullets.length - 1; bi >= 0; bi--) {
    const b = enemyBullets[bi];
    if (rectsIntersect(
      { x: player.x, y: player.y, width: player.width, height: player.height },
      { x: b.x, y: b.y, width: b.width, height: b.height }
    )) {
      // 無敵状態ならダメージを受けない
      if (player.invincible) {
        enemyBullets.splice(bi, 1);
        spawnParticles(player.x + player.width/2, player.y + player.height/2, 'gold', 5);
        continue;
      }
      // 被弾
      enemyBullets.splice(bi, 1);
      player.life -= 1;
      // audio removed
      spawnParticles(player.x + player.width/2, player.y + player.height/2, 'crimson', 10);
      console.log('Player Life:', player.life);
      if (player.life <= 0) {
        console.log('Game Over');
        setGameOver();
      }
    }
  }
}

function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y   
  );
}