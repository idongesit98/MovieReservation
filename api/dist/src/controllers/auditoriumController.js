"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditoriumUpdate = exports.adminReports = exports.availability = exports.auditoriumByTheatre = exports.addAuditorium = void 0;
const services = __importStar(require("../services/auditoriumServices"));
const addAuditorium = async (req, res) => {
    const { name, capacity, seatLayout } = req.body;
    const { theatreId } = req.params;
    const response = await services.createAuditorium(theatreId, name, capacity, seatLayout);
    res.status(response.code).json(response);
};
exports.addAuditorium = addAuditorium;
const auditoriumByTheatre = async (req, res) => {
    const { theatreId } = req.params;
    const response = await services.listAuditoriumsByTheatre(theatreId);
    res.status(response.code).json(response);
};
exports.auditoriumByTheatre = auditoriumByTheatre;
const availability = async (req, res) => {
    const { auditoriumId, showtimeId } = req.params;
    const response = await services.getAuditoriumAvailabilty(auditoriumId, showtimeId);
    res.status(response.code).json(response);
};
exports.availability = availability;
const adminReports = async (req, res) => {
    const { theatreId } = req.params;
    const response = await services.adminScreenReports(theatreId);
    res.status(response.code).json(response);
};
exports.adminReports = adminReports;
const auditoriumUpdate = async (req, res) => {
    const { auditoriumId } = req.params;
    const { name, capacity, seatLayout } = req.body;
    const response = await services.updateAuditorium(auditoriumId, { name, capacity, seatLayout });
    res.status(response.code).json(response);
};
exports.auditoriumUpdate = auditoriumUpdate;
