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

let arrowImage = new Image();  
arrowImage.src = 'image/arrow.png'; 

let coinImage = new Image();  
coinImage.src = 'image/coin.png';  // Replace with your coin image

let heartImage = new Image();
heartImage.src = 'image/heart.png';  // Replace with your heart image

let shieldImage = new Image();
shieldImage.src = 'image/shield.png';  // Replace with your shield image

let bird = { 
    x: 70,
    y: 380,
    width: 40,
    height: 40,
    gravity: 0.09,
    lift: -3,
    velocity: 1,
    hasBullets: true,
    health: 100,
    invincible: false,
    invincibleTimer: 0  
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
    health: 100,
    level: 1 
};

let clouds = [];  
let arrows = [];   
let bullets = [];  
let items = [];
let score = 0;
let gameOver = false;
let countdown = 3;

function generateInitialClouds() {
    for (let i = 0; i < 5; i++) {
        let x = 400 + i * 300;
        let y = Math.floor(Math.random() * (canvas.height - 80));
        let cloudType = Math.random() > 0.5 ? 'white' : 'dark';
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
    items = [];
    score = 0;
    gameOver = false;
    archer.health = 100;
    archer.level = 1;

    generateInitialClouds();

    const countdownInterval = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000";
        context.font = "30px Arial";
        context.fillText(`Starting in: ${countdown}`, canvas.width / 2 - 80, canvas.height / 2);

        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameLoop();
            setInterval(shootArrow, archer.shootInterval);
        }
    }, 1000);
}

function randomArrowPattern() {
    return Math.floor(Math.random() * 3);  // Random patterns 0, 1, 2
}

function shootArrow() {
    let numArrows = Math.floor(Math.random() * 3) + 1; // Randomly choose 1 to 3 arrows
    for (let i = 0; i < numArrows; i++) {
        let offset = (i - Math.floor(numArrows / 2)) * 50; // Adjust the Y position based on how many arrows are being shot
        arrows.push({
            x: archer.x,
            y: archer.y + archer.height / 2 - 10 + offset,  // Adjust y-position
            width: 60,  
            height: 80,  
            speed: archer.arrowSpeed + archer.level  // Increase speed with level
        });
    }
}

function shootBullet() {
    if (bird.hasBullets) {
        bullets.push({
            x: bird.x + bird.width,
            y: bird.y + bird.height / 2 - 5,
            width: 60,
            height: 80,
            speed: 5
        });
    }
}
let itemSpawnTimer = 0; 
function spawnItem() {
    if (Math.random() < 0.005) {  // 1% chance to spawn an item
        let effectType = Math.random() > 0.5 ? 'coin' : (Math.random() > 0.5 ? 'heart' : 'shield');  // Randomly choose effect

        let itemImage;
        if (effectType === 'coin') {
            itemImage = coinImage;
        } else if (effectType === 'heart') {
            itemImage = heartImage;
        } else {
            itemImage = shieldImage;
        }

        items.push({
            x: canvas.width,
            y: Math.floor(Math.random() * (canvas.height - 50)),
            width: 50,
            height: 50,
            effect: effectType,
            image: itemImage
        });
    }
}

function collectItem(itemIndex) {
    let item = items[itemIndex];
    if (item.effect === 'heart') {
        bird.health = Math.min(100, bird.health + 20);  // Restore health, max 100
    } else if (item.effect === 'coin') {
        score++;  // Increase score when collecting a coin
    } else if (item.effect === 'shield') {
        bird.invincible = true;  // Activate shield
        bird.invincibleTimer = 10;  // 10 seconds duration
    }
    items.splice(itemIndex, 1);  // Remove the collected item
}

function drawHealthBar() {
    context.fillStyle = '#000';
    context.fillRect(archer.x, archer.y - 20, archer.width, 10);
    context.fillStyle = '#FF0000';
    context.fillRect(archer.x, archer.y - 20, (archer.health / 100) * archer.width, 10);
}

