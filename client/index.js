const vrr = require('verse-reference-regex');

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var updatedResult = '';
var alreadyBegun = false;
var inputText;
var verses = {text:""};
var current_word_index = 0;
var _stats = {incorrectwords: []};
var pronunciation = {};
window.onload = function() {
let verse1 = {verseID: 1, chapterID: 1, bookID: 'Genesis', versionID: 'ESV', action: 'new'};

  $.post( "/", verse1, function( data ) {
    $('#verse').html(data.text);
  });

};

//-------------------------BEGIN Select Verse-------------------------//

function populateVerse(action) {
    if (action == 'previous' || action == 'next') {
        verse = verses;
    } else if (action == 'new') {
        let inputVerse = $('#input_verse_id').val();
        let split = inputVerse.split(/(?:\s|:)/);
        let _verseID = split.pop();
        let _chapterID = split.pop();
        let _bookID = split.join('');
        let _versionID = 'esv';
        verse = {verseID: _verseID, chapterID: _chapterID, bookID: _bookID, versionID: _versionID};
    } else if (action == 'current') {
        hideAllWords();
    }
    current_word_index = 0;
    doSomethin(verse, action, _stats);
}

function doSomethin(verse, action, stats) {
    Cloud.getVerse.with({verse: verse, action: action, stats: stats }).then(function(result) {
        alert('You can click "start" to start speaking.');
        //Wipe display
        $('#verse_display').empty();
        setVerse(result);
    });
}

function setVerse(v) {
    $('#inputArea').val(v.text);
    $('#input_verse_id').val(v.bookID + ' ' + v.chapterID + ':' + v.verseID);
    verses = v;
    populateSpans();
    _stats.incorrectwords = [];
}

function updateWordPronunciation() {
    //{ verseID: { "difficultWord" : "whatIsaid" }, }
    var whatIsaid = interim_span.innerHTML.trim();
    if (whatIsaid != "") {
        var difficultWord = verses.text[current_word_index].value;
        //var myPronunciation = {};
        //myPronunciation[difficultWord] = whatIsaid;
        if (!pronunciation[verses.verseID]) {
            pronunciation[verses.verseID] = {};
        }
        pronunciation[verses.verseID][difficultWord] = whatIsaid;
    }
}

//-------------------------END Select Verse-------------------------//


//-------------------------BEGIN Speech Recognition-------------------------//
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  //start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    //lower input area's text is stored in inputText var
    inputText = document.getElementById("inputArea").value.toLowerCase();
    
    
    recognizing = true;
    showInfo('info_speak_now');
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

   recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
     
    var transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
        transcript = event.results[i][0].transcript.toLowerCase();
      } else {
        transcript = event.results[i][0].transcript.toLowerCase();
      }
    }
    
  const verseRequiringRegex = vrr.createRegex();
  const verseReference = final_transcript.match(verseRequiringRegex);
  if (verseReference) {
    displayVerse(verseReference);
  }

//to verse display
        current_word_index = outputIfMatches(final_transcript.split(' '), current_word_index);
  };

}
//-------------------------END Speech Recognition-------------------------//

//-------------------------BEGIN Recognition Processing-------------------------//


function outputIfMatches(result_word_array, current_word_indx) {
//    for (var i = 0; i < result_word_array.length; i++) {
//        if (current_word_indx != verses.text.length) {
//            if (result_word_array[i].toLocaleLowerCase() == verses.text[current_word_indx].toLocalLowerCase()) {
//              //reveals the hidden html span with the id of 'i'
//              displayWordMatch(current_word_indx, 'correct');
//            } else {
//                //word didn't match, try next one
//              displayWordMatch(current_word_indx, 'incorrect');
//              stats.incorrectwords.push(verses.text[current_word_indx]);
//            }
//            current_word_indx++;
//        }
//      }
//    return current_word_indx;
    for (var i = 0; i < result_word_array.length; i++) {
        if (result_word_array[i].toLocaleLowerCase() == verses.text[current_word_indx].value) {
            displayWordMatch(current_word_indx, 'correct');
            current_word_indx++;
        } else if (pronunciation[verses.verseID]) {
            if (pronunciation[verses.verseID][verses.text[current_word_indx].value]) {
                if (result_word_array[i].toLocaleLowerCase() == pronunciation[verses.verseID][verses.text[current_word_indx].value]) {
                    displayWordMatch(current_word_indx, 'correct');
                    current_word_indx++;   
                }      
            }        
        }
    }
    return current_word_indx;
    }

function displayWordMatch(i, accurateString) {
  document.getElementById("word" + i).style.visibility = 'visible';
  document.getElementById("word" + i).classList.add(accurateString);
  if (allWordsVisible()) {
      alert("Congratulations!");
  };
}

function showNextWord() {
    //Yes this presents a race condition, can put in locking or something like that in the future.
	displayWordMatch(current_word_index, 'correct');
	current_word_index++;
}

function allWordsVisible() {
    for (i=0; i < verses.text.length; i++) {
        if ($('#word' + i).css('visibility') == 'hidden') {
            return false;
        }
    }
    return true;
}

function hideAllWords() {
    for (i=0; i < verses.text.length; i++) {
        $('#word' + i).css('visibility', 'hidden');
    }
    return true;
}

function populateSpans() {
        for (i=0; i < verses.text.length; i++) {
        var newSpan = document.createElement('span');   
        $(newSpan).css('visibility', 'hidden');
        newSpan.id = ('word' + i);
        var newContent = document.createTextNode(verses.text[i].text);  
        newSpan.appendChild(newContent); 
    
        var spaceSpan = document.createElement('span');
        var space = document.createTextNode(' ');
        spaceSpan.appendChild(space);
    
        var currentDiv = document.getElementById('verse_display'); 
        currentDiv.appendChild(newSpan);
        currentDiv.appendChild(spaceSpan);
    }
}


function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}
//-------------------------END Recognition Processing-------------------------//

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');

  if (start_button.style.visibility == 'false') {
    startButton(true);
  }
}

function startButton(event) {
  if (recognizing) {
    $('.fa-microphone').removeClass('recording');
    recognition.stop();
    return;
  }
  $('.fa-microphone').addClass('recording');
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  showInfo('info_allow');
  start_timestamp = event.timeStamp;
}
