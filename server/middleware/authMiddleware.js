import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 🔴 Extra safety check
      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'No valid token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ✅ important
    } catch (error) {
      console.error("JWT ERROR:", error.message);

      return res.status(401).json({
        message: 'Not authorized, token failed',
      });
    }
  }

  return res.status(401).json({
    message: 'Not authorized, no token',
  });
};