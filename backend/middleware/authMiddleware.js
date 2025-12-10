// import jsonwebtoken, which allows verification of JWT tokens
const jwt = require("jsonwebtoken");

// middleware used to protect routes that require a logged-in user
const authMiddleware = (req, res, next) => {
  // read the authorization header sent by the client
  // expected format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // the user is not authenticated
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // extract the actual token from the header
  const token = authHeader.split(" ")[1];

  try {
    // verify the token using the secret stored in the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // save the user id inside req.user so controllers can use it
    req.user = { id: decoded.id };

    // continue to the next middleware or controller
    next();
  } catch (err) {
    // token is invalid or expired
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// export this middleware so routes can import it
module.exports = authMiddleware;
