import jwt from 'jsonwebtoken';
import checkDB from '../model/userDatabase.js'

export const isAuthenticated=async (req,res,next)=>
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

export const home=(req,res)=>
{
    // console.log(req.currUser);
    res.render('home',{name:req.currUser.name});
}
export const getLogin=(req,res)=>
{
    res.render('login');
}
export const getLogout=(req,res)=>
{
    res.cookie('login',null,{
        expires:new Date(Date.now()),
    })
    res.redirect('/login');
}

export const postReg=async (req,res)=>
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
}

export const postLogin=async (req,res)=>
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
}