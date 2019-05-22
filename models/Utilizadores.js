var mongoose = require('mongoose');

var UtilizadoresSchema = new mongoose.Schema({
  _id:{type:String},
  _NUtilizador:{type:String},
  _Nome:{type:String},
  _Email:{type:String},
  _BI:{type:String},
  _Pwd:{type:String},
  _NAluno:{type:String},
  _TipoUtilizador:{type:String},
  _Turma:{type:String},
  _Estado:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('Utilizadores', UtilizadoresSchema, 'Utilizadores');
