let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 1480;
canvas.height = 480;

// Tạo đối tượng hình ảnh cho bird và archer
let birdImage = new Image();  
birdImage.src = 'image/bird.png'; 

let archerImage = new Image();  
archerImage.src = 'image/archer.png'; 

let cloudImage = new Image();  
cloudImage.src = 'image/cloud.png';  // Đảm bảo cloud.png có nền trong suốt

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
    x: 1390,
    y: 100,
    width: 30,  // Kích thước chiều rộng của cung thủ
    height: 30, // Kích thước chiều cao của cung thủ
    arrowSpeed: 3,
    shootInterval: 2000
};

let clouds = [];  
let arrows = [];
let score = 0;
let gameOver = false;
let countdown = 3;

// Tạo các đám mây ban đầu ở những vị trí ngẫu nhiên
function generateInitialClouds() {
    for (let i = 0; i < 5; i++) {  // Tạo 5 đám mây ban đầu
        let x = 400 + i * 300;  // Mỗi đám mây cách nhau 300 pixel
        let y = Math.floor(Math.random() * 200) + 50;
        clouds.push({x: x, y: y, width: 160, height: 140});
    }
}

function startGame() {
    bird.y = 200;
    bird.velocity = 0;
    clouds = [];
    arrows = [];
    score = 0;
    gameOver = false;

    generateInitialClouds();  // Gọi hàm để tạo các đám mây ban đầu

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

    // Vẽ clouds bằng hình ảnh (có nền trong suốt)
    clouds.forEach((cloud, index) => {
        context.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);
        cloud.x -= 2;  // Đám mây di chuyển về bên trái

        // Kiểm tra va chạm giữa bird và cloud
        if (
            bird.x < cloud.x + cloud.width &&
            bird.x + bird.width > cloud.x &&
            bird.y < cloud.y + cloud.height &&
            bird.y + bird.height > cloud.y
        ) {
            gameOver = true;
        }

        // Tăng điểm khi bird vượt qua cloud
        if (cloud.x + cloud.width === bird.x) {
            score++;
        }

        // Loại bỏ đám mây khi nó ra khỏi màn hình và tạo đám mây mới
        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
            let newCloudX = canvas.width;  // Đám mây mới xuất hiện ở cạnh phải màn hình
            let newCloudY = Math.floor(Math.random() * 200) + 50;  // Y ngẫu nhiên
            clouds.push({x: newCloudX, y: newCloudY, width: 160, height: 140});
        }
    });

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Chỉ game over khi chim chạm vào cạnh dưới của canvas
    if (bird.y > canvas.height - bird.height) {
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

// Tính khoảng cách viền cho bird
function calculateBorderDistance() {
    let borderDistance = {
        left: bird.x,
        right: canvas.width - (bird.x + bird.width),
        top: bird.y,
        bottom: canvas.height - (bird.y + bird.height)
    };

    console.log('Khoảng cách viền:', borderDistance);
}

// Lắng nghe sự kiện click để tăng độ cao cho bird
canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
    calculateBorderDistance();  // Tính khoảng cách viền mỗi lần click
});

// Bắt đầu trò chơi
startGame();
