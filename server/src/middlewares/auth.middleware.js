const jwt=require('jsonwebtoken');
const BlackListModel=require('../models/blacklist-token.model')
async function authMiddleware(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).send("Token not provided");
    }
    try{
        if(token) {
            const blacklistedToken = await BlackListModel.findOne({ token });
            if (blacklistedToken) {
                return res.status(400).send("Invalid token, login again");
            }
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;

        next();
    }catch(err){
         res.status(501).send({
        message: err.message,
    });
    }
}

module.exports=authMiddleware