// Definición de piezas
export const PIECES = [
  // {
  //   position: { x: 5, y: 0 },
  //   shape: [
  //     [1, 1],
  //     [1, 1],
  //   ],
  //   color: "purple",
  //   name: "Square",
  // },
  {
    position: { x: 5, y: 0 },
    shape: [[1, 1, 1, 1]],
    color: "green",
    name: "Line",
  },
  // {
  //   position: { x: 5, y: 0 },
  //   shape: [
  //     [0, 1, 0],
  //     [1, 1, 1],
  //   ],
  //   color: "#66ccff",
  //   name: "T-shape",
  // },
  // {
  //   position: { x: 5, y: 0 },
  //   shape: [
  //     [0, 1, 1],
  //     [1, 1, 0],
  //   ],
  //   color: "#FFDF40",
  //   name: "Z-shape-reverse",
  // },
  // {
  //   position: { x: 5, y: 0 },
  //   shape: [
  //     [1, 1, 0],
  //     [0, 1, 1],
  //   ],
  //   color: "#FFDF40",
  //   name: "Z-shape",
  // },
  // {
  //   position: { x: 5, y: 0 },
  //   shape: [
  //     [1, 0],
  //     [1, 0],
  //     [1, 1],
  //   ],
  //   color: "#FF5959",
  //   name: "J-shape",
  // },
  // {
  //   position: { x: 5, y: 0 },
  //   shape: [
  //     [0, 1],
  //     [0, 1],
  //     [1, 1],
  //   ],
  //   color: "#FF5959",
  //   name: "J-shape-reverse",
  // },
];

export let piece = PIECES[Math.floor(Math.random() * PIECES.length)];
export let nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
export function setPiece(newPiece) {
  piece = newPiece;
}

export function setNextPiece(newNextPiece) {
  nextPiece = newNextPiece;
}
