import mongoose from "mongoose";

// export const connectToDatabase = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// }

export const connectToDatabase = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
    }).catch((err) => {
        console.error(err.message)
        process.exit(1)
    })
}
