const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
});

const UserSchema2 = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const blogsschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  // tag2: {
  //   type: String,
  //   required: true,
  // },
  topicpic:{
    type: String,
    required: true,
  },
  writernmae:{
    type: String,
    required: true,
  },
  writerintro:{
    type: String,
    required: true,
  },
  writerpic:{
    type: String,
    required: true,
  },
  timestamp:Date
});

const UserModel = mongoose.model("newsletter", UserSchema);
const UserModel2 = mongoose.model("query", UserSchema2);
const blogs1 = mongoose.model("blog", blogsschema);
module.exports = {
  UserModel,
  UserModel2,
  blogs1
};
