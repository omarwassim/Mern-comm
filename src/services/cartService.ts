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


interface updateItemsprops
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


export default getActiveCartforuser ;



export const UpdateItemCart=async({quantity, userId,productId}:updateItemsprops)=>
    {
        const cart = await getActiveCartforuser({userId});
        const existInCart = cart.items.find((p) => p.product.toString() === productId);
        if(!existInCart)
            {
                return {data:"the item is not found in the cart ",StatusCode:400}
            }    

        const product=await ProductModel.findById(productId)
            if(!product)
                {
                    return {data:"the product is not exist in the stock" , StatusCode:404};
                }
            if(product.stock<quantity)
                {
                    return {data:"Low Stock for Item ",StatusCode:400};
                } 
    // how to calculate the cart items and you dont have anyinfo expect the product id that you want to update 
    //you can calculate the otheritems and add it to the new item update 
    existInCart.quantity=quantity;
    //ya3ni men el a5er shouf kol eli fel cart ya3mel kam men 8eir el product eli ana meshwerlak 3alih
    const otherItemsCart=cart.items.filter((p)=>p.product.toString()!==productId);

    //delwa2ty 3ayz forloop telef 3ala montag montag te2oli howa et8ayar wala la2 w tezawedo 3ala el amount 

    let total=otherItemsCart.reduce((sum,product)=>{
        sum+=product.quantity*product.unitPrice;
        return sum;
    },0)

    total+=existInCart.quantity*existInCart.unitPrice;
    cart.TotalAmount=total;
    const updatedCart=await cart.save();
    return{data:updatedCart,StatusCode:200};
    }