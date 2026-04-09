import  express, { Router }  from "express";
import { Login, Register } from "../services/usersServices.js";
const router=express.Router();

router.post('/register', async (req,res)=>
    {
        const {firstName,lastName,email,password}=req.body;
        const {statusCode,data}= await Register({firstName,lastName,email,password});
        res.status(statusCode).send(data);

    })
router.post('/login',async (req,res)=>
    {
        const {email,password}=req.body;
        const {statusCode,data}=await Login({email, password});
        res.status(statusCode).send(data);

    })
export default router;    