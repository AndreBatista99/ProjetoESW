
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
  console.log("num = "+req.body.num+"   bi = "+req.body.bi);
    var query = {'_NAluno': req.body.num,'_BI':req.body.bi};

    var random = Math.floor(Math.random() * (+999999 - +100000) + +100000); 
 
    console.log("random = "+ random);

    /*
     Utilizadores.findOne({'_NAluno': "123"}, function (err, result) {
      console.log("kanker 1");
      if (err) { console.log("DEU ERRRO CARALHO!!!") }
      if (result) {
        
        console.log(result._NAluno);
      }
      console.log("kanker 2");
     });*/

     Utilizadores.findOneAndUpdate(query,{"_Pwd":random},function(err,doc){
      if (err || !doc) return res.send(500, { error: err });

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


 function lerOcorrencias(req,res){
  Ocorrencia.find({},(err, res2) => {
  if (err) {
    console.log(err);
    res.json({ "Message": "SystemError" });
  } else {
    

    if(res2.length>0){
      var creatorNum = 0;
      var creatorName=[] ;
      res2.forEach(function(elem){
        console.log("procurando utilizador: "+elem._NUtilizador);
        Utilizadores.find({ '_NUtilizador': elem._NUtilizador}, (err2,res3) => {
          if (err2) {
            res.json({ "Message": "SystemError" });
            return ;
          } else {
            if(res3.length>0){
              console.log("set "+res3[0]._Nome);
              creatorName[creatorNum++] = res3[0]._Nome;
            }else{
              res.json({ "Message": "WrongUser" });
              return;
            }
          }

          if(creatorNum==res2.length){
            res.json({ "Message": "Success",
                        "ocorrencias": res2,
                        "creatorName":creatorName});
          }
        });
        
      });
    }else
      console.log('Erro de leitura');
  }
}); 
};
 module.exports.lerOcorrencias = lerOcorrencias;


 function criarOcorrencia(req,res){

  console.log("data="+req.body.data+"   participante="+req.body.participante+"   local="+req.body.local+"   descricao="+req.body.descricao);

    var query = {"_Data":req.body.data,"_NUtilizador":req.body.participante,"_Local":req.body.local,"_Desricao":req.body.descricao};

     Ocorrencia.findOne({'_NUtilizador':'1'},function(err,doc){
      if (err || !doc) return res.send(500, { error: err });

      console.log("encontrou!");
      
     }); 
  }
  
  module.exports.resetPass = resetPass;