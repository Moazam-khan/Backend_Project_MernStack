import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.user; // Assuming `req.user` contains the authenticated user's ID

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (existingSubscription) {
    // Unsubscribe
    await existingSubscription.deleteOne();
    return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
  } else {
    // Subscribe
    const newSubscription = new Subscription({
      channel: channelId,
      subscriber: userId,
    });
    await newSubscription.save();
    return res.status(201).json(new ApiResponse(201, "Subscribed successfully"));
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "name email");
  if (!subscribers.length) {
    return res.status(404).json(new ApiResponse(404, "No subscribers found for this channel"));
  }

  res.status(200).json(new ApiResponse(200, "Subscribers retrieved successfully", subscribers));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate("channel", "name email");
  if (!subscriptions.length) {
    return res.status(404).json(new ApiResponse(404, "No subscriptions found for this user"));
  }

  res.status(200).json(new ApiResponse(200, "Subscribed channels retrieved successfully", subscriptions));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };