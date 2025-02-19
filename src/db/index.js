import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
   
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to MongoDB :) : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("ERROR index file: ", error);
        process.exit(1);
    }
};

export default connectDB;
