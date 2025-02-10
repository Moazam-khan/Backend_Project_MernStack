class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.stack = stack;
    this.data = null;
    this.errors = errors;

    if (statck){
        this.stack = stack;
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}
