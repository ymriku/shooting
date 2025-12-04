export const enemies = [];
const enemyPool = [];
export const enemyBullets = [];
const SIZE = 50;
const enemyImageURLs = [
  "https://m.media-amazon.com/images/I/41rnqZ6DpgL.CR116,0,375,375.jpg",
  "https://renote.net/files/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjI2NTUxMiwicHVyIjoiYmxvYl9pZCJ9fQ==--6fb6da8ba84db0859aa88a65ca84b870a633b420/orihime007.png",
  "https://anibase.net/files/97daeb2e44bce700109d17ccb8466b58/320",
  "https://images-na.ssl-images-amazon.com/images/I/61+1fgvrQKL._CR250,0,1200,1200_.jpg"
];

// Preload Image objects so drawEnemies can reuse them each frame.
const enemyImages = enemyImageURLs.map((url) => {
  const img = new Image();
  img.src = url;
  return img;
});

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

  const image = enemyImages[Math.floor(Math.random() * enemyImages.length)];

  const enemy = enemyPool.length ? Object.assign(enemyPool.pop(), { x, y, width: w, height: h, vy, img: image, type }) : { x, y, width: w, height: h, vy, img: image, type };

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

export function releaseEnemy(e) {
  // normalize and push back to pool
  e.active = false;
  enemyPool.push(e);
}

export function drawEnemies(ctx) {
  for (const e of enemies) {
    if (e.img && e.img.complete) ctx.drawImage(e.img, e.x, e.y, e.width, e.height);
    else {
      ctx.fillStyle = '#ff0077';
      ctx.fillRect(e.x, e.y, e.width, e.height);
    }
  }
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
