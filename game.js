let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 1580;
canvas.height = 680;

let birdImage = new Image();  
birdImage.src = 'image/bird.png'; 

let archerImage = new Image();  
archerImage.src = 'image/archer.png'; 

let cloudImage = new Image();  
cloudImage.src = 'image/cloud.png'; 

let bulletImage = new Image();  
bulletImage.src = 'image/bullet.png'; 

let bird = { 
    x: 50,
    y: 380,
    width: 40,
    height: 40,
    gravity: 0.09,
    lift: -3,
    velocity: 1,
    hasBullets: false  // Indicator if bird can shoot bullets
};

let archer = { 
    x: 1390,
    y: 100,
    width: 150,  
    height: 200, 
    arrowSpeed: 3,
    shootInterval: 2000,
    velocity: 2,
    direction: 1,
    health: 100  // Archer's health
};

let clouds = [];  
let arrows = [];
let bullets = [];
let score = 0;
let gameOver = false;
let countdown = 3;

// Hàm tạo đám mây với vị trí ngẫu nhiên trong toàn bộ canvas
function generateInitialClouds() {
    for (let i = 0; i < 5; i++) {
        let x = 400 + i * 300;
        let y = Math.floor(Math.random() * (canvas.height - 80));

        // Random chọn đám mây trắng hoặc đám mây tối
        let cloudType = Math.random() > 0.5 ? 'white' : 'dark'; // 50% đám mây là trắng hoặc tối
        let cloudImageSrc = cloudType === 'white' ? 'image/cloud.png' : 'image/dark.png';

        clouds.push({
            x: x,
            y: y,
            width: 100,
            height: 80,
            type: cloudType,
            image: new Image(),
        });
        clouds[i].image.src = cloudImageSrc;
    }
}

function startGame() {
    bird.y = 200;
    bird.velocity = 0;
    clouds = [];
    arrows = [];
    bullets = [];
    score = 0;
    gameOver = false;
    archer.health = 100; // Reset health

    generateInitialClouds();

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

function shootBullet() {
    if (bird.hasBullets) {
        bullets.push({
            x: bird.x + bird.width,
            y: bird.y + bird.height / 2,
            width: 10,
            height: 5,
            speed: 5
        });
        bird.hasBullets = false;  // Remove bullet after shooting
    }
}

// Draw health bar for the archer
function drawHealthBar() {
    context.fillStyle = '#000';
    context.fillRect(archer.x, archer.y - 20, archer.width, 10);
    context.fillStyle = '#FF0000';
    context.fillRect(archer.x, archer.y - 20, (archer.health / 100) * archer.width, 10);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ bird
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Vẽ clouds
    clouds.forEach((cloud, index) => {
        context.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
        cloud.x -= 2;

        // Nếu đám mây là dark, kiểm tra va chạm và gameOver
        if (cloud.type === 'dark' &&
            bird.x < cloud.x + cloud.width &&
            bird.x + bird.width > cloud.x &&
            bird.y < cloud.y + cloud.height &&
            bird.y + bird.height > cloud.y
        ) {
            gameOver = true;
        }

        // Tăng điểm khi chim vượt qua đám mây
        if (cloud.x + cloud.width === bird.x) {
            score++;
        }

        // Xử lý khi đám mây rời khỏi màn hình
        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
            let newCloudX = canvas.width;
            let newCloudY = Math.floor(Math.random() * (canvas.height - 140));
            let newCloudType = Math.random() > 0.5 ? 'white' : 'dark';
            let newCloudImageSrc = newCloudType === 'white' ? 'image/cloud.png' : 'image/dark.png';

            clouds.push({
                x: newCloudX,
                y: newCloudY,
                width: 160,
                height: 140,
                type: newCloudType,
                image: new Image(),
            });
            clouds[clouds.length - 1].image.src = newCloudImageSrc;
        }
    });

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height) {
        gameOver = true;
    }

    // Vẽ archer và xử lý di chuyển cung thủ
    context.drawImage(archerImage, archer.x, archer.y, archer.width, archer.height);
    archer.y += archer.velocity * archer.direction;

    if (archer.y <= 0 || archer.y + archer.height >= canvas.height) {
        archer.direction *= -1;
    }

    // Draw health bar for the archer
    drawHealthBar();

    // Update arrows
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

    // Update bullets
    bullets.forEach((bullet, index) => {
        context.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.x += bullet.speed;

        // Check for collision between bullet and archer
        if (
            bullet.x < archer.x + archer.width &&
            bullet.x + bullet.width > archer.x &&
            bullet.y < archer.y + archer.height &&
            bullet.y + bullet.height > archer.y
        ) {
            archer.health -= 20; // Reduce health by 20 when hit
            bullets.splice(index, 1); // Remove bullet on hit
        }

        if (bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }
    });

    if (archer.health <= 0) {
        alert("Congratulations! You defeated the archer!");
        gameOver = true;
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        alert("Game Over! Your score: " + score);
    }
}

// Lắng nghe sự kiện click để tăng độ cao cho bird và bắn đạn
canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
    shootBullet();  // Shoot bullet on click
});

// Bắt đầu trò chơi
startGame();
