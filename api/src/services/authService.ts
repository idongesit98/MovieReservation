import prisma from "../utils/config/database"
import jwt from "jsonwebtoken"
import { errorResponse, successResponse } from "../utils/config/responseFormat"
import { comparePassword, hashPassword} from "../utils/config/hash"
import { UserRole } from "@prisma/client"
import { redisClient } from "../utils/config/redis"

export const registerUser = async(firstname:string,lastname:string,email:string,password:string,role:string)=>{
    try {
        const existing = await prisma.user.findUnique({where:{email}})
        if (existing) {
            return errorResponse(400,"User already exist",null)
        }
        const hashedPassword = await hashPassword(password);

        const normalizedRole = Object.values(UserRole).includes(role as UserRole)
            ? (role as UserRole) : UserRole.USER;

        const newUser = await prisma.user.create({
            data:{
                firstname,
                lastname,
                email,
                password:hashedPassword,
                role:normalizedRole
            }
        })

        const {password:_p,...userWithoutPassword} = newUser;
        return successResponse(201,"User signed up successfully",{User:userWithoutPassword})
    } catch (error) {
        console.error("SignUp Error",error)
         const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to SignUp User",null,errorMessage)
    }
}

export const loginUser = async(email:string,password:string) =>{
    try {
        const user = await prisma.user.findUnique({where:{email}})
        if (!user) {
            return errorResponse(403,"No email found",null)
        }

        const correctPassword = await comparePassword(password,user?.password)
        const {password:_password,...userwithoutPassword} = user

        if (!correctPassword) {
            return errorResponse(401,"Invalid credentials",null)
        }

        const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET!,{expiresIn:"7d"});

        await redisClient.setEx(`token:${token}`,600,token)
        return successResponse(200,"User signed in successfully", {Data:{user:userwithoutPassword,token:token}})
    } catch (error) {
         console.error("Login error",error)
       
        return errorResponse(500,"Couldnt login user",null,error)
    }
}


export const logoutUser = async(token:string) =>{
    await redisClient.del(`token:${token}`);
    return {message:"Logged out successfully"}
}