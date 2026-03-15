import  express  from "express";
import getActiveCartforuser from "../services/cartService.js";
import validatejwt from "../middlewares/validatejwt.js";
import {type Extendsuser } from "../middlewares/validatejwt.js";
const router=express.Router();


router.get('/',validatejwt, async (req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const cart=await getActiveCartforuser({userId });
        res.status(200).send(cart);
    })

export default router;    