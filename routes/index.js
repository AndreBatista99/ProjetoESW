
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

function lerMateriaisDisponiveis(req, res) {
  Material.find({}, (err, materiais) => {
    if (err) {
      console.log(err);
      res.json({ "Message": "SystemError" });
      return
    }
    if (materiais.length > 0) {
      materiais.sort((a, b) => {
        return a._NMaterial - b._NMaterial;
      });
      ListaRequisicao.find({ "_DataRequisicao": { "$ne": NULLDATE }, "_DataEntrega": NULLDATE }, (err, listasrequisicoes) => {
        console.log(listasrequisicoes);
        var arrNListas = [];
        var i = 0;
        for (i = 0; i < listasrequisicoes.length; i++) {
          arrNListas[i] = listasrequisicoes[i]._NLista;
        }
        LinhaRequisicao.find({ "_NLista": arrNListas }, (err, linhasrequisicao) => {
          console.log(linhasrequisicao);
          var counter = 0;
          var qntDisponivel = [];
          materiais.forEach(function (elem) {
            qntDisponivel[counter] = 0;
            var qntReq = 0;
            var arrlinhasrequisicao = linhasrequisicao.map(element => {
              return {
                _NLista: element._NLista,
                _NObjeto: element._NObjeto,
                _Tipo: element._Tipo,
                _Qnt: element._Qnt
              }
            })
            var novoArrayLinhasRequisicao = arrlinhasrequisicao.filter((linha) => {
              return linha._NObjeto === elem._NMaterial && linha._Tipo === "Material";
            });
            novoArrayLinhasRequisicao.forEach(material => {
              qntReq += material._Qnt;
            });
            qntDisponivel[counter] = (elem._Stock - qntReq);
            counter++;
            if (counter == materiais.length) {
              res.json({ "Message": "Success", "materiais": materiais, "qntdisponivel": qntDisponivel });
              console.log("Dados listados");
              return;
            }
          });
        });
      });
    }
  });
}
module.exports.lerMateriaisDisponiveis = lerMateriaisDisponiveis;

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
  Chave.find({ "_Estado": 1 }, (err, res2) => {
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
      if (estado == -1 && res2._Estado != -1) {
        estado = -1;
      } else if (res2[0]._Estado == -1 && estado != -1) {
        estado = 1;
      } else {
        estado = res2[0]._Estado;
      }
      Chave.findOneAndUpdate(query, { "_Sala": stringSala, "_Estado": estado }, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        res.json({ "Message:": "Success", "Sala": stringSala });
        return;
      });
    }
  });
}

module.exports.updateChave = updateChave;

function abrirRequisicao(req, res) {
  nutilizador = req.body.nutilizador;
  var query = { "_Dono": nutilizador, "_DataRequisicao": NULLDATE };
  ListaRequisicao.find(query, (err, res2) => {
    if (res2.length == 0) {
      console.log("Criar Lista");
      ListaRequisicao.find({}).sort('_NLista').exec(function (err, docs) {
        if (docs.length == 0) {
          console.log("empty");
          var nextNLista = 1;
        } else {
          var nextNLista = parseInt(docs[docs.length - 1]._NLista);
          nextNLista += 1;
        }
        var novaLista = new ListaRequisicao({ "_NLista": nextNLista, "_Dono": nutilizador, "_DataRequisicao": NULLDATE, "_DataEntrega": NULLDATE });
        ListaRequisicao.create(novaLista);
        res.json({ "Message": "ListaCriada", "NLista": nextNLista });
        return;
      });
    } else {
      res.json({ "Message": "ExistingList", "NLista": res2[0]._NLista });
      return;
    }

  });
}
module.exports.abrirRequisicao = abrirRequisicao;

function abrirLinhasRequisicao(req, res) {
  nlista = req.body.nlista;
  var query = { "_NLista": nlista };

  LinhaRequisicao.find(query, (err, res2) => {
    if (res2.length == 0) {
      res.json({ "Message": "DontHaveLines" });
      return;
    }
    var nomesObjetos = [];
    var i = 1;
    res2.forEach(function (elem) {
      switch (elem._Tipo) {
        case "Material":
          var subquery = { "_NMaterial": elem._NObjeto };
          Material.find(subquery, (err2, res3) => {
            if (err2) {
              console.log(err2);
              res.json({ "Message": "SystemError" });
            } else {
              nomesObjetos[elem._NLinha] = res3[0]._Nome;
              i++;
              if (i == res2.length + 1) {
                res.json({ "Message": "Success", "linhas": res2, "nomesObjetos": nomesObjetos });
                return;
              }
            }
          });
          break;
        case "Chave":
          var subquery = { "_NChave": elem._NObjeto };
          Chave.find(subquery, (err2, res3) => {
            if (err2) {
              console.log(err2);
              res.json({ "Message": "SystemError" });
            } else {
              nomesObjetos[elem._NLinha] = res3[0]._Sala;
              i++;
              if (i == res2.length + 1) {
                res.json({ "Message": "Success", "linhas": res2, "nomesObjetos": nomesObjetos });
                return;
              }
            }
          });
          break;
      }

    });

  });
}
module.exports.abrirLinhasRequisicao = abrirLinhasRequisicao;


