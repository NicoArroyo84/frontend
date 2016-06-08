var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var cache;




var response =  {
  OperationSuccess : "",
  NodeId : 0,
  Url : "http://www.google.com",
  FailReason : ""
};


app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


function readClients() {
  return JSON.parse(fs.readFileSync(`${__dirname}/clients.json`, 'utf8'));


}

function readClientFolders() {
  return JSON.parse(fs.readFileSync(`${__dirname}/client_folders.json`, 'utf8'));
}

function readUsers() {
  return JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
}



function write() {
  fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(cache));

}

function writeClient(){
  fs.writeFileSync(`${__dirname}/client_folders.json`, JSON.stringify(cache));
}


app.listen(8000);

app.get('/client_folders', function(req, res) {
  console.log('GET /client_folders');
  console.log(cache);
  cache = readClientFolders();
  console.log(cache);
  res.json(cache);
});

app.get('/users', function(req, res) {
  console.log('GET /users');
  console.log(cache);
  cache = readUsers();
  console.log(cache);
  res.json(cache.users);
});


app.get('/clients', function(req, res) {
  console.log('GET /clients');
  console.log(cache);
  cache = readClients ();
  console.log(cache);
  console.log('GET /clients2');
  res.json(cache);
});

app.post('/delete_client', function(req,res){

  cache = readClientFolders();
  var client = req.body.client;

  for (var i =0; i < cache.clients.length; i++)
    if (cache.clients[i].id === client.id) {
      cache.clients.splice(i,1);
      writeClient();
      break;
    }


  res.status(200);
  res.send("DELETED");
});


app.post('/save_client',function(req,res){
  
  cache = readClientFolders();
  var client = req.body;

  cache.clients.push({
    id: cache.clients.length,
    organisation: client.organisation,
    clientName: client.clientName,
    clientCode: client.clientCode,
    groupFolderNodeId : client.groupFolderNodeId,
    location: client.location
  });

  writeClient();


  res.status(200);
  response.OperationSuccess = true;
  console.log("RESPONSE ------------------");
  console.log(response);

  res.send(response);
});


app.post('/user', function(req, res) {

  //var validation = {
  //  firstname: "string",
  //  lastname: "string",
  //  email: "string"
  //};
  //
  //for (var field in validation) {
  //  var type = typeof user[field];
  //  if (!user.hasOwnProperty(field)) {
  //    res.status(400);
  //    res.send(`Field '${field}' is required`);
  //    return;
  //  }
  //  else if (type !== validation[field]) {
  //    res.status(400);
  //    res.send(`Field '${field}' must be of type '${validation[field]}'.`);
  //    return;
  //  }
  //}


});

