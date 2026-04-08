import { userModel } from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface RegisterParams
{
    firstName:string,
    lastName:string,
    email:string,
    password:string
}
interface LoginParams
{

    email:string,
    password:string
}

export const Register= async ({firstName,lastName,email,password}:RegisterParams)=>
    {
        const findUser=await userModel.findOne({email});
        
        if(findUser)
        {
            return{data:"the User already Exist !" , statusCode:400}
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser = new userModel({firstName,lastName,email,password:hashedPassword})   
        await newUser.save();
        return {data:GenerateJwt({email , firstName:newUser.firstName , lastName:newUser.lastName }), statusCode:201}
    }
   
export const Login = async ({email,password}:LoginParams)=>
    {
        const findUser = await userModel.findOne({email});
        if(!findUser)
        {
            return {data:"The user is not exist ", statusCode:404}
        } 
        const PasswordMatch=await bcrypt.compare(password,findUser.password)
        if(PasswordMatch)
        {
            return {data:GenerateJwt({email , firstName:findUser.firstName , lastName:findUser.lastName }), statusCode:200}
        } 
            return {data:"Incorrect username or password", statusCode:404}
       
    }

const GenerateJwt=(payload:any)=>
    {
        return jwt.sign(payload,'UWy0MjkRNqd07AJXPMRxFQQkbJUUcDsZN4vW9H4cYON' , {expiresIn: '24h'})
    }    