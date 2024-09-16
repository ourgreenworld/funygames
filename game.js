let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

// Tạo đối tượng hình ảnh cho bird và archer
let birdImage = new Image();  
birdImage.src = 'image/bird.png'; 

let archerImage = new Image();  
archerImage.src = 'image/archer.png'; 

let bird = { 
    x: 50,
    y: 380,
    width: 40,
    height: 40,
    gravity: 0.19,
    lift: -5,
    velocity: 1
};

let archer = { 
    x: 290,
    y: 100,
    width: 30,  // Kích thước chiều rộng của cung thủ
    height: 30, // Kích thước chiều cao của cung thủ
    arrowSpeed: 3,
    shootInterval: 2000
};

let pipes = [];
let arrows = [];
let score = 0;
let gameOver = false;
let countdown = 3;

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
            setInterval(shootArrow, archer.shootInterval);
        }
    }, 1000);
}

function shootArrow() {
    arrows.push({
        x: archer.x,
        y: archer.y + archer.height / 2 - 5,
        width: 10,
        height: 5,
        speed: archer.arrowSpeed
    });
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

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        alert("Game Over! Your score: " + score);
    }
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
});

startGame();
