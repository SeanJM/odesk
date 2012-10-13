function load_template(data,callback) {
  var cache = $('<div />'),
      templateAddress = './templates/' + data['file'] + '.html' + ' ' + data['template'],
      newCache;
  if ($(data['template']).size)
  cache.load(templateAddress,function() {
    newCache = cache.replaceWith(cache.contents());
    newCache.appendTo(data['parent']);
    if (callback) {
      callback();
    }
  });
}

function checkSkills() {
  var recSkills = $('#skills-section').find('.recommended-skills'),
      recSize   = recSkills.find('.skill').size();

  if (recSize > 0 && !recSkills.hasClass('visible')) { 
    var originalHeight = recSkills.height();
    recSkills
      .addClass('visible')
      .css('opacity',0)
      .css('height',0)
      .animate({'height':originalHeight},200, function(){
        $(this).css('height','auto');
      })
      .animate({'opacity':1},300); 
  }
  if (recSize < 1) { recSkills.removeClass('visible'); }
}

function skillFormat(str) {
  var oldStr = str.split('-'),
      newStr = [],
      tempStr,
      i,
      len;

  for (i = 0;i<oldStr.length;i++) {
    len = oldStr[i].length;
    tempStr = oldStr[i].substring(0,1).toUpperCase() + oldStr[i].substring(1,len);
    newStr.push(tempStr);
  }
  return newStr.join(' ');
}

function addSkill(obj) {
  var container   = $(obj['parent']),
      cache       = $('<div/>'),
      skill       = obj['skill'];

  if (skill.split('-').length <= 0) { 
    skill = skill.toLowerCase().split(' ').join('-'); 
  }
  if (container.find('.' + skill).size() < 1) { 
    
    cache.load('./templates/skill-button.html',function(){
      
      /* Going to make a better template function for this */
      /*cache.html(template({
        'template-data':cache,
        'template-items': { 
          'skill':skillTitle,'skillFormat':skillFormat(skill)
        }));*/
      cache.html(cache.html().replace(/{{skill}}/gi,skill));
      cache.html(cache.html().replace(/{{skillTitle}}/gi,skillFormat(skill)));
      cache.contents().prependTo(container);
      $('#skills-section .skill' + '.' + skill).on('click',function(){
        var skill = $(this).prependTo('#skills-box');
        checkSkills();
      });
      checkSkills();
      var skillsInput = $('#skills-box input');
      skillsInput.val('');
    });
  }
  $('#skills-search').removeClass('active');
}

$(function(){
  $('.help-container').each(function(){
    $(this).on('hover',function(){
      var menu = $(this).find('.help-menu'),
          menuPos  = menu.height() / 2,
          icon     = $(this).find('.icon.help'),
          iconH    = icon.height() + parseInt(icon.css('margin-top')) + parseInt(icon.css('margin-bottom')),
          arrow    = menu.find('.arrow');
      
      menu.css('top',(menuPos - (iconH/2))*-1);
      arrow.css('top',menuPos - (arrow.height() / 2));
      
    });
  });


  function template(data) { }
  


  function skillQuickScan(word) {
    var quickSkill = skills.join(' ');
    if (quickSkill.indexOf(word) >= 0) { return true }
    return false;
  }
  function skillScan(word) {
    var skillsNum,
        n,
        skillMatch=[];
    for (n = 0;n < skills.length; n++) {
      if (skills[n].indexOf(word) >= 0) {
        skillMatch.push(skills[n]);
        skillsNum++;
      }
    }
    return skillMatch;
  }

  function jobSkillScan(obj) {
    var n,
        skillMatch,
        array      = obj['array'],
        index          = obj['index'],
        skillsNum  = 0,
        word       = array[index].replace(/[^a-zA-Z 0-9]+/g,'').toLowerCase();
    
    if (skillQuickScan(word)) { // Check to see if there's a match
      var skillMatches = skillScan(word);

      if (skillMatches.length == 1) {
        var skill = skillMatches[0];

        // Check to see what percentage of the word matches the db
        var wordPercentage  = word.length / skill.length * 100,
            minPercentage   = 30; // If the word is 30% similar add the skill
        
        if (wordPercentage < minPercentage) { // Check if word before or after improves match
          wordPercentage = wordSkillCompare({'array':array,'index':index,'skill':skill});
        }
        if (wordPercentage >= minPercentage) { addSkill({'skill':skill,'parent':'#skills-section .recommended-skills .selection'}); }
      
      }
    }
  }
  
  function jobWordScan(el) {
    var content = el.val(),
        array = content.split(' ');

    for (var i = 0;i < array.length;i++) {
      if (array[i]) { 
        jobSkillScan({'array':array,'index':i});
      }
    }
  
  }

  function wordSkillCompare(obj) {
    var i         = obj['index'],
        arr       = obj['array'],
        before    = arr[i-1],
        word      = arr[i].toLowerCase(),
        after     = arr[i+1],
        skill     = obj['skill'],
        skillArr  = skill.split('-'),
        match,
        percentage=0;

    for (var n = 0;n < skillArr.length;n++) {
      if (word == skillArr[n]) {
        if (n >= 0 && arr[i-n]) { 
          match = arr[i-n].toLowerCase() + '-' + skillArr[n]; 
        }
        if (n <= 0 && arr[i+n]) { 
          match = skillArr[n] + '-' + arr[i+n].toLowerCase(); 
        } 
        if (match && skill.indexOf(match) >= 0) { 
          percentage = (match.length / skill.length) * 100; 
        }
      }
    }
    return percentage;
  }

  function getSkills(el) {
    /* Temporary */
    /* 
    1.  Send the whole chunk of the input,
        return an array of matching skills

    var skills = getSkillArray(el);
    
    3.  Check skills box for skills that don't exist
    
    filterSkillsBox(skills);
    
    4.  Add the missing skills to the skills box
    
    skillsFill(skills)
    
    */
    jobWordScan(el);
  }

  $('#job-description').on('keyup',function(e){
    
    /* Wait until spacebar is pressed */

    if (e.which == 32 || e.which == 13 || e.which == 8) {
      getSkills($(this))
    }

  });

});