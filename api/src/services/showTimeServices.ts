import { addMinutes, isAfter, isBefore } from "date-fns";
import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";
import { clearMovieCache, redisClient } from "../utils/config/redis";

export const createShowtime = async(movieId:string,screenId:string,startTime:Date,endTime:Date,price:number) =>{
   try {
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
     await clearMovieCache()
     return successResponse(201,"Showtime created",showTime);
   } catch (error) {
        console.error("Creating showtime Error",error)
        const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to create showtime",null,errorMessage)
   }
};

export const getAllShowTimes =  async(filters:any,page:number = 1,limit:number = 10) =>{
   try {
     const {movieId,screenId,date} = filters;
 
       const cacheKey = `movies:page:${page}:limit:${limit}`;
     
       const cached = await redisClient.get(cacheKey)
       if (cached) {
         return successResponse(200,"Movies fetched from cache",JSON.parse(cached))
       }
     
      const skip = (page - 1) * limit;
     const where:any = {deleted_at:null};
     if(movieId) where.movieId = movieId;
     if (screenId) where.screenId = screenId;
     
     if (date) {
         const dayStart = new Date(date);
         const dayEnd = addMinutes(dayStart,1439);
         where.startTime = {gte:dayStart,lte:dayEnd}
     }
 
     const showtimes = await prisma.showTime.findMany({
         skip,
         take:limit,
         where,
         include:{movie:true,auditorium:true,Reservation:true}
     });
 
     return successResponse(200,"Showtimes fetched",showtimes);
   } catch (error) {
        console.error("All Showtime Error",error)
        const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to get show time",null,errorMessage)
   }
}

export const getShowTimeById = async (showid: string) => {
  try {
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
  } catch (error) {
      console.error("Showtime By Id",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Failed to get showtime by Id",null,errorMessage)
  }
};

export const updateShowTime = async(showId:string,data:Partial<{startTime:Date; endTime:Date;price:number}>) =>{
    try {
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
        await clearMovieCache()
        return successResponse(200,"Showtime updated",updated)
    } catch (error) {
      console.error("Update Showtime",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Failed to Update Showtime",null,errorMessage)
    }
}

export const deleteShowTime = async(showId:string) =>{
   try {
     const existing = await prisma.showTime.findUnique({where:{id:showId}})
     if(!existing) return errorResponse(404,'ShowTime not found',null);
 
     await prisma.showTime.update({
         where:{id:showId},
         data:{deleted_at:new Date()},
     })
     await clearMovieCache()
 
     return successResponse(200,"Showtime deleted",null)
   } catch (error) {
      console.error("Delete Showtime",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Failed to Delete Showtime",null,errorMessage)
   }
}

export const getShowTimeByMovie = async(movieId:string) =>{
   try {
     const showTimes = await prisma.showTime.findMany({
         where:{movie_id:movieId,deleted_at:null},
         include:{auditorium:true}
     });
     return successResponse(200,"ShowTimes by auditorium",showTimes);
   } catch (error) {
      console.error("Showtime By movie",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Failed to get Showtime by movie ID",null,errorMessage)
  
   }
}

export const getShowTimeByAuditorium = async(screenId:string,page:number = 1,limit:number = 10) =>{
    try {
        const cacheKey = `auditorium:page:${page}:limit:${limit}`;

        const cached = await redisClient.get(cacheKey)
        if (cached) {
            return successResponse(200,"Auditorium fetched from cache",JSON.parse(cached))
        }

        const skip = (page - 1) * limit;

        const showtimes = await prisma.showTime.findMany({
            skip,
            take:limit,
            where:{screen_id:screenId,deleted_at:null},
            include:{movie:true}
        })
        return successResponse(200, "ShowTimes by auditorium", showtimes);
    } catch (error) {
      console.error("Showtime By auditorium",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Showtime by auditorium",null,errorMessage)
    }
}

// Alternative showtimes for same movie
export const getAlternativeShowTimes = async (showId: string) => {
  try {
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
  } catch (error) {
      console.error("Alternative Showtime Error",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Failed to get alternative showtime",null,errorMessage)
  }
};

export const getUpcomingShowTimes = async () => {
  try {
    const showtimes = await prisma.showTime.findMany({
      where: { startTime: { gte: new Date() }, deleted_at: null },
      orderBy: { startTime: "asc" },
      take: 20,
    });
    return successResponse(200, "Upcoming showtimes", showtimes);
  } catch (error) {
      console.error("Upcoming Showtime Error",error)
      const errorMessage = (error instanceof Error) ? error : null
      return errorResponse(500,"Failed to get upcoming showtime",null,errorMessage)
  }
};