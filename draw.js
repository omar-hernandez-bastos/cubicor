import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } from "./constants";
import { piece, nextPiece, PIECES } from "./pieces";
import { board } from "./board";
import { score } from "./setup";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const nextCanvas = document.querySelector("#next-piece");
const nextContext = nextCanvas.getContext("2d");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

export function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = "gray";
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

  document.querySelector("#score").textContent = `Score: ${score}`;
}

export function drawNextPiece() {
  const blockSize = 4;
  const scale = nextCanvas.width / blockSize;

  nextContext.scale(scale, scale);
  nextContext.fillStyle = "#000";
  nextContext.fillRect(0, 0, blockSize, blockSize);

  const offsetX = (blockSize - nextPiece.shape[0].length) / 2;
  const offsetY = (blockSize - nextPiece.shape.length) / 2;

  nextPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        nextContext.fillStyle = nextPiece.color;
        nextContext.fillRect(x + offsetX, y + offsetY, 1, 1);

        nextContext.strokeStyle = "black";
        nextContext.lineWidth = 0.05;
        nextContext.strokeRect(x + offsetX, y + offsetY, 1, 1);
      }
    });
  });

  nextContext.setTransform(1, 0, 0, 1, 0, 0);
}
