
import { player, initPlayer, drawPlayer } from "./player.js";
import { spawnEnemy, updateEnemies, drawEnemies } from "./enemies.js";
import { handleCollisions } from "./collision.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

initPlayer(canvas);
spawnEnemy(canvas);


export const bullets = [];
const BULLET_SPEED = -5;

function tryShoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5, // Center the bullet
        y: player.y,
        y: player.y,
        width: 5,
        height: 5,
        vy: BULLET_SPEED
    })
}


window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        if (player.x > 10) {
            player.x -= 10;
        }
    } else if (e.key === "ArrowRight") {
        if (player.x < canvas.width - player.width - 10) {
            player.x += 10;
        }
    } else if (e.key === " ") {
        tryShoot();
    }
});

function update() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y += bullet.vy;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }
    updateEnemies(canvas);
    spawnEnemy(canvas);
    handleCollisions();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer(ctx);

    ctx.fillStyle = "white";
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    drawEnemies(ctx);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
