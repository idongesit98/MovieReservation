import { Type } from "@prisma/client";
import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";
import { clearMovieCache, redisClient } from "../utils/config/redis";

export const generateSeatForScreen = async(auditoriumId:string,seatLayout:{rows:number;columns:number;vipRows?:number[]}) =>{
    try {
        const auditorium = await prisma.auditorium.findUnique({where:{id:auditoriumId}});
        if (!auditorium) {
            return errorResponse(404,"Auditorium not found",null)
        }

        const expectedCapacity = seatLayout.rows * seatLayout.columns;
        if (expectedCapacity !== auditorium.capacity){
          return errorResponse(400,`Seat layout mismatch: rows * columns = ${expectedCapacity}, but auditorium capacity = ${auditorium.capacity}`,null)
        }

        if (seatLayout.vipRows) {
            const invalidRows = seatLayout.vipRows.filter((row) => row < 1 || row > seatLayout.rows);
            if (invalidRows.length > 0) {
              return errorResponse(400,`Invalid VIP row(s): ${invalidRows.join(", ")}. Row values must be between 1 and ${seatLayout.rows}`,null);
            }
        }

        const existingSeats = await prisma.seat.findMany({where:{screen_id:auditoriumId}});
        if (existingSeats.length > 0) {
            return errorResponse(400,"Seats already generated for this auditorium",null);
        }

        const seatsData = [];
        for (let row = 1; row < seatLayout.rows; row++) {
            for(let number = 1;number <= seatLayout.columns;number++){
                const isVip = seatLayout.vipRows?.includes(row);
                seatsData.push({
                    screen_id:auditoriumId,
                    row,number,
                    type:isVip ? Type.Vip : Type.Regular,
                    price: isVip ? 5000 : 3000,
                });
            }
        }
        await prisma.seat.createMany({data:seatsData})
        return successResponse(201,"Seats generated successfully",{totalSeats:seatsData.length,vipRows:seatLayout.vipRows ?? []});
    } catch (error) {
        console.error("Generate seats error",error);
        return errorResponse(500,"Failed to generate seats",null,error)
    }
};

export const listSeatsForScreen = async(auditoriumId:string,page:number = 1,limit:number = 10) =>{
    try {
        const cacheKey = `screen:page:${page}:limit:${limit}`;

        const cached = await redisClient.get(cacheKey)
        if (cached) {
            return successResponse(200,"Seat fetched from cache",JSON.parse(cached))
        }
         const skip = (page - 1) * limit;

        const seats = await prisma.seat.findMany({
            skip,
            take:limit,
            where:{screen_id:auditoriumId},
            orderBy:[{row:'asc'},{number:"asc"}]
        });

        if (!seats || seats.length === 0) {
            return errorResponse(404,"No seats found for this auditorium",null);
        }

        await redisClient.setEx(cacheKey,300,JSON.stringify({Seat:seats}))
        return successResponse(200,"Seats fetched successfully",{Seats:seats});
    } catch (error) {
        console.error("List seats error",error);
        return errorResponse(500,"Failed to fetch seats",null,error);
    }
};

export const updateSeat = async (seatId: string,updates: { type?: "Vip" | "Regular"; price?: number }) => {
  try {
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) return errorResponse(404, "Seat not found", null);

    const updated = await prisma.seat.update({
      where: { id: seatId },
      data: { ...updates },
    });
    await clearMovieCache();
    return successResponse(200, "Seat updated successfully", { Seat: updated });
  } catch (error) {
    console.error("Update seat error", error);
    return errorResponse(500, "Failed to update seat", null, error);
  }
};

export const checkSeatAvailability = async (seatId: string) => {
  try {
    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
      include: { reservation_seat: true },
    });

    if (!seat) return errorResponse(404, "Seat not found", null);

    const isReserved = seat.reservation_seat.some((res) => res.cancelled_at === null);

    return successResponse(200, "Seat availability checked", {available: !isReserved,seat});
  } catch (error) {
    console.error("Check seat availability error", error);
    return errorResponse(500, "Failed to check seat availability", null, error);
  }
};

// export const checkSeatAvailability = async (seatId: string) => {
//   const seats = await prisma.seat.findMany({
//     where: { screen_id: (await prisma.showTime.findUnique({ where: { id:seatId } }))?.screen_id },
//     include: {
//       reservation_seat: {
//         where: { reservation: { showtime_id: seatId, status: { not: "Cancelled" } } },
//       },
//     },
//   });

//   const availability = seats.map((seat) => ({
//     seat_id: seat.id,
//     row: seat.row,
//     number: seat.number,
//     status: seat.reservation_seat.length > 0 ? "Reserved" : "Available",
//   }));

//   return successResponse(200, "Seat availability", availability);
// };


//checking seat report is it from seat or auditorium
export const getSeatReportForScreen = async (screenId: string) => {
  try {
    const totalSeats = await prisma.seat.count({ where: { screen_id: screenId } });
    const vipSeats = await prisma.seat.count({ where: { screen_id: screenId, type: Type.Vip } });
    const reservedSeats = await prisma.reservationSeat.count({
      where: { seat: { screen_id: screenId }, cancelled_at: null },
    });

    return successResponse(200, "Seat report generated", {
      totalSeats,
      vipSeats,
      regularSeats: totalSeats - vipSeats,
      reservedSeats,
      availableSeats: totalSeats - reservedSeats,
    });
  } catch (error) {
    console.error("Seat report error", error);
    return errorResponse(500, "Failed to generate report", null, error);
  }
};


export const cancelReservation = async(reservationSeatId:string) =>{
  try {
    const reservationSeat = await prisma.reservationSeat.findUnique({
      where:{id:reservationSeatId},
    });
    if (!reservationSeat) {
      return errorResponse(404,"Reservation not found",null)
    }
    if (reservationSeat.cancelled_at) {
      return errorResponse(404,"Reservation already cancelled",null)
    }

    const cancelled = await prisma.reservationSeat.update({
      where:{id:reservationSeatId},
      data:{cancelled_at:new Date()}
    })

    return successResponse(200,"Reservation cancelled successfully",{ReservationSeat:cancelled,})
  } catch (error) {
      console.error("Cancel reservation error", error);
      return errorResponse(500, "Failed to cancel reservation", null, error);
  }
}



