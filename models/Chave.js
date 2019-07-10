var mongoose = require('mongoose');

var ChaveSchema = new mongoose.Schema({
  //_id:{type:String},
  _NChave:{type:Number},
  _Tipo:{type:String},
  _Sala:{type:String},
  _Estado:{type:Number}
}, {timestamps: true});

module.exports = mongoose.model('Chave', ChaveSchema, 'Chave');
