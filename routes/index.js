
var express = require('express');
var router = express.Router();

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://Admin:Admin@projetoesw-smjdo.gcp.mongodb.net/ProjetoESW?retryWrites=true';

// Models
const Utilizadores = require('../models/Utilizadores');
const Evento = require('../models/Evento');
const Ocorrencia = require('../models/Ocorrencia');

mongoose.connect(mongoDB, { useNewUrlParser: true });


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


mongoose.set('useFindAndModify', false);

function getLogin(req,res){
  Utilizadores.find({ '_NAluno': req.body.num,'_Pwd':req.body.pw}, (err, res2) => {
    if (err) {
      res.json({ "Message": "SystemError" });
    } else {
      if(res2.length>0){
        res.json({ "Message": "Success",
                   "_id":res2[0]._id,
                   "_NUtilizador":res2[0]._NUtilizador,
                   "_Nome":res2[0]._Nome,
                   "_Email":res2[0]._Email,
                   "_BI":res2[0]._BI,
                   "_Pwd":res2[0]._Pwd,
                   "_NAluno":res2[0]._NAluno,
                   "_TipoUtilizador":res2[0]._TipoUtilizador,
                   "_Turma":res2[0]._Turma,
                   "_Estado":res2[0]._Estado});
      }else
        res.json({ "Message": "WrongCombination" });
    }
  }); 
}
module.exports.getLogin = getLogin;


function resetPass(req,res){
    var query = { '_NAluno': req.body.num,'_BI':req.body.bi};

    var random = Math.floor(Math.random() * (+999999 - +100000) + +100000); 

    console.log("random = "+ random);
     Utilizadores.findOneAndUpdate(query,{"_Pwd":random},function(err,doc){
      if (err) return res.send(500, { error: err });
      res.json({"Message:":1,"pw":random});
      console.log("updated!");
      //return res.send("succesfully saved");
     }); 
  }
  
  module.exports.resetPass = resetPass;

  
function lerEventos(req,res){
  Evento.find({},(err, res2) => {
  if (err) {
    console.log(err);
    res.json({ "Message": "SystemError" });
  } else {
    console.log(res2);
    if(res2.length>0){
      res.json({ "Message": "Success",
                  "eventos": res2});
    }else
      console.log('Erro de leitura');
  }
}); 
 }
 
 module.exports.lerEventos = lerEventos;

<<<<<<< HEAD
 
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
=======
 function lerOcorrencias(req,res){
  Ocorrencia.find({},(err, res2) => {
  if (err) {
    console.log(err);
    res.json({ "Message": "SystemError" });
  } else {
    console.log(res2);
    if(res2.length>0){
      res.json({ "Message": "Success",
                  "eventos": res2});
    }else
      console.log('Erro de leitura');
  }
}); 
 }
 
 module.exports.lerOcorrencias = lerOcorrencias;
>>>>>>> dev
