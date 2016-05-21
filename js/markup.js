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
  window.with_motif_pwm = with_motif_pwm;

  $.get('http://hocomoco.autosome.ru/human/mono.json', function(data){
    var motif_list = data;
    var motif_list_formatted = $.map(motif_list, function(el,ind){
      return '<div class="motif">'+ el +'</div>';
    }).join('');
    $('#motif-list').html(motif_list_formatted);
  })
});
