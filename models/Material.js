var mongoose = require('mongoose');

var MaterialSchema = new mongoose.Schema({
  //_id:{type:String},
  _NMaterial:{type:Number},
  _Nome:{type:String},
  _Stock:{type:Number}
}, {timestamps: true});

module.exports = mongoose.model('Material', MaterialSchema, 'Material');