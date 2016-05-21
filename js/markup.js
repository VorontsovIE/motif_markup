$(function(){
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
  });

  $('#motif-list').on('click', '.motif', function(event){
    $(event.target).toggleClass('selected');
  });
});
