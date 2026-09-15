const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong';

  if (error instanceof SyntaxError && error.status === 400 && error.body) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(', ');
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid contact ID';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'A contact enquiry with these details already exists';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : message
  });
};

module.exports = errorHandler;