// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let w = 10;
let columns, rows, zColumns;
let board;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  columns = 300 / w;
  rows = 300 / w;
  zColumns = 300 / w;
  board = create3DArray(columns, rows, zColumns);
  for (let i = 1; i < columns - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      for (let x = 1; x < zColumns - 1; x++) {
        board[i][j][x] = new Cell(floor(random(2)), i * w, j * w, x * w, w);
      }
    }
  }
}

function draw() {
  background(255);
  //{!2} Looping but skipping the edge cells
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      for (let z = 1; z < zColumns - 1; z++) {
        let neighborSum = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            for (let q = -1; q <= 1; q++) {
              //{!1 .bold} Use the previous state when counting neighbors
              neighborSum += board[x + i][y + j][z + q].previous;
            }
          }
        }
        neighborSum -= board[x][y][z].previous;

        //{!3} Set the cell's new state based on the neighbor count
        if (board[x][y][z].state == 1 && neighborSum < 2) {
          board[x][y][z].state = 0;
        } else if (board[x][y][z].state == 1 && neighborSum > 3) {
          board[x][y][z].state = 0;
        } else if (board[x][y][z].state == 0 && neighborSum == 3) {
          board[x][y][z].state = 1;
        }
      }
    }
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      for (let z = 0; z < zColumns; z++) {
        //{!1} evaluates to 255 when state is 0 and 0 when state is 1
        board[i][j][z].show();

        //{!1} save the previous state before the next generation!
        board[i][j][z].previous = board[i][j][z].state;
      }
    }
  }

  orbitControl();
}

function create3DArray(columns, rows, zColumns) {
  let arr = new Array(columns);
  for (let i = 0; i < columns; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = new Array(zColumns);
      for (let q = 0; q < zColumns; q++) {
        arr[i][j][q] = new Cell(0, i * w, j * w, q * w, w);
      }
    }
  }
  return arr;
}

class Cell {
  constructor(state, x, y, z, w) {
    // What is the cell’s state?
    this.state = state;
    this.previous = this.state;

    // position and size
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  show() {
    push();
    // noStroke()
    //{!2} If the cell is born, color it blue!
    if (this.previous === 0 && this.state == 1) {
      fill(0, 0, 255, 80);
    } else if (this.state == 1) {
      fill(0, 10);
      //{!2} If the cell dies, color it red!
    } else if (this.previous == 1 && this.state === 0) {
      fill(255, 0, 0, 80);
    } else {
      fill(255, 80);
    }
    translate(this.x, this.y, this.z)
    box(this.w, this.w);
    pop();
  }
}
