export const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    image: new Image(), // 画像プロパティを追加
    life: 3,
    score: 0
};

// 画像のソースを設定
player.image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxmUHBsIVe0PcyKoomHQkW_UDHg-mXO7yUvg&s'; // 画像のパスを指定

export function initPlayer(canvas) {
    // place player near the center horizontally and slightly above the vertical center
    player.x = Math.round((canvas.width - player.width) / 2);
    player.y = Math.round(canvas.height * 0.45 - player.height / 2);
    console.log("Player", player);
}

export function drawPlayer(ctx) {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height); // 画像を描画
}
