"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuditorium = exports.updateAuditorium = exports.adminScreenReports = exports.getAuditoriumAvailabilty = exports.listAuditoriumsByTheatre = exports.createAuditorium = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const createAuditorium = async (theatre_id, name, capacity, seatLayout) => {
    try {
        const theatre = await database_1.default.theatre.findUnique({ where: { id: theatre_id } });
        if (!theatre) {
            return (0, responseFormat_1.errorResponse)(404, "Theatre not found", null);
        }
        const existing = await database_1.default.auditorium.findFirst({ where: { theatre_id, name } });
        if (existing) {
            return (0, responseFormat_1.errorResponse)(400, "Auditorium already exists", null);
        }
        const auditorium = await database_1.default.auditorium.create({
            data: {
                theatre_id,
                name,
                capacity,
                seatLayout
            }
        });
        return (0, responseFormat_1.successResponse)(201, "Auditorium created successfully", { Auditorium: auditorium });
    }
    catch (error) {
        console.error("Creating auditorium error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to create screen", null, error);
    }
};
exports.createAuditorium = createAuditorium;
const listAuditoriumsByTheatre = async (theatreId) => {
    try {
        const auditorium = await database_1.default.auditorium.findMany({
            where: { theatre_id: theatreId },
            include: {
                showtimes: true
            },
        });
        return (0, responseFormat_1.successResponse)(200, "Auditoriums fetched successfully", { Auditorium: auditorium });
    }
    catch (error) {
        console.error("List auditorium error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to fetch auditorium", null, error);
    }
};
exports.listAuditoriumsByTheatre = listAuditoriumsByTheatre;
const getAuditoriumAvailabilty = async (auditoriumId, showtimeId) => {
    try {
        const auditorium = await database_1.default.auditorium.findUnique({
            where: { id: auditoriumId },
            include: {
                seats: {
                    include: {
                        reservation_seat: {
                            include: { reservation: true }
                        },
                    }
                }
            }
        });
        if (!auditorium) {
            return (0, responseFormat_1.errorResponse)(404, "Auditorium not found", null);
        }
        //Filter out reserved seats ---explain this
        const availableSeats = auditorium.seats.filter((seat) => {
            return !seat.reservation_seat.some((rs) => rs.reservation.showtime_id === showtimeId && rs.reservation.status === "Confirmed");
        });
        return (0, responseFormat_1.successResponse)(200, "Auditorium availablity fetched", {
            totalSeats: auditorium.capacity,
            availableSeats: availableSeats.length,
            bookedSeats: auditorium.capacity - availableSeats.length,
            seatDetails: availableSeats
        });
    }
    catch (error) {
        console.error("Auditorium Availability Error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to fetch auditorium availability", null, error);
    }
};
exports.getAuditoriumAvailabilty = getAuditoriumAvailabilty;
const adminScreenReports = async (theatre_id) => {
    try {
        const auditorium = await database_1.default.auditorium.findMany({
            where: theatre_id ? { theatre_id } : {},
            include: {
                showtimes: true,
                seats: {
                    include: {
                        reservation_seat: true
                    }
                }
            }
        });
        const reports = auditorium.map((screen) => {
            const totalShows = screen.showtimes.length;
            const totalSeats = screen.capacity;
            const bookedSeats = screen.seats.filter((s) => s.reservation_seat.length > 0).length;
            const utilizationRate = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;
            return {
                auditoriumId: screen.id,
                name: screen.name,
                theatreId: screen.theatre_id,
                totalSeats,
                bookedSeats,
                utilizationRate: utilizationRate.toFixed(2) + "%",
                totalShows,
            };
        });
        return (0, responseFormat_1.successResponse)(200, "Admin screen reports fetched", { Reports: reports });
    }
    catch (error) {
        console.error("Admin Reports Error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to fetch admin reports", null, error);
    }
};
exports.adminScreenReports = adminScreenReports;
const updateAuditorium = async (auditoriumId, updates) => {
    try {
        const screen = await database_1.default.auditorium.update({
            where: { id: auditoriumId },
            data: updates
        });
        return (0, responseFormat_1.successResponse)(200, "Screen updated successfully", { Auditorium: screen });
    }
    catch (error) {
        console.error("Update auditorium error", error);
        return (0, responseFormat_1.errorResponse)(500, 'Failed to update auditorium', null, error);
    }
};
exports.updateAuditorium = updateAuditorium;
const deleteAuditorium = async (auditoriumId) => {
    try {
        const auditorium = await database_1.default.auditorium.findUnique({ where: { id: auditoriumId } });
        if (!auditorium) {
            return (0, responseFormat_1.errorResponse)(404, "Auditorium not found", null);
        }
        await database_1.default.auditorium.delete({ where: { id: auditoriumId } });
        return (0, responseFormat_1.successResponse)(200, "Auditorium deleted successfully", { Deleted: auditorium });
    }
    catch (error) {
        console.error("Delete Auditorium error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to delete auditorium", null);
    }
};
exports.deleteAuditorium = deleteAuditorium;
