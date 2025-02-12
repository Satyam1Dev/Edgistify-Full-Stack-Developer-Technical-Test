const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  // Expecting header format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token malformed" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now available as req.user.userId, etc.
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
