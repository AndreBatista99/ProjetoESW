var mongoose = require('mongoose');

var SalasSchema = new mongoose.Schema({
  //_id:{type:String},
  _NSala:{type:Number},
  _Piso:{type:Number},
  _Bloco:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('Salas', SalasSchema, 'Salas');