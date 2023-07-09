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
let exploredMap = createxploredMap();

placeMines(map , mineCount)  // Ezzel a függvénnyel helyezzük el random az aknákat a pályán.
calculateFieldValues(map);  // Ezzel a függvénnyel számoljuk ki, hogy egy mező körül hány akna van.

drawMap();    // Ezzel a függvénnyel rajzoljuk ki a pályát.

canvas.addEventListener("click", function(event) {  // Ezzel a függvénnyel vizsgáljuk meg, hogy melyik mezőt kattintottuk meg.
  let x = Math.floor(event.offsetX / size);
  let y = Math.floor(event.offsetY / size);
  if (!exploredMap[y][x]) {
    exploreEmptyArea(x, y);
  drawMap();
}
});

hidden.addEventListener("click", playsound);

function playsound() {
  let audio = new Audio("audio.mp3");
  audio.play();
}



function exploreEmptyArea(x, y) {
  if (x >= 0 && x < columns && y >= 0 && y < rows && !exploredMap[y][x]) {
    exploredMap[y][x] = true;
    if (map[y][x] === 0) {
      exploreEmptyArea(x - 1, y - 1);
      exploreEmptyArea(x, y - 1);
      exploreEmptyArea(x + 1, y - 1);
      exploreEmptyArea(x - 1, y);
      exploreEmptyArea(x + 1, y);
      exploreEmptyArea(x - 1, y + 1);
      exploreEmptyArea(x, y + 1);
      exploreEmptyArea(x + 1, y + 1);
    }
  }
}


function calculateFieldValues(map) {  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      let field = map[j][i];
      if (field !== mine) {
        let neighbourCalculates = findNeighboursFields(map, i, j);
          let countMine = countMines(map, neighbourCalculates);
          map[j][i] = countMine;
      }
    }
  }
}

function countMines(map, neighbourCalculates) {  
  let countMine = 0;
  for (let k = 0; k < neighbourCalculates.length; k++) {
    let neighbour = neighbourCalculates[k];
    let neighbourField = map[neighbour.y][neighbour.x];
    if (neighbourField === mine) {
      countMine++;
    }
  }
  return countMine;
}

function findNeighboursFields(map, i, j) {  // Ezzel a függvénnyel keresem meg egy mező körül a szomszédos mezőket.
  let neighbourCalculates = [];
  for (let y = j - 1; y <= j + 1; y++) {
    for (let x = i - 1; x <= i + 1; x++) {
      if (x >= 0 && x < columns && y >= 0 && y < rows) {
        if (x !== i || y !== j) {
          neighbourCalculates.push({x: x, y: y});
        }
      }
    }
  }
return neighbourCalculates;
}

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

function createxploredMap() {
  let exploredMap = [];
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < columns; i++) {
      row[i] = false;
    }
    exploredMap[j] = row;
  }
  return exploredMap;
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
      if (exploredMap[j][i] === false) {
        drawImage(images["hidden"], i * size, j * size);
      }
        else {
        let field = map[j][i];
        let image = images[field]
        drawImage(image, i * size, j * size);
      }
    }
  }
}

function drawImage(image, x,  y) {
  c.drawImage(image, x, y, size, size);
}