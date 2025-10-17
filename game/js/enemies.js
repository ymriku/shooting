export const enemies = [];
const SIZE =26;

function pushEnemies(canvas){
    const w = SIZE;
    const h = SIZE;
    const x = Math.random() * (canvas.width - w);
    const y = -h;
    const vy = 5;

    enemies.push({ x, y, width: w, height: h, vy });
}

export function SpawnEnemy (canvas){
    if(enemies.length < 5) {
        spawnEnemy(canvas);
    }
}

// export function UpdateEnemies (canvas) {
//     for (let i = enemies.length -1; i >=0; i--) {
//         const enemy = enemies[i];
//         enemy.y += enemy.vy;
//         if (enemy.y > canvas.height) {
//             enemies.splice(i, 1);
//         }
//     }
// }

// export function drawEnemies (ctx) {
//     for (const enemy of enemies) {
//         ctx.fillStyle = enemy.color || "crimson";
//         ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
//     }
// }