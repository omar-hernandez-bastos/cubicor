import "./style.css";
import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE } from "./constants.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let gameOver = false;
let score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

const createEmptyBoard = (width, height) => {
  const board = [];
  for (let i = 0; i < height; i++) {
    board.push(Array(width).fill(0));
  }
  return board;
};

const board = createEmptyBoard(BOARD_WIDTH, BOARD_HEIGHT);

// Random pieces
const PIECES = [
  {
    position: { x: 5, y: 0 },
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "purple",
    name: "Square",
  },
  {
    position: { x: 5, y: 0 },
    shape: [[1, 1, 1, 1]],
    color: "green",
    name: "Line",
  },
  {
    position: { x: 5, y: 0 },
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#66ccff",
    name: "T-shape",
  },
  {
    position: { x: 5, y: 0 },
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#FFDF40",
    name: "Z-shape-reverse",
  },
  {
    position: { x: 5, y: 0 },
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#FFDF40",
    name: "Z-shape",
  },
  {
    position: { x: 5, y: 0 },
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: "#FF5959",
    name: "J-shape",
  },
  {
    position: { x: 5, y: 0 },
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "#FF5959",
    name: "J-shape-reverse",
  },
];

let piece = PIECES[Math.floor(Math.random() * PIECES.length)];

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
  drawNextPiece();
  draw();

  if (!gameOver) requestAnimationFrame(update);
}

const nextCanvas = document.querySelector("#next-piece");
const nextContext = nextCanvas.getContext("2d");
nextCanvas.width = BLOCK_SIZE * 4;
nextCanvas.height = BLOCK_SIZE * 4;
let nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
function drawNextPiece() {
  const blockSize = 4; // El tetromino más grande es de 4 bloques
  const scale = nextCanvas.width / blockSize;

  nextContext.scale(scale, scale); // Aplicamos la escala
  nextContext.fillStyle = "#000";
  nextContext.fillRect(0, 0, blockSize, blockSize); // Llenamos con base en la escala

  // Calcula el offset para centrar la pieza
  const offsetX = (blockSize - nextPiece.shape[0].length) / 2;
  const offsetY = (blockSize - nextPiece.shape.length) / 2;

  nextPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        nextContext.fillStyle = nextPiece.color;
        nextContext.fillRect(x + offsetX, y + offsetY, 1, 1); // Dibujamos con base en la escala y el offset

        nextContext.strokeStyle = "black";
        nextContext.lineWidth = 0.05; // Ajustamos el ancho de la línea según la escala
        nextContext.strokeRect(x + offsetX, y + offsetY, 1, 1); // Dibujamos con base en la escala y el offset
      }
    });
  });

  nextContext.setTransform(1, 0, 0, 1, 0, 0); // Restablecemos la transformación para la próxima vez
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = "gray"; // Cambia a un color más claro para el fondo del tablero
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  const blockSize = 1;

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        const color = PIECES.find(
          (pieceObj) => pieceObj.name === piece.name,
        ).color;
        context.fillStyle = color;
        context.fillRect(
          piece.position.x * blockSize + x,
          piece.position.y * blockSize + y,
          blockSize,
          blockSize,
        );

        context.strokeStyle = "black";
        context.lineWidth = 0.1;
        context.strokeRect(
          piece.position.x * blockSize + x,
          piece.position.y * blockSize + y,
          blockSize,
          blockSize,
        );
      }
    });
  });

  document.querySelector("#score").innerHTML = score;
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
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
  if (event.key === "ArrowUp") {
    dropPieceToBottom();
  }
});
function isInsideBounds(axis, direction) {
  const newPosition = piece.position[axis] + direction;
  if (axis === "x") {
    return (
      newPosition >= 0 && newPosition + piece.shape[0].length <= BOARD_WIDTH
    );
  } else if (axis === "y") {
    return newPosition >= 0 && newPosition + piece.shape.length <= BOARD_HEIGHT;
  }
  return false;
}
function moveAndCheckCollision(axis, direction) {
  piece.position[axis] += direction;
  if (checkCollision()) {
    piece.position[axis] -= direction;
    return true; // There was a collision
  }
  return false; // No collision
}
function movePiece(axis, direction) {
  if (isInsideBounds(axis, direction)) {
    const collided = moveAndCheckCollision(axis, direction);

    if (axis === "y" && collided) {
      solidifyPiece();
      removeRows();
    }
  } else if (axis === "y") {
    solidifyPiece();
    removeRows();
  }
}
function checkCollision() {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (
        piece.shape[y][x] === 1 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        const boardY = y + piece.position.y;
        const boardX = x + piece.position.x;
        if (board[boardY] && board[boardY][boardX] !== undefined) {
          // Comprueba si la posición es válida antes de intentar acceder
          board[boardY][boardX] = 1;
        } else {
          // Esto puede ser un buen lugar para invocar el game over si una pieza se solidifica fuera de los límites
          showGameOver();
          return;
        }
      }
    });
  });

  piece = nextPiece;
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;

  nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
  drawNextPiece();

  if (checkCollision()) {
    showGameOver();
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

  // Si hay filas para eliminar, hagámoslas parpadear
  if (rowsToRemove.length > 0) {
    let flashCount = 0;
    const maxFlashes = 3;
    const flashSpeed = 150; // en milisegundos

    const flashInterval = setInterval(() => {
      rowsToRemove.forEach((y) => {
        board[y].forEach((value, x) => {
          board[y][x] = flashCount % 2 === 0 ? 0 : 1;
        });
      });
      draw(); // Redibujamos el tablero con el parpadeo
      flashCount++;

      if (flashCount > maxFlashes * 2 - 1) {
        // Terminamos después de 3 parpadeos (encendido y apagado)
        clearInterval(flashInterval);
        // Luego de parpadear, eliminamos las filas
        rowsToRemove.forEach((y) => {
          board.splice(y, 1);
          const newRow = Array(BOARD_WIDTH).fill(0);
          board.unshift(newRow);
          score += 10;
        });
      }
    }, flashSpeed);
  }
}
function dropPieceToBottom() {
  while (!checkCollision()) {
    piece.position.y += 1;
  }
  piece.position.y -= 1;

  // Solidify the piece without checking for collision again
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        const boardY = y + piece.position.y;
        const boardX = x + piece.position.x;
        if (board[boardY] && board[boardY][boardX] !== undefined) {
          board[boardY][boardX] = 1;
        } else {
          showGameOver();
          return;
        }
      }
    });
  });

  piece = nextPiece;
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;

  nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
  drawNextPiece();

  if (checkCollision()) {
    showGameOver();
    board.forEach((row) => row.fill(0));
  }
}

update();

// auto drop
function showGameOver() {
  gameOver = true;

  // Muestra el div de Game Over y establece el puntaje final
  const gameOverScreen = document.querySelector("#gameOverScreen");
  const finalScoreElement = document.querySelector("#finalScore");

  finalScoreElement.textContent = `Score: ${score}`;
  gameOverScreen.style.display = "block";
}
document.querySelector("#restartButton").addEventListener("click", () => {
  const gameOverScreen = document.querySelector("#gameOverScreen");
  gameOverScreen.style.display = "none";

  // Reiniciar juego
  board.forEach((row) => row.fill(0));
  score = 0;
  piece = PIECES[Math.floor(Math.random() * PIECES.length)];
  piece.position.y = 0;
  nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
  drawNextPiece();
  gameOver = false; // Esto es importante para reiniciar el estado del juego
  draw();

  update(); // ¡No olvides reiniciar el bucle del juego aquí!
});
