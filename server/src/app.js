const express=require('express');
const cookieParser=require('cookie-parser')
const cors=require('cors')

const puppeteer = require("puppeteer");
const fs = require("fs");


const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

// Requiring all routers

const authRouter=require('./routes/auth.routes');
const interviewRouter=require('./routes/interview.routes');


// Using routes

app.use('/api/auth', authRouter);

app.use('/api/interview',interviewRouter);

app.get("/test", (req, res) => {
  try {
    res.json({
      executable: puppeteer.executablePath(),
      exists: fs.existsSync(puppeteer.executablePath()),
    });
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});
module.exports=app;