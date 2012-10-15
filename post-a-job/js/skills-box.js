/* Skills Box */
$(function() {
  
  var searchList = {};
  searchList.format = function() {
    var listHeight = $('#skills-search ul').height(),
        minHeight  = $('#skills-search').height();
    
    if (listHeight < minHeight) {
      console.log('changing height');
      $('#skills-search').css('height',listHeight);
    }
  };

  searchList.search = function (query) {
    var results       = [],
        searchResults = [],
        query        = query.toLowerCase().split(' ').join('-');

    for (var i=0;i<skills.length;i++) {
      if (skills[i].indexOf(query) >= 0) {
        results.push(skills[i]);
      }
    }

    for (var i=0;i<results.length;i++) {
      searchResults.push('<li>' + results[i].replace(query,'<strong>' + query + '</strong>') + '</li>');
    }

    $('#skills-search')
      .addClass('active')
        .find('ul').html('').append(searchResults.join(''))
        .find('li:first').addClass('selected');
    
    $('#skills-search li').on('hover',function(){
      $(this).parent().find('.selected').removeClass('selected');
      $(this).addClass('selected');
    })
    
    $('#skills-search li').on('click',function(){
      addSkill({'skill':$(this).text(),'parent':'#skills-box'});
    });

    searchList.format();
  }
  var skillbox = {};
  skillbox.formatInput = function () {
    var input = $('#skills-box input'),
        skills = input.parent().find('.skill'),
        width  = 0;
    input.attr('placeholder','Enter a skill');
    skills.each(function(){
      width += $(this).width();
    });
  };

  skillbox.addSkill = function (skill) {
    addSkill({'skill':skill,'parent':'#skills-box'},skillbox.formatInput());
  }
  function formatSkillsInput() {
    var skillsBox    = $('#skills-box'),
        input        = skillsBox.find('input'),
        skillsSearch = $('#skills-search'),
        query;
    skillsBox.on('click',function(e){
      input.focus();
      e.stopPropagation();
    });

    $('html').on('click',function(){
      if (skillsSearch.hasClass('active')) {
        skillsSearch.removeClass('active');
      }
    });
    
    input.on('keyup',function(e){
      var cur = $('#skills-search ul li.selected');
      if (e.which == 13) {
        skillbox.addSkill(cur.text());
      }
      if (e.which == 40) { // Down Key
        cur.removeClass('selected');
        cur.next().addClass('selected');
      }
      if (e.which == 38) { // Up Key
        cur.removeClass('selected');
        cur.prev().addClass('selected');
      }
      if (e.which != 38 && e.which != 13 && e.which != 40) {
        query = input.val().toLowerCase();
        searchList.search(query);
      }
    });

  }
    
  formatSkillsInput();

});