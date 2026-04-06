import express from "express"
import { cartModel } from "../models/cartModel.js";
import type { get } from "mongoose";
import { ProductModel } from "../models/productModel.js";

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

interface Itemsprops
{
    productId:string,
    userId:string,
    quantity:number;
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
        let cart= await cartModel.findOne({userId , status:"active"});
        if(!cart)
            {
                cart = await CreateNewCart({userId});
            }
        return cart;
    }   


export const addItemtoCart =async({productId,userId,quantity}:Itemsprops)=> 
    {
        //get the active cart for every user to push in it the item
        const cart = await getActiveCartforuser({userId});         

        //does the item is in the cart?
        const existInCart = cart.items.find((p) => p.product.toString() === productId);
        if(existInCart)
            {
                existInCart.quantity+=quantity;
            }

        //fetch the product 
            const product=await ProductModel.findById(productId)
            if(!product)
                {
                    return {data:"the product is not exist in the stock" , StatusCode:404};
                }
            if(product.stock<quantity)
                {
                    return {data:"Low Stock for Item ",StatusCode:400};
                }    
        //push the item in the cart if it not in the cart already 
            cart.items.push({product:productId , unitPrice:product.price, quantity})    
            cart.TotalAmount+=product.price*quantity;
            
            const updateCart=await cart.save();
            return {data:updateCart , StatusCode:200};
    }


export default getActiveCartforuser    ;