
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
const Salas = require('../models/Salas');
const Chave = require('../models/Chave');
const Blocos = require('../models/Blocos');
const Pisos = require('../models/Pisos');
const LinhaRequisicao = require('../models/LinhaRequisicao');
const ListaRequisicao = require('../models/ListaRequisicao');
const NULLDATE = "1900-01-01T00:00:00.107+00:00";

mongoose.connect(mongoDB, { useNewUrlParser: true });


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


mongoose.set('useFindAndModify', false);

function getLogin(req, res) {
  Utilizadores.find({ '_NAluno': req.body.num, '_Pwd': req.body.pw }, (err, res2) => {
    if (err) {
      res.json({ "Message": "SystemError" });
    } else {
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "_id": res2[0]._id,
          "_NUtilizador": res2[0]._NUtilizador,
          "_Nome": res2[0]._Nome,
          "_Email": res2[0]._Email,
          "_BI": res2[0]._BI,
          "_Pwd": res2[0]._Pwd,
          "_NAluno": res2[0]._NAluno,
          "_TipoUtilizador": res2[0]._TipoUtilizador,
          "_Turma": res2[0]._Turma,
          "_Estado": res2[0]._Estado
        });
      } else
        res.json({ "Message": "WrongCombination" });
    }
  });
}
module.exports.getLogin = getLogin;


function resetPass(req, res) {
  console.log("num = " + req.body.num + "   bi = " + req.body.bi);
  var query = { '_NAluno': req.body.num, '_BI': req.body.bi };

  var random = Math.floor(Math.random() * (+999999 - +100000) + +100000);
  console.log("random = " + random);
  Utilizadores.findOneAndUpdate(query, { "_Pwd": random }, function (err, doc) {
    if (err || !doc) return res.send(500, { error: err });

    res.json({ "Message:": 1, "pw": random });
    console.log("updated!");
    //return res.send("succesfully saved");
  });
}

module.exports.resetPass = resetPass;



function changeStock(req, res) {
  var query = { '_NMaterial': req.body.nmaterial };
  Material.find(query, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
      return;
    } else {
      var valorAtual = res2[0]._Stock;
      switch (req.body.mode) {
        case '+':
          valorAtual += req.body.value;
          break;
        case '-':
          valorAtual -= req.body.value;
          break;

        case 'update':
          valorAtual = req.body.value;
          break;
      }
      Material.findOneAndUpdate(query, { "_Stock": valorAtual }, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        res.json({ "Message:": "Success", "_Stock": valorAtual });
        return;
      });
    }
  });
}

module.exports.changeStock = changeStock;


function lerEventos(req, res) {
  Evento.find({}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "eventos": res2
        });
      } else
        console.log('Erro de leitura');
    }
  });
}

module.exports.lerEventos = lerEventos;


function lerOcorrencias(req, res) {
  Ocorrencia.find({}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      if (res2.length > 0) {
        var creatorNum = 0;
        var creatorName = [];
        res2.forEach(function (elem) {
          Utilizadores.find({ '_NUtilizador': elem._NUtilizador }, (err2, res3) => {
            if (err2) {
              res.json({ "Message": "SystemError" });
              return;
            } else {
              if (res3.length > 0) {
                creatorName[creatorNum++] = res3[0]._Nome;
              } else {
                res.json({ "Message": "WrongUser" });
                return;
              }
            }

            if (creatorNum == res2.length) {
              res.json({
                "Message": "Success",
                "ocorrencias": res2,
                "creatorName": creatorName
              });
            }
          });

        });
      } else
        console.log('Erro de leitura');
    }
  });
};
module.exports.lerOcorrencias = lerOcorrencias;


