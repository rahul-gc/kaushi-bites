const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { protect, adminOnly };
