// Importing the asyncHandler utility to handle asynchronous errors in middleware
import { asyncHandler } from "../utils/asyncHandler.js";

// Importing the custom ApiError class to throw consistent error responses
import { ApiError } from "../utils/ApiError.js";

// Importing the jsonwebtoken library to verify JWT tokens
import jwt from "jsonwebtoken";

// Importing the User model to fetch user details from the database
import { User } from "../models/user.model.js";

// Exporting the verifyJWT middleware function
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extracting the token from cookies or the Authorization header
    const token =
      req.cookies?.accessToken || // Check if the token is in cookies
      req.header("Authorization")?.replace("Bearer", ""); // Check if the token is in the Authorization header

    // If no token is found, throw an unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verifying the token using the secret key from environment variables
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetching the user from the database using the user ID from the decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken" // Exclude sensitive fields like password and refreshToken
    );

    // If the user is not found, throw an invalid access token error
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Attach the user object to the request object for use in subsequent middleware or routes
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // If any error occurs, throw an unauthorized error with the error message
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});


// Here is a detailed explanation of the code in auth.middleware.js:

// ```javascript
// // Importing the asyncHandler utility to handle asynchronous errors in middleware
// import { asyncHandler } from "../utils/asyncHandler.js";

// // Importing the custom ApiError class to throw consistent error responses
// import { ApiError } from "../utils/ApiError.js";

// // Importing the jsonwebtoken library to verify JWT tokens
// import jwt from "jsonwebtoken";

// // Importing the User model to fetch user details from the database
// import { User } from "../models/user.model.js";

// // Exporting the verifyJWT middleware function
// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     // Extracting the token from cookies or the Authorization header
//     const token =
//       req.cookies?.accessToken || // Check if the token is in cookies
//       req.header("Authorization")?.replace("Bearer", ""); // Check if the token is in the Authorization header

//     // If no token is found, throw an unauthorized error
//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }

//     // Verifying the token using the secret key from environment variables
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // Fetching the user from the database using the user ID from the decoded token
//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken" // Exclude sensitive fields like password and refreshToken
//     );

//     // If the user is not found, throw an invalid access token error
//     if (!user) {
//       throw new ApiError(401, "Invalid access token");
//     }

//     // Attach the user object to the request object for use in subsequent middleware or routes
//     req.user = user;

//     // Call the next middleware or route handler
//     next();
//   } catch (error) {
//     // If any error occurs, throw an unauthorized error with the error message
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// });
// ```

// ### Line-by-Line Explanation

// 1. **`import { asyncHandler } from "../utils/asyncHandler.js";`**
//    - Imports the `asyncHandler` utility to handle asynchronous errors in middleware. This ensures that any errors in the middleware are passed to the global error handler.

// 2. **`import { ApiError } from "../utils/ApiError.js";`**
//    - Imports the `ApiError` class to throw consistent error responses with a status code, message, and other details.

// 3. **`import jwt from "jsonwebtoken";`**
//    - Imports the `jsonwebtoken` library to verify and decode JSON Web Tokens (JWTs).

// 4. **`import { User } from "../models/user.model.js";`**
//    - Imports the `User` model to fetch user details from the database.

// 5. **`export const verifyJWT = asyncHandler(async (req, res, next) => {`**
//    - Exports the `verifyJWT` middleware function. This function is wrapped in `asyncHandler` to handle asynchronous errors.

// 6. **`const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");`**
//    - Extracts the token from either the `accessToken` cookie or the `Authorization` header. If the token is in the `Authorization` header, it removes the "Bearer" prefix.

// 7. **`if (!token) { throw new ApiError(401, "Unauthorized request"); }`**
//    - If no token is found, throws an `ApiError` with a 401 status code and the message "Unauthorized request".

// 8. **`const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);`**
//    - Verifies the token using the secret key from environment variables (`ACCESS_TOKEN_SECRET`). If the token is invalid, an error will be thrown.

// 9. **`const user = await User.findById(decodedToken?._id).select("-password -refreshToken");`**
//    - Fetches the user from the database using the `_id` from the decoded token. Excludes sensitive fields like `password` and `refreshToken` from the result.

// 10. **`if (!user) { throw new ApiError(401, "Invalid access token"); }`**
//     - If no user is found in the database, throws an `ApiError` with a 401 status code and the message "Invalid access token".

// 11. **`req.user = user;`**
//     - Attaches the user object to the `req` object so that subsequent middleware or route handlers can access the authenticated user's details.

// 12. **`next();`**
//     - Calls the next middleware or route handler in the request-response cycle.

// 13. **`catch (error) { throw new ApiError(401, error?.message || "Invalid access token"); }`**
//     - If any error occurs during the process, throws an `ApiError` with a 401 status code and the error message.

// ### Conclusion

// The `verifyJWT` middleware is responsible for authenticating requests by verifying the JWT token provided in the cookies or the `Authorization` header. If the token is valid, it fetches the user from the database and attaches the user object to the `req` object. If the token is invalid or the user does not exist, it throws an appropriate error.

// This middleware ensures that only authenticated users can access protected routes. It is typically used in routes where authentication is required, such as updating user details, accessing private data, or performing actions on behalf of the user.