var express = require('express');
var bodyParser = require('body-parser');

//modules
var routes = require('./routes/index');
var clients = require('./routes/clients');
var quotes = require('./routes/quotes');

var app = express();
var cache;

app.use(bodyParser.json());
app.use('/index', routes);
app.use('/clients',clients );
app.use('/quotes',quotes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(8000);

module.exports = app;




