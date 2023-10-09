import { BOARD_WIDTH, BOARD_HEIGHT } from "./utils/constants";
import { piece, PIECES, nextPiece, setPiece, setNextPiece } from "./pieces";
import { setGameOver, setScore, score } from "./setup";
import { draw, drawNextPiece } from "./draw";
import { board } from "./board";

let dropCounter = 0;
let lastTime = 0;
let gameOver = false;

export function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > 1000 - score * 5) {
    movePiece("y", 1);
    dropCounter = 0;
  }
  drawNextPiece();
  draw();

  if (!gameOver) requestAnimationFrame(update);
}
export function checkCollision() {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (
        piece.shape[y][x] > 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}
export function isInsideBounds(axis, direction) {
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

export function moveAndCheckCollision(axis, direction) {
  piece.position[axis] += direction;
  if (checkCollision()) {
    piece.position[axis] -= direction;
    return true; // There was a collision
  }
  return false; // No collision
}

export function movePiece(axis, direction) {
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

export function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        const boardY = y + piece.position.y;
        const boardX = x + piece.position.x;
        if (board[boardY] && board[boardY][boardX] !== undefined) {
          board[boardY][boardX] = piece.id;
        } else {
          showGameOver();
          return;
        }
      }
    });
  });

  setPiece(nextPiece);
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;

  setNextPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
  drawNextPiece();

  if (checkCollision()) {
    showGameOver();
    board.forEach((row) => row.fill(0));
  }
}

export function removeRows() {
  const rowsToRemove = [];
  board.forEach((row, y) => {
    if (row.every((value) => value > 0)) {
      rowsToRemove.push(y);
    }
  });

  if (rowsToRemove.length > 0) {
    let flashCount = 0;
    const maxFlashes = 3;
    const flashSpeed = 150;

    const flashInterval = setInterval(() => {
      rowsToRemove.forEach((y) => {
        board[y].forEach((value, x) => {
          board[y][x] = flashCount % 2 === 0 ? 0 : 1;
        });
      });
      draw();
      flashCount++;

      if (flashCount > maxFlashes * 2 - 1) {
        clearInterval(flashInterval);
        rowsToRemove.forEach((y) => {
          board.splice(y, 1);
          const newRow = Array(BOARD_WIDTH).fill(0);
          board.unshift(newRow);
          setScore(score + 10 + Math.floor(score / 100)); // Aumentar el puntaje y bonificación por nivel
        });
      }
    }, flashSpeed);
  }
}

export function dropPieceToBottom() {
  while (!checkCollision()) {
    piece.position.y += 1;
  }
  piece.position.y -= 1;
  solidifyPiece();
  removeRows();
}

function showGameOver() {
  setGameOver(true);

  const gameOverScreen = document.querySelector("#gameOverScreen");
  const finalScoreElement = document.querySelector("#finalScore");
  finalScoreElement.textContent = `Score: ${score}`;
  gameOverScreen.style.display = "flex";
  gameOverScreen.style.justifyContent = "center";
  gameOverScreen.style.alignItems = "center";
  gameOverScreen.style.flexDirection = "column";
}
