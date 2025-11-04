export const enemies = [];
const SIZE = 26;
const enemyImages = [
  'https://m.media-amazon.com/images/I/41rnqZ6DpgL.CR116,0,375,375.jpg',
  'https://m.media-amazon.com/images/I/41lapPKdPJL.CR76,25,342,342.jpg',
  'https://preview.redd.it/2onlxufvu9r91.png?width=640&crop=smart&auto=webp&s=acba79f04b522d60ea00dc041b2686eca940347c',
  'https://cdn-ak.f.st-hatena.com/images/fotolife/k/kichitan/20220923/20220923125025.jpg'
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
