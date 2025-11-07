import { player, initPlayer, drawPlayer } from "./player.js";
import { spawnEnemy, updateEnemies, drawEnemies } from "./enemies.js";
import { handleCollisions } from "./collision.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

initPlayer(canvas);

export const bullets = [];
const BULLET_SPEED = -20;

function tryShoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5, // Center the bullet
        y: player.y,
        width: 5,
        height: 5,
        vy: BULLET_SPEED,
        h: Math.floor(Math.random() * 360) // 初期色相をランダムに
    })
}

function updateScore() {
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.innerText = `Score: ${player.score}`;
    const lifeBoard = document.getElementById("lifeBoard");
    lifeBoard.innerText = `Life: ${player.life}`;

}

window.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft"){
        if(player.x > 10){
            player.x -= 10;
        }
    } else if(e.key === "ArrowRight"){
        if(player.x < canvas.width - player.width - 10){
            player.x += 10;
        }
    } else if(e.code === "Space"){
        tryShoot();
    }      
});

function update() {
    for(let i = bullets.length - 1; i >= 0; i--){
        const bullet = bullets[i];
        bullet.y += bullet.vy;
        // 色相を進めて虹色にする
        bullet.h = (bullet.h + 4) % 360;

        if(bullet.y < 0){
            bullets.splice(i, 1);
        }
    }
    updateEnemies(canvas);

    updateScore();
    
    handleCollisions();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer(ctx);

    for(let i = bullets.length - 1; i >= 0; i--){
        const bullet = bullets[i];
        // HSLで虹色に描画
        ctx.fillStyle = `hsl(${bullet.h}, 90%, 60%)`;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    drawEnemies(ctx);

    spawnEnemy(canvas);

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
