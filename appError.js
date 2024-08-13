class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = this.constructor.name; // Set the name of the error class
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Mark the error as operational
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
module.exports=AppError;