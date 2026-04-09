import  express  from "express";
import getActiveCartforuser, { addItemtoCart, checkout, ClearCartForUser, DeleteItemFromCart, UpdateItemCart } from "../services/cartService.js";
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
        res.status(response.StatusCode).send(response.data);
    })

router.put('/items',validatejwt,async(req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const {productId,quantity}=req.body;
        const response=await UpdateItemCart({userId,productId,quantity})
        res.status(response.StatusCode).send(response.data);
    })
    
router.delete('/items/:productId',validatejwt,async(req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const {productId}=req.params;
        const response=await DeleteItemFromCart({userId,productId})
        res.status(response.StatusCode).send(response.data);


})
router.delete('/',validatejwt,async(req:Extendsuser,res)=>
    {
        const userId=req.user._id;
        const response=await ClearCartForUser({userId})
        res.status(response.StatusCode).send(response.data);
})

router.post("/checkout", validatejwt, async (req: Extendsuser, res) => {
  try {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    res.status(response.statusCode).send(response.data);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});
export default router;    