function rescale(number) {
  var i = (number - 1)/6;
  if(i <= 0.4) return 0.4;
  return i;
}

function get_color(motifG) {
  return '#6a38ff';
  // if(motifG == '0') {
  //   return '#6a38ff';
  // } else if(motifG == '1') {
  //   return '#FF0000';
  // } else if(motifG == '2') {
  //   return '#FFD700';
  // } else if(motifG == '3') {
  //   return '#800000';
  // } else if(motifG == '4') {
  //   return '#FF00FF';
  // }
}

function get_strength(motifS) {
  for (var i = sites.length - 1; i >= 0; i--) {
    if(sites[i].motif == motifS) {
      return sites[i].strength
    }
  }
}


function set_levels(sites) {
  sites.sort(function(a,b) { return a.pos - b.pos; });

  var level = 0,
      rightmost_end = -1;

  for (var i = 0; i < sites.length; ++i) {
    var current_site = sites[i];
    if (current_site.pos >= rightmost_end) {
      level = 0;
    } else {
      level += 1;
    }
    sites[i].level = level;
    rightmost_end = current_site.pos + current_site.length;
  }
  return sites;
}

function markup_segmentation(sequence, sites) {
  set_levels(sites)
  // var max_number = -1;
  var number_to_subtract = 0;
  var segmentation = make_segmentation(sites, sequence.length);
  return $.map(segmentation, function(segment) {
  // max_number = Math.max(max_number, Math.max.apply(Math, segment.sites));
    // if(segment.sites.length == 0){
    //   number_to_subtract = max_number + 1;
    // }
    // classes = segment.sites.sort().reverse().map(function(el)
    // {
    //   return ['motif-' + sites[el].level, sites[el].motif,];//(el - number_to_subtract)
    // });

    sites.sort(function(a,b) { return b.level - a.level;} );
  	console.log(segment.sites);	
  	if (segment.sites.length == 0) {
  	  return sequence.slice(segment.start, segment.end);
  	} else {
	  var tooltip_options = 'data-toggle="tooltip" data-title="Some text"'
	  return '<span class="segment has-tooltip" ' + tooltip_options + '>' + wrap_in_multispan(sequence.slice(segment.start, segment.end), segment.sites) +'</span>';
  	}
  }).join('');
}

function wrap_in_multispan(text, sites) {
  if (sites.length == 0) {
    return text;
  } else {
    var motif = sites[0].motif,
     	klass = 'motif-' + sites[0].level,
     	opacity = rescale(sites[0].strength);
      	
    return '<span style="background-color: '+ get_color(motif) +'; opacity:'+ opacity +';" class="' + klass + '">' + 
    		wrap_in_multispan(text, sites.slice(1)) +
     		'</span>';
  }
}