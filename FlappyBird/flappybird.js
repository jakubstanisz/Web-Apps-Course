let board;
let boardWidth = 400;
let boardHeight = 800;
let context;

let birdWidth = 60;
let birdHeight = 70;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.2;

let gameOver = false;
let gameStarted = false;
let score = 0;
let bestScores = [];

let messageImg;
let gameoverImg;

let wingSound = new Audio("assets/Sound Effects/wing.wav");
let pointSound = new Audio("assets/Sound Effects/point.wav");
let hitSound = new Audio("assets/Sound Effects/hit.wav");
let dieSound = new Audio("assets/Sound Effects/die.wav");
let swooshSound = new Audio("assets/Sound Effects/swoosh.wav");

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadHighScores();

    birdImg = new Image();
    birdImg.src = "assets/FlappyBird/superamelka.png";
    birdImg.onload = function() {
        if (gameStarted) {
             context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }
    }

    topPipeImg = new Image();
    topPipeImg.src = "assets/FlappyBird/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "assets/FlappyBird/bottompipe.png";

    messageImg = new Image();
    messageImg.src = "assets/UI/message.png";
    gameoverImg = new Image();
    gameoverImg.src = "assets/UI/gameover.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    if (!gameStarted) {
        let msgWidth = 184;
        let msgHeight = 267;
        let msgX = (boardWidth - msgWidth) / 2;
        let msgY = (boardHeight - msgHeight) / 2;

        if (messageImg.complete) {
             context.drawImage(messageImg, msgX, msgY);
        }
        return;
    }

    if (gameOver) {
        velocityY += gravity;
        bird.y += velocityY;
        drawRotatedBird();
        
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        }

        if (bird.y + bird.height >= board.height) {
            drawGameOverScreen();
        }
        return; 
    }

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    drawRotatedBird();

    if (bird.y > board.height) {
        playSound(dieSound);
        triggerGameOver();
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
            playSound(pointSound);
        }

        if (detectCollision(bird, pipe)) {
            playSound(hitSound);
            triggerGameOver();
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px Courier New";
    context.fillText(score, 5, 45);
}

function drawRotatedBird() {
    context.save();
    context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (velocityY * 0.1)));
    if (gameOver) rotation = Math.PI / 2; 
    context.rotate(rotation);
    context.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    context.restore();
}

function placePipes() {
    if (gameOver || !gameStarted) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingspace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingspace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        
        if (!gameStarted) {
            gameStarted = true;
            playSound(swooshSound);
            jump();
            return;
        }

        if (gameOver) {
            if (bird.y + bird.height >= board.height) {
                playSound(swooshSound);
                resetGame();
            }
            return;
        }

        jump();
    }
}

function jump() {
    velocityY = -6;
    playSound(wingSound);
}

function playSound(sound) {
    try {
        sound.currentTime = 0;
        sound.play();
    } catch(err) {
        console.log("Audio play error:", err);
    }
}

function triggerGameOver() {
    if (gameOver) return;
    gameOver = true;
    
    saveScore(score);
}

function drawGameOverScreen() {
    let goWidth = 192;
    let goHeight = 42;
    let goX = (boardWidth - goWidth) / 2;
    let goY = 150;

    if (gameoverImg.complete) {
        context.drawImage(gameoverImg, goX, goY);
    }

    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(50, 200, 300, 300);

    context.fillStyle = "white";
    context.font = "20px Courier New";
    context.fillText("Twój wynik: " + score, 110, 260);
    context.fillText("Najlepszy: " + (bestScores[0] || 0), 110, 290);
    
    context.fillText("Top 5:", 110, 330);
    for(let i=0; i < Math.min(bestScores.length, 5); i++) {
        context.fillText((i+1) + ". " + bestScores[i], 130, 360 + (i*25));
    }

    context.fillStyle = "yellow";
    context.font = "20px Courier New";
    context.fillText("Spacja = Restart", 110, 550);
}

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityY = 0;
    gameOver = false;
    gameStarted = false;
}

function detectCollision(a, b) {
    let offset = 12;
    return a.x + offset < b.x + b.width &&
           a.x + a.width - offset > b.x &&
           a.y + offset < b.y + b.height &&
           a.y + a.height - offset > b.y;
}

function loadHighScores() {
    let storedScores = localStorage.getItem("flappyHighScores");
    if (storedScores) {
        bestScores = JSON.parse(storedScores);
    } else {
        bestScores = [];
    }
}

function saveScore(newScore) {
    bestScores.push(newScore);
    bestScores.sort((a, b) => b - a);
    bestScores = bestScores.slice(0, 5);
    localStorage.setItem("flappyHighScores", JSON.stringify(bestScores));
}