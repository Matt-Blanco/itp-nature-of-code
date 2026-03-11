class Point {
  originalPos;
  pos;
  angle;
  stroke;
  decayXVelocity;

  constructor(x, y, amplitude) {
    this.pos = createVector(x, y);
    this.originalPos = createVector(x, y);
    this.angle = 0;
    this.amplitude = amplitude;
    this.alpha = 255;
  }

  update(rootLetter, updateAngle) {
    if (rootLetter.lifespan <= rootLetter.originalLife * 0.33) {
      // Causes letters to 'explode'
      this.pos.y = map(
        sin(rootLetter.angle),
        -1,
        1,
        this.pos.y - 200,
        this.pos.y + 200,
      );

      if (!this.decayXVelocity) {
        this.stroke = color(random(255), random(255), random(255));
        this.decayXVelocity = random(-2, 2);
      } else {
        this.pos.x += this.decayXVelocity;
      }
    } else {
      this.pos.add(rootLetter.velocity);

      this.pos.y = map(
        sin(rootLetter.angle),
        -1,
        1,
        this.pos.y - this.amplitude,
        this.pos.y + this.amplitude,
      );

      this.stroke = rootLetter.stroke;
    }

    updateAngle();
    this.alpha = map(
      rootLetter.lifespan,
      rootLetter.originalLife * 0.33,
      0,
      550,
      0,
    );
  }

  draw() {
    const strokeColor = color(this.stroke ? this.stroke : "black");
    strokeColor.setAlpha(this.alpha);
    stroke(strokeColor);

    point(this.pos.x, this.pos.y);
  }

  // Wraparound
  borders() {
    if (this.pos.x < -2) this.pos.x = width + 2;
    if (this.pos.y < -2) this.pos.y = height + 2;
    if (this.pos.x > width + 2) this.pos.x = -2;
    if (this.pos.y > height + 2) this.pos.y = -2;
  }
}
