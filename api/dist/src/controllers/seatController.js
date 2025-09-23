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
exports.cancel = exports.getReport = exports.seatAvail = exports.update = exports.listSeats = exports.generateSeat = void 0;
const service = __importStar(require("../services/seatServices"));
const generateSeat = async (req, res) => {
    const { auditoriumId } = req.params;
    const seatLayout = req.body;
    const response = await service.generateSeatForScreen(auditoriumId, seatLayout);
    res.status(response.code).json(response);
};
exports.generateSeat = generateSeat;
const listSeats = async (req, res) => {
    const { auditoriumId } = req.params;
    const response = await service.listSeatsForScreen(auditoriumId);
    res.status(response.code).json(response);
};
exports.listSeats = listSeats;
const update = async (req, res) => {
    const { seatId } = req.params;
    const updates = req.body;
    const response = await service.updateSeat(seatId, updates);
    res.status(response.code).json(response);
};
exports.update = update;
const seatAvail = async (req, res) => {
    const { seatId } = req.params;
    const response = await service.checkSeatAvailability(seatId);
    res.status(response.code).json(response);
};
exports.seatAvail = seatAvail;
const getReport = async (req, res) => {
    const { screenId } = req.params;
    const response = await service.getSeatReportForScreen(screenId);
    res.status(response.code).json(response);
};
exports.getReport = getReport;
const cancel = async (req, res) => {
    const { reservationSeatId } = req.params;
    console.log("Reservess", reservationSeatId);
    const response = await service.cancelReservation(reservationSeatId);
    res.status(response.code).json(response);
};
exports.cancel = cancel;
