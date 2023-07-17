const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");
const actionButton = document.getElementById("action-button");
const mineCounter = document.getElementById("mine-count");
const timerCounter = document.getElementById("time");

const size = 50;
const columns = canvas.width / size;
const rows = canvas.height / size;
const mine = "mine";
const mineCount = 3;
const images = {
  "hidden": document.getElementById("hidden"),
  "mine": document.getElementById("exploded-mine"),
  "allmines": document.getElementById("mine"),
  "flag": document.getElementById("flag"),
  "flaggedWrong": document.getElementById("flagged-wrong"),
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

const buttons = {
  start : "kellekek/button-start.png",
  lost: "kellekek/button-lost.png",
  won: "kellekek/button-won.png",
}

let isGameOver // Ezzel a változóval vizsgáljuk meg, hogy vége van-e a játéknak.
let isfirstClick // Ezzel a változóval vizsgáljuk meg, hogy az első kattintás volt-e.
let exploredFields // Ezzel a változóval vizsgáljuk meg, hogy hány mezőt fedeztünk fel.
let flagMap // Ezzel a változóval vizsgáljuk meg, hogy melyik mezőre tettünk zászlót.
let map  // Ezzel a változóval töltjük fel a pályát.
let exploredMap // Ezzel a változóval vizsgáljuk meg, hogy melyik mezőt fedeztük fel.
let remainingMines // Ezzel a változóval vizsgáljuk meg, hogy hány akna van még hátra.
let timer // Ezzel a változóval vizsgáljuk meg, hogy hány másodperc telt el.

var vesztettAudio = document.getElementById('vesztett-audio');
var winAudio = document.getElementById('win-audio');
winAudio.volume = 0.4;

initGame(); // Ezzel a függvénnyel indítjuk el a játékot.

canvas.addEventListener("click", function(event) {  // Ezzel a függvénnyel vizsgáljuk meg, hogy melyik mezőt kattintottuk meg.
  if (isGameOver) return;
  const x = Math.floor(event.offsetX / size);
  const y = Math.floor(event.offsetY / size);
  if (isfirstClick) {
    placeMines(map, mineCount, y, x)  // Ezzel a függvénnyel helyezzük el random az aknákat a pályán.
    calculateFieldValues(map);  // Ezzel a függvénnyel számoljuk ki, hogy egy mező körül hány akna van.
    isfirstClick = false;
    startTimer();
  }
  exploreField(y, x);
  drawMap();
  if (map[y][x] === mine && exploredMap[y][x]) {
  loseGame();
  stopTimer();
  revealAllMines();
  } else if (exploredFields === (columns * rows) - mineCount) {
  isGameOver = true;
  winAudio.play();
  actionButton.src = buttons.won;
  stopTimer();
  flagAllMines();
  }
});

  canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    const x = Math.floor(event.offsetX / size);
    const y = Math.floor(event.offsetY / size);
    if (exploredMap[y][x]) return;
    flagMap[y][x] = !flagMap[y][x];
    remainingMines -= flagMap[y][x] ? 1 : -1;
    drawMap();
    mineCounter.innerHTML = convertNumberTo3DigitString(remainingMines);
  });

function startTimer() {
  seconds = 0;
  timer = setInterval(function() {
    seconds = Math.min(seconds + 1, 999);
    timerCounter.innerHTML = convertNumberTo3DigitString(seconds);
  }, 1000);
};

function stopTimer() {
  clearInterval(timer);
}

actionButton.addEventListener("click", function() {  // Ezzel a függvénnyel indítjuk újra a játékot.
  initGame();
  stopTimer();
  timerCounter.innerHTML = convertNumberTo3DigitString(0);
});

function initGame() {
  isGameOver = false;
  isfirstClick = true;
  exploredFields = 0;
  map = createMap();
  exploredMap = createBoolenMap();
  flagMap = createBoolenMap();
  drawMap();
  actionButton.src = buttons.start;
  remainingMines = mineCount;
  mineCounter.innerHTML = convertNumberTo3DigitString(remainingMines);
};

function loseGame() {
  isGameOver = true;
  actionButton.src = buttons.lost;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      if (flagMap[j][i] && map[j][i] !== mine) {
        drawImage(images["flaggedWrong"], i * size, j * size);
      }
    }
  }
  vesztettAudio.play();
};

function flagAllMines() {
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      if (map[j][i] === mine) {
        flagMap[j][i] = true;
      }
      mineCounter.innerHTML = convertNumberTo3DigitString(0);
    }
  }
  drawMap();
};

function revealAllMines() {
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      if (map[j][i] === mine && !flagMap[j][i] && !exploredMap[j][i]) {
        drawImage(images["allmines"], i * size, j * size);
      }
    }
  }
};

function exploreField(y, x) {
  if (!exploredMap[y][x] && !flagMap[y][x]) {
    exploredFields++;
    exploredMap[y][x] = true;
    if (map[y][x] === 0) {
      let neighbourCoordinates = findNeighboursFields(map, y, x);
      for (let i = 0; i < neighbourCoordinates.length; i++) {
        let coordinate = neighbourCoordinates[i]; // {row: 7, col: 1}
        exploreField(coordinate.y, coordinate.x); // rekurzió
      }
    }
  }
};

function calculateFieldValues(map) {  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      let field = map[j][i];
      if (field !== mine) {
        let neighbourCalculates = findNeighboursFields(map, j, i);
          let countMine = countMines(map, neighbourCalculates);
          map[j][i] = countMine;
      }
    }
  }
};

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
};

function findNeighboursFields(map, j, i) {  // Ezzel a függvénnyel keresem meg egy mező körül a szomszédos mezőket.
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
};

function placeMines(map, mineCount, j, i) {
  let mines = 0;
  while (mines < mineCount) {
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);
    if (x !== i && y !== j && map[y][x] !== mine) {
      map[y][x] = mine;
      mines++;
    }
  }
}

function createBoolenMap() {
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
      if (!exploredMap[j][i]) {
        drawImage(images["hidden"], i * size, j * size);
        if (flagMap[j][i]) {
          drawImage(images["flag"], i * size, j * size);
        }
      } else {
        if (!flagMap[j][i]) {
        let field = map[j][i];
        if (field === mine) {
        drawImage(images["mine"], i * size, j * size);
        }
        let image = images[field];
        drawImage(image, i * size, j * size);
        }
      }
    }
  }
}

function drawImage(image, x,  y) {
  c.drawImage(image, x, y, size, size);
}

function convertNumberTo3DigitString(number) {
  if (number < 0) {
    return '🛑';
  } 
    else if (number < 10) {
    return "00" + number;
  } else if (number < 100) {
    return"0" + number;
  } else
  return number;
}