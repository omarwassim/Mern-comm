import express from "express"
import { cartModel } from "../models/cartModel.js";
import type { get } from "mongoose";
import { ProductModel } from "../models/productModel.js";
import { orderModel, type IOrderItem } from "../models/orderModel.js";

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

interface addItemsprops
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
interface ClearItems
{
    userId:string;
}


export const ClearCartForUser=async ({userId}:ClearItems)=>
    {
        
        const cart=await getActiveCartforuser({userId});
        cart.items=[];
        cart.TotalAmount=0;
        const updatedCart=await cart.save();
        return{data:updatedCart,StatusCode:200};
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


export const addItemtoCart =async({productId,userId,quantity}:addItemsprops)=> 
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
        const existInCart = cart.items.find((p) => String(p.product) === String(productId));
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
    const otherItemsCart=cart.items.filter((p)=>String(p.product)!==String(productId));

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

interface DeletedItems
{
    productId:any,
    userId:string,
}

export const DeleteItemFromCart=async({productId,userId}:DeletedItems)=>
{
    const cart=await getActiveCartforuser({userId});
    const existInCart = cart.items.find((p) => String(p.product) === String(productId));
    if(!existInCart)
        {
            return {data:"the item is not found in the cart ",StatusCode:400}
        } 
    const product=await ProductModel.findById(productId)
    if(!product)
        {
            return {data:"the product is not exist in the stock" , StatusCode:404};
        }
    const otherItemsCart=cart.items.filter((p)=>String(p.product)!==String(productId));
    const total=otherItemsCart.reduce((sum,product)=>{
        sum+=product.quantity*product.unitPrice;
        return sum;
    },0)
    cart.items=otherItemsCart;
    cart.TotalAmount=total;
    const updatedCart=await cart.save();
    return{data:updatedCart,StatusCode:200};

}
interface Checkout {
  userId: string;
  address: string;
}
export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: "Please add the address", statusCode: 400 };
  }

  const cart = await getActiveCartforuser({ userId });

  const orderItems: IOrderItem[] = [];

  // Loop cartItems and create orderItems
  for (const item of cart.items) {
    const product = await ProductModel.findById(item.product);

    if (!product) {
      return { data: "Product not found", statusCode: 400 };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    orderItems,
    total: cart.TotalAmount,
    address,
    userId,
  });

  await order.save();

  // Update the cart status to be completed
  cart.status = "Completed";
  await cart.save();

  return { data: order, statusCode: 200 };
};
