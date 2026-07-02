const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:[true, "Username Already Taken"]
    },
    email:{
         type:String,
        required:true,
        unique:[true, "Account with this email already exists"]
    },
    password:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('users',userSchema);