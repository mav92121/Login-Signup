import express from "express";
import path from "path";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app=express();
app.set('view engine','ejs');
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

// database connection
const Schema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
})
const checkDB=mongoose.model("check",Schema);
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"LearnDB",
})

const isAuthenticated=async (req,res,next)=>
{
    let user=req.cookies.login;
    if(user)
    {
        const decoded=jwt.verify(user,"secrete");
        req.currUser=await checkDB.findById(decoded._id);
        next();
    }
    else
    {
        res.render('register');
    }
}

app.get("/",isAuthenticated,(req,res)=>
{
    // console.log(req.currUser);
    res.render('home',{name:req.currUser.name});
})
app.get('/login',(req,res)=>
{
    res.render('login');
})
app.get('/logout',(req,res)=>
{
    res.cookie('login',null,{
        expires:new Date(Date.now()),
    })
    res.redirect('/login');
})
app.post('/register',async (req,res)=>
{
    const {name,email,password}=req.body;
    const temp=await checkDB.findOne({email})
    if(!temp) // user no existed
    {
        const currUser=await checkDB.create({
            name,email,password
        });
        const token=jwt.sign({_id:currUser._id},"secrete");
        res.cookie("login",token);
    }
    else // user already existed
    {
        return res.render('login',{message:"user alreay existed please login"});
    }
    res.redirect('/');
})
app.post('/login',async (req,res)=>
{
    const {email,password}=req.body;
    const temp=await checkDB.findOne({email});

    if(!temp)
    {
        return res.render('register',{message:"user not found, register first"})
    }
    else // check the password 
    {
        if(temp.password==password) 
        {
            // login
            const token=jwt.sign({_id:temp._id},"secrete");
            res.cookie("login",token);
            return res.render('home',{name:temp.name});

        }
        else
        {
            // wrong password
            return res.render('login',{message:"incorrect password"});
        }
    }
})

app.listen(3000);