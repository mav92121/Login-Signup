import mongoose from "mongoose";
const Schema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
})
const checkDB=mongoose.model("new",Schema);

export default checkDB;