var express = require('express');
var helpers = require('../business/helpers');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', function(req, res, next) {
  let options = helpers.getOptions(helpers.getBookID(req.body.bookID) + '.' + req.body.chapterID + '.' + req.body.verseID);
  request(options, function(error, response, body){
    return res.send(helpers.callback(error, response, body));
    });
});

module.exports = router;
