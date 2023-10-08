import {
  movePiece,
  dropPieceToBottom,
  update,
  checkCollision,
} from "./mechanics";
import { piece, PIECES, setPiece, setNextPiece } from "./pieces";
import { setGameOver, setScore } from "./setup";
import { drawNextPiece, draw } from "./draw";
import { board } from "./board";

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    rotatePiece();
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

function rotatePiece() {
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
document.querySelector("#restartButton").addEventListener("click", () => {
  const gameOverScreen = document.querySelector("#gameOverScreen");
  gameOverScreen.style.display = "none";

  // Reiniciar juego
  board.forEach((row) => row.fill(0));
  setScore(0);
  setPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
  piece.position.y = 0;
  setNextPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
  drawNextPiece();
  setGameOver(false);
  draw();

  update(); // ¡No olvides reiniciar el bucle del juego aquí!
});
