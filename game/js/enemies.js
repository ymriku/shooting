export const enemies = [];
const SIZE = 50;
const enemyImages = 
["https://m.media-amazon.com/images/I/41rnqZ6DpgL.CR116,0,375,375.jpg",
 "https://renote.net/files/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjI2NTUxMiwicHVyIjoiYmxvYl9pZCJ9fQ==--6fb6da8ba84db0859aa88a65ca84b870a633b420/orihime007.png",
 "https://anibase.net/files/97daeb2e44bce700109d17ccb8466b58/320",
 "https://images-na.ssl-images-amazon.com/images/I/61+1fgvrQKL._CR250,0,1200,1200_.jpg"
];

function pushEnemies(canvas) {
  const w = SIZE;
  const h = SIZE;
  const x = Math.random() * (canvas.width - w);
  const y = 0;
  const vy = 5;
  const image = enemyImages[Math.floor(Math.random() * enemyImages.length)];

  enemies.push({ x, y, width: w, height: h, vy, image });
}

export function spawnEnemy(canvas) {
  if (enemies.length < 5) {
    pushEnemies(canvas);
  }
}

export function updateEnemies(canvas) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.y += e.vy;
    if (e.y > canvas.height) {
      enemies.splice(i, 1);
    }
  }
}

export function drawEnemies(ctx) {
  for (const e of enemies) {
    const img = new Image();
    img.src = e.image;
    ctx.drawImage(img, e.x, e.y, e.width, e.height);
  }
}
