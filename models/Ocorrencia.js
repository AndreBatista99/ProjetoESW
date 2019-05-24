var mongoose = require('mongoose');

var OcorrenciaSchema = new mongoose.Schema({
  //_id:{type:String},
  _Titulo:{type:String},
  _Data:{type:String},
  _Horario:{type:String},
  _Local:{type:String},
  _Descricao:{type:String},
  _NUtilizador:{type:String},
}, {timestamps: true});

module.exports = mongoose.model('Ocorrencias', OcorrenciaSchema, 'Ocorrencias');