function drawBirdHealthBar() {
    context.fillStyle = '#000';
    context.fillRect(bird.x, bird.y - 20, bird.width, 10);
    context.fillStyle = '#00FF00';
    context.fillRect(bird.x, bird.y - 20, (bird.health / 100) * bird.width, 10);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ chim và thanh sức khỏe của nó
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    drawBirdHealthBar();

    // Logic cho mây và va chạm
    clouds.forEach((cloud, index) => {
        context.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
        cloud.x -= 2;

        if (cloud.type === 'dark' &&
            bird.x < cloud.x + cloud.width &&
            bird.x + bird.width > cloud.x &&
            bird.y < cloud.y + cloud.height &&
            bird.y + bird.height > cloud.y
        ) {
            if (!bird.invincible) {
                bird.health -= 20;  // Giảm sức khỏe khi va chạm với mây đen
            }
        }

        if (cloud.x + cloud.width === bird.x) {
            score++;
        }

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

    // Di chuyển chim
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y <= 0) {
        gameOver = true;
    }

    // Vẽ cung thủ và thanh sức khỏe của nó
    context.drawImage(archerImage, archer.x, archer.y, archer.width, archer.height);
    archer.y += archer.velocity * archer.direction;

    if (archer.y <= 0 || archer.y + archer.height >= canvas.height) {
        archer.direction *= -1;
    }

    drawHealthBar();

    // Logic cho mũi tên và viên đạn
    arrows.forEach((arrow, index) => {
        context.drawImage(arrowImage, arrow.x, arrow.y, arrow.width, arrow.height);
        arrow.x -= arrow.speed;

        if (bird.x < arrow.x + arrow.width && bird.x + bird.width > arrow.x && bird.y < arrow.y + arrow.height && bird.y + bird.height > arrow.y) {
            if (!bird.invincible) {
                bird.health -= 20;  // Giảm sức khỏe khi va chạm với mũi tên
                arrows.splice(index, 1);
            }
        }

        if (arrow.x < 0) {
            arrows.splice(index, 1);
        }
    });
    
    bullets.forEach((bullet, index) => {
        context.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.x += bullet.speed;

        if (bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }

        if (bullet.x < archer.x + archer.width && bullet.x + bullet.width > archer.x && archer.y < bullet.y + bullet.height && archer.y + archer.height > bullet.y) {
            archer.health -= 1; // Giảm sức khỏe của archer
            bullets.splice(index, 1);
        }
    });
    
    spawnItem();

    items.forEach((item, index) => {
        context.drawImage(item.image, item.x, item.y, item.width, item.height);
        item.x -= 3;

        if (item.x + item.width < 0) {
            items.splice(index, 1);
        }

        if (bird.x < item.x + item.width && bird.x + bird.width > item.x && bird.y < item.y + item.height && bird.y + bird.height > item.y) {
            collectItem(index);
        }
    });

    // Kiểm tra trạng thái bất khả xâm phạm
    if (bird.invincible) {
        bird.invincibleTimer -= 1 / 60;
        if (bird.invincibleTimer <= 0) {
            bird.invincible = false;
        }
    }

    // Hiển thị điểm số và sức khỏe của chim
    context.fillStyle = "#000";
    context.font = "30px Arial";
    context.fillText(`Score: ${score}`, 10, 30);
    context.fillText(`Health: ${bird.health}`, 10, 60);

    // Kiểm tra điều kiện game over cho bird
    if (bird.health <= 0) {
        gameOver = true; // Kết thúc trò chơi nếu sức khỏe của bird giảm xuống 0
    }

    // Archer defeated, bird wins
    if (archer.health <= 0) {
        context.fillStyle = "green";
        context.font = "40px Arial";
        context.fillText("Victory! Bird Wins!", canvas.width / 2 - 150, canvas.height / 2);
        return;  // Dừng vòng lặp trò chơi
    }

    // Game over condition
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "40px Arial";
        context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
    shootBullet();  
});
startGame();
