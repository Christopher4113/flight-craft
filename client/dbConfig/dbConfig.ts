import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!); //exclamation is for typescript and it's because I can gaurentee that it would connect to mongo url
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB is connected successfully")
        });
        connection.on('error', (error) => {
            console.log('MongoDB has an error please make sure it is running' + error);
            process.exit();
        })
    } catch (error) {
        console.log("Something went wrong!");
        console.log(error);
    }
}