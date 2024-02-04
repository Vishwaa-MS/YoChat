const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const signupUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  try {
    const hashPw = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashPw,
      pic: pic,
    });
    const result = await user.save();
    res.status(201).json({
      _id: result._id,
      name: result.name,
      email: result.email,
      pic: result.pic,
      token: generateToken(result._id),
      message: "User Created!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong Password, Enter the correct password");
      error.statusCode = 401;
      throw error;
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      message: "login successful",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

const allUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json(users);
});

module.exports = { signupUser, loginUser, allUsers };
