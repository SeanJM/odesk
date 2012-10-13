/* Skills Box */
$(function() {
  
  function formatSearchList() {
    var listHeight = $('#skills-search ul').height(),
        minHeight  = $('#skills-search').height();
    if (listHeight < minHeight) {
      console.log('changing height');
      $('#skills-search').css('height',listHeight);
    }
  }

  function skillSearch(search) {
    var results = [],
        searchResults = [],
        search = search.toLowerCase().split(' ').join('-');

    for (var i=0;i<skills.length;i++) {
      if (skills[i].indexOf(search) >= 0) {
        results.push(skills[i]);
      }
    }

    for (var i=0;i<results.length;i++) {
      searchResults.push('<li>' + results[i].replace(search,'<strong>' + search + '</strong>') + '</li>');
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

    formatSearchList();
  }

  function formatSkillsInput() {
    var sb            = $('#skills-box'),
        input         = sb.find('input'),
        skillsSearch  = $('#skills-search');
    
    sb.on('click',function(e){
      $(this).find('input').focus();
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
        addSkill({'skill':cur.text(),'parent':'#skills-box'});
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
        var search  = input.val().toLowerCase();
        skillSearch(search);
      }
    });

  }
    
  formatSkillsInput();

});