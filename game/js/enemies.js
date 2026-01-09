export const enemies = [];
const enemyPool = [];
export const enemyBullets = [];
export let bossEnemy = null; // ボス敵
const SIZE = 50;

import { player } from './player.js';

function pushEnemies(canvas) {
  const w = SIZE;
  const h = SIZE;
  const x = Math.random() * (canvas.width - w);
  const y = 0;

  // pick enemy type
  const types = ['basic', 'seeker', 'shooter'];
  const type = types[Math.floor(Math.random() * types.length)];

  let vy = 3 + Math.random() * 3; // base vertical speed
  if (type === 'seeker') vy = 2 + Math.random() * 2;
  if (type === 'shooter') vy = 1.8 + Math.random() * 2.2;

  const enemy = enemyPool.length ? Object.assign(enemyPool.pop(), { x, y, width: w, height: h, vy, type }) : { x, y, width: w, height: h, vy, type };

  // shooter-specific
  if (type === 'shooter') {
    enemy.lastShot = performance.now();
    enemy.shootInterval = 900 + Math.random() * 600; // ms
  }

  enemies.push(enemy);
}

export function spawnEnemy(canvas, limit = 5) {
  if (enemies.length < limit) {
    pushEnemies(canvas);
  }
}

export function spawnBoss(canvas) {
  if (bossEnemy === null) {
    const bossSize = 100;
    bossEnemy = {
      x: (canvas.width - bossSize) / 2,
      y: 50,
      width: bossSize,
      height: bossSize,
      vy: 0.5,
      type: 'boss',
      hp: 30, // ボスのHP
      maxHp: 30,
      lastShot: performance.now(),
      shootInterval: 500
    };
    console.log('Boss spawned!');
  }
}


export function updateEnemies(canvas) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    // behavior by type
    if (e.type === 'seeker') {
      // track player horizontally
      const targetX = player.x + player.width / 2 - e.width / 2;
      const dx = targetX - e.x;
      e.x += Math.sign(dx) * Math.min(Math.abs(dx), 1.6);
    }

    e.y += e.vy;

    // shooter enemies can fire bullets
    if (e.type === 'shooter' && performance.now() - (e.lastShot || 0) > e.shootInterval) {
      e.lastShot = performance.now();
      // push an enemy bullet aimed at the player
      const bx = e.x + e.width / 2 - 3;
      const by = e.y + e.height;
      const angle = Math.atan2((player.y + player.height / 2) - by, (player.x + player.width / 2) - bx);
      const speed = 4 + Math.random() * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      enemyBullets.push({ x: bx, y: by, width: 6, height: 6, vx, vy });
    }

    if (e.y > canvas.height) {
      // return to pool
      enemyPool.push(e);
      enemies.splice(i, 1);
    }
  }
}

export function updateBoss(canvas) {
  if (bossEnemy === null) return;
  
  const b = bossEnemy;
  // ボスの移動
  b.y += b.vy;
  
  // 画面外に出たらボスを倒す
  if (b.y > canvas.height) {
    bossEnemy = null;
  }
  
  // ボスが敵弾を発射
  if (performance.now() - b.lastShot > b.shootInterval) {
    b.lastShot = performance.now();
    // プレイヤーめがけて複数の弾を発射
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const bx = b.x + b.width / 2 - 3;
      const by = b.y + b.height;
      const speed = 2 + Math.random() * 1;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      enemyBullets.push({ x: bx, y: by, width: 6, height: 6, vx, vy });
    }
  }
}

export function releaseBoss() {
  bossEnemy = null;
}

export function releaseEnemy(e) {
  // normalize and push back to pool
  e.active = false;
  enemyPool.push(e);
}

export function drawEnemies(ctx) {
  for (const e of enemies) {
    let color = '#ff0077';
    if (e.type === 'seeker') color = '#00ff00';
    else if (e.type === 'shooter') color = '#ffff00';
    
    ctx.fillStyle = color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(e.x, e.y, e.width, e.height);
  }
}

export function drawBoss(ctx) {
  if (bossEnemy === null) return;
  
  const b = bossEnemy;
  // ボスを赤で描画
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(b.x, b.y, b.width, b.height);
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 3;
  ctx.strokeRect(b.x, b.y, b.width, b.height);
  
  // HPバーを描画
  const barWidth = b.width;
  const barHeight = 10;
  const barX = b.x;
  const barY = b.y - 20;
  
  // 背景
  ctx.fillStyle = '#333333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  // HP
  const hpPercent = b.hp / b.maxHp;
  ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : (hpPercent > 0.25 ? '#ffff00' : '#ff0000');
  ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
  
  // 枠
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barWidth, barHeight);
}

export function updateEnemyBullets(canvas) {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.y > canvas.height || b.x < 0 || b.x > canvas.width) {
      enemyBullets.splice(i, 1);
    }
  }
}

export function drawEnemyBullets(ctx) {
  ctx.fillStyle = 'orange';
  for (const b of enemyBullets) {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  }
}
