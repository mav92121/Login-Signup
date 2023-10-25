import express from 'express'
import {getLogin, getLogout, home, isAuthenticated, postLogin, postReg} from '../controller/user.js';

const router=express.Router();


router.get('/',isAuthenticated,home);

router.get('/login',getLogin);

router.get('/logout',getLogout);

router.post('/register',postReg);

router.post('/login',postLogin);
// router.get('/',(req,res)=>
// {
//     res.send({
//         message:"true",
//     })
// })

export default router;