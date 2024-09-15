let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 540;

// Tạo đối tượng hình ảnh cho bird và archer
let birdImage = new Image();
birdImage.src = 'image/bird.png';  // Đường dẫn đến ảnh của bird

let archerImage = new Image();
archerImage.src = 'image/archer.png';  // Đường dẫn đến ảnh của archer

let bird = {
    x: 50,  // Giữ bird cố định tại x = 50
    y: 200,
    width: 40,
    height: 40,
    gravity: 0.2,  // Điều chỉnh giá trị này để thay đổi tốc độ rơi
    lift: -6,  // Điều chỉnh giá trị này để thay đổi tốc độ bay lên
    velocity: 0,
    liftDuration: 0 // Thời gian nâng lên
};

let archer = {
    x: canvas.width - 40,  // Đặt archer sát mép phải của canvas
    y: 100,
    width: 30,
    height: 30,
    arrowSpeed: 3,
    shootInterval: 2000,
    speed: 2,  // Tốc độ di chuyển chậm
    direction: 1  // Hướng di chuyển (1 = xuống, -1 = lên)
};

let pipes = [];
let arrows = [];
let score = 0;
let gameOver = false;
let gameStarted = false;  // Cờ để xác định trò chơi đã bắt đầu chưa

// Thiết lập chiều cao của khoảng trống giữa các ống
let gapHeight = 190;

function startGame() {
    bird.y = 200;
    bird.velocity = 0;
    bird.liftDuration = 0;
    pipes = [];
    arrows = [];
    score = 0;
    gameOver = false;
    gameStarted = false; // Trò chơi chưa bắt đầu
    // Tạo một ống đầu tiên khi bắt đầu trò chơi
    pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * (canvas.height - gapHeight - 50)) + 50,
        width: 40,
        height: 100
    });
    requestAnimationFrame(gameLoop);
}

function shootArrow() {
    arrows.push({
        x: archer.x - 10,  // Điều chỉnh vị trí mũi tên sao cho nó bắn ra từ cạnh archer
        y: archer.y + archer.height / 2 - 5,
        width: 10,
        height: 5,
        speed: archer.arrowSpeed
    });
}
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ bird (chim) tại vị trí cố định
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Nếu trò chơi bắt đầu, xử lý gravity, pipes và archer
    if (gameStarted) {
        if (bird.liftDuration > 0) {
            bird.velocity = bird.lift;  // Đặt tốc độ lên khi nhấp chuột
            bird.liftDuration--;
        } else {
            bird.velocity += bird.gravity;  // Thay đổi tốc độ dựa trên lực hấp dẫn
        }
        
        bird.y += bird.velocity;

        // Kiểm tra và xử lý va chạm với biên của canvas
        if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
            gameOver = true;  // Kết thúc trò chơi khi chạm mép trên hoặc dưới
        }

        // Vẽ pipes
        pipes.forEach(pipe => {
            context.fillStyle = "#0f0";
            context.fillRect(pipe.x, 0, pipe.width, pipe.y);
            context.fillRect(pipe.x, pipe.y + gapHeight, pipe.width, canvas.height - pipe.y - gapHeight);
            pipe.x -= 2;  // Tốc độ di chuyển của ống

            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.y || bird.y + bird.height > pipe.y + gapHeight)
            ) {
                gameOver = true;
            }

            if (pipe.x + pipe.width === bird.x) {
                score++;
            }
        });

        if (pipes[0] && pipes[0].x + pipes[0].width < 0) {
            pipes.shift();
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * (canvas.height - gapHeight - 50)) + 50,
                width: 40,
                height: 100
            });            
        }

        // Tự động di chuyển archer lên xuống
        archer.y += archer.speed * archer.direction;

        if (archer.y <= 0 || archer.y + archer.height >= canvas.height) {
            archer.direction *= -1;
        }

        // Vẽ archer (cung thủ)
        context.drawImage(archerImage, archer.x, archer.y, archer.width, archer.height);

        // Xử lý các mũi tên do archer bắn
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

        if (gameOver) {
            alert("Game Over! Your score: " + score);
            startGame();  // Restart game
        }
    }

    requestAnimationFrame(gameLoop);
}

// Khi nhấp vào canvas, bắt đầu trò chơi hoặc làm chim bay lên
canvas.addEventListener('click', () => {
    if (!gameStarted) {
        // Bắt đầu trò chơi
        bird.y = 200;  // Đặt lại vị trí của chim
        bird.velocity = 0;  // Đặt lại tốc độ của chim
        bird.liftDuration = 10;  // Thay đổi số lần chim bay lên
        setInterval(shootArrow, archer.shootInterval);
        gameStarted = true;  // Trò chơi bắt đầu sau khi nhấp chuột
    } else {
        // Làm chim bay lên khi nhấp chuột
        bird.velocity = bird.lift;
        bird.liftDuration = 10;  // Thay đổi số lần chim bay lên
    }
});

startGame();
