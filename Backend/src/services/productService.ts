import {ProductModel} from "../models/productModel.js"

export const getallProducts = async () =>
    {
        return await ProductModel.find();
    }

const SeedInitalProducts = async ()=>
    {
        const products=
        [
            {title : "laptop lenovo", image :"product 1.jpg" ,price:10,stock :100}
        ]
        
        const isexist= await getallProducts();
        if(isexist.length===0)
            {
                await ProductModel.insertMany(products);
            }
    }    

export default SeedInitalProducts 
