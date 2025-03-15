// Define an asyncHandler function that takes a request handler function as an argument.
const asyncHandler = (requestHandler) => {
  // Return a new function that takes Express.js request (req), response (res), and next middleware (next).
  return (req, res, next) => {
    // Use Promise.resolve() to ensure that the request handler is always treated as a promise,
    // allowing it to catch both synchronous and asynchronous errors.
    Promise
      .resolve(requestHandler(req, res, next))
      // If any error occurs, pass it to the next middleware (which is usually an error handler).
      .catch((error) => next(error));
  };
};

// Alternative commented-out implementations:

// This is an empty asyncHandler function that does nothing.
// const asyncHandler = () => {}

// A version of asyncHandler that takes a function (fn) but doesn't execute it properly.
// const asyncHandler = (fn) => async () => {}

// A more verbose version of asyncHandler that explicitly uses try-catch.
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     // Execute the function passed to asyncHandler
//     await fn(req, res, next);
//   } catch (error) {
//     // If an error occurs, send a JSON response with an error status and message
//     res
//       .status(error.code || 500) // Default to 500 if no status code is provided
//       .json({ success: false, message: error.message || "An error occurred" });
//   }
// };

// Export the asyncHandler function so it can be used in other parts of the application.
export { asyncHandler };
