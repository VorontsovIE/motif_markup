// constants

var LETTER_WIDTH_PX = 31.39;
var HIT_HEIGHT_PX = 30;

var STRENGTH_MIN = 1;
var STRENGTH_MAX = 7;

var HIT_HEIGHT_MIN_PX = 30;
var HIT_HEIGHT_MAX_PX = 60;

// d3

var strengthScale = d3
	.scale
	.linear()
	.domain([STRENGTH_MIN, STRENGTH_MAX])
	.range([HIT_HEIGHT_MIN_PX, HIT_HEIGHT_MAX_PX]);


d3.select(".sequence-index")
	.selectAll("div")
		.data(sequenceArray)
	.enter().append("span")
		.text(function (d, i) { return i; });

function highlightSequence(sequence, start, end) {
	return Object.assign(sequence, { isHighlighted: true, highlightFrom: start, highlightTo: end });
}

function removeHighlight(sequence) {
	return Object.assign(sequence, { isHighlighted: false, highlightFrom: -1, highlightTo: -1 });
}

function updateSequence(data) {
	d3.select(".sequence")
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

function renderSequence(fn) {
	data.sequence = fn(data.sequence);
	updateSequence(data.sequence);
}

d3.select(".hits")
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
			.attr("class", "hit")
			.style("width", function (d) { return d.length * LETTER_WIDTH_PX + "px"; })
			.style("height", function (d) { return strengthScale(d.strength) + "px"; })
			.style("margin-left", function (d) { return d.pos * LETTER_WIDTH_PX + "px"; })
			.text(function (d) { return d.motif; })
			.on("mouseover", function (d) { renderSequence(function(s) { return highlightSequence(s, d.pos, d.pos + d.length - 1); }); })
			.on("mouseout", function (d) { renderSequence(function (s) { return removeHighlight(s); }); })
//.on("mousemove", function (d) { console.log('mouse move on ' + d.pos + ' to ' + d.pos + d.length - 1); });

updateSequence(data.sequence);