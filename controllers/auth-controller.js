const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.logIn = async (req, res) => {
  const { email, pass } = req.body;
  const key = process.env.JWT_SECRET;

  const tempUser = await User.findOne({ email });
  if (!tempUser) {
    return res.json({
      err: "User dosent exist",
    });
  }

  const isAuth = await bcrypt.compare(pass, tempUser.password);
  if (isAuth) {
    const payLoad = {
      email: tempUser.email,
      password: tempUser.password,
    };

    const token = await jwt.sign(payLoad, key);
    res.json({
      success: "logged in..",
      token: token,
    });
  } else {
    res.json({
      err: "Wrong Password",
    });
  }
};

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, pass } = req.body;
  let { photo } = req.body;

  const tempUser = await User.findOne({ email });
  if (tempUser) {
    return res.json({
      err: "User already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(pass, 10);
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
    success: "Successfully signed up",
  });
};
