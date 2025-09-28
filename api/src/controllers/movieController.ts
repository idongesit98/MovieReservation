import { Request,Response } from "express";
import * as service from '../services/movieServices';

export const addMovies = async(req:Request,res:Response) =>{
   const {title,description,genre,rating,duration,releasedDate,language} = req.body
   const response = await service.createMovies(title,description,genre,rating,duration,releasedDate,language)
   res.status(response.code).json(response)
}

export const singleMovies = async(req:Request,res:Response) =>{
    const {movieId} = req.params;
    const response = await service.getSingleMovies(movieId)
    res.status(response.code).json(response)
}

export const allMovies = async(req:Request,res:Response) =>{
    const response = await service.getAllMovies()
    res.status(response.code).json(response)
}

export const movieUpdate = async(req:Request,res:Response) =>{
    const {title,description,email,genre,rating,duration,releasedDate,language} = req.body
    const {movieId} = req.params
    const response = await service.updateMovie(movieId,title,description,email,genre,rating,duration,releasedDate,language)
    res.status(response.code).json(response)
}

export const moviesSearch = async (req: Request, res: Response) => {
  const { query } = req.query as { query?: string };
  console.log("Query received:", req.query);


  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const response = await service.searchMovie(query);
  res.status(response.code).json(response);
};
export const movieDeleted = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const response = await service.deleteMovie(movieId);
  res.status(response.code).json(response);
};

