import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public route: Get all videos
router.route("/").get(getAllVideos);

// Protected routes: Require JWT for upload, update, and delete
router
  .route("/")
  .post(
    verifyJWT, // Ensure the user is authenticated
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById) // Public route: Get video by ID
  .delete(verifyJWT, deleteVideo) // Protected route: Delete video
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo); // Protected route: Update video

router
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, togglePublishStatus); // Protected route: Toggle publish status

export default router;