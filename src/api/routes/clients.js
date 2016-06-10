var express = require('express');
var router = express.Router();
var fs = require('fs');

var response =  {
  OperationSuccess : "",
  NodeId : 0,
  Url : "http://www.google.com",
  FailReason : ""
};

var cache;

router.get('/', function(req, res) {
  res.send({message: "Hi from clients"});
});


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/list', function(req, res) {
  console.log('GET Retrieving all folders');
  console.log(req.params.organisation);
  cache = readClientFolders();
  res.json(cache);
});

router.get('/list/:organisation', function(req, res) {
  console.log('----------------------------------------------------------');
  console.log('GET Retrieving clients under organisation ' + req.params.organisation);
  console.log('----------------------------------------------------------');

  cache = readClientFolders();

  if(req.params.organisation) {
    cache.clients = cache.clients.filter(function (elem) {
      return elem.organisation == req.params.organisation;
    });
  }

  cache.clients.sort(sortById);

  res.json(cache);
});

function sortById(a,b){
  if(a.id< b.id) return -1;
  if(a.id> b.id) return 1;
  return 0;
}

router.post('/delete_client', function(req,res){

  cache = readClientFolders();
  var client = req.body.client;

  console.log('----------------------------------------------------------');
  console.log('DELETING client: ' + client.clientName + ', ID: ' + client.id);
  console.log('----------------------------------------------------------');

  for (var i =0; i < cache.clients.length; i++)
    if (cache.clients[i].id === client.id) {
      cache.clients.splice(i,1);
      writeClient();
      break;
    }

  cache = readClientFolders();

  if(req.params.organisation) {
    cache.clients = cache.clients.filter(function (elem) {
      return elem.organisation == req.params.organisation;
    });
  }
  res.json(cache);

  res.status(200);
  console.log("CLIENT DELETED");
});


router.post('/save_client',function(req,res){

  cache = readClientFolders();
  var client = req.body;

  cache.clients.push({
    id: (cache.clients.length ? Math.max.apply(0,cache.clients.map(function(elem){return elem.id;})) + 1 : 1),
    clientName: client.clientName,
    clientCode: client.clientCode,
    groupFolderNodeId : client.groupFolderNodeId,
    location: client.location
  });

  writeClient();

  res.status(200);
  response.OperationSuccess = true;
  res.send(response);
});

function readClientFolders() {
  return JSON.parse(fs.readFileSync(`${__dirname}/client_folders.json`, 'utf8'));
}

function writeClient(){
  fs.writeFileSync(`${__dirname}/client_folders.json`, JSON.stringify(cache));
}


module.exports = router;
