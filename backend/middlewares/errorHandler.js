function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err);

  // SQLite unique constraint fails (e.g. category name)
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({
      success: false,
      message: 'A category with this name already exists.'
    });
  }

  // SQLite foreign key constraint fails
  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(409).json({
      success: false,
      message: 'Database operation failed: Reference constraint violated.'
    });
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
