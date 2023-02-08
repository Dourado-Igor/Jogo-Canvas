var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 175;
var paddleX = (canvas.width - paddleWidth) / 2;
var x = canvas.width / 2;
var y = canvas.height - paddleHeight - ballRadius;
var rightPressed = false;
var leftPressed = false;
var temporizador = null;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;



var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}


function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        clearInterval(temporizador);
                    }
                }
            }
        }
    }
}



function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}



function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    collisionDetection();
    drawBall();
    drawBricks();
    drawScore();
    drawLives();
    x += dx;
    y += dy;
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy=getRandomArbitrary(1,3);
            if(x>paddleX+paddleWidth/2){
                dx=getRandomArbitrary(1,2);
            }else{
                dx=-getRandomArbitrary(1,3);
            }
            dx=-dx;
            /*
            if(dx<0){
                dx=-getRandomArbitrary(1,3);
            }else{
                dx=getRandomArbitrary(1,3);
            }
            dx=getRandomArbitrary(1,3);
*/
            dy = -dy;
        }
        else {
            lives--;
            clearInterval(temporizador);
            temporizador = null;
            if (lives == 0) {
                alert("GAME OVER");
            } else {
                //Volver a la posición inicial
                paddleX = (canvas.width - paddleWidth) / 2;
                x = canvas.width / 2;
                y = canvas.height - paddleHeight - ballRadius;
            }

            //document.location.reload();
        }
    }


    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 3;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 3;
    }



}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
    if (e.keyCode == 32) {
        //Empieza el juego
        if (temporizador == null) {
            //inicio temporizador
            inicializarPartida();
        } else {
            clearInterval(temporizador);
            temporizador = null;
        }
    }
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}


function inicializarPartida() {
    temporizador = setInterval(draw, 15);
}
draw();

