import { BOARD_WIDTH, BOARD_HEIGHT } from "./constants";

// Función para crear un tablero vacío
export const createEmptyBoard = (width, height) => {
  const board = [];
  for (let i = 0; i < height; i++) {
    board.push(Array(width).fill(0));
  }
  return board;
};

export const board = createEmptyBoard(BOARD_WIDTH, BOARD_HEIGHT);
