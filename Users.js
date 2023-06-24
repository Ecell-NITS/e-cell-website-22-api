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

const Authschema = new mongoose.Schema({
  name:String,
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    unique:true
  },
  bio:{
    type:String
  },
  userimg:{
    type:String
  }
})


const blogsschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  intro: {
    type:  mongoose.Schema.Types.Mixed,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
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
  writeremail:{
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
  likes: {
    type: [String], 
    default: [],
  },
  timestamp:Date,
  comments: [{
    commentauthor: String,
    commentpic:String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

const otpSchema = new mongoose.Schema ({
  email: { type: String, required: true },
  otp: { type: String, required: true },
})

const blogs1 = mongoose.model("blog", blogsschema);
const PublishedBlogSchema = new mongoose.Schema(
  blogs1.schema.obj, 
  { collection: "publishedblogs" } 
);

const UserModel = mongoose.model("newsletter", UserSchema);
const UserModel2 = mongoose.model("query", UserSchema2);

const PublishedBlog = mongoose.model("PublishedBlog", PublishedBlogSchema);
const AuthSchemaModel = mongoose.model("signup", Authschema)
const OTPModel = mongoose.model("OTPsignup", otpSchema);

module.exports = {
  UserModel,
  UserModel2,
  blogs1,
  PublishedBlog,
  AuthSchemaModel, OTPModel
};
