let camera;
let boxSize = 25;
function setup() {
  createCanvas(windowWidth, windowHeight);
  camera = createCapture(VIDEO);
  camera.size(width, height);
  camera.hide();
}

function draw() {
  let pixelRange = [];
  camera.loadPixels();
  // pixelDensity(0.5);
  let pixels = camera.pixels;
  for (let y = 0; y < height; y += boxSize) {
    for (let x = 0; x < width; x += boxSize) {
      let r = 0,
        g = 0,
        b = 0;
      let count = 0;
      for (let dy = 0; dy < boxSize; dy++) {
        for (let dx = 0; dx < boxSize; dx++) {
          const indx = (x + dx + (y + dy) * width) * 4;
          if (indx < pixels.length) {
            r += pixels[indx];
            g += pixels[indx + 1];
            b += pixels[indx + 2];
            count++;
          }
        }
      }
      r = r / count;
      g = g / count;
      b = b / count;
      const pf = new PixelForce(r, g, b, x, y);
      pixelRange.push(pf);
      pf.draw(true);
    }
  }
}

class PixelForce {
  constructor(r, g, b, x, y) {
    this.pixel = color(r, g, b);
    this.pos = createVector(x, y);
    this.size = boxSize;
    this.brightness = floor(brightness(this.pixel));
    this.upwardForce = createVector(0, map(this.brightness, 0, 255, -boxSize, boxSize));
  }

  draw(showForce = false) {
    noStroke()
    fill(this.brightness);
    rect(this.pos.x, this.pos.y, boxSize, boxSize);
    fill(0);
    text(
      this.brightness,
      this.pos.x + this.size / 2 - 10,
      this.pos.y + this.size / 2,
    );

    if (showForce) {
      this.showVector()
    }
  }

  showVector() {
    const p1 = createVector(this.pos.x + this.size / 2, this.pos.y + this.size / 2);
    console.log(p1.x, p1.y)
    const p2 = p1.copy().add(this.upwardForce);
    stroke(255);
    strokeWeight(1);
    line(p1.x, p1.y, p2.x, p2.y);
  }
}
