const FILES = [
  "/assets/combined-landscape.json",
  "/assets/point-cloud.json",
  "/assets/points01.json",
];
// const FILES = ["/assets/point-cloud.json", "/assets/points01.json"];

let points = [];
let faces = [];
let rotX = -0.5;
let rotY = 0;
let minZ, maxZ;

const useSpheres = false;

function preload() {
  FILES.forEach((file) => {
    loadJSON(file, (data) => {
      const newPoints = data.vertices;

      // Find elevation range for coloring
      let zVals = newPoints.map((p) => p[2]);
      minZ = Math.min(...zVals);
      maxZ = Math.max(...zVals);

      points.push(newPoints);
    });
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  console.log(points);
}

function draw() {
  background(17);
  orbitControl(2, 2, 0.05);

  // Apply zoom

  // Scale to fit the canvas
  let s = min(width, height) * 0.4;
  scale(s);

  // Draw based on mode
  drawPoints();
}

function drawPoints() {
  const arr = points[0];
  strokeWeight(0.025);
  beginShape(POINTS);
  for (let i = 0; i < arr.length; i++) {
    let p = arr[i];

    if (useSpheres) {
      push();
      noFill();
      stroke(255);
      translate(p[0], -p[2], p[1]); // Remap: x, z→up, y→depth
      sphere(0.001, 3, 3);
      pop();
    } else {
      stroke(255);
      vertex(p[0], -p[2], p[1]); // Remap: x, z→up, y→depth
    }
  }
  endShape();
}
