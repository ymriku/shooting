import { player, initPlayer, drawPlayer, activateInvincibility, activateRapidFire, updateInvincibility } from "./player.js";
import { spawnEnemy, updateEnemies, drawEnemies, updateEnemyBullets, drawEnemyBullets, enemies as enemyList, enemyBullets, releaseEnemy, spawnBoss, updateBoss, drawBoss, bossEnemy, releaseBoss } from "./enemies.js";
import { updateWave, getSpawnLimit, getCurrentWave, resetWave, getEnemiesDefeated, shouldSpawnBoss } from './waveManager.js';
import { input } from './input.js';
import { handleCollisions } from "./collision.js";
import { updateParticles, drawParticles } from "./particles.js";

// (audio & mobile touch UI removed per request)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
let gameState = 'menu';

const menuOverlay = document.getElementById('menuOverlay');
const modeSelection = document.getElementById('modeSelection');
const startMenu = document.getElementById('startMenu');
const menuBestEl = document.getElementById('menuBest');
const startBtn = document.getElementById('startBtn');
const normalModeBtn = document.getElementById('normalModeBtn');
const infinityModeBtn = document.getElementById('infinityModeBtn');
const pausedOverlay = document.getElementById('pausedOverlay');
const resumeBtn = document.getElementById('resumeBtn');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');
const restartBtn = document.getElementById('restartBtn');
const gameClearOverlay = document.getElementById('gameClearOverlay');
const clearScoreEl = document.getElementById('clearScore');
const clearBestScoreEl = document.getElementById('clearBestScore');
const clearRetryBtn = document.getElementById('clearRetryBtn');

function showOverlay(el) { el.classList.remove('hidden'); el.classList.add('visible'); }
function hideOverlay(el) { el.classList.remove('visible'); el.classList.add('hidden'); }

startBtn.addEventListener('click', () => showModeSelection());
normalModeBtn.addEventListener('click', () => startGameWithMode('normal'));
infinityModeBtn.addEventListener('click', () => startGameWithMode('infinity'));
resumeBtn.addEventListener('click', () => resumeGame());
restartBtn.addEventListener('click', () => restartGame());
clearRetryBtn.addEventListener('click', () => restartGame());

function showModeSelection() {
    startMenu.style.display = 'none';
    modeSelection.style.display = 'block';
}

function startGameWithMode(mode) {
    player.gameMode = mode;
    startGame();
}

function startGame() {
    player.score = 0;
    player.life = 3;
    initPlayer(canvas);
    gameState = 'playing';
    hideOverlay(menuOverlay);
    startMenu.style.display = 'block';
    modeSelection.style.display = 'none';
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
    
    // インフィニティモードの場合、リスタートボタンの処理を変更
    if (player.gameMode === 'infinity') {
        restartBtn.innerText = 'モード選択に戻る';
        restartBtn.onclick = () => backToModeSelection();
    } else {
        restartBtn.innerText = 'リトライ';
        restartBtn.onclick = () => restartGame();
    }
    
    showOverlay(gameOverOverlay);
}

function backToModeSelection() {
    player.score = 0;
    player.life = 3;
    resetWave();
    enemyList.length = 0;
    enemyBullets.length = 0;
    while (bullets.length) {
        const b = bullets.pop();
        releaseBullet(b);
    }
    gameState = 'menu';
    hideOverlay(gameOverOverlay);
    showOverlay(menuOverlay);
    startMenu.style.display = 'none';
    modeSelection.style.display = 'block';
}
export function setGameClear() {
    gameState = 'gameclear';
    clearScoreEl.innerText = `Score: ${player.score}`;
    const best = Math.max(player.score, Number(localStorage.getItem('bestScore') || 0));
    localStorage.setItem('bestScore', best);
    clearBestScoreEl.innerText = `Best: ${best}`;
    if (menuBestEl) menuBestEl.innerText = `Best: ${best}`;
    
    // ゲームクリア後もモード選択に戻る
    clearRetryBtn.innerText = 'モード選択に戻る';
    clearRetryBtn.onclick = () => backToModeSelection();
    
    showOverlay(gameClearOverlay);
}

