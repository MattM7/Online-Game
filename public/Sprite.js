// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

function Sprite(x, y, r) {
  this.pos = createVector(x, y);
  this.startpos = createVector(x, y);
  this.r = r;
  this.dir = 0;
  this.velY = 0;
  this.velX = 0;
  this.friction = this.r / 10;

  this.updateVelY = function(_velY) {
    this.velY += _velY;
  }

  this.updateVelX = function(_velX) {
    this.velX += _velX;
  }

  this.update = function() {
    this.startpos = this.pos;
    this.friction = this.r / 20;

    if (this.velX > this.friction) {
      this.velX -= this.friction;
    } else if (this.velX < this.friction && this.velX < 0) {
      this.velX += this.friction;
    } else {
      this.velX = 0;
    }

    if (this.velY > this.friction) {
      this.velY -= this.friction;
    } else if (this.velY < this.friction && this.velY < 0) {
      this.velY += this.friction;
    } else {
      this.velY = 0;
    }


    this.pos.x += this.velX;
    this.pos.y += this.velY;
  }


  this.constrain = function() {
    var secondConsNum = 1000 - this.r * 2;
    sprite.pos.x = constrain(sprite.pos.x, -1000, secondConsNum);
    sprite.pos.y = constrain(sprite.pos.y, -1000, secondConsNum);
  }

  this.show = function() {
    fill(255);
    rect(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  this.reset = function() {
    this.pos.x = random(2000) - 1000;
    this.pos.y = random(2000) - 1000;
    this.velX = 0;
    this.velY = 0;
  }
}