import { Prisma } from "@prisma/client";
import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createAuditorium = async(theatre_id:string,name:string,capacity:number,seatLayout:Prisma.InputJsonValue)=>{
    try {
        const theatre = await prisma.theatre.findUnique({where:{id:theatre_id}})
        if (!theatre) {
            return errorResponse(404,"Theatre not found",null)
        }
        const existing = await prisma.auditorium.findFirst({where:{theatre_id,name}})
        if (existing) {
             return errorResponse(400,"Auditorium already exists",null)
        }

        const auditorium = await prisma.auditorium.create({
            data:{
                theatre_id,
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

export const listAuditoriumsByTheatre = async(theatreId:string) =>{
    try {
        const auditorium = await prisma.auditorium.findMany({
            where:{theatre_id:theatreId},
            include:{
                showtimes:true
            },
        });
        return successResponse(200,"Auditoriums fetched successfully",{Auditorium:auditorium});
    } catch (error) {
        console.error("List auditorium error",error)
        return errorResponse(500,"Failed to fetch auditorium",null,error)
    }
}

export const getAuditoriumAvailabilty = async(auditoriumId:string,showtimeId:string) =>{
    try {
        const auditorium = await prisma.auditorium.findUnique({
            where:{id:auditoriumId},
            include:{
                seats:{
                    include:{
                        reservation_seat:{
                            include:{reservation:true}
                        },
                    }
                }
            }
        });

        if (!auditorium) {
            return errorResponse(404,"Auditorium not found",null)
        }

        //Filter out reserved seats ---explain this
        const availableSeats = auditorium.seats.filter((seat) => {
            return !seat.reservation_seat.some(
                (rs) => rs.reservation.showtime_id === showtimeId && rs.reservation.status === "Confirmed"
            );
        });

        return successResponse(200,"Auditorium availablity fetched",{
            totalSeats:auditorium.capacity,
            availableSeats:availableSeats.length,
            bookedSeats:auditorium.capacity - availableSeats.length,
            seatDetails:availableSeats
        });
    } catch (error) {
        console.error("Auditorium Availability Error", error);
        return errorResponse(500, "Failed to fetch auditorium availability", null, error);
    }
}

export const adminScreenReports = async(theatre_id?:string) =>{
    try{
        const auditorium = await prisma.auditorium.findMany({
            where:theatre_id? {theatre_id} : {},
            include:{
                showtimes:true,
                seats:{
                    include:{
                        reservation_seat:true
                    }
                }
            }
        })

        const reports = auditorium.map((screen) => {
            const totalShows = screen.showtimes.length;
            const totalSeats = screen.capacity;
            const bookedSeats = screen.seats.filter((s) => s.reservation_seat.length > 0).length;
            const utilizationRate = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

            return{
                auditoriumId:screen.id,
                name: screen.name,
                theatreId: screen.theatre_id,
                totalSeats,
                bookedSeats,
                utilizationRate: utilizationRate.toFixed(2) + "%",
                totalShows,
            }
        })
        return successResponse(200, "Admin screen reports fetched", {Reports:reports });
    }catch(error){
        console.error("Admin Reports Error", error);
        return errorResponse(500, "Failed to fetch admin reports", null, error);
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

export const deleteAuditorium = async(auditoriumId:string) =>{
    try {
        const auditorium = await prisma.auditorium.findUnique({where:{id:auditoriumId}})
        if(!auditorium){
            return errorResponse(404,"Auditorium not found",null)
        }
        await prisma.auditorium.delete({where:{id:auditoriumId}})
        return successResponse(200,"Auditorium deleted successfully",{Deleted:auditorium});
    } catch (error) {
        console.error("Delete Auditorium error",error)
        return errorResponse(500,"Failed to delete auditorium",null)
    }
}