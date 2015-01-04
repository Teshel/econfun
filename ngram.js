var fs = require('fs');
var NGram = NGram || {};

NGram.Corpus = function(data) {
	this.words = data.split("\n");
	this.
	words.forEach(function(word) {

	});
	// fs.readFile(filename, "UTF8", function(err, data) {
	// 	//if (err) throw err;
	// 	console.log(data);
	// });
};

var sampleCorpus = {
	"al": {"e": 4, "f": 2}
};

NGram.createModel = function(n, corpus) {
	var model = {};
	if (n >= 2) {
		corpus.forEach(function(word) {
			word = '^' + word + '$';
			if (word.length > n) {
				for (var i=0; i<word.length-n; i++) {
					
				}
			}
		});
	}
	return model;
};

NGram.Model.prototype = {

};

NGram.App = function() {
	this.corpus = document.getElementById("corpus_textarea");
	this.infoPanel = document.getElementById("info_panel");
	this.sizeDropDown = document.getElementById("model_size");
	this.createButton = document.getElementById("create_model_button");
	this.outputDiv = document.getElementById("output_div");
	this.models = [];

	var that = this;
	this.createButton.onclick = function() {
		var n = parseInt(that.sizeDropDown.value);
		if (that.models[n] === undefined) {
			var words = that.corpus.value.split("\n");
			that.models[n] = new NGram.createModel(n, words);
		}
		that.outputDiv.innerHTML = JSON.stringify(that.models[n]);
	}
};

NGram.App.prototype = {
	seedSequence: function() {

	},
	generate: function(n) {

	}
}

module.exports = NGram;

var app = new App();