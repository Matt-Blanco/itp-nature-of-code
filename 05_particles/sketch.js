let font;
let emitters = [];
let text;
let emitterIndex = 0;

function preload() {
  font = loadFont(
    "https://mattblanco.me/itp-nature-of-code/04_oscillators/data/DidactGothic-Regular.ttf",
  );

  text = loadStrings("https://mattblanco.me/itp-nature-of-code/04_oscillators/data/text.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  text = text.join(" ").split(" ");
  console.log(text);
}

function draw() {
  background(color("#fcfbf9"));
  emitters.forEach((emitter) => {
    emitter.update();
    emitter.draw();
  });
}

function mousePressed() {
  emitters.push(
    new TypeEmitter(
      createVector(mouseX, mouseY),
      random(50, 100),
      text[emitterIndex].split(""),
    ),
  );

  emitterIndex++;

  if (emitterIndex >= text.length) {
    emitterIndex = 0;
  }
}
