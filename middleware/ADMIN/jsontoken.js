import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT token
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // Token expired or invalid
  }
};

// Refresh token if expired
const regenerateTokenIfExpired = (token, payload) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return token; // Still valid
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return generateToken(payload); // Regenerate
    }
    return null;
  }
};

export { generateToken, verifyToken, regenerateTokenIfExpired };
