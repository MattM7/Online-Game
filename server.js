// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var sprites = [];

function Sprite(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.wasHit = false;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = require('http').createServer(app);
//var server = app.listen(process.env.PORT || 3000, listen);
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/*', function(req, res) {
  var file = req.params[0];
  // console.log('\t :: Express :: file requested : ' + file);
  res.sendFile(__dirname + "/public/" + file);
});
server.listen(process.env.PORT || 3000);
console.log("Server started on localhost:3000");


// This call back just tells us that the server has started
/*function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}*/

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
  for (var i = sprites.length - 1; i >= 0; i--) {
    sprites[i].wasHit = false;
  }

  for (var i = sprites.length - 1; i >= 0; i--) {
    for (var j = sprites.length - 1; j >= 0; j--) {
      //console.log("peQleeR");
      var sprite = sprites[i];
      var sprite2 = sprites[j];
      if (sprite2 != sprite && isHit(sprite, sprite2)) {
        sprites[i].wasHit = true;
        sprites[j].wasHit = true;
      }
    }
  }
  io.sockets.emit('heartbeat', sprites);
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("We have a new client: " + socket.id);


    socket.on('start',
      function(data) {
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var sprite = new Sprite(socket.id, data.x, data.y, data.r);
        sprites.push(sprite);
      }
    );

    socket.on('update',
      function(data) {
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var sprite, sprite2;
        var didRemove = false;
        //if (sprites.length >= 0) {
        for (var i = sprites.length - 1; i >= 0; i--) {
          if (socket.id == sprites[i].id) {
            sprite = sprites[i];
          }
        }





        try { //stops on error from occuring when a screen is open on server startup
          sprite.x = data.x;
          sprite.y = data.y;
          sprite.r = data.r;
        } catch (e) {

        }
      }
    );



    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      for (var i = sprites.length - 1; i >= 0; i--) {
        if (socket.id == sprites[i].id) {
          sprites.splice(i, 1);
        }
      }
    });
  }
);

var isHit = function(_sprite1, _sprite2) {
  //int nX1, nY1, nX2, nY2, nH1, nW1, nH2, nW2;
  var nH1, nW1, nH2, nW2, nX1, nY1, nX2, nY2;
  nX1 = _sprite1.x;
  nY1 = _sprite1.y;
  nX2 = _sprite2.x;
  nY2 = _sprite2.y;
  //int nTop1, nBot1, nLeft1, nRight1, nTop2, nBot2, nLeft2, nRight2;
  nH1 = _sprite1.r * 2; // this is how I get the width and height from the class file
  nW1 = _sprite1.r * 2;
  nH2 = _sprite2.r * 2;
  nW2 = _sprite2.r * 2;
  if (
    (((nX1 <= nX2) && (nX1 + nW1 >= nX2)) ||
      ((nX1 >= nX2) && (nX1 <= nX2 + nW2))) &&
    (((nY1 <= nY2) && (nY1 + nH1 >= nY2)) ||
      ((nY1 >= nY2) && (nY1 <= nY2 + nH2)))
  ) {
    return (true);
  } else {
    return (false);
  }
}