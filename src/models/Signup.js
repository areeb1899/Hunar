const mongoose=require('mongoose');

const signupSchema=new mongoose.Schema({
    username:{
        type:String,
        min:3,
    },
    email:{
        type:String,
        min:5,
        required:true
    },
    password:{
        type:String,
        min:5
    }
},{versionKey:false,timestamps:true});

const User=new mongoose.model('User',signupSchema);

module.exports=User;
