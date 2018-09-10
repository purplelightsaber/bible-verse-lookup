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

  function getOptions(queryParam) {
        return {
        url: 'https://api.scripture.api.bible/v1/bibles/' + '06125adad2d5898a-01' + '/verses/GEN.1.2',
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
          options = getOptions(req.body.bookID + req.body.chapterID + '.' + req.body.verseID);
          break;
      default:
          throw 'invalidAction';
  }

  request(options, callback);

});

module.exports = router;
