import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE } from "./constants";

// Selección y configuración del canvas principal
export const canvas = document.querySelector("canvas");
export const context = canvas.getContext("2d");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

// Selección y configuración del canvas para la siguiente pieza
export const nextCanvas = document.querySelector("#next-piece");
export const nextContext = nextCanvas.getContext("2d");
nextCanvas.width = BLOCK_SIZE * 4;
nextCanvas.height = BLOCK_SIZE * 4;

// Variables generales del juego
export let gameOver = false;
export let score = 0;
export function setScore(newScore) {
  score = newScore;
}
export function setGameOver(newGameOver) {
  gameOver = newGameOver;
}
