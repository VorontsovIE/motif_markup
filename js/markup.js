$(function(){
  $.get('http://hocomoco.autosome.ru/human/mono.json', function(data){
    var motif_list = data;
    var motif_list_formatted = $.map(motif_list, function(el,ind){
      return '<div class="motif">'+ el +'</div>';
    }).join('');
    $('#motif-list').html(motif_list_formatted);
  })
});