function criarOcorrencia(req, res) {
  if (req.body.participante == "" || req.body.titulo == "" || req.body.local == "") {
    console.log("Missing parameters");
    res.json({ "Message": "MissingParameters" });
    return;
  }
  console.log("data=" + req.body.data + "   participante=" + req.body.participante + "   local=" + req.body.local + "   descricao=" + req.body.descricao);
  var query = { "_NUtilizador": req.body.participante, "_Local": req.body.local, "_Titulo": req.body.titulo };
  Ocorrencia.findOne(query, function (err, doc) {
    if (err || !doc) {
      var novaOcorrencia = new Ocorrencia({ "_Titulo": req.body.titulo, "_Data": req.body.data, "_Horario": req.body.horario, "_Local": req.body.local, "_Descricao": req.body.descricao, "_NUtilizador": req.body.participante });
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


function registarEntradaSaida(req, res) {
  if (req.body.nome == "" || req.body.entradaSaida == "") {
    console.log("Missing parameters");
    res.json({ "Message": "MissingParameters" });
    return;
  }
  var novaEntradaSaida = new EntradaSaida({ "_Nome": req.body.nome, "_EntradaSaida": req.body.entradaSaida, "_Hora": new Date() });
  EntradaSaida.create(novaEntradaSaida);
  res.json({ "Message": "Success" });
  console.log("inserido novo registo");
}
module.exports.registarEntradaSaida = registarEntradaSaida;


function lerMateriais(req, res) {
  Material.find({}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      res2.sort((a, b) => {
        return a._NMaterial - b._NMaterial;
      })
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "materiais": res2
        });
      } else
        console.log('Erro de leitura');
    }
  });
}
module.exports.lerMateriais = lerMateriais;


function criarMaterial(req, res) {
  if (req.body.nome == "" || req.body.stock == "") {
    console.log("Missing parameters");
    res.json({ "Message": "MissingParameters" });
    return;
  }
  if (isNaN(req.body.stock)) {
    console.log("Stock NAN");
    res.json({ "Message": "Stock NAN" });
    return;
  }
  var query = { "_Nome": req.body.nome };
  Material.findOne(query, function (err, doc) {
    if (err || !doc) {

      Material.find({}).sort('_NMaterial').exec(function (err, docs) {
        var nextNMaterial = parseInt(docs[docs.length - 1]._NMaterial);
        nextNMaterial += 1;
        var novoMaterial = new Material({ "_NMaterial": nextNMaterial, "_Nome": req.body.nome, "_Stock": req.body.stock });
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



function updateMaterial(req, res) {
  if (req.body.nome.trim() == "") {
    res.json({ "Message": "InvalidName" });
    return;
  }
  var query = { '_NMaterial': req.body.nmaterial };

  Material.find(query, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
      return;
    } else {
      Material.findOneAndUpdate(query, { "_Nome": req.body.nome, "_Stock": req.body.stock }, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        res.json({ "Message:": "Success", "nome": req.body.nome, "stock": req.body.stock });
        return;
      });
    }
  });
}

module.exports.updateMaterial = updateMaterial;


function lerChaves(req, res) {
  Chave.find({}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      res2.sort((a, b) => {
        return a._NChave - b._NChave;
      })
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "chaves": res2
        });
      } else
        console.log('Erro de leitura');
    }
  });
}
module.exports.lerChaves = lerChaves;

function lerChavesDisponiveis(req, res) {
  Chave.find({"_Estado":1}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      res2.sort((a, b) => {
        return a._NChave - b._NChave;
      })
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "chaves": res2
        });
      } else
        console.log('Erro de leitura');
    }
  });
}
module.exports.lerChavesDisponiveis = lerChavesDisponiveis;

function lerBlocos(req, res) {
  Blocos.find({}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "blocos": res2
        });
      } else
        console.log('Erro de leitura');
    }
  });
}
module.exports.lerBlocos = lerBlocos;


function lerPisos(req, res) {
  Pisos.find({}, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
    } else {
      if (res2.length > 0) {
        res.json({
          "Message": "Success",
          "pisos": res2
        });
      } else
        console.log('Erro de leitura');
    }
  });
}
module.exports.lerPisos = lerPisos;


