let font;

let letterMap = new Map();
let lastEnteredLetter;

let cols;
let rows;

const resolution = 75;
let grid;

let ecosystemString = "";

function preload() {
  font = loadFont(
    "https://mattblanco.me/itp-nature-of-code/04_oscillators/assets/MonaspaceKrypton-Regular.otf",
  );
}

let hideEcosystemCheckbox;
let hideEcosystem = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  cols = Math.floor(width / resolution);
  rows = Math.floor(height / resolution);

  grid = new Array(cols);

  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }

  hideEcosystemCheckbox = createCheckbox("Show Ecosystem", true);
}

function draw() {
  strokeWeight(2);
  background(color("#fcf9f4"), 95);
  textSize(24);
  noStroke();
  fill(0, 255);

  text("The Digital is Ephemeral", 30, 50);

  if (hideEcosystemCheckbox.checked()) {
    push();
    textSize(124);
    textWrap(WORD);
    scale(
      textWidth(ecosystemString) / width < 1
        ? 1
        : width / textWidth(ecosystemString),
    );
    fill(0, 200);

    const maxTextWidth = (width * 0.5) * (textWidth(ecosystemString) / width < 1 ? 1 : textWidth(ecosystemString) / width);
    text(ecosystemString, width * 0.25, 150, maxTextWidth);
    pop();
    console.log(textWidth(ecosystemString));
  }

  noFill();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }

  letterMap.forEach(({ letters, decaying }, key) => {
    // Continue to draw decaying letters
    decaying.forEach((lttr) => {
      lttr.update();
      lttr.draw();
    });

    letters.forEach((lttr) => {
      let column = floor(lttr.position.x / resolution);
      let row = floor(lttr.position.y / resolution);

      column = constrain(column, 0, cols - 1);
      row = constrain(row, 0, rows - 1);
      grid[column][row].push(lttr);

      lttr.run();
      lttr.draw();
    });

    // Move newly decayed letters to array
    letterMap.get(key).letters.filter((lttr) => {
      if (lttr.isDecaying()) {
        decaying.push(lttr);
        return true;
      } else {
        return false;
      }
    });
    letterMap.get(key).decaying = decaying.filter(
      (letter) => !letter.hasEnded(),
    );
  });
}

function keyPressed() {
  const normalizedLetter = key.toLocaleLowerCase();

  if (normalizedLetter === "backspace") {
    if (lastEnteredLetter) {
      const { letters, decaying } = letterMap.get(
        lastEnteredLetter.letter.toLocaleLowerCase(),
      );
      const letterToDecay = letters.pop();
      letterToDecay.startDecay();
      decaying.push(letterToDecay);

      lastEnteredLetter = letterToDecay.previousLetter;
    }

    ecosystemString = ecosystemString.slice(0, ecosystemString.length - 1);
  } else if (
    key !== "Meta" &&
    key !== "Shift" &&
    key !== "Alt" &&
    key !== "Control" &&
    key !== "Meta"
  ) {
    ecosystemString += key;
    const newLetter = new Letter(
      key,
      random(30, width - 30),
      random(30, height - 30),
      lastEnteredLetter,
    );

    if (letterMap.get(normalizedLetter)) {
      letterMap.get(normalizedLetter).letters.push(newLetter);
    } else {
      letterMap.set(normalizedLetter, {
        letters: [newLetter],
        decaying: [],
      });
    }

    lastEnteredLetter = newLetter;
  }
}

letterForceMap = {
  a: {
    sep: 5.5,
    ali: 5.0,
    coh: 5.0,
  },
  b: {
    sep: 10.5,
    ali: 1.0,
    coh: 6.0,
  },
  c: {
    sep: 5.5,
    ali: 5.0,
    coh: 10.0,
  },
  d: {
    sep: 8.5,
    ali: 1.0,
    coh: 2,
  },
  e: {
    sep: 0.5,
    ali: 2.0,
    coh: 4.0,
  },
  f: {
    sep: 2.5,
    ali: 6.0,
    coh: 3.0,
  },
  g: {
    sep: 5.5,
    ali: 5.0,
    coh: 10.0,
  },
  h: {
    sep: 5.5,
    ali: 5.0,
    coh: 10.0,
  },
};

function getForceByLetter(letter) {
  if (letterForceMap[letter]) {
    return letterForceMap[letter];
  } else {
    return {
      sep: 5.5,
      ali: 5.0,
      coh: 5.0,
    };
  }
}
