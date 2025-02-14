import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Enabling CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow frontend requests from a specific origin
    credentials: true // Allow cookies to be sent with requests
}));

// Middleware to parse JSON request bodies (limited to 16kb)
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded request bodies (also limited to 16kb)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serving static files (e.g., images, CSS, JavaScript) from the "public" folder
app.use(express.static("public"));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

//import routes

import userRouter from "./routes/user.router.js";

//routes declaration  

app.use("/api/v1/users", userRouter);
//http://localhost:3000/api/v1/users/register
export default app;
