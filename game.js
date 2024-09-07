let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 180,
    y: 380,
    width: 20,  
    height: 20,
    gravity: 0.19,
    lift: -5,
    velocity: 1
};

let pipes = [];
let score = 0;
let gameOver = false;
let countdown = 3; // Biến đếm ngược

function startGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    pipes.push({x: 320, y: Math.floor(Math.random() * 200) + 50, width: 40, height: 100});

    countdown = 3;
    const countdownInterval = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000";
        context.font = "30px Arial";
        context.fillText(countdown, canvas.width / 2 - 10, canvas.height / 2);

        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameLoop();
        }
    }, 1000);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ chim
    context.fillStyle = "#ff0";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Vẽ ống
    pipes.forEach(pipe => {
        context.fillStyle = "#0f0";
        context.fillRect(pipe.x, 0, pipe.width, pipe.y);
        context.fillRect(pipe.x, pipe.y + 100, pipe.width, canvas.height - pipe.y - 100);
        pipe.x -= 2;

        // Kiểm tra va chạm
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + 100)
        ) {
            gameOver = true;
        }

        // Thêm điểm
        if (pipe.x + pipe.width === bird.x) {
            score++;
        }
    });

    // Xóa ống cũ và thêm ống mới
    if (pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
        pipes.push({x: 320, y: Math.floor(Math.random() * 200) + 50, width: 40, height: 100});
    }

    // Cập nhật vị trí chim
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y < 0) {
        gameOver = true;
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        alert("Game Over! Điểm của bạn: " + score);
        // Gửi điểm số lên bảng xếp hạng nếu đăng nhập
    }
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
});

// Bắt đầu trò chơi với đếm ngược
startGame();
