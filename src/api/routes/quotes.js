var express = require('express');
var router = express.Router();
var fs = require('fs');

var cache;

var response =  {
  OperationSuccess : "",
  NodeId : 0,
  Url : "http://www.google.com",
  FailReason : ""
};

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/search/:query/:organisation/:archived',function(req,res){

  cache = readQuotes();

  cache = cache.quotes.filter(function(elem){
   if(req.params.archived.toLowerCase() === 'true')
      return elem.name.indexOf(req.params.query) >= 0 && (elem.organisation === req.params.organisation);

    else
     return elem.name.indexOf(req.params.query) >= 0 && (elem.organisation === req.params.organisation) && (!elem.archived);
  });

  res.json(cache);

});

router.get('/list', function(req,res) {
  console.log('GET Retrieving all quotes...');
  cache = readQuotes();

  res.json(cache);

});

router.get('/cob_list/:organisation', function(req,res){
  console.log('----------------------------------------------------------');
  console.log('GET Retrieving class of business list ... ');
  console.log('----------------------------------------------------------');

  cache = readCOB();
  res.json(cache);
});


router.get('/tob_list/:organisation', function(req,res) {
  console.log('----------------------------------------------------------');
  console.log('GET Retrieving type of business list ... ');
  console.log('----------------------------------------------------------');

  cache = readTOB();
  res.json(cache);
});




router.get('/list_with_cob', function(req,res){

  var quotes = readQuotes(),
      cob = readCOB(),
      ntu = readNTU();

  var auxCob, auxNTU;


  quotes.quotes.map(function(elem){

    auxCob = cob.cob.find(function(elem2){ return elem2.Shortcut == elem.classOfBusinessId });
    elem.classOfBusinessId = (auxCob ? auxCob.Value : "");

    auxNTU = ntu.ntu.find(function(elem2){return elem2.Id == elem.ntuReason });
    elem.ntuReason = (auxNTU ? auxNTU.Reason : "");

  });

  console.log(quotes);

  res.send(quotes);

});


router.get('/list/:organisation', function(req,res) {
  console.log('----------------------------------------------------------');
  console.log('GET Retrieving quotes under organisation ' + req.params.organisation);
  console.log('----------------------------------------------------------');

  cache = readQuotes();

  if (req.params.organisation) {
    cache.quotes = cache.quotes.filter(function (elem) {
      return elem.organisation == req.params.organisation;
    });
  }

  res.json(cache);
});

router.post('/archive_quote', function(req,res){

  cache = readQuotes();
  var quote = cache.quotes.find(function(elem){
      return elem.organisation === req.body.organisation && elem.nodeId === req.body.quoteNodeId
  });

  quote.archived = true;
  quote.ntuReason = req.body.idReason;

  writeQuote();
  res.status(200);
  response.OperationSuccess = true;
  res.send(response);

});

router.post('/save_quote',function(req,res){

  cache = readQuotes();
  var quote = req.body;

  cache.quotes.push({
    id : (cache.quotes.length ? Math.max.apply(0,cache.quotes.map(function(elem){return elem.id;})) + 1 : 1),
    organisation: quote.organisation,
    name : quote.name,
    reference : quote.reference,
    archived : (!!quote.ntuReason),
    ntuReason : (quote.ntuReason ? quote.ntuReason : 0),
    nodeId : (Math.floor(Math.random() * (100000 - 1 + 1)) + 1),
    classOfBusinessId :  quote.classOfBusiness
  });

  writeQuote();
  res.status(200);
  response.OperationSuccess = true;
  res.send(response);
});

router.post('/delete_quote', function(req,res){

  cache = readQuotes();
  var quote = req.body.quote;

  console.log('----------------------------------------------------------');
  console.log('DELETING quote');
  console.log('----------------------------------------------------------');

  for (var i =0; i < cache.quotes.length; i++)
    if (cache.quotes[i].id === quote.id) {
      cache.quotes.splice(i,1);
      writeQuote();
      break;
    }

  cache = readQuotes();

  res.json(cache);

  res.status(200);
  console.log("QUOTE DELETED");
});




function readNTU(){
  return JSON.parse(fs.readFileSync(`${__dirname}/ntu.json`, 'utf8'));
}


function readCOB(){
  return JSON.parse(fs.readFileSync(`${__dirname}/cob.json`, 'utf8'));
}

function readTOB(){
  return JSON.parse(fs.readFileSync(`${__dirname}/tob.json`, 'utf8'));
}

function readQuotes(){
  return JSON.parse(fs.readFileSync(`${__dirname}/quotes.json`, 'utf8'));
}


function writeQuote(){
  fs.writeFileSync(`${__dirname}/quotes.json`, JSON.stringify(cache));
}


module.exports = router;
