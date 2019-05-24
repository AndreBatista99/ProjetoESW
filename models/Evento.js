var mongoose = require('mongoose');

var EventoSchema = new mongoose.Schema({
  //_id:{type:String},
  _Titulo:{type:String},
  _Data:{type:String},
  _Horario:{type:String},
  _Local:{type:String},
  _Desricao:{type:String},
}, {timestamps: true});

module.exports = mongoose.model('Evento', EventoSchema, 'Evento');