// constants

var LETTER_WIDTH_PX = 31.39;
var HIT_HEIGHT_PX = 30;

var STRENGTH_MIN = 1;
var STRENGTH_MAX = 3;

var HIT_HEIGHT_MIN_PX = 10;
var HIT_HEIGHT_MAX_PX = 30;

// d3

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
		.attr("class", "hit")
		.style("width", function (d) { return d.length * LETTER_WIDTH_PX + "px"; })
		.style("height", HIT_HEIGHT_PX + "px")
		.style("margin-left", function (d) { return d.pos * LETTER_WIDTH_PX + "px"; })
		.style("margin-top", function (d) { return d.depth * HIT_HEIGHT_PX + "px"; })
		.text(function (d) { return d.motif; });