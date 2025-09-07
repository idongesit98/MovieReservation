import { Prisma } from "@prisma/client";
import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createAuditorium = async(theatreId:string,name:string,capacity:number,seatLayout:Prisma.InputJsonValue)=>{
    try {
        const theatre = await prisma.theatre.findUnique({where:{id:theatreId}})
        if (!theatre) {
            return errorResponse(404,"Theatre not found",null)
        }
        const existing = await prisma.auditorium.findFirst({where:{theatre_id:theatreId,name}})
        if (!existing) {
             return errorResponse(400,"Auditorium already exists",null)
        }

        const auditorium = await prisma.auditorium.create({
            data:{
                theatre_id:theatreId,
                name,
                capacity,
                seatLayout
            }
        });
        return successResponse(201,"Auditorium created successfully",{Auditorium:auditorium})
    } catch (error) {
        console.error("Creating auditorium error",error)
        return errorResponse(500,"Failed to create screen",null,error)
    }
}

export const updateAuditorium = async(auditoriumId:string,updates:{name?:string;capacity?:number,seatLayout?:Prisma.InputJsonValue}) =>{
    try {
        const screen = await prisma.auditorium.update({
            where:{id:auditoriumId},
            data:updates
        });
        return successResponse(200,"Screen updated successfully",{Auditorium:screen})
    } catch (error) {
        console.error("Update auditorium error",error);
        return errorResponse(500,'Failed to update auditorium',null,error)
    }
}