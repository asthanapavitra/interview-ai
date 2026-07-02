const mongoose=require('mongoose');

const blacklistTokenSchema=mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added"]
    }
},{
    timestamps:true
})

module.exports=mongoose.model("blacklist-token", blacklistTokenSchema);
