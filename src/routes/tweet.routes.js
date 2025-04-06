import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route to get all tweets of a specific user (no JWT required)
router.route("/user/:userId").get(getUserTweets);

// Routes protected by JWT
router.use(verifyJWT);

// Route to create a new tweet
router.route("/").post(createTweet);

// Routes to update or delete a specific tweet
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;