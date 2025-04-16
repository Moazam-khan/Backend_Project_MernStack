import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

/**
 * Health check controller that provides server status and performance metrics
 */
const healthcheck = asyncHandler(async (req, res) => {
    // Get process uptime
    const uptime = process.uptime();
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();

    // Collect system information
    const healthData = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
        },
        environment: process.env.NODE_ENV || 'development'
    };
    
    // Return a proper API response using our utility
    return res
        .status(200)
        .json(new ApiResponse(200, healthData, "Service is running smoothly"));
});

export {
    healthcheck
}