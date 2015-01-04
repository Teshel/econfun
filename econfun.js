Array.range= function(a, b, step){
    var A= [];
    if(typeof a== 'number'){
        A[0]= a;
        step= step || 1;
        while(a+step<= b){
            A[A.length]= a+= step;
        }
    }
    else{
        var s= 'abcdefghijklmnopqrstuvwxyz';
        if(a=== a.toUpperCase()){
            b=b.toUpperCase();
            s= s.toUpperCase();
        }
        s= s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A= s.split('');        
    }
    return A;
}

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.diff = function(a) {
	return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Number.prototype.times = function(f) {
	for (var i=0; i<this; i++) {
		f(i);
	}
};

function backingScale() {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

var EconFun = EconFun || {};

EconFun.pointSize = 30;
EconFun.pointScaledSize = EconFun.pointSize * backingScale();

EconFun.World = function(width, height, canvas, infoPanel) {
	this.width = width;
	this.height = height;
	this.grid = [];
	for (var y=0; y<height; y++) {
		this.grid[y] = [];
		for (var x=0; x<width; x++) {
			this.grid[y][x] = new EconFun.Point(x, y);
		}
	}
	this.entities = [];
	this.spawn(40);

	this.infoPanel = infoPanel;

	this.canvas = canvas;
	this.hoverCell = {x: -1, y: -1};
	var that = this;
	canvas.onmousemove = function(e) {
		that.hoverCell.x = Math.floor((e.x  - this.offsetLeft) / EconFun.pointSize);
		that.hoverCell.y = Math.floor((e.y  - this.offsetTop) / EconFun.pointSize);
		//console.log("x: " + that.selectedCell.x.toString() + ", y: " + that.selectedCell.y.toString());
		that.render();
	};
	this.selectedCell = {x: -1, y: -1};
	canvas.onclick = function(e) {
		that.selectedCell.x = Math.floor((e.x  - this.offsetLeft) / EconFun.pointSize);
		that.selectedCell.y = Math.floor((e.y  - this.offsetTop) / EconFun.pointSize);
		//console.log("x: " + that.selectedCell.x.toString() + ", y: " + that.selectedCell.y.toString());
		that.render();
	};

	canvas.width = width * EconFun.pointScaledSize;
	canvas.height = height * EconFun.pointScaledSize;
	canvas.style.width = (width * EconFun.pointSize).toString() + "px";
	canvas.style.height = (height * EconFun.pointSize).toString() + "px";
};

EconFun.World.prototype = {
	render: function() {
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		// Draw horizontal grid lines
		for (var i=0; i < this.width; i++) {
			ctx.beginPath();
			var x = (i*EconFun.pointScaledSize)+1;
			ctx.moveTo(x, 0);
			ctx.lineTo(x, this.canvas.height);
			ctx.stroke();
		}

		// Draw vertical grid lines
		for (var i=0; i < this.height; i++) {
			ctx.beginPath();
			var y = (i*EconFun.pointScaledSize)+1;
			ctx.moveTo(0, y);
			ctx.lineTo(this.canvas.width, y);
			ctx.stroke();
		}

		// Hover box
		ctx.strokeStyle = 'rgb(218,112,214)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect(this.hoverCell.x*EconFun.pointScaledSize,
			this.hoverCell.y*EconFun.pointScaledSize,
			EconFun.pointScaledSize, EconFun.pointScaledSize);
		ctx.stroke();

		// Selected box
		ctx.strokeStyle = 'rgb(100,149,237)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(this.selectedCell.x*EconFun.pointScaledSize,
			this.selectedCell.y*EconFun.pointScaledSize,
			EconFun.pointScaledSize, EconFun.pointScaledSize);
		ctx.stroke();

		// Entities
		ctx.strokeStyle = 'rgb(100,149,237)';
		this.grid.forEach(function(rows) {
			rows.forEach(function(point) {
				if (point.entities.length > 0) {
					ctx.beginPath();
					var x = (point.x + 0.5) * EconFun.pointScaledSize;
					var y = (point.y + 0.5) * EconFun.pointScaledSize;
					ctx.arc(x, y, EconFun.pointScaledSize/2.8, 0, 2*Math.PI);
					ctx.font = "16px Verdana";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(point.entities.length.toString(), x, y);
					ctx.stroke();
				}
			});
		});

		// update info panel
		if (this.selectedCell.x >= 0 && this.selectedCell.y >= 0) {
			var str = "";
			var selectedPoint = this.pointAt(this.selectedCell.x, this.selectedCell.y);
			selectedPoint.entities.forEach(function(entity) {
				str += "<p>Person: " + entity.name + "<br />&nbsp;&nbsp;Happiness: " + entity.happiness.toString() + "<br />&nbsp;&nbsp;Items: [" +
					entity.items.map(function(item) {
						item.name
					}).join(", ") + "]</p>";
			});

			this.infoPanel.innerHTML = "Point (" + selectedPoint.x + ", " +
				selectedPoint.y + ")<br />" + str;
		}
	},

	pointAt: function(x, y) {
		return this.grid[y][x];
	},

	addEntityAtPoint: function(entity, point) {
		if (this.entities.indexOf(entity) < 0) {
			this.entities.push(entity);
		}
		if (point.entities.indexOf(entity) < 0) {
			point.entities.push(entity);
		}	
	},

	addEntityAtCoords: function(entity, x, y) {
		// find point
		var point = this.pointAt(x, y);
		// add
		this.addEntityAtPoint(entity, point);
	},

	addItemAtPoint: function(item, point) {
		if (point.items.indexOf(entity) < 0) {
			point.items.push(entity);
		}	
	},

	addItemAtCoords: function(item, x, y) {
		var point = this.pointAt(x, y);
		this.addItemAtPoint(item, point);
	},

	spawn: function(n) {
		var num = n||10;

		num.times(function() {
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			this.addEntityAtCoords(new EconFun.Person(), x, y);
		});
	},

	spawnItems: function(n) {
		var num = n||10;

		num.times(function() {
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			this.addItemAtCoords(new EconFun.Item(), x, y);
		});
	}
}

EconFun.Point = function(x, y) {
	this.x = x;
	this.y = y;
	this.entities = [];
	this.items = [];
};

EconFun.Person = function(name) {
	this.name = name||EconFun.Person.randomName();
	this.happiness = 0;
	this.items = [];
};

// Should split this off into a hidden markov model generator
// Which could analyze some corpus and create a model that is stored in JSON
EconFun.Ngram = function() {
	this.
};


EconFun.vowels = ["a", "e", "i", "o", "u"];
EconFun.consonants = Array.range('a', 'z').diff(EconFun.vowels);
EconFun.randomName = function(l) {
	var len = l||4;
	var name = "";
	while (name.length < len) {

	}
};


EconFun.Person.randomName = function() {
	var nameLength = Math.floor(Math.random() * 3) + 2;
	var str = "";
	nameLength.times( function() {
		str += consonants.random() + vowels.random();
	});
	return str.charAt(0).toUpperCase() + str.slice(1);
};

EconFun.Person.prototype.draw = function(ctx) {
	ctx.beginPath();
};

EconFun.Item = function(name) {

};

EconFun.Item.randomName = function() {

};

var main_canvas = document.getElementById('main_canvas');
var infoPanel = document.getElementById('info_panel');
var world = new EconFun.World(10, 10, main_canvas, infoPanel);
world.render();