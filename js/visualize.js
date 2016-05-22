// constants

var LETTER_WIDTH_PX = 31.39;
var HIT_HEIGHT_PX = 30;

var STRENGTH_MIN = 1;
var STRENGTH_MAX = 7;

var HIT_HEIGHT_MIN_PX = 10;
var HIT_HEIGHT_MAX_PX = 30;

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

d3.select(".sequence")
	.selectAll("div")
		.data(sequenceArray)
	.enter().append("span")
		.text(function (d) { return d; });

d3.select(".hits")
	.selectAll("div")
		.data(hits)
	.enter().append("div")
		.attr("class", "hits-row")
		.style("height", function (d) {
		var maxStrength = d3.max(d.hits, function(h) { return h.strength; });
			return strengthScale(maxStrength) + "px";
		})
		.selectAll("div")
			.data(function (d) { return d.hits; })
		.enter().append("div")
			.attr("class", "hit")
			.style("width", function (d) { return d.length * LETTER_WIDTH_PX + "px"; })
			.style("height", function (d) { return strengthScale(d.strength) + "px"; })
			.style("margin-left", function (d) { return d.pos * LETTER_WIDTH_PX + "px"; })
			.text(function (d) { return d.motif; });
