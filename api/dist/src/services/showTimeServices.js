"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingShowTimes = exports.getAlternativeShowTimes = exports.getShowTimeByAuditorium = exports.getShowTimeByMovie = exports.deleteShowTime = exports.updateShowTime = exports.getShowTimeById = exports.getAllShowTimes = exports.createShowtime = void 0;
const date_fns_1 = require("date-fns");
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const createShowtime = async (movieId, screenId, startTime, endTime, price) => {
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
    return (0, responseFormat_1.successResponse)(201, "Showtime created", showTime);
};
exports.createShowtime = createShowtime;
const getAllShowTimes = async (filters) => {
    const { movieId, screenId, date } = filters;
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
        where,
        include: { movie: true, auditorium: true, Reservation: true }
    });
    return (0, responseFormat_1.successResponse)(200, "Showtimes fetched", showtimes);
};
exports.getAllShowTimes = getAllShowTimes;
const getShowTimeById = async (showid) => {
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
};
exports.getShowTimeById = getShowTimeById;
const updateShowTime = async (showId, data) => {
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
    return (0, responseFormat_1.successResponse)(200, "Showtime updated", updated);
};
exports.updateShowTime = updateShowTime;
const deleteShowTime = async (showId) => {
    const existing = await database_1.default.showTime.findUnique({ where: { id: showId } });
    if (!existing)
        return (0, responseFormat_1.errorResponse)(404, 'ShowTime not found', null);
    await database_1.default.showTime.update({
        where: { id: showId },
        data: { deleted_at: new Date() },
    });
    return (0, responseFormat_1.successResponse)(200, "Showtime deleted", null);
};
exports.deleteShowTime = deleteShowTime;
const getShowTimeByMovie = async (movieId) => {
    const showTimes = await database_1.default.showTime.findMany({
        where: { movie_id: movieId, deleted_at: null },
        include: { auditorium: true }
    });
    return (0, responseFormat_1.successResponse)(200, "ShowTimes by auditorium", showTimes);
};
exports.getShowTimeByMovie = getShowTimeByMovie;
const getShowTimeByAuditorium = async (screenId) => {
    const showtimes = await database_1.default.showTime.findMany({
        where: { screen_id: screenId, deleted_at: null },
        include: { movie: true }
    });
    return (0, responseFormat_1.successResponse)(200, "ShowTimes by auditorium", showtimes);
};
exports.getShowTimeByAuditorium = getShowTimeByAuditorium;
// Alternative showtimes for same movie
const getAlternativeShowTimes = async (showId) => {
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
};
exports.getAlternativeShowTimes = getAlternativeShowTimes;
// Upcoming showtimes
const getUpcomingShowTimes = async () => {
    const showtimes = await database_1.default.showTime.findMany({
        where: { startTime: { gte: new Date() }, deleted_at: null },
        orderBy: { startTime: "asc" },
        take: 20,
    });
    return (0, responseFormat_1.successResponse)(200, "Upcoming showtimes", showtimes);
};
exports.getUpcomingShowTimes = getUpcomingShowTimes;
