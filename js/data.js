var sequenceSample = 'AAAGTGCTGCTGAGGCGTAGAGCGTCGGCTGATGCGCTTGACTAGACTAACGTTA';
var sequenceArray = _.map(sequenceSample, function (x) { return x });
var sequence = {
	array: sequenceArray,
	isHighlighted: false,
	highlightFrom: -1,
	highlightTo: -1
}

function log10 (x){ 
	return Math.log(x) / Math.log(10);
}

var hitsSample = [{ "motif": "AHR_HUMAN.H10MO.B", "pos": 12, "length": 9, "strength": 1.1586509358307475, "strand": "+", "level": 0 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 29, "length": 9, "strength": 1.511203537121056, "strand": "+", "level": 0 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 29, "length": 9, "strength": 1.511203537121056, "strand": "-", "level": 1 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 33, "length": 9, "strength": 1.1586509358307475, "strand": "-", "level": 2 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 43, "length": 9, "strength": 1.1586509358307475, "strand": "+", "level": 0 }];
var hits = _.chain(hitsSample)
	.sortBy(function (x) { return x.pos; })
	//.map(function (x) { return Object.assign(x, { strength: -log10(x.strength) }); })
	.groupBy("level")
	.map(function(value, key){ return { depth: key, hits: value}; })
	.value();

var data = {
	sequence: sequence,
	hits: hits
};