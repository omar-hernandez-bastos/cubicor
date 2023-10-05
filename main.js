import "./style.css";

// Init Canvas

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;
let score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// board
const createBoard = (width, height) => {
  return Array(height).fill(Array(width).fill(0));
};
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
// piece player
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

// Random pieces
const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],

  [
    [0, 1, 0],
    [1, 1, 1],
  ],

  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
];

// Game loop
let dropCounter = 0;
let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    movePiece("y", 1);
    dropCounter = 0;
  }

  draw();
  requestAnimationFrame(update);
}
function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = "yellow";
        context.fillRect(x, y, 1, 1);
      }
    });
  });
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = "red";
        context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1);
      }
    });
  });
  document.querySelector("#score").innerHTML = score;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    const rotated = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotated.push(row);
    }
    const previousShape = piece.shape;

    piece.shape = rotated;
    if (checkCollision()) {
      piece.shape = previousShape;
    }
  }
  if (event.key === "ArrowLeft") {
    movePiece("x", -1);
  }
  if (event.key === "ArrowRight") {
    movePiece("x", 1);
  }
  if (event.key === "ArrowDown") {
    movePiece("y", 1);
  }
});

function movePiece(axis, direction) {
  piece.position[axis] += direction;
  if (checkCollision()) {
    piece.position[axis] -= direction;
    solidifyPiece();
    removeRows();
  }
}

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value === 1 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    });
  });
}
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });
  // reset
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;
  // get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];
  //gameover
  if (checkCollision()) {
    alert("Game Over =(");
    board.forEach((row) => row.fill(0));
  }
}
function removeRows() {
  const rowsToRemove = [];
  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToRemove.push(y);
    }
  });
  rowsToRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 10;
  });
}

update();

// auto drop
