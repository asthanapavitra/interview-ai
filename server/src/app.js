const express=require('express');
const cookieParser=require('cookie-parser')

const app=express();

app.use(express.json());
app.use(cookieParser());
// Requiring all routers
const authRouter=require('./routes/auth.routes');

app.get("/",(req,res)=>{
    res.send("Hello")
})

// Using routes

app.use('/api/auth', authRouter);
module.exports=app;