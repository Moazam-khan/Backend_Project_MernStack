// Define a custom error class named ApiError that extends the built-in Error class
class ApiError extends Error {
  constructor(
    statusCode, // HTTP status code (e.g., 404, 500)
    message = "Something went wrong", // Default error message
    errors = [], // Additional error details (optional)
    stack = "" // Stack trace (if available)
    // errorCode = "UNKNOWN_ERROR",  // Custom error code identifier
    //   data = null,  // Additional data related to the error (optional)
    //  fileName = "",  // The name of the file where the error occurred
    //   method = "",  // The HTTP method (e.g., GET, POST) where the error happened
    //  url = ""  // The URL where the error occurred
  ) {
    super(message); // Call the parent Error class constructor with the message

    this.statusCode = statusCode; // Store the HTTP status code
    this.message = message; // Store the error message
    this.success = false; // Always set to false to indicate failure
    this.errors = errors; // Store additional error details
    //  this.errorCode = errorCode;  // Store the custom error code
    this.data = data; // Store any additional error-related data
    this.stack = stack;

    //this.timestamp = new Date().toISOString();  // Store the timestamp of the error
    //  this.fileName = fileName;  // Store the file where the error occurred
    //  this.method = method;  // Store the HTTP method associated with the error
    //  this.url = url;  // Store the URL where the error occurred

    // Capture the stack trace if not provided
    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Method to log the error details to the console
  log() {
    console.error(
      `[${this.timestamp}] [${this.statusCode}] [${this.method} ${this.url}] [${this.fileName}] ${this.message}`
    );
  }
}

// Export the ApiError class for use in other modules
export { ApiError };
