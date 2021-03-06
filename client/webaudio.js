const vrr = require('verse-reference-regex');
var final_transcript = '';
var ignore_onend;
var start_timestamp;    
var recognition;
var verseCache;
function recognize() {
    //-------------------------BEGIN Speech Recognition-------------------------//
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        //start_button.style.display = 'inline-block';
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
    
        recognition.onstart = function() {
        //lower input area's text is stored in inputText var
        //inputText = document.getElementById("inputArea").value.toLowerCase();
        
        
        //showInfo('info_speak_now');
        };
    
        recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            //showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            //showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
            //showInfo('info_blocked');
            } else {
            //showInfo('info_denied');
            }
            ignore_onend = true;
        }
        };
    
        recognition.onend = function() {
            if ($('#listen').hasClass('listening')) {
                return;
            }
            updateMonitor('killing it');
            if (ignore_onend) {
                return;
            }
            if (!final_transcript) {
                //showInfo('info_start');
                return;
            }
            //showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                //range.selectNode(document.getElementById('final_span'));
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
        
        $('#what_is_being_said').text(linebreak(transcript));
        const verseRequiringRegex = vrr.createRegex();
        const verseReference = final_transcript.match(verseRequiringRegex);
        if (verseReference) {
            getVerse(verseReference);
        }
        };
    
    }

}
function linebreak(s) {
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

  function getVerse(verseReference) {
    let inputVerse = verseReference[0];
    let split = inputVerse.split(/(?:\s|:)/);
    let _verseID = split.pop();
    let _chapterID = split.pop();
    let _bookID = split.join('');
    let _versionID = 'esv';
    let verseObj = {verseID: _verseID, chapterID: _chapterID, bookID: _bookID, 
                    versionID: _versionID, action: 'new', reference: inputVerse, text: ''};
    if (!verseCache) {
        verseCache = [];
    }
    const cachedVerse = verseInCache(verseObj);
    updateMonitor(' -results- ');
    if (!cachedVerse) {
        verseCache.push(verseObj);
        updateMonitor(' -call- ');
        $.post( "/", verseObj, function( data ) {
            updateMonitor(' -display- ');
            displayVerse(data);
            updateCache(data);
        });
    } else if (cachedVerse.text != '') {
        displayVerse(cachedVerse);
    }
  }

  function verseInCache(verseObj) {
    let cachedVerse;
    verseCache.forEach(element => {
        if (verseObj.reference.toLowerCase() == element.reference.toLowerCase()) {
            cachedVerse = element;
        }
    });
    return cachedVerse;
  }

  function updateCache(verseObj) {
    verseCache.forEach(element => {
        if (verseObj.reference.toLowerCase() == element.reference.toLowerCase()) {
            element.text = verseObj.text;
        }
    });
  }

  function displayVerse(data) {
    $('#verse').html(data.text);
    $('#reference').html(data.reference);
  }

  function updateMonitor(text) {
    $('#monitor').html($('#monitor')[0].textContent + text);
  }
  //-------------------------END Speech Recognition-------------------------//
  
  function showInfo(s) {
    $('#verse').html(s);//here temporarily
    // if (s) {
    //   for (var child = info.firstChild; child; child = child.nextSibling) {
    //     if (child.style) {
    //       child.style.display = child.id == s ? 'inline' : 'none';
    //     }
    //   }
    //   info.style.visibility = 'visible';
    // } else {
    //   info.style.visibility = 'hidden';
    // }
  }
  //-------------------------END Recognition Processing-------------------------//
  
  function upgrade() {
    // start_button.style.visibility = 'hidden';
     showInfo('info_upgrade');
  
    // if (start_button.style.visibility == 'false') {
    //   startButton(true);
    // }
  }
  
  function startButton(event) {
    if ($('#listen').hasClass('listening')) {
      stopListening();
      return;
    }
    startListening(event);
    //showInfo('info_allow');
  }

  function stopListening() {
    $('#listen').removeClass('listening');
    $('#listen').text('Listen');
    recognition.stop();
  }

  function startListening() {
    $('#listen').addClass('listening');
    $('#listen').text('Stop Listening');
    final_transcript = '';
    recognition.lang = 6;
    recognition.start();
    ignore_onend = false;
    start_timestamp = event.timeStamp;
  }

// //-------------------------BEGIN Languages-------------------------//
// var langs =
// [['Afrikaans',       ['af-ZA']],
//  ['Bahasa Indonesia',['id-ID']],
//  ['Bahasa Melayu',   ['ms-MY']],
//  ['Català',          ['ca-ES']],
//  ['Čeština',         ['cs-CZ']],
//  ['Deutsch',         ['de-DE']],
//  ['English',         ['en-AU', 'Australia'],
//                      ['en-CA', 'Canada'],
//                      ['en-IN', 'India'],
//                      ['en-NZ', 'New Zealand'],
//                      ['en-ZA', 'South Africa'],
//                      ['en-GB', 'United Kingdom'],
//                       ['en-US', 'United States']],
//  ['Español',         ['es-AR', 'Argentina'],
//                      ['es-BO', 'Bolivia'],
//                      ['es-CL', 'Chile'],
//                      ['es-CO', 'Colombia'],
//                      ['es-CR', 'Costa Rica'],
//                      ['es-EC', 'Ecuador'],
//                      ['es-SV', 'El Salvador'],
//                      ['es-ES', 'España'],
//                      ['es-US', 'Estados Unidos'],
//                      ['es-GT', 'Guatemala'],
//                      ['es-HN', 'Honduras'],
//                      ['es-MX', 'México'],
//                      ['es-NI', 'Nicaragua'],
//                      ['es-PA', 'Panamá'],
//                      ['es-PY', 'Paraguay'],
//                      ['es-PE', 'Perú'],
//                      ['es-PR', 'Puerto Rico'],
//                      ['es-DO', 'República Dominicana'],
//                      ['es-UY', 'Uruguay'],
//                      ['es-VE', 'Venezuela']],
//  ['Euskara',         ['eu-ES']],
//  ['Français',        ['fr-FR']],
//  ['Galego',          ['gl-ES']],
//  ['Hrvatski',        ['hr_HR']],
//  ['IsiZulu',         ['zu-ZA']],
//  ['Íslenska',        ['is-IS']],
//  ['Italiano',        ['it-IT', 'Italia'],
//                      ['it-CH', 'Svizzera']],
//  ['Magyar',          ['hu-HU']],
//  ['Nederlands',      ['nl-NL']],
//  ['Norsk bokmål',    ['nb-NO']],
//  ['Polski',          ['pl-PL']],
//  ['Português',       ['pt-BR', 'Brasil'],
//                      ['pt-PT', 'Portugal']],
//  ['Română',          ['ro-RO']],
//  ['Slovenčina',      ['sk-SK']],
//  ['Suomi',           ['fi-FI']],
//  ['Svenska',         ['sv-SE']],
//  ['Türkçe',          ['tr-TR']],
//  ['български',       ['bg-BG']],
//  ['Pусский',         ['ru-RU']],
//  ['Српски',          ['sr-RS']],
//  ['한국어',            ['ko-KR']],
//  ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
//                      ['cmn-Hans-HK', '普通话 (香港)'],
//                      ['cmn-Hant-TW', '中文 (台灣)'],
//                      ['yue-Hant-HK', '粵語 (香港)']],
//  ['日本語',           ['ja-JP']],
//  ['Lingua latīna',   ['la']]];

// for (var i = 0; i < langs.length; i++) {
//   select_language.options[i] = new Option(langs[i][0], i);
// }
// select_language.selectedIndex = 6;
// updateCountry();
// select_dialect.selectedIndex = 6;
// showInfo('info_start');

// function updateCountry() {
//   for (var i = select_dialect.options.length - 1; i >= 0; i--) {
//     select_dialect.remove(i);
//   }
//   var list = langs[select_language.selectedIndex];
//   for (var i = 1; i < list.length; i++) {
//     select_dialect.options.add(new Option(list[i][1], list[i][0]));
//   }
//   select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
// }
// //-------------------------END Languages-------------------------//


module.exports = {
    startButton,
    recognize
};