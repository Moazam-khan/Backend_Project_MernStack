import mongoose, {Schema} from 'mongoose';


const subsciptioSchema = new Schema({

    subscriber:{

        type : Schema.Types.ObjectId, // one who is using the subscription
        ref : "User",

    },

    channel:{

        type : Schema.Types.ObjectId, // one who is providing the subscription
        ref : "User",

    }
}, {timestamps : true});


export const Subsciption = mongoose.model("Subscription",subsciptioSchema);

