const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase: true,
    }
})

const UserModel = mongoose.model("newsletter", UserSchema)
module.exports= UserModel;
