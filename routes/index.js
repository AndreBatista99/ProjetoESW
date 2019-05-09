
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


});

function getLogin(req,res){
//router.post('/login',(req,res)=>{
  User.find({ '_NUser': req.body.num,'_Pwd':req.body.pw}, (err, res) => {//{'_name':'Tiago Mestre'},'_name',
    if (err) {
      res.json('Erro: ' + err);
      console.log(err);
    } else {
      console.log(res);
      if(res.length>0){
        //res.json({"Message" : "ok", "_Bi" : res[0]._Bi});
        console.log(res[0]._Bi);
        console.log('Success');
      }else
        console.log('Login error');
    }
  });

  res.json({ "Message": "ok" });
}

module.exports.getLogin = getLogin;


function resetPass(req,res){
  //router.post('/login',(req,res)=>{
    User.find({ '_NUser': req.body.num,'_Bi':req.body.bi}, (err, res) => {//{'_name':'Tiago Mestre'},'_name',
      if (err) {
        res.json('Erro: ' + err);
        console.log(err);
      } else {
        console.log(res);
        if(res.length>0){
          //res.json({"Message" : "ok", "_Bi" : res[0]._Bi});
          console.log(res[0]._Bi);
          console.log('Success');
        }else
          console.log('ResetPass error');
      }
    });
  
    res.json({ "Message": "ok" });
  }
  
  module.exports.resetPass = resetPass;
