const WIDTH = 32;
const HEIGHT = 16;

var drawing = false;
var color = [0,255,0];

function fill(col) {
    if(!col)
        col = color;
    if(col.length >= 4)
        col.pop();

    socket.emit("canvas:fill", col);
    $('td').css("backgroundColor", "rgb(" + col.join(",") + ")");
}

$(document).ready(function() {
    window.socket = io();

    const pickr = Pickr.create({
        el: '.color-picker',
        components: {preview: true, opacity: false, hue: true,
            interaction: {clear: true, save: true}}
    }).on('save', function(arg) {fill(arg.toRGBA())});

    createTable();
});


$("#clear").click(function() {
    fill([0,0,0]);
});

function fillPixel(cell) {
    console.log(this);
    var x = parseInt($(cell).attr("x"));
    var y = parseInt($(cell).attr("y"));
    
    socket.emit("canvas:pixel", {x:x, y:y}, color);
    $(cell).css("backgroundColor", "rgb(" + color.join(",") + ")");
}


function createTable(){
    var table = $('<table></table>').attr({ id: "matrixTable" });

    table.on("mousedown mouseup mouseover", function(e) {
        e.preventDefault();
    })

    table.on("mousedown", function() { 
        window.drawing = true;
    })
    table.on("mouseup", function() {
        window.drawing = false;
    });
	var rows = HEIGHT;
	var cols = WIDTH;
	var tr = [];
	for (var i = 0; i < rows; i++) {
		var row = $('<tr></tr>').attr({ class: "" }).appendTo(table);
		for (var j = 0; j < cols; j++) {
			$('<td></td>').attr({x: j, y:i, draggable: false}).on("mouseover", function() {
                if(drawing)
                    fillPixel(this);
            }).click(function(){fillPixel(this)}).appendTo(row); 
		}		 
	}
	table.appendTo("body");
}