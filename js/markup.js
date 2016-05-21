$(function(){
  var markup = function(seq, pos, len) {
	var i;
	for(i=pos.length-1; i >= 0; i--) {
	  seq = seq.replace(seq.slice(pos[i],pos[i]+len),'<span class="motif1">'+seq.slice(pos[i],pos[i]+len)+'</span>');
	}
	return seq
  }

  var with_motif_pwm = function(motif_name, callback) {
    var result = null;
    $.get('http://hocomoco.autosome.ru/motif/' + motif_name + '.json', {with_matrices: true}, function(data){
      callback(data['pwm']);
    });
  };

  var selected_motifs = function() {
    return $('.motif.selected').map(function(ind, el){
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
  var motif_list_formatted = $.map(["AHR_HUMAN.H10MO.B","AIRE_HUMAN.H10MO.C","ALX1_HUMAN.H10MO.B"], function(el,ind){
    return '<div class="motif">'+ el +'</div>';
  }).join('');
  $('#motif-list').html(motif_list_formatted);

  $('#markup_button').click(function(event){
    var sequence = $('#sequence_input').val();
    console.log('Markup sequence ' + sequence);
  });

  $('#motif-list').on('click', '.motif', function(event){
    $(event.target).toggleClass('selected');
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
});
