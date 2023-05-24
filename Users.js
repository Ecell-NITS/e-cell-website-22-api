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

const UserModel = mongoose.model("newsletter", UserSchema);
module.exports = UserModel;

const UserModel2 = mongoose.model("query", UserSchema2);
module.exports = UserModel2;
