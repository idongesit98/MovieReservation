"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservationByReference = exports.cancelReservation = exports.createReservation = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const createReservation = async (userId, showtimeId, seatIds) => {
    try {
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
        return (0, responseFormat_1.successResponse)(201, "Reservation created successfully", { Reservation: reservation });
    }
    catch (error) {
        console.error("Create reservation error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to create reservation", null, error);
    }
};
exports.createReservation = createReservation;
const cancelReservation = async (reservationId, userId) => {
    try {
        const reservation = await database_1.default.reservation.findUnique({
            where: { id: reservationId },
            include: { reservation_seat: true },
        });
        if (!reservation)
            return (0, responseFormat_1.errorResponse)(404, "Reservation not found", null);
        if (reservation.user_id !== userId) {
            return (0, responseFormat_1.errorResponse)(403, "Unauthorized to cancel this reservation", null);
        }
        const cancelled = await database_1.default.reservation.update({
            where: { id: reservationId },
            data: {
                status: "Cancelled",
                reservation_seat: {
                    updateMany: { where: { cancelled_at: null }, data: { cancelled_at: new Date() } }
                }
            }
        });
        return (0, responseFormat_1.successResponse)(200, "Reservation cancelled successfully", { Reservation: cancelled });
    }
    catch (error) {
        console.error("Cancel reservation error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to cancel reservation", null, error);
    }
};
exports.cancelReservation = cancelReservation;
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
