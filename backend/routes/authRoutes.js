// import express so we can create a router
const express = require("express");

// create a new router instance
const router = express.Router();

// import the controller functions for register and login
const { register, login } = require("../controllers/authController");


// POST /api/auth/register
router.post("/register", register);


// POST /api/auth/login
router.post("/login", login);

// export the router so server.js can mount it at /api/auth
module.exports = router;
