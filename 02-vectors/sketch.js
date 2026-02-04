const pointCount = 200;
const points = [];

let camera;

let xMax;
let yMax;
let zMax;

let smoothing = 0.05;

let cameraX;
let cameraY;
let cameraZ;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  xMax = width;
  yMax = height;
  zMax = width;

  stroke(255)

  for (let i = 0; i < pointCount; i++) {
    const x = random(-xMax, xMax);
    const y = random(-yMax, yMax);
    const z = random(-zMax, zMax);

    points.push(new Star(x, y, z));
  }

  cameraX = width - 100;
  cameraY = 0;
  cameraZ = width * 1.5;

  camera = createCamera();
  camera.move(cameraX, cameraY, cameraZ);
  camera.pan(PI / 9);

  noCursor();
}

function drawBoundaries() {
  stroke(255);
  line(-width, -height, zMax, -width, height, zMax);
  line(width, -height, zMax, width, height, zMax);

  line(-width, -height, -zMax, -width, height, -zMax);
  line(width, -height, -zMax, width, height, -zMax);

  line(width, -height, -zMax, width, -height, zMax);
  line(-width, -height, -zMax, -width, -height, zMax);

  line(width, height, -zMax, width, height, zMax);
  line(-width, height, -zMax, -width, height, zMax);
}

function draw() {
  background(40, 40, 40, 200);
  strokeWeight(4);

  drawBoundaries();

  push();
  translate(mouseX - width / 2, mouseY - height / 2)
  fill(0, 0);
  strokeWeight(1);
  sphere(50);
  pop();

  stroke(255);
  strokeWeight(1);
  points.forEach((star, indx) => {
    star.update();
  });
  orbitControl()
}

class Star {
  constructor(x, y, z) {
    // Random starting angles

    this.theta = random(TWO_PI);
    this.phi = random(PI);

    this.orbitRadius = random(100, xMax * 2);

    this.pos = createVector(x, y, z);
    this.velocity = createVector(
      floor(random(-1, 1)),
      floor(random(-1, 1)),
      floor(random(-1, 1)),
    );

    this.originalVelocity = createVector(
      this.velocity.x,
      this.velocity.y,
      this.velocity.z,
    );
  }

  update() {
    this.theta += 0.01;
    this.phi += 0.005;

    // Save last state
    this.previousPos = createVector(this.pos.x, this.pos.y, this.pos.z)

    // Calculate delta to target
    const deltaX = mouseX - this.pos.x
    const deltaY = mouseY - this.pos.y

    // Update position
    this.pos = createVector(
      this.orbitRadius * sin(this.phi) * cos(this.theta),
      this.orbitRadius * sin(this.phi) * sin(this.theta),
      this.orbitRadius * cos(this.phi),
    );

    this.draw();
  }

  draw() {
    push();
    translate(mouseX - width / 2, mouseY - width / 2);
    point(this.pos.x, this.pos.y, this.pos.z);
    pop();
  }
}
