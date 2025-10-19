import { player , initPlayer , drawPlayer} from './player.js';
import { spawnEnemy, enemies } from './enemies.js';

    // ゲームの初期設定
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    initPlayer(canvas);
    spawnEnemy(canvas);

    // 定数
    const ENEMY_SPEED = 2;
    const PLAYER_SPEED = 10;
    const BULLET_SPEED = 6;
    const BULLET_SIZE = 5.5;
    const RAINBOW_COLORS = [
        "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082",
        "#9400D3", "#FF1493", "#00FFFF", "#7FFF00", "#FF4500", "#1E90FF"
    ];

        // 弾
    const bullets = [];

    // 弾を発射（中央から）
    function tryShoot() {
        const bx = player.x + player.width / 2 - BULLET_SIZE / 2;
        bullets.push({
            x: bx,
            y: player.y,
            width: BULLET_SIZE,
            height: BULLET_SIZE,
            vy: BULLET_SPEED
        });
    }

    // キー入力処理
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":
                player.x = Math.max(0, player.x - PLAYER_SPEED);
                break;
            case "ArrowRight":
                player.x = Math.min(canvas.width - player.width, player.x + PLAYER_SPEED);
                break;
            case "ArrowUp":
                player.y = Math.max(0, player.y - PLAYER_SPEED);
                break;
            case "ArrowDown":
                player.y = Math.min(canvas.height - player.height, player.y + PLAYER_SPEED);
                break;
            case " ":
            default:
                // fallthrough handled below
        }
        // スペースキーは e.code もチェック
        if (e.code === "Space" || e.key === " ") {
            tryShoot();
        }
    });

    // ゲーム状態更新
    function update() {
        // 弾の移動と画面外削除（後ろからループ）
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y -= b.vy;
            if (b.y + b.height < 0) bullets.splice(i, 1);
        }

        // 敵の画面外チェック
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.y + enemy.height < 0) enemies.splice(i, 1);
        }
    }




    // 描画：プレイヤー
    drawPlayer(ctx);

    // 描画：弾（虹色）
    function drawBullets(time) {
        const baseIndex = Math.floor(time / 100);
        bullets.forEach((b, i) => {
            const colorIndex = (baseIndex + i) % RAINBOW_COLORS.length;
            ctx.fillStyle = RAINBOW_COLORS[colorIndex];
            ctx.fillRect(b.x, b.y, b.width, b.height);
        });
    }

    // 描画：敵
    function drawEnemies() {
        ctx.fillStyle = "red";
        enemies.forEach((enemy) => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    // メイン描画
    function draw(timestamp = Date.now()) {
        // 画面クリア
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawPlayer(ctx);
        drawBullets(timestamp);
        drawEnemies();
    }

    // ゲームループ
    function gameLoop(timestamp) {
        update();
        draw(timestamp || Date.now());
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
