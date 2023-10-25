import express from "express";
import path from "path";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from './data/database.js'
import router from "./routes/userRoutes.js";

const app=express();

app.set('view engine','ejs');
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(router);

// database connection
connectDB();

app.listen(3000);