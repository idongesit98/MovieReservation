import { Request,Response,NextFunction } from "express";
import jwt,{JwtPayload} from 'jsonwebtoken';
import prisma from "../utils/config/database";

export const authenticate = async(req:Request,res:Response,next:NextFunction) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json(
             {message:'Access denied. No token provided.'}
        )
        return;
    }

     try {
       const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;

       if (!decoded || typeof decoded === "string" || !decoded.id) {
            res.status(401).json({message:"Invalid token"})
            return;
       }

       const user = await prisma.user.findUnique({where:{id:decoded.id}})
       if (!user) {
            res.status(401).json({message:"User not found"});
            return;
       }

       req.user = user;
       next();
    } catch (error) {
        res.status(401).json({message:"Invalid token."})
        return
    }
};

export const authorize = (roles:string[]) =>{
     (req:Request,res:Response,next:NextFunction) =>{
        // const user = req.user as {role:string};

        // if (!roles.includes(user.role)) {
        //     res.status(403).json({error:"Access Denied"});
        // }
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({error:"Access denied"})
        }
        next();
    };
    return;
}