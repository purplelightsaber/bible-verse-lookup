var express = require('express');
var helpers = require('../business/helpers');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', function(req, res, next) {

  //This is repeated code, create an npm package?
  //put into function of some sort and change the inputs/outputs.

  let options = {};
  let data = [
    {
      "id": "GEN",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Gen",
      "name": "Genesis",
      "nameLong": "The First Book of Moses, Commonly Called Genesis"
    },
    {
      "id": "EXO",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Exo",
      "name": "Exodus",
      "nameLong": "The Second Book of Mosis, Commonly Called Exodus"
    },
    {
      "id": "LEV",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Lev",
      "name": "Leviticus",
      "nameLong": "The Third Book of Mosis, Commonly Called Leviticus"
    },
    {
      "id": "NUM",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Num",
      "name": "Numbers",
      "nameLong": "The Fourth Book of Moses, Commonly Called Numbers"
    },
    {
      "id": "DEU",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Deu",
      "name": "Deuteronomy",
      "nameLong": "The Fifth Book of Moses, Commonly Called Deuteronomy"
    },
    {
      "id": "JOS",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jos",
      "name": "Joshua",
      "nameLong": "The Book of Joshua"
    },
    {
      "id": "JDG",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jdg",
      "name": "Judges",
      "nameLong": "The Book of Judges"
    },
    {
      "id": "RUT",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Rut",
      "name": "Ruth",
      "nameLong": "The Book of Ruth"
    },
    {
      "id": "1SA",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Sa",
      "name": "1 Samuel",
      "nameLong": "The First Book of Samuel"
    },
    {
      "id": "2SA",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Sa",
      "name": "2 Samuel",
      "nameLong": "The Second Book of Samuel"
    },
    {
      "id": "1KI",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Ki",
      "name": "1 Kings",
      "nameLong": "The First Book of Kings"
    },
    {
      "id": "2KI",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Ki",
      "name": "2 Kings",
      "nameLong": "The Second Book of Kings"
    },
    {
      "id": "1CH",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Ch",
      "name": "1 Chronicles",
      "nameLong": "The First Book of Chronicles"
    },
    {
      "id": "2CH",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Ch",
      "name": "2 Chronicles",
      "nameLong": "The Second Book of Chronicles"
    },
    {
      "id": "EZR",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Ezr",
      "name": "Ezra",
      "nameLong": "The Book of Ezra"
    },
    {
      "id": "NEH",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Neh",
      "name": "Nehemiah",
      "nameLong": "The Book of Nehemiah"
    },
    {
      "id": "EST",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Est",
      "name": "Esther",
      "nameLong": "The Book of Esther"
    },
    {
      "id": "JOB",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Job",
      "name": "Job",
      "nameLong": "The Book of Job"
    },
    {
      "id": "PSA",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Psa",
      "name": "Psalms",
      "nameLong": "The Psalms"
    },
    {
      "id": "PRO",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Pro",
      "name": "Proverbs",
      "nameLong": "The Proverbs"
    },
    {
      "id": "ECC",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Ecc",
      "name": "Ecclesiastes",
      "nameLong": "Ecclesiates or, The Preacher"
    },
    {
      "id": "SNG",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Sng",
      "name": "Song of Solomon",
      "nameLong": "The Song of Solomon"
    },
    {
      "id": "ISA",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Isa",
      "name": "Isaiah",
      "nameLong": "The Book of Isaiah"
    },
    {
      "id": "JER",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jer",
      "name": "Jeremiah",
      "nameLong": "The Book of Jeremiah"
    },
    {
      "id": "LAM",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Lam",
      "name": "Lamentations",
      "nameLong": "The Lamentations of Jeremiah"
    },
    {
      "id": "EZK",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Ezk",
      "name": "Ezekiel",
      "nameLong": "The Book of Ezekiel"
    },
    {
      "id": "DAN",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Dan",
      "name": "Daniel",
      "nameLong": "The Book of Daniel"
    },
    {
      "id": "HOS",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Hos",
      "name": "Hosea",
      "nameLong": "The Book of Hosea"
    },
    {
      "id": "JOL",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jol",
      "name": "Joel",
      "nameLong": "The Book of Joel"
    },
    {
      "id": "AMO",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Amo",
      "name": "Amos",
      "nameLong": "The Book of Amos"
    },
    {
      "id": "OBA",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Oba",
      "name": "Obadiah",
      "nameLong": "The Book of Obadiah"
    },
    {
      "id": "JON",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jon",
      "name": "Jonah",
      "nameLong": "The Book of Jonah"
    },
    {
      "id": "MIC",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Mic",
      "name": "Micah",
      "nameLong": "The Book of Micah"
    },
    {
      "id": "NAM",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Nam",
      "name": "Nahum",
      "nameLong": "The Book of Nahum"
    },
    {
      "id": "HAB",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Hab",
      "name": "Habakkuk",
      "nameLong": "The Book of Habakkuk"
    },
    {
      "id": "ZEP",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Zep",
      "name": "Zephaniah",
      "nameLong": "The Book of Zephaniah"
    },
    {
      "id": "HAG",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Hag",
      "name": "Haggai",
      "nameLong": "The Book of Haggai"
    },
    {
      "id": "ZEC",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Zec",
      "name": "Zechariah",
      "nameLong": "The Book of Zechariah"
    },
    {
      "id": "MAL",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Mal",
      "name": "Malachi",
      "nameLong": "The Book of Malachi"
    },
    {
      "id": "MAT",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Mat",
      "name": "Matthew",
      "nameLong": "The Good News According to Matthew"
    },
    {
      "id": "MRK",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Mrk",
      "name": "Mark",
      "nameLong": "The Good News According to Mark"
    },
    {
      "id": "LUK",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Luk",
      "name": "Luke",
      "nameLong": "The Good News According to Luke"
    },
    {
      "id": "JHN",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jhn",
      "name": "John",
      "nameLong": "The Good News According to John"
    },
    {
      "id": "ACT",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Act",
      "name": "Acts",
      "nameLong": "The Acts of the Apostles"
    },
    {
      "id": "ROM",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Rom",
      "name": "Romans",
      "nameLong": "Paul’s Letter to the Romans"
    },
    {
      "id": "1CO",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Co",
      "name": "1 Corinthians",
      "nameLong": "Paul’s First Letter to the Corinthians"
    },
    {
      "id": "2CO",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Co",
      "name": "2 Corinthians",
      "nameLong": "Paul’s Second Letter to the Corinthians"
    },
    {
      "id": "GAL",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Gal",
      "name": "Galatians",
      "nameLong": "Paul’s Letter to the Galatians"
    },
    {
      "id": "EPH",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Eph",
      "name": "Ephesians",
      "nameLong": "Paul’s Letter to the Ephesians"
    },
    {
      "id": "PHP",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Php",
      "name": "Philippians",
      "nameLong": "Paul’s Letter to the Philippians"
    },
    {
      "id": "COL",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Col",
      "name": "Colossians",
      "nameLong": "Paul’s Letter to the Colossians"
    },
    {
      "id": "1TH",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Th",
      "name": "1 Thessalonians",
      "nameLong": "Paul’s First Letter to the Thessalonians"
    },
    {
      "id": "2TH",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Th",
      "name": "2 Thessalonians",
      "nameLong": "Paul’s Second Letter to the Thessalonians"
    },
    {
      "id": "1TI",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Ti",
      "name": "1 Timothy",
      "nameLong": "Paul’s First Letter to Timothy"
    },
    {
      "id": "2TI",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Ti",
      "name": "2 Timothy",
      "nameLong": "Paul’s Second Letter to Timothy"
    },
    {
      "id": "TIT",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Tit",
      "name": "Titus",
      "nameLong": "Paul’s Letter to Titus"
    },
    {
      "id": "PHM",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Phm",
      "name": "Philemon",
      "nameLong": "Paul’s Letter to Philemon"
    },
    {
      "id": "HEB",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Heb",
      "name": "Hebrews",
      "nameLong": "The Letter to the Hebrews"
    },
    {
      "id": "JAS",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jas",
      "name": "James",
      "nameLong": "The Letter from James"
    },
    {
      "id": "1PE",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Pe",
      "name": "1 Peter",
      "nameLong": "Peter’s First Letter"
    },
    {
      "id": "2PE",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Pe",
      "name": "2 Peter",
      "nameLong": "Peter’s Second Letter"
    },
    {
      "id": "1JN",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "1Jn",
      "name": "1 John",
      "nameLong": "John’s First Letter"
    },
    {
      "id": "2JN",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "2Jn",
      "name": "2 John",
      "nameLong": "John’s Second Letter"
    },
    {
      "id": "3JN",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "3Jn",
      "name": "3 John",
      "nameLong": "John’s Third Letter"
    },
    {
      "id": "JUD",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Jud",
      "name": "Jude",
      "nameLong": "The Letter from Jude"
    },
    {
      "id": "REV",
      "bibleId": "06125adad2d5898a-01",
      "abbreviation": "Rev",
      "name": "Revelation",
      "nameLong": "The Revelation to John"
    }
  ]
  function getOptions(queryParam) {
        return {
        url: 'https://api.scripture.api.bible/v1/bibles/' + '06125adad2d5898a-01' + '/verses/' + queryParam,
        headers: {
          'api-key': helpers.token,
        }
      };
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      let parsedJSON = JSON.parse(body);
      let verseRAW = parsedJSON.data.content;
      prev_verse = parsedJSON.data.previous.id;
      next_verse = parsedJSON.data.next.id;
      this_verse = parsedJSON.data.id;
      let meta = parsedJSON.data.reference;
      let split = meta.split(/(?:\s|:)/);
      let _verseID = split.pop();
      let _chapterID = split.pop();
      let _bookID = split.join('');
      //let verseParsedArray = helpers.parseVerse(verseRAW, _verseID, req.body.versionID);

        
      let verseObj = { 
          chapterID: _chapterID, 
          bookID:_bookID, 
          versionID:req.body.versionID, 
          text:verseRAW, 
          verseID:_verseID,
          previous: prev_verse,
          next: next_verse,
          current: this_verse
      };
        
      return res.send(verseObj);;
    } else {
        console.log('Incorrect ESV API credentials.');
    }
  }

  function getBookID(book) {

    data.forEach(function(x) {
        if (x.name.toLowerCase() == book.toLowerCase()) {
            return x.id;
        }
    });
    return book.substring(0,3).toUpperCase();
  }

  switch(req.body.action) {
      case 'previous':
          options = getOptions(req.body.previous);
          break;
      case 'current':
          options = getOptions(req.body.current);
          break;
      case 'next':
          options = getOptions(req.body.next);
          break;
      case 'new':
          options = getOptions(getBookID(req.body.bookID) + '.' + req.body.chapterID + '.' + req.body.verseID);
          break;
      default:
          throw 'invalidAction';
  }

  request(options, callback);

  
  

});

module.exports = router;
