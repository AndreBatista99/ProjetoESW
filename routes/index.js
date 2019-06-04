
var express = require('express');
var router = express.Router();

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://Admin:Admin@projetoesw-smjdo.gcp.mongodb.net/ProjetoESW?retryWrites=true';

// Models
const Utilizadores = require('../models/Utilizadores');
const Evento = require('../models/Evento');
const EntradaSaida = require('../models/EntradaSaida');
const Ocorrencia = require('../models/Ocorrencia');
const Material = require('../models/Material');

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
     Utilizadores.findOneAndUpdate(query,{"_Pwd":random},function(err,doc){
      if (err || !doc) return res.send(500, { error: err });

      res.json({"Message:":1,"pw":random});
      console.log("updated!");
      //return res.send("succesfully saved");
     }); 
  }
  
  module.exports.resetPass = resetPass;

  

function changeStock(req,res){
  var query = {'_NMaterial': req.body.nmaterial};
  Material.find(query,(err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
      return;
    } else {
      var valorAtual = res2[0]._Stock;
      switch(req.body.mode){
        case '+':
          valorAtual+=req.body.value;
          break;
        case '-':
            valorAtual-=req.body.value;
          break;

        case 'update':
            valorAtual=req.body.value;
          break;
      }
      if (valorAtual<=0){
        Material.deleteOne(query,function(err,doc){
          if (err){
            console.log(err);
            return;
          }
          console.log("removed");
          res.json({"Message:":"Success","_Stock":0});
          return;
        }); 
      }else{
        Material.findOneAndUpdate(query,{"_Stock":valorAtual},function(err,doc){
          if (err){
            console.log(err);
            return;
          }
          res.json({"Message:":"Success","_Stock":valorAtual});
          return;
        });
      }

    }
  }); 
  }
  
  module.exports.changeStock = changeStock;

  
function lerEventos(req,res){
  Evento.find({},(err, res2) => {
  if (err) {
    console.log(err);
    res.json({ "Message": "SystemError" });
  } else {
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
          Utilizadores.find({ '_NUtilizador': elem._NUtilizador}, (err2,res3) => {
          if (err2) {
            res.json({ "Message": "SystemError" });
            return ;
          } else {
            if(res3.length>0){
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
  if(req.body.participante==""||req.body.titulo==""||req.body.local==""){
    console.log("Missing parameters");
    res.json({ "Message": "MissingParameters" });
    return;
  }
  console.log("data="+req.body.data+"   participante="+req.body.participante+"   local="+req.body.local+"   descricao="+req.body.descricao);
    var query = {"_NUtilizador":req.body.participante,"_Local":req.body.local,"_Titulo":req.body.titulo};
     Ocorrencia.findOne(query,function(err,doc){
      if (err || !doc){
        var novaOcorrencia = new Ocorrencia({"_Titulo":req.body.titulo,"_Data":req.body.data,"_Horario":req.body.horario,"_Local":req.body.local,"_Descricao":req.body.descricao,"_NUtilizador":req.body.participante});
        Ocorrencia.create(novaOcorrencia);
        res.json({ "Message": "Success" });
        console.log("inserido novo registo");
      } else {
        console.log("encontrou registo existente");
        return res.send(500, { error: err });
      };
      
     }); 
  }
  
  module.exports.criarOcorrencia = criarOcorrencia;


  function registarEntradaSaida(req,res){
    if(req.body.nome==""||req.body.entradaSaida==""){
      console.log("Missing parameters");
      res.json({ "Message": "MissingParameters" });
      return;
    }
    var novaEntradaSaida = new EntradaSaida({"_Nome":req.body.nome,"_EntradaSaida":req.body.entradaSaida,"_Hora":new Date()});
    EntradaSaida.create(novaEntradaSaida);
    res.json({ "Message": "Success" });
    console.log("inserido novo registo");
  }
    module.exports.registarEntradaSaida = registarEntradaSaida;

  
function lerMateriais(req,res){
  Material.find({},(err, res2) => {
  if (err) {
    console.log(err);
    res.json({ "Message": "SystemError" });
  } else {
    res2.sort((a,b)=>{
      return a._NMaterial - b._NMaterial;
    })
    if(res2.length>0){
      res.json({ "Message": "Success",
                  "materiais": res2});
    }else
      console.log('Erro de leitura');
  }
}); 
 }
 module.exports.lerMateriais = lerMateriais;


function criarMaterial(req,res){
  if(req.body.nome==""||req.body.stock==""){
    console.log("Missing parameters");
    res.json({ "Message": "MissingParameters" });
    return;
  }
  if(isNaN(req.body.stock)){
    console.log("Stock NAN");
    res.json({ "Message": "Stock NAN" });
    return;
  }
  var query = {"_Nome":req.body.nome};
  Material.findOne(query,function(err,doc){
  if (err || !doc){
   
    Material.find({}).sort('_NMaterial').exec(function(err, docs) {
      var nextNMaterial= parseInt(docs[docs.length-1]._NMaterial);
      nextNMaterial+=1;
      var novoMaterial = new Material({"_NMaterial":nextNMaterial,"_Nome":req.body.nome,"_Stock":req.body.stock});
      Material.create(novoMaterial);
      res.json({ "Message": "Success" });
      console.log("inserido novo registo");
    });

    
  } else {
    console.log("encontrou registo existente");
    res.json({ "Message": "ExistingMaterial" });
    return;
  };
  
  }); 
}
module.exports.criarMaterial = criarMaterial;
 


function updateMaterial(req,res){
  if (req.body.nome.trim()==""){
    res.json({ "Message": "InvalidName" });
    return;
  }
  var query = {'_NMaterial': req.body.nmaterial};

  Material.find(query,(err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
      return;
    } else {
      if (req.body.stock<=0){
        Material.deleteOne(query,function(err,doc){
          if (err){
            console.log(err);
            return;
          }
          console.log("removed");
          res.json({"Message:":"Success","_Stock":0});
          return;
        }); 
      }else{
        Material.findOneAndUpdate(query,{"_Nome":req.body.nome,"_Stock":req.body.stock},function(err,doc){
          if (err){
            console.log(err);
            return;
          }
          res.json({"Message:":"Success","nome":req.body.nome,"stock":req.body.stock});
          return;
        });
      }

    }
  }); 
  }
  
  module.exports.updateMaterial = updateMaterial;