import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Connected to database');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    // const mongoDB = 'mongodb://127.0.0.1/webshop'
    // mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    // console.log("Connected to database")
    // mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
