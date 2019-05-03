
var express = require('express');
var router = express.Router();

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://Admin:Admin@projetoesw-smjdo.gcp.mongodb.net/ProjetoESW?retryWrites=true';

// Models
const User = require('../models/User');

mongoose.connect(mongoDB, { useNewUrlParser: true });


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET users listing. */
router.get('/', function (req, res, next) {
  var userName = 'Tiago Mestre';
  console.log(req.body.num);
  User.find({ '_name': userName }, '_name _pwd', (err, res) => {//{'_name':'Tiago Mestre'},'_name',
    if (err) {
      res.json('Erro: ' + err);
      console.log(err);
    } else {
      console.log('Resposta: ' + res[0]._pwd);
    }
  });

  res.json({ "Message": "ok" });

});

module.exports = router;

