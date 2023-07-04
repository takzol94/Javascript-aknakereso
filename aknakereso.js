const image = document.getElementById("hidden");
const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

const size = 50;
const columns = canvas.width / size;
const rows = canvas.height / size;
const mine = "mine";

let map = createMap(); // Ezzel a függvénnyel töltjük fel a pályát.

map[3][4] = mine;

console.log(map);

drawMap();    // Ezzel a függvénnyel rajzoljuk ki a pályát.


function createMap() {
  let map = [];
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < columns; i++) {
      row[i] = 0;
    }
    map[j] = row;
  }
  return map;
}

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