const minFontSize = 24;
const maxFontSize = 124;

class Letter extends Boid {
  constructor(letter, x, y, previousLetter) {
    super(x, y);
    // Drawing / Oscillation Fields
    this.letter = letter;
    this.fontSize = random(minFontSize, maxFontSize);
    this.amplitude = map(this.fontSize, minFontSize, maxFontSize, 2, 5);
    this.startAngle = 0;
    this.angle = floor(random(0, 360));
    this.deltaAngle = random(0.05, 0.5);
    this.originalPoints = font.textToPoints(letter, x, y, this.fontSize, {
      sampleFactor: 0.25,
    });
    this.points = this.originalPoints.map(
      (pnt) => new Point(pnt.x, pnt.y, this.amplitude),
    );

    // Movement
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(1, -1), random(1, -1));
    this.lifespan = random(300, 900);
    this.maxspeed = 3;
    this.maxforce = 0.05;
    this.position = createVector(x, y);
    this.power = 500;

    // Lifespan fields
    this.originalLife = this.lifespan;
    this.previousLetter = previousLetter;
    this.fromColor = color("#0e510c")
    this.toColor = color("#510c0c")
  }

  updateAngle() {
    this.angle += this.deltaAngle;
  }

  update() {
    super.update();

    this.angle = this.startAngle;
    this.points.forEach((pnt) => {
      pnt.update(this, () => this.updateAngle());
    });

    this.stroke = lerpColor(this.fromColor, this.toColor, map(this.lifespan, this.originalLife, 0, 0, 1));
    this.startAngle += this.deltaAngle;
    this.lifespan -= 1;
  }

  draw() {
    this.points.forEach((pnt) => pnt.draw());
  }

  startDecay() {
    this.lifespan = this.originalLife * 0.33;
    this.velocity.x = random(1) < 0.5 ? -random(-0.2, -0.1) : random(0.1, 0.2);
  }

  isDecaying() {
    return this.lifespan <= this.originalLife * 0.33 && this.lifespan > 0;
  }

  hasEnded() {
    return this.lifespan <= 0;
  }

  borders() {
    this.points.forEach((pnt) => pnt.borders());
  }

  repel(letter) {
    let force = p5.Vector.sub(this.position, letter.position);
    let distance = force.mag();

    distance = constrain(distance, 5, 200);
    let strength = (-1 * this.power) / (distance * distance);
    force.setMag(strength);
    this.applyForce(force);
  }
}
