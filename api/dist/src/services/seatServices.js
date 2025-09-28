"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservation = exports.getSeatReportForScreen = exports.checkSeatAvailability = exports.updateSeat = exports.listSeatsForScreen = exports.generateSeatForScreen = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const generateSeatForScreen = async (auditoriumId, seatLayout) => {
    try {
        const auditorium = await database_1.default.auditorium.findUnique({ where: { id: auditoriumId } });
        if (!auditorium) {
            return (0, responseFormat_1.errorResponse)(404, "Auditorium not found", null);
        }
        const expectedCapacity = seatLayout.rows * seatLayout.columns;
        if (expectedCapacity !== auditorium.capacity) {
            return (0, responseFormat_1.errorResponse)(400, `Seat layout mismatch: rows * columns = ${expectedCapacity}, but auditorium capacity = ${auditorium.capacity}`, null);
        }
        if (seatLayout.vipRows) {
            const invalidRows = seatLayout.vipRows.filter((row) => row < 1 || row > seatLayout.rows);
            if (invalidRows.length > 0) {
                return (0, responseFormat_1.errorResponse)(400, `Invalid VIP row(s): ${invalidRows.join(", ")}. Row values must be between 1 and ${seatLayout.rows}`, null);
            }
        }
        const existingSeats = await database_1.default.seat.findMany({ where: { screen_id: auditoriumId } });
        if (existingSeats.length > 0) {
            return (0, responseFormat_1.errorResponse)(400, "Seats already generated for this auditorium", null);
        }
        const seatsData = [];
        for (let row = 1; row < seatLayout.rows; row++) {
            for (let number = 1; number <= seatLayout.columns; number++) {
                const isVip = seatLayout.vipRows?.includes(row);
                seatsData.push({
                    screen_id: auditoriumId,
                    row, number,
                    type: isVip ? client_1.Type.Vip : client_1.Type.Regular,
                    price: isVip ? 5000 : 3000,
                });
            }
        }
        await database_1.default.seat.createMany({ data: seatsData });
        return (0, responseFormat_1.successResponse)(201, "Seats generated successfully", { totalSeats: seatsData.length, vipRows: seatLayout.vipRows ?? [] });
    }
    catch (error) {
        console.error("Generate seats error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to generate seats", null, error);
    }
};
exports.generateSeatForScreen = generateSeatForScreen;
const listSeatsForScreen = async (auditoriumId) => {
    try {
        const seats = await database_1.default.seat.findMany({
            where: { screen_id: auditoriumId },
            orderBy: [{ row: 'asc' }, { number: "asc" }]
        });
        if (!seats || seats.length === 0) {
            return (0, responseFormat_1.errorResponse)(404, "No seats found for this auditorium", null);
        }
        return (0, responseFormat_1.successResponse)(200, "Seats fetched successfully", { Seats: seats });
    }
    catch (error) {
        console.error("List seats error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to fetch seats", null, error);
    }
};
exports.listSeatsForScreen = listSeatsForScreen;
const updateSeat = async (seatId, updates) => {
    try {
        const seat = await database_1.default.seat.findUnique({ where: { id: seatId } });
        if (!seat)
            return (0, responseFormat_1.errorResponse)(404, "Seat not found", null);
        const updated = await database_1.default.seat.update({
            where: { id: seatId },
            data: { ...updates },
        });
        return (0, responseFormat_1.successResponse)(200, "Seat updated successfully", { Seat: updated });
    }
    catch (error) {
        console.error("Update seat error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to update seat", null, error);
    }
};
exports.updateSeat = updateSeat;
const checkSeatAvailability = async (seatId) => {
    try {
        const seat = await database_1.default.seat.findUnique({
            where: { id: seatId },
            include: { reservation_seat: true },
        });
        if (!seat)
            return (0, responseFormat_1.errorResponse)(404, "Seat not found", null);
        const isReserved = seat.reservation_seat.some((res) => res.cancelled_at === null);
        return (0, responseFormat_1.successResponse)(200, "Seat availability checked", { available: !isReserved, seat });
    }
    catch (error) {
        console.error("Check seat availability error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to check seat availability", null, error);
    }
};
exports.checkSeatAvailability = checkSeatAvailability;
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
const getSeatReportForScreen = async (screenId) => {
    try {
        const totalSeats = await database_1.default.seat.count({ where: { screen_id: screenId } });
        const vipSeats = await database_1.default.seat.count({ where: { screen_id: screenId, type: client_1.Type.Vip } });
        const reservedSeats = await database_1.default.reservationSeat.count({
            where: { seat: { screen_id: screenId }, cancelled_at: null },
        });
        return (0, responseFormat_1.successResponse)(200, "Seat report generated", {
            totalSeats,
            vipSeats,
            regularSeats: totalSeats - vipSeats,
            reservedSeats,
            availableSeats: totalSeats - reservedSeats,
        });
    }
    catch (error) {
        console.error("Seat report error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to generate report", null, error);
    }
};
exports.getSeatReportForScreen = getSeatReportForScreen;
//make reservation then run api
const cancelReservation = async (reservationSeatId) => {
    try {
        const reservationSeat = await database_1.default.reservationSeat.findUnique({
            where: { id: reservationSeatId },
        });
        if (!reservationSeat) {
            return (0, responseFormat_1.errorResponse)(404, "Reservation not found", null);
        }
        if (reservationSeat.cancelled_at) {
            return (0, responseFormat_1.errorResponse)(404, "Reservation already cancelled", null);
        }
        const cancelled = await database_1.default.reservationSeat.update({
            where: { id: reservationSeatId },
            data: { cancelled_at: new Date() }
        });
        return (0, responseFormat_1.successResponse)(200, "Reservation cancelled successfully", { ReservationSeat: cancelled, });
    }
    catch (error) {
        console.error("Cancel reservation error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to cancel reservation", null, error);
    }
};
exports.cancelReservation = cancelReservation;
