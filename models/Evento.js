var mongoose = require('mongoose');

var EventoSchema = new mongoose.Schema({
  _id:{type:String},
  _titulo:{type:String},
  _data:{type:String},
  _horario:{type:String},
  _local:{type:String},
  _descricao:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('Evento', EventoSchema, 'Evento');