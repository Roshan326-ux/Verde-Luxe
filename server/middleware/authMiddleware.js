import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockStore } from '../config/mockStore.js';
import { getDBStatus } from '../config/db.js';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_greenhole_fashion_jwt_token_key_2026',
    { expiresIn: '30d' }
  );
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_greenhole_fashion_jwt_token_key_2026'
      );

      const dbStatus = getDBStatus();
      if (dbStatus.isMongoConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = mockStore.findUserById(decoded.id);
        if (found) {
          const { password, ...userWithoutPass } = found;
          req.user = userWithoutPass;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
