const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized', 401, 'UNAUTHORIZED'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return next(new AppError('User not found', 401, 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
    }

    next();
  };
};

module.exports = { authenticate, authorize };

