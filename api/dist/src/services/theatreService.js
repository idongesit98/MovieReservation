"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTheatre = exports.updateTheatre = exports.getAllTheatres = exports.singleTheatre = exports.createTheatre = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const createTheatre = async (theatre_name, location, contact_info) => {
    try {
        const existing = await database_1.default.theatre.findUnique({ where: { theatre_name } });
        if (existing) {
            return (0, responseFormat_1.errorResponse)(400, "Theatre already exists", null);
        }
        const newTheatre = await database_1.default.theatre.create({
            data: {
                theatre_name: theatre_name,
                location: location,
                contact_info: contact_info
            }
        });
        return (0, responseFormat_1.successResponse)(201, "Theatre created succcessfully", { Theatre: newTheatre });
    }
    catch (error) {
        console.error("Create theatre Error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to create theatre", null, error);
    }
};
exports.createTheatre = createTheatre;
const singleTheatre = async (theatreId) => {
    try {
        const single = await database_1.default.theatre.findUnique({
            where: { id: theatreId },
            include: {
                auditorium: true
            }
        });
        if (!single) {
            return (0, responseFormat_1.errorResponse)(404, "Theatre not found,check if ID is correct", null);
        }
        return (0, responseFormat_1.successResponse)(200, "Theatre found", { Theatre: single });
    }
    catch (error) {
        console.error("Single theatre Error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to find single theatre", null, error);
    }
};
exports.singleTheatre = singleTheatre;
const getAllTheatres = async () => {
    try {
        const all = await database_1.default.theatre.findMany({
            include: {
                auditorium: true
            },
            orderBy: { created_at: "desc" }
        });
        if (all.length === 0) {
            return (0, responseFormat_1.errorResponse)(404, "No theatre found", null);
        }
        return (0, responseFormat_1.successResponse)(200, "Theatre found", { Theatre: { all } });
    }
    catch (error) {
        console.error("All theatre error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to get theatre", null, error);
    }
};
exports.getAllTheatres = getAllTheatres;
const updateTheatre = async (theatreId, theatre_name, location, contactInfo) => {
    try {
        const allExisting = await database_1.default.theatre.findUnique({ where: { id: theatreId } });
        if (!allExisting) {
            return (0, responseFormat_1.errorResponse)(404, "Couldn't find theatre", null);
        }
        const updatedTheatre = await database_1.default.theatre.update({
            where: { id: theatreId },
            data: {
                theatre_name: theatre_name,
                location: location,
                contact_info: contactInfo
            }
        });
        return (0, responseFormat_1.successResponse)(200, "Updated successfully", { UpdateTheatre: updatedTheatre });
    }
    catch (error) {
        console.error("Updated theatre error", error);
        return (0, responseFormat_1.errorResponse)(404, "Couldn't update theatre", null, error);
    }
};
exports.updateTheatre = updateTheatre;
const deleteTheatre = async (theatreId) => {
    try {
        const theatre = await database_1.default.theatre.findUnique({ where: { id: theatreId } });
        if (!theatre) {
            return (0, responseFormat_1.errorResponse)(404, "Theatre not found", null);
        }
        await database_1.default.theatre.delete({ where: { id: theatreId } });
        return (0, responseFormat_1.successResponse)(200, "Theatre deleted successfully", { Deleted: theatre });
    }
    catch (error) {
        console.error("Theatre deletion error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to deleted theatre", null, error);
    }
};
exports.deleteTheatre = deleteTheatre;
