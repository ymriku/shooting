export const enemies = [];
const SIZE = 26;
const enemyImages = [
  'https://img21.shop-pro.jp/PA01380/519/etc/124_%C0%C4_3.jpg?cmsp_timestamp=20190124175618%20alt=',
  'https://kotobank.jp/image/dictionary/daijisen/media/104677.jpg',
  'https://www.tamura1753.jp/Color-Paper/wp-content/uploads/2022/07/%E8%8B%A5%E7%AB%B9%E3%80%80%E7%B4%80%E5%B7%9E%E3%81%AE%E8%89%B2%E4%B8%8A%E8%B3%AA.jpg',
  'https://ascii.jp/img/2021/04/29/3195045/l/111575ae7ae580d7.jpg'
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
