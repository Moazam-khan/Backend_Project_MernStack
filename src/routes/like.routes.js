import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to protect all routes
router.use(verifyJWT);

// Route to toggle like on a video
router.route("/toggle/v/:videoId").post(toggleVideoLike);

// Route to toggle like on a comment
router.route("/toggle/c/:commentId").post(toggleCommentLike);

// Route to toggle like on a tweet
router.route("/toggle/t/:tweetId").post(toggleTweetLike);

// Route to get all liked videos
router.route("/videos").get(getLikedVideos);

export default router;