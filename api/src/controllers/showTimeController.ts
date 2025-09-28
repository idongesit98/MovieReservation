import { Request,Response } from "express";
import * as showtimeService from "../services/showTimeServices";

export const createShow = async(req:Request,res:Response) =>{
    const {movieId,screenId,startTime,endTime,price} = req.body;
    const response = await showtimeService.createShowtime(movieId,screenId,new Date(startTime),new Date(endTime),price);
    res.status(response.code).json(response)
}

export const getAllShowsTimes = async(req:Request,res:Response) =>{
    const response = await showtimeService.getAllShowTimes(req.query);
    res.status(response.code).json(response)
}

export const getShowById = async(req:Request,res:Response) =>{
    const showid = req.params.showId;
    const response = await showtimeService.getShowTimeById(showid)
    res.status(response.code).json(response)
}

export const updateShow = async(req:Request,res:Response) =>{
    const showId = req.params.showId;
    const data = req.body;
    const response = await showtimeService.updateShowTime(showId,data)
    res.status(response.code).json(response)
}

export const deleteShow = async(req:Request,res:Response) =>{
    const showId = req.params.showId
    const response = await showtimeService.deleteShowTime(showId)
    res.status(response.code).json(response)
}

export const getTimeByMovie = async(req:Request,res:Response) =>{
    const movieId = req.params.id;
    const response = await showtimeService.getShowTimeByMovie(movieId)
    res.status(response.code).json(response)
}

export const getShowTimeAuditorium = async(req:Request,res:Response) =>{
    const screenId = req.params.id
    const response = await showtimeService.getShowTimeByAuditorium(screenId)
    res.status(response.code).json(response)
}

export const getAlternativeShowTimes = async (req: Request, res: Response) => {
    const showId = req.params.id
    const response = await showtimeService.getAlternativeShowTimes(showId);
  res.status(response.code).json(response);
};

export const getUpcomingShowTimes = async (_req: Request, res: Response) => {
  const response = await showtimeService.getUpcomingShowTimes();
  res.status(response.code).json(response);
};