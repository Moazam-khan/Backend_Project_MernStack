// Importing required dependencies
import express from "express"; // Express framework for building APIs
import cookieParser from "cookie-parser"; // Middleware to parse cookies from incoming requests
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing (CORS)


// Creating an instance of an Express application
const app = express();

// Enabling CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow frontend requests only from a specific origin (set in environment variables)
    credentials: true // Allow cookies to be sent along with requests (useful for authentication)
}));

// Middleware to parse JSON request bodies (useful for handling API requests)
// Limits the request body size to 16kb to prevent large payloads from overloading the server
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded request bodies (data from forms, etc.)
// `extended: true` allows parsing of rich objects and arrays
// Limits the request body size to 16kb for security reasons
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serving static files (e.g., images, CSS, JavaScript) from the "public" folder
// This allows the server to serve assets without needing additional routes
app.use(express.static("public"));

// Middleware to parse cookies from incoming requests
// Helps in handling authentication tokens and session management
app.use(cookieParser());

// Importing routes (already done above)
// This section could be used for additional route imports in the future


// Importing user-related routes from `user.router.js`
import userRouter from "./routes/user.routes.js"; // Importing user-related routes
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
// Declaring API routes
// All requests starting with "/api/v1/users" will be handled by `userRouter`
app.use("/api/v1/users", userRouter);
//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
// Example usage: Sending a POST request to "http://localhost:3000/api/v1/users/register" will be routed to `userRouter`

// Exporting the `app` instance so it can be used in `server.js` or other files
export default app;
