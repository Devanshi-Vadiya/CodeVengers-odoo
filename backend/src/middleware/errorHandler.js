const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }
  // Handle Prisma-specific errors
  else if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `The ${field} is already taken.`;
    code = 'UNIQUE_CONSTRAINT';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
    code = 'NOT_FOUND';
  }

  res.status(statusCode).json({
    success: false,
    message,
    code
  });
};

module.exports = errorHandler;

