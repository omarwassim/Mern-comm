// bos rakez 3ashan dih tarebeeta mabein el cart el user w bayanat el items 
// enta hata3mel document ma5sousa lel CartItem , wa7da tanya lel Cart
// tayb ehh el far2 ? el far2 en el cartItem betet3emel 3ala se3r el 7aga fel a5er ba3d le discount w kemeytha 
//el cart zat nafsaha motasela bel user w beli howa 7ato fel cart 
// el cartItm inherit the the product from the Iproduct , el cart inherit el Item men el cartItem 
// Icart betsheel ehh tayb ? el user w el items w el status (eshtara wala lesa [by enum]) 
// eh el enum howa 3obara 3an aktar men index l 7aga wa7da zai el status(active | complete) el directions (Up | Down | right | Left)
import mongoose ,{Schema ,Document } from "mongoose";

// in typescript the types objects and interface types must be imported with import type 
import type {ObjectId} from "mongoose"
import type {IProduct}  from "./productModel.js";

const StatusCartEnum =["active" , "Completed" ]

export interface ICartItem extends Document
{
    product:IProduct,
    quantity:number,
    unitPrice: number,

}
export interface ICart extends Document
{   
    userId: ObjectId | string ,
    items:ICartItem[],
    TotalAmount:number;
    status: "active" | "Completed"
}

const cartItemSchema = new Schema<ICartItem>({
    product:{type:Schema.Types.ObjectId , ref :"Products" , required:true},
    quantity:{type : Number , required: true , default:1},
    unitPrice:{type: Number, required:true }
});

const CartSchema = new Schema<ICart>({
    userId:{type:Schema.Types.ObjectId, ref:"Users" , required:true},
    items:[cartItemSchema],
    TotalAmount:{type:Number, required:true},
    status:{type:String , enum:StatusCartEnum , default:"active" ,required:true}
    
})

export const cartModel = mongoose.model<ICart>('Carts',CartSchema) 