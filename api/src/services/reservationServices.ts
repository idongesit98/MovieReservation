import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createReservation = async(userId:string,showtimeId:string,seatIds:string[]) =>{
    try {
        const showtime = await prisma.showTime.findUnique({where:{id:showtimeId}})
        if (!showtime) {
            return errorResponse(404,"Showtime not found",null);
        }

        //Check if seats are already reserved
        const reservedSeats = await prisma.reservationSeat.findMany({
            where:{
                seat_id:{in:seatIds},
                cancelled_at:null,
                reservation:{showtime_id:showtimeId,status:{in:["Pending","Confirmed"]}},
            },
        });

        if(reservedSeats.length > 0){
            return errorResponse(400,"Some seats are already reserved",{Reserved:reservedSeats})
        }
        //Create reservation + reservation seats
        const reservation = await prisma.reservation.create({
            data:{
                user_id:userId,
                showtime_id:showtimeId,
                reservation_seat:{
                    create:seatIds.map((seatId) => ({seat_id:seatId}))
                },
            },
            include:{reservation_seat:true},
        })
        return successResponse(201,"Reservation created successfully",{Reservation:reservation})
    } catch (error) {
        console.error("Create reservation error",error)
        return errorResponse(500,"Failed to create reservation",null,error);
    }
}

export const cancelReservation = async(reservationId:string,userId:string) =>{
    try {
        const reservation = await prisma.reservation.findUnique({
            where:{id:reservationId},
            include:{reservation_seat:true},
        });
        if(!reservation) return errorResponse(404,"Reservation not found",null);
        if (reservation.user_id !== userId) {
            return errorResponse(403,"Unauthorized to cancel this reservation",null);
        }

        const cancelled = await prisma.reservation.update({
            where:{id:reservationId},
            data:{
                status:"Cancelled",
                reservation_seat:{
                    updateMany:{where:{cancelled_at:null},data:{cancelled_at:new Date()}}
                }
            }
        });
        return successResponse(200,"Reservation cancelled successfully",{Reservation:cancelled})
    } catch (error) {
        console.error("Cancel reservation error",error)
        return errorResponse(500,"Failed to cancel reservation",null,error);
    }
}

export const getReservationByReference = async(bookingRef:string) =>{
    try {
        const reservation = await prisma.reservation.findUnique({
            where:{bookingReference:bookingRef},
            include:{reservation_seat:{ include:{seat:true}}, showtime:true}
        });

        if(!reservation) return errorResponse(404,"Reservation not found",null);

        return successResponse(200,"Reservation retrieved",{Reservation:reservation})
    } catch (error) {
        console.error("Get reservation error",error);
        return errorResponse(500,"Failed to fetch reservation",null,error);
    }
}