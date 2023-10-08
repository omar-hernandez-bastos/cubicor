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

const spaceButton = document.querySelector("#spaceButton");
const arrowUpButton = document.querySelector("#arrowUpButton");
const arrowLeftButton = document.querySelector("#arrowLeftButton");
const arrowRightButton = document.querySelector("#arrowRightButton");
const arrowDownButton = document.querySelector("#arrowDownButton");

const keyActions = {
  ArrowUp: rotatePiece,
  ArrowLeft: () => movePiece("x", -1),
  ArrowRight: () => movePiece("x", 1),
  ArrowDown: () => movePiece("y", 1),
  Space: dropPieceToBottom,
};

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

document.addEventListener("keydown", (event) => {
  if (keyActions[event.code]) {
    keyActions[event.code]();
    switch (event.code) {
      case "ArrowUp":
        animateButton(arrowUpButton);
        break;
      case "ArrowLeft":
        animateButton(arrowLeftButton);
        break;
      case "ArrowRight":
        animateButton(arrowRightButton);
        break;
      case "ArrowDown":
        animateButton(arrowDownButton);
        break;
      case "Space":
        animateButton(spaceButton);
        break;
    }
  }
});

function animateButton(button) {
  button.classList.add("key-pressed");
  setTimeout(() => {
    button.classList.remove("key-pressed");
  }, 150); // Duración de la animación, puedes ajustar este valor
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
  update(); // Reiniciar el bucle del juego
});

const keys = document.querySelectorAll(".key");
keys.forEach((key) => {
  key.addEventListener("mousedown", function () {
    this.classList.add("key-pressed");
  });
  key.addEventListener("mouseup", function () {
    this.classList.remove("key-pressed");
  });
  key.addEventListener("mouseleave", function () {
    this.classList.remove("key-pressed");
  });
});

// Event listeners para los botones
arrowUpButton.addEventListener("click", rotatePiece);
arrowLeftButton.addEventListener("click", () => movePiece("x", -1));
arrowRightButton.addEventListener("click", () => movePiece("x", 1));
arrowDownButton.addEventListener("click", () => movePiece("y", 1));
spaceButton.addEventListener("click", dropPieceToBottom);
