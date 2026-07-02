const User = require("../models/user.model");
const BlackListModel=require("../models/blacklist-token.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const blacklistTokenModel = require("../models/blacklist-token.model");
/**
 * @name Register User controller
 * @access Public
 * @description Registers user and expects username,email and password
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("Please provide email, username and password");
    }

    const ifUserAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });
   
    if (ifUserAlreadyExists) {
      // ifUserAlreadyExists.username==username
      return res.status(400).send("User already exists with this email or username");
    }

    const pass = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: pass,
    });
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token);

    res.status(201).send({
      message: "User registered Successfully",
      user: {
        email: user.email,
        username: user.username,
        id: user._id,
      },
    });
  } catch (err) {
    res.status(501).send({
      message: err.message,
    });
  }
}

/**
 * @name Login User controller
 * @access Public
 * @description Logins user and expects email and password
 */

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide email, username and password");
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
     return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token);

    return res.status(201).send({
      message: "User loggedIn Successfully",
      user: {
        email: user.email,
        username: user.username,
        id: user._id,
      },
    });
  } catch (err) {
    res.status(501).send({
      message: err.message,
    });
  }
}

async function logoutUserController(req,res){
    try{
        
        const token=req.cookies?.token
        if(token){
            
            await blacklistTokenModel.create({token});
        }
        res.clearCookie(token);
        res.status(200).send({
            message:"user loggedOut Successfully",
        })
    }catch (err) {
    res.status(501).send({
      message: err.message,
    });
  }
}

async function getProfile(req,res){
    try{
        const user=await User.findById(req.user.id);
        res.status(200).send({
            message:"Details Fetched Successfully",
            user:{
                id:user._id,
                email:user.email,
                username:user.username
            }
        })
    }catch(err){
         res.status(501).send({
      message: err.message,
    });
    }
}
module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getProfile
};
