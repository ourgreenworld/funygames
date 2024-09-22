let archerVisible = false; // Biến để theo dõi trạng thái hiển thị của archer

function startGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    arrows = [];
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

    // Sau 5 phút (300000 milliseconds), hiển thị archer và bắt đầu bắn
    setTimeout(() => {
        archerVisible = true;
        setInterval(shootArrow, archer.shootInterval);
    }, 300000);  // 5 phút = 300000 milliseconds
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ bird (chim) bằng hình ảnh
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Vẽ pipes
    pipes.forEach(pipe => {
        context.fillStyle = "#0f0";
        context.fillRect(pipe.x, 0, pipe.width, pipe.y);
        context.fillRect(pipe.x, pipe.y + 100, pipe.width, canvas.height - pipe.y - 100);
        pipe.x -= 2;

        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + 100)
        ) {
            gameOver = true;
        }

        if (pipe.x + pipe.width === bird.x) {
            score++;
        }
    });

    if (pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
        pipes.push({x: 320, y: Math.floor(Math.random() * 200) + 50, width: 40, height: 100});
    }

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y < 0) {
        gameOver = true;
    }

    // Chỉ vẽ archer và xử lý mũi tên sau 5 phút
    if (archerVisible) {
        // Vẽ archer (cung thủ) bằng hình ảnh
        context.drawImage(archerImage, archer.x, archer.y, archer.width, archer.height);

        // Update arrows shot by archer
        arrows.forEach((arrow, index) => {
            context.fillStyle = "#000";
            context.fillRect(arrow.x, arrow.y, arrow.width, arrow.height);
            arrow.x -= arrow.speed;

            if (
                bird.x < arrow.x + arrow.width &&
                bird.x + bird.width > arrow.x &&
                bird.y < arrow.y + arrow.height &&
                bird.y + bird.height > arrow.y
            ) {
                gameOver = true;
            }

            if (arrow.x + arrow.width < 0) {
                arrows.splice(index, 1);
            }
        });
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        alert("Game Over! Your score: " + score);
    }
}
