var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id:{type:String},
  _NumSystem:{type:String},
  _Name:{type:String},
  _Email:{type:String},
  _Bi:{type:String},
  _Pwd:{type:String},
  _NUser:{type:String},
  _Role:{type:String},
  _Class:{type:String},
  _State:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema, 'Users');
