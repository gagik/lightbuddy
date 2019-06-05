
const express = require('express')
const fs = require("fs");
const app = express()
const port = process.env.PORT || 8080;

const WIDTH = 32;
const HEIGHT = 16;

var LedMatrix = require("easybotics-rpi-rgb-led-matrix");

//init a 16 rows  by 16 cols led matrix 
//default hardware mapping is 'regular', could be 'adafruit-hat-pwm' ect 
var matrix = new LedMatrix(16, 32 );

const server = app.listen(port, () => console.log('LightBuddy listening on port ' + port + '!'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')}
);

app.use('/assets', express.static('public'))

const io  = require('socket.io')(server);

var changed = false;

io.on('connection', function (socket) {
    console.log("Someone connected");
    socket.on("canvas:fill", function(color) {
        console.log("nice!" + color);
        matrix.fill(color[0], color[1], color[2]);
        changed = true;
    });
    socket.on("canvas:pixel", function(pixel, color) {
        matrix.setPixel(pixel.x, pixel.y, color[0], color[1], color[2]);
        changed = true;
    })
    socket.on("canvas:copy", function(imageData, length) {
		var data = imageData;
		for (var i = 0; i < length; i += 4) {
			var y = Math.floor(i / 4 / WIDTH) 
            var x = i / 4 - y * WIDTH;
            matrix.setPixel(x, y, data[i], data[i + 1], data[i + 2])
        }
        changed = true;
    });
});

setInterval(function(){
    if(!changed) return;
    matrix.update();
    changed = false;
}, 10);    