import mongoose from "mongoose";

export const connectToDatabase = () => {
    const mongoDB = 'mongodb://127.0.0.1/webshop'
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log("Connected to database")
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
