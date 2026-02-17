let camera;
let boxSize = 25;
let mover;
function setup() {
  createCanvas(windowWidth, windowHeight);
  camera = createCapture(VIDEO);
  camera.size(width, height);
  camera.hide();

  mover = new Ball(width / 2, height / 2, 25);
}

function draw() {
  let pixelRange = [];
  camera.loadPixels();
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

  if (frameCount > 180) {
    findClosestForce(mover, pixelRange);
    mover.update();
    mover.draw();
  }
}

// Iterates through the pixelRange forces and finds the force closes to the ball's position
function findClosestForce(ball, forces) {
  // Apply the force from any PixelForce the ball overlaps with.
  forces.forEach((force) => {
    const cellCenterX = force.pos.x + force.size / 2;
    const cellCenterY = force.pos.y + force.size / 2;
    const distance = dist(ball.pos.x, ball.pos.y, cellCenterX, cellCenterY);
    // consider overlap using ball radius and half cell size
    if (distance < ball.r + force.size / 2) {
      // apply a scaled copy of the force vector so acceleration is reasonable
      const f = force.force.copy().mult(0.01);
      ball.apply(f);
    }
  });
}

class PixelForce {
  constructor(r, g, b, x, y) {
    this.pixel = color(r, g, b);
    this.pos = createVector(x, y);
    this.size = boxSize;
    this.brightness = floor(brightness(this.pixel));
    this.saturation = floor(hue(this.pixel));
    this.force = createVector(
      map(this.saturation, 0, 100, -1, 1),
      map(this.brightness, 0, 360, 1, -1),
    );
  }

  draw(showForce = false) {
    noStroke();
    fill(this.brightness);
    rect(this.pos.x, this.pos.y, boxSize, boxSize);
    fill(0);

    if (showForce) {
      this.showVector();
    }
  }

  showVector() {
    push();
    translate(this.pos.x + this.size / 2, this.pos.y + this.size / 2);

    const p2 = createVector(
      map(this.force.x, -1, 1, -(this.size / 2), this.size / 2),
      map(this.force.y, -1, 1, -(this.size / 2), this.size / 2),
    );
    stroke(255, 125);
    strokeWeight(1);
    line(0, 0, p2.x, p2.y);

    // arrow head?
    // vector.heading() gets you the angle of the angle
    const arrow1 = p2.copy().div(2);
    const arrow2 = p2.copy().div(2);

    line(p2.x, p2.y, arrow1.rotate(PI / 8).x, arrow1.rotate(PI / 8).y);
    line(p2.x, p2.y, arrow2.rotate((15 * PI) / 8).x, arrow2.rotate((15 * PI) / 8).y);
    pop();
  }
}

class Ball {
  showTrail = true;

  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.trail = [];
  }

  update() {
    this.checkEdgeContact();

    // if (abs(this.velocity.x) >= 5 && abs(this.velocity.y) >= 5) {
    //   this.velocity.x *= .6;
    //   this.velocity.y *= .6;
    // }

    this.velocity.add(this.acceleration);

    this.pos.add(this.velocity);
    this.trail.push(this.pos.copy());

    this.acceleration.mult(0);
  }

  draw() {
    fill(255);

    circle(this.pos.x, this.pos.y, this.r);

    if (this.showTrail) {
      this.trail.forEach((pos) => {
        strokeWeight(2);
        stroke(255);
        point(pos.x, pos.y);
      });
    }
  }

  apply(force) {
    this.acceleration.add(force);
  }

  checkEdgeContact() {
    const padding = 2;

    if (this.pos.x + this.r >= width - padding) {
      this.acceleration.x *= -1;
      this.velocity.x *= -1;
    } else if (this.pos.x - this.r <= padding) {
      this.acceleration.x *= -1;
      this.velocity.x *= -1;
    }

    if (this.pos.y + this.r >= height - padding) {
      this.acceleration.y *= -1;
      this.velocity.y *= -1;
    } else if (this.pos.y - this.r <= padding) {
      this.acceleration.y *= -1;
      this.velocity.y *= -1;
    }
  }
}
