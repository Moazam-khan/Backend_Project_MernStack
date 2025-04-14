import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

// For subscribing/unsubscribing
router.route("/c/:channelId").post(toggleSubscription);

// For getting subscribers of a channel
router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);

// For getting channels a user has subscribed to
router.route("/u/:subscriberId/channels").get(getSubscribedChannels);

export default router