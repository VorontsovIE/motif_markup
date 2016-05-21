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
  // 	{motif: 'AP2A', pos: 3, len: 4, strand: '+', },
  // 	{motif: 'AP2A', pos: 6, len: 4, strand: '+', },
  // 	{motif: 'AP2B', pos: 12, len: 3, strand: '+', },
  // ];
  var make_segmentation = function(sites){
  	var segments = [];
  	var points = [];
    var i;
  	for (i = sites.length - 1; i >= 0; i--) {
  		points.push({number:i, point:sites[i].pos, type:'start'});
  		points.push({number:i, point:sites[i].pos + sites[i].len - 1, type:'end'});
  	}
  	points.sort(function(a,b){ return a.point - b.point; });
    
    var last_point_pos = 0;
    var site_numbers = {};
    for (i = 0; i < points.length; ++i) {
    	var thispoint = points[i];
    	site_numbers = $.extend({}, site_numbers); // clone
    	if (thispoint.type == 'start') {
        site_numbers[thispoint.number] = true;
      } else {
        site_numbers[thispoint.number] = false;
      }
    	if (last_point_pos != thispoint.point) {
    		segments.push({
          start: last_point_pos,
          end: thispoint.point,
          sites: sites_in_dict(site_numbers)
        });
    	  last_point_pos = thispoint.point;
    	}
    }
    return segments
 }

  var get_motif_occurences = function(seq,matrix){
  	return [1, 8]; // TODO
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
    console.log('Markup sequence ' + sequence);
    var i = markup(sequence,get_motif_occurences(sequence," "),4);
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
  var markup_segmentation = function(sequence, segmentation) {
    return $.map(segmentation, function(segment) {
      classes = segment.sites.map(function(el) {
        return 'motif-' + el;
      }).join(' ');
      return '<span class="' + classes + '">' + sequence.slice(segment.start, segment.end) + '</span>';
    }).join('');
  }

  $('#show_motif_list').click(function(event){
    $('#motif-list').show();
  });
});
