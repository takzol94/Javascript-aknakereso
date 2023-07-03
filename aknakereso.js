const image = document.getElementById("hidden");
const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

const size = 50;
let x = 0;
let y = 0;

c.drawImage(image, x, y, size, size);
c.drawImage(image, x + size, y + size, size, size);