function listarRequisicoes(req, res) {
  nutilizador = req.body.nutilizador;
  var query = { "_Dono": nutilizador };

  ListaRequisicao.find(query, (err, listas) => {
    if (listas.length == 0) {
      res.json({ "Message": "DontHaveLists" });
      return;
    }
    res.json({ "Message": "Success", "listas": listas });
    return;
  });
}
module.exports.listarRequisicoes = listarRequisicoes;


function entregarTudo(req, res) {
  nutilizador = req.body.nutilizador;
  nlista = req.body.nlista;
  var query = { "_Dono": nutilizador, "_NLista": nlista };
  ListaRequisicao.find(query, (err, listas) => {
    if (listas.length == 0) {
      res.json({ "Message": "DontHaveLists" });
      return;
    }
    LinhaRequisicao.updateMany({ "_NLista": nlista }, { "_DataEntrega": new Date() }, function (err, result) {
      if (!err){
        ListaRequisicao.findOneAndUpdate(query, { "_DataEntrega": new Date() }, function (err, result2) {
          res.json({ "Message": "Success"});
          return;
        });
      }
    });
  });
}
module.exports.entregarTudo = entregarTudo;

function criarEvento(req, res) {
  var titulo = req.body.titulo;
  var data = req.body.data;
  var horario = req.body.horario;
  var local = req.body.local;
  var descricao = req.body.descricao;
  Evento.find({}).sort('_NEvento').exec(function (err, docs) {
    var nextNEvento = parseInt(docs[docs.length - 1]._NEvento);
    nextNEvento += 1;
    console.log(nextNEvento);
    var novoEvento = new Evento({ "_NEvento": nextNEvento, "_Titulo": titulo, "_Data": data, "_Horario": horario, "_Local": local, "_Descricao": descricao });
    Evento.create(novoEvento);
    res.json({ "Message": "Success" });
    return;
  });
}
module.exports.criarEvento = criarEvento;


