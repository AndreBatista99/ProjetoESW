var mongoose = require('mongoose');

var PisosSchema = new mongoose.Schema({
  //_id:{type:String},
  _NPiso:{type:Number}
}, {timestamps: true});

module.exports = mongoose.model('Pisos', PisosSchema, 'Pisos');
