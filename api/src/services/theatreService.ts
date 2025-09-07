import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createTheatre = async(theatre_name:string,location:string,contactInfo:string) =>{
    try {
        const existing = await prisma.theatre.findUnique({where:{theatre_name}})
        if(existing){
            return errorResponse(400,"Theatre already exists",null)
        }
        const newTheatre = await prisma.theatre.create({
            data:{
                theatre_name:theatre_name,
                location:location,
                contact_info:contactInfo
            }
        })
        return successResponse(201,"Theatre created succcessfully",{Theatre:newTheatre})
    } catch (error) {
        console.error("Create theatre Error", error);
        return errorResponse(500, "Failed to create theatre", null, error);
    }
}

export const singleTheatre = async(theatreId:string) =>{
    try {
        const single = await prisma.theatre.findUnique({
            where:{id:theatreId},
            include:{
                auditorium:true
            }
        })
        if (!single) {
            return errorResponse(404,"Theatre not found,check if ID is correct",null)
        }
        return successResponse(200,"Theatre found",{Theatre:single})
    } catch (error) {
        console.error("Single theatre Error", error);
        return errorResponse(500, "Failed to find single theatre", null, error);
    }
}

export const getAllTheatres = async() =>{
    try {
        const all = await prisma.theatre.findMany({
            include:{
                auditorium:true
            },
            orderBy:{created_at:"desc"}
        })

        if (all.length === 0) {
            return errorResponse(404,"No theatre found",null)
        }
        return successResponse(200,"Theatre found",{Theatre:{all}})
    } catch (error) {
        console.error("All theatre error",error)
        return errorResponse(500,"Failed to get theatre",null,error)
    }
}

export const updateTheatre = async (theatreId:string,theatre_name:string,location:string,contactInfo:string) =>{
    try {
        const allExisting = await prisma.theatre.findUnique({where:{id:theatreId}})
        if (!allExisting) {
            return errorResponse(404,"Couldn't find theatre",null)
        }

        const updatedTheatre = await prisma.theatre.update({
            where:{id:theatreId},
            data:{
                theatre_name:theatre_name,
                location:location,
                contact_info:contactInfo
            }
        })
        return successResponse(200,"Updated successfully",{UpdateTheatre:updatedTheatre})
    } catch (error) {
        console.error("Updated theatre error",error)
        return errorResponse(404,"Couldn't update theatre",null,error)
    }
}

export const deleteTheatre = async(theatreId:string) =>{
    try {
        const theatre = await prisma.theatre.findUnique({where:{id:theatreId}});
        if (!theatre) {
            return errorResponse(404,"Theatre not found",null);
        }

        await prisma.theatre.delete({where:{id:theatreId}});
        return successResponse(200,"Theatre deleted successfully",{Deleted:theatre})
    } catch (error) {
        console.error("Theatre deletion error",error)
        return errorResponse(500,"Failed to deleted theatre",null,error)
    }
}