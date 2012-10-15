$(function() {
  var star = {};
  star.active = function() {
    $('#feedback-score').addClass('active');

    $('html').on('mousemove',function(){});
    $('#feedback-score .star').each(function() {
      $(this).on('mousemove',function(e){
        var offsetPos = e.pageX - $(this).offset().left,
            fullWidth = $(this).width(),
            score;

        if (offsetPos > fullWidth/4 && offsetPos < fullWidth/2) { offsetPos = fullWidth/2; }
        if (offsetPos > fullWidth/4 && offsetPos < fullWidth/1.5) { offsetPos = fullWidth/2; }
        if (offsetPos > fullWidth/1.5) { offsetPos = fullWidth; }
        if (offsetPos <= fullWidth/4) { offsetPos = 0; }
        
        $(this).find('.inner-star').width(offsetPos);
        $(this).nextAll().each(function() { $(this).find('.inner-star').width(0); });
        $(this).prevAll().each(function() { $(this).find('.inner-star').width(fullWidth); });
        score = $(this).prevAll().size() + offsetPos/fullWidth;
        $('#feedback-score').attr('score',score);
      });
    });
  };
  $('#feedback-score').on('mousedown',function(){
    star.active();
  });
  $('html').on('mouseup',function(){
    if ($('#feedback-score').hasClass('active')) {
      $(this).removeClass('active');
    }
  });
});