// constants

var LETTER_WIDTH_PX = 31.39;
var HIT_HEIGHT_PX = 30;

var STRENGTH_MIN = 2;
var STRENGTH_MAX = 6;

var HIT_HEIGHT_MIN_PX = 30;
var HIT_HEIGHT_MAX_PX = 100;

var ALL_MOTIFS = [motifGata, motifAndr];

// d3

var strengthScale = d3
	.scale
	.linear()
	.domain([STRENGTH_MIN, STRENGTH_MAX])
	.range([HIT_HEIGHT_MIN_PX, HIT_HEIGHT_MAX_PX]);

var colorScale = d3.scale.category10();

var motifIndexes = _.chain(ALL_MOTIFS)
	.map(function (m, i) { return [m.name, i]; })
	.reduce(function(r, m) {
		var kvp = {};
		kvp[m[0]] = m[1];
		return Object.assign(r, kvp);
	}, {})
	.value();

function colorMotifScale(name) {
	return colorScale(motifIndexes[name]);
};


//d3.select(".sequence-index")
//	.style("width", function () { return data.sequence.array.length * LETTER_WIDTH_PX + "px"; })
//	.selectAll("div")
//		.data(sequenceArray)
//	.enter().append("span")
//		.text(function (d, i) { return i; });

function highlightSequence(sequence, start, end) {
	return Object.assign(sequence, { isHighlighted: true, highlightFrom: start, highlightTo: end });
}

function removeHighlight(sequence) {
	return Object.assign(sequence, { isHighlighted: false, highlightFrom: -1, highlightTo: -1 });
}

function updateSequence(data) {
	d3.select(data.containerSelector)
	.selectAll("span")
		.data(data.array)
	.attr("class", function (_, i) {
		if (!data.isHighlighted)
			return "";

		return data.highlightFrom <= i && i <= data.highlightTo
			? "m-highlighted"
			: "";
	})
	.enter().append("span")
		.text(function (d) { return d; });
}

function renderSequence(data, fn) {
	data.sequence = fn(data.sequence);
	updateSequence(data.sequence);
}

function renderHits(data) {
	d3.select(data.containerSelector)
		.style("width", function () { return data.sequence.array.length * LETTER_WIDTH_PX + "px"; })
		.selectAll("div")
			.data(data.hits)
		.enter().append("div")
			.attr("class", "hits-row")
			.style("height", function (d) {
				var maxStrength = d3.max(d.hits, function (h) { return h.strength; });
				return strengthScale(maxStrength) + "px";
			})
			.selectAll("div")
				.data(function (d) { return d.hits; })
			.enter().append("div")
				.attr("class", function(d){ return ["hit", ((d.strand == '+') ? 'strand-plus' : 'strand-minus')].join(' '); } )
				.style("width", function (d) { return d.length * LETTER_WIDTH_PX + "px"; })
				.style("height", function (d) { return strengthScale(d.strength) + "px"; })
				.style("margin-left", function (d) { return d.pos * LETTER_WIDTH_PX + "px"; })
				.style("background-color", function (d) { return colorMotifScale(d.motif); })
				.attr("tabindex", function (_, i) { return i; })
				.attr("data-placement", "bottom")
				.attr("data-trigger", "focus")
				.attr("title", function (d) { return d.motif; })
				.attr("data-html", true)
				.attr("data-content", function (d) { return "Strength: " + d.strength + "<br/>Pos: " + d.pos})
				.text(function (d) { return d.motif; })
				.on("mouseover", function (d) { renderSequence(data, function (s) { return highlightSequence(s, d.pos, d.pos + d.length - 1); }); })
				.on("mouseout", function (d) { renderSequence(data, function (s) { return removeHighlight(s); }); })
				.on("click", function(d, x, y) {
					$(this).popover('show');
				});
}

function renderSequenceWithResults(sequence, index) {
	var results = findAllSites(sequence, ALL_MOTIFS);
	var data = {
		sequence: {
			array: _.map(sequence, function (x) { return x }),
			isHighlighted: false,
			highlightFrom: -1,
			highlightTo: -1,
			containerSelector: ".sequence-" + index
		},
		hits: _.chain(results)
			.sortBy(function (x) { return x.pos; })
			.groupBy("level")
			.map(function (value, key) { return { depth: key, hits: value }; })
			.value(),
		containerSelector: ".hits-" + index,
		index: index
	}
	updateSequence(data.sequence);
	renderHits(data);
}

function createDiv(cssClass) {
	var div = document.createElement("div");
	div.className = cssClass;
	return div;
}

function renderSequences(sequences) {
	var resultsContainer = document.getElementById("results-container");
	resultsContainer.innerHTML = "";

	for (var i = 0; i < sequences.length; i++) {
		var s = sequences[i];
		var containerDiv = createDiv("sequence-result");
		var sequenceContainer = createDiv('sequence sequence-' + i);
		var hitsContainer = createDiv('hits hits-' + i);

		containerDiv.appendChild(sequenceContainer);
		containerDiv.appendChild(hitsContainer);

		resultsContainer.appendChild(containerDiv);

		renderSequenceWithResults(s, i);
	}
}

function renderSequenceFromTextArea() {
	var text = document.getElementById("sequences-textarea").value;
	var sequences = text.split('\n');
	renderSequences(sequences);
}

//renderSequences(['AAAGTGCTGCTGAGGCGTAGAGCGTCGGCTGATGCGCTTGACTAGACTAACGTTA', 'AAAGTGCTGCTGAGGCGTAGAGCGTCGGCTGATGCGCTTGACTAGACTAACGTTA'])
