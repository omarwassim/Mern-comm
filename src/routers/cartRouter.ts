import  express  from "express";
import getActiveCartforuser, { addItemtoCart, UpdateItemCart } from "../services/cartService.js";
import validatejwt from "../middlewares/validatejwt.js";
import {type Extendsuser } from "../middlewares/validatejwt.js";
const router=express.Router();


router.get('/',validatejwt, async (req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const cart=await getActiveCartforuser({userId });
        res.status(200).send(cart);
    })

router.post('/items',validatejwt,async(req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const {productId,quantity}=req.body;
        const response=await addItemtoCart({userId,productId,quantity})
        res.send(response.data).status(response.StatusCode);
    })

router.put('/items',validatejwt,async(req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const {productId,quantity}=req.body;
        const response=await UpdateItemCart({userId,productId,quantity})
        res.send(response.data).status(response.StatusCode);
    })

export default router;    