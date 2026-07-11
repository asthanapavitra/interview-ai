const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "Username Already Taken"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Account with this email already exists"],
  },
  password: {
    type: String,
    required: function () {
            // password only required if user did NOT sign up via Google
            return !this.googleId;
        }
  },
  googleId: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("users", userSchema);
