import { Request,Response } from "express";
import * as service from '../services/authService';

export const login = async(req:Request,res:Response) =>{
    const {email,password} = req.body;
    const response = await service.loginUser(email,password)
    res.status(response.code).json(response)
}

export const registerUser = async(req:Request,res:Response) => {
    const {firstname,lastname,email,password,role} = req.body;
    const response = await service.registerUser(firstname,lastname,email,password,role)
    res.status(response.code).json(response)
}

export const logoutUser = async(req:Request,res:Response) =>{
    const userId = req.user?.id!
    const response = await service.logoutUser(userId)
    res.status(200).json({message:response})
}