const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");


async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({
        message: "User with the same email or username already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password, username } = req.body;

    const user = await userModel.findOne({
      $or: [{ email }, { username }]
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
      message: "User fetched successfully",
      user
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function logoutUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      await redis.set(token, Date.now().toString(), "EX", 60 * 60);
    }

    return res.status(200).json({
      message: "Logout successfully"
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { registerUser, loginUser, getMe, logoutUser };