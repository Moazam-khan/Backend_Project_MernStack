Making and learing a beckedn with complex project :
where its schema is given here [ModelLink](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)"# Backend_Project_MernStack" 


This project follows a structured and scalable approach for building an Express.js server. It includes:

✅ Middleware for CORS, JSON parsing, URL encoding, and static file serving to enhance security and performance.
✅ Async handler utility (asyncHandler) to simplify error handling in asynchronous route handlers.
✅ Standardized API response class (ApiResponse) for consistent success responses.
✅ Custom API error class (ApiError) to provide meaningful error messages and stack traces.


### **Example Usage**  

```javascript
import express from "express";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = [{ id: 1, name: "Moazam" }, { id: 2, name: "Talal" }];
    res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
  })
);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json(new ApiError(err.statusCode, err.message));
});

app.listen(5000, () => console.log("Server running on port 5000"));
```

### **🔹 Explanation:**  
- This defines a `/users` route that returns a list of users.
- The **asyncHandler** ensures automatic error handling.
- The **ApiResponse** provides a structured success response.
- The **ApiError** ensures proper error messages and status codes.  

This makes the **code cleaner, reusable, and easier to maintain**. 🚀
With this setup, the application ensures better error management, improved API response consistency, and a clean, maintainable codebase. 🚀




# bcrypt & JWT Explained

## 1. bcrypt (Password Hashing)
**bcrypt** is a password-hashing library that helps securely store passwords by generating a hash with a salt.

### Example (Node.js with bcrypt.js)
```javascript
const bcrypt = require('bcrypt');

const password = "mySecurePassword";
const saltRounds = 10;

// Hash password
bcrypt.hash(password, saltRounds, (err, hash) => {
    console.log("Hashed Password:", hash);

    // Verify password
    bcrypt.compare(password, hash, (err, result) => {
        console.log("Password Match:", result); // true
    });
});


## 2. JWT (JSON Web Token)
**JWT** is used for secure authentication between a client and a server. It encodes user information in a token format.

### Example (Node.js with jsonwebtoken)
javascript
const jwt = require('jsonwebtoken');

const user = { id: 1, username: "moazam" };
const secretKey = "mySecretKey";

// Generate JWT
token = jwt.sign(user, secretKey, { expiresIn: "1h" });
console.log("Generated Token:", token);

// Verify JWT
const decoded = jwt.verify(token, secretKey);
console.log("Decoded Data:", decoded);
```

## Use Case:
- **bcrypt** → Securely hash and verify user passwords before storing them in a database.
- **JWT** → Generate and verify tokens for user authentication in web applications.

### Installation
To use these libraries, install them using npm:
```sh
npm install bcrypt jsonwebtoken
```

### Author
Moazam Khan



Here’s a well-structured definition and comparison for **Access Token** and **Refresh Token** that you can add to your GitHub README file:

---

### **Access Token vs. Refresh Token**  

#### **Access Token**  
An **Access Token** is a short-lived credential used to authenticate and authorize requests to a protected resource, such as an API or a web service. It is usually included in the `Authorization` header as a Bearer token and is required for making authenticated API requests.

#### **Refresh Token**  
A **Refresh Token** is a long-lived credential used to obtain a new Access Token without requiring the user to log in again. It is securely stored and used when the Access Token expires, ensuring continuous authentication.

#### **Differences Between Access Token and Refresh Token**  

| Feature           | Access Token | Refresh Token |
|------------------|-------------|--------------|
| **Purpose**       | Used for authenticating API requests | Used for generating a new Access Token when it expires |
| **Lifespan**      | Short-lived (e.g., minutes to hours) | Long-lived (e.g., days to weeks) |
| **Storage**       | Stored in memory (or HTTP-only cookies) | Stored securely (e.g., in a database or HTTP-only cookies) |
| **Security Risk** | Higher risk if leaked, as it grants direct access | Lower risk but still sensitive, as it can generate new Access Tokens |
| **Usage**        | Sent in API requests via `Authorization` header | Sent to the authentication server to request a new Access Token |
| **Revocation**   | Cannot be revoked manually, expires naturally | Can be revoked by the authentication server if needed |

---

Let me know if you want any modifications or improvements! 🚀