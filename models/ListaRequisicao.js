var mongoose = require('mongoose');

var ListaRequisicaoSchema = new mongoose.Schema({
  //_id:{type:String},
  _NLista:{type:Number},
  _Dono:{type:Number},
  _DataRequisicao:{type:Date},
  _DataEntrega:{type:Date}
}, {timestamps: true});

module.exports = mongoose.model('ListaRequisicao', ListaRequisicaoSchema, 'ListaRequisicao');
