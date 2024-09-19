const jwt = require('jsonwebtoken');

// Middleware function to protect routes
const authGuard = (req, res, next) => {
  // Get token from request header
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.jwt_secret); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authGuard;
