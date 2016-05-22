function rescale(number) {
  var i = (number - 1)/6;
  if(i <= 0.4) return 0.4;
  return i;
}

function get_color(motifG) {
  if(motifG == '0') {
    return '#6a38ff';
  } else if(motifG == '1') {
    return '#FF0000';
  } else if(motifG == '2') {
    return '#FFD700';
  } else if(motifG == '3') {
    return '#800000';
  } else if(motifG == '4') {
    return '#FF00FF';
  }
}

function get_strength(motifS) {
  for (var i = sites.length - 1; i >= 0; i--) {
    if(sites[i].motif == motifS) {
      return sites[i].strength
    }
  }
}

function wrap_in_multispan(text, span_classes, strength) {
  if (span_classes.length == 0) {
    return text;
  } else {
    var motif = span_classes[0][1];
    var klass = span_classes[0][0];
    var num = klass[klass.length-1];
    return '<span style="background-color: '+ get_color(num) +'; opacity:'+ rescale(strength) +';" class="' + klass + '">' + wrap_in_multispan(text, span_classes.slice(1), strength) + '</span>';
  }
}

function markup_segmentation(sequence, sites) {
  var max_number = -1;
  var number_to_subtract = 0;
  var segmentation = make_segmentation(sites, sequence.length);
  return $.map(segmentation, function(segment) {
  max_number = Math.max(max_number, Math.max.apply(Math, segment.sites));
    if(segment.sites.length == 0){
      number_to_subtract = max_number + 1;
    }
    classes = segment.sites.sort().reverse().map(function(el)
    {
      return ['motif-' + (el - number_to_subtract), sites[el].motif,];
    });

    return wrap_in_multispan(sequence.slice(segment.start, segment.end), classes, segment.strength);
  }).join('');
}
