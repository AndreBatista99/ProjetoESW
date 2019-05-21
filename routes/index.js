
var express = require('express');
var router = express.Router();

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://Admin:Admin@projetoesw-smjdo.gcp.mongodb.net/ProjetoESW?retryWrites=true';

// Models
const User = require('../models/User');
const Evento = require('../models/Evento');

mongoose.connect(mongoDB, { useNewUrlParser: true });


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET users listing. */
router.get('/', function (req, res, next) {


});

mongoose.set('useFindAndModify', false);

function getLogin(req,res){
  User.find({ '_NUser': req.body.num,'_Pwd':req.body.pw}, (err, res2) => {//{'_name':'Tiago Mestre'},'_name',
    if (err) {
      //res.json('Erro: ' + err);
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      console.log(res2);
      if(res2.length>0){
        //res.json({"Message" : "ok", "_Bi" : res[0]._Bi});
        console.log(res2[0]._Bi);
        console.log('Success');
        res.json({ "Message": "Success",
                   "_id":res2[0]._id,
                   "_NumSystem":res2[0]._NumSystem,
                   "_Name":res2[0]._Name,
                   "_Email":res2[0]._Email,
                   "_Bi":res2[0]._Bi,
                   "_Pwd":res2[0]._Pwd,
                   "_NUser":res2[0]._NUser,
                   "_Role":res2[0]._Role,
                   "_Class":res2[0]._Class,
                   "_State":res2[0]._State});
      }else
        res.json({ "Message": "WrongCombination" });
        console.log('Login error');
    }
  }); 
}
module.exports.getLogin = getLogin;


function resetPass(req,res){
    var query = { '_NUser': req.body.num,'_Bi':req.body.bi};

    var random = Math.floor(Math.random() * (+999999 - +100000) + +100000); 

    console.log("random = "+ random);
     User.findOneAndUpdate(query,{"_Pwd":random},function(err,doc){
      if (err) return res.send(500, { error: err });
      res.json({"Message:":1,"pw":random});
      console.log("updated!");
      //return res.send("succesfully saved");
     }); 
  }
  
  module.exports.resetPass = resetPass;

  
function lerEventos(req,res){
  console.log("lerEventos");
  console.log(Evento);
  console.log(Evento.size);
  Evento.find({},(err, res2) => {
  if (err) {
    console.log(err);
    res.json({ "Message": "SystemError" });
  } else {
    console.log(res2);
    if(res2.length>0){
      console.log(res2[0]._Titulo);
      res.json({ "Message": "Success",
                  "eventos": res2});
    }else
      console.log('Erro de leitura');
  }
}); 
 }
 
 module.exports.lerEventos = lerEventos;

 
 function criarEvento(req,res){
  console.log("A");
  Evento.insert({
    '_titulo':req.body.Titulo,
    '_data':req.body.Data,
    '_horario':req.body.Horario,
    '_local':req.body.Local,
    '_descricao':req.body.Descricao
  });
  res.json({
    "Message":"Success"
  })
}

module.exports.criarEvento = criarEvento;
