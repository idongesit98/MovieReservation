"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReservation = exports.getReservationByReference = exports.createReservation = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const redis_1 = require("../utils/config/redis");
const responseFormat_1 = require("../utils/config/responseFormat");
const createReservation = async (userId, showtimeId, seatIds) => {
    try {
        if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            return (0, responseFormat_1.errorResponse)(400, "Seat IDs are required", null);
        }
        const showtime = await database_1.default.showTime.findUnique({ where: { id: showtimeId } });
        if (!showtime) {
            return (0, responseFormat_1.errorResponse)(404, "Showtime not found", null);
        }
        //Check if seats are already reserved
        const reservedSeats = await database_1.default.reservationSeat.findMany({
            where: {
                seat_id: { in: seatIds },
                cancelled_at: null,
                reservation: { showtime_id: showtimeId, status: { in: ["Pending", "Confirmed"] } },
            },
        });
        if (reservedSeats.length > 0) {
            return (0, responseFormat_1.errorResponse)(400, "Some seats are already reserved", { Reserved: reservedSeats });
        }
        //Create reservation + reservation seats
        const reservation = await database_1.default.reservation.create({
            data: {
                user_id: userId,
                showtime_id: showtimeId,
                reservation_seat: {
                    create: seatIds.map((seatId) => ({ seat_id: seatId }))
                },
            },
            include: { reservation_seat: true },
        });
        await (0, redis_1.clearMovieCache)();
        return (0, responseFormat_1.successResponse)(201, "Reservation created successfully", { Reservation: reservation });
    }
    catch (error) {
        console.error("Create reservation error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to create reservation", null, error);
    }
};
exports.createReservation = createReservation;
const getReservationByReference = async (bookingRef) => {
    try {
        const reservation = await database_1.default.reservation.findUnique({
            where: { bookingReference: bookingRef },
            include: { reservation_seat: { include: { seat: true } }, showtime: true }
        });
        if (!reservation)
            return (0, responseFormat_1.errorResponse)(404, "Reservation not found", null);
        return (0, responseFormat_1.successResponse)(200, "Reservation retrieved", { Reservation: reservation });
    }
    catch (error) {
        console.error("Get reservation error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to fetch reservation", null, error);
    }
};
exports.getReservationByReference = getReservationByReference;
const getAllReservation = async (page = 1, limit = 10) => {
    try {
        const cacheKey = `reservation:page:${page}:limit:${limit}`;
        const cached = await redis_1.redisClient.get(cacheKey);
        if (cached) {
            return (0, responseFormat_1.successResponse)(200, "Reservation fetched from cache", JSON.parse(cached));
        }
        const skip = (page - 1) * limit;
        const all = await database_1.default.reservation.findMany({
            skip,
            take: limit,
            include: {
                reservation_seat: true
            },
            orderBy: { created_at: "asc" }
        });
        if (all.length === 0) {
            return (0, responseFormat_1.errorResponse)(404, "No reservation found", null);
        }
        await redis_1.redisClient.setEx(cacheKey, 300, JSON.stringify({ Reservation: all }));
        return (0, responseFormat_1.successResponse)(200, "Reservation found", { Reservation: all });
    }
    catch (error) {
        console.error("Get Reservation", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to SignUp User", null, error);
    }
};
exports.getAllReservation = getAllReservation;
