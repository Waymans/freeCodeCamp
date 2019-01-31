'use strict';

var express = require('express'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    crypto = require('crypto');

var app = express();

//url validation
function validate(uri) { 
  var regex = /^((http(s)?):\/\/)www\.([A-z0-9]+)\.([A-z]{2,5})/;
  if (uri.match(regex)) {
    return true
  } else {
    return false
  }
}

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI)


var urlSchema = new mongoose.Schema({
  longurl: {type: String, required: true},
  shorturl: String,
  id: String
})
var URL = mongoose.model('URL', urlSchema)

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...', process.env.PORT);
});

//response to short urls
app.get('/api/shorturl/:rest(*)', (req, res) => {
  URL.findOne({id: req.params.rest}, function(error, data) {
    if (error) throw error
    res.redirect(data.longurl)
  })
})

//posting urls
app.post('/api/shorturl/new', (req, res, done) => {
  var long_url = req.body.url;  
  //check if url is valid
  if (validate(long_url) === true) {
    //check if url is in database
    URL.findOne({longurl: long_url}, function(error, data) { 
      if (data) { res.send(data) }
      else {
        // Generate number for new url
        var short_url = crypto.randomBytes(2).toString('hex'); // 0971 = 971
        // Create new from model and save to database
        var urlNew = new URL({
          longurl: long_url,
          shorturl: 'https://url-shortener1-project.glitch.me/api/shorturl/' + short_url,
          id: short_url
          });
        urlNew.save(function(err) {
          if (err) throw err;
        });
        res.send(urlNew);
      } 
    })
  } else {
    res.send({'error': 'Invalid url'})
  }
})
