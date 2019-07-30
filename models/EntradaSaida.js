var mongoose = require('mongoose');

var EntradaSaidaSchema = new mongoose.Schema({
  //_id:{type:String},
  _Nome:{type:String},
  _NUtilizador:{type:Number},
  _EntradaSaida:{type:String},
  _Data:{type:String},
  _Horario:{type:String},
}, {timestamps: true});

module.exports = mongoose.model('EntradaSaida', EntradaSaidaSchema, 'EntradaSaida');