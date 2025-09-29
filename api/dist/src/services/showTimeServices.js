"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingShowTimes = exports.getAlternativeShowTimes = exports.getShowTimeByAuditorium = exports.getShowTimeByMovie = exports.deleteShowTime = exports.updateShowTime = exports.getShowTimeById = exports.getAllShowTimes = exports.createShowtime = void 0;
const date_fns_1 = require("date-fns");
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const redis_1 = require("../utils/config/redis");
const createShowtime = async (movieId, screenId, startTime, endTime, price) => {
    try {
        const movie = await database_1.default.movie.findUnique({ where: { id: movieId } });
        if (!movie)
            return (0, responseFormat_1.errorResponse)(404, "Movie not found", null);
        const screen = await database_1.default.auditorium.findUnique({ where: { id: screenId } });
        if (!screen)
            return (0, responseFormat_1.errorResponse)(404, "Auditorium not found", null);
        if ((0, date_fns_1.isAfter)(startTime, endTime) || (0, date_fns_1.isBefore)(endTime, startTime)) {
            return (0, responseFormat_1.errorResponse)(400, "Start time must be before end time", null);
        }
        const overlap = await database_1.default.showTime.findFirst({
            where: {
                screen_id: screenId,
                deleted_at: null,
                OR: [
                    { startTime: { lte: endTime }, endTime: { gte: startTime } }
                ]
            }
        });
        if (overlap) {
            return (0, responseFormat_1.errorResponse)(400, "Overlapping showtime exists on this auditorium", null);
        }
        const showTime = await database_1.default.showTime.create({
            data: { movie_id: movieId, screen_id: screenId, startTime, endTime, price },
            include: { movie: true, auditorium: true },
        });
        await (0, redis_1.clearMovieCache)();
        return (0, responseFormat_1.successResponse)(201, "Showtime created", showTime);
    }
    catch (error) {
        console.error("Creating showtime Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to create showtime", null, errorMessage);
    }
};
exports.createShowtime = createShowtime;
const getAllShowTimes = async (filters, page = 1, limit = 10) => {
    try {
        const { movieId, screenId, date } = filters;
        const cacheKey = `movies:page:${page}:limit:${limit}`;
        const cached = await redis_1.redisClient.get(cacheKey);
        if (cached) {
            return (0, responseFormat_1.successResponse)(200, "Movies fetched from cache", JSON.parse(cached));
        }
        const skip = (page - 1) * limit;
        const where = { deleted_at: null };
        if (movieId)
            where.movieId = movieId;
        if (screenId)
            where.screenId = screenId;
        if (date) {
            const dayStart = new Date(date);
            const dayEnd = (0, date_fns_1.addMinutes)(dayStart, 1439);
            where.startTime = { gte: dayStart, lte: dayEnd };
        }
        const showtimes = await database_1.default.showTime.findMany({
            skip,
            take: limit,
            where,
            include: { movie: true, auditorium: true, Reservation: true }
        });
        return (0, responseFormat_1.successResponse)(200, "Showtimes fetched", showtimes);
    }
    catch (error) {
        console.error("All Showtime Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to get show time", null, errorMessage);
    }
};
exports.getAllShowTimes = getAllShowTimes;
const getShowTimeById = async (showid) => {
    try {
        const showtime = await database_1.default.showTime.findUnique({
            where: { id: showid },
            include: {
                movie: true,
                auditorium: true,
                Reservation: { include: { reservation_seat: true } },
            },
        });
        if (!showtime)
            return (0, responseFormat_1.errorResponse)(404, "ShowTime not found", null);
        return (0, responseFormat_1.successResponse)(200, "ShowTime fetched", showtime);
    }
    catch (error) {
        console.error("Showtime By Id", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to get showtime by Id", null, errorMessage);
    }
};
exports.getShowTimeById = getShowTimeById;
const updateShowTime = async (showId, data) => {
    try {
        const existing = await database_1.default.showTime.findUnique({ where: { id: showId } });
        if (!existing) {
            return (0, responseFormat_1.errorResponse)(404, "ShowTime not found", null);
        }
        const reservations = await database_1.default.reservation.findFirst({ where: { showtime_id: showId } });
        if (reservations && (data.startTime || data.endTime)) {
            return (0, responseFormat_1.errorResponse)(400, "Cannot update time for showtime with reservations", null);
        }
        const updated = await database_1.default.showTime.update({
            where: { id: showId },
            data
        });
        await (0, redis_1.clearMovieCache)();
        return (0, responseFormat_1.successResponse)(200, "Showtime updated", updated);
    }
    catch (error) {
        console.error("Update Showtime", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to Update Showtime", null, errorMessage);
    }
};
exports.updateShowTime = updateShowTime;
const deleteShowTime = async (showId) => {
    try {
        const existing = await database_1.default.showTime.findUnique({ where: { id: showId } });
        if (!existing)
            return (0, responseFormat_1.errorResponse)(404, 'ShowTime not found', null);
        await database_1.default.showTime.update({
            where: { id: showId },
            data: { deleted_at: new Date() },
        });
        await (0, redis_1.clearMovieCache)();
        return (0, responseFormat_1.successResponse)(200, "Showtime deleted", null);
    }
    catch (error) {
        console.error("Delete Showtime", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to Delete Showtime", null, errorMessage);
    }
};
exports.deleteShowTime = deleteShowTime;
const getShowTimeByMovie = async (movieId) => {
    try {
        const showTimes = await database_1.default.showTime.findMany({
            where: { movie_id: movieId, deleted_at: null },
            include: { auditorium: true }
        });
        return (0, responseFormat_1.successResponse)(200, "ShowTimes by auditorium", showTimes);
    }
    catch (error) {
        console.error("Showtime By movie", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to get Showtime by movie ID", null, errorMessage);
    }
};
exports.getShowTimeByMovie = getShowTimeByMovie;
const getShowTimeByAuditorium = async (screenId, page = 1, limit = 10) => {
    try {
        const cacheKey = `auditorium:page:${page}:limit:${limit}`;
        const cached = await redis_1.redisClient.get(cacheKey);
        if (cached) {
            return (0, responseFormat_1.successResponse)(200, "Auditorium fetched from cache", JSON.parse(cached));
        }
        const skip = (page - 1) * limit;
        const showtimes = await database_1.default.showTime.findMany({
            skip,
            take: limit,
            where: { screen_id: screenId, deleted_at: null },
            include: { movie: true }
        });
        return (0, responseFormat_1.successResponse)(200, "ShowTimes by auditorium", showtimes);
    }
    catch (error) {
        console.error("Showtime By auditorium", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Showtime by auditorium", null, errorMessage);
    }
};
exports.getShowTimeByAuditorium = getShowTimeByAuditorium;
// Alternative showtimes for same movie
const getAlternativeShowTimes = async (showId) => {
    try {
        const showtime = await database_1.default.showTime.findUnique({ where: { id: showId } });
        if (!showtime)
            return (0, responseFormat_1.errorResponse)(404, "ShowTime not found", null);
        const alternatives = await database_1.default.showTime.findMany({
            where: {
                movie_id: showtime.movie_id,
                screen_id: { not: showtime.screen_id },
                startTime: { gte: new Date() },
            },
        });
        return (0, responseFormat_1.successResponse)(200, "Alternative showtimes", alternatives);
    }
    catch (error) {
        console.error("Alternative Showtime Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to get alternative showtime", null, errorMessage);
    }
};
exports.getAlternativeShowTimes = getAlternativeShowTimes;
const getUpcomingShowTimes = async () => {
    try {
        const showtimes = await database_1.default.showTime.findMany({
            where: { startTime: { gte: new Date() }, deleted_at: null },
            orderBy: { startTime: "asc" },
            take: 20,
        });
        return (0, responseFormat_1.successResponse)(200, "Upcoming showtimes", showtimes);
    }
    catch (error) {
        console.error("Upcoming Showtime Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to get upcoming showtime", null, errorMessage);
    }
};
exports.getUpcomingShowTimes = getUpcomingShowTimes;
