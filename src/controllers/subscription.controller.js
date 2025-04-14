import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    // Check if channel ID is valid
    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    
    // Check if channel exists
    const channel = await User.findById(channelId)
    if(!channel) {
        throw new ApiError(404, "Channel not found")
    }
    
    // Prevent users from subscribing to themselves
    if(channelId.toString() === req.user?._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }
    
    // Check if subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    })
    
    if(existingSubscription) {
        // If subscription exists, remove it (unsubscribe)
        await Subscription.findByIdAndDelete(existingSubscription._id)
        
        return res
            .status(200)
            .json(new ApiResponse(200, {subscribed: false}, "Unsubscribed successfully"))
    } else {
        // If subscription doesn't exist, create it (subscribe)
        const subscription = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId
        })
        
        if(!subscription) {
            throw new ApiError(500, "Failed to subscribe")
        }
        
        return res
            .status(200)
            .json(new ApiResponse(200, {subscribed: true}, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const {page = 1, limit = 10} = req.query
    
    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    
    // Check if channel exists
    const channel = await User.findById(channelId)
    if(!channel) {
        throw new ApiError(404, "Channel not found")
    }
    
    // Use aggregation to get subscribers with pagination
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: "$subscriberDetails._id",
                    username: "$subscriberDetails.username",
                    fullName: "$subscriberDetails.fullName",
                    avatar: "$subscriberDetails.avatar"
                },
                subscribedAt: "$createdAt"
            }
        },
        {
            $skip: (parseInt(page, 10) - 1) * parseInt(limit, 10)
        },
        {
            $limit: parseInt(limit, 10)
        }
    ])
    
    // Count total subscribers for pagination meta
    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                subscribers,
                totalSubscribers,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalPages: Math.ceil(totalSubscribers / parseInt(limit, 10))
            }, "Channel subscribers fetched successfully")
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const {page = 1, limit = 10} = req.query
    
    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }
    
    // Check if subscriber exists
    const subscriber = await User.findById(subscriberId)
    if(!subscriber) {
        throw new ApiError(404, "Subscriber not found")
    }
    
    // Use aggregation to get subscribed channels with pagination
    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },
        {
            $unwind: "$channelDetails"
        },
        {
            $project: {
                _id: 0,
                channel: {
                    _id: "$channelDetails._id",
                    username: "$channelDetails.username",
                    fullName: "$channelDetails.fullName",
                    avatar: "$channelDetails.avatar",
                    coverImage: "$channelDetails.coverImage"
                },
                subscribedAt: "$createdAt"
            }
        },
        {
            $skip: (parseInt(page, 10) - 1) * parseInt(limit, 10)
        },
        {
            $limit: parseInt(limit, 10)
        }
    ])
    
    // Count total subscribed channels for pagination meta
    const totalSubscribedChannels = await Subscription.countDocuments({
        subscriber: subscriberId
    })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                subscribedChannels,
                totalSubscribedChannels,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalPages: Math.ceil(totalSubscribedChannels / parseInt(limit, 10))
            }, "Subscribed channels fetched successfully")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}