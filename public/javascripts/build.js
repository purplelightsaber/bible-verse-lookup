var Lookup = (function () {
  'use strict';

  var flatmap = function(arr, iter, context) {
    var results = [];
    if (!Array.isArray(arr)) return results;
    arr.forEach(function(value, index, list) {
      var res = iter.call(context, value, index, list);
      if (Array.isArray(res)) {
        results.push.apply(results, res);
      } else if (res != null) {
        results.push(res);
      }
    });
    return results;
  };

  var regexSource = regex => regex instanceof RegExp ? regex.source : regex;

  const closingCharacters = {
  	'(': ')',
  	'[': ']',
  };

  var isAtomic = function isAtomic(regex) {
  	const string = regexSource(regex);

  	return /^\w$/.test(string) || enclosedByTopLevelCharacters(string)
  };

  function enclosedByTopLevelCharacters(string) {
  	const openingCharacter = string[0];
  	const closingCharacter = closingCharacters[openingCharacter];


  	const closedByAppropriateCharacter = closingCharacter !== undefined
  		&& string[string.length - 1] === closingCharacter;


  	if (!closedByAppropriateCharacter) {
  		return false
  	}

  	return !isClosedBeforeEndOfString(0, string, openingCharacter, closingCharacter)
  }


  function isClosedBeforeEndOfString(depth, string, openingCharacter, closingCharacter) {
  	if (string.length === 1 && string[0] === closingCharacter && depth === 1) {
  		return false
  	}
  	const [ nextCharacter, ...restOfCharacters ] = string;
  	const newDepth = calculateNewDepth(depth, openingCharacter, closingCharacter, nextCharacter);

  	if (newDepth === 0) {
  		return true
  	}

  	return isClosedBeforeEndOfString(newDepth, restOfCharacters, openingCharacter, closingCharacter)
  }

  function calculateNewDepth(previousDepth, openingCharacter, closingCharacter, character) {
  	if (character === openingCharacter) {
  		return previousDepth + 1
  	} else if (character === closingCharacter) {
  		return previousDepth - 1
  	} else {
  		return previousDepth
  	}
  }

  const combine = returnsRegex((...args) => escapeInputForCombining(...args).join(''));
  const guaranteeAtomic = regex => isAtomic(regex) ? regex : `(?:${regexSource(regex)})`;
  const escapeRegex = str => str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
  const ifRegex = (input, ifCase, elseIfCase) => input instanceof RegExp ? ifCase(input) : elseIfCase(input);
  const escapeInputAndReturnString = regex => ifRegex(regex, regex => regex.source, escapeRegex);

  var regexFun = {
  	combine,
  	either: makeJoiningFunction('(?:', '|', ')'),
  	capture: makeJoiningFunction('(', '', ')'),

  	flags: (flags, ...args) => new RegExp(combine(...args).source, flags),

  	anyNumber: suffix('*'),
  	oneOrMore: suffix('+'),
  	optional: suffix('?'),
  	exactly: (n, ...regexes) => suffix(`{${n}}`)(...regexes),
  	atLeast: (n, ...regexes) => suffix(`{${n},}`)(...regexes),
  	between: (n, m, ...regexes) => suffix(`{${n},${m}}`)(...regexes),

  	anyNumberNonGreedy: suffix('*?'),
  	oneOrMoreNonGreedy: suffix('+?'),
  	optionalNonGreedy: suffix('??'),
  	exactlyNonGreedy: (n, ...regexes) => suffix(`{${n}}?`)(...regexes),
  	atLeastNonGreedy: (n, ...regexes) => suffix(`{${n},}?`)(...regexes),
  	betweenNonGreedy: (n, m, ...regexes) => suffix(`{${n},${m}}?`)(...regexes),
  };

  function removeNonCapturingGroupIfExists(regexString) {
  	const match = /^\(\?:(.+)\)$/.exec(regexString);
  	return match ? match[1] : regexString
  }

  function guaranteeNoTopLevelOrs(regexString) {
  	return regexString.indexOf('|') >= 0 ? guaranteeAtomic(regexString) : regexString
  }

  function escapeInputForCombining(...args) {
  	return args.map(escapeInputAndReturnString).map(guaranteeNoTopLevelOrs)
  }

  function returnsRegex(fn) {
  	return (...args) => ifRegex(fn(...args), regex => regex, input => new RegExp(input))
  }

  function makeJoiningFunction(openingCharacter, joinCharacter, closingCharacter) {
  	return returnsRegex((...args) => {
  		const naiveBody = escapeInputForCombining(...args).join(joinCharacter);
  		const body = isAtomic(naiveBody) ? removeNonCapturingGroupIfExists(naiveBody) : naiveBody;

  		return concat(openingCharacter, body, closingCharacter)
  	})
  }

  function suffix(appendCharacter) {
  	return returnsRegex((...args) => concat(guaranteeAtomic(combine(...args)), appendCharacter))
  }

  function concat(...regexes) {
  	return regexes.map(regexSource).join('')
  }

  var index = [
  	{
  		"name": "Genesis",
  		"aliases": [
  			"Gen"
  		]
  	},
  	{
  		"name": "Exodus",
  		"aliases": [
  			"Exod",
  			"Ex",
  			"Exo"
  		]
  	},
  	{
  		"name": "Leviticus",
  		"aliases": [
  			"Lev"
  		]
  	},
  	{
  		"name": "Numbers",
  		"aliases": [
  			"Num"
  		]
  	},
  	{
  		"name": "Deuteronomy",
  		"aliases": [
  			"Deut"
  		]
  	},
  	{
  		"name": "Joshua",
  		"aliases": [
  			"Josh"
  		]
  	},
  	{
  		"name": "Judges",
  		"aliases": [
  			"Judg"
  		]
  	},
  	{
  		"name": "Ruth",
  		"aliases": []
  	},
  	{
  		"name": "1 Samuel",
  		"aliases": [
  			"1 Sam",
  			"1st Sam",
  			"1st Samuel"
  		]
  	},
  	{
  		"name": "2 Samuel",
  		"aliases": [
  			"2 Sam",
  			"2nd Sam",
  			"2nd Samuel"
  		]
  	},
  	{
  		"name": "1 Kings",
  		"aliases": [
  			"1 Kgs",
  			"1st Kgs",
  			"1st Kings"
  		]
  	},
  	{
  		"name": "2 Kings",
  		"aliases": [
  			"2 Kgs",
  			"2nd Kgs",
  			"2nd Kings"
  		]
  	},
  	{
  		"name": "1 Chronicles",
  		"aliases": [
  			"1 Chr",
  			"1st Chr",
  			"1st Chronicles"
  		]
  	},
  	{
  		"name": "2 Chronicles",
  		"aliases": [
  			"2 Chr",
  			"2nd Chr",
  			"2nd Chronicles"
  		]
  	},
  	{
  		"name": "Ezra",
  		"aliases": [
  			"Ezra"
  		]
  	},
  	{
  		"name": "Nehemiah",
  		"aliases": [
  			"Neh"
  		]
  	},
  	{
  		"name": "Esther",
  		"aliases": [
  			"Esth",
  			"Est"
  		]
  	},
  	{
  		"name": "Job",
  		"aliases": []
  	},
  	{
  		"name": "Psalms",
  		"aliases": [
  			"Ps",
  			"Psalm"
  		]
  	},
  	{
  		"name": "Proverbs",
  		"aliases": [
  			"Prov",
  			"Pro"
  		]
  	},
  	{
  		"name": "Ecclesiastes",
  		"aliases": [
  			"Eccl",
  			"Ecc"
  		]
  	},
  	{
  		"name": "Song of Solomon",
  		"aliases": [
  			"Song",
  			"Song of Songs"
  		]
  	},
  	{
  		"name": "Isaiah",
  		"aliases": [
  			"Isa"
  		]
  	},
  	{
  		"name": "Jeremiah",
  		"aliases": [
  			"Jer"
  		]
  	},
  	{
  		"name": "Lamentations",
  		"aliases": [
  			"Lam"
  		]
  	},
  	{
  		"name": "Ezekiel",
  		"aliases": [
  			"Ezek"
  		]
  	},
  	{
  		"name": "Daniel",
  		"aliases": [
  			"Dan"
  		]
  	},
  	{
  		"name": "Hosea",
  		"aliases": [
  			"Hos"
  		]
  	},
  	{
  		"name": "Joel",
  		"aliases": []
  	},
  	{
  		"name": "Amos",
  		"aliases": []
  	},
  	{
  		"name": "Obadiah",
  		"aliases": [
  			"Obad",
  			"Oba"
  		]
  	},
  	{
  		"name": "Jonah",
  		"aliases": [
  			"Jon"
  		]
  	},
  	{
  		"name": "Micah",
  		"aliases": [
  			"Mic"
  		]
  	},
  	{
  		"name": "Nahum",
  		"aliases": [
  			"Nah"
  		]
  	},
  	{
  		"name": "Habakkuk",
  		"aliases": [
  			"Hab"
  		]
  	},
  	{
  		"name": "Zephaniah",
  		"aliases": [
  			"Zeph"
  		]
  	},
  	{
  		"name": "Haggai",
  		"aliases": [
  			"Hag"
  		]
  	},
  	{
  		"name": "Zechariah",
  		"aliases": [
  			"Zech"
  		]
  	},
  	{
  		"name": "Malachi",
  		"aliases": [
  			"Mal"
  		]
  	},
  	{
  		"name": "Matthew",
  		"aliases": [
  			"Matt"
  		]
  	},
  	{
  		"name": "Mark",
  		"aliases": []
  	},
  	{
  		"name": "Luke",
  		"aliases": []
  	},
  	{
  		"name": "John",
  		"aliases": []
  	},
  	{
  		"name": "Acts",
  		"aliases": []
  	},
  	{
  		"name": "Romans",
  		"aliases": [
  			"Rom"
  		]
  	},
  	{
  		"name": "1 Corinthians",
  		"aliases": [
  			"1 Cor",
  			"1st Cor",
  			"1st Corinthians"
  		]
  	},
  	{
  		"name": "2 Corinthians",
  		"aliases": [
  			"2 Cor",
  			"2nd Cor",
  			"2nd Corinthians"
  		]
  	},
  	{
  		"name": "Galatians",
  		"aliases": [
  			"Gal"
  		]
  	},
  	{
  		"name": "Ephesians",
  		"aliases": [
  			"Eph"
  		]
  	},
  	{
  		"name": "Philippians",
  		"aliases": [
  			"Phil"
  		]
  	},
  	{
  		"name": "Colossians",
  		"aliases": [
  			"Col"
  		]
  	},
  	{
  		"name": "1 Thessalonians",
  		"aliases": [
  			"1 Thess",
  			"1st Thess",
  			"1st Thessalonians"
  		]
  	},
  	{
  		"name": "2 Thessalonians",
  		"aliases": [
  			"2 Thess",
  			"2nd Thess",
  			"2nd Thessalonians"
  		]
  	},
  	{
  		"name": "1 Timothy",
  		"aliases": [
  			"1 Tim",
  			"1st Tim",
  			"1st Timothy"
  		]
  	},
  	{
  		"name": "2 Timothy",
  		"aliases": [
  			"2 Tim",
  			"2nd Tim",
  			"2nd Timothy"
  		]
  	},
  	{
  		"name": "Titus",
  		"aliases": []
  	},
  	{
  		"name": "Philemon",
  		"aliases": [
  			"Phlm"
  		]
  	},
  	{
  		"name": "Hebrews",
  		"aliases": [
  			"Heb"
  		]
  	},
  	{
  		"name": "James",
  		"aliases": [
  			"Jas"
  		]
  	},
  	{
  		"name": "1 Peter",
  		"aliases": [
  			"1 Pet",
  			"1st Pet",
  			"1st Peter"
  		]
  	},
  	{
  		"name": "2 Peter",
  		"aliases": [
  			"2 Pet",
  			"2nd Pet",
  			"2nd Peter"
  		]
  	},
  	{
  		"name": "1 John",
  		"aliases": [
  			"1st John"
  		]
  	},
  	{
  		"name": "2 John",
  		"aliases": [
  			"2nd John"
  		]
  	},
  	{
  		"name": "3 John",
  		"aliases": [
  			"3rd John"
  		]
  	},
  	{
  		"name": "Jude",
  		"aliases": []
  	},
  	{
  		"name": "Revelation",
  		"aliases": [
  			"Rev"
  		]
  	}
  ]
  ;

  var booksOfTheBible = /*#__PURE__*/Object.freeze({
    default: index
  });

  const {
  	combine: combine$1,
  	flags,
  	either,
  	optional,
  } = regexFun;

  var createChapterVerseRangeRegex = function createChapterVerseRangeRegex({
  	requireVerse = false,
  	flags: regexFlags = 'i',
  } = {}) {
  	const number = /(\d+)/;
  	const numberAndOptionalLetter = /(\d+)([a-z])?/;
  	const colonVerse = combine$1(':', numberAndOptionalLetter);
  	const chapterAndVerse = combine$1(number, requireVerse ? colonVerse : optional(colonVerse));

  	const secondHalfOfRange = combine$1('-', either(/([a-z])/, /(\d+)([a-z])/, chapterAndVerse, numberAndOptionalLetter));

  	return flags(regexFlags, chapterAndVerse, optional(secondHalfOfRange))
  };

  var canonBooks = ( booksOfTheBible && index ) || booksOfTheBible;

  const {
  	either: either$1,
  	capture,
  	flags: flags$1,
  } = regexFun;





  var createRegex = function createRegex({
  	requireVerse = false,
  	flags: regexFlags = 'i',
  	books = canonBooks,
  } = {}) {
  	const bookNames = books.map(({ name }) => name);
  	const abbreviations = flatmap(books, ({ aliases }) => {
  		return flatmap(aliases, alias => [ alias, alias + '.' ])
  	});

  	const range = createChapterVerseRangeRegex({ requireVerse, flags: regexFlags });

  	return flags$1(
  		regexFlags,
  		capture(either$1(...bookNames, ...abbreviations)),
  		' ',
  		range
  	)
  };

  const mapOfAliasesToCanonBookNames = makeMapOfAliases(canonBooks);

  const valueOr = (value, defaultValue) => value === undefined
  	? evaluate(defaultValue)
  	: value;
  const ifelse = (predicate, truthyCase, falsyCase) => evaluate(predicate)
  	? evaluate(truthyCase)
  	: evaluate(falsyCase);

  const valueOrNull = value => valueOr(value, null);
  const evaluate = value => typeof value === 'function' ? value() : value;
  const int = value => value === null ? value : parseInt(value, 10);
  const stripPeriod = str => str[str.length - 1] === '.' ? str.substr(0, str.length - 1) : str;
  const isSection = str => /[a-z]/.test(str);


  var extractRangeFromMatch_1 = extractRangeFromMatch;

  function extractRangeFromMatch(match, books) {
  	const mapOfAliasesToBookNames = books ? makeMapOfAliases(books) : mapOfAliasesToCanonBookNames;
  	const [ , matchBook, matchStartChapter, matchStartVerse, matchStartSection, ...matchTail ] = match;
  	const rangeEndValues = matchTail.filter(value => value !== undefined);

  	const start = {
  		chapter: int(valueOrNull(matchStartChapter)),
  		verse: int(valueOrNull(matchStartVerse)),
  		section: valueOrNull(matchStartSection),
  	};

  	const end = ifelse(rangeEndValues.length === 3, () => {
  		const [ chapter, verse, section ] = rangeEndValues;
  		return {
  			chapter: int(chapter),
  			verse: int(verse),
  			section: valueOrNull(section),
  		}
  	}, () => {
  		const { numbers, section } = separateSectionFromNumbers(rangeEndValues);

  		if (numbers.length === 2) {
  			const [ chapter, verse ] = numbers;
  			return {
  				chapter,
  				verse,
  				section,
  			}
  		} else if (numbers.length === 1) {
  			const rangeIsChapter = start.verse === null;

  			return rangeIsChapter ? {
  				chapter: numbers[0],
  				verse: null,
  				section,
  			} : {
  				chapter: start.chapter,
  				verse: numbers[0],
  				section,
  			}
  		} else {
  			return {
  				chapter: start.chapter,
  				verse: start.verse,
  				section: section || start.section,
  			}
  		}
  	});

  	return {
  		book: mapOfAliasesToBookNames[stripPeriod(matchBook).toLowerCase()].name,
  		start,
  		end,
  	}
  }

  var chapterVerseRange = match => {
  	const [ , ...rest ] = match;
  	const books = [{
  		name: '',
  		aliases: [],
  	}];
  	return Object.assign(
  		extractRangeFromMatch([ null, '', ...rest ], books),
  		{ book: null }
  	)
  };


  function separateSectionFromNumbers(ary) {
  	const lastValue = ary[ary.length - 1];

  	if (ary.length > 0 && isSection(lastValue)) {
  		return {
  			numbers: ary.slice(0, ary.length - 1).map(int),
  			section: lastValue,
  		}
  	} else {
  		return {
  			numbers: ary.map(int),
  			section: null,
  		}
  	}
  }

  function makeMapOfAliases(books) {
  	return books.reduce((map, book) => {
  		map[book.name.toLowerCase()] = book;
  		book.aliases.forEach(alias => map[alias.toLowerCase()] = book);
  		return map
  	}, Object.create(null))
  }
  extractRangeFromMatch_1.chapterVerseRange = chapterVerseRange;



  var index_es6 = /*#__PURE__*/Object.freeze({
    createRegex: createRegex,
    extractRangeFromMatch: extractRangeFromMatch_1,
    createChapterVerseRangeRegex: createChapterVerseRangeRegex
  });

  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;
  window.onload = function() {
    document.getElementById('listen').addEventListener('click', startButton);
  };

  // function updateWordPronunciation() {
  //     //{ verseID: { "difficultWord" : "whatIsaid" }, }
  //     var whatIsaid = interim_span.innerHTML.trim();
  //     if (whatIsaid != "") {
  //         var difficultWord = verses.text[current_word_index].value;
  //         //var myPronunciation = {};
  //         //myPronunciation[difficultWord] = whatIsaid;
  //         if (!pronunciation[verses.verseID]) {
  //             pronunciation[verses.verseID] = {};
  //         }
  //         pronunciation[verses.verseID][difficultWord] = whatIsaid;
  //     }
  // }

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
      //inputText = document.getElementById("inputArea").value.toLowerCase();
      
      
      recognizing = true;
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) ;
        ignore_onend = true;
      }
    };

    recognition.onend = function() {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      if (!final_transcript) {
        return;
      }
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
    };

     recognition.onresult = function(event) {
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
      
    const verseRequiringRegex = index_es6.createRegex();
    const verseReference = final_transcript.match(verseRequiringRegex);
    if (verseReference) {
      displayVerse(verseReference);
    }

  //to verse display
          //current_word_index = outputIfMatches(final_transcript.split(' '), current_word_index);
    };

  }

  function displayVerse(verseReference) {

    let inputVerse = verseReference[0];
    let split = inputVerse.split(/(?:\s|:)/);
    let _verseID = split.pop();
    let _chapterID = split.pop();
    let _bookID = split.join('');
    let _versionID = 'esv';
    let verse1 = {verseID: _verseID, chapterID: _chapterID, bookID: _bookID, versionID: _versionID, action: 'new'};

    $.post( "/", verse1, function( data ) {
      $('#verse').html(data.text);
    });
  }
  //-------------------------END Recognition Processing-------------------------//

  function upgrade() {
    start_button.style.visibility = 'hidden';

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
    //recognition.lang = select_dialect.value;
    recognition.lang = 6;
    recognition.start();
    ignore_onend = false;
    start_timestamp = event.timeStamp;
  }

  var client = {

  };

  return client;

}());
