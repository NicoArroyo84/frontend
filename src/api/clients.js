var express = require('express');
//var app = express();

var app = require('./server');

var bodyParser = require('body-parser');
var fs = require('fs');

var cache;
//console.log(app.local.test);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(8000);



app.get('/client_folders', function(req, res) {
  console.log('GET Retrieving all folders');
  console.log(req.params.organisation);
  cache = readClientFolders();
  res.json(cache);
});


app.get('/client_folders/:organisation', function(req, res) {
  console.log('GET Retrieving client under organisation ' + req.params.organisation);
  cache = readClientFolders();

  if(req.params.organisation) {
    cache.clients = cache.clients.filter(function (elem) {
      return elem.organisation == req.params.organisation;
    });
  }
  res.json(cache);
});


function readClientFolders() {
  return JSON.parse(fs.readFileSync(`${__dirname}/client_folders.json`, 'utf8'));
}

