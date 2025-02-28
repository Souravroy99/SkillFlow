import {mongoose} from "mongoose"

export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`\n Mongodb Connected!! DB HOST: ${connectionInstance.connection.host}`)
    } 
    catch(error) {
        console.log("Database connection error: ", error) ;
        process.exit(1) ;
    }
}