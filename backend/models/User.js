// import mongoose so we can define a schema and model
const mongoose = require("mongoose");

// define the structure (schema) of a user document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // username field, must be unique and required
    username: {
      type: String,        // value must be a string
      required: true,      // field is required
      unique: true,        // no two users can have the same username
      trim: true,          // remove extra spaces at beginning/end
    },

    // email field, must be unique and required
    email: {
      type: String,
      required: true,
      unique: true,        // no two users can have the same email
      lowercase: true,     // save email in lowercase form
      trim: true,
    },

    // hashed password (we never store the plain password)
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    // adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// create and export a user model based on the schema
// allows for User.find(), User.create(), etc.
module.exports = mongoose.model("User", userSchema);
