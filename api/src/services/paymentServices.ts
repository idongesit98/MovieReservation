import prisma from '../utils/config/database';
import { errorResponse, successResponse } from '../utils/config/responseFormat';
import { PaymentStatus } from '@prisma/client';
import { initializePayment, verifyPayment } from '../utils/payment/paystack';

export const createPayment = async(reservationId:string,amount:number,customerEmail:string) =>{
    try {
        const reference = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        const payment = await prisma.payment.create({
            data:{
                reservation_id:reservationId,
                amount,
                status:PaymentStatus.Pending,
                method:"paystack",
                transactionRef:reference,
            }
        });

        await prisma.reservation.update({
            where:{id:reservationId},
            data:{status:"Pending"}
        })

        const pay = await initializePayment(customerEmail,amount,reference)
        return successResponse(201,"Payment initiated",{
            paymentId:payment.id,reference,authorization_url:pay?.data?.authorization_url,access_code:pay?.data?.access_code})
    } catch (error) {
        console.error("Create payment error",error)
        return errorResponse(500,"Failed Payment",null,error)
    }
}

export const verifyPay = async(reference:string) =>{
    try {
        const response = await verifyPayment(reference)
        const status = response.data.status === "success" ? PaymentStatus.Confirmed : PaymentStatus.Cancelled;

        const payment = await prisma.payment.update({
            where:{transactionRef:reference},
            data:{status},
            include:{reservation:true}
        })

        await prisma.reservation.update({
            where:{id:payment.reservation_id},
            data:{status}
        })

        return successResponse(200,"Payment verified",{Payment:payment,Reservation:{id:payment.reservation_id,status},})
    } catch (error) {
        console.error("Verify payment error",error)
        return errorResponse(500,"Failed Payment",null,error)
    }
}
