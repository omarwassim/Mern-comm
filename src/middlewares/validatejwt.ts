//to make middleware you have to make it (req,res,next)
//to make it use when it send with the router to check the jwt tech

import express, { type NextFunction }  from "express"; 
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";


interface payloadprops
{
    email:string;
    firstName:string;
    lastName:string;
}

export interface Extendsuser extends Request
{
    user?:any;
}

const validatejwt=(req:Extendsuser , res:Response , next:NextFunction)=>
    {   
        // what we have to first we have to check that the header containes authorizationheadre first
        const authorizationHead=req.get('authorization') as string;
        if(!authorizationHead)
        {
            res.status(403).send("the Authorization header was not provided !")
            return;
        }
        //the token located in js in the header part after the bearer  
        const token=authorizationHead.split(" ")[1];
        if(!token)
            {
                res.status(403).send("the Bearer token not found")
                return;
            }
        //second : after you check if the authorizationheader containes value , you have to verify the jwt returned by the user
        jwt.verify(token,"UWy0MjkRNqd07AJXPMRxFQQkbJUUcDsZN4vW9H4cYON",async (err , payload)=>
            {
                if(err)
                    {
                        res.status(403).send("Invalid Token!")
                        return;
                    }
                if(!payload)
                    {
                        res.status(403).send("Invalid token payload")
                        return;
                    }    

                const userprops= payload as payloadprops;    
                // fetch the user payload to compare it with the header 
                const user=await userModel.findOne({email:userprops.email})   
                // to avoid error req.user you have to go to inherit from the Request  a interface by any type to make the data get taken from the request
                req.user=user;
                next();
                
            })              
    }

export default validatejwt;