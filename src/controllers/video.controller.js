import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const queryObj = {};
  if (query) {
    queryObj.title = { $regex: query, $options: "i" }; // Search by title
  }
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    queryObj.owner = userId; // Filter by owner
  }

  const sortObj = {};
  if (sortBy) {
    sortObj[sortBy] = sortType === "desc" ? -1 : 1; // Sorting
  }

  const videos = await Video.find(queryObj)
    .populate("owner", "username email fullName avatar") // Populate owner details
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalVideos = await Video.countDocuments(queryObj);
  const totalPages = Math.ceil(totalVideos / limit);

  res.status(200).json(
    new ApiResponse(200, "Videos fetched successfully", {
      videos,
      totalVideos,
      totalPages,
      currentPage: page,
    })
  );
});

// Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  const videoFile = req.files?.videoFile?.[0]?.path;
  const thumbnail = req.files?.thumbnail?.[0]?.path;

  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const uploadedVideo = await uploadOnCloudinary(videoFile);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnail);

  if (!uploadedVideo || !uploadedThumbnail) {
    throw new ApiError(500, "Failed to upload video or thumbnail");
  }

  const newVideo = await Video.create({
    videoFile: uploadedVideo.url,
    thumnail: uploadedThumbnail.url,
    title,
    description,
    duration,
    owner: req.user._id, // Associate the video with the logged-in user
  });

  res.status(201).json(
    new ApiResponse(201, "Video uploaded successfully", newVideo)
  );
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    console.log("Received videoId:", videoId); // Debugging log
  
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }
  
    const video = await Video.findById(videoId).populate(
      "owner",
      "username email fullName avatar"
    );
  
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  
    res.status(200).json(new ApiResponse(200, "Video fetched successfully", video));
  });
// Update video
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const updatedData = { title, description };
  if (req.file) {
    const uploadedThumbnail = await uploadOnCloudinary(req.file.path);
    updatedData.thumnail = uploadedThumbnail.url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, updatedData, {
    new: true,
  }).populate("owner", "username email fullName avatar");

  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Video updated successfully", updatedVideo)
  );
});

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, "Video deleted successfully"));
});

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res.status(200).json(
    new ApiResponse(200, "Video publish status toggled successfully", video)
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};