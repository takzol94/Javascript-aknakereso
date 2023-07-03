const image = document.getElementById("hidden");
const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

const size = 50;
const columns = canvas.width / size;

for (let i = 0; i < columns; i++) {
    drawImage(i * size, 0);
}

function drawImage(x, y) {
  c.drawImage(image, x, y, size, size);
}