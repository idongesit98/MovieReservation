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
exports.getUpcomingShowTimes = exports.getAlternativeShowTimes = exports.getShowTimeAuditorium = exports.getTimeByMovie = exports.deleteShow = exports.updateShow = exports.getShowById = exports.getAllShowsTimes = exports.createShow = void 0;
const showtimeService = __importStar(require("../services/showTimeServices"));
const createShow = async (req, res) => {
    const { movieId, screenId, startTime, endTime, price } = req.body;
    const response = await showtimeService.createShowtime(movieId, screenId, new Date(startTime), new Date(endTime), price);
    res.status(response.code).json(response);
};
exports.createShow = createShow;
const getAllShowsTimes = async (req, res) => {
    const response = await showtimeService.getAllShowTimes(req.query);
    res.status(response.code).json(response);
};
exports.getAllShowsTimes = getAllShowsTimes;
const getShowById = async (req, res) => {
    const showid = req.params.showId;
    const response = await showtimeService.getShowTimeById(showid);
    res.status(response.code).json(response);
};
exports.getShowById = getShowById;
const updateShow = async (req, res) => {
    const showId = req.params.showId;
    const data = req.body;
    const response = await showtimeService.updateShowTime(showId, data);
    res.status(response.code).json(response);
};
exports.updateShow = updateShow;
const deleteShow = async (req, res) => {
    const showId = req.params.id;
    const response = await showtimeService.deleteShowTime(showId);
    res.status(response.code).json(response);
};
exports.deleteShow = deleteShow;
const getTimeByMovie = async (req, res) => {
    const movieId = req.params.id;
    const response = await showtimeService.getShowTimeByMovie(movieId);
    res.status(response.code).json(response);
};
exports.getTimeByMovie = getTimeByMovie;
const getShowTimeAuditorium = async (req, res) => {
    const screenId = req.params.id;
    const response = await showtimeService.getShowTimeByAuditorium(screenId);
    res.status(response.code).json(response);
};
exports.getShowTimeAuditorium = getShowTimeAuditorium;
const getAlternativeShowTimes = async (req, res) => {
    const showId = req.params.id;
    const response = await showtimeService.getAlternativeShowTimes(showId);
    res.status(response.code).json(response);
};
exports.getAlternativeShowTimes = getAlternativeShowTimes;
const getUpcomingShowTimes = async (_req, res) => {
    const response = await showtimeService.getUpcomingShowTimes();
    res.status(response.code).json(response);
};
exports.getUpcomingShowTimes = getUpcomingShowTimes;
