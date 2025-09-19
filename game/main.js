document.getElementById("txt").innerText = "これはゲームです";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


let x = 225;
let y = 480;
let z1 = 50;
let z2 = 50;
let z3 = 50;
let tama = 0;

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        x -= 10;
    }else if (e.key === "ArrowRight") {
        x += 10;
    } else if(e.key === "ArrowUp"){
        y -= 10;
    } else if (e.key === "ArrowDown") {
        y += 10;
    }else if (e.key === " Space") {
        tama += 1;
    }

});
function gameLoop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 480, 640);

    ctx.fillStyle = "#0099ff";
    ctx.fillRect( x, y, 30, 30);
    requestAnimationFrame(gameLoop);

    ctx.fillStyle = "red";
    ctx.fillRect( 225, z1, 30, 30);
    z1 += 0.5;

    ctx.fillStyle = "red";
    ctx.fillRect( 125, z2 ,30, 30)
    z2 += 0.4;

    ctx.fillStyle = "red";
    ctx.fillRect( 325, z3 ,30, 30)
    z3 += 0.4;

    if (tama > 0){
    ctx.fillStyle = "white";
    // 弾を撃つ処理
    for (let i = 0; i < tama; i++) {
        ctx.fillRect(x + 10, y - i * 20, 10, 10);
    }
    
    }
    requestAnimationFrame(gameLoop);
}


gameLoop();