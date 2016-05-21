$(function(){

  var sites_in_dict = function(dict) {
    var result = [];
    for (site in dict) {
      if (dict[site])
        result.push(site);
    }
    return result;
  }
  // sites = [
  // 	{motif: 'AP2A', pos: 3, len: 4, strand: '+', strength: 5.5}, // сила от 0(прозрачно) до 10(непрозрачно)
  // 	{motif: 'AP2A', pos: 6, len: 4, strand: '+', },
  // 	{motif: 'AP2B', pos: 12, len: 3, strand: '+', },
  // ];
  var get_color = function(motifG)
  {
  	if(motifG == 'motif-0')
  	{
  		return '#6a38ff';
  	}

  	if(motifG == 'motif-1')
  	{
  		return '#FF0000';
  	}

  	if(motifG == 'motif-2')
  	{
  		return '#FFD700';
  	}

  	if(motifG == 'motif-3')
  	{
  		return '#800000';
  	}

  	if(motifG == 'motif-4')
  	{
  		return '#FF00FF';
  	}


  }
  var make_segmentation = function(sites,seq){
  	var segments = [];
  	var points = [];
    var i;
  	for (i = sites.length - 1; i >= 0; i--) {
  		points.push({number:i, point:sites[i].pos, type:'start'});
  		points.push({number:i, point:sites[i].pos + sites[i].len, type:'end'});
  	}
  	points.sort(function(a,b){ return a.point - b.point; });
  	// $.each(points, function(point){
  	// 	console.log(point);
  	// });
  	console.log(points);
    
    var last_point_pos = 0;
    var site_numbers = {};
    for (i = 0; i < points.length; ++i) {
    	var thispoint = points[i];
	    if (last_point_pos != thispoint.point) {
	      segments.push({
	        start: last_point_pos,
	        end: thispoint.point,
	        sites: sites_in_dict(site_numbers),
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
	        sites: sites_in_dict(site_numbers),
	    });
    console.log(segments)
    return segments

 }

  var get_motif_occurences = function(seq,matrix){
  	return [
   	{motif: 'AP2A', pos: 3, len: 4, strand: '+',strength: 1},
   	{motif: 'AP2A', pos: 6, len: 4, strand: '+', strength: 1},
   	{motif: 'AP2B', pos: 12, len: 3, strand: '+', strength: 0.5},
   ]; // TODO
  }

  var with_motif_pwm = function(motif_name, callback) {
    var result = null;
    $.get('http://hocomoco.autosome.ru/motif/' + motif_name + '.json', {with_matrices: true}, function(data){
      callback(data['pwm']);
    });
  };

  var selected_motifs = function() {
    return $('#motif-list-selected .motif').map(function(ind, el){
      return $(el).text();
    });
  }

  // $.get('http://hocomoco.autosome.ru/human/mono.json', function(data){
  //   var motif_list = data;
  //   var motif_list_formatted = $.map(motif_list, function(el,ind){
  //     return '<div class="motif">'+ el +'</div>';
  //   }).join('');
  //   $('#motif-list').html(motif_list_formatted);
  // });

  // TODO: replace this stub with actual Ajax request (see above)
  var motif_list_formatted = $.map(["AHR_HUMAN.H10MO.B","AIRE_HUMAN.H10MO.C","ALX1_HUMAN.H10MO.B"], function(el, ind){
    return '<div class="motif">'+ el +'</div>';
  }).join('');
  $('#motif-list').html(motif_list_formatted);

  $('#markup_button').click(function(event){
    var sequence = $('#sequence_input').val();
    // console.log('Markup sequence ' + sequence);
    sites = get_motif_occurences(sequence," ");
    console.log(make_segmentation(sites));
    var i = markup_segmentation(sequence, sites);
    $('#result').html(i);
  });


  $('#motif-list').on('click', '.motif', function(event){
    var $motif = $(event.target);
    $motif.appendTo('#motif-list-selected');
  });
  $('#motif-list-selected').on('click', '.motif', function(event){
    var $motif = $(event.target);
    $motif.appendTo('#motif-list');
  });

  // sequence = 'ACTAGACTAACGTTA';
  // segmentation = [
  //   {start: 0, end: 3, sites:[]},
  //   {start: 3, end: 6, sites:[0]},
  //   {start: 6, end: 7, sites:[0, 1]},
  //   {start: 7, end: 10, sites:[1]},
  //   {start: 10, end: 12, sites:[]},
  //   {start: 12, end: 14, sites:[2]},
  // ];
  var get_strength = function(motifS)
  	{
  		for (var i = sites.length - 1; i >= 0; i--) {
  			if(sites[i].motif == motifS)
  			{
  				return sites[i].strength
  			}
  		}
  	}

  var wrap_in_multispan = function(text, span_classes,strength) {
    if (span_classes.length == 0) {
      return text;
    } else {
      var motif = span_classes[0][1];
      var klass = span_classes[0][0];
      console.log(get_color(motif)+"  "+motif+" "+klass+"  "+get_strength(motif))
      return '<span style="background-color: '+ get_color(klass) +'; opacity:'+ get_strength(motif) +';" class="' + klass + '">' + wrap_in_multispan(text, span_classes.slice(1)) + '</span>';
    }
  }

  var markup_segmentation = function(sequence, sites) {
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
      	// console.log(el);
        return ['motif-' + (el - number_to_subtract), sites[el].motif,];
      });

      console.log(segment)
      return wrap_in_multispan(sequence.slice(segment.start, segment.end), classes,segment.strength);
    }).join('');
  }

  $('#show_motif_list').click(function(event){
    $('#motif-list').show();
  });
});
