var sequence = 'AAAGTGCTGCTGAGGCGTAGAGCGTCGGCTGATGCGCTTGACTAGACTAACGTTA';
var sequenceArray = _.map(sequence, function(x) { return x; });

function log10 (x){ 
	return Math.log(x) / Math.log(10);
}

var hitsSample = [{ "motif": "AHR_HUMAN.H10MO.B", "pos": 13, "length": 9, "strength": 0.020551430419662436, "strand": "+", "depth": 0 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 16, "length": 9, "strength": 0.03081743317182391, "strand": "+", "depth": 2 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 18, "length": 9, "strength": 0.013724867266903848, "strand": "+", "depth": 3 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 23, "length": 9, "strength": 0.000002, "strand": "+", "depth": 3 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 26, "length": 9, "strength": 0.06939833710167047, "strand": "+", "depth": 0 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 30, "length": 9, "strength": 0.04627956449367295, "strand": "+", "depth": 2 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 32, "length": 9, "strength": 0.006091535254410528, "strand": "+", "depth": 3 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 46, "length": 9, "strength": 0.04627956449367295, "strand": "+", "depth": 2 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 2, "length": 9, "strength": 0.009150949092665239, "strand": "-", "depth": 2 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 18, "length": 9, "strength": 0.009150949092665239, "strand": "-", "depth": 0 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 22, "length": 9, "strength": 0.013724867266903848, "strand": "-", "depth": 1 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 30, "length": 9, "strength": 0.006091535254410528, "strand": "-", "depth": 2 }, { "motif": "AHR_HUMAN.H10MO.B", "pos": 32, "length": 9, "strength": 0.020551430419662436, "strand": "-", "depth": 0 }];
var hits = _.chain(hitsSample)
	.sortBy(function (x) { return x.pos; })
	.map(function (x) { return Object.assign(x, { strength: -log10(x.strength) }); })
	.groupBy("depth")
	.map(function(value, key){ return { depth: key, hits: value}; })
	.value();

var data = {
	sequence: sequence,
	hits: hits
};