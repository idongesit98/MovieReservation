import {Request,response,Response} from "express";
import * as service from "../services/seatServices";
import { RecordWithTtl } from "dns";

export const generateSeat = async(req:Request,res:Response) =>{
    const {auditoriumId} = req.params;
    const seatLayout = req.body;
    const response = await service.generateSeatForScreen(auditoriumId,seatLayout)
    res.status(response.code).json(response)
}

export const listSeats = async(req:Request,res:Response) =>{
    const {auditoriumId} = req.params;
    const response = await service.listSeatsForScreen(auditoriumId)
    res.status(response.code).json(response)
}

export const update = async(req:Request,res:Response) =>{
    const {seatId} = req.params
    const updates = req.body
    const response = await service.updateSeat(seatId,updates)
    res.status(response.code).json(response)
}

export const seatAvail = async(req:Request,res:Response) =>{
    const {seatId} = req.params
    const response = await service.checkSeatAvailability(seatId)
    res.status(response.code).json(response)
}

export const getReport = async(req:Request,res:Response) =>{
    const {screenId} = req.params
    const response = await service.getSeatReportForScreen(screenId)
    res.status(response.code).json(response)
}

export const cancel = async(req:Request,res:Response) =>{
    const {reservationSeatId} = req.params
    console.log("Reservess",reservationSeatId)
    const response = await service.cancelReservation(reservationSeatId)
    res.status(response.code).json(response)
}
