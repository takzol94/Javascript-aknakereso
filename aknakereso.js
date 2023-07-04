const image = document.getElementById("hidden");
const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

const size = 50;
const columns = canvas.width / size;
const rows = canvas.height / size;

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