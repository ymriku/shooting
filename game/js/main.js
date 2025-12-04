import { player, initPlayer, drawPlayer } from "./player.js";
import { spawnEnemy, updateEnemies, drawEnemies, updateEnemyBullets, drawEnemyBullets, enemies as enemyList, enemyBullets } from "./enemies.js";
import { updateWave, getSpawnLimit, getCurrentWave } from './waveManager.js';
import { input } from './input.js';
import { handleCollisions } from "./collision.js";
import { updateParticles, drawParticles } from "./particles.js";

// (audio & mobile touch UI removed per request)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
let gameState = 'menu';

const menuOverlay = document.getElementById('menuOverlay');
const menuBestEl = document.getElementById('menuBest');
const startBtn = document.getElementById('startBtn');
const pausedOverlay = document.getElementById('pausedOverlay');
const resumeBtn = document.getElementById('resumeBtn');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');
const restartBtn = document.getElementById('restartBtn');

function showOverlay(el) { el.classList.remove('hidden'); el.classList.add('visible'); }
function hideOverlay(el) { el.classList.remove('visible'); el.classList.add('hidden'); }

startBtn.addEventListener('click', () => startGame());
resumeBtn.addEventListener('click', () => resumeGame());
restartBtn.addEventListener('click', () => restartGame());

function startGame() {
    player.score = 0;
    player.life = 3;
    gameState = 'playing';
    hideOverlay(menuOverlay);
    if (menuBestEl) menuBestEl.innerText = `Best: ${localStorage.getItem('bestScore') || 0}`;
}

function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        hideOverlay(pausedOverlay);
    }
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        showOverlay(pausedOverlay);
    }
}

export function setGameOver() {
    gameState = 'gameover';
    finalScoreEl.innerText = `Score: ${player.score}`;
    const best = Math.max(player.score, Number(localStorage.getItem('bestScore') || 0));
    localStorage.setItem('bestScore', best);
    bestScoreEl.innerText = `Best: ${best}`;
    if (menuBestEl) menuBestEl.innerText = `Best: ${best}`;
    showOverlay(gameOverOverlay);
}

function restartGame() {
    player.score = 0;
    player.life = 3;
    enemyList.length = 0;
    enemyBullets.length = 0;
    while (bullets.length) {
        const b = bullets.pop();
        releaseBullet(b);
    }
    gameState = 'playing';
    hideOverlay(gameOverOverlay);
}

export const bullets = [];
const bulletPool = [];
const MAX_BULLETS = 60;
const BULLET_SPEED = -20;
const SHOT_COOLDOWN = 140;
let lastShotAt = 0;

function acquireBullet() {
    if (bulletPool.length > 0) return bulletPool.pop();
    if (bullets.length + bulletPool.length < MAX_BULLETS) {
        return { x: 0, y: 0, width: 5, height: 5, vy: BULLET_SPEED, h: 0, active: false };
    }
    return null; 
}

export function releaseBullet(b) {
    b.active = false;
    bulletPool.push(b);
}

function tryShoot() {
    const now = performance.now();
    if (now - lastShotAt < SHOT_COOLDOWN) return;
    lastShotAt = now;

    const b = acquireBullet();
    if (!b) return; 

    b.x = player.x + player.width / 2 - 2.5;
    b.y = player.y;
    b.width = 5;
    b.height = 5;
    b.vy = BULLET_SPEED;
    b.h = Math.floor(Math.random() * 360);
    b.active = true;
    bullets.push(b);
}

function updateScore() {
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.innerText = `Score: ${player.score}`;
    const lifeBoard = document.getElementById("lifeBoard");
    lifeBoard.innerText = `Life: ${player.life}`;
    const waveBoard = document.getElementById("waveBoard");
    waveBoard.innerText = `Wave: ${getCurrentWave()}`;

}

// keyboard: use flags so behavior is consistent with mobile
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': input.left = true; break;
        case 'ArrowRight': input.right = true; break;
        case 'ArrowUp': input.up = true; break;
        case 'ArrowDown': input.down = true; break;
        case 'Escape':
            if (gameState === 'playing') pauseGame();
            else if (gameState === 'paused') resumeGame();
            break;
        default:
            break;
    }
    // space is easier as code
    if (e.code === 'Space') tryShoot();
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft': input.left = false; break;
        case 'ArrowRight': input.right = false; break;
        case 'ArrowUp': input.up = false; break;
        case 'ArrowDown': input.down = false; break;
        default: break;
    }
});

function update() {
    if (gameState !== 'playing') return;
    for(let i = bullets.length - 1; i >= 0; i--){
        const bullet = bullets[i];
        bullet.y += bullet.vy;
        bullet.h = (bullet.h + 4) % 360;

        if(bullet.y < 0){
            bullets.splice(i, 1);
            releaseBullet(bullet);
        }
    }

        // input handling (keyboard & mobile) — move smoothly using flags
        if (input.left) {
            if (player.x > 10) player.x -= 6;
        }
        if (input.right) {
            if (player.x < canvas.width - player.width - 10) player.x += 6;
        }
        if (input.up) {
            if (player.y > 10) player.y -= 6;
        }
        if (input.down) {
            if (player.y < canvas.height - player.height - 10) player.y += 6;
        }
        if (input.fire) tryShoot();
    updateEnemies(canvas);
    updateWave();
    updateEnemyBullets(canvas);

    updateScore();

    handleCollisions();

    updateParticles();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer(ctx);

    for(let i = bullets.length - 1; i >= 0; i--){
        const bullet = bullets[i];
        ctx.fillStyle = `hsl(${bullet.h}, 90%, 60%)`;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    drawEnemies(ctx);

    drawEnemyBullets(ctx);

    drawParticles(ctx);

        if (gameState === 'playing') {
            spawnEnemy(canvas, getSpawnLimit());
    }

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
