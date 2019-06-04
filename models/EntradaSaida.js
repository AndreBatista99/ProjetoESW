var mongoose = require('mongoose');

var EntradaSaidaSchema = new mongoose.Schema({
  //_id:{type:String},
  _Nome:{type:String},
  _EntradaSaida:{type:String},
  _Hora:{type:Date}
}, {timestamps: true});

module.exports = mongoose.model('EntradaSaida', EntradaSaidaSchema, 'EntradaSaida');