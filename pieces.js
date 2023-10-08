// Definición de piezas
export const PIECES = [
  {
    id: 1, // <-- valor único
    position: { x: 5, y: 0 },
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "purple",
    name: "Square",
  },
  {
    id: 2,
    position: { x: 5, y: 0 },
    shape: [[1, 1, 1, 1]],
    color: "green",
    name: "Line",
  },
  {
    id: 3,
    position: { x: 5, y: 0 },
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#66ccff",
    name: "T-shape",
  },
  {
    id: 4,
    position: { x: 5, y: 0 },
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#FFDF40",
    name: "Z-shape-reverse",
  },
  {
    id: 5,
    position: { x: 5, y: 0 },
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#FFDF40",
    name: "Z-shape",
  },
  {
    id: 6,
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
    id: 7,
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

export let piece = PIECES[Math.floor(Math.random() * PIECES.length)];
export let nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
export function setPiece(newPiece) {
  piece = newPiece;
}

export function setNextPiece(newNextPiece) {
  nextPiece = newNextPiece;
}