function criarChave(req, res) {

  var bloco = req.body.bloco;
  var piso = req.body.piso;
  var numerosala = req.body.numerosala;

  var isnum = /^\d+$/.test(numerosala);
  if (numerosala.length != 2 || !isnum) {
    console.log("O numero de sala só pode conter dois digitos");
    res.json({ "Message": "WrongParameters" });
    return;
  }
  var stringSala = "" + bloco + piso + numerosala;
  Chave.find({}).sort('_NChave').exec(function (err, docs) {
    var nextNChave = parseInt(docs[docs.length - 1]._NChave);
    nextNChave += 1;
    console.log(nextNChave);
    var novaChave = new Chave({ "_NChave": nextNChave, "_Tipo": "Regular", "_Sala": stringSala, "_Estado": 1 });
    Chave.create(novaChave);
    res.json({ "Message": "Success" });
    return;
  });
}
module.exports.criarChave = criarChave;



function updateChave(req, res) {
  var nchave = req.body.nchave;
  var bloco = req.body.bloco;
  var piso = req.body.piso;
  var estado = req.body.estado;
  var numerosala = req.body.numerosala;

  var isnum = /^\d+$/.test(numerosala);
  if (numerosala.length != 2 || !isnum) {
    console.log("O numero de sala só pode conter dois digitos");
    res.json({ "Message": "WrongParameters" });
    return;
  }
  var stringSala = "" + bloco + piso + numerosala;

  var query = { '_NChave': nchave };

  Chave.find(query, (err, res2) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
      return;
    } else {
      if (estado==-1 && res2._Estado!=-1){
        estado=-1;
      }else if(res2[0]._Estado==-1 && estado!=-1){
        estado=1;
      }else{
        estado = res2[0]._Estado;
      }
      Chave.findOneAndUpdate(query, {"_Sala": stringSala, "_Estado": estado }, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        res.json({ "Message:": "Success", "Sala": stringSala});
        return;
      });
    }
  });
}

module.exports.updateChave = updateChave;

function abrirRequisicao(req, res) {
  nutilizador=req.body.nutilizador;
  var query = {"_Dono":nutilizador,"_DataRequisicao": NULLDATE};
  ListaRequisicao.find(query, (err, res2) => {
    if(res2.length==0){
      console.log("Criar Lista");
        ListaRequisicao.find({}).sort('_NLista').exec(function (err, docs) {
        if(docs.length==0){
          console.log("empty");
          var nextNLista=1;
        }else{
          var nextNLista = parseInt(docs[docs.length - 1]._NLista);
          nextNLista += 1;
        }
        var novaLista = new ListaRequisicao({ "_NLista": nextNLista, "_Dono": nutilizador, "_DataRequisicao": NULLDATE, "_DataEntrega": NULLDATE });
        ListaRequisicao.create(novaLista);
        res.json({ "Message": "ListaCriada","NLista":nextNLista });
        return;
      });
    }else{
      console.log("Já tem lista");
      res.json({ "Message": "ExistingList","NLista" : res2[0]._NLista });
      return;
    }

  });
}
module.exports.abrirRequisicao = abrirRequisicao;

function abrirLinhasRequisicao(req, res) {
  nlista=req.body.nlista;
  var query = {"_NLista":nlista};
  var i= 1;
  LinhaRequisicao.find(query, (err, res2) => {
    var i = 0;
    for(var i=0;i<res2.length;i++ ){
      console.log(res2[i]._NObjeto);
      res2[i].NomeObjeto="Exemplo";
    }
    console.log(res2);
    res.json({ "Message": "Success","linhas" : res2 });      
    return;
  });
}
module.exports.abrirLinhasRequisicao = abrirLinhasRequisicao;

function criarEvento(req, res) {
  var titulo = req.body.titulo;
  var data = req.body.data;
  var horario = req.body.horario;
  var local = req.body.local;
  var descricao = req.body.descricao;
  return;
  Chave.find({}).sort('_NChave').exec(function (err, docs) {
    var nextNChave = parseInt(docs[docs.length - 1]._NChave);
    nextNChave += 1;
    console.log(nextNChave);
    var novaChave = new Chave({ "_NChave": nextNChave, "_Tipo": "Regular", "_Sala": stringSala, "_Estado": 1 });
    Chave.create(novaChave);
    res.json({ "Message": "Success" });
    return;
  });
}
module.exports.criarEvento = criarEvento;
