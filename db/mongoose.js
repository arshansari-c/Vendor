import mongoose from "mongoose"

export const mongodb = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connect succcesfully")
    } catch (error) {
        console.log("mongodb error",error)
    }
}