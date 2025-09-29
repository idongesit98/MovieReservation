import { Request,Response } from "express";
import * as service from '../services/theatreService';

export const addTheatre = async(req:Request,res:Response) =>{
    const {theatre_name,location,contact_info} = req.body;
    const response = await service.createTheatre(theatre_name,location,contact_info)
    res.status(response.code).json(response);
}

export const singleTheatre = async(req:Request,res:Response) =>{
    const {theatreId} = req.params;
    const response = await service.singleTheatre(theatreId)
    res.status(response.code).json(response)
}

export const theatreUpdate = async(req:Request,res:Response) =>{
    const {theatre_name,location,contact_info} = req.body;
    const {theatreId} = req.params;
    const response = await service.updateTheatre(theatreId,theatre_name,location,contact_info)
    res.status(response.code).json(response)
} 

export const alltheatre = async(req:Request,res:Response) =>{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10
    const response = await service.getAllTheatres(page,limit)
    res.status(response.code).json(response)
}

export const theatreDeleted = async(req:Request,res:Response) =>{
    const {theatreId} = req.params;
    const response = await service.deleteTheatre(theatreId);
    res.status(response.code).json(response);
};
