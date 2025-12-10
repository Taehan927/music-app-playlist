// import mongoose to connect to MongoDB
const mongoose = require("mongoose");

// connect the app to MongoDB
const connectDB = async () => {
  try {
    // Use the connection string stored in the .env file (MONGO_URI)

    const conn = await mongoose.connect(process.env.MONGO_URI);

    // log a success message with the server
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // log the error message
    console.error("MongoDB connection error:", error.message);

    // exit the Node process with a failure code (1)
    process.exit(1);
  }
};

// export the function so it can be used in server.js
module.exports = connectDB;
