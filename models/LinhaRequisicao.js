var mongoose = require('mongoose');

var LinhaRequisicaoSchema = new mongoose.Schema({
  //_id:{type:String},
  _NLista:{type:Number},
  _NLinha:{type:Number},
  _Tipo:{type:String},
  _NObjeto:{type:Number},
  _Qnt:{type:Number},
  _DataEntrega:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('LinhaRequisicao', LinhaRequisicaoSchema, 'LinhaRequisicao');
