import express from "express"
import {getallProducts} from "../services/productService.js"
const router=express.Router();

router.get('/',async (req,res )=>
    {
        const products= await getallProducts();
        res.status(200).send(products)
    })

export default router;    