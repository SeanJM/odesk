$(function() {
  var star = {};
  star.active = function() {
    $('#feedback-score').addClass('active');

    $('html').on('mousemove',function(e){
      if ($('#feedback-score').hasClass('active')) {
        star.click(e);
      }
    });
  };
  star.click = function(e) {
    var offsetPos = e.pageX - $('#feedback-score').offset().left,
        fullWidth,
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
    score = star.prevAll().size() + starWidth/fullWidth + '';
    if (score.split('.').length < 2) { score = score + '.0'; }
    $('#feedback-score').attr('score',score);
    $('#feedback-value').html(score);
  };

  $('#feedback-score').on('mousedown',function(e){
    star.active();
    star.click(e);
  });
  $('html').on('mouseup',function(){
    if ($('#feedback-score').hasClass('active')) {
      $('#feedback-score').removeClass('active');
    }
  });
  // Hourly Rate
  var rate = {};
  rate.sliderInit = function() {
    if (!$('#rate-slider').hasClass('visible')) {
      $('html').on('click',function(){
        if ($('#rate-slider').hasClass('visible')) { $('#rate-slider').removeClass('visible'); }  
      });
      $('#rate-slider').on('click',function(event) {
        event.stopPropagation();
      });
      $('#advanced-options .rate-container').on('click',function(event) {
        event.stopPropagation();
      });
    }
    $('#rate-slider').addClass('visible');
  }
  rate.bindInput = function () {
    $('#advanced-options .rate-container').on('click',function() {
      $('#rate-slider').attr('target',$(this).attr('id'));
    });
    $('#advanced-options .rate-container input').on('click',function() {
      rate.sliderInit();
      if ($(this).val().length) {
        var val = parseInt($(this).val().replace('$','')) / 500 * 100;
      }
    });
  }
  rate.update = function (value) {
    var target = $('#' + $('#rate-slider').attr('target')).find('input');
    target.val('$' + parseInt(value/100*500) + '.00');
  }
  rate.slider = function() {
    $('#rate-slider .slider').on('mousedown',function() {
      rate.sliderDrag({'drag':$(this).addClass('draggable'),'parent':$(this).parent(),'level':$(this).parent().find('.sliding-level'),'min':0,'max':196,'normal':100},function () { 
        rate.update($('#rate-slider .slider-container').attr('level'));
      });
    });
  }
  rate.sliderValue = function(object,callback) {
    var dragPos = object.value;
    var normal = parseInt(dragPos / object.max * object.normal + 1);
    if (dragPos >= object.min && dragPos <= object.max) {
      object.drag.css('left',dragPos - (object.drag.width()/2));
      object.level.css('width',dragPos);
      object.parent.attr('level',normal);
    }
    if (callback) { callback(); }
  }
  rate.sliderDrag = function(object,callback) {
    var dragPos;
    $('html').on('mousemove',function(event) {
      if (object.drag.hasClass('draggable')) {
        dragPos = event.pageX - object.parent.offset().left;
        var realVal = parseInt(dragPos - (object.drag.width()/2));
        var realMax = parseInt(object.max - object.drag.width());
        var normal = parseInt(realVal / realMax * object.normal + 1);
        if (dragPos-(object.drag.width()/2) >= object.min && dragPos+(object.drag.width()/2) <= object.max) {
          object.drag.css('left',dragPos - (object.drag.width()/2));
          object.level.css('width',dragPos);
          object.parent.attr('level',normal);
        }
      }
      if (callback) { callback(); }
    });
    $('html').on('mouseup',function(event) {
      object.drag.removeClass('draggable');
    });
  }

  rate.slider();
  rate.bindInput();
});