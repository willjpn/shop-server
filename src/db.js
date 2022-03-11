import mongoose from "mongoose";

export const connectToDatabase = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
    }).catch((err) => {
        console.error(err.message)
        process.exit(1)
    })
}
