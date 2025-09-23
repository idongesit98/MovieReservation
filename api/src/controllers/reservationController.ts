import { Request,Response } from "express";
import * as service from '../services/reservationServices'

export const createReserv = async(req:Request,res:Response) =>{
     const userId = req.user?.id!
     const {showtimeId,seatIds} = req.body

     const response = await service.createReservation(userId,showtimeId,seatIds)
     res.status(response.code).json(response)
}

export const getReserv = async(req:Request,res:Response) =>{
    const {bookingRef} = req.params
    const response  = await service.getReservationByReference(bookingRef)
    res.status(response.code).json(response)
}

export const getAllReserv = async(req:Request,res:Response) =>{
    const response = await service.getAllReservation()
    res.status(response.code).json(response)
}

