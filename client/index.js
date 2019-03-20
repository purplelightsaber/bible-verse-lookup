const webaudio = require('.././client/webaudio');

window.onload = function() {
  webaudio.recognize();
  document.getElementById('listen').addEventListener('click', webaudio.startButton);

  let verse2 = {verseID: 1, chapterID: 1, bookID: 'Genesis', versionID: 'ESV', action: 'new'};
  $.post( "/", verse2, function( data ) {
    $('#verse').html(data.text);
  });
};

window.onerror = function(message, url, lineNumber) {  
  $('#verse').html(message + ' url: ' + url + ' lineNumber: ' + lineNumber);
  return false;
};  

