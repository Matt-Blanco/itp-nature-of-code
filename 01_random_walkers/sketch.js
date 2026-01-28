let mountains = [];
let path = [];
const mntNum = 15;
const showBoundaryBorders = false;
const showProgress = false;
const showControlPoints = false;
let midPoint;

function distance(x1, y1, x2, y2) {
  return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
}

function checkOverlap(x1, y1, r1, x2, y2, r2) {
  const dist = distance(x1, y1, x2, y2);

  const minDistance = r1 + r2;

  return dist < minDistance;
}

let startPoint;
let endPoint;

function setup() {
  createCanvas(600, 700);
  background(252, 245, 217, 125);
  angleMode(DEGREES);

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(0, 0, width, height);

  // Spatial grid for efficient overlap checking
  const gridSize = 100;
  let grid = {};

  const getGridKey = (x, y) => {
    return `${floor(x / gridSize)},${floor(y / gridSize)}`;
  };

  const getNearbyMountains = (x, y) => {
    const nearby = [];
    const baseX = floor(x / gridSize);
    const baseY = floor(y / gridSize);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${baseX + dx},${baseY + dy}`;
        if (grid[key]) {
          nearby.push(...grid[key]);
        }
      }
    }
    return nearby;
  };

  for (let i = 0; i < mntNum; i++) {
    let mountain;
    let isOverlapping = true;
    let attempts = 0;
    const maxAttempts = 100;

    while (isOverlapping && attempts < maxAttempts) {
      mountain = new Mountain();
      isOverlapping = false;
      attempts++;

      // Only check nearby mountains in the spatial grid
      const nearbyMountains = getNearbyMountains(mountain.x, mountain.y);

      for (let j = 0; j < nearbyMountains.length; j++) {
        const distBetweenCenters = distance(
          mountain.x,
          mountain.y,
          nearbyMountains[j].x,
          nearbyMountains[j].y,
        );

        // Quick rejection: if centers are far apart, no overlap possible
        const maxPossibleOverlap =
          mountain.maxDist + nearbyMountains[j].maxDist;
        if (distBetweenCenters > maxPossibleOverlap) {
          continue;
        }

        // Only do detailed check if centers are close
        const overlapping = checkOverlap(
          mountain.x,
          mountain.y,
          mountain.maxDist,
          nearbyMountains[j].x,
          nearbyMountains[j].y,
          nearbyMountains[j].maxDist,
        );

        if (overlapping) {
          isOverlapping = true;
          break;
        }
      }
    }

    if (!isOverlapping) {
      mountains.push(mountain);

      // Add to spatial grid
      const key = getGridKey(mountain.x, mountain.y);
      if (!grid[key]) {
        grid[key] = [];
      }
      grid[key].push(mountain);
    }
  }

  const setRandomX = (height) => {
    let isOverlapping = true;
    let x = 0;
    while (isOverlapping) {
      isOverlapping = false;
      x = floor(random(10, width - 10));

      for (let i = 0; i < mountains.length; i++) {
        const mnt = mountains[i];
        const overlapping = checkOverlap(
          x,
          height,
          10,
          mnt.x,
          mnt.y,
          mnt.maxDist,
        );

        if (overlapping) {
          isOverlapping = true;
          break;
        }
      }
    }
    return x;
  };

  startPoint = [setRandomX(height), height];
  midPoint = [
    random(10, width - 10),
    random(height / 2 - 150, height / 2 + 150),
  ];
  endPoint = [setRandomX(0), 0];

  path.push(startPoint);
}

function draw() {
  const prevPoint = path[path.length - 1];
  const heightProgress = float(
    map(prevPoint[1], height, 0, 0, 1) * 100,
  ).toPrecision(3);

  mountains.forEach((mnt) => {
    mnt.draw();
    mnt.addContourLines();
  });

  strokeWeight(4);

  if (frameCount % 15 === 0 && prevPoint[1] > 0) {
    if (prevPoint[1] >= midPoint[1]) {
      const slope =
        (midPoint[1] - startPoint[1]) / (midPoint[0] - startPoint[0]);

      const newY = prevPoint[1] - 5;
      let newX = (newY - startPoint[1]) / slope + startPoint[0];

      let noiseLevel = 100;
      let noiseScale = 0.02;
      let ny = noiseScale * newY;

      const modifier =
        noiseLevel * noise(ny) * map(newY, height, midPoint[1], 1, 0); //;(heightProgress < 15 ? map(newY, height, 0, 1, 0) : 1);

      newX += modifier;

      path.push([newX, newY]);
    } else if (prevPoint[1] < midPoint[1]) {
      const slope = (endPoint[1] - midPoint[1]) / (endPoint[0] - midPoint[0]);

      const newY = prevPoint[1] - 5;
      let newX = (newY - midPoint[1]) / slope + midPoint[0];

      let noiseLevel = 100;
      let noiseScale = 0.02;
      let ny = noiseScale * newY;

      const modifier = noiseLevel * noise(ny) * map(newY, midPoint[1], 0, 1, 0); //;(heightProgress < 15 ? map(newY, height, 0, 1, 0) : 1);

      newX += modifier;

      path.push([newX, newY]);
    }
  }

  beginShape();

  path.forEach((pnt) => {
    stroke(39, 145, 81);
    strokeWeight(0.75);
    vertex(pnt[0], pnt[1]);
  });

  endShape();

  if (showControlPoints) {
    strokeWeight(5);
    stroke(9, 125, 9);
    point(startPoint[0], startPoint[1]);

    stroke(0, 0, 255);
    point(midPoint[0], midPoint[1]);

    stroke(255, 0, 0);
    point(endPoint[0], endPoint[1]);
  }

  if (showProgress && heightProgress <= 100) {
    noStroke();
    fill(255);
    rect(15, 5, 200, 12);
    fill(0);
    text(`progress: ${heightProgress}%`, 15, 15);
  }

  drawGrid();
}

const minRadius = 30;
class Mountain {
  pointCount = 10;
  points = [];
  contourData = [];
  r;
  x;
  y;

  // Maximum distace from the center of the shape
  maxDist = 0;

  constructor() {
    this.r = ceil(random(65) + minRadius);

    const scaleCount = ceil(random(6, 15));

    for (let i = 0; i < scaleCount; i++) {
      this.contourData.push({ scale: random(0.5, 1.75), angle: 0 });
    }

    this.calculateShape();
  }

  calculateShape() {
    this.x = floor(random(width));
    this.y = floor(random(height));

    for (let p = 1; p <= this.pointCount; p++) {
      const theta = 36 * p;

      const randomX = p % 2 !== 0 ? 0 : random(this.r) * floor(random(-1, 1));
      const randomY = p % 2 !== 0 ? 0 : random(this.r) * floor(random(-1, 1));

      const px = this.r * cos(theta) + randomX;
      const py = this.r * sin(theta) + randomY;
      this.points.push([px, py]);

      const pointDistance = distance(
        this.x,
        this.y,
        px + this.x + this.r,
        py + this.y + this.r,
      );
      if (pointDistance > this.maxDist) {
        this.maxDist = pointDistance;
      }
    }
  }

  addContourLines() {
    this.contourData.forEach((data) => {
      push();
      translate(this.x, this.y);
      scale(data.scale);
      rotate(data.angle);
      translate(-this.x, -this.y);

      this.draw(200);
      pop();
    });
  }

  draw(alpha = 200) {
    stroke(0, 0, 0, alpha);
    strokeWeight(1);
    noFill();

    point(this.x, this.y);

    // Add all points
    for (let i = 0; i < this.points.length; i++) {
      beginShape();

      const prevPoint =
        this.points[(i - 1 + this.points.length) % this.points.length];
      const startPoint = this.points[i];
      const endPoint = this.points[(i + 1) % this.points.length];
      const nextPoint = this.points[(i + 2) % this.points.length];

      curveVertex(prevPoint[0] + this.x, prevPoint[1] + this.y);
      curveVertex(startPoint[0] + this.x, startPoint[1] + this.y);
      curveVertex(endPoint[0] + this.x, endPoint[1] + this.y);
      curveVertex(nextPoint[0] + this.x, nextPoint[1] + this.y);

      endShape();
    }

    if (showBoundaryBorders) {
      stroke(200, 0, 0, 0.5);
      circle(this.x, this.y, this.maxDist);
    }
  }
}

function drawGrid() {
  stroke(0, 0, 0, 10);
  strokeWeight(0.5);
  drawingContext.setLineDash([5, 15]);

  for (let col = 100; col < width; col += 100) {
    line(col, 0, col, height);
  }

  for (let row = 120; row < height; row += 120) {
    line(0, row, width, row);
  }

  drawingContext.setLineDash([]);
}
