// ゲームの初期設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const player = {
    x: 225, 
    y: 480, 
    width: 30, 
    height: 30, 
    color: "#0099ff",
    z1: 50,
    z2: 50,
    z3: 50
};
const bullets = [];
const bulletspeed = 6;

function tryshoot() {
    bullets.push({ 
        x: player.x, 
        y: player.y, 
        width: 5.5, 
        height: 5.5, 
        vy:bulletspeed 
    });
}

// 入力処理
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        if (player.x > 0) {
        player.x -= 10;
        }
    } else if (e.key === "ArrowRight") {
        if (player.x < canvas.width - player.width){
        player.x += 10;
        }
    } else if (e.key === "ArrowUp") {
        if(player.y > 0)
        player.y -= 10;
    } else if (e.key === "ArrowDown") {
        if (player.y < canvas.height - player.height) {
            player.y += 10;
        }
    } else if (e.key === " " || e.code === "Space") {
        tryshoot();
    } 
});

function update() {
    for (let i=bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.vy;
    if (bullet.y < 0) {
            bullets.splice(i, 1);
        }
        console.log(bullets.length);
    };
    
}

function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 480, 640);
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", 
                               "#9400D3", "#FF1493", "#00FFFF", "#7FFF00", "#FF4500", "#1E90FF"];
        bullets.forEach((bullet, i) => {
        ctx.fillStyle = rainbowColors[i % rainbowColors.length];
       
        const colorIndex = Math.floor(Date.now() / 100) % rainbowColors.length;
        ctx.fillStyle = rainbowColors[colorIndex];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
        for (let i=bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -=bullet.vy;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);  

        }
        // 敵描画・移動
        ctx.fillStyle = "red";
        ctx.fillRect(225, player.z1, player.width, player.height);
        player.z1 += 0.5;

        ctx.fillRect(125, player.z2, player.width, player.height);
        player.z2 += 0.4;

        ctx.fillRect(325, player.z3, player.width, player.height);
        player.z3 += 0.4;
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
