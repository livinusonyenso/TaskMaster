const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure the path is correct and matches the actual file

// Middleware to protect routes
async function protect(req, res, next) {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach authenticated user to the request
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    // Handle token verification errors and other issues
    console.error('Error in protect middleware:', error.message);
    res.status(401).json({
      message: error.name === 'JsonWebTokenError' ? 'Invalid token' : error.message,
    });
  }
}

module.exports = { protect };
