$(function(){
  function log10 (x){ // for test
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

  function binarySearch(arr, i) {
    var mid = Math.floor(arr.length / 2);
    if (arr[mid][0] === i) {
        return arr[mid][1];
    } else if (arr[mid][0] < i && arr.length > 1) {
        return binarySearch(arr.splice(mid, Number.MAX_VALUE), i);
    } else if (arr[mid][0] > i && arr.length > 1) {
        return binarySearch(arr.splice(0, mid), i);
    } else {
        return arr[mid][1];
    }
  }

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


  // motif_name = "AHR_HUMAN.H10MO.B";
  // motif = [[0.049659785047587994, -0.7112292711652767, 0.37218581437481474, 0.007118345755727385], [-1.186351771734709, -1.1076775894500088, -0.10122262270571959, 0.9004092051347231], [-0.5481419620395537, 0.1272377147320841, -0.59308886562888, 0.5502420250441404], [-2.3460850844035757, -2.7362137930742163, 1.3086872088653387, -1.979560121872743], [-3.4521272549574094, 1.3387809407527826, -2.670269442762779, -2.468668568747749], [-2.134973546777738, -2.965000508388951, 1.3322808172765501, -3.206089427067847], [-3.452127254957409, -2.134973546777738, -3.0087911229263193, 1.3351912597409452], [-3.4521272549574094, -3.4521272549574094, 1.3622489404156535, -3.4521272549574094], [0.10927007207680632, 0.5389064901558549, -0.8250174241334556, -0.3117320885632525]]
  // threshold_pvalue_list = [[-19.61437231767661, 1.0], [-16.669, 0.9706573486328125], [-11.569, 0.6465301513671875], [-9.349, 0.43091583251953125], [-7.289, 0.2872123718261719], [-5.949, 0.19127655029296875], [-4.699, 0.127593994140625], [-3.339, 0.08504104614257812], [-2.269, 0.05663299560546875], [-1.429, 0.03781890869140625], [-0.619, 0.025112152099609375], [0.251, 0.016819000244140625], [1.1909999999999998, 0.011199951171875], [1.9809999999999999, 0.007476806640625], [2.641, 0.004962921142578125], [3.181, 0.003276824951171875], [3.681, 0.0022125244140625], [4.211, 0.001476287841796875], [4.791, 9.8419189453125E-4], [5.481, 6.52313232421875E-4], [6.182, 4.3487548828125E-4], [6.652, 2.86102294921875E-4], [7.095, 1.94549560546875E-4], [7.444, 1.2969970703125E-4], [7.712000000000001, 8.392333984375E-5], [7.912999999999999, 5.7220458984375E-5], [8.231, 3.814697265625E-5], [8.363, 1.9073486328125E-5], [8.666, 1.1444091796875E-5], [8.724, 7.62939453125E-6], [8.793, 3.814697265625E-6]]

  p_value_max = 0.0000001;

  revcomp_motif = function(motif) {
    var i, result = [];
    for (i = 0; i < motif.length; ++i) {
      result.push(motif[i].reverse());
    }
    return result.reverse();
  };

  // мотив и сиквенс уже перевернуты, strand нужен, чтобы указать сайту имя нити
  findSitesGivenStrand = function(sequence, motif, motif_name, threshold_pvalue_list, p_value_max, strand) {
    var score, pvalue,
        // motif = cases[case_index].motif,
        result = new Array();
    scores = getScores(sequence, motif);

    for (motif_start = 0; motif_start < scores.length; motif_start++) {
      p_value = binarySearch(threshold_pvalue_list, scores[motif_start]);
      if (p_value <= p_value_max) {
        result.push({
          motif: motif_name,
          pos: motif_start,
          length: motif.length,
          strength: p_value,
          strand: strand,
        });
      }
    }
    return result;
  };

  findSites = function(sequence, original_motif, motif_name, threshold_pvalue_list, p_value_max) {
    var case_index,
        result = new Array(),
        cases = [{motif: original_motif, strand: '+'}, {motif: revcomp_motif(original_motif), strand: '-'}]
    for (case_index = 0; case_index < cases.length; ++case_index) {
      result += findSitesGivenStrand(sequence, cases[case_index].motif, motif_name, threshold_pvalue_list, p_value_max, cases[case_index].strand)
    }
    return result;
  };


});
