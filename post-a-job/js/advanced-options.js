$(function() {
  var star = {};
  star.active = function() {
    $('#feedback-score').addClass('active');

    $('html').on('mousemove',function(e){
      if ($('#feedback-score').hasClass('active')) {
        var offsetPos = e.pageX - $('#feedback-score').offset().left,
            fullWidth = $(this).width(),
            score,
            star      = {},
            starPos;
        for (var i=0;i<$('#feedback-score .star').size();i++) {
          if (e.pageX > $('#feedback-score .star').eq(i).offset().left) {
            star = $('#feedback-score .star').eq(i);
          }
        }

        fullWidth = star.width();
        starPos   = e.pageX - star.offset().left;

        if (starPos > fullWidth/4 && starPos < fullWidth/2) { starWidth = fullWidth/2; }
        if (starPos > fullWidth/4 && starPos < fullWidth/1.5) { starWidth = fullWidth/2; }
        if (starPos > fullWidth/1.5) { starWidth = fullWidth; }
        if (starPos <= fullWidth/4) { starWidth = 0; }
        
        star.find('.inner-star').width(starWidth);
        star.nextAll().each(function() { $(this).find('.inner-star').width(0); });
        star.prevAll().each(function() { $(this).find('.inner-star').width(fullWidth); });
        score = star.prevAll().size() + starWidth/fullWidth;
        $('#feedback-score').attr('score',score);
      }
    });
  };
  $('#feedback-score').on('mousedown',function(){
    star.active();
  });
  $('html').on('mouseup',function(){
    if ($('#feedback-score').hasClass('active')) {
      $('#feedback-score').removeClass('active');
    }
  });
});