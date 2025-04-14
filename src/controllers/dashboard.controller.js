import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get channel statistics like total video views, subscribers, videos, likes
    const userId = req.user?._id;
    
    if(!userId) {
        throw new ApiError(401, "Unauthorized request")
    }
    
    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })
    
    // Get total videos and views using aggregation
    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ])
    
    const totalVideos = videoStats[0]?.totalVideos || 0
    const totalViews = videoStats[0]?.totalViews || 0
    
    // Get total likes on all videos
    const likesOnVideos = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $match: {
                "videoDetails.owner": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalLikes"
        }
    ])
    
    const totalLikes = likesOnVideos[0]?.totalLikes || 0
    
    // Get recent subscribers (last 7 days)
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const recentSubscribers = await Subscription.countDocuments({
        channel: userId,
        createdAt: { $gte: last7Days }
    })
    
    // Get videos published in last 30 days
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const recentVideos = await Video.countDocuments({
        owner: userId,
        createdAt: { $gte: last30Days }
    })
    
    return res.status(200).json(
        new ApiResponse(200, {
            totalSubscribers,
            totalVideos,
            totalViews,
            totalLikes,
            channelStats: {
                last7DaysSubscribers: recentSubscribers,
                last30DaysVideos: recentVideos
            }
        }, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all videos uploaded by the channel with pagination and sorting
    const userId = req.user?._id;
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;
    
    if(!userId) {
        throw new ApiError(401, "Unauthorized request")
    }
    
    const sortOptions = {}
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1
    
    const videosAggregate = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                videoFile: 1,
                thumnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: 1,
                createdAt: 1,
                likesCount: 1
            }
        },
        {
            $sort: sortOptions
        }
    ])
    
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    
    // Use mongoose-aggregate-paginate-v2 for pagination
    const videos = await Video.aggregatePaginate(videosAggregate, options)
    
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos: videos.docs,
                totalVideos: videos.totalDocs,
                page: videos.page,
                totalPages: videos.totalPages,
                hasPrevPage: videos.hasPrevPage,
                hasNextPage: videos.hasNextPage,
                prevPage: videos.prevPage,
                nextPage: videos.nextPage
            },
            "Channel videos fetched successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
}



// # Understanding Dashboard Controller Routes

// These two routes provide channel analytics and content management features for a YouTube-like platform. They're designed for creators to monitor their channel performance and manage their videos.

// ## 1. getChannelStats

// This route provides comprehensive statistics about the user's channel:

// - **Purpose**: Shows an overview of channel performance metrics
// - **Access**: Only available to authenticated users for their own channel
// - **Data Returned**:
//   - **Total Subscribers**: Number of users subscribed to the channel
//   - **Total Videos**: Count of videos uploaded by the channel
//   - **Total Views**: Cumulative views across all videos
//   - **Total Likes**: Sum of likes received on all videos
//   - **Recent Activity**:
//     - Subscribers gained in the last 7 days
//     - Videos published in the last 30 days

// This is similar to the "Analytics" tab in YouTube Studio, giving creators a quick snapshot of their channel's performance and growth.

// ## 2. getChannelVideos

// This route retrieves a paginated list of all videos uploaded by the user:

// - **Purpose**: Allows creators to browse and manage their video library
// - **Access**: Only available to authenticated users for their own videos
// - **Features**:
//   - **Pagination**: Splits results into pages (default: 10 videos per page)
//   - **Sorting**: Can sort by creation date, views, etc. (default: newest first)
//   - **Enhanced Data**: Includes like counts for each video
//   - **Metadata**: Provides pagination info (total pages, next/prev page links)

// This is similar to the "Content" tab in YouTube Studio, where creators can see all their uploaded videos in an organized list.

// ## How They Work Together

// These two routes form a basic channel dashboard:
// - **Stats** gives the big-picture overview of channel performance
// - **Videos** provides detailed management of individual content pieces

// They're typically used in a creator dashboard where the stats would appear at the top as summary cards or charts, and the videos would be displayed below as a sortable, paginated table.

// ## Technical Implementation

// Both routes use MongoDB aggregation pipelines for efficient data processing, with features like:
// - Cross-collection lookups (from videos to likes)
// - Conditional date filtering (for recent stats)
// - Dynamic sorting options
// - Proper pagination

// This approach keeps database operations efficient even as the channel grows to have many videos, subscribers, and engagement metrics.