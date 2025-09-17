import { addMinutes, isAfter, isBefore } from "date-fns";
import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createShowtime = async(movieId:string,screenId:string,startTime:Date,endTime:Date,price:number) =>{
    const movie = await prisma.movie.findUnique({where:{id:movieId}});

    if(!movie) return errorResponse(404,"Movie not found",null)

    const screen = await prisma.auditorium.findUnique({where:{id:screenId}});
    if(!screen) return errorResponse(404,"Auditorium not found",null);

    if (isAfter(startTime,endTime) || isBefore(endTime,startTime)) {
        return errorResponse(400,"Start time must be before end time",null);
    }

    const overlap = await prisma.showTime.findFirst({
        where:{
            screen_id:screenId,
            deleted_at:null,
            OR:[
                {startTime:{lte:endTime},endTime:{gte:startTime}}
            ]
        }
    });
    if (overlap) {
        return errorResponse(400,"Overlapping showtime exists on this auditorium",null)
    }

    const showTime = await prisma.showTime.create({
        data:{movie_id:movieId,screen_id:screenId,startTime,endTime,price},
        include:{movie:true,auditorium:true},
    });

    return successResponse(201,"Showtime created",showTime);
};

export const getAllShowTimes =  async(filters:any) =>{
    const {movieId,screenId,date} = filters;

    const where:any = {deleted_at:null};
    if(movieId) where.movieId = movieId;
    if (screenId) where.screenId = screenId;
    
    if (date) {
        const dayStart = new Date(date);
        const dayEnd = addMinutes(dayStart,1439);
        where.startTime = {gte:dayStart,lte:dayEnd}
    }

    const showtimes = await prisma.showTime.findMany({
        where,
        include:{movie:true,auditorium:true,Reservation:true}
    });

    return successResponse(200,"Showtimes fetched",showtimes);
}

export const getShowTimeById = async (showid: string) => {
  const showtime = await prisma.showTime.findUnique({
    where: { id:showid },
    include: {
      movie: true,
      auditorium: true,
      Reservation: { include: { reservation_seat: true } },
    },
  });
  if (!showtime) return errorResponse(404, "ShowTime not found", null);

  return successResponse(200, "ShowTime fetched", showtime);
};



export const updateShowTime = async(showId:string,data:Partial<{startTime:Date; endTime:Date;price:number}>) =>{
    const existing = await prisma.showTime.findUnique({where:{id:showId}});
    if (!existing) {
        return errorResponse(404,"ShowTime not found",null);
    }

    const reservations = await prisma.reservation.findFirst({where:{showtime_id:showId}});
    if (reservations && (data.startTime || data.endTime)) {
        return errorResponse(400,"Cannot update time for showtime with reservations",null);
    }

    const updated = await prisma.showTime.update({
        where:{id:showId},
        data
    })
    return successResponse(200,"Showtime updated",updated)
}

export const deleteShowTime = async(showId:string) =>{
    const existing = await prisma.showTime.findUnique({where:{id:showId}})
    if(!existing) return errorResponse(404,'ShowTime not found',null);

    await prisma.showTime.update({
        where:{id:showId},
        data:{deleted_at:new Date()},
    })

    return successResponse(200,"Showtime deleted",null)
}

export const getShowTimeByMovie = async(movieId:string) =>{
    const showTimes = await prisma.showTime.findMany({
        where:{movie_id:movieId,deleted_at:null},
        include:{auditorium:true}
    });
    return successResponse(200,"ShowTimes by auditorium",showTimes);
}

export const getShowTimeByAuditorium = async(screenId:string) =>{
    const showtimes = await prisma.showTime.findMany({
        where:{screen_id:screenId,deleted_at:null},
        include:{movie:true}
    })
    return successResponse(200, "ShowTimes by auditorium", showtimes);
}

// Alternative showtimes for same movie
export const getAlternativeShowTimes = async (showId: string) => {
  const showtime = await prisma.showTime.findUnique({ where: { id:showId } });
  if (!showtime) return errorResponse(404, "ShowTime not found", null);

  const alternatives = await prisma.showTime.findMany({
    where: {
      movie_id: showtime.movie_id,
      screen_id: { not: showtime.screen_id },
      startTime: { gte: new Date() },
    },
  });

  return successResponse(200, "Alternative showtimes", alternatives);
};

// Upcoming showtimes
export const getUpcomingShowTimes = async () => {
  const showtimes = await prisma.showTime.findMany({
    where: { startTime: { gte: new Date() }, deleted_at: null },
    orderBy: { startTime: "asc" },
    take: 20,
  });
  return successResponse(200, "Upcoming showtimes", showtimes);
};