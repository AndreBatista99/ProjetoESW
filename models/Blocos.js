var mongoose = require('mongoose');

var BlocosSchema = new mongoose.Schema({
  //_id:{type:String},
  _Bloco:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('Blocos', BlocosSchema, 'Blocos');
