const User = require("../models/user.model");
const BlackListModel=require("../models/blacklist-token.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const blacklistTokenModel = require("../models/blacklist-token.model");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

    res.cookie("token", token,{
       httpOnly: true,
  secure: true,      // HTTPS only
  sameSite: "None",  // Required for cross-site cookies
  maxAge: 24 * 60 * 60 * 1000 // Optional: 1 day
    });

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });

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

/**
 * @name Google Auth controller
 * @access Public
 * @description Logs in or registers a user via Google Sign-In
 */
async function googleAuthController(req, res) {
  try {
    const { credential } = req.body; // the ID token sent from frontend

    if (!credential) {
      return res.status(400).send("Google credential missing");
    }

    // Verify the token is real and actually issued by Google for YOUR app
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;
    // 'sub' is Google's unique permanent ID for this user

    let user = await User.findOne({ email });

    if (!user) {
      // New user — create account
      // generate a unique-ish username from their email since your schema requires one
      let baseUsername = email.split("@")[0];
      let username = baseUsername;
      let counter = 1;

      // ensure username is unique
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        email,
        username,
        googleId,
      });
    } else if (!user.googleId) {
      // Existing email/password user signing in with Google for the first time
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      message: "Logged in with Google successfully",
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
module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getProfile,
  googleAuthController
  
};
