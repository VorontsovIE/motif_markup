var PVALUE_MAX = 0.01;

function log10(x) { // for test
  return (Math.log(x)/Math.log(10) );
}

function getScores(sequence, motif, direction) {
  var nucleotide_index = { // for pwm
    "A" : "0",
    "C" : "1",
    "G" : "2",
    "T" : "3"
  }
  var n = sequence.length;
  var m = motif.length;
  var result = new Array(n - m + 1);

  var motif_start, position_in_motif;
  for (motif_start = 0; motif_start <= n - m; motif_start++){
    result[motif_start] = 0;
    for (position_in_motif = 0; position_in_motif < m; position_in_motif++){
      result[motif_start] += motif[position_in_motif][ nucleotide_index [ sequence[motif_start + position_in_motif] ] ];
    }
  }
  return result;
}

// ToDo: make binary search not linear
function binarySearch(threshold_pvalue_list, score) {
  if (threshold_pvalue_list.length == 1) return threshold_pvalue_list[0][1];
  if (score <= threshold_pvalue_list[0][0]) return threshold_pvalue_list[0][1];
  for (var i = 1; i < threshold_pvalue_list.length; ++i) {
    if (threshold_pvalue_list[i][0] >= score) {
      return Math.sqrt(threshold_pvalue_list[i][1] * threshold_pvalue_list[i - 1][1]);
    }
  }
}

function revcomp_motif(motif) {
    var i, result = [];
    for (i = 0; i < motif.length; ++i) {
      result.push(motif[i].reverse());
    }
    return result.reverse();
  };

// мотив и сиквенс уже перевернуты, strand нужен, чтобы указать сайту имя нити
function findSitesGivenStrand(sequence, motif, motif_name, threshold_pvalue_list, pvalue_max, strand) {
  var score, pvalue,
      // motif = cases[case_index].motif,
      result = new Array();
  scores = getScores(sequence, motif);
// console.log(threshold_pvalue_list);
  for (motif_start = 0; motif_start < scores.length; motif_start++) {
    pvalue = binarySearch(threshold_pvalue_list, scores[motif_start]);
    // console.log(scores[motif_start],pvalue);
    if (pvalue <= pvalue_max) {
      result.push({
        motif: motif_name,
        pos: motif_start,
        length: motif.length,
        strength: -log10(pvalue),
        strand: strand,
      });
    }
  }
  return result;
};

function findSites(sequence, original_motif, motif_name, threshold_pvalue_list, pvalue_max) {
  var case_index,
      result = [],
      cases = [{motif: original_motif, strand: '+'}, {motif: revcomp_motif(original_motif), strand: '-'}];
  for (case_index = 0; case_index < cases.length; ++case_index) {
    result = result.concat(findSitesGivenStrand(sequence, cases[case_index].motif, motif_name, threshold_pvalue_list, pvalue_max, cases[case_index].strand));
  }
  return result;
};

function findAllSites(sequence, motif) {
	return findSites(sequence, motif.matrix, motif.name, motif.threshold_pvalue_list, PVALUE_MAX);
}

function keys_of_true_elements(dict) {
  var result = [];
  for (site in dict) {
    if (dict[site])
      result.push(site);
  }
  return result;
}

// segmentation = [
//   {start: 0, end: 3, sites:[]},
//   {start: 3, end: 6, sites:[0]},
//   {start: 6, end: 7, sites:[0, 1]},
//   {start: 7, end: 10, sites:[1]},
//   {start: 10, end: 12, sites:[]},
//   {start: 12, end: 14, sites:[2]},
// ];
function make_segmentation(sites,seq) {
  var segments = [];
  var points = [];
  var i;
  for (i = sites.length - 1; i >= 0; i--) {
    points.push({number:i, point:sites[i].pos, type:'start'});
    points.push({number:i, point:sites[i].pos + sites[i].length, type:'end'});
  }
  points.sort(function(a,b){ return a.point - b.point; });

  var last_point_pos = 0;
  var site_numbers = {};
  for (i = 0; i < points.length; ++i) {
    var thispoint = points[i];
    if (last_point_pos != thispoint.point) {
      segments.push({
        start: last_point_pos,
        end: thispoint.point,
        sites: keys_of_true_elements(site_numbers).map(function(site_index){ return sites[site_index]; }),
      });
      last_point_pos = thispoint.point;
    }
    site_numbers = $.extend({}, site_numbers); // clone
    if (thispoint.type == 'start') {
        site_numbers[thispoint.number] = true;
      } else {
        site_numbers[thispoint.number] = false;
      }
  }
  segments.push({
      start: last_point_pos,
        end: seq,
        sites: keys_of_true_elements(site_numbers).map(function(site_index){ return sites[site_index]; }),
    });
  return segments
}
