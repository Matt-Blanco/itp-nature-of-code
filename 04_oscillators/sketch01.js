let pointsPerWave;

let xspacing = 2; // How far apart should each horizontal position be spaced
let w; // Width of entire wave
let maxwaves = 15; // total # of waves to add together

let theta = 0.0;
let amplitude = []; // Height of wave
let dx = []; // Value for incrementing X, to be calculated as a function of period and xspacing
let yvalues; // Using an array to store height values for the wave (not entirely necessary)
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  pointsPerWave = width;

  w = width + 16;

  for (let i = 0; i < maxwaves; i++) {
    amplitude[i] = random(10, 50);
    let period = random(100, 1000); // How many pixels before the wave repeats
    dx[i] = (TWO_PI / period) * xspacing;
  }

  yvalues = [];
}

function drawGradient() {
  for (let y = 0; y < height; y += 1) {
    let h = map(y, 0, height, 250, 200);
    let s = 100;
    let b = 42;
    stroke(h, s, b);
    line(0, y, width, y);
  }
}

function draw() {
  drawGradient();
  calcWave();
  renderWave();
}

function calcWave() {
  // Increment theta (try different values for 'angular velocity' here
  theta += 0.04;

  // Set all height values to zero
  for (let i = 0; i < w / xspacing; i++) {
    yvalues[i] = 0;
  }

  // Accumulate wave height values
  for (let j = 0; j < maxwaves; j++) {
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
      // Every other wave is cosine instead of sine
      if (j % 2 === 0) yvalues[i] += sin(x) * amplitude[j];
      else yvalues[i] += cos(x) * amplitude[j];
      x += dx[j];
    }
  }
}

function renderWave() {
  // A simple way to draw the wave with an ellipse at each position
  stroke(360);
  fill(0);
  ellipseMode(CENTER);
  for (let x = 0; x < yvalues.length; x++) {
    point(x * xspacing, height / 2 + yvalues[x], 10);
  }
}
