// A lot of the code came from Daniel Shiffman
// Shiffman's site http://codingtra.in
// Shiffman's Patreon http://patreon.com/codingtrain
// The specific video tutorial followed to set up the basics: https://youtu.be/ZjVyKXp9hec

// Keep track of our socket connection
var socket;

var sprite;

var sprites = [];
var keys = []; // index 0 = w, 1 = d, 2 = s, 3 = a, index 4 holds the last key to be pressed

var zoom = 1;
var isHit = false;
var img;

function setup() {
  createCanvas(900, 800);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  //socket = io.connect('http://localhost:3000');
  socket = io();
  img = loadImage("Assets/background.jpeg");

  sprite = new Sprite(random(width), random(height), random(8, 24));
  // Make a little object with  and y
  var data = {
    x: sprite.pos.x,
    y: sprite.pos.y,
    r: sprite.r
  };
  socket.emit('start', data);

  socket.on('heartbeat',
    function(data) {
      //console.log(data);
      sprites = data;
    }
  );
}

function draw() {
  isHit = false;
  background(0);


  //console.log(sprite.pos.x, sprite.pos.y);

  translate(width / 2, height / 2);
  //var newzoom = 64 / sprite.r;
  //zoom = lerp(zoom, newzoom, 0.1);
  //scale(1);
  translate(-sprite.pos.x, -sprite.pos.y);



  fill(125, 0, 125);
  //rect(-1000, -1000, 2000, 2000);
  image(img, -1000, -1000);

  for (var i = sprites.length - 1; i >= 0; i--) {
    var id = sprites[i].id;
    if (id !== socket.id) {
      fill(0, 0, 255);
      rect(sprites[i].x, sprites[i].y, sprites[i].r * 2, sprites[i].r * 2);

      fill(255);
      textAlign(CENTER);
      textSize(4);
      text(sprites[i].id, sprites[i].x, sprites[i].y + sprites[i].r);
    } else {
      if (sprites[i].wasHit == true) {
        console.log("Ya hit");
        sprite.reset();
        isHit = true;
      }
    }

  }

  determineInput();
  if (isHit == false) {
    sprite.update();
  }
  sprite.constrain();
  sprite.show();

  var data = {
    x: sprite.pos.x,
    y: sprite.pos.y,
    r: sprite.r
  };
  socket.emit('update', data);

}

function keyPressed() {
  //code for top down game
  if (key == 'w' || key == 'W' || keyCode == UP_ARROW) {
    keys[0] = 1;
    keys[4] = 0;
    //sprite.updateVelY(-20);
  } else if (key == 'd' || key == 'D' || keyCode == RIGHT_ARROW) {
    keys[1] = 1;
    keys[4] = 1;
    //sprite.updateVelX(20);
  } else if (key == 's' || key == 'S' || keyCode == DOWN_ARROW) {
    keys[2] = 1;
    keys[4] = 2;
    //sprite.updateVelY(20);
  } else if (key == 'a' || key == 'A' || keyCode == LEFT_ARROW) {
    keys[3] = 1;
    keys[4] = 3;
    //sprite.updateVelX(-20);
  }

}

function keyReleased() {
  if (key == 'w' || key == 'W' || keyCode == UP_ARROW) {
    keys[0] = 0;
  } else if (key == 'd' || key == 'D' || keyCode == RIGHT_ARROW) {
    keys[1] = 0;
  } else if (key == 's' || key == 'S' || keyCode == DOWN_ARROW) {
    keys[2] = 0;
  } else if (key == 'a' || key == 'A' || keyCode == LEFT_ARROW) {
    keys[3] = 0;
  }
}

function determineInput() {
  var isKeyPressed = false;
  for (var i = 0; i < 4; i++) { //checks that no keys are pressed
    if (keys[i] == 1) {
      this.isKeyPresseed = true;
    }
  }

  if (this.isKeyPressed == false) {
    keys[4] = -1;
  }

  if (keys[4] > -1) {
    if (keys[0] == 1 && keys[2] == 0) {
      //go up
      sprite.updateVelY(-2);
    } else if (keys[2] == 1 && keys[0] == 0) {
      //go right
      sprite.updateVelY(2);
    }

    if (keys[1] == 1 && keys[3] == 0) {
      //go down
      sprite.updateVelX(2);
    } else if (keys[3] == 1 && keys[1] == 0) {
      //go left
      sprite.updateVelX(-2);
    }
  }
}