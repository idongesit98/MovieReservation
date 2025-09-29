import prisma from "../utils/config/database";
import { clearMovieCache, redisClient } from "../utils/config/redis";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createReservation = async(userId:string,showtimeId:string,seatIds:string[]) =>{
    try {

        if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            return errorResponse(400,"Seat IDs are required",null)
        }

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
        await clearMovieCache()
        return successResponse(201,"Reservation created successfully",{Reservation:reservation})
    } catch (error) {
        console.error("Create reservation error",error)
        return errorResponse(500,"Failed to create reservation",null,error);
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

export const getAllReservation = async(page:number = 1,limit:number = 10) =>{
    try {
        const cacheKey = `reservation:page:${page}:limit:${limit}`;
        const cached = await redisClient.get(cacheKey)

        if (cached) {
            return successResponse(200,"Reservation fetched from cache",JSON.parse(cached))
        }
        const skip = (page - 1) * limit;
        const all = await prisma.reservation.findMany({
            skip,
            take:limit,
            include:{
                reservation_seat:true
            },
            orderBy:{created_at:"asc"}
        })

        if (all.length === 0) {
            return errorResponse(404,"No reservation found",null)
        }
        await redisClient.setEx(cacheKey,300,JSON.stringify({Reservation:all}))
        return successResponse(200,"Reservation found",{Reservation:all})
    } catch (error) {
        console.error("Get Reservation",error)
        return errorResponse(500,"Failed to SignUp User",null,error)
    }
}