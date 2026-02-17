let str = "";

let font;
let fontSize = 248;
const linePadding = 100;
const initialLineY = fontSize + 5;

let amplitude = 25;
let startAngle = 0;
let deltaAngle = 0.2;

const lines = [
    "abcdefghi",
    "jklmnopqr",
    "stuvwxyz"
];

function preload() {
  font = loadFont("http://mattblanco.me/itp-nature-of-code/04_oscillators/assets/MonaspaceKrypton-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
}

function draw() {
  strokeWeight(2);
  textSize(fontSize);
  background(255);

  const lastLine = lines[lines.length - 1];

  if (lastLine.length > 0) {
    lines.forEach((line, index) => {
      const baseY = (index + 1) * initialLineY;
      stroke(0, 20);
      noFill();
      text(line, 50, baseY);

      let points = font.textToPoints(line, 50, baseY + 20, fontSize, {
        sampleFactor: 0.25,
      });

      let angle = startAngle;

      stroke(0, 255);
      points.forEach((pnt) => {
        let y = map(sin(angle), -1, 1, pnt.y - amplitude, pnt.y + amplitude);

        angle += deltaAngle;
        point(pnt.x, y);
      });
    });
    startAngle += 0.02;
  }
}

function keyPressed() {
  if (key.toLocaleLowerCase() === "backspace") {
    if (lines[lines.length - 1].length <= 0 && lines.length > 1) {
      lines.pop();
    } else {
      lines[lines.length - 1] = lines[lines.length - 1].slice(
        0,
        lines[lines.length - 1].length - 1,
      );
    }
  } else if (
    key !== "Meta" &&
    key !== "Shift" &&
    key !== "Alt" &&
    key !== "Control" &&
    key !== "Meta"
  ) {
    if (textWidth(lines[lines.length - 1]) + 80 >= width - 50) {
      lines.push([]);
    }
    lines[lines.length - 1] += key;
  }
}
