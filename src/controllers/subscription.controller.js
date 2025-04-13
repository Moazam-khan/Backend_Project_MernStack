import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Toggle subscription for a channel.
 * If the user is already subscribed, unsubscribe them.
 * If the user is not subscribed, subscribe them.
 */
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.user; // Assuming `req.user` contains the authenticated user's ID

  // Validate channel ID
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if the channel exists
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // Check if the user is already subscribed
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (existingSubscription) {
    // Unsubscribe the user
    await existingSubscription.deleteOne();
    return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
  } else {
    // Subscribe the user
    const newSubscription = new Subscription({
      channel: channelId,
      subscriber: userId,
    });
    await newSubscription.save();
    return res.status(201).json(new ApiResponse(201, "Subscribed successfully"));
  }
});

/**
 * Get all subscribers of a specific channel.
 * Returns a list of users who have subscribed to the channel.
 */
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate channel ID
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Find all subscribers for the channel
  const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "name email");
  if (!subscribers.length) {
    return res.status(404).json(new ApiResponse(404, "No subscribers found for this channel"));
  }

  res.status(200).json(new ApiResponse(200, "Subscribers retrieved successfully", subscribers));
});

/**
 * Get all channels a user is subscribed to.
 * Returns a list of channels the user has subscribed to.
 */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // Validate subscriber ID
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  // Find all subscriptions for the user
  const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate("channel", "name email");
  if (!subscriptions.length) {
    return res.status(404).json(new ApiResponse(404, "No subscriptions found for this user"));
  }

  res.status(200).json(new ApiResponse(200, "Subscribed channels retrieved successfully", subscriptions));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };