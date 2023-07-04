const image = document.getElementById("hidden");
const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

const size = 50;
const columns = canvas.width / size;
const rows = canvas.height / size;
const mine = "mine";

let map = [
  [0, 0, 0, 3, mine, 0, mine, 0, 0, 0],
 [0, 0, 1, mine, mine, 1, 1, 1, 0, 0]
];

console.log(map);

drawMap();    // Ezzel a függvénnyel rajzoljuk ki a pályát.

function drawMap() {
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
        drawImage(i * size, j * size);
    }
  }
}

function drawImage(x, y) {
  c.drawImage(image, x, y, size, size);
}