const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv").config();
const userValidationError = require("../joiSchema/usejoiSchema");
const mongoose = require("mongoose");
const Group = require('../models/groupModel');


//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, username } = req.body;

  //validate body using joi
  const ans = await userValidationError.validateAsync(req.body);
  // if (!username || !email || !password) {
  //   res.status(400);
  //   throw new Error("All fields are mandatory!");
  // }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }
  const userAvailable1 = await User.findOne({ username });
  if (userAvailable1) {
    res.status(400);
    throw new Error("This username is already ocupied");
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("Hashed Password: ", hashedPassword);
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username
    });
    // console.log(`User created ${user}`);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  }
  catch (error) {
    res.status(400);
    throw new Error(error);
  }

});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const username = email;
  const user = await User.findOne({ $or: [{ username }, { email }] });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user.id,
          username: user.username
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});


//@desc Current user info
//@route GET /api/users
//@access private
const getAllUserr = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});


//@desc Current user info
//@route DELETE /api/users/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {

  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await User.findByIdAndRemove(id).session(session);
    await Group.updateMany({ userIds: id }, { $pull: { userIds: id } }).session(session);
    await Group.deleteMany({ author: id }).session(session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    res.status(400);
    throw new Error(error);
  }
});

module.exports = { registerUser, loginUser, currentUser, getAllUserr, deleteUser };
