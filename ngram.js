var NGram = NGram || {};

NGram.Corpus = function(data) {
	this.words = data.split("\n");
	//this.
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
	// Dist stores the numbers of occurrences
	var dist = {};
	// Offsets is a recalculation so that a random generator
	// can pick something based on the number of occurrances
	var distOffsets = {};

	// Seeds stores the givens that are at the beginning of the word
	// (i.e. those that start with "^")
	var seeds = {};
	var seedOffsets = [];

	// Monograms aren't implemented yet
	if (n >= 2) {
		corpus.forEach(function(word) {
			word = '^' + word + '$';
			if (word.length > n) {
				for (var i=0; i<word.length-n; i++) {
					var given = word.substring(i,(i+n)-1);
					//debugger;
					var letter = word[(i+n)-1];
					dist[given] = dist[given] || {};
					dist[given][letter] = dist[given][letter]+1||1;
				}
			}
		});

		var seedOffset = 0;
		for (var givenKey in dist) {
			var offset = 0;
			distOffsets[givenKey] = [];

			// if the given starts with a ^, this is a starting seed

			//} else {
				for (var letterKey in dist[givenKey]) {
					offset += dist[givenKey][letterKey];
					distOffsets[givenKey].push([letterKey, offset]);
				}
			//}
			// 
			if (givenKey.indexOf('^') === 0) {
				seedOffset += offset
				seedOffsets.push([givenKey, seedOffset]);
			}
				// for (var letterKey in dist[givenKey]) {
				// 	seedOffset += dist[givenKey][letterKey];
				// 	seedOffsets.push([givenKey+letterKey, seedOffset]);
				// }
		}
	}
	// might only need to return the offsets, not sure yet
	return {dist:dist, distOffsets:distOffsets, seeds:seeds, seedOffsets:seedOffsets};
};

NGram.App = function() {
	this.corpus = document.getElementById("corpus_textarea");
	this.infoPanel = document.getElementById("info_panel");
	this.sizeDropDown = document.getElementById("model_size");
	this.createButton = document.getElementById("create_model_button");
	this.outputDiv = document.getElementById("output_div");
	this.models = [];

	var that = this;
	this.createButton.onclick = function(e) {
		// grab the current selection for n
		var n = parseInt(that.sizeDropDown.value);
		// split the corpus (input text) on each newline
		var words = that.corpus.value.split("\n");
		// make a new n-gram model
		that.models[n] = new NGram.createModel(n, words)
		that.outputDiv.innerHTML = JSON.stringify(that.models[n]);
	}
};

NGram.randFromOffsetDist = function(offsets) {
	var maxOffset = offsets[offsets.length-1][1];
	var r = Math.floor(Math.random() * maxOffset);
	
	//for (var i=0; i<offsets.length; i++) {
	var i = 0;
	while (i < offsets.length && r >= offsets[i][1]) {
		i++;
	}
	return offsets[i][0];
}

NGram.App.prototype = {
	seedSequence: function(n) {
		n = n || 2;
		var model = this.models[n];

		return NGram.randFromOffsetDist(model.seedOffsets);
	},
	// n refers to the n in n-gram
	// minLength and maxLength are the minimum and maximum lengths
	// of the word we want to generate
	generate: function(n, maxLength) {
		n = n || 2;
		//minLength = minLength || 4;
		maxLength = maxLength || 10;

		// start with a seed
		var sequence = this.seedSequence(n);
		var finish = false;
		while (sequence.length < maxLength && !finish) {
			var given = sequence.substring((sequence.length-(n-1)), sequence.length);
			console.log(given);
			var offsets = this.models[n].distOffsets[given];
			if (offsets === undefined) {
				finish = true;
			} else {
				sequence += NGram.randFromOffsetDist(offsets);
			}
			
		}
		return sequence;
	}
}

var app = new NGram.App();