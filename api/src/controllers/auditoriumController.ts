import { Request,Response } from "express";
import * as services from '../services/auditoriumServices'

export const addAuditorium = async(req:Request,res:Response) =>{
    const {name,capacity,seatLayout} = req.body;
    const {theatreId} = req.params;
    const response = await services.createAuditorium(theatreId,name,capacity,seatLayout)
    res.status(response.code).json(response)
}

export const auditoriumByTheatre = async(req:Request,res:Response) =>{
    const {theatreId} = req.params
    const response = await services.listAuditoriumsByTheatre(theatreId)
    res.status(response.code).json(response)
}

export const availability = async(req:Request,res:Response) =>{
    const {auditoriumId,showtimeId} = req.params
    const response = await services.getAuditoriumAvailabilty(auditoriumId,showtimeId)
    res.status(response.code).json(response)
}

export const adminReports = async(req:Request,res:Response) =>{
    const {theatreId} = req.params;
    const response = await services.adminScreenReports(theatreId)
    res.status(response.code).json(response)
}
export const auditoriumUpdate = async(req:Request,res:Response) =>{
    const {auditoriumId} = req.params;
    const {name,capacity,seatLayout} = req.body;
    const response = await services.updateAuditorium(auditoriumId,{name,capacity,seatLayout})
    res.status(response.code).json(response)
}


