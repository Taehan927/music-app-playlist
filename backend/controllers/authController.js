// import bcrypt for hashing passwords
const bcrypt = require("bcrypt");

// import jsonwebtoken for creating JWT tokens
const jwt = require("jsonwebtoken");

// import the user model to interact with the users collection in MongoDB
const User = require("../models/User");

// helper function that creates a JWT token for a given user ID
const generateToken = (userId) => {
  // jwt.sign(payload, secret, options)
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    // Token expires in 7 days
    expiresIn: "7d",
  });
};

// handles POST /api/auth/register
const register = async (req, res) => {
  try {
    // extract data from the request body
    const { username, email, password } = req.body;

    // basic validation, all fields must be provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if a user already exists with this email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    // if a user exists, send a 409 response
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }

    // hash the password using bcrypt
    const saltRounds = 10; 
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // create a new user in the database
    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    // generate a JWT token for the newly registered user
    const token = generateToken(newUser._id);

    // return user info and token to the client
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    // log any server errors and respond with 500
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Handles POST /api/auth/login
const login = async (req, res) => {
  try {
    // Get emailOrUsername and password from request body
    const { emailOrUsername, password } = req.body;

    // Make sure both fields are provided
    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ message: "emailOrUsername and password required" });
    }

    // Find user by email OR username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    // If no user found, credentials are invalid
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the plain password with the stored passwordHash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    // If passwords do not match, credentials are invalid
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If credentials are valid, generate a token
    const token = generateToken(user._id);

    // Send back user info and token
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    // Handle any server errors
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Export both controller functions so routes can use them
module.exports = { register, login };
