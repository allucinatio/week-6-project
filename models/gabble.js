// schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username  : {type:String, required:true},
  password  : {type:String, required:true}
});

const postSchema = new Schema({
  author    : {type:String, required:true},
  post      : {type:String, required:true},
  dateTime  : {type:Date, required:true, default: Date.now},
  likes     : [{type:String, required:true}]
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
  User, Post
}