function adicionarObjeto(req, res) {

  var nlista = req.body.nlista;
  var tipo = req.body.tipo;
  var nobjeto = req.body.nobjeto;
  var qnt = req.body.qnt;

  if (qnt <= 0) {
    res.json({ "Message": "InvalidQnt" });
    return;
  }
  if (tipo == "Chave" && qnt != 1) {
    res.json({ "Message": "InvalidQnt" });
    return;
  }
  switch (tipo) {
    case "Material":
      Material.find({ "_NMaterial": nobjeto }, (err, material) => {
        if (err) {
          console.log(err);
          res.json({ "Message": "SystemError" });
        } else {
          if (material.length == 0) {
            res.json({ "Message": "ObjetoIndisponivel" });
            return;
          } else {
            //Teste
            ListaRequisicao.find({ "_DataRequisicao": { "$ne": NULLDATE }, "_DataEntrega": NULLDATE }, (err, listasrequisicoes) => {
              console.log(listasrequisicoes);
              var arrNListas = [];
              var i = 0;
              for (i = 0; i < listasrequisicoes.length; i++) {
                arrNListas[i] = listasrequisicoes[i]._NLista;
              }
              LinhaRequisicao.find({ "_NLista": arrNListas }, (err, linhasrequisicao) => {
                console.log(linhasrequisicao);
                var qntDisponivel = 0;
                var qntReq = 0;
                var arrlinhasrequisicao = linhasrequisicao.map(element => {
                  return {
                    _NLista: element._NLista,
                    _NObjeto: element._NObjeto,
                    _Tipo: element._Tipo,
                    _Qnt: element._Qnt
                  }
                })
                var novoArrayLinhasRequisicao = arrlinhasrequisicao.filter((linha) => {
                  return linha._NObjeto === material[0]._NMaterial && linha._Tipo === "Material";
                });
                novoArrayLinhasRequisicao.forEach(material => {
                  qntReq += material._Qnt;
                });
                qntDisponivel = (material[0]._Stock - qntReq);

                query = { "_NLista": nlista, "_NObjeto": nobjeto, "_Tipo": "Material" };
                LinhaRequisicao.find(query, (err, linha) => {
                  if (linha.length > 0) {
                    var newValue = parseInt(linha[0]._Qnt) + parseInt(qnt);
                    if (newValue > qntDisponivel) {
                      res.json({ "Message": "InvalidQnt" });
                      return;
                    }
                    LinhaRequisicao.findOneAndUpdate(query, { "_Qnt": newValue }, function (err, doc) {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      res.json({ "Message:": "Success" });
                      return;
                    });
                  } else {

                    //Não tem linha ainda
                    if (qnt > qntDisponivel) {
                      res.json({ "Message": "InvalidQnt" });
                      return;
                    }
                    LinhaRequisicao.find({ "_NLista": nlista }).sort('_NLinha').exec(function (err, listaAtual) {

                      if (listaAtual.length == 0) {
                        var nextNLinha = 1;
                      } else {
                        var nextNLinha = parseInt(listaAtual[listaAtual.length - 1]._NLinha);
                        nextNLinha += 1;
                      }
                      console.log(nextNLinha);
                      var novaLinha = new LinhaRequisicao({
                        "_NLista": nlista, "_NLinha": nextNLinha,
                        "_Tipo": "Material", "_NObjeto": nobjeto, "_Qnt": qnt, "_DataEntrega": NULLDATE
                      });
                      LinhaRequisicao.create(novaLinha);
                      res.json({ "Message": "Success" });
                      return;


                    });
                  }
                });


                //res.json({ "Message": "Success" });
                //console.log("Dados listados");
                //return;
              });
            });
          }
        }

      });
      break;
    case "Chave":
      Chave.find({ "_Estado": 1, "_NChave": nobjeto }, (err, res2) => {
        if (err) {
          console.log(err);
          res.json({ "Message": "SystemError" });
        } else {
          if (res2.length == 0) {
            res.json({ "Message": "ObjetoIndisponivel" });
            return;
          } else {
            query = { "_NLista": nlista, "_NObjeto": nobjeto, "_Tipo": "Chave" };
            LinhaRequisicao.find(query, (err, linha) => {
              if (linha.length > 0) {
                res.json({ "Message": "DuplicateKey" });
                return;
              } else {
                LinhaRequisicao.find({ "_NLista": nlista }).sort('_NLinha').exec(function (err, docs) {
                  if (docs.length == 0) {
                    nextNLinha = 1;
                  } else {
                    var nextNLinha = parseInt(docs[docs.length - 1]._NLinha);
                    nextNLinha += 1;
                  }
                  console.log(nextNLinha);
                  var novaLinha = new LinhaRequisicao({
                    "_NLista": nlista, "_NLinha": nextNLinha,
                    "_Tipo": "Chave", "_NObjeto": nobjeto, "_Qnt": 1, "_DataEntrega": NULLDATE
                  });
                  LinhaRequisicao.create(novaLinha);
                  res.json({ "Message": "Success" });
                  return;
                });
              }
            });


          }
        }
      });

      break;
  }
}
module.exports.adicionarObjeto = adicionarObjeto;


function apagarLinhaRequisicao(req, res) {
  var nlista = req.body.nlista;
  var nlinha = req.body.nlinha;

  var query = { '_NLista': nlista, '_NLinha': nlinha };
  LinhaRequisicao.deleteOne(query, function (err) {
    if (err) {
      console.log("Erro-> " + err);
    }
    res.json({ "Message:": "Success" });
    return;
  })

}
module.exports.apagarLinhaRequisicao = apagarLinhaRequisicao;


function fazerRequisicao(req, res) {
  var nlista = req.body.nlista;
  var query = { '_NLista': nlista };

  query = { "_NLista": nlista };
  LinhaRequisicao.find(query, (err, linha) => {
    var counter = 0;
    linha.forEach(element => {
      switch (element._Tipo) {
        case "Material":

          counter++;
          break;
        case "Chave":

          Chave.findOneAndUpdate({ "_NChave": element._NObjeto }, { "_Estado": 0 }, function (err, doc) {
            if (err) {
              console.log(err);
              return;
            }
            if (doc._Estado != 1) {
              res.json({ "Message": "ChaveIndisponivel", "Sala": doc._Sala });
              return;

            }
            counter++;
          });
          break;
      }
      if (counter == linha.length) {
        ListaRequisicao.findOneAndUpdate(query, { "_DataRequisicao": new Date() }, function (err, doc) {
          if (err) {
            console.log(err);
            return;
          }
          res.json({ "Message:": "Success" });
          return;
        });
      }
    });
  });

}

module.exports.fazerRequisicao = fazerRequisicao;

function removerEvento(req, res) {
  var nevento = req.body.nevento;
  Evento.deleteOne({ '_NEvento': nevento }, function (err) {
    if (err) {
      res.json({ "Message": "erro" });
    } else {
      res.json({ "Message": "ok" });
    }
  });

}

module.exports.removerEvento = removerEvento;