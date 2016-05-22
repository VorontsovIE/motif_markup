$(function(){
  // sites = [
  //  {motif: 'AP2A', pos: 3, len: 4, strand: '+', strength: 5.5}, // сила от 0(прозрачно) до 10(непрозрачно)
  //  {motif: 'AP2A', pos: 6, len: 4, strand: '+', },
  //  {motif: 'AP2B', pos: 12, len: 3, strand: '+', },
  // ];

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
    motif_name = "AHR_HUMAN.H10MO.B";
    motif = [[0.049659785047587994, -0.7112292711652767, 0.37218581437481474, 0.007118345755727385], [-1.186351771734709, -1.1076775894500088, -0.10122262270571959, 0.9004092051347231], [-0.5481419620395537, 0.1272377147320841, -0.59308886562888, 0.5502420250441404], [-2.3460850844035757, -2.7362137930742163, 1.3086872088653387, -1.979560121872743], [-3.4521272549574094, 1.3387809407527826, -2.670269442762779, -2.468668568747749], [-2.134973546777738, -2.965000508388951, 1.3322808172765501, -3.206089427067847], [-3.452127254957409, -2.134973546777738, -3.0087911229263193, 1.3351912597409452], [-3.4521272549574094, -3.4521272549574094, 1.3622489404156535, -3.4521272549574094], [0.10927007207680632, 0.5389064901558549, -0.8250174241334556, -0.3117320885632525]]
    threshold_pvalue_list = [[-19.61437231767661, 1.0], [-16.669, 0.9706573486328125], [-11.569, 0.6465301513671875], [-9.349, 0.43091583251953125], [-7.289, 0.2872123718261719], [-5.949, 0.19127655029296875], [-4.699, 0.127593994140625], [-3.339, 0.08504104614257812], [-2.269, 0.05663299560546875], [-1.429, 0.03781890869140625], [-0.619, 0.025112152099609375], [0.251, 0.016819000244140625], [1.1909999999999998, 0.011199951171875], [1.9809999999999999, 0.007476806640625], [2.641, 0.004962921142578125], [3.181, 0.003276824951171875], [3.681, 0.0022125244140625], [4.211, 0.001476287841796875], [4.791, 9.8419189453125E-4], [5.481, 6.52313232421875E-4], [6.182, 4.3487548828125E-4], [6.652, 2.86102294921875E-4], [7.095, 1.94549560546875E-4], [7.444, 1.2969970703125E-4], [7.712000000000001, 8.392333984375E-5], [7.912999999999999, 5.7220458984375E-5], [8.231, 3.814697265625E-5], [8.363, 1.9073486328125E-5], [8.666, 1.1444091796875E-5], [8.724, 7.62939453125E-6], [8.793, 3.814697265625E-6]]
    sites = findSites(sequence, motif, motif_name, threshold_pvalue_list, 0.1);
    var i = markup_segmentation(sequence, sites);
    $('#result').html(i);
  });

 //function(sequence, original_motif, motif_name, threshold_pvalue_list, p_value_max)

  $('#motif-list').on('click', '.motif', function(event){
    var $motif = $(event.target);
    $motif.appendTo('#motif-list-selected');
  });
  $('#motif-list-selected').on('click', '.motif', function(event){
    var $motif = $(event.target);
    $motif.appendTo('#motif-list');
  });

  $('#show_motif_list').click(function(event){
    $('#motif-list').show();
  });
});
