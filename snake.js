const c = document.getElementById('gameCanvas');
const cellSize = 10;
const ctx = c.getContext('2d');
const food = {};
const highScore = document.getElementById('highScore');
const highScoreContainer = document.getElementById('highScoreContainer');
const snake = {};

food.checkCollision = function () {
  return !!snake.cells.filter(function (cell) {
    return cell.x === this.x && cell.y === this.y
  }).length
}

food.draw = function () {
  drawSquare(this.x, this.y, 'orange', 'black');
};

food.setPosition = function () {
  this.x = Math.round(Math.random() * (c.width - cellSize) / cellSize);
  this.y = Math.round(Math.random() * (c.height - cellSize) / cellSize);

  if (this.checkCollision()) {
    this.setPosition()
  }
};

snake.checkCollision = function () {
  const head = this.cells[0];

  return !!this.cells.filter(function (cell) {
    return cell !== head && cell.x === head.x && cell.y === head.y
  }).length;
};

snake.draw = function () {
  this.cells.forEach(function (cell) {
    drawSquare(cell.x, cell.y, 'DodgerBlue', 'black')
  });
};

snake.eat = function () {
  this.length ++;
  food.setPosition();
};

snake.initialize = function (startingX, startingY) {
  this.cells = [];
  this.direction = 'right';
  this.length = 5;
  for (let i = this.length; i > 0; i--) {
    this.cells.push({
      x: startingX + i,
      y: startingY,
    });
  }
};

snake.moveAndEat = function () {
  const newHead = {
    x: this.cells[0].x,
    y: this.cells[0].y,
  }

  if (this.direction === 'right') {
    newHead.x++;
  } else if (this.direction === 'left') {
    newHead.x--;
  } else if (this.direction === 'up') {
    newHead.y++;
  } else if (this.direction === 'down') {
    newHead.y--;
  }

  if (newHead.x >= c.width / cellSize) {
    newHead.x = 0;
  } else if (newHead.x < 0) {
    newHead.x = c.width / cellSize;
  } else if (newHead.y >= c.height / cellSize) {
    newHead.y = 0;
  } else if (newHead.y < 0) {
    newHead.y = c.height / cellSize;
  }

  if (newHead.x === food.x && newHead.y === food.y) {
    this.eat();
  } else {
    this.cells.pop();
  }

  this.cells.unshift(newHead);
  return this;
};

function checkHighScore () {
  if (!localStorage.getItem('highScore')) {
    highScoreContainer.style.display = 'block';
  }

  if (!localStorage.getItem('highScore') || localStorage.getItem('highScore') < (snake.length - 5)) {
    localStorage.setItem('highScore', snake.length - 5);
    highScore.innerHTML = snake.length - 5;
  }
};

function drawScore (fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.fillText('score ' + (snake.length - 5), 5, c.height - 5);
};

function drawScreen (fillStyle, strokeStyle) {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(0, 0, c.width, c.height);
};

function drawSquare (x, y, fillStyle, strokeStyle) {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

function initializeHighScore () {
  if (localStorage.getItem('highScore')) {
    highScore.innerHTML = localStorage.getItem('highScore');
    highScoreContainer.style.display = 'block';
  }
};

function resetGame () {
  snake.initialize(4, 0);
  food.setPosition();
};

function update () {
  drawScreen('black', 'DodgerBlue');
  snake.moveAndEat().draw();
  food.draw();

  if (snake.checkCollision()) {
    checkHighScore();
    resetGame();
  }

  drawScore('orange');
};

initializeHighScore();
resetGame();
setInterval(update, 60);

window.addEventListener('keydown', function (e) {
  if (e.keyCode === 40 && snake.direction !== 'down') {
    snake.direction = 'up';
  } else if (e.keyCode === 39 && snake.direction !== 'left') {
    snake.direction = 'right';
  } else if (e.keyCode === 38 && snake.direction !== 'up') {
    snake.direction = 'down';
  } else if (e.keyCode === 37 && snake.direction !== 'right') {
    snake.direction = 'left';
  }
});
