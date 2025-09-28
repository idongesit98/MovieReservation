import { Request,Response } from "express";
import { createPayment, verifyPay } from "../services/paymentServices";

export const initiate = async(req:Request,res:Response) =>{
    const {reservationId,amount,customerEmail} = req.body;
    const result = await createPayment(reservationId,amount,customerEmail);
    res.status(result.code).json(result)
}

export const verify = async(req:Request,res:Response) =>{
    const {reference} = req.body
    const response = await verifyPay(reference)
    res.status(response.code).json(response)
}

export const paymentWebook = async(req:Request,res:Response) =>{
    try {
        const event = req.body;
        
        if (event.event === "charge.success") {
            await verifyPay(event.data.reference)
        } else if(event.event === "charge.failed"){
            await verifyPay(event.data.reference)
        }

        res.sendStatus(200)
    } catch (error) {
        console.error("Webhook error:",error)
        res.sendStatus(500);
    }
}