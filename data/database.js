import mongoose from "mongoose";

const connectDB=()=>
{
    mongoose.connect("mongodb://127.0.0.1:27017",{
        dbName:"LearnDB",
    }).then(()=>
    {
        console.log("database connected");
    })
}

export default connectDB;