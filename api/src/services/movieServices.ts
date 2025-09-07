import prisma from "../utils/config/database";
import { errorResponse, successResponse } from "../utils/config/responseFormat";

export const createMovies = async(title:string,description:string,genre:string,rating:string,duration:number,releasedDate:Date,language:string)=>{
    try {
        const existing = await prisma.movie.findUnique({where:{title}})
        if (existing){
            return errorResponse(400,"Movie already exists",null)
        }
        const newMovie = await prisma.movie.create({
            data:{
                title,
                description,
                genre,
                releasedDate,
                rating,
                duration,
                language
            }
        })
        return successResponse(201,"Movie created successfully",{Movie:newMovie})
    } catch (error) {
        console.error("Creating movies Error",error)
        const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to create movie",null,errorMessage)
    }
}

export const getSingleMovies = async(movieId:string) =>{
    try {
        const single = await prisma.movie.findUnique({
            where:{id:movieId},
            include:{
                showtime:true
            }
        })

        if (!single) {
            return errorResponse(404,"Movie not found,check if ID is correct",null)
        }
        return successResponse(200,"Movie found",{Movies:single})
    } catch (error) {
        console.error("Single movies Error",error)
        const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to find single movie",null,errorMessage)
    }
}
export const getAllMovies = async() =>{
    try {
        const all = await prisma.movie.findMany({
            include:{
                showtime:true
            },
            orderBy:{created_at:"desc"}
        })

        if (all.length === 0) {
            return errorResponse(404,"No movie found",null)
        }
        return successResponse(200,"Movies found",{Movies:all})
    } catch (error) {
        console.error("SignUp Error",error)
        const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to SignUp User",null,errorMessage)
    }
}

export const updateMovie = async(movieId:string,title:string,description:string,email:string,genre:string,rating:string,duration:number,releasedDate:Date,language:string) =>{
    try {
        const exists = await prisma.movie.findUnique({where:{id:movieId}})
        if (!exists) {
            return errorResponse(404,"Couldn't find movie",null)
        }

        const updatedMovie = await prisma.movie.update({
            where:{id:movieId},
            data:{
                title:title,
                description:description,
                genre:genre,
                releasedDate:releasedDate,
                rating:rating,
                duration:duration,
                language:language,
            }
        })
        return successResponse(200,"Updated successfully",{Updated:updatedMovie})
    } catch (error) {
        console.error("SignUp Error",error)
        const errorMessage = (error instanceof Error) ? error : null
        return errorResponse(500,"Failed to SignUp User",null,errorMessage)
    }
}

export const searchMovie = async(query:string) =>{
    try {
        const movies = await prisma.movie.findMany({
            where:{
                OR:[
                    {title:{contains:query,mode:"insensitive"}},
                    {genre:{contains:query,mode:"insensitive"}}
                ]
            }
        });

        if (!movies.length) {
            return errorResponse(404,"No movies found",[]);
        }

        return successResponse(200,"Movies found",{movies});
    } catch (error) {
        console.error("Search Error",error)
        return errorResponse(500, "Failed to search movies", null, error);
    }
}

export const deleteMovie = async(movieId:string) =>{
    try {
        const movie = await prisma.movie.findUnique({where:{id:movieId}});
        if (!movie) {
            return errorResponse(404,"movie not found",null);
        }
        await prisma.movie.delete({where:{id:movieId}});
        return successResponse(200,"Movie deleted succesffully",{Deleted:movie})
    } catch (error) {
        console.error("Delete Movie Error", error);
        return errorResponse(500,"Failed to delete movie",null,error);
    }
}