function restartGame() {
    player.score = 0;
    player.life = 3;
    resetWave();
    enemyList.length = 0;
    enemyBullets.length = 0;
    while (bullets.length) {
        const b = bullets.pop();
        releaseBullet(b);
    }
    gameState = 'playing';
    hideOverlay(gameOverOverlay);
    hideOverlay(gameClearOverlay);
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
    // 連射速度UPがアクティブな場合はクールダウンを半分に
    const cooldown = performance.now() < player.rapidFireUntil ? SHOT_COOLDOWN / 2 : SHOT_COOLDOWN;
    if (now - lastShotAt < cooldown) return;
    lastShotAt = now;

    // 3つの弾を同時に発射
    const bulletConfigs = [
        { offset: -8, vx: -5 },  // 左：左斜め
        { offset: 0, vx: 0 },    // 中央：真上
        { offset: 8, vx: 5 }     // 右：右斜め
    ];
    
    for (const config of bulletConfigs) {
        const b = acquireBullet();
        if (!b) continue;

        b.x = player.x + player.width / 2 - 2.5 + config.offset;
        b.y = player.y;
        b.width = 5;
        b.height = 5;
        b.vy = BULLET_SPEED;
        b.vx = config.vx;
        b.h = Math.floor(Math.random() * 360);
        b.active = true;
        bullets.push(b);
    }
}


function updateScore() {
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.innerText = `Score: ${player.score}`;
    const lifeBoard = document.getElementById("lifeBoard");
    lifeBoard.innerText = `Life: ${player.life}`;
    const waveBoard = document.getElementById("waveBoard");
    // ノーマルモードは「現在のウェーブ/10」、インフィニティモードは「敵撃破数/∞」
    if (player.gameMode === 'normal') {
        waveBoard.innerText = `Wave: ${getCurrentWave()}/10`;
    } else {
        waveBoard.innerText = `Wave: ${getEnemiesDefeated()}/∞`;
    }
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
        // チート機能
        case 'q':
        case 'Q':
            activateInvincibility(); // 無敵モード（Q）
            break;
        case 'w':
        case 'W':
            // 敵全削除（W）
            const clearedCount = enemyList.length;
            for (let i = enemyList.length - 1; i >= 0; i--) {
                const e = enemyList[i];
                releaseEnemy(e);
            }
            enemyList.length = 0;
            player.score += clearedCount;
            console.log(`All ${clearedCount} enemies cleared. Score +${clearedCount}`);
            break;
        case 'e':
        case 'E':
            activateRapidFire(); // 連射速度UP（E）
            break;
        case 'r':
        case 'R':
            player.score += 50; // スコア加算（R）
            console.log('Score +50. Current score:', player.score);
            break;
        case 't':
        case 'T':
            player.life = 3; // ライフ回復（T）
            console.log('Life restored to 3');
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
    // ゲームクリア判定は最初に行う（ノーマルモードのみ）
    if (gameState === 'playing' && player.gameMode === 'normal') {
        const currentWave = getCurrentWave();
        if (currentWave >= 10 || player.score >= 100) {
            setGameClear();
            return;
        }
    }
    
    if (gameState !== 'playing') return;
    
    // 無敵状態の更新
    updateInvincibility();
    
    for(let i = bullets.length - 1; i >= 0; i--){
        const bullet = bullets[i];
        bullet.x += bullet.vx;
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
    
    // ボスの更新
    if (shouldSpawnBoss() && bossEnemy === null) {
        spawnBoss(canvas);
    }
    updateBoss(canvas);
    
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
        // インフィニティモードは難易度を下げるため敵を少なくする
        let spawnLimit = getSpawnLimit();
        if (player.gameMode === 'infinity') {
            spawnLimit = Math.max(2, Math.floor(spawnLimit * 0.6)); // 60%の難易度に
        }
        spawnEnemy(canvas, spawnLimit);
    }

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
