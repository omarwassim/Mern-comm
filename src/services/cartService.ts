import express from "express"
import { cartModel } from "../models/cartModel.js";
import type { get } from "mongoose";

//make a cartfor the new user and a cart for the user make an completed order and want a new cart

interface NewCartProps
{
    userId:string;
}
interface ActiveCartProps
{
    userId:string;
    status?:string;
}
const CreateNewCart =async({userId}:NewCartProps)=>
    {
        const cart =await cartModel.create({userId , TotalAmount:0});  
        await cart.save();
        return cart;
    }
//if the user cart is not active or the user is new to db 
const getActiveCartforuser = async({userId}:ActiveCartProps)=>
    {
        let cart= await cartModel.findOne({userId , status:" active "});
        if(!cart)
            {
                cart = await CreateNewCart({userId});
            }
        return cart;
    }   

export default getActiveCartforuser    ;