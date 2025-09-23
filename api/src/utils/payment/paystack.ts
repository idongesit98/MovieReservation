import axios from "axios";
import { errorResponse } from "../config/responseFormat";

export const initializePayment = async(email:string,amount:number,reference:string) =>{
    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount:amount * 100,
                reference:reference,
                callback_url:""
            },
            {
                headers:{
                    Authorization:`Bearer ${process.env.PAYSTACK_SECRET!}`,
                    "Content-Type":"application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Initialize Payment error",error)
        return errorResponse(500,"Failed to initialize payment",null,error);        
    }
}

export async function verifyPayment(reference:string) {
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET}`}
            }
        )
        return response.data
    } catch (error) {
        console.error("Verify payment",error)
        return errorResponse(500,"Verify Payment",null,error);        
    }
}