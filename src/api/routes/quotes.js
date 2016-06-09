var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');


var cache;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.listen(8000);

var response =  {
  OperationSuccess : "",
  NodeId : 0,
  Url : "http://www.google.com",
  FailReason : ""
};


