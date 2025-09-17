import { Request,Response } from "express";
import * as service from '../services/reservationServices'

export const createReserv = async(req:Request,res:Response) =>{
     const userId = req.user?.id!
     const {showtimeId,seatsIds} = req.body

     const response = await service.createReservation(userId,showtimeId,seatsIds)
     res.status(response.code).json(response)
}

export const cancelReserv = async(req:Request,res:Response) =>{
    const userId = req.user?.id!
    const {reservationId} = req.params

    const response = await service.cancelReservation(userId,reservationId)
    res.status(response.code).json(response)
}

export const getReserv = async(req:Request,res:Response) =>{
    const {bookingRef} = req.params
    const response  = await service.getReservationByReference(bookingRef)
    res.status(response.code).json(response)
}

