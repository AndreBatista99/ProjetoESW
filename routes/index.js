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

    router.get('/login', function (req, res) {
      
      var userName='Tiago Mestre';
      User.find({'_name':userName},'_name _pwd',(err, res) => {//{'_name':'Tiago Mestre'},'_name',
        if (err) {
          console.log('Erro: ' + err);
        } else {
          console.log('Resposta: ' + res[0]._pwd);
        }
      });

    // find all athletes who play tennis, selecting the 'name' and 'age' fields
    // Athlete.find({ 'sport': 'Tennis' }, 'name age', function (err, athletes) {
    //   if (err) return handleError(err);
    //   // 'athletes' contains the list of athletes that match the criteria.
    // })
  });


module.exports = router;

