$(function(){
  var markup = function(seq, pos, len) {
	var i;
	var sites = [] 
	for(i=0; i < pos.length-1; i++) {
		 
	  //seq = seq.replace(seq.slice(pos[i],pos[i]+len),'<span class="motif1">'+seq.slice(pos[i],pos[i]+len)+'</span>');
	}
	return sites;
  }


  sites = [
  	{motif: 'AP2A', pos: 3, len: 4, strand: '+', },
  	{motif: 'AP2A', pos: 6, len: 4, strand: '+', },
  	{motif: 'AP2B', pos: 12, len: 3, strand: '+', },
  ];
  var get_sites = function(sites){
  	var segments = [];
  	var points = [];
  	for (var i = sites.length - 1; i >= 0; i--) {
  		points.push({number:i,point:sites[i].pos,type:'start'});
  		points.push({number:i,point:sites[i].pos+sites[i].len-1,type:'end'});
  	}
  	points.sort(function(a,b){ return a.point-b.point; })
    
    var last_point_pos = 0;
    var this_number = {};
    for (i = 0; i < points.length; ++i) {
    	var thispoint = points[i];
    	this_number = $.extend({}, this_number);
    	if (thispoint.type == 'start') {this_number[thispoint.number] = true;}
    	else {this_number[thispoint.number] = false;}
    	if(last_point_pos != thispoint.point){
    		segments.push({start:last_point_pos,end:thispoint.point, number:this_number});
    	last_point_pos = thispoint.point;
    	}
    }
    return segments
 }




 // var get_collision_pos = function(pos,len){
  	//var collisions = [];
  	//for (var i = pos.length - 1; i >= 0; i--){
  	//	if (pos[i]+len > pos[i+1]) {
  	//		collisions.push([pos[i]+len,pos[i+1]]);
  	//	}
  	//}
  //}

  var get_motif_occurences = function(seq,matrix){
  	return [1, 8]; // TODO

  }

  var with_motif_pwm = function(motif_name, callback) {
    var result = null;
    $.get('http://hocomoco.autosome.ru/motif/' + motif_name + '.json', {with_matrices: true}, function(data){
      callback(data['pwm']);
    });
  };

  // $.get('http://hocomoco.autosome.ru/human/mono.json', function(data){
  //   var motif_list = data;
  //   var motif_list_formatted = $.map(motif_list, function(el,ind){
  //     return '<div class="motif">'+ el +'</div>';
  //   }).join('');
  //   $('#motif-list').html(motif_list_formatted);
  // });

  // TODO: replace this stub with actual Ajax request (see above)
  var motif_list_formatted = $.map(["AHR_HUMAN.H10MO.B","AIRE_HUMAN.H10MO.C","ALX1_HUMAN.H10MO.B"], function(el,ind){
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
    $(event.target).toggleClass('selected');
  });
});
