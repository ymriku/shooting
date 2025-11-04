export const player = {
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    image: new Image(), // 画像プロパティを追加
    life: 3
};

// 画像のソースを設定
player.image.src = 'https://ami.animecharactersdatabase.com/uploads/chars/5457-637889691.png'; // 画像のパスを指定

export function initPlayer(canvas) {
    player.x = (canvas.width / 2 - player.width) / 2;
    player.y = canvas.height - 60;
    console.log("Player", player);
}

export function drawPlayer(ctx) {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height); // 画像を描画
}
