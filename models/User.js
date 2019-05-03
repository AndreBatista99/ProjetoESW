var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id:{type:String},
  _numSystem:{type:String},
  _name:{type:String},
  _email:{type:String},
  _pwd:{type:String},
  _role:{type:String},
  _class:{type:String},
  _state:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema, 'Users');