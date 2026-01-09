export const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    life: 3,
    score: 0,
    invincible: false,
    invincibleUntil: 0,
    rapidFireUntil: 0,
    gameMode: 'normal' // 'normal' or 'infinity'
};

export function initPlayer(canvas) {
    // place player near the center horizontally and slightly above the vertical center
    player.x = Math.round((canvas.width - player.width) / 2);
    player.y = Math.round(canvas.height * 0.45 - player.height / 2);
    player.invincible = false;
    player.invincibleUntil = 0;
    player.rapidFireUntil = 0;
    console.log("Player", player);
}

export function drawPlayer(ctx) {
    // Draw player as a blue triangle
    ctx.fillStyle = player.invincible ? '#ff00ff' : '#0099ff'; // 無敵時はマゼンタ
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.closePath();
    ctx.fill();
}

export function activateInvincibility() {
    player.invincible = true;
    player.invincibleUntil = performance.now() + 5000; // 5秒間無敵
    console.log('Invincibility activated for 5 seconds');
}

export function activateRapidFire() {
    player.rapidFireUntil = performance.now() + 5000; // 5秒間連射速度UP
    console.log('Rapid fire activated for 5 seconds');
}

export function updateInvincibility() {
    if (player.invincible && performance.now() > player.invincibleUntil) {
        player.invincible = false;
        console.log('Invincibility deactivated');
    }
}

