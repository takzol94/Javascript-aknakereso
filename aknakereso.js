const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

const size = 50;
const columns = canvas.width / size;
const rows = canvas.height / size;
const mine = "mine";
const mineCount = 20;
const images = {
  "hidden": document.getElementById("hidden"),
  "mine": document.getElementById("mine"),
  "0": document.getElementById("field-0"),
  "1": document.getElementById("field-1"),
  "2": document.getElementById("field-2"),
  "3": document.getElementById("field-3"),
  "4": document.getElementById("field-4"),
  "5": document.getElementById("field-5"),
  "6": document.getElementById("field-6"),
  "7": document.getElementById("field-7"),
  "8": document.getElementById("field-8"),
}

let map = createMap(); // Ezzel a függvénnyel töltjük fel a pályát.

placeMines(map , mineCount)  // Ezzel a függvénnyel helyezzük el random az aknákat a pályán.

drawMap();    // Ezzel a függvénnyel rajzoljuk ki a pályát.

console.log(map);

function placeMines(map , mineCount) {
  let mines = 0;
  while (mines < mineCount) {
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);
    if (map[y][x] !== mine) {
      map[y][x] = mine;
      mines++;
    }
  }
}

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
      let field = map[j][i];
      let image = images[field]
      drawImage(image, i * size, j * size);
    }
  }
}

function drawImage(image, x,  y) {
  c.drawImage(image, x, y, size, size);
}