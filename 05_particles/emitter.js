const defaultLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

class TypeEmitter {
  pointLetters = [];

  /**
   *
   * @param {number} x cx
   * @param {number} y cy
   * @param {number} r radius of the emitter
   */
  constructor(pos, r, letters = defaultLetters) {
    this.letters = letters.forEach((letter, i) => {
      const thetaInc = 360 / letters.length;

      const theta = thetaInc * i - 180;

      const velocity = p5.Vector.fromAngle(radians(theta), 2);

      this.pointLetters.push(new Letter(letter, pos, velocity));
    });
  }

  update() {
    this.pointLetters.filter((p) => !p.isDead()).forEach((p) => p.update());
  }

  draw() {
    this.pointLetters.forEach((p) => p.draw());
  }
}

fontSize = 36;
initialLifespan = 200;

class Letter {
  lifespan = initialLifespan;
  pos;
  velocity;
  rotationalVelocity;
  points;
  angle = 0;
  gravity = createVector(0, 0.1);

  constructor(letter, initialPos, vel) {
    this.pos = initialPos;
    this.velocity = vel;

    this.points = font.textToPoints(letter, this.pos.x, this.pos.y, fontSize, {
      sampleFactor: 0.25,
    });
  }

  update() {
    this.velocity.add(this.gravity);

    if (!this.points.some((pnt) => pnt.y >= height)) {
      this.points.forEach((pnt) => {
        pnt.x += this.velocity.x;
        pnt.y += this.velocity.y;
      });
    }

    this.angle++;
    this.lifespan--;
  }

  draw() {
    push();
    const opacity = map(this.lifespan, initialLifespan, 0, 255, 0);
    const newScale = map(this.lifespan, initialLifespan, 0, 1, 0);

    noStroke();
    fill(color("#3d3b3c"), opacity);

    beginShape();
    this.points.forEach((pnt) => {
      vertex(pnt.x, pnt.y);
    });

    endShape();
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}
