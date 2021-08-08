const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  const key = process.env.JWT_SECRET;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      err: "User dosent exist",
    });
  }

  const isAuth = await bcrypt.compare(password, user.password);
  if (isAuth) {
    const payLoad = {
      email: user.email,
      password: user.password,
    };

    const token = await jwt.sign(payLoad, key);
    res.json({
      success: "logged in..",
      userId: user._id,
      token,
    });
  } else {
    res.json({
      err: "Wrong Password",
    });
  }
};

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  let { photo } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.json({
      err: "User already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    photo,
  });

  await newUser.save((err) => {
    if (err) {
      return res.json({
        err,
      });
    }
  });
  res.json({
    userId: newUser._id,
    success: "Successfully signed up",
  });
};
